import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/product";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const query = req.nextUrl.searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  // Match name partially, case-insensitive
  const product = await Product.findOne({
    name: { $regex: query, $options: "i" },
  });

  if (!product) {
    return NextResponse.json({ product: null });
  }

  return NextResponse.json({ product });
}
