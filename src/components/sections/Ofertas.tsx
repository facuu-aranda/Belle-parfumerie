"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { ShoppingCart, ChevronLeft, ChevronRight, X, Minus, Plus } from "lucide-react";
import { siteContent } from "@/lib/siteContent";
import { useCart, type CartItemPrices } from "@/lib/CartContext";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types/product";
import SkeletonImage from "@/components/ui/SkeletonImage";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ProductChips from "@/components/ui/ProductChips";

/* ── Constants ─────────────────────────────────────────────── */
const CARD_W = 280;
const GAP = 24;
const STEP = CARD_W + GAP;
const AUTOPLAY_MS = 4000;
const SLIDE_MS = 450;
const SLIDE_EASE = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

// Modal animation — slow & cinematic
const FLIP_MS = 700;
const FLIP_EASE = "cubic-bezier(0.25, 0.1, 0.25, 1)";
const EXPAND_DELAY = 80;
const CONTENT_REVEAL_MS = 300;

function getOfferPrice(p: Product): number {
  if (p.oferta?.precioOferta != null) return p.oferta.precioOferta;
  if (p.oferta?.porcentajeDesc != null && p.precios?.unitario != null) {
    return Math.round(p.precios.unitario * (1 - p.oferta.porcentajeDesc / 100));
  }
  return p.precios?.unitario ?? 0;
}

