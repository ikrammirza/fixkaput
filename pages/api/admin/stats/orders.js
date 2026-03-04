import connectDb from "../../../../middleware/mongoose";
import Order from "../../../../models/Order";
import requireAdmin from "../../../../middleware/requireAdmin";

const handler = async (req, res) => {
  try {
    await connectDb();

    const { page = 1, limit = 10, search = "", filter = "" } = req.query;
    const skip = (page - 1) * limit;

    // Escape regex special chars to prevent ReDoS
    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    let technicianIds = [];
    if (safeSearch) {
      const Technician = (await import("../../../../models/Technician")).default;
      const matchedTechnicians = await Technician.find({
        $or: [
          { name: { $regex: safeSearch, $options: "i" } },
          { phone: { $regex: safeSearch, $options: "i" } },
        ],
      }).select("_id");
      technicianIds = matchedTechnicians.map((t) => t._id);
    }

    let query = safeSearch
      ? {
          $or: [
            { name: { $regex: safeSearch, $options: "i" } },
            { phone: { $regex: safeSearch, $options: "i" } },
            ...(technicianIds.length > 0 ? [{ technicianId: { $in: technicianIds } }] : []),
          ],
        }
      : {};

    if (filter === "pending") {
      query = { ...query, technicianId: null };
    }

    const [orders, total, totalorders] = await Promise.all([
      Order.find(query)
        .populate("technicianId", "name phone")
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Order.countDocuments(query),
      Order.countDocuments(),
    ]);

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

export default requireAdmin(handler);
