import connectDb from "../../middleware/mongoose";
import Service from "../../models/Service";
import redis from "../../lib/redis";

const CACHE_KEY = "services:all";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectDb();

  try {
    const updates = Array.isArray(req.body) ? req.body : [req.body];
    for (const item of updates) {
      if (item._id) {
        const { _id, ...rest } = item;
        await Service.findByIdAndUpdate(_id, rest);
      }
    }

    await redis.del(CACHE_KEY);

    return res.status(200).json({ success: "success" });
  } catch (error) {
    console.error("Update services error:", error);
    return res.status(500).json({ error: "Failed to update services" });
  }
}