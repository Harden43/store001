import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import SEO from '../components/SEO';
import type { Product } from '../types';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useAuthStore((s) => s.user);
  const { toggle, has } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.add);
  const navigate = useNavigate();

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      if (!isSupabaseConfigured) {
        setResults([]);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_active', true)
        .ilike('name', `%${q.trim()}%`);
      setResults(data || []);
      setLoading(false);
    })();
  }, [q]);

  const handleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/account'); return; }
    const wasInWishlist = has(productId);
    toggle(productId, user.id);
    addToast(wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div className="page">
      <SEO title={q ? `Search: ${q}` : 'Search'} />
      <div className="page-inner">
        <div className="page-header">
          <span className="section-eyebrow">Search</span>
          <h1 className="section-title">
            {q ? <>Results for <em>"{q}"</em></> : <>Search</>}
          </h1>
          <div className="section-rule" />
        </div>

        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="product-card skeleton-card">
                <div className="product-image-wrap skeleton-image" />
                <div className="skeleton-text" style={{ width: '40%', marginTop: '0.75rem' }} />
                <div className="skeleton-text" style={{ width: '70%' }} />
                <div className="skeleton-text" style={{ width: '30%' }} />
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <>
            <p className="search-results-count">{results.length} product{results.length !== 1 ? 's' : ''} found</p>
            <div className="product-grid">
              {results.map((p) => {
                const hasDiscount = p.compare_price && p.compare_price > p.price;
                const outOfStock = p.stock_quantity === 0;
                return (
                  <Link to={`/shop/${p.slug}`} key={p.id} className="product-card" style={{ textDecoration: 'none' }}>
                    <div className="product-image-wrap">
                      {p.images[0] ? (
                        <img src={p.images[0]} alt={p.name} loading="lazy" />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg,#b5c4b0,#8a9c85)' }} />
                      )}
                      {outOfStock && <div className="product-badge sold-out">Sold Out</div>}
                      {!outOfStock && p.tags?.includes('new') && <div className="product-badge">New</div>}
                      {!outOfStock && hasDiscount && !p.tags?.includes('new') && <div className="product-badge sale">Sale</div>}
                      <button
                        className={`product-wishlist ${has(p.id) ? 'active' : ''}`}
                        onClick={(e) => handleWishlist(e, p.id)}
                      >
                        {has(p.id) ? '\u2665' : '\u2661'}
                      </button>
                      <button className="product-quick-add" onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (p.stock_quantity === 0) { addToast('This item is sold out', 'error'); return; }
                        addItem(p, p.sizes[0] || '', p.colors[0]?.name || '');
                        addToast(`${p.name} added to bag`);
                      }}>Quick Add</button>
                    </div>
                    <p className="product-category">{p.category?.name}</p>
                    <h3 className="product-name">{p.name}</h3>
                    <div className="product-price">
                      {hasDiscount && <span className="original">${p.compare_price!.toFixed(2)}</span>}
                      ${p.price.toFixed(2)}
                    </div>
                    {p.colors.length > 0 && (
                      <div className="product-colors">
                        {p.colors.map((c) => (
                          <div key={c.name} className="color-dot" style={{ background: c.hex }} />
                        ))}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </>
        ) : q.trim() ? (
          <div className="search-empty">
            <h2>No results found</h2>
            <p>We couldn't find anything matching "{q}". Try a different search term.</p>
            <Link to="/shop" className="btn-primary">Browse All Products</Link>
          </div>
        ) : (
          <div className="search-empty">
            <p>Enter a search term to find products.</p>
          </div>
        )}
      </div>
    </div>
  );
}
