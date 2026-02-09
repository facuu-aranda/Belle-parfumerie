"use client";

import { Check } from "lucide-react";
import { collections } from "@/lib/data";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function Collections() {
  return (
    <section id="colecciones" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-violet">
            Colecciones
          </p>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Encuentra Tu Colección
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Tres líneas diseñadas para diferentes momentos y personalidades.
          </p>
        </AnimatedSection>

        <div className="grid items-center gap-8 lg:grid-cols-3">
          {collections.map((col, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div
                className={`relative overflow-hidden rounded-[22px] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  col.highlighted
                    ? "bg-btn-primary text-btn-primary-text shadow-xl shadow-violet/25 ring-0 scale-[1.03]"
                    : "bg-card ring-1 ring-border hover:shadow-lavender/15"
                }`}
                data-cursor="card"
              >
                {col.highlighted && (
                  <div className="absolute -right-8 top-6 rotate-45 bg-mauve px-10 py-1 text-xs font-semibold text-white">
                    Popular
                  </div>
                )}

                <p className={`mb-1 text-sm font-medium ${col.highlighted ? "text-lavender-light" : "text-violet"}`}>
                  {col.name}
                </p>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{col.price}</span>
                  <span className={`text-sm ${col.highlighted ? "text-white/70" : "text-muted-foreground"}`}>
                    {col.period}
                  </span>
                </div>
                <p className={`mb-8 text-sm ${col.highlighted ? "text-white/80" : "text-muted-foreground"}`}>
                  {col.description}
                </p>

                <ul className="mb-8 space-y-3">
                  {col.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          col.highlighted ? "bg-white/20" : "bg-lavender-light"
                        }`}
                      >
                        <Check className={`h-3 w-3 ${col.highlighted ? "text-white" : "text-violet"}`} />
                      </div>
                      <span className={col.highlighted ? "text-white/90" : "text-foreground"}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full rounded-full py-3 text-sm font-semibold transition-all duration-300 ${
                    col.highlighted
                      ? "bg-white text-violet hover:bg-cream hover:shadow-md"
                      : "border border-violet/30 text-violet hover:bg-btn-primary hover:text-btn-primary-text"
                  }`}
                  data-cursor="button"
                >
                  Elegir Colección
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
