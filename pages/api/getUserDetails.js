import connectDb from "../../middleware/mongoose";
import User from '../../models/User';
import verifyToken from '../../middleware/verifyToken';

async function handler(req, res) {
  await connectDb();
  const phone = req.user.phone;

  const user = await User.findOne({ phone });
  if (!user) return res.status(404).json({ success: false });

  res.status(200).json({ success: true, user });
}

export default verifyToken(handler);
