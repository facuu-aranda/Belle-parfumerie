"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { siteContent } from "./siteContent";

export type CartItemType = "full" | "decant";

export interface CartItemPrices {
  unitario: number;
  mayorista_3: number | null;
  mayorista_10: number | null;
}

export interface CartItem {
  id: string;
  itemType: CartItemType;
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

/* ── Decant helpers ────────────────────────────────────────── */
export function hasFullPerfume(items: CartItem[]): boolean {
  return items.some((i) => i.itemType === "full" && i.qty > 0);
}

export function getDecantPrice(item: CartItem): number {
  return item.prices.unitario;
}

/* ── WhatsApp message builder ──────────────────────────────── */
function buildWhatsAppMessage(items: CartItem[]): string {
  const fullItems = items.filter((i) => i.itemType === "full");
  const decantItems = items.filter((i) => i.itemType === "decant");
  const fullQty = fullItems.reduce((s, i) => s + i.qty, 0);
  const tier = getPriceTier(fullQty);

  let msg = "Hola Belle Parfumerie! Quiero realizar el siguiente pedido:\n\n";

  if (fullItems.length > 0) {
    const tierLabel = getTierLabel(tier);
    msg += `*Perfumes (${tierLabel} — ${fullQty} unid.):*\n`;
    const fullLines = fullItems.map((i) => {
      const unitPrice = getEffectivePrice(i.prices, tier);
      return `• ${i.marca} - ${i.name} x${i.qty} — $${(unitPrice * i.qty).toLocaleString("es-AR")} ($${unitPrice.toLocaleString("es-AR")} c/u)`;
    }).join("\n");
    msg += fullLines;
  }

  if (decantItems.length > 0) {
    if (fullItems.length > 0) msg += "\n\n";
    msg += "*Decants:*\n";
    const decantLines = decantItems.map((i) => {
      const price = getDecantPrice(i);
      return `• ${i.marca} - ${i.name} (decant) x${i.qty} — $${(price * i.qty).toLocaleString("es-AR")} ($${price.toLocaleString("es-AR")} c/u)`;
    }).join("\n");
    msg += decantLines;
  }

  const fullTotal = fullItems.reduce((s, i) => s + getEffectivePrice(i.prices, tier) * i.qty, 0);
  const decantTotal = decantItems.reduce((s, i) => s + getDecantPrice(i) * i.qty, 0);
  const grandTotal = fullTotal + decantTotal;

  msg += `\n\n*Total: $${grandTotal.toLocaleString("es-AR")}*\n\nGracias!`;
  return msg;
}

/* ── Zustand store ─────────────────────────────────────────── */
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  addItem: (item: Omit<CartItem, "qty" | "itemType"> & { itemType?: CartItemType }) => void;
  addDecant: (item: Omit<CartItem, "qty" | "itemType">) => void;
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
        const cartId = item.id;
        const existing = items.find((i) => i.id === cartId && i.itemType === (item.itemType ?? "full"));
        if (existing) {
          set({ items: items.map((i) => (i.id === cartId && i.itemType === existing.itemType ? { ...i, qty: i.qty + 1 } : i)), isOpen: true });
        } else {
          set({ items: [...items, { ...item, itemType: item.itemType ?? "full", qty: 1 }], isOpen: true });
        }
      },

      addDecant: (item) => {
        const { items } = get();
        const decantId = item.id;
        const existing = items.find((i) => i.id === decantId && i.itemType === "decant");
        if (existing) {
          set({ items: items.map((i) => (i.id === decantId && i.itemType === "decant" ? { ...i, qty: i.qty + 1 } : i)), isOpen: true });
        } else {
          set({ items: [...items, { ...item, itemType: "decant", qty: 1 }], isOpen: true });
        }
      },

      removeItem: (id) => {
        set((s) => {
          const target = s.items.find((i) => i.id === id || `${i.id}__${i.itemType}` === id);
          if (!target) return s;
          const newItems = s.items.filter((i) => i !== target);
          // If removing the last full perfume, also remove all decants
          const hasAnyFull = newItems.some((i) => i.itemType === "full");
          return { items: hasAnyFull ? newItems : newItems.filter((i) => i.itemType !== "decant") };
        });
      },

      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set((s) => ({
          items: s.items.map((i) => {
            if (i.id === id || `${i.id}__${i.itemType}` === id) {
              // Match by composite key for decants
              const compositeMatch = `${i.id}__${i.itemType}` === id;
              const directMatch = i.id === id && i.itemType === "full";
              if (compositeMatch || directMatch) return { ...i, qty };
            }
            return i;
          }),
        }));
      },

      tier: "unitario" as PriceTier,

      checkout: () => {
        const { items } = get();
        if (items.length === 0) return;
        // Validate: decants require at least 1 full perfume
        const hasDecants = items.some((i) => i.itemType === "decant");
        const hasFull = items.some((i) => i.itemType === "full");
        if (hasDecants && !hasFull) return;
        const msg = buildWhatsAppMessage(items);
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
        // Migrate legacy cart items
        state.items = state.items.map((item) => {
          let migrated = item;
          // Legacy: `price` instead of `prices`
          if (!migrated.prices) {
            const legacy = migrated as unknown as { price?: number };
            const p = legacy.price ?? 0;
            migrated = { ...migrated, prices: { unitario: p, mayorista_3: null, mayorista_10: null } };
          }
          // Legacy: no itemType field
          if (!migrated.itemType) {
            migrated = { ...migrated, itemType: "full" };
          }
          return migrated;
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
  const addDecant = useCartStore((s) => s.addDecant);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const checkout = useCartStore((s) => s.checkout);

  const fullItems = items.filter((i) => i.itemType === "full");
  const decantItems = items.filter((i) => i.itemType === "decant");
  const fullCount = fullItems.reduce((s, i) => s + i.qty, 0);
  const decantCount = decantItems.reduce((s, i) => s + i.qty, 0);
  const count = fullCount + decantCount;
  const tier = getPriceTier(fullCount);
  const fullTotal = fullItems.reduce((s, i) => s + getEffectivePrice(i.prices, tier) * i.qty, 0);
  const decantTotal = decantItems.reduce((s, i) => s + getDecantPrice(i) * i.qty, 0);
  const total = fullTotal + decantTotal;
  const hasDecantWithoutFull = decantItems.length > 0 && fullItems.length === 0;

  return { items, fullItems, decantItems, count, fullCount, decantCount, total, tier, isOpen, setIsOpen, addItem, addDecant, removeItem, updateQty, checkout, hasDecantWithoutFull };
}

/* ── CartProvider kept as a passthrough for backward compat ── */
export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
