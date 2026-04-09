"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CartItem,
  CartStorage,
  CartTotals,
  computeTotals,
  configId,
  localCartStorage,
} from "@/lib/cart";

interface CartContextValue {
  items: CartItem[];
  totals: CartTotals;
  ready: boolean;
  addItem: (item: Omit<CartItem, "id" | "quantity">, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// Storage is injectable so we can swap to Supabase later without touching
// the provider's public API.
export function CartProvider({
  children,
  storage = localCartStorage,
}: {
  children: React.ReactNode;
  storage?: CartStorage;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    storage.load().then((loaded) => {
      if (!cancelled) {
        setItems(loaded);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [storage]);

  useEffect(() => {
    if (ready) storage.save(items);
  }, [items, ready, storage]);

  const addItem: CartContextValue["addItem"] = useCallback((item, quantity = 1) => {
    const id = item.kind === "bottle" ? configId(item.config) : `${item.kind}:${item.name}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, id, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totals = useMemo(() => computeTotals(items), [items]);

  const value = useMemo(
    () => ({ items, totals, ready, addItem, updateQuantity, removeItem, clear }),
    [items, totals, ready, addItem, updateQuantity, removeItem, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
