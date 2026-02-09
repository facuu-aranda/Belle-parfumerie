"use client";

import { perfumes } from "@/lib/data";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SkeletonImage from "@/components/ui/SkeletonImage";
import { motion } from "framer-motion";

export default function PerfumeCatalog() {
  return (
    <section id="fragancias" className="bg-rose-light py-24">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-gold">
            Catálogo
          </p>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Nuestras Fragancias
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Cada fragancia ha sido seleccionada por nuestros expertos para
            ofrecerte una experiencia olfativa inolvidable.
          </p>
        </AnimatedSection>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {perfumes.map((perfume, i) => (
            <AnimatedSection key={perfume.id} delay={i * 0.08}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer overflow-hidden rounded-[22px] bg-card shadow-md shadow-rose/10 ring-1 ring-border transition-shadow duration-300 hover:shadow-xl hover:shadow-gold/15"
                data-cursor="card"
              >
                {/* Image */}
                <div className="relative aspect-[5/6] overflow-hidden">
                  <SkeletonImage
                    src={perfume.image}
                    alt={perfume.name}
                    className="h-full w-full transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Lavender gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-violet/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {perfume.badge && (
                    <span className="absolute left-4 top-4 rounded-full bg-btn-primary px-3.5 py-1 text-xs font-semibold text-btn-primary-text shadow-md">
                      {perfume.badge}
                    </span>
                  )}
                  <div className="absolute bottom-4 right-4 rounded-full border border-gold/20 bg-white/90 px-4 py-1.5 text-sm font-bold text-foreground shadow-sm backdrop-blur-sm">
                    {perfume.price}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="mb-1 text-lg font-semibold text-foreground">
                    {perfume.name}
                  </h3>
                  <p className="mb-4 text-xs font-medium text-violet">
                    {perfume.family}
                  </p>

                  {/* Notes */}
                  <div className="mb-5 flex flex-wrap gap-2">
                    {Object.entries(perfume.notes).map(([key, value]) => (
                      <span
                        key={key}
                        className="rounded-full bg-cream px-3 py-1 text-xs text-muted-foreground"
                      >
                        <span className="font-medium capitalize text-foreground/70">{key}:</span>{" "}
                        {value}
                      </span>
                    ))}
                  </div>

                  <button
                    className="w-full rounded-full border border-violet/30 py-2.5 text-sm font-semibold text-violet transition-all duration-300 hover:bg-btn-primary hover:text-btn-primary-text"
                    data-cursor="button"
                  >
                    Descubrir aroma
                  </button>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
