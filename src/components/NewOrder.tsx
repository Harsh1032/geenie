"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { CheckCircle, PackageSearch } from "lucide-react";
import toast from "react-hot-toast";

type OrderItem = {
  _id: string;
  title: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  name: string;
  room: string;
  phone: string; // ← Add this line
  items: OrderItem[];
  createdAt: string;
  status: string;
};

const NewOrder = ({ view }: { view: "current" | "completed" }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/order");
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    };

    fetchOrders();

    const socket = io({ path: "/api/socket_io" });

    socket.on("connect", () => {
      console.log("✅ Admin socket connected");
    });

    socket.on("new_order", (newOrder: Order) => {
      console.log("📦 New order received via socket", newOrder);
      setOrders((prev) => [newOrder, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleMarkCompleted = async (id: string) => {
    try {
      const res = await fetch(`/api/order/complete/${id}`, {
        method: "PUT",
      });

      if (!res.ok) throw new Error("Failed to update status");

      const data = await res.json();
      toast.success("Order marked as completed!");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: "completed" } : order
        )
      );
    } catch (err) {
      toast.error("Failed to update order");
    }
  };

  const statusFilter = view === "current" ? "pending" : "completed";
 const filteredOrders = orders.filter((order) => {
  const statusMatch = order.status === (view === "current" ? "pending" : "completed");
  const searchMatch =
    order.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.phone?.toLowerCase().includes(searchQuery.toLowerCase());
  return statusMatch && searchMatch;
});

  return (
    <div className="p-6 w-full">
       <div className="mb-4">
    <input
      type="text"
      placeholder="Search by room or phone"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
    />
  </div>
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
          <PackageSearch className="w-20 h-20 mb-4 opacity-50" />
          <h2 className="text-lg font-semibold">No {view} orders yet.</h2>
          <p className="text-sm text-center max-w-sm">
            {view === "current"
              ? "New orders will show up here once placed by guests."
              : "Completed orders will appear here once fulfilled."}
          </p>
        </div>
      ) : view === "current" ? (
        // ✅ Card layout for CURRENT orders
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 shadow-md bg-white"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm text-gray-800 font-medium">
                    <strong>Name:</strong> {order.name}
                  </p>
                  <p className="text-sm text-gray-800 font-medium">
                    <strong>Room:</strong> {order.room}
                  </p>
                </div>
                <button
                  onClick={() => handleMarkCompleted(order._id)}
                  className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded-md"
                >
                  Mark as Completed
                </button>
              </div>
              <ul className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <li
                    key={item._id}
                    className="py-2 flex justify-between text-sm"
                  >
                    <span>
                      {item.title} × {item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-right font-semibold text-base">
                Total: ₹
                {order.items.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                )}
              </p>
            </div>
          ))}
        </div>
      ) : (
        // ✅ Table layout for COMPLETED orders
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden text-sm border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Room</th>
                <th className="px-6 py-3 text-left">Items</th>
                <th className="px-6 py-3 text-right">Total</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-all duration-150"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.name}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.room}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    <ul className="space-y-1">
                      {order.items.map((item) => (
                        <li key={item._id}>
                          <span className="font-medium">{item.title}</span> ×{" "}
                          {item.quantity} — ₹{item.price * item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    ₹
                    {order.items.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                      <CheckCircle className="w-5 h-5" />
                      Done
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NewOrder;
