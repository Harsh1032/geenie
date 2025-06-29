"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  subCategory: string;
  description: string;
  imageUrl: string;
}

const UpdateProductForm = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/product");
      const data = await res.json();
      setProducts(data.products);
    };
    fetchProducts();
  }, []);

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      subCategory: product.subCategory,
      description: product.description,
      image: null,
    });
    setPreviewUrl(null);
  };

  const closeModal = () => {
    setEditingProduct(null);
    setPreviewUrl(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (id: string) => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("subCategory", form.subCategory);
    formData.append("description", form.description);
    if (form.image) formData.append("image", form.image);

    const res = await fetch(`/api/product/update/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      toast.success("Product updated!");
      const updated = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? updated.product : p))
      );
      closeModal();
    } else {
      const err = await res.json();
      alert("Error: " + err.error);
    }
  };

  const filteredProducts =
    filterCategory === "all"
      ? products
      : products.filter((p) => p.category === filterCategory);

  return (
    <>
      {/* Category Filter */}
      <div className="mb-4 flex gap-2 items-center ">
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

      <div className="space-y-4 w-full">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow p-4 rounded-lg w-full flex items-center justify-between"
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
              onClick={() => openEditModal(product)}
              className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600"
            >
              Update
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">Update Product</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(editingProduct._id);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="subCategory"
                value={form.subCategory}
                onChange={handleChange}
                placeholder="Subcategory"
                className="w-full p-2 border rounded"
              />
              <textarea
                name="description"
                placeholder="description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />

              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-[150px] object-cover rounded"
                />
              )}

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default UpdateProductForm;
