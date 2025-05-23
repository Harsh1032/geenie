import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/order";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const { items, name, room} = body;

    if (!name || !room) {
      return NextResponse.json(
        { success: false, message: "Missing name or room" },
        { status: 400 }
      );
    }

    // Save to DB
    const newOrder = await Order.create({ items, name, room, status: "pending" });

    // Emit event via socket.io to notify admin dashboard
    globalThis.io?.emit("new_order", newOrder.toObject()); // 👈 emits to all clients listening

    return NextResponse.json({ success: true, orderId: newOrder._id });
  } catch (error) {
    console.error("❌ Failed to place order:", error);
    return NextResponse.json(
      { success: false, message: "Order failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("❌ Failed to fetch orders:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ): Promise<NextResponse> {
//   const updated = await Order.findByIdAndUpdate(
//     params.id,
//     { status: "completed" },
//     { new: true }
//   );

//   return NextResponse.json({ success: true, order: updated });
// }
