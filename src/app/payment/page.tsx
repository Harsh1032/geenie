"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import Recommendations from "@/components/Recommendations";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Page = () => {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [checkoutInfo, setCheckoutInfo] = useState<{
    name: string;
    room: string;
    phone: string;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("checkoutInfo");
    if (stored) {
      setCheckoutInfo(JSON.parse(stored));
    } else {
      router.push("/checkout");
    }
  }, [router]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  const handleFinalOrder = async () => {
    if (!checkoutInfo) return;
    localStorage.setItem("checkoutInfo", JSON.stringify(checkoutInfo));

    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: checkoutInfo.name,
        room: checkoutInfo.room,
        phone: checkoutInfo.phone,
        items: cart,
      }),
    });

    if (res.ok) {
      toast.success("Your Order was successfully placed!");
      clearCart();
      localStorage.removeItem("checkoutInfo");
      router.push(
        `/orderHistory?phone=${checkoutInfo.phone}&room=${checkoutInfo.room}`
      );
    } else {
      toast.error("Your order could not be placed!");
    }
  };

  if (!checkoutInfo) return null;

  return (
    <div className="w-full flex flex-col items-center py-5 bg-[#FFA553]">
      <div className="bg-[#ffc894] w-[90%] py-5 flex items-center justify-center my-5 rounded-2xl">
        <h1 className="text-xl font-bold mb-4 text-black">Payment Gateway</h1>
      </div>

      {/* Summary Card */}
      <div className="w-[90%] bg-white rounded-xl shadow-md px-4 py-4 mb-6">
        <div className="text-sm text-gray-700 mb-3 space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Name
            </label>
            <input
              type="text"
              value={checkoutInfo.name}
              onChange={(e) =>
                setCheckoutInfo((prev) =>
                  prev ? { ...prev, name: e.target.value } : prev
                )
              }
              className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Room Number
            </label>
            <input
              type="text"
              value={checkoutInfo.room}
              onChange={(e) =>
                setCheckoutInfo((prev) =>
                  prev ? { ...prev, room: e.target.value } : prev
                )
              }
              className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Phone Number
            </label>
            <PhoneInput
              country={"ae"}
              value={checkoutInfo.phone}
              onChange={(val) =>
                setCheckoutInfo((prev) =>
                  prev ? { ...prev, phone: val } : prev
                )
              }
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
        </div>

        {/* Total with Tooltip */}
        <div className="flex items-center justify-between relative group mt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-xs text-gray-400 cursor-pointer group-hover:underline relative">
              (i)
              <div className="absolute z-10 hidden group-hover:block bg-white text-black border border-gray-300 text-xs rounded-md shadow-lg p-2 top-6 left-0 w-max min-w-[180px]">
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

        {/* Confirm Button */}
        <button
          onClick={handleFinalOrder}
          className="w-full mt-5 bg-[#ff493d] hover:bg-[#e13d30] text-white font-semibold py-3 rounded-xl transition text-center flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} />
          Place Order
        </button>
      </div>

      <div className="flex flex-col w-[90%] bg-transparent border-2 border-black rounded-lg mt-5 items-center py-4 px-2 text-center">
        <span className="uppercase text-xl text-black font-semibold">
          Try our best sellers
        </span>
        <Recommendations />
      </div>
      <Toaster />
    </div>
  );
};
export default Page;
