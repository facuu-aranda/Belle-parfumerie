"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Droplets, AlertTriangle } from "lucide-react";
import { useCart, getEffectivePrice, getDecantPrice, getTierLabel } from "@/lib/CartContext";
import { siteContent } from "@/lib/siteContent";
import SkeletonImage from "./SkeletonImage";

export default function CartDrawer() {
  const { items, count, fullCount, total, tier, isOpen, setIsOpen, removeItem, updateQty, checkout, hasDecantWithoutFull } = useCart();
  const t = siteContent.cart;

  const getItemKey = (item: { id: string; itemType: string }) =>
    item.itemType === "decant" ? `${item.id}__decant` : item.id;

  const getItemPrice = (item: { itemType: string; prices: { unitario: number; mayorista_3: number | null; mayorista_10: number | null } }) =>
    item.itemType === "decant"
      ? getDecantPrice(item as Parameters<typeof getDecantPrice>[0])
      : getEffectivePrice(item.prices, tier);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-70 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-70 flex h-full w-full max-w-md flex-col bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-gold" />
                <h2 className="text-lg font-bold text-foreground">{t.title}</h2>
                {count > 0 && (
                  <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-white">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-rose-light"
              >
                <X className="h-4 w-4 text-foreground" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
                  <ShoppingBag className="h-12 w-12 opacity-30" />
                  <p className="text-sm">{t.empty}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Warning banner if decants without full perfume */}
                  {hasDecantWithoutFull && (
                    <div className="flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning-light p-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                      <p className="text-xs text-foreground">
                        Los decants solo se pueden comprar junto con al menos un perfume completo. Agregá un perfume para continuar.
                      </p>
                    </div>
                  )}
                  <AnimatePresence initial={false}>
                  {items.map((item) => {
                    const key = getItemKey(item);
                    const isDecant = item.itemType === "decant";
                    const price = getItemPrice(item);
                    return (
                      <motion.div
                        key={key}
                        layout
                        initial={{ opacity: 1, x: 0, height: "auto" }}
                        animate={{ opacity: 1, x: 0, height: "auto" }}
                        exit={{ opacity: 0, x: 80, height: 0, marginBottom: 0, padding: 0, overflow: "hidden" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={`flex gap-4 rounded-2xl border p-3 ${isDecant ? "border-lavender/50 bg-lavender-light/30" : "border-border bg-background"}`}
                      >
                        <SkeletonImage
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-16 shrink-0 rounded-xl"
                        />
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-semibold text-foreground">{item.name}</p>
                              {isDecant && (
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-lavender/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-mauve">
                                  <Droplets className="h-2.5 w-2.5" />
                                  Decant
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-violet">${price.toLocaleString("es-AR")} c/u</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQty(key, item.qty - 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-lavender-light"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-[20px] text-center text-sm font-medium text-foreground">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(key, item.qty + 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-lavender-light"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(key)}
                          className="self-start text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-5">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t.subtotal}</span>
                  <span className="text-lg font-bold text-foreground">${total.toLocaleString("es-AR")}</span>
                </div>
                <p className="mb-4 text-[11px] text-muted-foreground">
                  {fullCount > 0 && <>{fullCount} perfume{fullCount !== 1 ? "s" : ""} — Precio {getTierLabel(tier)}</>}
                  {fullCount > 0 && items.some((i) => i.itemType === "decant") && " · "}
                  {items.some((i) => i.itemType === "decant") && <>Decants: precio fijo</>}
                </p>
                <button
                  onClick={checkout}
                  disabled={hasDecantWithoutFull}
                  className={`flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all duration-300 ${
                    hasDecantWithoutFull
                      ? "cursor-not-allowed bg-gray-300 text-gray-500"
                      : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
                  }`}
                  data-cursor="button"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  </svg>
                  {t.checkout}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
