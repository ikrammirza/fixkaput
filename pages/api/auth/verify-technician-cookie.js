// /pages/api/auth/verify-technician-cookie.js

import redis from "../../../lib/redis";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import Technician from "../../../models/Technician";
import connectDb from "../../../middleware/mongoose";

export const config = {
    api: { bodyParser: false },
};

export default async function handler(req, res) {
    await connectDb();

    try {
        const cookies = req.headers.cookie
            ? cookie.parse(req.headers.cookie)
            : {};

        const sessionId = cookies?.technicianSessionId;

        if (!sessionId) {
            return res.status(401).json({ message: "No session cookie found" });
        }

        const token = await redis.get(`technician:sess:${sessionId}`);

        if (!token) {
            return res.status(401).json({ message: "Session expired or invalid" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const technician = await Technician.findOne({ _id: decoded.id });

        if (!technician) {
            return res.status(404).json({ message: "Technician not found" });
        }

        return res.status(200).json({
            message: "Technician authenticated",
            technician: {
                id: technician._id,
                name: technician.name,
                phone: technician.phone,
            },
        });
    } catch (err) {
        console.error("Error verifying technician cookie:", err);
        return res.status(500).json({ message: "Server error verifying session" });
    }
}
