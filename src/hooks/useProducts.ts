"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import type { Product } from "@/types/product";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dbRef = ref(db, "perfumes");
    const unsub = onValue(dbRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const list = Object.values(val) as Product[];
        setProducts(list.filter((p) => p.active));
      } else {
        setProducts([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { products, loading };
}
