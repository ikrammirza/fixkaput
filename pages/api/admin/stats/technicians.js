import connectDb from "../../../../middleware/mongoose";
import Technician from "../../../../models/Technician";
import Order from "../../../../models/Order";

const handler = async (req, res) => {
  try {
    await connectDb();

    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { aadhar: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const technicians = await Technician.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const technicianIds = technicians.map((tech) => tech._id);

    // Fetch accepted order counts for these technicians
    const orderCounts = await Order.aggregate([
      {
        $match: {
          technicianId: { $in: technicianIds },
          status: "Accepted", // Make sure this matches your actual accepted status
        },
      },
      {
        $group: {
          _id: "$technicianId",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert to a map for easy lookup
    const orderCountMap = {};
    orderCounts.forEach((entry) => {
      orderCountMap[entry._id.toString()] = entry.count;
    });

    // Attach count to each technician
    const enrichedTechnicians = technicians.map((tech) => ({
      ...tech.toObject(),
      acceptedOrderCount: orderCountMap[tech._id.toString()] || 0,
    }));

    const total = await Technician.countDocuments(query);
    const totaltechnicians = await Technician.countDocuments();
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

export default handler;
