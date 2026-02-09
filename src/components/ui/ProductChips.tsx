"use client";

import type { Product } from "@/types/product";

const chipBase = "rounded-full px-2.5 py-0.5 text-[10px] font-semibold";

const styles: Record<string, string> = {
  genero: `${chipBase} border border-violet/30 text-violet bg-violet/5`,
  estilo: `${chipBase} border border-gold/30 text-gold bg-gold/5`,
  temporada: `${chipBase} border border-mauve/30 text-mauve bg-rose-light`,
  horario: `${chipBase} border border-lavender/40 text-foreground bg-lavender-light`,
  ocasion: `${chipBase} border border-border text-muted-foreground bg-muted`,
  edad: `${chipBase} border border-violet-deep/20 text-violet-deep bg-cream`,
};

export default function ProductChips({ product }: { product: Product }) {
  const chips: { label: string; style: string }[] = [];

  if (product.genero) chips.push({ label: product.genero, style: styles.genero });
  if (product.estilo) chips.push({ label: product.estilo, style: styles.estilo });
  product.temporadas?.forEach((t) => chips.push({ label: t, style: styles.temporada }));
  product.horarios?.forEach((h) => chips.push({ label: h, style: styles.horario }));
  product.ocasiones?.forEach((o) => chips.push({ label: o, style: styles.ocasion }));
  product.edades?.forEach((e) => chips.push({ label: e, style: styles.edad }));

  if (chips.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-1.5">
      {chips.map((c, i) => (
        <span key={`${c.label}-${i}`} className={c.style}>
          {c.label}
        </span>
      ))}
    </div>
  );
}
