// Cart domain types and a storage abstraction.
//
// Today the cart is persisted in localStorage. The `CartStorage` interface
// is designed so it can be swapped for a Supabase-backed implementation
// later (e.g. a `supabaseCartStorage` that reads/writes a `carts` table
// keyed by user/session id) without touching components.
//
// Stripe: `CartItem.unitPrice` is in CAD dollars; when wiring Stripe
// Checkout, convert to cents and pass each line as a `price_data` object
// (or look up existing `price` IDs by product+config hash).

import type { ProteinBase, FlavorOption, Addon, Sweetener } from "./types";

export const MIN_ORDER_QTY = 6;
export const TAX_RATE = 0.13;

// A configured bottle: one "product" in the cart today. Built to allow
// other product kinds (merch, sample packs, etc.) later via `kind`.
export interface BottleConfig {
  base: ProteinBase;
  flavors: FlavorOption[];
  addons: Addon[];
  sweetener: Sweetener;
}

export interface BottleLineItem {
  label: string;
  price: number; // CAD
}

export interface CartItem {
  id: string;              // stable id for this configuration
  kind: "bottle";          // extend with other product kinds later
  name: string;            // e.g. "Whey Isolate bottle"
  description: string;     // e.g. "Vanilla Bean, Matcha + 2 add-ons"
  config: BottleConfig;
  lineItems: BottleLineItem[]; // breakdown for display / Stripe
  unitPrice: number;       // CAD, pre-tax
  quantity: number;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;         // subtotal + tax (shipping added at checkout)
  meetsMinimum: boolean;
  minQty: number;
}

export function computeTotals(items: CartItem[]): CartTotals {
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const tax = subtotal * TAX_RATE;
  return {
    itemCount,
    subtotal,
    tax,
    total: subtotal + tax,
    meetsMinimum: itemCount >= MIN_ORDER_QTY,
    minQty: MIN_ORDER_QTY,
  };
}

// Deterministic id from config so repeat adds merge quantities.
export function configId(config: BottleConfig): string {
  const flavors = [...config.flavors].sort().join(",");
  const addons = [...config.addons].sort().join(",");
  return `bottle:${config.base}:${config.sweetener}:${flavors}:${addons}`;
}

// ── Storage abstraction ──────────────────────────────────────────────────
export interface CartStorage {
  load(): Promise<CartItem[]>;
  save(items: CartItem[]): Promise<void>;
}

const STORAGE_KEY = "bottein_cart_v1";

export const localCartStorage: CartStorage = {
  async load() {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
    } catch {
      return [];
    }
  },
  async save(items) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  },
};
