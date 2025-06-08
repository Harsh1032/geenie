
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/order";

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectToDatabase();

  const { id } = await Promise.resolve(context.params);

  const updated = await Order.findByIdAndUpdate(
    id,
    { accepted: true },
    { new: true }
  );
  
  globalThis.io?.emit("order_updated", updated.toObject()); // 👈 Emit update to user

  return NextResponse.json({ success: true, order: updated });
}
