"use client";
import Recommendations from "@/components/Recommendations";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next/navigation"; // Add this at the top

export default function CheckoutPage() {
  const { cart, clearCart, addToCart } = useCart();
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);

  const updateQty = (_id: string, delta: number) => {
    const item = cart.find((c) => c._id === _id);
    if (!item) return;

    addToCart({ ...item, quantity: delta });
  };

  // const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !room || !phone) return toast("Please fill all fields");

    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        room,
        phone,
        items: cart,
      }),
    });

    if (res.ok) {
      toast.success("Your Order was successfully placed!");
      clearCart();
      router.push(
        `/orderHistory?phone=${encodeURIComponent(
          phone
        )}&room=${encodeURIComponent(room)}`
      );
      setName("");
      setPhone("");
      setRoom("");
    } else {
      toast.error("Your order can not be placed!");
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  return (
    <div className="w-full flex flex-col items-center py-5 bg-[#FFA553]">
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center text-white">
          <ShoppingCart className="w-20 h-20 mb-4 text-white" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="mb-4">Looks like you haven't added anything yet.</p>
          <a
            href="/restaurant"
            className="bg-[#ffc894] text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-[#e13d30] transition"
          >
            Add Items
          </a>
        </div>
      ) : (
        <>
          <ul className="space-y-4 px-4 w-full">
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
            onSubmit={(e) => {
              e.preventDefault();
              if (!name || !room || !phone)
                return toast("Please fill all fields");

              // Save data to localStorage (or you could use context)
              localStorage.setItem(
                "checkoutInfo",
                JSON.stringify({ name, room, phone })
              );
              router.push("/payment");
            }}
            className="w-[90%] mt-6 bg-white shadow-xl border-t z-20 px-4 pt-3 pb-5 rounded-2xl"
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
              <PhoneInput
                country={"ae"}
                value={phone} // Must include `+971` to show UAE code
                onChange={(val) => setPhone(val)} // val will be like "+97150xxxxxx"
                enableSearch={true}
                enableLongNumbers={true}
                countryCodeEditable={false}
                inputClass="!w-full !text-sm !py-2 !pl-12 pr-4 !rounded !border !border-gray-300"
                containerClass="mb-2"
                buttonClass="!border-r !border-gray-300"
                inputProps={{
                  name: "phone",
                  required: true,
                }}
              />
            </div>

            <div className="flex items-center justify-between mb-3 relative group">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Total</span>
                <span
                  className="text-xs text-gray-400 cursor-pointer relative group"
                  onClick={() => setShowTooltip((prev) => !prev)}
                >
                  (i)
                  <div
                    className={`absolute z-10 ${
                      showTooltip ? "block" : "hidden"
                    } group-hover:block bg-white text-black border border-gray-300 text-xs rounded-md shadow-lg p-2 top-6 left-0 w-max min-w-[180px]`}
                  >
                    <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
                    <p>GST (5%): ₹{gst.toFixed(2)}</p>
                    <p className="font-semibold border-t pt-1 mt-1">
                      Total: ₹{total.toFixed(2)}
                    </p>
                  </div>
                </span>
              </div>
              <span className="text-xl font-bold text-black">
                ₹{total.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#ff493d] hover:bg-[#e13d30] text-white font-semibold py-3 rounded-xl transition text-center flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Proceed to Payment
            </button>
          </form>
        </>
      )}

      <div className="flex flex-col w-[90%] bg-transparent border-2 border-black rounded-lg mt-5  items-center py-4 px-2 text-center">
        <span className="uppercase text-xl text-black font-semibold">
          Try our best sellers
        </span>
        <Recommendations />
      </div>
      <Toaster />
    </div>
  );
}
