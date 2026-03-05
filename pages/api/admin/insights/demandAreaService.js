import connectDb from "../../../../middleware/mongoose";
import Order from "../../../../models/Order";
import redis from "../../../../lib/redis";
import axios from "axios";
import requireAdmin from "../../../../middleware/requireAdmin";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const CACHE_KEY = "admin:demand_insight_v2";
const CACHE_TTL = 3600; // 1 hour

// Runs the MongoDB aggregation — extracted for reuse
const fetchDemandData = () =>
  Order.aggregate([
    {
      $group: {
        _id: { area: "$address.area", service: "$cart.serviceItem.name" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

const generateInsight = async (demand) => {
  const prompt = `You are a business analyst for a home services platform called fixKaput.
Here is the top service booking data grouped by area and service type:

${JSON.stringify(demand, null, 2)}

Respond with a concise 3-4 sentence insight covering:
1. Which area + service combination has the highest demand
2. Any notable patterns across areas
3. One actionable suggestion for targeting underserved or high-demand zones

Be direct and data-driven. Skip any intro phrases like "Sure!" or "Based on the data...".`;

  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,  // lower = more factual, less hallucination
      max_tokens: 200,   // keep insight concise
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10s — don't hang the dashboard
    }
  );

  return res.data.choices?.[0]?.message?.content?.trim() || "No insight generated.";
};

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectDb();

  // ── 1. Serve from Redis cache if available ────────────────────────────────
  try {
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      return res.status(200).json({ ...JSON.parse(cached), fromCache: true });
    }
  } catch (cacheErr) {
    console.warn("⚠️ Redis cache read failed, continuing:", cacheErr.message);
  }

  // ── 2. Fetch demand data from MongoDB ─────────────────────────────────────
  let demand;
  try {
    demand = await fetchDemandData();
  } catch (dbErr) {
    console.error("❌ MongoDB aggregation failed:", dbErr.message);
    return res.status(500).json({ error: "Failed to fetch demand data." });
  }

  // ── 3. Generate AI insight — non-fatal if Groq fails ─────────────────────
  let insight = "";
  try {
    insight = await generateInsight(demand);
  } catch (aiErr) {
    console.error("⚠️ Groq insight failed (non-fatal):", aiErr.response?.data || aiErr.message);
    // Dashboard still works — chart renders, insight section shows fallback UI
  }

  // ── 4. Cache result and respond ───────────────────────────────────────────
  const result = { demand, insight };
  try {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(result));
  } catch (cacheWriteErr) {
    console.warn("⚠️ Redis cache write failed:", cacheWriteErr.message);
  }

  return res.status(200).json(result);
};

export default requireAdmin(handler);