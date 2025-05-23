"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import toast, { Toaster } from 'react-hot-toast';

interface ItemCardProps {
  _id: string;
  imageSrc: string;
  title: string;
  price: string;
}

export default function ItemCard({ _id, imageSrc, title, price }: ItemCardProps) {
  const [quantity, setQuantity] = useState(0);
  const { addToCart } = useCart();

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => Math.max(0, q - 1));

  const handleAddToCart = () => {
    if (quantity === 0) return;

    addToCart({
      _id,
      title,
      image: imageSrc,
      price: parseFloat(price),
      quantity,
    });

    toast.success(`${title} added successfully`);

    setQuantity(0);
  };

  return (
    <div className="flex flex-col gap-y-4 rounded-lg shadow-md p-4 w-full bg-white">
      <div className="relative w-full h-56 mb-2">
        <img
          src={imageSrc}
          alt={title}
          className="object-cover rounded-lg w-full h-full"
        />
      </div>

      <div className="flex justify-between items-center my-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-lg font-semibold">₹{price}</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 bg-gray-100 rounded-md px-4 py-2">
          <button onClick={decreaseQty} className="text-xl font-bold text-gray-700">
            <Minus />
          </button>
          <span className="text-xl font-medium w-4 text-center">{quantity}</span>
          <button onClick={increaseQty} className="text-xl font-bold text-[#ff493d]">
            <Plus />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="bg-[#ff493d] text-white text-base font-medium px-4 py-2 rounded-md uppercase"
        >
          Add item
        </button>
      </div>
      <Toaster />
    </div>
  );
}
