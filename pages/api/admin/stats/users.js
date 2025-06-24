// /pages/api/admin/users.js
import connectDb from "../../../../middleware/mongoose";
import User from "../../../../models/User";


const handler = async (req, res) => {
  try {
    await connectDb();

    const { page = 1, limit = 10, search = "" } = req.query;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);
    const totalusers = await User.countDocuments();   
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

export default handler;
