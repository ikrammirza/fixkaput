import connectDb from '../../middleware/mongoose';
import Order from '../../models/Order';
import redis from '../../lib/redis';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { parse } from 'cookie';
export const config = {
    api: {
        bodyParser: true,
    },
};

const handler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    await connectDb();

    try {
        const rawCookie = req.headers?.cookie || '';
        const cookies = parse(rawCookie);
        const sessionId = cookies.sessionId;

        if (!sessionId) {
            return res.status(401).json({ error: 'Unauthorized: No session' });
        }

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

        if (String(order.phone) !== String(user.phone)) {
            return res.status(403).json({ error: 'Unauthorized to delete this order' });
        }

        if (order.technicianId) {
            return res.status(409).json({ error: 'Cannot cancel: Technician already assigned' });
        }

        // Soft delete (recommended)
        // order.status = 'Cancelled';
        // await order.save();

        // OR: Hard delete (if business rule allows)
        await Order.findByIdAndDelete(orderId);

        return res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (err) {
        console.error('❌ Error deleting order:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default handler;
