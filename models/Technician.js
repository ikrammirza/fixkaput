// models/Technician.js

import mongoose from "mongoose";

const TechnicianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^(\+91)[6-9]\d{9}$/, "Please enter a valid Indian phone number"],
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
  address: {
    area: { type: String },
    line1: { type: String },
    city: { type: String },
    pincode: { type: String },
  }
});

export default mongoose.models.Technician ||
  mongoose.model("Technician", TechnicianSchema);

