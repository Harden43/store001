// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_PRODUCTS } from '../lib/mockData';
import type { Product, ProductFilters } from '../types';

function filterMockProducts(filters?: ProductFilters): Product[] {
  let results = [...MOCK_PRODUCTS];

  if (filters?.category) {
    results = results.filter((p) => p.category?.slug === filters.category);
  }
  if (filters?.minPrice) {
    results = results.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters?.maxPrice) {
    results = results.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters?.sizes?.length) {
    results = results.filter((p) => filters.sizes!.some((s) => (p.sizes || []).includes(s)));
  }
  if (filters?.colors?.length) {
    results = results.filter((p) => filters.colors!.some((c) => (p.colors || []).some((pc) => pc.name === c)));
  }

  if (filters?.sortBy === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (filters?.sortBy === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (filters?.sortBy === 'featured') {
    results = results.filter((p) => p.is_featured);
  } else {
    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return results;
}

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filters)]);

  async function fetchProducts() {
    if (!isSupabaseConfigured) {
      setProducts(filterMockProducts(filters));
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_active', true);

      if (filters?.category) {
        query = query.eq('categories.slug', filters.category);
      }
      if (filters?.minPrice) query = query.gte('price', filters.minPrice);
      if (filters?.maxPrice) query = query.lte('price', filters.maxPrice);

      if (filters?.sortBy === 'price_asc') query = query.order('price', { ascending: true });
      else if (filters?.sortBy === 'price_desc') query = query.order('price', { ascending: false });
      else if (filters?.sortBy === 'featured') query = query.eq('is_featured', true);
      else query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      // Client-side filtering for JSON array fields (sizes, colors)
      let filtered = data || [];
      if (filters?.sizes?.length) {
        filtered = filtered.filter((p: Product) =>
          filters.sizes!.some((s) => (p.sizes || []).includes(s))
        );
      }
      if (filters?.colors?.length) {
        filtered = filtered.filter((p: Product) =>
          filters.colors!.some((c) => (p.colors || []).some((pc) => pc.name === c))
        );
      }

      setProducts(filtered);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return { products, loading, error, refetch: fetchProducts };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetchProduct();
  }, [slug]);

  async function fetchProduct() {
    if (!isSupabaseConfigured) {
      const found = MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
      setProduct(found);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return { product, loading, error };
}

export function useFeaturedProducts() {
  return useProducts({ sortBy: 'featured' });
}
