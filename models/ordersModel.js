const mongoose = require("mongoose");
const ordersSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId },
    productId: { type: String, required: true },
    status: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", ordersSchema);
