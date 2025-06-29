// models/product.ts
import mongoose, { Schema, model, models } from "mongoose";

const productSchema = new Schema({
  name: String,
  price: Number,
  category: { type: String, enum: ["complimentary", "essentials", "restaurant"] },
  subCategory: String,
  description: String,
  imageUrl: String,
  disabled: { type: Boolean, default: false }, // ✅ Add this line
});

export const Product = models.Product || model("Product", productSchema);
