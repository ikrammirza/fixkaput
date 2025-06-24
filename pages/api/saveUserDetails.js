// pages/api/save-user-details.js
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import verifyToken from '@/lib/middleware/verifyToken';

async function handler(req, res) {
  await connectDB();
  const { name, address } = req.body;
  const phone = req.user.phone;

  const user = await User.findOneAndUpdate(
    { phone },
    { name, address },
    { new: true }
  );

  res.status(200).json({ success: true, user });
}

export default verifyToken(handler);
