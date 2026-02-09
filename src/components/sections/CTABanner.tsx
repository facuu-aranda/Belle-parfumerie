"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SkeletonImage from "@/components/ui/SkeletonImage";

export default function CTABanner() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="mb-6 text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              Únete a Nuestra
              <br />
              Comunidad de
              <br />
              <span className="text-violet">Amantes del Perfume</span>
            </h2>
            <p className="mb-8 max-w-md text-base leading-relaxed text-muted-foreground">
              Sé el primero en descubrir nuevas fragancias, ediciones limitadas y
              eventos exclusivos. Tu viaje olfativo comienza aquí.
            </p>

            {/* Email input */}
            <div className="mb-6 flex max-w-md gap-3">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 rounded-full border border-border bg-card px-5 py-3 text-sm text-foreground outline-none transition-colors focus:border-violet"
              />
              <button
                className="rounded-full bg-btn-primary px-6 py-3 text-sm font-semibold text-btn-primary-text transition-all duration-300 hover:bg-btn-primary-hover hover:shadow-lg hover:shadow-violet/25"
                data-cursor="button"
              >
                Suscribirse
              </button>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="#fragancias"
                className="inline-flex items-center gap-2 rounded-full border border-violet/30 px-6 py-2.5 text-sm font-semibold text-violet transition-all duration-300 hover:bg-btn-primary hover:text-btn-primary-text"
                data-cursor="button"
              >
                Explorar Catálogo
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          {/* Right — Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl">
              <SkeletonImage
                src="https://images.unsplash.com/photo-1595425964272-fc617fa19dfa?w=700&h=500&fit=crop"
                alt="Colección de perfumes"
                className="aspect-[7/5] w-full"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -right-2 top-6 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-gold/25 sm:right-4"
            >
              Envío gratuito +€150
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
