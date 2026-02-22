import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Category } from '../types';

const COLLECTION_IMAGES: Record<string, string> = {
  dresses: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop',
  tops: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80&auto=format&fit=crop',
  bottoms: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80&auto=format&fit=crop',
  outerwear: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80&auto=format&fit=crop',
  accessories: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80&auto=format&fit=crop',
};

const FALLBACK_CATEGORIES: (Category & { eyebrow: string })[] = [
  { id: '1', slug: 'dresses', name: 'Dresses & Jumpsuits', description: 'Elegant pieces for every occasion', image_url: COLLECTION_IMAGES.dresses, sort_order: 1, eyebrow: 'Featured' },
  { id: '2', slug: 'tops', name: 'Tops', description: 'Everyday essentials and statement pieces', image_url: COLLECTION_IMAGES.tops, sort_order: 2, eyebrow: 'Everyday' },
  { id: '3', slug: 'bottoms', name: 'Bottoms', description: 'Effortless silhouettes', image_url: COLLECTION_IMAGES.bottoms, sort_order: 3, eyebrow: 'Effortless' },
  { id: '4', slug: 'outerwear', name: 'Outerwear', description: 'Layer up in style', image_url: COLLECTION_IMAGES.outerwear, sort_order: 4, eyebrow: 'Layer Up' },
  { id: '5', slug: 'accessories', name: 'Accessories', description: 'Complete your look', image_url: COLLECTION_IMAGES.accessories, sort_order: 5, eyebrow: 'Complete' },
];

const GRADIENT_STYLES = [
  'linear-gradient(160deg, rgba(90,107,86,0.85), rgba(90,107,86,0.4)), #8a9c85',
  'linear-gradient(160deg, rgba(44,44,44,0.75), rgba(44,44,44,0.3)), #9aaa95',
  'linear-gradient(160deg, rgba(90,107,86,0.8), rgba(90,107,86,0.3)), #7a8c75',
  'linear-gradient(160deg, rgba(44,44,44,0.75), rgba(44,44,44,0.3)), #b5a090',
  'linear-gradient(160deg, rgba(90,107,86,0.8), rgba(90,107,86,0.3)), #c5b5a5',
  'linear-gradient(160deg, rgba(122,140,117,0.8), rgba(122,140,117,0.3)), #a8b8a3',
];

const EYEBROWS = ['Featured', 'Everyday', 'Effortless', 'Layer Up', 'Complete', 'Curated'];

export default function Collections() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      if (!isSupabaseConfigured) {
        setCategories(FALLBACK_CATEGORIES);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      setCategories(data || []);
      setLoading(false);
    }
    fetchCategories();
  }, []);

  return (
    <div className="page">
      <SEO title="Collections" description="Browse our collections by category." />
      <div className="page-inner">
        <div className="page-header">
          <span className="section-eyebrow">Browse by</span>
          <h1 className="section-title">Our <em>Collections</em></h1>
          <div className="section-rule" />
          <p className="collections-subtitle">
            Thoughtfully curated categories to help you find exactly what you're looking for.
          </p>
        </div>

        {loading ? (
          <div className="collections-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="collection-card collection-card-loading" />
            ))}
          </div>
        ) : (
          <div className="collections-grid">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/shop?cat=${cat.slug}`}
                className="collection-card"
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="collection-card-bg"
                  style={{
                    background: (cat.image_url || COLLECTION_IMAGES[cat.slug])
                      ? `linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.05)), url(${cat.image_url || COLLECTION_IMAGES[cat.slug]}) center/cover`
                      : GRADIENT_STYLES[i % GRADIENT_STYLES.length],
                  }}
                />
                <div className="collection-card-content">
                  <span className="collection-eyebrow">{EYEBROWS[i % EYEBROWS.length]}</span>
                  <h2 className="collection-name">{cat.name}</h2>
                  {cat.description && (
                    <p className="collection-desc">{cat.description}</p>
                  )}
                  <span className="collection-link">Shop Now &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
