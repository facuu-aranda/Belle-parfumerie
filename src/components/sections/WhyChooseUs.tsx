"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SkeletonImage from "@/components/ui/SkeletonImage";
import { Sparkles, Award, Clock } from "lucide-react";

export default function Featured() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Image bento */}
          <AnimatedSection>
            <div className="relative">
              <div className="overflow-hidden rounded-3xl">
                <SkeletonImage
                  src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&h=600&fit=crop"
                  alt="Colección de perfumes de lujo"
                  className="aspect-[4/3] w-full"
                />
              </div>
              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute -left-3 bottom-8 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/90 px-5 py-3 shadow-lg backdrop-blur-md sm:left-4"
              >
                <SkeletonImage
                  src="https://images.unsplash.com/photo-1594035910387-fea081e66b5d?w=100&h=100&fit=crop"
                  alt="Perfume miniatura"
                  className="h-12 w-12 rounded-xl"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">Nuit de Velours</p>
                  <p className="text-xs text-muted-foreground">Bestseller 2025</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -right-2 top-6 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-gold/30 sm:right-4"
              >
                Soporte 24/7
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Right — Text + badges */}
          <div>
            <AnimatedSection>
              <h2 className="mb-6 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                Descubre por qué somos
                <br />
                tu mejor elección en
                <br />
                <span className="text-violet">parfumerie.</span>
              </h2>
              <p className="mb-10 max-w-md text-base leading-relaxed text-muted-foreground">
                Más de una década dedicados a curar las fragancias más
                exclusivas del mundo. Cada perfume en nuestra colección ha sido
                seleccionado por nuestros expertos olfativos.
              </p>
            </AnimatedSection>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Sparkles, label: "Fragancias Nicho", desc: "Selección artesanal curada" },
                { icon: Award, label: "Autenticidad 100%", desc: "Garantía de origen verificado" },
                { icon: Clock, label: "Envío Express", desc: "Entrega en 24-48 horas" },
              ].map((item, i) => (
                <AnimatedSection key={i} delay={i * 0.1}>
                  <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10">
                      <item.icon className="h-4.5 w-4.5 text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
