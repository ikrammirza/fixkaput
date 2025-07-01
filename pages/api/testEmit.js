import { getSocket, initSocket } from "../../lib/socket";
import mongoose from "mongoose";
export default function handler(req, res) {
    console.log("📩 /api/testEmit HIT");

    let io = getSocket();

    if (!io) {
        console.warn("⚠️ getSocket() returned undefined");
        if (res?.socket?.server) {
            console.log("🚀 Forcing socket initialization from /api/testEmit...");
            io = initSocket(res.socket.server);
            res.socket.server.io = io; // Attach for consistency
        } else {
            return res.status(500).json({ message: "Socket server not available" });
        }
    }

    // Emit fake order for testing
    const testOrder = {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "Test User " + Math.floor(Math.random() * 1000),
        phone: "9876543210",
        status: "Pending",
        address: {
            area: "Test Area",
            city: "Test City",
            line1: "123 Test Street",
            pincode: "123456",
        },
        cart: {
            service1: { name: "Test Service", qty: 1, price: 100 },
        },
        amount: 100,
        createdAt: new Date(),
    };

    io.emit("newOrder", testOrder);
    console.log("✅ Test order emitted:", testOrder);

    return res.status(200).json({ message: "Test order emitted" });
}