function getOfferLabel(p: Product): string {
  return p.oferta?.etiqueta || (p.oferta?.porcentajeDesc ? `${p.oferta.porcentajeDesc}% OFF` : "OFERTA");
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/* ════════════════════════════════════════════════════════════
   OFERTAS — Infinite Carousel + CardFlip Modal
   ════════════════════════════════════════════════════════════ */
export default function Ofertas() {
  const { ofertas } = siteContent;
  const { addItem, tier: cartTier, count: cartCount } = useCart();
  const { products: allProducts } = useProducts();

  /* ── Carousel state ──────────────────────────────────────── */
  const src = allProducts.filter((p) => p.oferta?.activa);
  const items = src.length > 0 ? [...src, ...src, ...src] : [];
  const setLen = src.length || 1;

  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragRef = useRef({ startX: 0, startOffset: 0, dragging: false, didDrag: false });

  const getInitialOffset = useCallback(() => -(setLen * STEP), [setLen]);

  useEffect(() => {
    setOffset(getInitialOffset());
  }, [getInitialOffset]);

  const correctLoop = useCallback(
    (currentOffset: number) => {
      const minOffset = -(setLen * 2 * STEP);
      const maxOffset = 0;
      const oneSetPx = setLen * STEP;
      let corrected = currentOffset;
      if (corrected <= minOffset + STEP) corrected += oneSetPx;
      else if (corrected >= maxOffset - STEP) corrected -= oneSetPx;
      return corrected;
    },
    [setLen]
  );

  const animateTo = useCallback(
    (target: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setOffset(target);
      setTimeout(() => {
        const corrected = correctLoop(target);
        if (corrected !== target) {
          const track = trackRef.current;
          if (track) {
            track.style.transition = "none";
            setOffset(corrected);
            void track.offsetHeight;
            track.style.transition = `transform ${SLIDE_MS}ms ${SLIDE_EASE}`;
          }
        }
        setIsAnimating(false);
      }, SLIDE_MS + 20);
    },
    [isAnimating, correctLoop]
  );

  const goNext = useCallback(() => animateTo(offset - STEP), [offset, animateTo]);
  const goPrev = useCallback(() => animateTo(offset + STEP), [offset, animateTo]);

  /* ── Autoplay ────────────────────────────────────────────── */
  useEffect(() => {
    if (isPaused) {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      return;
    }
    autoplayRef.current = setInterval(() => {
      if (!isAnimating) goNext();
    }, AUTOPLAY_MS);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isPaused, isAnimating, goNext]);

  /* ── Drag / Swipe ────────────────────────────────────────── */
  const onDragStart = (clientX: number) => {
    if (isAnimating) return;
    dragRef.current = { startX: clientX, startOffset: offset, dragging: true, didDrag: false };
    setIsPaused(true);
    const track = trackRef.current;
    if (track) track.style.transition = "none";
  };

  const onDragMove = (clientX: number) => {
    if (!dragRef.current.dragging) return;
    const dx = clientX - dragRef.current.startX;
    if (Math.abs(dx) > 4) dragRef.current.didDrag = true;
    setOffset(dragRef.current.startOffset + dx);
  };

  const onDragEnd = () => {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;
    const track = trackRef.current;
    if (track) track.style.transition = `transform ${SLIDE_MS}ms ${SLIDE_EASE}`;
    const dx = offset - dragRef.current.startOffset;
    const threshold = CARD_W * 0.25;
    if (Math.abs(dx) > threshold) {
      const cards = Math.round(Math.abs(dx) / STEP) || 1;
      animateTo(dragRef.current.startOffset + (dx > 0 ? cards : -cards) * STEP);
    } else {
      animateTo(dragRef.current.startOffset);
    }
    setTimeout(() => setIsPaused(false), 600);
  };

  const handleMouseDown = (e: ReactMouseEvent) => { e.preventDefault(); onDragStart(e.clientX); };
  const handleMouseMove = (e: ReactMouseEvent) => onDragMove(e.clientX);
  const handleMouseUp = () => onDragEnd();
  const handleTouchStart = (e: ReactTouchEvent) => onDragStart(e.touches[0].clientX);
  const handleTouchMove = (e: ReactTouchEvent) => onDragMove(e.touches[0].clientX);
  const handleTouchEnd = () => onDragEnd();

  /* ── CardFlip Modal ──────────────────────────────────────── */
  // Phases: null → "flip-open" → "expanded" → "reveal" → "open"
  //         "open" → "flip-close" → null
  type ModalPhase = "flip-open" | "expanded" | "reveal" | "open" | "flip-close";
  const [flipState, setFlipState] = useState<null | {
    product: Product;
    rect: DOMRect;
    phase: ModalPhase;
  }>(null);
  const [modalQty, setModalQty] = useState(1);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const flipContainerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (flipState) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [flipState]);

  // Compute modal target geometry
  const getModalGeometry = () => {
    if (typeof window === "undefined") return { w: 700, h: 460, x: 0, y: 0 };
    const w = clamp(window.innerWidth * 0.85, 340, 780);
    const h = clamp(window.innerHeight * 0.82, 360, 640);
    return { w, h, x: (window.innerWidth - w) / 2, y: (window.innerHeight - h) / 2 };
  };

  const openFlip = (product: Product, cardEl: HTMLDivElement) => {
    if (dragRef.current.didDrag) return; // don't open if user was dragging
    const rect = cardEl.getBoundingClientRect();
    setModalQty(1);
    setFlipState({ product, rect, phase: "flip-open" });
  };

  // Phase machine driven by useEffect
  useEffect(() => {
    if (!flipState) return;
    const { phase } = flipState;
    const el = flipContainerRef.current;
    if (!el) return;

    if (phase === "flip-open") {
      // Phase 1: flip + resize — slow & cinematic
      void el.offsetHeight; // force reflow at card position
      const { w, h, x, y } = getModalGeometry();
      requestAnimationFrame(() => {
        el.style.transition = [
          `top ${FLIP_MS}ms ${FLIP_EASE}`,
          `left ${FLIP_MS}ms ${FLIP_EASE}`,
          `width ${FLIP_MS}ms ${FLIP_EASE}`,
          `height ${FLIP_MS}ms ${FLIP_EASE}`,
          `transform ${FLIP_MS}ms ${FLIP_EASE}`,
          `border-radius ${FLIP_MS}ms ${FLIP_EASE}`,
        ].join(", ");
        el.style.top = `${y}px`;
        el.style.left = `${x}px`;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.transform = "perspective(1200px) rotateY(180deg)";
      });
      // After flip+resize completes → "expanded"
      const t = setTimeout(() => {
        setFlipState((p) => (p ? { ...p, phase: "expanded" } : null));
      }, FLIP_MS + 40);
      return () => clearTimeout(t);
    }

    if (phase === "expanded") {
      // Phase 2: brief settle, then reveal content
      const t = setTimeout(() => {
        setFlipState((p) => (p ? { ...p, phase: "reveal" } : null));
      }, EXPAND_DELAY);
      return () => clearTimeout(t);
    }

    if (phase === "reveal") {
      // Phase 3: content fades in with blur-out
      const t = setTimeout(() => {
        setFlipState((p) => (p ? { ...p, phase: "open" } : null));
      }, CONTENT_REVEAL_MS + 60);
      return () => clearTimeout(t);
    }

    if (phase === "flip-close") {
      // Reverse: hide content instantly, then flip back
      const { rect } = flipState;
      void el.offsetHeight;
      requestAnimationFrame(() => {
        el.style.transition = [
          `top ${FLIP_MS}ms ${FLIP_EASE}`,
          `left ${FLIP_MS}ms ${FLIP_EASE}`,
          `width ${FLIP_MS}ms ${FLIP_EASE}`,
          `height ${FLIP_MS}ms ${FLIP_EASE}`,
          `transform ${FLIP_MS}ms ${FLIP_EASE}`,
          `border-radius ${FLIP_MS}ms ${FLIP_EASE}`,
        ].join(", ");
        el.style.top = `${rect.top}px`;
        el.style.left = `${rect.left}px`;
        el.style.width = `${rect.width}px`;
        el.style.height = `${rect.height}px`;
        el.style.transform = "perspective(1200px) rotateY(0deg)";
      });
      const t = setTimeout(() => {
        setFlipState(null);
      }, FLIP_MS + 40);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipState?.phase]);

  const closeFlip = () => {
    if (!flipState) return;
    setFlipState((p) => (p ? { ...p, phase: "flip-close" } : null));
  };

  const getOfferPrices = (p: Product): CartItemPrices => {
    const hasPercent = p.oferta?.porcentajeDesc != null;
    const disc = p.oferta?.porcentajeDesc ?? 0;
    return {
      unitario: getOfferPrice(p),
      mayorista_3: p.precios?.mayorista_3 != null
        ? (hasPercent ? Math.round(p.precios.mayorista_3 * (1 - disc / 100)) : p.precios.mayorista_3)
        : null,
      mayorista_10: p.precios?.mayorista_10 != null
        ? (hasPercent ? Math.round(p.precios.mayorista_10 * (1 - disc / 100)) : p.precios.mayorista_10)
        : null,
    };
  };

  const handleAddFromModal = () => {
    if (!flipState) return;
    const p = flipState.product;
    const itemPrices = getOfferPrices(p);
    for (let i = 0; i < modalQty; i++) {
      addItem({
        id: p.id,
        name: p.nombre,
        marca: p.marca,
        prices: itemPrices,
        image: p.imagen ?? "",
      });
    }
  };

  // Is content visible? Only in reveal/open phases
  const contentVisible = flipState?.phase === "reveal" || flipState?.phase === "open";
  const isClosing = flipState?.phase === "flip-close";

  // Flip container initial style (card position)
  const getFlipInitialStyle = (): React.CSSProperties => {
    if (!flipState) return { display: "none" };
    const { rect } = flipState;
    return {
      position: "fixed",
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      zIndex: 60,
      perspective: 1200,
      transformStyle: "preserve-3d",
      transform: "perspective(1200px) rotateY(0deg)",
      borderRadius: 22,
    };
  };

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <section
      id="ofertas"
      className="bg-rose-light py-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        if (!dragRef.current.dragging) setIsPaused(false);
      }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Header + navigation controls */}
        <div className="mb-12 flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between">
          <AnimatedSection className="text-center sm:text-left">
            <h2 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
              {ofertas.title}
            </h2>
            <p className="max-w-xl text-muted-foreground">{ofertas.subtitle}</p>
          </AnimatedSection>

          <div className="flex items-center gap-3">
            <button
              onClick={goPrev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all duration-300 hover:border-violet hover:bg-lavender-light hover:shadow-md"
              aria-label="Anterior"
              data-cursor="button"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all duration-300 hover:border-violet hover:bg-lavender-light hover:shadow-md"
              aria-label="Siguiente"
              data-cursor="button"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Carousel viewport ──────────────────────────────── */}
      {/* overflow-x clips horizontally, but py-8 + overflow-y-visible
          ensures cards + shadows + scale are never clipped vertically */}
      <div className="ofertas-viewport relative" style={{ overflowX: 'clip', overflowY: 'visible' }}>
        {/* Fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-rose-light to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-rose-light to-transparent sm:w-24" />

        {/* Track wrapper — overflow-x hidden, overflow-y visible for shadows */}
        <div
          className="cursor-grab active:cursor-grabbing select-none"
          style={{ overflow: "clip visible" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* py-10 gives room for shadow + hover scale + badges without clipping */}
          <div
            ref={trackRef}
            className="flex will-change-transform py-10"
            style={{
              gap: `${GAP}px`,
              transform: `translate3d(${offset}px, 0, 0)`,
              transition: `transform ${SLIDE_MS}ms ${SLIDE_EASE}`,
            }}
          >
            {items.map((product, i) => {
              const key = `${product.id}-${i}`;
              const outOfStock = product.stock <= 0;
              return (
                <div
                  key={key}
                  ref={(el) => { if (el) cardRefs.current.set(key, el); }}
                  onClick={() => {
                    const el = cardRefs.current.get(key);
                    if (el) openFlip(product, el);
                  }}
                  className="group shrink-0 cursor-pointer rounded-[22px] bg-card shadow-md ring-1 ring-border transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-violet/20"
                  style={{ width: CARD_W, willChange: 'transform' }}
                  data-cursor="card"
                >
                  {/* Image */}
                  <div className={`relative aspect-4/5 overflow-hidden rounded-t-[22px] transition-[filter] duration-500 ${outOfStock ? "grayscale group-hover:grayscale-0" : ""}`}>
                    <SkeletonImage
                      src={product.imagen ?? ""}
                      alt={product.nombre}
                      className="h-full w-full transition-transform duration-500 group-hover:scale-110"
                    />
                    {outOfStock ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="rounded-full bg-black/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                          Sin stock
                        </span>
                      </div>
                    ) : (
                      <span className="absolute left-3 top-3 rounded-full bg-btn-primary px-3 py-1 text-[11px] font-bold text-btn-primary-text shadow-md">
                        {getOfferLabel(product)}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      {product.nombre}
                    </h3>
                    <div className="mb-4 flex items-center gap-2">
                      <span className="text-lg font-bold text-violet">${getOfferPrice(product).toLocaleString("es-AR")}</span>
                      {product.precios?.unitario != null && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${product.precios.unitario.toLocaleString("es-AR")}
                        </span>
                      )}
                    </div>
                    <button
                      disabled={outOfStock}
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem({
                          id: product.id,
                          name: product.nombre,
                          marca: product.marca,
                          prices: {
                            unitario: getOfferPrice(product),
                            mayorista_3: product.precios?.mayorista_3 != null && product.oferta?.porcentajeDesc != null
                              ? Math.round(product.precios.mayorista_3 * (1 - product.oferta.porcentajeDesc / 100))
                              : product.precios?.mayorista_3 ?? null,
                            mayorista_10: product.precios?.mayorista_10 != null && product.oferta?.porcentajeDesc != null
                              ? Math.round(product.precios.mayorista_10 * (1 - product.oferta.porcentajeDesc / 100))
                              : product.precios?.mayorista_10 ?? null,
                          },
                          image: product.imagen ?? "",
                        });
                      }}
                      className={`flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-xs font-semibold transition-all duration-300 ${
                        outOfStock
                          ? "cursor-not-allowed border border-border text-muted-foreground"
                          : "border border-violet/30 text-violet hover:bg-btn-primary hover:text-btn-primary-text hover:shadow-lg hover:shadow-violet/20"
                      }`}
                      data-cursor={outOfStock ? undefined : "button"}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      {outOfStock ? "Sin stock" : ofertas.addToCart}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
           CardFlip 3D Modal — FLIP technique
           Phases: flip-open → expanded → reveal → open → flip-close
           ══════════════════════════════════════════════════════════ */}
      {flipState && (
        <>
          {/* Backdrop — soft, fades with close */}
          <div
            className="fixed inset-0 z-50"
            style={{
              backgroundColor: "rgba(0,0,0,0.38)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              opacity: isClosing ? 0 : 1,
              transition: `opacity ${FLIP_MS}ms ${FLIP_EASE}`,
            }}
            onClick={closeFlip}
          />

          {/* Flip container — preserve-3d for proper face visibility */}
          <div
            ref={flipContainerRef}
            style={getFlipInitialStyle()}
          >
            {/* ── FRONT face (card replica) ── */}
            <div
              className="absolute inset-0 overflow-hidden rounded-[22px] bg-card shadow-xl ring-1 ring-border"
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            >
              <div className="relative h-3/5 overflow-hidden">
                <SkeletonImage
                  src={flipState.product.imagen ?? ""}
                  alt={flipState.product.nombre}
                  className="h-full w-full"
                />
                <span className="absolute left-3 top-3 rounded-full bg-btn-primary px-3 py-1 text-[11px] font-bold text-btn-primary-text shadow-md">
                  {getOfferLabel(flipState.product)}
                </span>
              </div>
              <div className="p-5">
                <h3 className="mb-1 text-sm font-semibold text-foreground">
                  {flipState.product.nombre}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-violet">${getOfferPrice(flipState.product).toLocaleString("es-AR")}</span>
                  {flipState.product.precios?.unitario != null && (
                    <span className="text-xs text-muted-foreground line-through">${flipState.product.precios.unitario.toLocaleString("es-AR")}</span>
                  )}
                </div>
              </div>
            </div>

            {/* ── BACK face — counter-rotated so content reads normally ── */}
            <div
              className="absolute inset-0 overflow-hidden rounded-[22px]"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {/* ── Shimmer / Glitter placeholder (visible during flip) ── */}
              <div
                className="absolute inset-0 z-10 rounded-[22px]"
                style={{
                  opacity: contentVisible ? 0 : 1,
                  transition: `opacity ${CONTENT_REVEAL_MS}ms ease-out`,
                  pointerEvents: contentVisible ? "none" : "auto",
                  background: "linear-gradient(135deg, var(--rose-light) 0%, var(--lavender-light) 40%, var(--cream) 70%, var(--rose) 100%)",
                }}
              >
                {/* Diagonal shimmer sweep — slow & elegant */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.35) 55%, transparent 80%)",
                    backgroundSize: "200% 200%",
                    animation: "ofertas-shimmer 2.8s ease-in-out infinite",
                  }}
                />
                {/* Gold shimmer — perpendicular, slower */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(240deg, transparent 25%, rgba(212,168,67,0.18) 45%, rgba(232,200,106,0.25) 50%, rgba(212,168,67,0.18) 55%, transparent 75%)",
                    backgroundSize: "200% 200%",
                    animation: "ofertas-shimmer 3.6s ease-in-out 0.5s infinite",
                    opacity: 0.7,
                  }}
                />
                {/* Sparkle dots — gold premium feel */}
                <div className="absolute inset-0 overflow-hidden">
                  {[
                    { top: "15%", left: "20%", delay: "0s", size: 3 },
                    { top: "30%", left: "60%", delay: "0.5s", size: 2.5 },
                    { top: "55%", left: "35%", delay: "1.0s", size: 3 },
                    { top: "22%", left: "78%", delay: "1.5s", size: 2 },
                    { top: "68%", left: "68%", delay: "0.7s", size: 2.5 },
                    { top: "45%", left: "12%", delay: "1.2s", size: 3 },
                    { top: "80%", left: "45%", delay: "0.3s", size: 2 },
                    { top: "10%", left: "50%", delay: "1.8s", size: 2 },
                  ].map((dot, idx) => (
                    <div
                      key={idx}
                      className="absolute rounded-full"
                      style={{
                        top: dot.top,
                        left: dot.left,
                        width: dot.size,
                        height: dot.size,
                        opacity: 0,
                        background: "radial-gradient(circle, rgba(232,200,106,0.9) 0%, rgba(184,134,11,0.35) 100%)",
                        boxShadow: "0 0 5px 1px rgba(212,168,67,0.3)",
                        animation: `ofertas-sparkle 3s ease-in-out ${dot.delay} infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* ── Actual modal content (fades in after flip with blur-out) ── */}
              <div
                className="absolute inset-0 flex flex-row overflow-hidden rounded-[22px] bg-card shadow-2xl ring-1 ring-border"
                style={{
                  opacity: contentVisible ? 1 : 0,
                  filter: contentVisible ? "blur(0px)" : "blur(12px)",
                  transition: `opacity ${CONTENT_REVEAL_MS}ms ease-out, filter ${CONTENT_REVEAL_MS}ms ease-out`,
                  visibility: (flipState?.phase === "flip-open") ? "hidden" : "visible",
                }}
              >
                {/* Image — left 40% */}
                <div className="relative w-2/5 shrink-0 overflow-hidden p-4">
                  <SkeletonImage
                    src={flipState.product.imagen ?? ""}
                    alt={flipState.product.nombre}
                    className="h-full w-full rounded-xl"
                  />
                  <span className="absolute left-7 top-7 rounded-full bg-btn-primary px-3 py-1 text-[11px] font-bold text-btn-primary-text shadow-md">
                    {getOfferLabel(flipState.product)}
                  </span>
                </div>

                {/* Info — right 60% */}
                <div className="flex flex-1 flex-col justify-between overflow-y-auto p-5 sm:p-6">
                  <div>
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                          {flipState.product.nombre}
                        </h3>
                        {flipState.product.stock <= 0 && (
                          <span className="rounded-full bg-black/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                            Sin stock
                          </span>
                        )}
                      </div>
                      <button
                        onClick={closeFlip}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-rose-light hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mb-4 flex items-center gap-3">
                      <span className="text-2xl font-bold text-violet">
                        ${getOfferPrice(flipState.product).toLocaleString("es-AR")}
                      </span>
                      {flipState.product.precios?.unitario != null && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${flipState.product.precios.unitario.toLocaleString("es-AR")}
                        </span>
                      )}
                      <span className="rounded-full bg-rose px-2.5 py-0.5 text-[11px] font-bold text-foreground">
                        {getOfferLabel(flipState.product)}
                      </span>
                    </div>

                    <p className="mb-3 text-sm text-violet">
                      {flipState.product.marca} · {flipState.product.concentracion ?? ""} · {flipState.product.volumen ?? ""}
                    </p>

                    <ProductChips product={flipState.product} />

                    {/* Notes */}
                    {flipState.product.notas && (
                      <div className="mb-4 rounded-2xl bg-background p-4">
                        <p className="text-xs text-muted-foreground">{flipState.product.notas}</p>
                      </div>
                    )}

                    {/* Tiered pricing */}
                    {(() => {
                      const op = getOfferPrices(flipState.product);
                      return (op.mayorista_3 != null || op.mayorista_10 != null) ? (
                        <div className="mb-2 rounded-2xl bg-background p-4">
                          <p className="mb-2 text-xs font-semibold text-muted-foreground">Precios por cantidad (con oferta)</p>
                          <div className="space-y-1.5">
                            <div className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm ${cartTier === "unitario" ? "bg-violet/10 font-bold text-violet" : "text-foreground"}`}>
                              <span>1-2 unidades</span>
                              <span>${op.unitario.toLocaleString("es-AR")}</span>
                            </div>
                            {op.mayorista_3 != null && (
                              <div className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm ${cartTier === "mayorista_3" ? "bg-violet/10 font-bold text-violet" : "text-foreground"}`}>
                                <span>3-9 unidades</span>
                                <span>${op.mayorista_3.toLocaleString("es-AR")}</span>
                              </div>
                            )}
                            {op.mayorista_10 != null && (
                              <div className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm ${cartTier === "mayorista_10" ? "bg-violet/10 font-bold text-violet" : "text-foreground"}`}>
                                <span>10+ unidades</span>
                                <span>${op.mayorista_10.toLocaleString("es-AR")}</span>
                              </div>
                            )}
                          </div>
                          {cartCount > 0 && (
                            <p className="mt-2 text-[10px] text-muted-foreground">
                              Tu carrito tiene {cartCount} unidad{cartCount !== 1 ? "es" : ""} — precio activo resaltado
                            </p>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>

                  {/* Qty + Add to cart */}
                  <div className="border-t border-border pt-5">
                    {flipState.product.stock <= 0 ? (
                      <p className="text-center text-sm font-semibold text-muted-foreground">Producto sin stock actualmente</p>
                    ) : (
                      <>
                        <div className="mb-4 flex items-center gap-4">
                          <span className="text-xs font-semibold text-muted-foreground">Cantidad</span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-lavender-light"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-6 text-center text-sm font-bold text-foreground">
                              {modalQty}
                            </span>
                            <button
                              onClick={() => setModalQty(modalQty + 1)}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-lavender-light"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={handleAddFromModal}
                          className="flex w-full items-center justify-center gap-2 rounded-full bg-btn-primary py-3 text-sm font-semibold text-btn-primary-text transition-all duration-300 hover:bg-btn-primary-hover hover:shadow-lg hover:shadow-violet/25"
                          data-cursor="button"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          {ofertas.addToCart}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Keyframes for shimmer & sparkle ── */}
      <style>{`
        @keyframes ofertas-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes ofertas-sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          40% { opacity: 0.55; transform: scale(1.1); }
          60% { opacity: 0.45; transform: scale(1.15); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
      `}</style>
    </section>
  );
}
