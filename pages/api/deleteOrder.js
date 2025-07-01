// pages/api/deleteOrder.js
import connectDb from '../../middleware/mongoose';
import Order from '../../models/Order';
import redis from '../../lib/redis';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    await connectDb();

    const cookies = cookie.parse(req.headers.cookie || '');
    const sessionId = cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ error: 'Unauthorized: No session' });
    }

    try {
        const token = await redis.get(sessionId);
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: Session expired' });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);

        const { orderId } = req.body;
        if (!orderId) {
            return res.status(400).json({ error: 'Order ID is required' });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.phone !== user.phone) {
            return res.status(403).json({ error: 'Unauthorized to delete this order' });
        }

        if (order.technicianId) {
            return res.status(400).json({ error: 'Cannot cancel: Technician already assigned' });
        }

        await Order.findByIdAndDelete(orderId);

        return res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (err) {
        console.error('❌ Error deleting order:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
