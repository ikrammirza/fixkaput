import connectDb from "../../middleware/mongoose";
import Order from "../../models/Order";
import Technician from "../../models/Technician";
import { getSocket } from "../../lib/socket";

export const config = {
  api: {
    bodyParser: true,
  },
};

async function handler(req, res) {
  await connectDb(); // 👈 Call the DB connection at the start

  const technicianId =
    req.headers["technician-id"] || req.headers["technicianId"];

  const technician = await Technician.findOne({ technicianId });
  if (!technician) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Technician not found" });
  }

  if (req.method === "GET") {
    try {
      const orders = await Order.find({
        $or: [
          { status: "Pending", technicianId: null },
          { technicianId: technician._id },
        ],
      }).sort({ createdAt: -1 });

      return res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ message: "Failed to retrieve orders" });
    }
  } else if (req.method === "PATCH") {
    const { orderId, action } = req.body;

    if (!orderId || !["Accepted", "Rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    try {
      const technician = await Technician.findOne({ technicianId });
      if (!technician) {
        return res.status(401).json({ message: "Unauthorized: Technician not found" });
      }

      let updatedOrder;

      if (action === "Accepted") {
        updatedOrder = await Order.findOneAndUpdate(
          { _id: orderId, status: "Pending", technicianId: null },
          {
            status: "Accepted",
            technicianId: technician._id,
          },
          { new: true }
        );

        if (!updatedOrder) {
          return res.status(409).json({
            message: "This order has already been accepted by another technician.",
          });
        }
      } else {
        updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          { status: "Rejected" },
          { new: true }
        );
      }

      const io = getSocket();
      if (io) {
        io.emit("orderStatusChanged", updatedOrder);
        console.log("🔔 Emitting orderStatusChanged", updatedOrder);
      }

      return res.status(200).json({
        message: `Order status updated to ${action}`,
        order: updatedOrder,
      });
    } catch (error) {
      console.error("Error updating order:", error);
      return res.status(500).json({ message: "Failed to update order" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PATCH"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
