const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    oid: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    amount: { type: Number, required: true },
    phone: { type: Number, required: true },
    products: { type: Object, required: true },

    // status: { type: String, default: "pending", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
