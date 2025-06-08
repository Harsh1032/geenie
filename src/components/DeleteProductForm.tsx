"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  subCategory: string;
  imageUrl: string;
  disabled?: boolean;
}

const DeleteProductForm = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmAction, setConfirmAction] = useState<"disable" | "enable" | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/product");
      const data = await res.json();
      setProducts(data.products);
    };
    fetchProducts();
  }, []);

  const handleToggle = (product: Product) => {
    setSelectedProduct(product);
    setConfirmAction(product.disabled ? "enable" : "disable");
  };

  const confirmToggle = async () => {
    if (!selectedProduct) return;

    const newDisabledValue = confirmAction === "disable";

    const res = await fetch(`/api/product/disable/${selectedProduct._id}`, {
      method: "PUT",
      body: JSON.stringify({ disabled: newDisabledValue }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const updated = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p._id === updated.product._id ? updated.product : p))
      );
      setSelectedProduct(null);
      setConfirmAction(null);
    } else {
      const text = await res.text();
      toast.error("Failed to update: " + text);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setConfirmAction(null);
  };

  const filteredProducts =
    filterCategory === "all"
      ? products
      : products.filter((p) => p.category === filterCategory);

  return (
    <>
      {/* Category Filter */}
      <div className="mb-4 flex gap-2 items-center">
        <label className="font-medium text-sm">Filter by category:</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="all">All</option>
          {[...new Set(products.map((p) => p.category))].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Product Cards */}
      <div className="space-y-4 w-full">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className={`bg-white shadow p-4 rounded-lg w-full flex items-center justify-between ${
              product.disabled ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <p className="text-lg font-semibold">{product.name}</p>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>
            </div>

            <button
              onClick={() => handleToggle(product)}
              className={`${
                product.disabled
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-500 hover:bg-red-600"
              } text-white px-4 py-1 rounded`}
            >
              {product.disabled ? "Re-enable" : "Disable"}
            </button>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">
              {confirmAction === "disable"
                ? "Disable this product?"
                : "Re-enable this product?"}
            </h2>
            <p className="mb-4 text-gray-600">
              Are you sure you want to {confirmAction}{" "}
              <strong>{selectedProduct.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggle}
                className={`px-4 py-2 ${
                  confirmAction === "disable"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-600 hover:bg-green-700"
                } text-white rounded`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default DeleteProductForm;
