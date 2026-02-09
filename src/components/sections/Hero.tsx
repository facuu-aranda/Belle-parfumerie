"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { siteContent } from "@/lib/siteContent";
import SkeletonImage from "@/components/ui/SkeletonImage";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-40px" } as const,
  transition: { duration: 0.72, delay, ease: [0.22, 0.61, 0.36, 1] as const },
});

export default function Hero() {
  const { hero } = siteContent;

  return (
    <section className="relative overflow-hidden bg-background pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">

        {/* ── Bento Grid Asimétrico ─────────────────────────────
             CSS Grid con áreas explícitas.
             Desktop: col izq 55% / col der 45%
             Fila 1 (grande): A + B
             Fila 2 (chica):  A + C
             A ocupa ambas filas (row span).
             B es alto, C es bajo → asimetría real.             */}
        <div
          className="grid gap-4 lg:gap-5"
          style={{
            gridTemplateColumns: "1fr",
            gridTemplateRows: "auto auto",
          }}
        >
          {/* ── Desktop: grid con áreas ── */}
          <div
            className="hidden lg:grid"
            style={{
              gridTemplateAreas: `"a b" "a c"`,
              gridTemplateColumns: "55% 1fr",
              gridTemplateRows: "1fr auto",
              gap: "1.25rem",
              height: "600px",
            }}
          >
            {/* ═══════════════════════════════════════════════════
                 BLOQUE A — Izquierdo grande (texto)
                 Row-span completo · peso visual dominante
                 ═══════════════════════════════════════════════════ */}
            <motion.div
              {...fadeUp(0)}
              style={{
                gridArea: "a",
                boxShadow:
                  "0 1px 3px rgba(158,25,6,0.04), 0 8px 32px rgba(158,25,6,0.06), 0 24px 60px rgba(158,25,6,0.04)",
              }}
              className="relative flex flex-col justify-center rounded-[2rem] border border-border bg-card px-14 py-16"
            >
              <div className="mb-8 flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                  Parfumerie de Autor
                </span>
              </div>

              <h1 className="mb-6 text-[3.8rem] font-extrabold leading-[1.04] tracking-tight text-foreground">
                BELLE
                <br />
                PARFUMERIE
                <span className="text-gold">.</span>
              </h1>

              <p className="mb-10 max-w-[22rem] text-[1.05rem] leading-relaxed text-muted-foreground">
                {hero.subheadline}
              </p>

              <div className="flex items-center gap-4">
                <a
                  href={`https://wa.me/${siteContent.contacto.whatsapp.number}?text=${encodeURIComponent(siteContent.contacto.whatsapp.message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-btn-primary px-8 py-3.5 text-sm font-semibold text-btn-primary-text shadow-lg shadow-violet/20 transition-all duration-300 hover:bg-btn-primary-hover hover:shadow-xl hover:shadow-violet/30 hover:scale-[1.03]"
                  data-cursor="button"
                >
                  {hero.cta}
                </a>
                <a
                  href="#ofertas"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-background transition-all duration-300 hover:border-gold hover:bg-lavender-light hover:shadow-md"
                  data-cursor="button"
                >
                  <ArrowRight className="h-4 w-4 text-foreground" />
                </a>
              </div>

              <div className="mt-auto pt-10 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span className="inline-block h-px w-8 bg-gold/40" />
                {hero.secondaryLink}
              </div>
            </motion.div>

            {/* ═══════════════════════════════════════════════════
                 BLOQUE B — Derecho grande (imagen clickeable)
                 Ocupa la mayor parte de la columna derecha
                 ═══════════════════════════════════════════════════ */}
            <motion.div
              {...fadeUp(0.15)}
              style={{
                gridArea: "b",
                boxShadow:
                  "0 4px 14px rgba(184,134,11,0.08), 0 16px 48px rgba(158,25,6,0.07)",
              }}
              className="group relative overflow-hidden rounded-[2rem]"
            >
              <Link href="/catalogo" className="absolute inset-0" data-cursor="card">
                <SkeletonImage
                  src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=900&h=700&fit=crop"
                  alt="Colección de perfumes"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-2 ring-transparent transition-all duration-300 group-hover:ring-gold/50 group-hover:shadow-[inset_0_0_40px_rgba(184,134,11,0.14)]" />

                <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full bg-gold/90 px-4 py-2 text-white shadow-lg shadow-black/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                  <span className="text-xs font-bold tracking-wide">+3K Fragancias</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>

                <div className="absolute bottom-5 right-5 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md dark:bg-card/90">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-7 w-7 rounded-full border-2 border-white bg-lavender-light shadow-sm" />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">1.5K+</p>
                    <p className="text-[10px] leading-tight text-muted-foreground">Clientes satisfechos</p>
                  </div>
                </div>

                <div className="absolute bottom-5 left-5">
                  <p className="text-sm font-semibold text-white drop-shadow-lg">
                    {hero.rightBlock.overlay}
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* ═══════════════════════════════════════════════════
                 BLOQUE C — Derecho inferior pequeño (ofertas)
                 Altura fija pequeña · claramente secundario
                 ═══════════════════════════════════════════════════ */}
            <motion.a
              href="#ofertas"
              {...fadeUp(0.3)}
              style={{
                gridArea: "c",
                height: "140px",
                boxShadow:
                  "0 2px 6px rgba(158,25,6,0.04), 0 8px 28px rgba(158,25,6,0.05)",
              }}
              className="group relative flex items-center gap-5 overflow-hidden rounded-[2rem] border border-border bg-card px-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet/10"
              data-cursor="card"
            >
              <div className="shrink-0 overflow-hidden rounded-2xl shadow-sm">
                <SkeletonImage
                  src="https://images.unsplash.com/photo-1594035910387-fea081e66b5d?w=240&h=180&fit=crop"
                  alt="Ofertas"
                  className="h-[88px] w-[120px] object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="mb-1.5 inline-block rounded-full bg-gold px-3 py-0.5 text-[10px] font-bold text-white">
                  {hero.bottomBlock.badge}
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {hero.bottomBlock.label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Descuentos exclusivos en fragancias seleccionadas
                </p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-violet" />
            </motion.a>
          </div>

          {/* ── Mobile / Tablet: bloques apilados ──────────────── */}
          <div className="flex flex-col gap-4 lg:hidden">
            {/* Bloque A mobile */}
            <motion.div
              {...fadeUp(0)}
              style={{
                boxShadow:
                  "0 1px 3px rgba(158,25,6,0.04), 0 8px 32px rgba(158,25,6,0.06)",
              }}
              className="flex flex-col justify-center rounded-[1.5rem] border border-border bg-card px-7 py-12 sm:px-10 sm:py-14"
            >
              <div className="mb-6 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                  Parfumerie de Autor
                </span>
              </div>

              <h1 className="mb-5 text-[2.5rem] font-extrabold leading-[1.06] tracking-tight text-foreground sm:text-5xl">
                BELLE
                <br />
                PARFUMERIE
                <span className="text-gold">.</span>
              </h1>

              <p className="mb-8 max-w-sm text-base leading-relaxed text-muted-foreground">
                {hero.subheadline}
              </p>

              <div className="flex items-center gap-4">
                <a
                  href={`https://wa.me/${siteContent.contacto.whatsapp.number}?text=${encodeURIComponent(siteContent.contacto.whatsapp.message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-btn-primary px-7 py-3 text-sm font-semibold text-btn-primary-text shadow-lg shadow-violet/20 transition-all duration-300 hover:bg-btn-primary-hover"
                  data-cursor="button"
                >
                  {hero.cta}
                </a>
                <a
                  href="#ofertas"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-background"
                  data-cursor="button"
                >
                  <ArrowRight className="h-4 w-4 text-foreground" />
                </a>
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span className="inline-block h-px w-8 bg-gold/40" />
                {hero.secondaryLink}
              </div>
            </motion.div>

            {/* Bloque B mobile */}
            <motion.div
              {...fadeUp(0.12)}
              className="group relative overflow-hidden rounded-[1.5rem] h-[280px] sm:h-[340px]"
              style={{
                boxShadow:
                  "0 4px 14px rgba(184,134,11,0.08), 0 16px 48px rgba(158,25,6,0.07)",
              }}
            >
              <Link href="/catalogo" className="absolute inset-0" data-cursor="card">
                <SkeletonImage
                  src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=900&h=700&fit=crop"
                  alt="Colección de perfumes"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-gold/90 px-3.5 py-1.5 text-white shadow-lg backdrop-blur-sm">
                  <span className="text-xs font-bold">+3K Fragancias</span>
                  <ArrowRight className="h-3 w-3" />
                </div>

                <div className="absolute bottom-4 right-4 flex items-center gap-2.5 rounded-xl bg-white/90 px-3 py-2.5 shadow-lg backdrop-blur-md dark:bg-card/90">
                  <div className="flex -space-x-1.5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-lavender-light" />
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">1.5K+</p>
                    <p className="text-[9px] text-muted-foreground">Clientes satisfechos</p>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4">
                  <p className="text-sm font-semibold text-white drop-shadow-lg">
                    {hero.rightBlock.overlay}
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Bloque C mobile */}
            <motion.a
              href="#ofertas"
              {...fadeUp(0.24)}
              className="group flex items-center gap-4 rounded-[1.5rem] border border-border bg-card p-4 sm:p-5 transition-all duration-300 hover:shadow-lg"
              style={{
                boxShadow:
                  "0 2px 6px rgba(158,25,6,0.04), 0 8px 28px rgba(158,25,6,0.05)",
              }}
              data-cursor="card"
            >
              <div className="shrink-0 overflow-hidden rounded-xl">
                <SkeletonImage
                  src="https://images.unsplash.com/photo-1594035910387-fea081e66b5d?w=240&h=180&fit=crop"
                  alt="Ofertas"
                  className="h-16 w-24 object-cover sm:h-20 sm:w-28"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="mb-1 inline-block rounded-full bg-gold px-3 py-0.5 text-[10px] font-bold text-white">
                  {hero.bottomBlock.badge}
                </span>
                <p className="text-sm font-semibold text-foreground">{hero.bottomBlock.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Descuentos exclusivos</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </motion.a>
          </div>

        </div>
      </div>
    </section>
  );
}
