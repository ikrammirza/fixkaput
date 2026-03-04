import crypto from "crypto";
import nodemailer from "nodemailer";
import connectDb from "../../middleware/mongoose";
import Forgot from "../../models/Forgot";
import User from "../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectDb();

  const { sendMail, email, token, password } = req.body;

  if (sendMail) {
    // Send password reset email
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        // Return success to avoid user enumeration
        return res.status(200).json({ success: true, message: "If that email exists, a reset link has been sent." });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await Forgot.findOneAndDelete({ email });
      const forgot = new Forgot({
        userid: user._id.toString(),
        email,
        token: resetToken,
        expiresAt,
      });
      await forgot.save();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      const resetLink = `${process.env.NEXT_PUBLIC_HOST}/forgot?token=${resetToken}`;
      const emailContent = `
        <p>We received a request to reset your password on fixkaput.com.</p>
        <p>To reset your password, please click the link below:</p>
        <p><a href="${resetLink}">Click here to reset your password</a></p>
        <p>This link expires in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `;

      await transporter.sendMail({
        from: `"FixKaput" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Password Reset Request",
        html: emailContent,
      });

      return res.status(200).json({ success: true, message: "If that email exists, a reset link has been sent." });
    } catch (error) {
      console.error("Error sending reset email:", error);
      return res.status(500).json({ error: "Failed to send email" });
    }
  } else {
    // Handle password update
    if (!token || !password) {
      return res.status(400).json({ error: "Token and password are required" });
    }

    try {
      const forgotRecord = await Forgot.findOne({ token });
      if (!forgotRecord) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }

      if (new Date() > forgotRecord.expiresAt) {
        await Forgot.findByIdAndDelete(forgotRecord._id);
        return res.status(400).json({ error: "Reset token has expired" });
      }

      const user = await User.findById(forgotRecord.userid);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const bcrypt = (await import("bcryptjs")).default;
      user.password = await bcrypt.hash(password, 12);
      await user.save();

      await Forgot.findByIdAndDelete(forgotRecord._id);

      return res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating password:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
