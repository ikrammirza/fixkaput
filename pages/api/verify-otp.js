import jwt from "jsonwebtoken";
import redis from "../../lib/redis.js";
import connectDb from "../../middleware/mongoose";
import User from "../../models/User";
import crypto from "crypto";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Invalid method" });
  }

  await connectDb();

  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: "Phone and OTP are required" });
  }

  try {
    const redisKey = `otp:${phone}`;
    const savedOtp = await redis.get(redisKey);

    if (!savedOtp) {
      return res.status(400).json({ success: false, message: "OTP expired or not found. Please resend." });
    }

    // Timing-safe comparison
    const savedBuf = Buffer.from(savedOtp);
    const providedBuf = Buffer.from(String(otp));
    const isMatch =
      savedBuf.length === providedBuf.length &&
      crypto.timingSafeEqual(savedBuf, providedBuf);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect OTP" });
    }

    await redis.del(redisKey);

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone });
      await user.save();
    }

    const token = jwt.sign({ phone, _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const sessionId = `session:${user._id}`;
    await redis.setex(sessionId, 172800, token);

    res.setHeader(
      "Set-Cookie",
      `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=172800; SameSite=Lax; Secure`
    );

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in verify-otp handler:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default handler;
