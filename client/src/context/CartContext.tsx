import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface CartItem {
  listingId: string;
  title: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  subtotal: number;
  imageUrl?: string;
  packaging: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (listingId: string) => void;
  updateQuantity: (listingId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_KEY = "cyberspice_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(newItem: CartItem) {
    setItems((prev) => {
      const exists = prev.find((i) => i.listingId === newItem.listingId);
      if (exists) {
        return prev.map((i) =>
          i.listingId === newItem.listingId
            ? { ...newItem, subtotal: newItem.quantity * newItem.pricePerUnit }
            : i
        );
      }
      return [...prev, newItem];
    });
  }

  function removeItem(listingId: string) {
    setItems((prev) => prev.filter((i) => i.listingId !== listingId));
  }

  function updateQuantity(listingId: string, quantity: number) {
    setItems((prev) =>
      prev.map((i) =>
        i.listingId === listingId
          ? { ...i, quantity, subtotal: quantity * i.pricePerUnit }
          : i
      )
    );
  }

  function clearCart() {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  }

  const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
