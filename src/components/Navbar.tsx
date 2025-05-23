"use client";

import { useState, useEffect, useRef } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu when clicking outside
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

  // Close menu after link click
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="sticky z-[100] h-16 px-2 flex items-center justify-between top-0 w-full border-b border-gray-200 bg-white backdrop-blur-lg">
      <img src="./logo.jpeg" alt="Company Logo" className="w-[50px] h-[50px]" />

      <input
        type="text"
        placeholder="Search product"
        className="mx-4 px-4 py-1 rounded-md border border-gray-300 focus:outline-none text-sm w-[150px]"
      />

      <Menu className="size-7" onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-16 left-0 w-full bg-white shadow-md border-t border-gray-100 flex flex-col items-center p-5 space-y-4"
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
            Shop
          </Link>
          <Link
            href="/checkout"
            className="text-black font-normal text-xl"
            onClick={handleLinkClick}
          >
            Cart
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
