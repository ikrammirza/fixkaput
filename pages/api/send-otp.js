import redis from "../../lib/redis";
import twilio from "twilio";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Invalid method",
    });
  }

  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: "Request body missing",
    });
  }

  const { phone } = req.body;

  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Invalid phone number",
    });
  }

  // Twilio Client
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  // Crypto-secure OTP generation
  const { randomInt } = await import("crypto");
  const otp = randomInt(100000, 999999).toString();

  const otpKey = `otp:${phone}`;
  const limitKey = `otp_limit:${phone}`;
  const lockKey = `lock:otp:${phone}`;

  const otpExpiry = 300; // 5 minutes
  const rateLimit = 5;

  // Prevent rapid clicks
  const lock = await redis.set(lockKey, "1", "NX", "EX", 5);

  if (!lock) {
    return res.status(429).json({
      success: false,
      message: "Please wait a few seconds before requesting another OTP.",
    });
  }

  try {
    // Rate limit
    const count = await redis.incr(limitKey);

    if (count === 1) {
      await redis.expire(limitKey, 60);
    }

    if (count > rateLimit) {
      return res.status(429).json({
        success: false,
        message: "Too many OTP requests. Please try again after 1 minute.",
      });
    }

    // Store OTP
    await redis.setex(otpKey, otpExpiry, otp);

    // Clear previous failed attempts
    await redis.del(`otp_attempts:${phone}`);
    console.log(
  "TWILIO_MESSAGING_SERVICE_SID:",
  process.env.TWILIO_MESSAGING_SERVICE_SID
);
    // Send SMS via Twilio
    const message = await client.messages.create({
      body: `Your FixKaput OTP is ${otp}. Valid for 5 minutes. Do not share this code with anyone.`,
      to: `+91${phone}`,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    console.log("Twilio Message SID:", message.sid);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("OTP Send Error:", error);

    // Remove OTP if SMS failed
    await redis.del(otpKey);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again.",
    });

  } finally {
    // Release lock
    await redis.del(lockKey);
  }
};

export default handler;