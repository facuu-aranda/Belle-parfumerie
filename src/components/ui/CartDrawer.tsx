"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart, getEffectivePrice, getTierLabel } from "@/lib/CartContext";
import { siteContent } from "@/lib/siteContent";
import SkeletonImage from "./SkeletonImage";

export default function CartDrawer() {
  const { items, count, total, tier, isOpen, setIsOpen, removeItem, updateQty, checkout } = useCart();
  const t = siteContent.cart;

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
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 rounded-2xl border border-border bg-background p-3"
                    >
                      <SkeletonImage
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-16 shrink-0 rounded-xl"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{item.name}</p>
                          <p className="text-xs text-violet">${getEffectivePrice(item.prices, tier).toLocaleString("es-AR")} c/u</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-lavender-light"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-[20px] text-center text-sm font-medium text-foreground">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-lavender-light"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="self-start text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
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
                  {count} unidad{count !== 1 ? "es" : ""} — Precio {getTierLabel(tier)}
                </p>
                <button
                  onClick={checkout}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-green-600 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-700 hover:shadow-lg"
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
