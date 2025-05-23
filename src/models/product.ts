// models/product.ts
import mongoose, { Schema, model, models } from "mongoose";

const productSchema = new Schema({
  name: String,
  price: Number,
  category: { type: String, enum: ["complimentary", "essentials", "restaurant"] },
  imageUrl: String,
});

export const Product = models.Product || model("Product", productSchema);
