"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface RecommendationItem {
  _id: string;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
}

interface RecommendationsProps {
  category: "essentials" | "restaurant";
}

export default function Recommendations({ category }: RecommendationsProps) {
  const [allItems, setAllItems] = useState<RecommendationItem[]>([]);
  const [visibleItems, setVisibleItems] = useState<RecommendationItem[]>([]);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddAndOpenCheckout = (item: RecommendationItem) => {
    addToCart({
      _id: item._id,
      title: item.name, // ✅ fix: map name ➝ title
      image: item.imageUrl, // ✅ fix: map imageUrl ➝ image
      price: item.price,
      quantity: 1,
    });
    router.push("/checkout");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/product");
      const data = await res.json();
      const filtered = data.products.filter(
        (item: RecommendationItem) => item.category === category
      );

      setAllItems(filtered);
      setVisibleItems(filtered.slice(0, 2));
    };

    fetchProducts();
  }, [category]);

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
    <div className="w-full px-4 py-2 mt-4 bg-gray-100 flex flex-col justify-center items-center">
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

            {/* Add button */}
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
