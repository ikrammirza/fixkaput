import connectDb from "../../../../middleware/mongoose";
import Order from "../../../../models/Order";

const handler = async (req, res) => {
  try {
    await connectDb();

    const { page = 1, limit = 10, search = "", filter = "" } = req.query;
    const skip = (page - 1) * limit;

    // First, fetch matching technician IDs if search is provided
    let technicianIds = [];
    if (search) {
      const Technician = (await import("../../../../models/Technician")).default;
      const matchedTechnicians = await Technician.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      }).select("_id");
      technicianIds = matchedTechnicians.map((t) => t._id);
    }

    // Base search query
    let query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            ...(technicianIds.length > 0 ? [{ technicianId: { $in: technicianIds } }] : []),
          ],
        }
      : {};

    // Apply filter for pending orders
    if (filter === "pending") {
      query = {
        ...query,
        technicianId: null,
      };
    }

    const orders = await Order.find(query)
      .populate("technicianId", "name phone")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);
    const totalorders = await Order.countDocuments();

    res.status(200).json({
      orders,
      total,
      totalorders,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ Pagination Error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export default handler;

