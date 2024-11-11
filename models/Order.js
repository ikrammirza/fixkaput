const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    oid: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    cart: { type: Object, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Technician",
      default: null,
    },
    // Optional: to log technician notes
    // When the service was completed
    paymentStatus: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
