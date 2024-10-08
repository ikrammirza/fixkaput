const mongoose = require("mongoose");
const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    category: { type: String, required: true },
    color: { type: String },
    price: { type: String },
    size: { type: String, required: true },
    availableQty: { type: Number, required: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);


export default mongoose.model.Service||mongoose.model("Service", ServiceSchema);
