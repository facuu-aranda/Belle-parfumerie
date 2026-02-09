"use client";

import { blogPosts } from "@/lib/data";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SkeletonImage from "@/components/ui/SkeletonImage";
import { Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Blog() {
  return (
    <section id="blog" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-violet">
            Notas & Guías
          </p>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Mundo Olfativo
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Artículos editoriales sobre notas, ingredientes y tendencias en la
            perfumería contemporánea.
          </p>
        </AnimatedSection>

        <div className="grid gap-8 md:grid-cols-3">
          {blogPosts.map((post, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer overflow-hidden rounded-[20px] bg-card ring-1 ring-border transition-shadow duration-300 hover:shadow-xl hover:shadow-rose/10"
                data-cursor="card"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <SkeletonImage
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-4">
                    <span className="rounded-full bg-lavender-light px-3 py-1 text-xs font-semibold text-violet">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-violet">
                    {post.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet transition-colors group-hover:text-violet-deep">
                    Leer más
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
