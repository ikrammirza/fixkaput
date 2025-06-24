import connectDb from "../../middleware/mongoose";
import twilio from "twilio";
import redis from "../../lib/redis";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Invalid method" });
  }

  // ✅ Connect to MongoDB
  await connectDb();

  const { phone } = req.body;

  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ success: false, message: "Invalid phone number" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpKey = `otp:${phone}`;
  const limitKey = `otp_limit:${phone}`;
  const lockKey = `lock:otp:${phone}`;
  const otpExpiry = 300; // 5 minutes
  const rateLimit = 5;

  try {
    // 🔐 Redis Lock: Prevent multiple fast clicks
    const lock = await redis.set(lockKey, "1", "NX", "EX", 5); // 5 seconds lock
    if (!lock) {
      return res.status(429).json({
        success: false,
        message: "Too many OTP requests. Please wait a few seconds.",
      });
    }

    // ⛔️ Rate limiting (max 5 OTPs per minute)
    const count = await redis.incr(limitKey);
    if (count === 1) await redis.expire(limitKey, 60); // Set expiry only once
    if (count > rateLimit) {
      return res.status(429).json({
        success: false,
        message: "Too many OTP requests. Please try again after 1 minute.",
      });
    }

    // ✅ Store OTP
    await redis.setex(otpKey, otpExpiry, otp);

    // ✅ Send via Twilio
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: `Your OTP for login is ${otp}`,
      to: `+91${phone}`,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP Error:", error);
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

export default handler;
