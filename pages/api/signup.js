import User from "../../models/User";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) return res.status(409).json({ error: "User already exists" });

    await new User({ name, email, phone }).save();
    return res.status(200).json({ success: true, message: "Signup successful" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export default connectDb(handler);
