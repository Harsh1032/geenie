// src/app/api/product/[id]/disable/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/product";
import { Types } from "mongoose";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await context.params;
    const body = await req.json();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const { disabled } = body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { disabled: !!disabled },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    globalThis.io?.emit("update_product", updatedProduct);

    return NextResponse.json({
      message: `Product ${disabled ? "disabled" : "re-enabled"}`,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Toggle disable error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
