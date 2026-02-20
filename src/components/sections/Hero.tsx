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
              className="relative flex flex-col justify-center overflow-hidden rounded-[2rem] px-14 py-16"
            >
              <img
                src="/assets/Hero1.png"
                alt="Belle Parfumerie"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-card/95 via-card/80 to-card/40" />
              <div className="relative mb-8 flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                  Parfumerie de Autor
                </span>
              </div>

              <h1 className="relative mb-6 text-[3.8rem] font-extrabold leading-[1.04] tracking-tight text-foreground">
                BELLE
                <br />
                PARFUMERIE
                <span className="text-gold">.</span>
              </h1>

              <p className="relative mb-10 max-w-[22rem] text-[1.05rem] leading-relaxed text-muted-foreground">
                {hero.subheadline}
              </p>

              <div className="relative flex items-center gap-4">
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

              <div className="relative mt-auto pt-10 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span className="inline-block h-px w-8 bg-gold/40" />
                {hero.secondaryLink}
              </div>
            </motion.div>

            {/* ═══════════════════════════════════════════════════
                 BLOQUE B — Derecho grande (imagen de fondo Hero2-SanValentin)
                 Sin textos, lleva a ofertas
                 ═══════════════════════════════════════════════════ */}
            <motion.a
              href="#ofertas"
              {...fadeUp(0.15)}
              style={{
                gridArea: "b",
                boxShadow:
                  "0 4px 14px rgba(184,134,11,0.08), 0 16px 48px rgba(158,25,6,0.07)",
              }}
              className="group relative overflow-hidden rounded-[2rem]"
              data-cursor="card"
            >
              <img
                src="/assets/Hero2-SanValentin.png"
                alt="Ofertas San Valentín"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
              />
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-2 ring-transparent transition-all duration-300 group-hover:ring-gold/50 group-hover:shadow-[inset_0_0_40px_rgba(184,134,11,0.14)]" />
            </motion.a>

            {/* ═══════════════════════════════════════════════════
                 BLOQUE C — Derecho inferior pequeño (catálogo)
                 Con imagen Hero1 de fondo y label
                 ═══════════════════════════════════════════════════ */}
            <motion.div
              {...fadeUp(0.3)}
              style={{
                gridArea: "c",
                height: "140px",
                boxShadow:
                  "0 2px 6px rgba(158,25,6,0.04), 0 8px 28px rgba(158,25,6,0.05)",
              }}
              className="group relative overflow-hidden rounded-[2rem]"
            >
              <Link href="/catalogo" className="absolute inset-0" data-cursor="card">
                <img
                  src="/assets/Hero3-Catalogo.png"
                  alt="Catálogo de perfumes"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
                <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-2 ring-transparent transition-all duration-300 group-hover:ring-gold/50 group-hover:shadow-[inset_0_0_40px_rgba(184,134,11,0.14)]" />

                <div className="absolute bottom-5 left-5 flex flex-col gap-1">
                  <span className="text-2xl font-bold text-white drop-shadow-lg">Explorá el catálogo</span>
                  <span className="text-base text-white/90 drop-shadow-lg">+3K fragancias para descubrir</span>
                </div>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <ArrowRight className="h-4 w-4 text-white" />
                </div>
              </Link>
            </motion.div>
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
              className="relative flex flex-col justify-center overflow-hidden rounded-[1.5rem] px-7 py-12 sm:px-10 sm:py-14"
            >
              <img
                src="/assets/Hero1.png"
                alt="Belle Parfumerie"
                className="absolute inset-0 h-full w-full object-cover"
                
              />
              <div className="absolute inset-0 bg-gradient-to-r from-card/95 via-card/80 to-card/40" />
              <div className="relative mb-6 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                  Parfumerie de Autor
                </span>
              </div>

              <h1 className="relative mb-5 text-[2.5rem] font-extrabold leading-[1.06] tracking-tight text-foreground sm:text-5xl">
                BELLE
                <br />
                PARFUMERIE
                <span className="text-gold">.</span>
              </h1>

              <p className="relative mb-8 max-w-sm text-base leading-relaxed text-muted-foreground">
                {hero.subheadline}
              </p>

              <div className="relative flex items-center gap-4">
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

              <div className="relative mt-8 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span className="inline-block h-px w-8 bg-gold/40" />
                {hero.secondaryLink}
              </div>
            </motion.div>

            {/* Bloque B mobile - Hero2-SanValentin sin textos */}
            <motion.a
              href="#ofertas"
              {...fadeUp(0.12)}
              className="group relative overflow-hidden rounded-[1.5rem] h-[280px] sm:h-[340px]"
              style={{
                boxShadow:
                  "0 4px 14px rgba(184,134,11,0.08), 0 16px 48px rgba(158,25,6,0.07)",
              }}
              data-cursor="card"
            >
              <img
                src="/assets/Hero2-SanValentin.png"
                alt="Ofertas San Valentín"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
              />
              <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] ring-2 ring-transparent transition-all duration-300 group-hover:ring-gold/50" />
            </motion.a>

            {/* Bloque C mobile - Hero3-Catalogo */}
            <motion.div
              {...fadeUp(0.24)}
              className="group relative overflow-hidden rounded-[1.5rem] h-[140px]"
              style={{
                boxShadow:
                  "0 2px 6px rgba(158,25,6,0.04), 0 8px 28px rgba(158,25,6,0.05)",
              }}
            >
              <Link href="/catalogo" className="absolute inset-0" data-cursor="card">
                <img
                  src="/assets/Hero3-Catalogo.png"
                  alt="Catálogo de perfumes"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

                <div className="absolute bottom-4 left-4 flex flex-col gap-0.5">
                  <span className="text-xl font-bold text-white drop-shadow-lg">Explorá el catálogo</span>
                  <span className="text-sm text-white/90 drop-shadow-lg">+3K fragancias para descubrir</span>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <ArrowRight className="h-3.5 w-3.5 text-white" />
                </div>
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
