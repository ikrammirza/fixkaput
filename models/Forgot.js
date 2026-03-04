import mongoose from "mongoose";

const ForgotSchema = new mongoose.Schema(
  {
    userid: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Forgot || mongoose.model("Forgot", ForgotSchema);
