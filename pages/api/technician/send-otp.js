import connectDb from "../../../middleware/mongoose";
import twilio from "twilio";
import redis from "../../../lib/redis";
import Technician from "../../../models/Technician";

const handler = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }

    await connectDb();
    const { phone } = req.body;

    if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ success: false, message: "Invalid phone number" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `technician:otp:${phone}`;
    const limitKey = `technician:otp_limit:${phone}`;
    const lockKey = `lock:technician:otp:${phone}`;
    const otpExpiry = 300; // 5 minutes
    const rateLimit = 5;

    try {
        // Lock to prevent fast repeated clicks
        const lock = await redis.set(lockKey, "1", "NX", "EX", 5); // 5 seconds
        if (!lock) {
            return res.status(429).json({
                success: false,
                message: "Too many OTP requests. Please wait a few seconds.",
            });
        }

        // Rate limit (max 5 OTPs per 60 seconds)
        const count = await redis.incr(limitKey);
        if (count === 1) await redis.expire(limitKey, 60);
        if (count > rateLimit) {
            return res.status(429).json({
                success: false,
                message: "Too many OTP requests. Try again after 1 minute.",
            });
        }

        // Store OTP in Redis
        await redis.setex(otpKey, otpExpiry, otp);

        // Send OTP using Twilio
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            body: `Your FixKaput technician OTP is ${otp}`,
            to: `+91${phone}`,
            from: process.env.TWILIO_PHONE_NUMBER,
        });

        // Check if technician already exists
        const existing = await Technician.findOne({ phone });
        const requireAadhar = !existing;

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            requireAadhar,
        });
    } catch (error) {
        console.error("Technician OTP Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP. Please try again later.",
        });
    }
};

export default handler;
