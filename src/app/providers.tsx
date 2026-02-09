"use client";

import { ThemeProvider } from "@/lib/ThemeProvider";
import { CartProvider } from "@/lib/CartContext";
import CartDrawer from "@/components/ui/CartDrawer";
import CustomCursor from "@/components/ui/CustomCursor";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CartProvider>
        {children}
        <CartDrawer />
        <CustomCursor />
      </CartProvider>
    </ThemeProvider>
  );
}
