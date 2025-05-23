"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import ItemCard from "@/components/ItemCard";
import Link from "next/link";
import Recommendations from "@/components/Recommendations";

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
};

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSortModal, setShowSortModal] = useState(false);
  const [tempSort, setTempSort] = useState<string | null>(null);

  useEffect(() => {
    const socket = io({
      path: "/api/socket_io",
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("new_product", (product: Product) => {
      if (product.category === "restaurant") {
        setProducts((prev) => [product, ...prev]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/product");
        const data = await res.json();
        const filtered = data.products.filter(
          (p: Product) => p.category === "restaurant"
        );
        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const sortOptions = ["Low to High", "High to Low"];

  const filteredAndSorted = products
    .filter((product) => {
      if (!selectedCategory) return true;
      return product.name
        .toLowerCase()
        .includes(selectedCategory.toLowerCase());
    })
    .sort((a, b) => {
      if (selectedSort === "Low to High") return a.price - b.price;
      if (selectedSort === "High to Low") return b.price - a.price;
      return 0;
    });

  return (
    <div className="w-full flex flex-col items-center pb-5">
      {/* Top Navigation Tabs */}
      <div className="h-16 w-full px-4 flex items-center justify-between border-y-2 border-gray-200 bg-white backdrop-blur-lg">
        <Link href="/complimentary">
          <span className="text-base font-medium">Complimentary</span>
        </Link>
        <Link href="/shop">
          <span className="text-base font-medium">Essentials</span>
        </Link>
        <Link href="/restaurant">
          <span className="text-base font-medium text-red-600">Restaurant</span>
        </Link>
      </div>

      {/* Sort Button */}
      <div className="w-[95%] mt-4 mb-2 flex items-center justify-between">
        <h2 className="text-base font-semibold mb-2">Sort By</h2>
        <button
          onClick={() => setShowSortModal(true)}
          className="px-3 py-1 rounded-md border border-gray-300 text-base text-gray-700 hover:bg-gray-100"
        >
          Price
        </button>
      </div>

      {/* Modal */}
      {showSortModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full p-4 max-w-md">
            <h3 className="text-lg font-semibold mb-3">Sort by Price</h3>
            {sortOptions.map((opt) => (
              <div key={opt} className="flex items-center gap-x-2 mb-2">
                <input
                  type="radio"
                  id={opt}
                  checked={tempSort === opt}
                  onChange={() => setTempSort(opt)}
                />
                <label htmlFor={opt} className="text-base text-gray-700">
                  {opt}
                </label>
              </div>
            ))}
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="text-base text-gray-500 underline"
                onClick={() => {
                  setTempSort(null);
                  setSelectedSort(null);
                  setShowSortModal(false);
                }}
              >
                Clear
              </button>
              <button
                className="bg-[#ff493d] text-white px-4 py-1 rounded-md text-base uppercase"
                onClick={() => {
                  setSelectedSort(tempSort);
                  setShowSortModal(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product List */}
      {loading ? (
        <p className="mt-8 text-gray-500">Loading products...</p>
      ) : filteredAndSorted.length === 0 ? (
        <p className="mt-8 text-gray-500">No products found.</p>
      ) : (
        filteredAndSorted.map((product) => (
          <div className="w-[95%] flex flex-col py-4" key={product._id}>
            <ItemCard
              _id={product._id}
              imageSrc={product.imageUrl}
              title={product.name}
              price={product.price.toString()}
            />
          </div>
        ))
      )}

      {/* Recommendations */}
      <Recommendations category="essentials" />
      <div className="w-[95%] mt-4 mb-2 flex items-center justify-between">
        <button className="bg-[#ff493d] text-white text-base font-medium w-[49%] px-4 py-2 rounded-md uppercase">
          <Link href="/checkout">Go to Checkout</Link>
        </button>

        <button className="bg-black text-white text-base font-medium w-[49%] px-4 py-2 rounded-md uppercase">
          <Link href="/shop">Next</Link>
        </button>
      </div>
    </div>
  );
};

export default Page;
