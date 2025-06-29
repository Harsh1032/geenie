"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import ItemCard from "@/components/ItemCard";
import Link from "next/link";
import Recommendations from "@/components/Recommendations";
import { LoaderCircle, PackageSearch } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  subCategory: string;
  description: string;
  imageUrl: string;
  disabled: boolean;
};

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSortModal, setShowSortModal] = useState(false);
  const [tempSort, setTempSort] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const [showSubCatModal, setShowSubCatModal] = useState(false);

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

    socket.on("update_product", (updatedProduct: Product) => {
      if (updatedProduct.category === "restaurant") {
        setProducts((prev) => {
          const exists = prev.find((p) => p._id === updatedProduct._id);
          const isVisible = !updatedProduct.disabled;

          if (exists) {
            // Update or remove based on disabled flag
            return isVisible
              ? prev.map((p) =>
                  p._id === updatedProduct._id ? updatedProduct : p
                )
              : prev.filter((p) => p._id !== updatedProduct._id);
          } else {
            // Add new product if enabled and not in list
            return isVisible ? [updatedProduct, ...prev] : prev;
          }
        });
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
          (p: Product) => p.category === "restaurant" && !p.disabled
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
      const matchesName =
        !selectedCategory ||
        product.name.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSubCat =
        !selectedSubCategory || product.subCategory === selectedSubCategory;
      return matchesName && matchesSubCat;
    })
    .sort((a, b) => {
      if (selectedSort === "Low to High") return a.price - b.price;
      if (selectedSort === "High to Low") return b.price - a.price;
      return 0;
    });

  return (
    <div className="w-full flex flex-col items-center pb-5 bg-[#FFA553]">
      {/* Top Navigation Tabs */}
      <div className="fixed z-50 h-16 w-full px-4 flex items-center justify-between border-y-2 border-gray-200 bg-[#FFA553] backdrop-blur-lg">
        <Link href="/complimentary">
          <button className="bg-[#ffc894] p-2 rounded-lg hover:shadow-2xl">
            <span className="text-base font-medium">Complimentary</span>
          </button>
        </Link>
        <Link href="/shop">
          <button className="bg-[#ffc894] p-2 rounded-lg hover:shadow-2xl">
            <span className="text-base font-medium">Essentials</span>
          </button>
        </Link>
        <Link href="/restaurant">
          <button className="bg-transparent border-2 border-[#ffc894] p-2 rounded-lg shadow-2xl">
            <span className="text-base text-white font-medium">Restaurant</span>
          </button>
        </Link>
      </div>

      {/* Sort Button */}
      <div className="pt-20 w-[95%] mt-4 mb-2 flex items-center justify-between">
        <button
          onClick={() => setShowSortModal(true)}
          className="px-3 py-1 bg-[#ffc894] rounded-lg font-normal text-base text-black"
        >
          Sort By - Price
        </button>
        <button
          onClick={() => setShowSubCatModal(true)}
          className="px-3 py-1 bg-[#ffc894] rounded-lg font-normal text-base text-black"
        >
          Filter By - Sub Categories
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

      {showSubCatModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full p-4 max-w-md">
            <h3 className="text-lg font-semibold mb-3">
              Filter by Sub Category
            </h3>

            {Array.from(new Set(products.map((p) => p.subCategory))).map(
              (subCat) => (
                <div key={subCat} className="flex items-center gap-x-2 mb-2">
                  <input
                    type="radio"
                    id={subCat}
                    checked={selectedSubCategory === subCat}
                    onChange={() => setSelectedSubCategory(subCat)}
                  />
                  <label htmlFor={subCat} className="text-base text-gray-700">
                    {subCat}
                  </label>
                </div>
              )
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="text-base text-gray-500 underline"
                onClick={() => {
                  setSelectedSubCategory(null);
                  setShowSubCatModal(false);
                }}
              >
                Clear
              </button>
              <button
                className="bg-[#ff493d] text-white px-4 py-1 rounded-md text-base uppercase"
                onClick={() => setShowSubCatModal(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <LoaderCircle className="animate-spin w-8 h-8 text-black" />
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="flex flex-col items-center min-h-screen justify-center mt-12 text-gray-600">
          <PackageSearch className="w-12 h-12 mb-3 text-gray-400" />
          <h2 className="text-lg font-semibold">No products found</h2>
          <p className="text-sm text-center max-w-xs">
            Try selecting a different subcategory or check back later
          </p>
        </div>
      ) : (
        filteredAndSorted.map((product) => (
          <div className="w-[95%] flex flex-col py-4" key={product._id}>
            <ItemCard
              _id={product._id}
              imageSrc={product.imageUrl}
              title={product.name}
              price={product.price.toString()}
              description={product.description}
            />
          </div>
        ))
      )}
      <div className="flex flex-col w-[90%] bg-transparent border-2 border-black rounded-lg  items-center py-4 px-2 text-center">
        <span className="uppercase text-xl text-black font-semibold">
          Try our best sellers
        </span>
        <Recommendations />
      </div>
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
