"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type CartItem = {
  _id: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ Load cart from localStorage on first load
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

const addToCart = (item: CartItem) => {
  setCart((prev) => {
    const exists = prev.find((p) => p._id === item._id);
    if (exists) {
      const newQuantity = exists.quantity + item.quantity;
      if (newQuantity <= 0) {
        // remove item
        return prev.filter((p) => p._id !== item._id);
      }
      return prev.map((p) =>
        p._id === item._id ? { ...p, quantity: newQuantity } : p
      );
    }
    return [...prev, item];
  });
};


  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart"); // ✅ clear storage too
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("CartContext must be used inside CartProvider");
  return context;
};
