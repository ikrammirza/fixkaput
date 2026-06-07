// import connectDb from "../../../../middleware/mongoose";
// import Order from "../../../../models/Order";
// import redis from "../../../../lib/redis";
// import axios from "axios";
// import requireAdmin from "../../../../middleware/requireAdmin";

// const GROQ_API_KEY = process.env.GROQ_API_KEY;
// const CACHE_KEY = "admin:demand_insight_v3";
// const CACHE_TTL = 3600;

// // ── Fixed aggregation ─────────────────────────────────────────────────────────
// // cart is stored as { "ac-101": { name, price, qty }, ... }
// // $objectToArray converts it to [{ k: "ac-101", v: { name, price, qty } }, ...]
// // then $unwind explodes each item into its own document
// // then we group by area + service name
// const fetchDemandData = () =>
//   Order.aggregate([
//     // Step 1: convert the cart map into an array of { k, v } pairs
//     {
//       $addFields: {
//         cartArray: { $objectToArray: "$cart" },
//       },
//     },
//     // Step 2: explode — one doc per cart item
//     { $unwind: "$cartArray" },
//     // Step 3: group by area + service name, sum quantities
//     {
//       $group: {
//         _id: {
//           area: "$address.area",
//           service: "$cartArray.v.name",
//         },
//         count: { $sum: "$cartArray.v.qty" },
//       },
//     },
//     // Step 4: sort by most booked first
//     { $sort: { count: -1 } },
//     // Step 5: top 20 combos (more data = better chart + insight)
//     { $limit: 20 },
//   ]);

// const generateInsight = async (demand) => {
//   const prompt = `You are a business analyst for a home services platform called fixKaput.
// Here is the top service booking data grouped by area and service type:

// ${JSON.stringify(demand, null, 2)}

// Respond with a concise 3-4 sentence insight covering:
// 1. Which area + service combination has the highest demand
// 2. Any notable patterns across areas
// 3. One actionable suggestion for targeting underserved or high-demand zones

// Be direct and data-driven. Skip any intro phrases like "Sure!" or "Based on the data...".`;

//   const res = await axios.post(
//     "https://api.groq.com/openai/v1/chat/completions",
//     {
//       model: "llama-3.3-70b-versatile",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.4,
//       max_tokens: 200,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${GROQ_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       timeout: 10000,
//     }
//   );

//   return res.data.choices?.[0]?.message?.content?.trim() || "No insight generated.";
// };

// const handler = async (req, res) => {
//   if (req.method !== "GET") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   await connectDb();

//   // ── 1. Serve from Redis cache if available ────────────────────────────────
//   try {
//     const cached = await redis.get(CACHE_KEY);
//     if (cached) {
//       return res.status(200).json({ ...JSON.parse(cached), fromCache: true });
//     }
//   } catch (cacheErr) {
//     console.warn("⚠️ Redis cache read failed, continuing:", cacheErr.message);
//   }

//   // ── 2. Fetch demand data from MongoDB ─────────────────────────────────────
//   let demand;
//   try {
//     demand = await fetchDemandData();
//   } catch (dbErr) {
//     console.error("❌ MongoDB aggregation failed:", dbErr.message);
//     return res.status(500).json({ error: "Failed to fetch demand data." });
//   }

//   // ── 3. Generate AI insight — non-fatal if Groq fails ─────────────────────
//   let insight = "";
//   try {
//     insight = await generateInsight(demand);
//   } catch (aiErr) {
//     console.error("⚠️ Groq insight failed (non-fatal):", aiErr.response?.data || aiErr.message);
//   }

//   // ── 4. Cache result and respond ───────────────────────────────────────────
//   const result = { demand, insight };
//   try {
//     await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(result));
//   } catch (cacheWriteErr) {
//     console.warn("⚠️ Redis cache write failed:", cacheWriteErr.message);
//   }

//   return res.status(200).json(result);
// };

// export default requireAdmin(handler);

import connectDb from "../../../../middleware/mongoose";
import Order from "../../../../models/Order";
import redis from "../../../../lib/redis";
import axios from "axios";
import requireAdmin from "../../../../middleware/requireAdmin";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const CACHE_KEY = "admin:demand_insight_v4";
const CACHE_TTL = 3600;

// Known valid service names from fixKaput catalogue
const VALID_SERVICES = new Set([
  "Cockroach Control", "Termite Treatment", "Bed Bug Treatment", "General Pest Control",
  "Switch & Socket Repair", "Fan & Light Installation", "Wiring & MCB Services", "Appliance Fitting",
  "Furniture Assembly", "Carpentry Repair", "Custom Woodwork", "Furniture Polishing",
  "CCTV Installation", "CCTV Repair", "CCTV Maintenance", "CCTV Relocation",
  "Plumbing Repair", "Plumbing Maintenance", "Install & Uninstall", "Pipe Leak Fix",
  "AC Repair", "AC Service", "AC Installation", "AC Uninstallation",
]);

const fetchDemandData = () =>
  Order.aggregate([
    { $addFields: { cartArray: { $objectToArray: "$cart" } } },
    { $unwind: "$cartArray" },
    {
      $match: {
        "cartArray.v.name": { $in: Array.from(VALID_SERVICES) },
        "address.area": { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: {
          area: "$address.area",
          service: "$cartArray.v.name",
        },
        count: { $sum: "$cartArray.v.qty" },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 20 },
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
      temperature: 0.4,
      max_tokens: 200,
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    }
  );

  return res.data.choices?.[0]?.message?.content?.trim() || "No insight generated.";
};

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectDb();

  try {
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      return res.status(200).json({ ...JSON.parse(cached), fromCache: true });
    }
  } catch (cacheErr) {
    console.warn("⚠️ Redis cache read failed:", cacheErr.message);
  }

  let demand;
  try {
    demand = await fetchDemandData();
  } catch (dbErr) {
    console.error("❌ MongoDB aggregation failed:", dbErr.message);
    return res.status(500).json({ error: "Failed to fetch demand data." });
  }

  let insight = "";
  try {
    insight = await generateInsight(demand);
  } catch (aiErr) {
    console.error("⚠️ Groq insight failed:", aiErr.response?.data || aiErr.message);
  }

  const result = { demand, insight };
  try {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(result));
  } catch (cacheWriteErr) {
    console.warn("⚠️ Redis cache write failed:", cacheWriteErr.message);
  }

  return res.status(200).json(result);
};

export default requireAdmin(handler);