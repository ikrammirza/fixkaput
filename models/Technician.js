// models/Technician.js

import mongoose from "mongoose";

const TechnicianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"],
  },
  aadhar: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{12}$/, "Please enter a valid 12-digit Aadhar number"],
  },
  technicianId: {
    type: String,
    unique: true,
    required: true,
  },
});

export default mongoose.models.Technician ||
  mongoose.model("Technician", TechnicianSchema);

