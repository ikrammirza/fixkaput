import jwt from "jsonwebtoken";
import redis from "../../lib/redis.js";
import connectDb from "../../middleware/mongoose";
import User from "../../models/User";
import crypto from "crypto";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Invalid method" });
  }

  if (!req.body) {
    return res.status(400).json({ success: false, message: "Request body missing" });
  }

  const phone = req.body.phone?.toString().trim();
  const otp   = req.body.otp?.toString().trim();

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: "Phone and OTP are required" });
  }

  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ success: false, message: "Invalid phone number" });
  }

  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ success: false, message: "OTP must be 6 digits" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not set");
    return res.status(500).json({ success: false, message: "Server configuration error" });
  }

  await connectDb();

  try {
    const redisKey      = `otp:${phone}`;
    const attemptsKey   = `otp_attempts:${phone}`;
    const maxAttempts   = 5;

    // --- Brute-force protection ---
    const attempts = await redis.incr(attemptsKey);
    if (attempts === 1) {
      // Expire attempts counter together with the OTP (5 min)
      await redis.expire(attemptsKey, 300);
    }

    if (attempts > maxAttempts) {
      // Invalidate the OTP so attacker can't keep trying after requesting a new one
      await redis.del(redisKey);
      await redis.del(attemptsKey);
      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    // --- Fetch stored OTP ---
    const savedOtp = await redis.get(redisKey);

    if (!savedOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found. Please request a new one.",
      });
    }

    // --- Timing-safe comparison (correctly guarded against length mismatch crash) ---
    const savedBuf    = Buffer.from(savedOtp);
    const providedBuf = Buffer.from(otp);

    let isMatch = false;
    if (savedBuf.length === providedBuf.length) {
      isMatch = crypto.timingSafeEqual(savedBuf, providedBuf);
    }

    if (!isMatch) {
      const remaining = maxAttempts - attempts;
      return res.status(400).json({
        success: false,
        message: remaining > 0
          ? `Incorrect OTP. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
          : "Incorrect OTP.",
      });
    }

    // --- OTP is valid: clean up Redis ---
    await redis.del(redisKey);
    await redis.del(attemptsKey);

    // --- Find or create user ---
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone });
      await user.save();
    }

    // --- Create JWT ---
    const token = jwt.sign(
      { phone, _id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // --- Store session in Redis with an opaque random session ID ---
    // (avoids exposing MongoDB _id in the cookie)
    const sessionId      = crypto.randomBytes(32).toString("hex");
    const sessionTTL     = 7 * 24 * 60 * 60; // 7 days in seconds
    await redis.setex(`session:${sessionId}`, sessionTTL, token);

    // --- Set secure cookie ---
    const isProd = process.env.NODE_ENV === "production";
    res.setHeader(
      "Set-Cookie",
      `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=${sessionTTL}; SameSite=Lax${isProd ? "; Secure" : ""}`
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        phone: user.phone,
        // add other safe fields here (name, email, etc.) — never return passwords
      },
    });

  } catch (error) {
    console.error("verify-otp error:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

export default handler;