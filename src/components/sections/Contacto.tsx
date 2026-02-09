"use client";

import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { siteContent } from "@/lib/siteContent";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function Contacto() {
  const { contacto } = siteContent;

  return (
    <section id="contacto" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            {contacto.title}
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            {contacto.subtitle}
          </p>
        </AnimatedSection>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left — Info + WhatsApp CTA */}
          <AnimatedSection>
            <div className="rounded-3xl border border-border bg-card p-8 sm:p-10">
              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${contacto.whatsapp.number}?text=${encodeURIComponent(contacto.whatsapp.message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-8 flex w-full items-center justify-center gap-3 rounded-full bg-green-600 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-700 hover:shadow-lg"
                data-cursor="button"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                {contacto.whatsapp.cta}
              </a>

              {/* Contact info */}
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10">
                    <MapPin className="h-4 w-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Dirección</p>
                    <p className="text-sm text-muted-foreground">{contacto.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10">
                    <Phone className="h-4 w-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Teléfono</p>
                    <p className="text-sm text-muted-foreground">{contacto.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10">
                    <Mail className="h-4 w-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">{contacto.email}</p>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="mt-8 flex gap-3">
                <a
                  href={contacto.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all duration-300 hover:border-violet hover:bg-lavender-light"
                  data-cursor="link"
                >
                  <Instagram className="h-4 w-4 text-foreground" />
                </a>
                <a
                  href={contacto.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all duration-300 hover:border-violet hover:bg-lavender-light"
                  data-cursor="link"
                >
                  <Facebook className="h-4 w-4 text-foreground" />
                </a>
              </div>
            </div>
          </AnimatedSection>

          {/* Right — Simple form */}
          <AnimatedSection delay={0.1}>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="rounded-3xl border border-border bg-card p-8 sm:p-10"
            >
              <div className="mb-5">
                <input
                  type="text"
                  placeholder={contacto.form.namePlaceholder}
                  className="w-full rounded-2xl border border-border bg-background px-5 py-3.5 text-sm text-foreground outline-none transition-colors focus:border-violet"
                />
              </div>
              <div className="mb-5">
                <input
                  type="email"
                  placeholder={contacto.form.emailPlaceholder}
                  className="w-full rounded-2xl border border-border bg-background px-5 py-3.5 text-sm text-foreground outline-none transition-colors focus:border-violet"
                />
              </div>
              <div className="mb-6">
                <textarea
                  rows={5}
                  placeholder={contacto.form.messagePlaceholder}
                  className="w-full resize-none rounded-2xl border border-border bg-background px-5 py-3.5 text-sm text-foreground outline-none transition-colors focus:border-violet"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-btn-primary py-3.5 text-sm font-semibold text-btn-primary-text transition-all duration-300 hover:bg-btn-primary-hover hover:shadow-lg hover:shadow-violet/25"
                data-cursor="button"
              >
                {contacto.form.submit}
              </button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
