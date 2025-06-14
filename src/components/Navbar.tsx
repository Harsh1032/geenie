"use client";

import { useState, useEffect, useRef } from "react";
import { Home, Menu, ShoppingCart, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const res = await fetch(
      `/api/product/search?q=${encodeURIComponent(searchQuery)}`
    );
    const data = await res.json();

    if (res.ok && data.product) {
      const category = data.product.category.toLowerCase();
      if (category === "restaurant") router.push("/restaurant");
      else if (category === "complimentary") router.push("/complimentary");
      else if (category === "essentials") router.push("/shop");
      else router.push("/");
    } else {
      alert("Product not found");
    }
  };

  return (
    <nav className="sticky z-[100] h-16 px-2 flex items-center justify-between top-0 w-full bg-[#FFA553] backdrop-blur-lg">
      <Link href="/">
      <img src="./logo2.png" alt="Company Logo" className="w-[100px] h-[35px]" />
      </Link>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(); // same logic as the button click
        }}
        className="flex items-center gap-x-2 border px-2 p-1 rounded-lg"
      >
        <input
          type="text"
          placeholder="Search product..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-2 py-1 rounded-md text-sm w-[130px] outline-none"
        />
        
        <button type="submit">
          <Search className="size-6 text-white" />
        </button>
      </form>
      
        <Link href="/checkout">
          <ShoppingCart className="size-6 text-white" />
        </Link>
      <Menu className="size-6 text-white" onClick={() => setIsOpen(!isOpen)} />
      {/* <div className="flex items-center justify-between">
        <Link href="/">
          <Home className="size-6 text-white" />
        </Link>
        <Link href="/checkout">
          <ShoppingCart className="size-6 text-white" />
        </Link>
      </div> */}

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-16 left-0 w-full bg-[#ffc894] shadow-md border-y-2 border-gray-200 flex flex-col items-center p-5 space-y-4"
        >
          <Link
            href="/"
            className="text-black font-normal text-xl"
            onClick={handleLinkClick}
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="text-black font-normal text-xl"
            onClick={handleLinkClick}
          >
            Essentials
          </Link>
          <Link
            href="/checkout"
            className="text-black font-normal text-xl"
            onClick={handleLinkClick}
          >
            Cart
          </Link>
          <Link
            href="/orderHistory"
            className="text-black font-normal text-xl"
            onClick={handleLinkClick}
          >
            Order History
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
