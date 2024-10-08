import User from "../../models/User";
import jwt from "jsonwebtoken";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { token, address, pincode, phone, name } = req.body;
      if (!token) {
        throw new Error("Token not provided");
      }

      const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
      const dbuser = await User.findOneAndUpdate(
        { email: verifiedUser.email },
        { address, pincode, phone, name },
        { new: true } // Return the updated document
      );

      if (!dbuser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error verifying token or fetching user:", error);
      res.status(401).json({ error: "Invalid token or user not found" });
    }
  } else {
    res.status(400).json({ error: "Method not allowed" });
  }
};

export default connectDb(handler);