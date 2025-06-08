import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Order  from "@/models/order"; // update path accordingly

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const phone = req.nextUrl.searchParams.get("phone");
    const room = req.nextUrl.searchParams.get("room");

    if (!phone || !room) {
      return NextResponse.json({ error: "Missing phone or room" }, { status: 400 });
    }

    const orders = await Order.find({
      phone,
      room,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
