// pages/api/getUserOrders.js

import connectDb from '../../middleware/mongoose';
import jwt from 'jsonwebtoken';
import Order from '../../models/Order';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    await connectDb(); // ✅ directly connect inside the handler

    const { token } = req.body;
    if (!token) return res.status(401).json({ error: 'Token not provided' });

    const user = jwt.verify(token, process.env.JWT_SECRET);
    const orders = await Order.find({ phone: user.phone }).sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (err) {
    console.error("JWT or DB error:", err);
    return res.status(401).json({ error: 'Invalid token or DB error' });
  }
}
