// pages/api/getUserOrders.js

import connectDb from '../../middleware/mongoose';
import jwt from 'jsonwebtoken';
import Order from '../../models/Order';
import redis from '../../lib/redis';
import { parse } from 'cookie';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    await connectDb();

    // 1. Get sessionId from cookie
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ error: 'No cookie found' });
    }

    const cookies = parse(cookieHeader);
    const sessionId = cookies.sessionId;

    if (!sessionId) {
      return res.status(401).json({ error: 'Session ID not provided' });
    }

    // 2. Retrieve JWT token from Redis using sessionId
    const token = await redis.get(sessionId);

    if (!token) {
      return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    }

    // 3. Verify the JWT token
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Fetch orders from DB
    const orders = await Order.find({ phone: user.phone }).sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (err) {
    console.error("❌ Error verifying session or fetching orders:", err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
