// "use client";

// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { CheckCircle } from "lucide-react";
// import toast from "react-hot-toast";

// type OrderItem = {
//   _id: string;
//   title: string;
//   price: number;
//   quantity: number;
// };

// type Order = {
//   _id: string;
//   name: string;
//   room: string;
//   items: OrderItem[];
//   createdAt: string;
//   status: string;
// };

// const NewOrder = ({ view }: { view: "current" | "completed" }) => {
//   const [orders, setOrders] = useState<Order[]>([]);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const res = await fetch("/api/order");
//       const data = await res.json();
//       if (data.success) setOrders(data.orders);
//     };

//     fetchOrders();

//     const socket = io({ path: "/api/socket_io" });

//     socket.on("connect", () => {
//       console.log("✅ Admin socket connected");
//     });

//     socket.on("new_order", (newOrder: Order) => {
//       console.log("📦 New order received via socket", newOrder);
//       setOrders((prev) => [newOrder, ...prev]);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const handleMarkCompleted = async (id: string) => {
//     try {
//       const res = await fetch(`/api/order/${id}`, {
//         method: "PUT",
//       });

//       if (!res.ok) throw new Error("Failed to update status");

//       const data = await res.json();
//       toast.success("Order marked as completed!");

//       setOrders((prev) =>
//         prev.map((order) =>
//           order._id === id ? { ...order, status: "completed" } : order
//         )
//       );
//     } catch (err) {
//       toast.error("Failed to update order");
//     }
//   };

//   const statusFilter = view === "current" ? "pending" : "completed";
//   const filteredOrders = orders.filter((order) => order.status === statusFilter);

//   return (
//     <div className="p-6 w-full">
//       <h1 className="text-2xl font-bold text-center mb-6">
//         {view === "current" ? "Current Orders" : "Completed Orders"}
//       </h1>

//       {filteredOrders.length === 0 ? (
//         <p className="text-gray-500 text-center">No {view} orders yet.</p>
//       ) : (
//         <div className="space-y-6">
//           {filteredOrders.map((order) => (
//             <div
//               key={order._id}
//               className="border rounded-lg p-4 shadow-md bg-white"
//             >
//               <div className="flex justify-between items-center mb-2">
//                 <div>
//                   <p className="text-sm text-gray-800 font-medium">
//                     <strong>Name:</strong> {order.name}
//                   </p>
//                   <p className="text-sm text-gray-800 font-medium">
//                     <strong>Room:</strong> {order.room}
//                   </p>
//                 </div>
//                 {view === "completed" ? (
//                   <CheckCircle className="text-green-500" size={20} />
//                 ) : (
//                   <button
//                     onClick={() => handleMarkCompleted(order._id)}
//                     className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded-md"
//                   >
//                     Mark as Completed
//                   </button>
//                 )}
//               </div>

//               <ul className="divide-y divide-gray-200">
//                 {order.items.map((item) => (
//                   <li
//                     key={item._id}
//                     className="py-2 flex justify-between text-sm"
//                   >
//                     <span>
//                       {item.title} × {item.quantity}
//                     </span>
//                     <span>₹{item.price * item.quantity}</span>
//                   </li>
//                 ))}
//               </ul>

//               <p className="mt-3 text-right font-semibold text-base">
//                 Total: ₹
//                 {order.items.reduce(
//                   (sum, item) => sum + item.price * item.quantity,
//                   0
//                 )}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NewOrder;
