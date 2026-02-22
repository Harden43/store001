import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Product } from '../types';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';

export default function Lookbook() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);
  const { toggle, has } = useWishlistStore();

  useEffect(() => {
    async function fetchFeatured() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(12);
      setProducts(data || []);
      setLoading(false);
    }
    fetchFeatured();
  }, []);

  const handleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    toggle(productId, user.id);
  };

  // Assign layout sizes for masonry-like feel
  const getCardSize = (index: number): string => {
    const pattern = [
      'lookbook-tall', 'lookbook-wide', 'lookbook-normal',
      'lookbook-normal', 'lookbook-tall', 'lookbook-normal',
      'lookbook-wide', 'lookbook-normal', 'lookbook-normal',
      'lookbook-tall', 'lookbook-normal', 'lookbook-wide',
    ];
    return pattern[index % pattern.length];
  };

  return (
    <div className="page">
      <SEO title="Lookbook" description="Curated styling inspiration from The Aira Edit." />
      <div className="page-inner">
        <div className="page-header">
          <span className="section-eyebrow">Editorial</span>
          <h1 className="section-title">The <em>Lookbook</em></h1>
          <div className="section-rule" />
          <p className="collections-subtitle">
            Curated styling inspiration — discover how our pieces come together.
          </p>
        </div>

        {loading ? (
          <div className="lookbook-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`lookbook-card ${getCardSize(i)} lookbook-card-loading`} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="lookbook-grid">
            {products.map((p, i) => (
              <Link
                key={p.id}
                to={`/shop/${p.slug}`}
                className={`lookbook-card ${getCardSize(i)}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="lookbook-image">
                  {p.images[0] ? (
                    <img src={p.images[0]} alt={p.name} loading="lazy" />
                  ) : (
                    <div className="lookbook-placeholder" />
                  )}
                  <div className="lookbook-overlay">
                    <div className="lookbook-info">
                      <span className="lookbook-category">{p.category?.name}</span>
                      <h3 className="lookbook-name">{p.name}</h3>
                      <span className="lookbook-price">${p.price.toFixed(2)}</span>
                    </div>
                    {user && (
                      <button
                        className={`lookbook-wishlist ${has(p.id) ? 'active' : ''}`}
                        onClick={(e) => handleWishlist(e, p.id)}
                      >
                        {has(p.id) ? '\u2665' : '\u2661'}
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="shop-empty">No featured pieces yet. Check back soon for editorial inspiration!</p>
        )}
      </div>
    </div>
  );
}
