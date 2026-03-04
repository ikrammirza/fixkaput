import connectDb from "../../../../middleware/mongoose";
import User from "../../../../models/User";
import requireAdmin from "../../../../middleware/requireAdmin";

const handler = async (req, res) => {
  try {
    await connectDb();

    const { page = 1, limit = 10, search = "" } = req.query;
    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const query = safeSearch
      ? {
          $or: [
            { name: { $regex: safeSearch, $options: "i" } },
            { phone: { $regex: safeSearch, $options: "i" } },
          ],
        }
      : {};

    const [users, total, totalusers] = await Promise.all([
      User.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      User.countDocuments(query),
      User.countDocuments(),
    ]);

    res.status(200).json({
      users,
      total,
      totalusers,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ Pagination Error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export default requireAdmin(handler);
