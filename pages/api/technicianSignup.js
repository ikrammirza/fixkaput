import connectDb from "../../middleware/mongoose";
import Technician from "../../models/Technician";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { name, email, password, phone, aadhar } = req.body;

    // Simple validation checks
    if (!name || !email || !password || !phone || !aadhar) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Verify if technician already exists based on email, phone, or aadhar
    const existingTechnician = await Technician.findOne({
      $or: [{ email }, { phone }, { aadhar }],
    });
    if (existingTechnician) {
      return res.status(400).json({ message: "Technician already registered" });
    }

    // Hash password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique technicianId (e.g., TECH-xxxx)
    const technicianId = `TECH-${nanoid(8)}`;

    // Create and save new technician
    const newTechnician = new Technician({
      name,
      email,
      password: hashedPassword,
      phone,
      aadhar,
      technicianId,
    });

    try {
      await newTechnician.save();

      // Generate a token for authentication
      const token = jwt.sign(
        { technicianId: newTechnician.technicianId },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      return res.status(201).json({
        message: "Technician registered successfully",
        token,
        technicianId: newTechnician.technicianId,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error saving technician" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default connectDb(handler);
