"use client";

import { Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import toast, { Toaster } from 'react-hot-toast';

const AddProductForm = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("essentials");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !category || !image) {
      alert("All fields are required.");
      return;
    }

    setStatus("loading");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price.toString());
    formData.append("category", category);
    formData.append("image", image);

    try {
      const res = await fetch("/api/product", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create product");

      setStatus("success");
      toast.success("Prodcut created successfully");
      // Reset form
      setName("");
      setPrice("");
      setCategory("essentials");
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      setStatus("error");
      
      toast.error("Prodcut couldn't be created");
    } finally {
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="flex justify-center items-start md:items-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md space-y-6"
      >
        <h2 className="text-2xl font-semibold">Add Product</h2>

        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-md"
          />

          <input
            type="number"
            placeholder="Price (₹)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-md"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border border-gray-300 rounded-md"
          >
            <option value="complimentary">Complimentary</option>
            <option value="essentials">Essentials</option>
            <option value="restaurant">Restaurant</option>
          </select>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="p-2 border border-gray-300 rounded-md"
          />

          {imagePreview && (
            <div className="flex items-start gap-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-red-500 hover:underline"
              >
                Remove Image
              </button>
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-lg flex items-center justify-center"
            disabled={status === "loading"}
          >
            {status === "loading"
              ? <Loader2 className="size-6 animate-spin"/>
              : "Create Product"}
          </button>

          {status === "error" && (
            <p className="text-red-500">Failed to create product.</p>
          )}
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export default AddProductForm;
