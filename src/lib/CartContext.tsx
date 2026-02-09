"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { siteContent } from "./siteContent";

export interface CartItemPrices {
  unitario: number;
  mayorista_3: number | null;
  mayorista_10: number | null;
}

export interface CartItem {
  id: string;
  name: string;
  marca: string;
  prices: CartItemPrices;
  image: string;
  qty: number;
}

/* ── Tiered pricing helpers ────────────────────────────────── */
export type PriceTier = "unitario" | "mayorista_3" | "mayorista_10";

export function getPriceTier(totalQty: number): PriceTier {
  if (totalQty >= 10) return "mayorista_10";
  if (totalQty >= 3) return "mayorista_3";
  return "unitario";
}

export function getTierLabel(tier: PriceTier): string {
  switch (tier) {
    case "mayorista_10": return "Mayorista 10+";
    case "mayorista_3": return "Mayorista 3+";
    default: return "Unitario";
  }
}

export function getEffectivePrice(prices: CartItemPrices | undefined, tier: PriceTier): number {
  if (!prices) return 0;
  if (tier === "mayorista_10" && prices.mayorista_10 != null) return prices.mayorista_10;
  if (tier === "mayorista_3" && prices.mayorista_3 != null) return prices.mayorista_3;
  if (tier === "mayorista_10" && prices.mayorista_3 != null) return prices.mayorista_3;
  return prices.unitario ?? 0;
}

/* ── 30-day expiry wrapper around localStorage ─────────────── */
const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const TIMESTAMP_KEY = "bp-cart-ts";

const expiringStorage = createJSONStorage(() => ({
  getItem(key: string) {
    if (typeof window === "undefined") return null;
    const ts = localStorage.getItem(TIMESTAMP_KEY);
    if (ts && Date.now() - Number(ts) > EXPIRY_MS) {
      localStorage.removeItem(key);
      localStorage.removeItem(TIMESTAMP_KEY);
      return null;
    }
    return localStorage.getItem(key);
  },
  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
    localStorage.setItem(TIMESTAMP_KEY, String(Date.now()));
  },
  removeItem(key: string) {
    localStorage.removeItem(key);
    localStorage.removeItem(TIMESTAMP_KEY);
  },
}));

/* ── WhatsApp message builder ──────────────────────────────── */
function buildWhatsAppMessage(items: CartItem[], totalQty: number): string {
  const tier = getPriceTier(totalQty);
  const lines = items
    .map((i) => {
      const unitPrice = getEffectivePrice(i.prices, tier);
      return `• ${i.marca} - ${i.name} x${i.qty} — $${(unitPrice * i.qty).toLocaleString("es-AR")} ($${unitPrice.toLocaleString("es-AR")} c/u)`;
    })
    .join("\n");
  const total = items.reduce((s, i) => s + getEffectivePrice(i.prices, tier) * i.qty, 0);
  const tierLabel = getTierLabel(tier);
  return `Hola Belle Parfumerie! Quiero realizar el siguiente pedido:\n\n${lines}\n\n*Precio: ${tierLabel} (${totalQty} unidades)*\n*Total: $${total.toLocaleString("es-AR")}*\n\nGracias!`;
}

/* ── Zustand store ─────────────────────────────────────────── */
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  addItem: (item: Omit<CartItem, "qty">) => void;
  tier: PriceTier;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  checkout: () => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      setIsOpen: (v) => set({ isOpen: v }),

      addItem: (item) => {
        const { items } = get();
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          set({ items: items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i)), isOpen: true });
        } else {
          set({ items: [...items, { ...item, qty: 1 }], isOpen: true });
        }
      },

      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      updateQty: (id, qty) => {
        if (qty <= 0) {
          set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
          return;
        }
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, qty } : i)) }));
      },

      tier: "unitario" as PriceTier,

      checkout: () => {
        const { items } = get();
        if (items.length === 0) return;
        const totalQty = items.reduce((s, i) => s + i.qty, 0);
        const msg = buildWhatsAppMessage(items, totalQty);
        const url = `https://wa.me/${siteContent.cart.whatsappNumber}?text=${encodeURIComponent(msg)}`;
        window.open(url, "_blank");
      },
    }),
    {
      name: "bp-cart",
      storage: expiringStorage,
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Migrate legacy cart items that had `price` instead of `prices`
        state.items = state.items.map((item) => {
          if (item.prices) return item;
          const legacy = item as unknown as { price?: number };
          const p = legacy.price ?? 0;
          return { ...item, prices: { unitario: p, mayorista_3: null, mayorista_10: null } };
        });
      },
    },
  ),
);

/* ── Public hook — same API as before ──────────────────────── */
export function useCart() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const setIsOpen = useCartStore((s) => s.setIsOpen);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const checkout = useCartStore((s) => s.checkout);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const tier = getPriceTier(count);
  const total = items.reduce((s, i) => s + getEffectivePrice(i.prices, tier) * i.qty, 0);

  return { items, count, total, tier, isOpen, setIsOpen, addItem, removeItem, updateQty, checkout };
}

/* ── CartProvider kept as a passthrough for backward compat ── */
export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
