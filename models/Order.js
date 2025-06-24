const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    oid: { type: Number, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      area: { type: String, required: true },
      line1: { type: String,required:true },
      city: { type: String,required:true },
      pincode: { type: String},
    },
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
