import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    room: { type: String, required: true },
    phone: { type: String, required: true }, 
    items: [
      {
        _id: String,
        title: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending", // All new orders start as pending
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
