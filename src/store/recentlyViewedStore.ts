import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

interface RecentlyViewedStore {
  products: Product[];
  add: (product: Product) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      products: [],

      add: (product) => {
        const current = get().products.filter((p) => p.id !== product.id);
        set({ products: [product, ...current].slice(0, 8) });
      },
    }),
    { name: 'aira-recently-viewed' }
  )
);
