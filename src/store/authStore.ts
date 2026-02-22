// src/store/authStore.ts
import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Profile } from '../types';
import { useWishlistStore } from './wishlistStore';

interface AuthStore {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;

  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,

  initialize: async () => {
    if (!isSupabaseConfigured) {
      set({ loading: false });
      return;
    }

    // Get session first (authoritative for initial load)
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, loading: false });
    if (session?.user) {
      get().fetchProfile();
      useWishlistStore.getState().fetch(session.user.id);
    }

    // Then listen for future changes (sign-in, sign-out, token refresh)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
      if (session?.user) {
        get().fetchProfile();
        useWishlistStore.getState().fetch(session.user.id);
      } else {
        set({ profile: null });
        useWishlistStore.getState().clear();
      }
    });
  },

  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/account',
      },
    });
    if (error) throw error;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null });
    useWishlistStore.getState().clear();
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;

    // Try to fetch existing profile (maybeSingle avoids 406 when no rows)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      set({ profile: data });
      return;
    }

    // No profile yet — create one (replaces the old DB trigger)
    const { data: newProfile } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
        avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
      }, { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (newProfile) set({ profile: newProfile });
  },
}));
