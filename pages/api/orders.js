import connectDb from "../../middleware/mongoose";
import Order from "../../models/Order";
import { parse } from "cookie";
import { getSession } from "../../lib/redis";
import User from "../../models/User";

export default async function handler(req, res) {
  await connectDb();

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const rawCookie = req.headers?.cookie || "";
    const cookies = parse(rawCookie);
    const sessionId = cookies.sessionId;

    if (!sessionId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = await getSession(sessionId);
    if (!decoded) {
      return res.status(401).json({ error: "Session expired" });
    }

    const user = await User.findById(decoded._id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(),
    ]);

    return res.status(200).json({
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Failed to retrieve orders" });
  }
}
