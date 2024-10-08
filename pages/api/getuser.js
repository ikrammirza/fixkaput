import User from "../../models/User";
import jwt from "jsonwebtoken";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { token } = req.body;
      if (!token) {
        throw new Error("Token not provided");
      }

      const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
      const dbuser = await User.findOne({ email: verifiedUser.email });

      if (!dbuser) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      const { name, email, address, pincode, phone } = dbuser;

      res
        .status(200)
        .json({ success: true, name, email, address, pincode, phone });
    } catch (error) {
      console.error("Error verifying token or fetching user:", error.message);
      res
        .status(401)
        .json({ success: false, error: "Invalid token or user not found" });
    }
  } else {
    res.status(400).json({ success: false, error: "Method not allowed" });
  }
};

export default connectDb(handler);
