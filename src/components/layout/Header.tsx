"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Flower2, ShoppingBag, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { siteContent } from "@/lib/siteContent";
import { useTheme } from "@/lib/ThemeProvider";
import { useCart } from "@/lib/CartContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, mounted, toggle: toggleTheme } = useTheme();
  const { count, setIsOpen } = useCart();
  const { nav, brand } = siteContent;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "shadow-sm"
          : ""
      }`}
      style={{
        background: "var(--glass)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid var(--glass-border)",
      }}
    >
      {/* Glow effect */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full opacity-60"
          style={{
            background: "var(--glow)",
            filter: "blur(60px)",
            animation: "glow-pulse 4s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" data-cursor="link">
          <Flower2 className="h-6 w-6 text-gold" />
          <span className="text-lg font-bold tracking-tight text-foreground">
            {brand.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {nav.links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors duration-250 hover:text-gold"
              data-cursor="link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-all duration-300 hover:border-gold/40 hover:bg-lavender-light"
            aria-label="Toggle theme"
            data-cursor="button"
          >
            {!mounted || theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* Cart */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-all duration-300 hover:border-gold/40 hover:bg-lavender-light"
            aria-label="Cart"
            data-cursor="button"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>

          {/* CTA desktop */}
          <Link
            href="/catalogo"
            className="ml-2 hidden rounded-full bg-btn-primary px-5 py-2 text-sm font-semibold text-btn-primary-text transition-all duration-300 hover:bg-btn-primary-hover hover:shadow-lg hover:shadow-violet/25 lg:block"
            data-cursor="button"
          >
            {nav.cta}
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="ml-1 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border bg-card lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {nav.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-cream"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/catalogo"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-full bg-btn-primary px-6 py-2.5 text-center text-sm font-semibold text-btn-primary-text"
              >
                {nav.cta}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
