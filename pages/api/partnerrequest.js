import connectDb from "../../middleware/mongoose";
import Order from "../../models/Order";
import Technician from "../../models/Technician";

export default async function handler(req, res) {
  await connectDb(); // Ensure database connection

  if (req.method === "GET") {
    // Get technicianId from headers
    const technicianId = req.headers["technicianId"];

    // Ensure technician is logged in by checking technicianId
    const technician = await Technician.findOne({ technicianId: technicianId });
    if (!technician) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Technician not found" });
    }

    try {
      // Fetch orders with status "Pending" and no technicianId assigned
      const orders = await Order.find({
        $or: [
          { status: "Pending", technicianId: null },
          { technicianId: technicianId }, // Fetch orders assigned to the technician
        ],
      });

      return res.status(200).json(orders); // Return the orders
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ message: "Failed to retrieve orders" });
    }
  } else if (req.method === "PATCH") {
    const { orderId, action } = req.body;
    const technicianId = req.headers["technician-id"];

    // Ensure technician is logged in by checking technicianId
    const technician = await Technician.findOne({ technicianId: technicianId });
    if (!technician) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Technician not found" });
    }

    const validActions = ["Accepted", "Rejected"];

    if (!orderId || !validActions.includes(action)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    try {
      // If the action is "Accepted", assign the technician to the order
      if (action === "Accepted") {
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          {
            status: action,
            technicianId: technicianId, // Assign technician to the order
          },
          { new: true }
        );
        return res.status(200).json({
          message: `Order status updated to ${action}`,
          order: updatedOrder,
        });
      }

      // Handle order rejection (no technicianId update needed)
      if (action === "Rejected") {
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          { status: action },
          { new: true }
        );
        return res.status(200).json({
          message: `Order status updated to ${action}`,
          order: updatedOrder,
        });
      }
    } catch (error) {
      console.error("Error updating order:", error);
      return res.status(500).json({ message: "Failed to update order" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PATCH"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
