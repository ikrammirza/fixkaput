import connectDb from "../../middleware/mongoose";
import Order from "../../models/Order";
import { getSocket, initSocket } from "../../lib/socket";

export default async function handler(req, res) {
    console.log("📩 /api/testStatusEmit HIT");

    await connectDb();

    let io = getSocket();

    if (!io) {
        console.warn("⚠️ getSocket() returned undefined");
        if (res?.socket?.server) {
            console.log("🚀 Forcing socket initialization from /api/testStatusEmit...");
            io = initSocket(res.socket.server);
            res.socket.server.io = io;
        } else {
            return res.status(500).json({ message: "Socket server not available" });
        }
    }

    try {
        // Step 1: Find a real pending order with no technician
        const order = await Order.findOne({ status: "Pending", technicianId: null });

        if (!order) {
            return res.status(404).json({ message: "No unassigned pending order found." });
        }

        // Step 2: Simulate technician assignment
        order.status = "Accepted";
        order.technicianId = "672eb13e619c7fa3408b856b"; // 👈 Replace with valid technicianId from your DB
        const updatedOrder = await order.save();

        // Step 3: Emit update
        io.emit("orderStatusChanged", updatedOrder.toObject());
        console.log("✅ Emitted orderStatusChanged:", updatedOrder);

        return res.status(200).json({ message: "Order status updated and emitted", order: updatedOrder });
    } catch (error) {
        console.error("❌ Error in testStatusEmit:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
