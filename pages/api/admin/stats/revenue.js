import connectDb from "../../../../middleware/mongoose";
import Order from "../../../../models/Order";

const handler = async (req, res) => {
    try {
        await connectDb();

        const result = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amount" }, // ✅ using "amount"
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

export default handler;
