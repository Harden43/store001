import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useProductFilterOptions } from '../hooks/useProductFilterOptions';
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

function FilterPanel({
  filterOptions,
  filters,
  setFilters,
}: {
  filterOptions: ReturnType<typeof useProductFilterOptions>;
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
}) {
  const toggleSize = (size: string) => {
    const current = filters.sizes || [];
    const next = current.includes(size) ? current.filter((s) => s !== size) : [...current, size];
    setFilters((f) => ({ ...f, sizes: next }));
  };

  const toggleColor = (color: string) => {
    const current = filters.colors || [];
    const next = current.includes(color) ? current.filter((c) => c !== color) : [...current, color];
    setFilters((f) => ({ ...f, colors: next }));
  };

  return (
    <div className="filter-panel">
      {/* Price Range */}
      <div className="filter-group">
        <h4 className="filter-group-title">Price</h4>
        <div className="filter-price-inputs">
          <input
            type="number"
            placeholder={`${filterOptions.priceRange.min}`}
            value={filters.minPrice || ''}
            onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value ? Number(e.target.value) : undefined }))}
          />
          <span className="filter-price-sep">&ndash;</span>
          <input
            type="number"
            placeholder={`${filterOptions.priceRange.max}`}
            value={filters.maxPrice || ''}
            onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value ? Number(e.target.value) : undefined }))}
          />
        </div>
      </div>

      {/* Sizes */}
      {filterOptions.sizes.length > 0 && (
        <div className="filter-group">
          <h4 className="filter-group-title">Size</h4>
          <div className="filter-size-options">
            {filterOptions.sizes.map((s) => (
              <button
                key={s}
                className={`filter-size-btn ${(filters.sizes || []).includes(s) ? 'active' : ''}`}
                onClick={() => toggleSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {filterOptions.colors.length > 0 && (
        <div className="filter-group">
          <h4 className="filter-group-title">Color</h4>
          <div className="filter-color-options">
            {filterOptions.colors.map((c) => (
              <button
                key={c.name}
                className={`filter-color-swatch ${(filters.colors || []).includes(c.name) ? 'active' : ''}`}
                style={{ background: c.hex }}
                onClick={() => toggleColor(c.name)}
                title={c.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Shop() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('cat') || undefined;

  const [filters, setFilters] = useState<ProductFilters>({
    category: categoryParam,
    sortBy: 'newest',
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setFilters((f) => ({ ...f, category: categoryParam }));
  }, [categoryParam]);

  const { products, loading } = useProducts(filters);
  const filterOptions = useProductFilterOptions();
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

  const activeFilterCount =
    (filters.sizes?.length || 0) +
    (filters.colors?.length || 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0);

  const clearFilters = () => {
    setFilters((f) => ({ category: f.category, sortBy: f.sortBy }));
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
          <button className="shop-filter-toggle" onClick={() => setDrawerOpen(true)}>
            <SlidersHorizontal size={16} />
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </button>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as ProductFilters['sortBy'] })}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Active Filter Pills */}
        {activeFilterCount > 0 && (
          <div className="active-filters">
            {(filters.sizes || []).map((s) => (
              <button key={`s-${s}`} className="filter-pill" onClick={() => setFilters((f) => ({ ...f, sizes: (f.sizes || []).filter((x) => x !== s) }))}>
                Size: {s} <X size={12} />
              </button>
            ))}
            {(filters.colors || []).map((c) => (
              <button key={`c-${c}`} className="filter-pill" onClick={() => setFilters((f) => ({ ...f, colors: (f.colors || []).filter((x) => x !== c) }))}>
                {c} <X size={12} />
              </button>
            ))}
            {filters.minPrice && (
              <button className="filter-pill" onClick={() => setFilters((f) => ({ ...f, minPrice: undefined }))}>
                Min: ${filters.minPrice} <X size={12} />
              </button>
            )}
            {filters.maxPrice && (
              <button className="filter-pill" onClick={() => setFilters((f) => ({ ...f, maxPrice: undefined }))}>
                Max: ${filters.maxPrice} <X size={12} />
              </button>
            )}
            <button className="filter-clear" onClick={clearFilters}>Clear all</button>
          </div>
        )}

        <div className="shop-content">
          {/* Desktop Sidebar */}
          <aside className="shop-filters-sidebar">
            <FilterPanel filterOptions={filterOptions} filters={filters} setFilters={setFilters} />
          </aside>

          {/* Mobile Filter Drawer */}
          {drawerOpen && <div className="filter-drawer-backdrop" onClick={() => setDrawerOpen(false)} />}
          <div className={`filter-drawer ${drawerOpen ? 'open' : ''}`}>
            <div className="filter-drawer-header">
              <h3>Filters</h3>
              <button onClick={() => setDrawerOpen(false)}><X size={20} /></button>
            </div>
            <FilterPanel filterOptions={filterOptions} filters={filters} setFilters={setFilters} />
            <div className="filter-drawer-footer">
              <button className="btn-primary" onClick={() => setDrawerOpen(false)}>
                View Results ({products.length})
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="shop-grid-area">
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
              <p className="shop-empty">No products found. Try adjusting your filters.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
