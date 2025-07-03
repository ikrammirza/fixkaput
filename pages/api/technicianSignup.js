import connectDb from "../../middleware/mongoose";
import Technician from "../../models/Technician";
import { nanoid } from "nanoid";

export default async function handler(req, res) {
    await connectDb();

    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const { name, phone, aadhar } = req.body;

    if (!name || !phone || !aadhar) {
        return res.status(400).json({ message: "Name, Phone, and Aadhar are required" });
    }

    try {
        const existing = await Technician.findOne({ $or: [{ phone }, { aadhar }] });
        if (existing) {
            return res.status(400).json({ message: "Technician already registered" });
        }

        const technicianId = `TECH-${nanoid(8)}`;

        const newTechnician = new Technician({
            name,
            phone,
            aadhar,
            technicianId,
        });

        await newTechnician.save();

        return res.status(201).json({
            message: "Technician registered successfully. Please login to continue.",
        });
    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ message: "Error registering technician" });
    }
}
