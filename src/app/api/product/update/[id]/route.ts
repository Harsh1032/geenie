// src/app/api/product/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { uploadToS3 } from "@/lib/s3";
import { Product } from "@/models/product";
import { v4 as uuidv4 } from "uuid";
import { Types } from "mongoose";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await context.params; 

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const category = formData.get("category") as string;
    const subCategory = formData.get("subCategory") as string;
    const imageFile = formData.get("image") as File | null;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let imageUrl = product.imageUrl;

    if (imageFile && imageFile.size > 0) {
      const fileBuffer = await imageFile.arrayBuffer();
      const fileName = `${uuidv4()}-${imageFile.name}`;
      imageUrl = await uploadToS3(Buffer.from(fileBuffer), fileName, imageFile.type);
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;
    product.imageUrl = imageUrl;

    await product.save();

    globalThis.io?.emit("update_product", product);

    return NextResponse.json({ message: "Product updated", product }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
