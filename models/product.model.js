const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Why no name?"],
    },
    link: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Why no price?"],
    },
    inStock: {
      type: String,
      required: true,
    },
    delivery: {
      type: String,
      required: true,
    },
    ratings: {
      type: String,
      required: true,
    },
    offer: {
      type: String,
    },
    idealFor: {
      type: String,
      required: [true, "Why no sex?"],
      enum: ["Men", "Women", "All"],
    },
    level: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    addedToCart: {
      type: Boolean,
      required: true,
    },
    addedToWishlist: {
      type: Boolean,
      required: true,
    },
    cateogory: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    discountedPrice: {
      type: Number,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = { Product };
