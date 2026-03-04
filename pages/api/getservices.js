import Service from "../../models/Service";
import connectDb from "../../middleware/mongoose";
import redis from "../../lib/redis";

const CACHE_KEY = "services:all";
const CACHE_TTL = 600; // 10 minutes

export default async function handler(req, res) {
  await connectDb();

  try {
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      const services = JSON.parse(cached);
      return res.status(200).json({ services });
    }

    const services = await Service.find().lean();
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(services));
    return res.status(200).json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({ error: "Failed to fetch services" });
  }
}
