import User from "../../models/User";
import jwt from "jsonwebtoken";
import connectDb from "../../middleware/mongoose";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  await connectDb();

  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: "Token not provided" });
    }

    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    const dbuser = await User.findOne({ email: verifiedUser.email });

    if (!dbuser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const { name, email, phone } = dbuser;
    return res.status(200).json({ success: true, name, email, phone });
  } catch (error) {
    console.error("Error verifying token or fetching user:", error.message);
    return res.status(401).json({ success: false, error: "Invalid token or user not found" });
  }
}
