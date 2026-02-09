"use client";

import { useState } from "react";
import { siteContent } from "@/lib/siteContent";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { faq } = siteContent;

  return (
    <section id="faq" className="bg-cream py-24">
      <div className="mx-auto max-w-3xl px-6">
        <AnimatedSection className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-gold">
            FAQ
          </p>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            {faq.title}
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            {faq.subtitle}
          </p>
        </AnimatedSection>

        <div className="space-y-4">
          {faq.items.map((item, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div className="overflow-hidden rounded-[18px] bg-card ring-1 ring-border">
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === i ? null : i)
                  }
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-200 hover:bg-rose-light"
                >
                  <span className="pr-4 text-sm font-semibold text-foreground">
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-5 w-5 shrink-0 text-violet" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border px-6 py-5">
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
