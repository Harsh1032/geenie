"use client";

import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import AddProductForm from "@/components/AddProductForm";
import UpdateProductForm from "@/components/UpdateProductForm";
import DeleteProductForm from "@/components/DeleteProductForm";
import NewOrder from "@/components/NewOrder";

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Orders");
  const [searchQuery, setSearchQuery] = useState("");

  const [activeAction, setActiveAction] = useState<"add" | "update" | "delete">(
    "add"
  );
  const [orderView, setOrderView] = useState<"current" | "completed">(
    "current"
  );

  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleItemClick = (item: string) => {
    setActiveTab(item);
    if (window.innerWidth < 768) setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="flex md:flex-row h-screen overflow-hidden flex-col">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:relative z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 font-bold text-lg border-b border-gray-700">
          Hotel Admin
        </div>
        <nav className="flex flex-col space-y-2 p-2">
          <button
            onClick={() => handleItemClick("Orders")}
            className={`text-left px-4 py-2 rounded hover:bg-gray-700 ${
              activeTab === "Orders" ? "bg-gray-700" : ""
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => handleItemClick("Add Product")}
            className={`text-left px-4 py-2 rounded hover:bg-gray-700 ${
              activeTab === "Add Product" ? "bg-gray-700" : ""
            }`}
          >
            Add Product
          </button>
        </nav>
      </div>

      {/* Hamburger */}
      <div className="md:hidden p-4">
        <button onClick={toggleSidebar}>
          <Menu size={28} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen w-full flex-col items-center p-6 bg-gray-100">
        {activeTab === "Orders" && (
          <>
            <div className="w-full space-y-4 mb-6">
              {/* Toggle buttons */}
              <div className="flex justify-between">
                <button
                  className={`px-4 py-2 rounded-md ${
                    orderView === "current"
                      ? "bg-orange-500 text-white"
                      : "bg-white"
                  }`}
                  onClick={() => setOrderView("current")}
                >
                  Current Orders
                </button>
                {/* 🔍 Search bar */}
                <input
                  type="text"
                  placeholder="Search by room or phone"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                />
                <button
                  className={`px-4 py-2 rounded-md ${
                    orderView === "completed"
                      ? "bg-orange-500 text-white"
                      : "bg-white"
                  }`}
                  onClick={() => setOrderView("completed")}
                >
                  Completed Orders
                </button>
              </div>
            </div>

            {/* 📦 Orders list */}
            <NewOrder view={orderView} searchQuery={searchQuery} />
          </>
        )}
        {activeTab === "Add Product" && (
          <>
            {/* Buttons to switch views */}
            <div className="flex w-full justify-between mb-6">
              <button
                onClick={() => setActiveAction("add")}
                className={`px-4 py-2 rounded-md ${
                  activeAction === "add"
                    ? "bg-orange-500 text-white w-auto h-auto p-3 border-0 rounded-lg shadow-lg"
                    : "w-auto h-auto p-3 bg-white border-0 rounded-lg shadow-lg hover:bg-orange-500 hover:text-white text-black"
                }`}
              >
                Add Product
              </button>
              <button
                onClick={() => setActiveAction("update")}
                className={`px-4 py-2 rounded-md ${
                  activeAction === "update"
                    ? "bg-orange-500 text-white w-auto h-auto p-3 border-0 rounded-lg shadow-lg"
                    : "w-auto h-auto p-3 bg-white border-0 rounded-lg shadow-lg hover:bg-orange-500 hover:text-white text-black"
                }`}
              >
                Update Product
              </button>
              <button
                onClick={() => setActiveAction("delete")}
                className={`px-4 py-2 rounded-md ${
                  activeAction === "delete"
                    ? "bg-orange-500 text-white w-auto h-auto p-3 border-0 rounded-lg shadow-lg"
                    : "w-auto h-auto p-3 bg-white border-0 rounded-lg shadow-lg hover:bg-orange-500 hover:text-white text-black"
                }`}
              >
                Delete Product
              </button>
            </div>

            {/* Conditional rendering */}
            {activeAction === "add" && <AddProductForm />}
            {activeAction === "update" && <UpdateProductForm />}
            {activeAction === "delete" && <DeleteProductForm />}
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
