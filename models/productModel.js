// const { default: mongoose } = require("mongoose");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Types.ObjectId },
    productName: { type: String, required: true },
    desc: { type: String, required: true },
    brand: { type: String },
    categories: { type: Array },
    warranty: { type: String },
    deliveryMethod: { type: String },
    cashBack: { type: String },
    tags: { type: Array },
    price: { type: Number },
    discount: { type: Number, default: 0 },
    variant: [
      {
        size: String,
        colors: [String],
        stock: Number,
        Image:[String]
        // options: [{ colors: Array, stock: Number, images: Array }],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
