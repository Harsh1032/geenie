"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { io } from "socket.io-client";

interface RecommendationItem {
  _id: string;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  disabled: boolean;
}

interface RecommendationsProps {
  // optional if needed, but not used anymore
  category?: never;
}

export default function Recommendations({ category }: RecommendationsProps) {
  const [allItems, setAllItems] = useState<RecommendationItem[]>([]);
  const [visibleItems, setVisibleItems] = useState<RecommendationItem[]>([]);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddAndOpenCheckout = (item: RecommendationItem) => {
    addToCart({
      _id: item._id,
      title: item.name,
      image: item.imageUrl,
      price: item.price,
      quantity: 1,
    });
    router.push("/checkout");
  };

  const fetchProducts = async () => {
    const res = await fetch("/api/product");
    const data = await res.json();
    const filtered = data.products.filter(
      (item: RecommendationItem) =>
        (item.category === "restaurant" || item.category === "essentials") &&
        !item.disabled
    );

    setAllItems(filtered);
    setVisibleItems(filtered.slice(0, 2));
  };

  // Initial fetch and refetch on category change
  useEffect(() => {
    fetchProducts();
  }, [category]);

  // Real-time updates with socket
  useEffect(() => {
    const socket = io({
      path: "/api/socket_io", // ✅ match your backend
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("update_product", () => {
      fetchProducts();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Autoplay recommendation rotation
  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      if (allItems.length > 0) {
        setVisibleItems([
          allItems[index % allItems.length],
          allItems[(index + 1) % allItems.length],
        ]);
        index = (index + 1) % allItems.length;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [allItems]);

  return (
    <div className="w-full mt-4 bg-transparent flex flex-col justify-center items-center">
      <div className="flex gap-4 overflow-x-auto">
        {visibleItems.map((item) => (
          <div
            key={item._id}
            className="min-w-[140px] w-[140px] bg-white shadow rounded-lg p-4 text-center flex-shrink-0 relative"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-[100px] object-cover rounded-md"
            />

            <button
              onClick={() => handleAddAndOpenCheckout(item)}
              className="absolute top-0 right-0 bg-[#ff493d] hover:bg-[#e13d30] text-white rounded-full p-1"
            >
              <Plus size={16} />
            </button>

            <p className="mt-2 text-sm font-medium line-clamp-1">{item.name}</p>
            <p className="text-xs text-gray-500">₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
