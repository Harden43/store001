import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_PRODUCTS } from '../lib/mockData';
import type { ProductColor } from '../types';

interface FilterOptions {
  sizes: string[];
  colors: ProductColor[];
  priceRange: { min: number; max: number };
  loading: boolean;
}

export function useProductFilterOptions(): FilterOptions {
  const [options, setOptions] = useState<FilterOptions>({
    sizes: [],
    colors: [],
    priceRange: { min: 0, max: 1000 },
    loading: true,
  });

  useEffect(() => {
    (async () => {
      let products;
      if (!isSupabaseConfigured) {
        products = MOCK_PRODUCTS;
      } else {
        const { data } = await supabase
          .from('products')
          .select('sizes, colors, price')
          .eq('is_active', true);
        products = data || [];
      }

      const sizeSet = new Set<string>();
      const colorMap = new Map<string, string>();
      let min = Infinity, max = 0;

      for (const p of products) {
        for (const s of (p.sizes || [])) sizeSet.add(s);
        for (const c of (p.colors || [])) colorMap.set(c.name, c.hex);
        if (p.price < min) min = p.price;
        if (p.price > max) max = p.price;
      }

      setOptions({
        sizes: Array.from(sizeSet).sort(),
        colors: Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex })),
        priceRange: { min: Math.floor(min === Infinity ? 0 : min), max: Math.ceil(max || 1000) },
        loading: false,
      });
    })();
  }, []);

  return options;
}
