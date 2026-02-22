// src/store/wishlistStore.ts
import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface WishlistStore {
  productIds: Set<string>;
  loading: boolean;

  fetch: (userId: string) => Promise<void>;
  toggle: (productId: string, userId: string) => Promise<void>;
  has: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  productIds: new Set(),
  loading: false,

  fetch: async (userId) => {
    if (!isSupabaseConfigured) return;
    set({ loading: true });

    const { data } = await supabase
      .from('wishlists')
      .select('product_id')
      .eq('user_id', userId);

    set({
      productIds: new Set((data ?? []).map((r) => r.product_id)),
      loading: false,
    });
  },

  toggle: async (productId, userId) => {
    if (!isSupabaseConfigured) return;

    const ids = get().productIds;
    const isFav = ids.has(productId);

    // Optimistic update
    const next = new Set(ids);
    if (isFav) next.delete(productId);
    else next.add(productId);
    set({ productIds: next });

    if (isFav) {
      await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);
    } else {
      await supabase
        .from('wishlists')
        .insert({ user_id: userId, product_id: productId });
    }
  },

  has: (productId) => get().productIds.has(productId),

  clear: () => set({ productIds: new Set() }),
}));
