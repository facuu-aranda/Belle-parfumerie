"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ShoppingCart, Minus, Plus, Droplets, LayoutGrid, List } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteContent } from "@/lib/siteContent";
import { useCart, type CartItemPrices } from "@/lib/CartContext";
import { useProducts } from "@/hooks/useProducts";
import type { Product, Temporada, Horario, Ocasion, Edad } from "@/types/product";
import SkeletonImage from "@/components/ui/SkeletonImage";
import ProductChips from "@/components/ui/ProductChips";

/* ── CardFlip animation constants (same as Ofertas) ── */
const FLIP_MS = 700;
const FLIP_EASE = "cubic-bezier(0.25, 0.1, 0.25, 1)";
const EXPAND_DELAY = 80;
const CONTENT_REVEAL_MS = 300;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default function CatalogoPage() {
  const { catalogo } = siteContent;
  const { addItem, addDecant, tier: cartTier, count: cartCount } = useCart();
  const { products: firebaseProducts } = useProducts();

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [qty, setQty] = useState(1);
  const [decantQty, setDecantQty] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  /* ── Filter state ── */
  const [fGenero, setFGenero] = useState("Todas");
  const [fEstilo, setFEstilo] = useState("Todas");
  const [fConcentracion, setFConcentracion] = useState("Todas");
  const [fMarca, setFMarca] = useState("Todas");
  const [fTemporada, setFTemporada] = useState("Todas");
  const [fHorario, setFHorario] = useState("Todas");
  const [fOcasion, setFOcasion] = useState("Todas");
  const [fEdad, setFEdad] = useState("Todas");
  const [sort, setSort] = useState("Relevancia");

  /* ── Lazy loading ── */
  const BATCH_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  /* ── Dynamic filter options derived from products ── */
  const filterOptions = useMemo(() => {
    const unique = (arr: (string | null | undefined)[]) =>
      ["Todas", ...Array.from(new Set(arr.filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b, "es"))];
    const flatUnique = (arrs: (string[] | undefined)[]) =>
      unique(arrs.flatMap((a) => a ?? []));
    return {
      genero: unique(firebaseProducts.map((p) => p.genero)),
      estilo: unique(firebaseProducts.map((p) => p.estilo)),
      concentracion: unique(firebaseProducts.map((p) => p.concentracion)),
      marca: unique(firebaseProducts.map((p) => p.marca)),
      temporada: flatUnique(firebaseProducts.map((p) => p.temporadas)),
      horario: flatUnique(firebaseProducts.map((p) => p.horarios)),
      ocasion: flatUnique(firebaseProducts.map((p) => p.ocasiones)),
      edad: flatUnique(firebaseProducts.map((p) => p.edades)),
    };
  }, [firebaseProducts]);

  const activeFilterCount = [fGenero, fEstilo, fConcentracion, fMarca, fTemporada, fHorario, fOcasion, fEdad].filter((v) => v !== "Todas").length;

  const clearFilters = () => {
    setFGenero("Todas"); setFEstilo("Todas"); setFConcentracion("Todas"); setFMarca("Todas");
    setFTemporada("Todas"); setFHorario("Todas"); setFOcasion("Todas"); setFEdad("Todas");
    setSearch("");
  };

  /* ── CardFlip Modal state ── */
  type ModalPhase = "flip-open" | "expanded" | "reveal" | "open" | "flip-close";
  const [flipState, setFlipState] = useState<null | {
    product: Product;
    rect: DOMRect;
    phase: ModalPhase;
  }>(null);
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
  const getModalGeometry = useCallback(() => {
    if (typeof window === "undefined") return { w: 700, h: 460, x: 0, y: 0 };
    const isMobile = window.innerWidth < 640;
    const w = isMobile
      ? clamp(window.innerWidth * 0.94, 300, 420)
      : clamp(window.innerWidth * 0.85, 340, 780);
    const h = isMobile
      ? clamp(window.innerHeight * 0.88, 400, 720)
      : clamp(window.innerHeight * 0.82, 360, 640);
    return { w, h, x: (window.innerWidth - w) / 2, y: (window.innerHeight - h) / 2 };
  }, []);

  const openFlip = (product: Product, cardEl: HTMLDivElement) => {
    const rect = cardEl.getBoundingClientRect();
    setQty(1);
    setDecantQty(1);
    setFlipState({ product, rect, phase: "flip-open" });
  };

  // Phase machine driven by useEffect
  useEffect(() => {
    if (!flipState) return;
    const { phase } = flipState;
    const el = flipContainerRef.current;
    if (!el) return;

    if (phase === "flip-open") {
      void el.offsetHeight;
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
      const t = setTimeout(() => {
        setFlipState((p) => (p ? { ...p, phase: "expanded" } : null));
      }, FLIP_MS + 40);
      return () => clearTimeout(t);
    }

    if (phase === "expanded") {
      const t = setTimeout(() => {
        setFlipState((p) => (p ? { ...p, phase: "reveal" } : null));
      }, EXPAND_DELAY);
      return () => clearTimeout(t);
    }

    if (phase === "reveal") {
      const t = setTimeout(() => {
        setFlipState((p) => (p ? { ...p, phase: "open" } : null));
      }, CONTENT_REVEAL_MS + 60);
      return () => clearTimeout(t);
    }

    if (phase === "flip-close") {
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

  const handleAddFromModal = () => {
    if (!flipState) return;
    const p = flipState.product;
    const itemPrices: CartItemPrices = {
      unitario: p.precios?.unitario ?? 0,
      mayorista_3: p.precios?.mayorista_3 ?? null,
      mayorista_10: p.precios?.mayorista_10 ?? null,
    };
    for (let i = 0; i < qty; i++) {
      addItem({ id: p.id, name: p.nombre, marca: p.marca, prices: itemPrices, image: p.imagen ?? "" });
    }
  };

  const handleAddDecantFromModal = () => {
    if (!flipState) return;
    const p = flipState.product;
    if (p.precios?.decant == null) return;
    for (let i = 0; i < decantQty; i++) {
      addDecant({
        id: p.id,
        name: p.nombre,
        marca: p.marca,
        prices: { unitario: p.precios.decant, mayorista_3: null, mayorista_10: null },
        image: p.imagen ?? "",
      });
    }
  };

  const contentVisible = flipState?.phase === "reveal" || flipState?.phase === "open";
  const isClosing = flipState?.phase === "flip-close";

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

  const filtered = useMemo(() => {
    let items = [...firebaseProducts];

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.marca.toLowerCase().includes(q) ||
          (p.concentracion ?? "").toLowerCase().includes(q) ||
          (p.notas ?? "").toLowerCase().includes(q)
      );
    }
    if (fGenero !== "Todas") items = items.filter((p) => p.genero === fGenero);
    if (fEstilo !== "Todas") items = items.filter((p) => p.estilo === fEstilo);
    if (fConcentracion !== "Todas") items = items.filter((p) => p.concentracion === fConcentracion);
    if (fMarca !== "Todas") items = items.filter((p) => p.marca === fMarca);
    if (fTemporada !== "Todas") items = items.filter((p) => p.temporadas?.includes(fTemporada as Temporada));
    if (fHorario !== "Todas") items = items.filter((p) => p.horarios?.includes(fHorario as Horario));
    if (fOcasion !== "Todas") items = items.filter((p) => p.ocasiones?.includes(fOcasion as Ocasion));
    if (fEdad !== "Todas") items = items.filter((p) => p.edades?.includes(fEdad as Edad));

    // Sort — stock 0 always at the end
    const withStock = items.filter((p) => p.stock > 0);
    const noStock = items.filter((p) => p.stock <= 0);

    const sortFn = (arr: Product[]) => {
      switch (sort) {
        case "Precio: menor a mayor":
          return arr.sort((a, b) => (a.precios?.unitario ?? 0) - (b.precios?.unitario ?? 0));
        case "Precio: mayor a menor":
          return arr.sort((a, b) => (b.precios?.unitario ?? 0) - (a.precios?.unitario ?? 0));
        case "Nombre A-Z":
          return arr.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
        case "Nombre Z-A":
          return arr.sort((a, b) => b.nombre.localeCompare(a.nombre, "es"));
        case "Marca A-Z":
          return arr.sort((a, b) => a.marca.localeCompare(b.marca, "es") || a.nombre.localeCompare(b.nombre, "es"));
        case "Mayor stock":
          return arr.sort((a, b) => b.stock - a.stock);
        default:
          return arr;
      }
    };

    return [...sortFn(withStock), ...sortFn(noStock)];
  }, [search, fGenero, fEstilo, fConcentracion, fMarca, fTemporada, fHorario, fOcasion, fEdad, sort, firebaseProducts]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [filtered]);

  // Intersection observer for lazy loading
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filtered.length));
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [filtered.length]);

  const visibleProducts = filtered.slice(0, visibleCount);


  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          {/* Title */}
          <div className="mb-10 text-center">
            <h1 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
              {catalogo.title}
            </h1>
            <p className="mx-auto max-w-xl text-muted-foreground">
              {catalogo.subtitle}
            </p>
          </div>

          {/* Search + filter toggle */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={catalogo.searchPlaceholder}
                className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground outline-none transition-colors focus:border-violet"
              />
            </div>
            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="flex overflow-hidden rounded-full border border-border">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex h-11 w-11 items-center justify-center transition-colors ${viewMode === "grid" ? "bg-violet text-white" : "text-muted-foreground hover:bg-lavender-light"}`}
                  aria-label="Vista cuadrícula"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex h-11 w-11 items-center justify-center transition-colors ${viewMode === "list" ? "bg-violet text-white" : "text-muted-foreground hover:bg-lavender-light"}`}
                  aria-label="Vista lista"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="relative flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition-all hover:border-violet hover:bg-lavender-light"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
                {activeFilterCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filters panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="mb-8 overflow-hidden"
              >
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {/* Género */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">Género</label>
                      <select value={fGenero} onChange={(e) => setFGenero(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-violet">
                        {filterOptions.genero.map((v) => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    {/* Estilo */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">Estilo</label>
                      <select value={fEstilo} onChange={(e) => setFEstilo(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-violet">
                        {filterOptions.estilo.map((v) => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    {/* Concentración */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">Concentración</label>
                      <select value={fConcentracion} onChange={(e) => setFConcentracion(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-violet">
                        {filterOptions.concentracion.map((v) => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    {/* Marca */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">Marca</label>
                      <select value={fMarca} onChange={(e) => setFMarca(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-violet">
                        {filterOptions.marca.map((v) => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    {/* Temporada */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">Temporada</label>
                      <select value={fTemporada} onChange={(e) => setFTemporada(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-violet">
                        {filterOptions.temporada.map((v) => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    {/* Horario */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">Horario</label>
                      <select value={fHorario} onChange={(e) => setFHorario(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-violet">
                        {filterOptions.horario.map((v) => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    {/* Ocasión */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">Ocasión</label>
                      <select value={fOcasion} onChange={(e) => setFOcasion(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-violet">
                        {filterOptions.ocasion.map((v) => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    {/* Edad */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">Edad</label>
                      <select value={fEdad} onChange={(e) => setFEdad(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-violet">
                        {filterOptions.edad.map((v) => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Sort + Clear row */}
                  <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="sm:w-64">
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">Ordenar por</label>
                      <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-violet">
                        {["Relevancia", "Precio: menor a mayor", "Precio: mayor a menor", "Nombre A-Z", "Nombre Z-A", "Marca A-Z", "Mayor stock"].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground">{filtered.length} fragancia{filtered.length !== 1 ? "s" : ""}</span>
                      {activeFilterCount > 0 && (
                        <button onClick={clearFilters} className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-violet hover:text-foreground">
                          <X className="h-3 w-3" />
                          Limpiar filtros
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid / List — lazy loaded */}
          <div className={viewMode === "grid"
            ? "grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "flex flex-col gap-4"
          }>
            {visibleProducts.map((product) => {
              const outOfStock = !product.stock || product.stock <= 0 || !product.precios?.unitario;

              /* ── List row ── */
              if (viewMode === "list") {
                return (
                  <div
                    key={product.id}
                    ref={(el) => { if (el) cardRefs.current.set(product.id, el); }}
                    onClick={() => {
                      const el = cardRefs.current.get(product.id);
                      if (el) openFlip(product, el);
                    }}
                    className="group flex cursor-pointer items-center gap-5 rounded-2xl bg-card p-3 shadow-md ring-1 ring-border transition-all duration-300 hover:shadow-xl hover:shadow-violet/20"
                    data-cursor="card"
                  >
                    {/* Thumbnail — hidden on mobile */}
                    <div className={`relative hidden h-24 w-20 shrink-0 overflow-hidden rounded-xl transition-[filter] duration-500 sm:block ${outOfStock ? "grayscale group-hover:grayscale-0" : ""}`}>
                      <SkeletonImage
                        src={product.imagen ?? ""}
                        alt={product.nombre}
                        className="h-full w-full"
                      />
                      {outOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <span className="rounded-full bg-black/70 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">Sin stock</span>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex flex-1 flex-col gap-0.5">
                      <h3 className="text-sm font-semibold text-foreground">{product.nombre}</h3>
                      <p className="text-xs text-violet">{product.marca} · {product.concentracion ?? ""} · {product.volumen ?? ""}</p>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="text-base font-bold text-violet">
                          {product.precios?.unitario != null ? `$${product.precios.unitario.toLocaleString("es-AR")}` : "—"}
                        </span>
                        {/* Wholesale prices hidden on mobile */}
                        {product.precios?.mayorista_3 != null && (
                          <span className="hidden text-[10px] text-muted-foreground sm:inline">3+ → ${product.precios.mayorista_3.toLocaleString("es-AR")}</span>
                        )}
                        {product.precios?.mayorista_10 != null && (
                          <span className="hidden text-[10px] text-muted-foreground sm:inline">10+ → ${product.precios.mayorista_10.toLocaleString("es-AR")}</span>
                        )}
                      </div>
                    </div>
                    {/* Add to cart — icon only on mobile */}
                    <button
                      disabled={outOfStock}
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem({
                          id: product.id,
                          name: product.nombre,
                          marca: product.marca,
                          prices: {
                            unitario: product.precios?.unitario ?? 0,
                            mayorista_3: product.precios?.mayorista_3 ?? null,
                            mayorista_10: product.precios?.mayorista_10 ?? null,
                          },
                          image: product.imagen ?? "",
                        });
                      }}
                      className={`flex shrink-0 items-center justify-center gap-2 rounded-full transition-all duration-300 ${
                        outOfStock
                          ? "cursor-not-allowed border border-border text-muted-foreground"
                          : "border border-violet/30 text-violet hover:bg-btn-primary hover:text-btn-primary-text hover:shadow-lg hover:shadow-violet/20"
                      } h-10 w-10 sm:h-auto sm:w-auto sm:px-4 sm:py-2.5`}
                      data-cursor={outOfStock ? undefined : "button"}
                      aria-label={outOfStock ? "Sin stock" : catalogo.addToCart}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span className="hidden text-xs font-semibold sm:inline">{outOfStock ? "Sin stock" : catalogo.addToCart}</span>
                    </button>
                  </div>
                );
              }

              /* ── Grid card ── */
              return (
                <div
                  key={product.id}
                  ref={(el) => { if (el) cardRefs.current.set(product.id, el); }}
                  onClick={() => {
                    const el = cardRefs.current.get(product.id);
                    if (el) openFlip(product, el);
                  }}
                  className="group cursor-pointer rounded-[22px] bg-card shadow-md ring-1 ring-border transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-violet/20"
                  style={{ willChange: 'transform' }}
                  data-cursor="card"
                >
                  {/* Image */}
                  <div className={`relative aspect-4/5 overflow-hidden rounded-t-[22px] transition-[filter] duration-500 ${outOfStock ? "grayscale group-hover:grayscale-0" : ""}`}>
                    <SkeletonImage
                      src={product.imagen ?? ""}
                      alt={product.nombre}
                      className="h-full w-full transition-transform duration-500 group-hover:scale-110"
                    />
                    {outOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="rounded-full bg-black/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                          Sin stock
                        </span>
                      </div>
                    )}
                    {!outOfStock && product.label && (
                      <span className="absolute left-3 top-3 rounded-full bg-btn-primary px-3 py-1 text-[11px] font-bold text-btn-primary-text shadow-md">
                        {product.label}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      {product.nombre}
                    </h3>
                    <p className="text-xs text-violet">{product.marca}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {product.concentracion ?? ""} · {product.volumen ?? ""}
                    </p>
                    <div className="mb-4 mt-3">
                      <span className="text-lg font-bold text-violet">
                        {product.precios?.unitario != null ? `$${product.precios.unitario.toLocaleString("es-AR")}` : "—"}
                      </span>
                      {product.precios?.mayorista_3 != null && (
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
                          <span>3+ → ${product.precios.mayorista_3.toLocaleString("es-AR")}</span>
                          {product.precios?.mayorista_10 != null && (
                            <span>10+ → ${product.precios.mayorista_10.toLocaleString("es-AR")}</span>
                          )}
                        </div>
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
                            unitario: product.precios?.unitario ?? 0,
                            mayorista_3: product.precios?.mayorista_3 ?? null,
                            mayorista_10: product.precios?.mayorista_10 ?? null,
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
                      {outOfStock ? "Sin stock" : catalogo.addToCart}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lazy loading sentinel */}
          {visibleCount < filtered.length && (
            <div ref={sentinelRef} className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet border-t-transparent" />
            </div>
          )}

          {filtered.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              No se encontraron fragancias con esos filtros.
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* ══════════════════════════════════════════════════════════
           CardFlip 3D Modal — same as Ofertas
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
                {flipState.product.label && (
                  <span className="absolute left-3 top-3 rounded-full bg-btn-primary px-3 py-1 text-[11px] font-bold text-btn-primary-text shadow-md">
                    {flipState.product.label}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="mb-1 text-sm font-semibold text-foreground">
                  {flipState.product.nombre}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-violet">
                    {flipState.product.precios?.unitario != null ? `$${flipState.product.precios.unitario.toLocaleString("es-AR")}` : "—"}
                  </span>
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
                    animation: "cat-shimmer 2.8s ease-in-out infinite",
                  }}
                />
                {/* Gold shimmer — perpendicular, slower */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(240deg, transparent 25%, rgba(212,168,67,0.18) 45%, rgba(232,200,106,0.25) 50%, rgba(212,168,67,0.18) 55%, transparent 75%)",
                    backgroundSize: "200% 200%",
                    animation: "cat-shimmer 3.6s ease-in-out 0.5s infinite",
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
                        animation: `cat-sparkle 3s ease-in-out ${dot.delay} infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* ── Actual modal content (fades in after flip with blur-out) ── */}
              <div
                className="absolute inset-0 flex flex-col overflow-hidden rounded-[22px] bg-card shadow-2xl ring-1 ring-border sm:flex-row"
                style={{
                  opacity: contentVisible ? 1 : 0,
                  filter: contentVisible ? "blur(0px)" : "blur(12px)",
                  transition: `opacity ${CONTENT_REVEAL_MS}ms ease-out, filter ${CONTENT_REVEAL_MS}ms ease-out`,
                  visibility: (flipState?.phase === "flip-open") ? "hidden" : "visible",
                }}
              >
                {/* Image — left 40% on desktop, full width on mobile */}
                <div className="relative flex w-full shrink-0 items-center justify-center p-2.5 sm:w-2/5 sm:p-3">
                  <div className="flex h-44 w-full items-center justify-center overflow-hidden rounded-2xl ring-1 ring-border p-3 sm:h-full">
                    <SkeletonImage
                      src={flipState.product.imagen ?? ""}
                      alt={flipState.product.nombre}
                      className="h-full w-full"
                      objectFit="contain"
                    />
                  </div>
                  {flipState.product.label && (
                    <span className="absolute left-7 top-7 rounded-full bg-btn-primary px-3 py-1 text-[11px] font-bold text-btn-primary-text shadow-md sm:left-8 sm:top-8">
                      {flipState.product.label}
                    </span>
                  )}
                </div>

                {/* Info — right 60% */}
                <div className="flex flex-1 flex-col justify-between overflow-y-auto p-5 sm:p-6">
                  <div>
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                          {flipState.product.nombre}
                        </h3>
                        {(!flipState.product.stock || flipState.product.stock <= 0 || !flipState.product.precios?.unitario) && (
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

                    {/* Tiered pricing table */}
                    <div className="rounded-2xl bg-background p-4">
                      <p className="mb-2 text-xs font-semibold text-muted-foreground">Precios por cantidad</p>
                      <div className="space-y-1.5">
                        {flipState.product.precios?.unitario != null && (
                          <div className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm ${cartTier === "unitario" ? "bg-violet/10 font-bold text-violet" : "text-foreground"}`}>
                            <span>1-2 unidades</span>
                            <span>${flipState.product.precios.unitario.toLocaleString("es-AR")}</span>
                          </div>
                        )}
                        {flipState.product.precios?.mayorista_3 != null && (
                          <div className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm ${cartTier === "mayorista_3" ? "bg-violet/10 font-bold text-violet" : "text-foreground"}`}>
                            <span>3-9 unidades</span>
                            <span>${flipState.product.precios.mayorista_3.toLocaleString("es-AR")}</span>
                          </div>
                        )}
                        {flipState.product.precios?.mayorista_10 != null && (
                          <div className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm ${cartTier === "mayorista_10" ? "bg-violet/10 font-bold text-violet" : "text-foreground"}`}>
                            <span>10+ unidades</span>
                            <span>${flipState.product.precios.mayorista_10.toLocaleString("es-AR")}</span>
                          </div>
                        )}
                      </div>
                      {cartCount > 0 && (
                        <p className="mt-2 text-[10px] text-muted-foreground">
                          Tu carrito tiene {cartCount} unidad{cartCount !== 1 ? "es" : ""} — precio activo resaltado
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Qty + Add to cart */}
                  <div className="border-t border-border pt-5">
                    {(!flipState.product.stock || flipState.product.stock <= 0 || !flipState.product.precios?.unitario) ? (
                      <p className="text-center text-sm font-semibold text-muted-foreground">Producto sin stock actualmente</p>
                    ) : (
                      <>
                        <div className="mb-4 flex items-center gap-4">
                          <span className="text-xs font-semibold text-muted-foreground">Cantidad</span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setQty(Math.max(1, qty - 1))}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-lavender-light"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-6 text-center text-sm font-bold text-foreground">
                              {qty}
                            </span>
                            <button
                              onClick={() => setQty(qty + 1)}
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
                          {catalogo.addToCart}
                        </button>

                        {/* Decant option */}
                        {flipState.product.precios?.decant != null && (
                          <div className="mt-4 rounded-2xl border border-lavender/40 bg-lavender-light/30 p-4">
                            <div className="mb-3 flex items-center gap-2">
                              <Droplets className="h-4 w-4 text-mauve" />
                              <span className="text-xs font-bold uppercase tracking-wider text-mauve">Decant (5ml)</span>
                              <span className="ml-auto text-sm font-bold text-violet">
                                ${flipState.product.precios.decant.toLocaleString("es-AR")}
                              </span>
                            </div>
                            <p className="mb-3 text-[10px] text-muted-foreground">
                              Precio fijo — no aplica descuento mayorista. Requiere al menos 1 perfume completo.
                            </p>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setDecantQty(Math.max(1, decantQty - 1))}
                                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-lavender-light"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="min-w-5 text-center text-sm font-bold text-foreground">
                                  {decantQty}
                                </span>
                                <button
                                  onClick={() => setDecantQty(decantQty + 1)}
                                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-lavender-light"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <button
                                onClick={handleAddDecantFromModal}
                                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-mauve/40 py-2.5 text-xs font-semibold text-mauve transition-all duration-300 hover:bg-mauve hover:text-white"
                                data-cursor="button"
                              >
                                <Droplets className="h-3.5 w-3.5" />
                                Agregar decant
                              </button>
                            </div>
                          </div>
                        )}
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
        @keyframes cat-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes cat-sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          40% { opacity: 0.55; transform: scale(1.1); }
          60% { opacity: 0.45; transform: scale(1.15); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
      `}</style>
    </>
  );
}
