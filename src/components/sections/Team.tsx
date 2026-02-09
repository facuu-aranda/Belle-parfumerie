"use client";

import { teamMembers } from "@/lib/data";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { motion } from "framer-motion";
import { Linkedin, Twitter, Mail } from "lucide-react";

export default function Team() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            Our Team
          </p>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Meet Our Expert Agents
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Our experienced professionals are dedicated to helping you find the
            perfect property.
          </p>
        </AnimatedSection>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className="group overflow-hidden rounded-2xl bg-white text-center shadow-md ring-1 ring-black/5 transition-shadow hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Social overlay */}
                  <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-primary/80 to-transparent pb-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex gap-3">
                      {[Linkedin, Twitter, Mail].map((Icon, j) => (
                        <a
                          key={j}
                          href="#"
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-accent"
                        >
                          <Icon className="h-4 w-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
