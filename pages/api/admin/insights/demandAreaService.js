import connectDb from "../../../../middleware/mongoose";
import Order from "../../../../models/Order";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const handler = async (req, res) => {
  await connectDb();

  try {
    const demand = await Order.aggregate([
      {
        $group: {
          _id: { area: "$address.area", service: "$cart.serviceItem.name"},
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const insightPrompt = `Here is service booking data by area:\n\n${JSON.stringify(
      demand,
      null,
      2
    )}\n\nGive a short insight on which areas and services are in high demand. Give suggestions for targeting those areas.`;

    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: insightPrompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const insight = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "No insight generated.";

    res.status(200).json({ demand, insight });
  } catch (err) {
    console.error("Insight generation error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate insights." });
  }
};

export default handler;
