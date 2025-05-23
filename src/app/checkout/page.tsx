"use client";
import Recommendations from "@/components/Recommendations";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function CheckoutPage() {
  const { cart, clearCart, addToCart } = useCart();
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const updateQty = (_id: string, delta: number) => {
    const item = cart.find((c) => c._id === _id);
    if (!item) return;

    addToCart({ ...item, quantity: delta });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !room) return alert("Please fill all fields");

    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        room,
        items: cart,
      }),
    });

    if (res.ok) {
      toast.success("Your Order was successfully placed!");
      clearCart();
      setName("");
      setRoom("");
    } else {
      toast.error("Your order can not be placed!");
    }
  };

  return (
    <div className="w-full py-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Checkout</h1>
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center text-gray-600">
          <ShoppingCart className="w-20 h-20 mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="mb-4">Looks like you haven't added anything yet.</p>
          <a
            href="/restaurant"
            className="bg-[#ff493d] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#e13d30] transition"
          >
            Add Items
          </a>
        </div>
      ) : (
        <>
          <ul className="space-y-4 px-4">
            {cart.map((item) => (
              <li
                key={item._id}
                className="flex items-center justify-between gap-4 rounded-lg bg-white p-3 shadow-md"
              >
                {/* Title + Price */}
                <div className="flex flex-col justify-between h-24 flex-grow">
                  <p className="font-semibold text-gray-800 text-sm line-clamp-2">
                    {item.title}
                  </p>
                  <p className="text-base font-bold text-black">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
                {/* Image + Qty controls */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {/* Overlay controls */}
                  <div className="absolute bottom-1 left-1 right-1 bg-white/90 backdrop-blur-sm rounded-full flex justify-between items-center px-2 py-1">
                    <button
                      onClick={() => updateQty(item._id, -1)}
                      className="text-[#ff493d]"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item._id, 1)}
                      className="text-[#ff493d]"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <form
            onSubmit={handleSubmit}
            className="fixed bottom-0 left-0 right-0 bg-white shadow-xl border-t z-20 px-4 pt-3 pb-5 rounded-t-2xl"
          >
            <div className="mb-4 space-y-2">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff493d]"
                required
              />
              <input
                type="text"
                placeholder="Room Number"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff493d]"
                required
              />
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-xl font-bold text-black">₹{total}</span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#ff493d] hover:bg-[#e13d30] text-white font-semibold py-3 rounded-xl transition text-center flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Place Order
            </button>
          </form>
        </>
      )}

      <Recommendations category="restaurant" />
      <Toaster />
    </div>
  );
}
