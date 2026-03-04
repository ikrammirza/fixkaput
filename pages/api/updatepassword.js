import User from "../../models/User";
import jwt from "jsonwebtoken";
import connectDb from "../../middleware/mongoose";
import cryptoJs from "crypto-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectDb();

  try {
    const { token, currentPassword, newPassword } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Token not provided" });
    }

    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: verifiedUser.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const bytes = cryptoJs.AES.decrypt(user.password, process.env.AES_SECRET);
    const decryptedPass = bytes.toString(cryptoJs.enc.Utf8);

    if (decryptedPass !== currentPassword) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    const encryptedNewPassword = cryptoJs.AES.encrypt(
      newPassword,
      process.env.AES_SECRET
    ).toString();

    user.password = encryptedNewPassword;
    await user.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
