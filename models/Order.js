import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    oid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      area: { type: String, required: true },
      line1: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String },
    },
    cart: { type: Object, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Technician",
      default: null,
    },
    paymentStatus: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

OrderSchema.index({ phone: 1 });
OrderSchema.index({ phone: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ technicianId: 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
