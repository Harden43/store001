import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import SEO from '../components/SEO';
import type { ProductFilters } from '../types';

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' as const },
  { label: 'Price: Low to High', value: 'price_asc' as const },
  { label: 'Price: High to Low', value: 'price_desc' as const },
];

export default function Shop() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('cat') || undefined;

  const [filters, setFilters] = useState<ProductFilters>({
    category: categoryParam,
    sortBy: 'newest',
  });

  useEffect(() => {
    setFilters((f) => ({ ...f, category: categoryParam }));
  }, [categoryParam]);

  const { products, loading } = useProducts(filters);
  const user = useAuthStore((s) => s.user);
  const { toggle, has } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.add);
  const navigate = useNavigate();

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
      <SEO title={categoryParam ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1) : 'Shop'} description="Browse our curated collection of thoughtfully designed pieces." />
      <div className="page-inner">
        <div className="page-header">
          <span className="section-eyebrow">Collection</span>
          <h1 className="section-title">
            {categoryParam
              ? <><em>{categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}</em></>
              : <>Shop <em>All</em></>
            }
          </h1>
          <div className="section-rule" />
        </div>

        <div className="shop-toolbar">
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as ProductFilters['sortBy'] })}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
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
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.map((p) => {
              const hasDiscount = p.compare_price && p.compare_price > p.price;
              const lowStock = p.stock_quantity > 0 && p.stock_quantity <= 5;
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
                    {!outOfStock && lowStock && <div className="product-stock-tag">Only {p.stock_quantity} left</div>}
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
        ) : (
          <p className="shop-empty">No products found. Check back soon!</p>
        )}
      </div>
    </div>
  );
}
