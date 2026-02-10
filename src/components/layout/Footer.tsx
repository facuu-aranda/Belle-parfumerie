import { Flower2, Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { siteContent } from "@/lib/siteContent";

export default function Footer() {
  const { brand, footer, contacto } = siteContent;

  return (
    <footer className="bg-footer-bg text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <Flower2 className="h-6 w-6 text-gold-light" />
              <span className="text-lg font-bold">{brand.name}</span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-white/60">
              {footer.description}
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors duration-300 hover:bg-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-light">
              {footer.columns.nav.title}
            </h4>
            <ul className="space-y-3">
              {footer.columns.nav.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/60 transition-colors hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-light">
              {footer.contact.title}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
                <span className="text-sm text-white/60">{contacto.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold-light" />
                <span className="text-sm text-white/60">{contacto.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold-light" />
                <span className="text-sm text-white/60">{contacto.email}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-white/40 md:flex-row">
          <p>{footer.copyright}</p>
          <div className="flex gap-6">
            {footer.legal.map((item) => (
              <a key={item} href="#" className="transition-colors hover:text-white">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
