import connectDb from "../../middleware/mongoose";
import User from "../../models/User";

export default async function handler(req, res) {
  await connectDb();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, name, address } = req.body;

  if (!phone || !name || !address) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { area, line1, city, pincode } = address;

  try {
    const user = await User.findOneAndUpdate(
      { phone }, // Search by phone
      {
        $set: {
          name,
          "address.area": area,
          "address.line1": line1,
          "address.city": city,
          "address.pincode": pincode,
        },
      },
      {
        new: true,     // Return the updated document
        upsert: true,  // Create if not found
        setDefaultsOnInsert: true, // Use defaults from schema if creating
      }
    );

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Update/Create failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
