// /pages/api/partnerrequest.js

import connectDb from "../../middleware/mongoose";
import Order from "../../models/Order";
import Technician from "../../models/Technician";
import { getSocket } from "../../lib/socket";
import redis from "../../lib/redis";
import * as cookie from "cookie";

export const config = {
  api: { bodyParser: true },
};

async function handler(req, res) {
  console.log("📨 API /api/partnerrequest got called")
  await connectDb();

  // Parse cookies
  let cookies = {};
  try {
    const rawCookie = String(req.headers?.cookie || "");
    cookies = cookie.parse(rawCookie);
  } catch (err) {
    console.error("❌ Failed to parse cookies:", err);
  }

  const sessionId = cookies["technicianSessionId"];
  if (!sessionId) {
    return res.status(401).json({ message: "Unauthorized: No technician session ID found" });
  }
  // Fetch session from Redis
  const sessionData = await redis.get(`session:${sessionId}`);
  if (!sessionData) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired session" });
  }

  const session = JSON.parse(sessionData);
  const technicianId = session.technicianId;

  if (!technicianId) {
    return res.status(401).json({ message: "Unauthorized: Technician ID missing in session" });
  }

  const technician = await Technician.findOne({ technicianId });
  if (!technician) {
    return res.status(401).json({ message: "Unauthorized: Technician not found" });
  }

  if (req.method === "GET") {
    try {
      const [pendingOrders, acceptedOrders, completedOrders] = await Promise.all([
        Order.find({ status: "Pending", technicianId: null }).sort({ createdAt: -1 }),
        Order.find({ status: "Accepted", technicianId: technician._id }).sort({ createdAt: -1 }),
        Order.find({ status: "Completed", technicianId: technician._id }).sort({ createdAt: -1 }),
      ]);

      return res.status(200).json({
        pending: pendingOrders,
        accepted: acceptedOrders,
        completed: completedOrders,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ message: "Failed to retrieve orders" });
    }
  }

  if (req.method === "PATCH") {
    const { orderId, action } = req.body;
    if (!orderId || !["Accepted", "Rejected", "Completed"].includes(action)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    try {
      let updatedOrder;

      if (action === "Accepted") {
        updatedOrder = await Order.findOneAndUpdate(
          { _id: orderId, status: "Pending", technicianId: null },
          { status: "Accepted", technicianId: technician._id },
          { new: true }
        );

        if (!updatedOrder) {
          return res.status(409).json({ message: "Order already accepted by another technician." });
        }
      } else if (action === "Rejected") {
        updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          { status: "Rejected" },
          { new: true }
        );
      } else if (action === "Completed") {
        updatedOrder = await Order.findOneAndUpdate(
          { _id: orderId, technicianId: technician._id, status: "Accepted" },
          { status: "Completed" },
          { new: true }
        );

        if (!updatedOrder) {
          return res.status(403).json({ message: "Only your accepted orders can be marked completed." });
        }
      }

      const io = getSocket();
      if (io && updatedOrder) {
        io.emit("orderStatusChanged", updatedOrder);
        console.log("🔔 Emitting orderStatusChanged", updatedOrder);
      }

      return res.status(200).json({ message: `Order ${action} successfully`, order: updatedOrder });
    } catch (error) {
      console.error("Error updating order:", error);
      return res.status(500).json({ message: "Failed to update order" });
    }
  }

  res.setHeader("Allow", ["GET", "PATCH"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default handler;
