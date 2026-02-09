"use client";

import { testimonials } from "@/lib/data";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SkeletonImage from "@/components/ui/SkeletonImage";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="bg-cream py-24">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-gold">
            Reseñas
          </p>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Experiencias reales de quienes han encontrado su fragancia de firma
            con nosotros.
          </p>
        </AnimatedSection>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div
                className="rounded-[20px] bg-card p-7 ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-rose/10"
                data-cursor="card"
              >
                <Quote className="mb-4 h-7 w-7 text-gold-light" />
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-3.5 w-3.5 fill-gold text-gold"
                    />
                  ))}
                </div>
                <p className="mb-4 inline-block rounded-full bg-lavender-light px-3 py-1 text-xs font-medium text-violet">
                  ♥ {t.aroma}
                </p>
                <div className="flex items-center gap-3">
                  <SkeletonImage
                    src={t.image}
                    alt={t.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <p className="text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
