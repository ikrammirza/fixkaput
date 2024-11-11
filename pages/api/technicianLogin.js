import connectDb from "../../middleware/mongoose";
import Technician from "../../models/Technician";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    // Find technician by email
    const technician = await Technician.findOne({ email: req.body.email });

    if (!technician || !(await bcrypt.compare(password, technician.password))) {
      console.log("Technician not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT
    const token = jwt.sign(
      { technicianId: technician.technicianId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      token,
      technicianId: technician.technicianId,
      message: "Login successful",
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
