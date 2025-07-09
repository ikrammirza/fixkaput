// pages/api/verify-otp.js
import jwt from "jsonwebtoken";
import redis from "../../lib/redis.js";
import connectDb from "../../middleware/mongoose";
import User from "../../models/User";

const handler = async (req, res) => {
  console.log("📥 Incoming request to /api/verify-otp");

  if (req.method !== "POST") {
    console.log("❌ Invalid request method");
    return res.status(405).json({ success: false, message: "Invalid method" });
  }
  await connectDb();
  const { phone, otp } = req.body;
  console.log("📞 Phone:", phone, "🔢 OTP:", otp);

  if (!phone || !otp) {
    console.log("⚠️ Missing phone or OTP");
    return res.status(400).json({ success: false, message: "Phone and OTP are required" });
  }

  try {
    const redisKey = `otp:${phone}`;
    const savedOtp = await redis.get(redisKey);

    if (!savedOtp) {
      console.log("❌ OTP not found or expired for phone:", phone);
      return res.status(400).json({ success: false, message: "OTP expired or not found. Please resend." });
    }

    if (savedOtp !== otp) {
      console.log("❌ OTP mismatch. Provided:", otp, "Expected:", savedOtp);
      return res.status(400).json({ success: false, message: "Incorrect OTP" });
    }

    console.log("✅ OTP verified");

    // Delete OTP from Redis after successful use
    await redis.del(redisKey);
    console.log("🧹 OTP deleted from Redis");

    // Check if user already exists
    let user = await User.findOne({ phone });
    if (!user) {
      console.log("🆕 Creating new user for phone:", phone);
      user = new User({ phone });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ phone, _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("🔐 JWT token created");

    // Create a session ID key
    const sessionId = `session:${user._id}`;

    // Store token in Redis with TTL (2 days = 172800 seconds)
    await redis.setex(sessionId, 172800, token);

    // Set HttpOnly cookie with session ID
    res.setHeader("Set-Cookie", `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=172800; SameSite=Lax; Secure`);

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("🔥 Error in verify-otp handler:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default (handler);
