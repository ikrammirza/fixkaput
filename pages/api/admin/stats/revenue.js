import connectDb from "../../../../middleware/mongoose";
import Order from "../../../../models/Order";
import requireAdmin from "../../../../middleware/requireAdmin";

const handler = async (req, res) => {
  try {
    await connectDb();

    const result = await Order.aggregate([
      { $match: { status: "Completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    const totalRevenue = result[0]?.totalRevenue || 0;
    res.status(200).json({ totalRevenue });
  } catch (error) {
    console.error("❌ Revenue Error:", error);
    res.status(500).json({ error: "Failed to calculate revenue" });
  }
};

export default requireAdmin(handler);
