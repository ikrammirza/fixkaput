import connectDb from "../../../../middleware/mongoose";
import Technician from "../../../../models/Technician";
import Order from "../../../../models/Order";
import requireAdmin from "../../../../middleware/requireAdmin";

const handler = async (req, res) => {
  try {
    await connectDb();

    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;
    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const query = safeSearch
      ? {
          $or: [
            { name: { $regex: safeSearch, $options: "i" } },
            { phone: { $regex: safeSearch, $options: "i" } },
            { aadhar: { $regex: safeSearch, $options: "i" } },
          ],
        }
      : {};

    const [technicians, total, totaltechnicians] = await Promise.all([
      Technician.find(query)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Technician.countDocuments(query),
      Technician.countDocuments(),
    ]);

    const technicianIds = technicians.map((tech) => tech._id);

    const orderCounts = await Order.aggregate([
      {
        $match: {
          technicianId: { $in: technicianIds },
          status: "Accepted",
        },
      },
      {
        $group: {
          _id: "$technicianId",
          count: { $sum: 1 },
        },
      },
    ]);

    const orderCountMap = {};
    orderCounts.forEach((entry) => {
      orderCountMap[entry._id.toString()] = entry.count;
    });

    const enrichedTechnicians = technicians.map((tech) => ({
      ...tech.toObject(),
      acceptedOrderCount: orderCountMap[tech._id.toString()] || 0,
    }));

    res.status(200).json({
      technicians: enrichedTechnicians,
      total,
      totaltechnicians,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("❌ Technician API Error:", err);
    res.status(500).json({ error: "Failed to fetch technicians" });
  }
};

export default requireAdmin(handler);
