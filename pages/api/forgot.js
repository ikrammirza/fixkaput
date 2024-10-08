import Forgot from "../../models/Forgot";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import cryptoJs from "crypto-js";
// Import nodemailer or any mail sending package

export default async function handler(req, res) {
  // Generate a token (should be replaced with real logic for generating tokens)
  const token = `hndjahnfnkgvjhwkmfgk`;

  if (req.body.sendMail) {
    // Handle sending the password reset email
    const forgot = new Forgot({
      email: req.body.email,
      token: token,
    });

    // Email content
    const emailContent = `
      We have sent you this email in response to your request to reset your password on fixkaput.com.    
      To reset your password, please follow the link below:
      <a href="https://fixkaput.com/forgot?token=${token}">Click here to reset your password</a>
      <br/><br/>
      We recommend that you keep your password secure and not share it with anyone. If you feel your password has been compromised, you can change it by going to your My Account Page and change your password.
      <br/><br/>
    `;

    // Set up Nodemailer or any email service here
   
    try {
      await transporter.sendMail({
        from: "noreply@fixkaput.com",
        to: req.body.email,
        subject: "Password Reset Request",
        html: emailContent,
      });
      res
        .status(200)
        .json({ success: true, message: "Password reset email sent" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  } else if (req.method === "POST") {
    // Handle password update
    try {
      const { token, password } = req.body;

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

      // Encrypt new password
      const encryptedNewPassword = cryptoJs.AES.encrypt(
        password,
        process.env.AES_SECRET
      ).toString();

      user.password = encryptedNewPassword;
      await user.save();

      res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(400).json({ error: "Method not allowed" });
  }
}
