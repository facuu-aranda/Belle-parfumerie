"use client";

import { Droplets, Flame, TreePine, Citrus } from "lucide-react";
import { siteContent } from "@/lib/siteContent";
import AnimatedSection from "@/components/ui/AnimatedSection";

const iconMap: Record<string, React.ElementType> = {
  Droplets,
  Flame,
  TreePine,
  Citrus,
};

export default function Experiencias() {
  const { experiencias } = siteContent;

  return (
    <section className="bg-cream py-24">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            {experiencias.title}
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            {experiencias.subtitle}
          </p>
        </AnimatedSection>

        <div className="grid gap-6 sm:grid-cols-2">
          {experiencias.cards.map((card, i) => {
            const Icon = iconMap[card.icon] || Droplets;
            return (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div
                  className="group rounded-[20px] border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose/10"
                  data-cursor="card"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lavender-light transition-colors duration-300 group-hover:bg-violet">
                      <Icon className="h-5 w-5 text-violet transition-colors duration-300 group-hover:text-white" />
                    </div>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-border transition-colors duration-300 group-hover:text-violet">
                      <path d="M5 15L15 5M15 5H8M15 5v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
