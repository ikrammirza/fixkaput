import connectDb from "../../middleware/mongoose"; // Ensure you have a dbConnect function for MongoDB connection
import Order from "../../models/Order"; // Import the Order schema

export default async function handler(req, res) {
  await connectDb(); // Connect to MongoDB

  if (req.method === "GET") {
    try {
      const orders = await Order.find(); // Fetch all orders from the collection
      return res.status(200).json(orders); // Send orders as a JSON response
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ message: "Failed to retrieve orders" });
    }
  } else {
    // If method is not GET, return 405 (Method Not Allowed)
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
