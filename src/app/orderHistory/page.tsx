"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { CheckCircle, Clock3, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Recommendations from "@/components/Recommendations";

type OrderItem = {
  _id: string;
  title: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  createdAt: string;
  status: string;
  accepted: boolean;
  phone: string; // ✅ Add this
  room: string; // ✅ Add this
  items: OrderItem[];
};

const Page = () => {
  const searchParams = useSearchParams();
  const initialPhone = searchParams?.get("phone") || "";
  const initialRoom = searchParams?.get("room") || "";

  const [phone, setPhone] = useState(initialPhone);
  const [room, setRoom] = useState(initialRoom);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch orders
  const fetchOrders = async (phone: string, room: string) => {
    setLoading(true);
    const res = await fetch(`/api/order/history?phone=${phone}&room=${room}`);
    const data = await res.json();
    if (res.ok) setOrders(data.orders);
    else alert(data.error || "Failed to fetch orders");
    setLoading(false);
  };

  // Auto-fetch if values from URL
  useEffect(() => {
    if (initialPhone && initialRoom) {
      fetchOrders(initialPhone, initialRoom);
    }
  }, [initialPhone, initialRoom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(phone, room);
  };

  useEffect(() => {
    const socket = io({ path: "/api/socket_io" });

    socket.on("connect", () => {
      console.log("📡 User socket connected");
    });

    socket.on("order_updated", (updatedOrder: Order) => {
      // Only update if phone and room match user's input
      if (
        updatedOrder.phone === phone &&
        updatedOrder.room.toLowerCase() === room.toLowerCase()
      ) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [phone, room]);

  return (
    <div className="w-full flex flex-col min-h-screen items-center pb-5 bg-[#FFA553]">
      <form
        onSubmit={handleSubmit}
        className="w-[90%] mt-6 bg-white shadow-xl border-t z-20 px-4 pt-4 pb-6 rounded-2xl"
      >
        <div className="space-y-4 mb-3">
          <PhoneInput
            country={"ae"}
            value={phone}
            onChange={setPhone}
            inputClass="!w-full !text-sm !py-2 !pl-12 pr-4 !rounded !border !border-gray-300"
            buttonClass="!border-r !border-gray-300"
          />
          <input
            type="text"
            placeholder="Room Number"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full border px-4 py-2 rounded text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#ff493d] hover:bg-[#e13d30] transition text-white font-semibold py-2 rounded-md text-sm"
        >
          {loading ? "Checking..." : "Show My Orders"}
        </button>
      </form>

      {/* Order List */}
      {orders.length > 0 && (
        <div className="w-[90%] mt-6 space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order._id} className="bg-white shadow-md rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Placed on:</span>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="font-medium">Status:</span>
                    {order.status === "pending" ? (
                      <span className="text-yellow-600 flex items-center gap-1">
                        <Clock3 size={16} /> Pending
                      </span>
                    ) : (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle size={16} /> Completed
                      </span>
                    )}
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="font-medium">Accepted:</span>
                    {order.accepted ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle size={16} /> Yes
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1">
                        <XCircle size={16} /> No
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-sm border-t pt-2 text-gray-800">
                {order.items.map((item) => (
                  <li
                    key={item._id}
                    className="flex justify-between text-sm font-medium"
                  >
                    <span>
                      {item.title} × {item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col w-[90%] bg-transparent border-2 border-black rounded-lg  items-center mt-5 py-4 px-2 text-center">
        <span className="uppercase text-xl text-black font-semibold">
          Try our best sellers
        </span>
        <Recommendations />
      </div>
    </div>
  );
};

export default Page;
