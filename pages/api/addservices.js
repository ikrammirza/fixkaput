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
    const items = Array.isArray(req.body) ? req.body : [req.body];
    const docs = items.map((s) => ({
      title: s.title,
      desc: s.desc,
      img: s.img,
      category: s.category,
      color: s.color,
      price: s.price,
      size: s.size,
      availableQty: s.availableQty,
      slug: s.slug,
    }));
    await Service.insertMany(docs);

    await redis.del(CACHE_KEY);

    return res.status(200).json({ success: "success" });
  } catch (error) {
    console.error("Add services error:", error);
    return res.status(500).json({ error: "Failed to add services" });
  }
}