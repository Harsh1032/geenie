// src/app/api/product/route.ts

import { io } from "socket.io-client";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { uploadToS3 } from "@/lib/s3";
import { Product } from "@/models/product";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const category = formData.get("category") as string;
    const subCategory = formData.get("subCategory") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File;

    if (!name || !price || !category || !subCategory || !imageFile || !description) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Upload to S3
    const fileBuffer = await imageFile.arrayBuffer();
    const fileName = `${uuidv4()}-${imageFile.name}`;
    const s3Url = await uploadToS3(Buffer.from(fileBuffer), fileName, imageFile.type);

    // Save to MongoDB
    const newProduct = new Product({
      name,
      price,
      category,
      subCategory,
      description,
      imageUrl: s3Url,
      disabled: false, 
    });

    await newProduct.save();

    
    globalThis.io?.emit("new_product", newProduct);

    return NextResponse.json({ message: "Product created", product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    const products = await Product.find().sort({ createdAt: -1 }); // newest first
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
