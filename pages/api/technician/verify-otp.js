import redis from "../../../lib/redis";
import connectDb from "../../../middleware/mongoose";
import Technician from "../../../models/Technician";
import { v4 as uuidv4 } from "uuid";
import { serialize } from "cookie";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await connectDb();

  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: "Missing phone or OTP" });
  }

  const storedOtp = await redis.get(`technician:otp:${phone}`);

  // Explicitly check for null/missing OTP before comparing
  if (!storedOtp) {
    return res.status(401).json({ message: "OTP expired or not found. Please resend." });
  }

  // Timing-safe comparison
  const storedBuf = Buffer.from(storedOtp);
  const providedBuf = Buffer.from(String(otp));
  const isMatch =
    storedBuf.length === providedBuf.length &&
    crypto.timingSafeEqual(storedBuf, providedBuf);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  // Delete OTP after successful verification
  await redis.del(`technician:otp:${phone}`);

  const technician = await Technician.findOne({ phone });
  if (!technician) {
    return res.status(404).json({ message: "Technician not registered" });
  }

  const sessionId = uuidv4();
  await redis.set(
    `session:${sessionId}`,
    JSON.stringify({ technicianId: technician.technicianId }),
    "EX",
    7 * 24 * 60 * 60 // 7 days
  );

  res.setHeader(
    "Set-Cookie",
    serialize("technicianSessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    })
  );

  return res.status(200).json({ message: "Logged in", technicianId: technician.technicianId });
}
