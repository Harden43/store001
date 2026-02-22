import { Link, useNavigate } from 'react-router-dom';
import { useFeaturedProducts } from '../../hooks/useProducts';
import { useAuthStore } from '../../store/authStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from '../../store/toastStore';
import type { Product } from '../../types';

export default function FeaturedCollection() {
  const { products, loading } = useFeaturedProducts();
  const user = useAuthStore((s) => s.user);
  const { toggle, has } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.add);
  const navigate = useNavigate();

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock_quantity === 0) {
      addToast('This item is sold out', 'error');
      return;
    }
    const size = product.sizes[0] || '';
    const color = product.colors[0]?.name || '';
    addItem(product, size, color);
    addToast(`${product.name} added to bag`);
  };

  const handleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/account'); return; }
    toggle(productId, user.id);
  };

  return (
    <section className="section">
      <div className="section-header">
        <span className="section-eyebrow">The Collection</span>
        <h2 className="section-title">Featured <em>this season</em></h2>
        <div className="section-rule" />
      </div>

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="product-card">
              <div className="product-image-wrap" style={{ background: '#e8e0d4', animation: 'pulse 2s infinite' }} />
              <div style={{ height: 12, width: 60, background: '#e8e0d4', marginTop: '0.75rem', borderRadius: 2 }} />
              <div style={{ height: 16, width: 140, background: '#e8e0d4', marginTop: '0.5rem', borderRadius: 2 }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="product-grid">
          {products.slice(0, 4).map((p) => {
            const hasDiscount = p.compare_price && p.compare_price > p.price;
            return (
              <Link to={`/shop/${p.slug}`} key={p.id} className="product-card" style={{ textDecoration: 'none' }}>
                <div className="product-image-wrap">
                  {p.images[0] ? (
                    <img src={p.images[0]} alt={p.name} loading="lazy" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg,#b5c4b0,#8a9c85)' }} />
                  )}
                  {p.tags?.includes('new') && <div className="product-badge">New</div>}
                  {hasDiscount && !p.tags?.includes('new') && <div className="product-badge sale">Sale</div>}
                  <button
                    className={`product-wishlist ${has(p.id) ? 'active' : ''}`}
                    onClick={(e) => handleWishlist(e, p.id)}
                  >
                    {has(p.id) ? '\u2665' : '\u2661'}
                  </button>
                  <button className="product-quick-add" onClick={(e) => handleQuickAdd(e, p)}>Quick Add</button>
                </div>
                <p className="product-category">{p.category?.name}</p>
                <h3 className="product-name">{p.name}</h3>
                <div className="product-price">
                  {hasDiscount && (
                    <span className="original">${p.compare_price!.toFixed(2)}</span>
                  )}
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
      )}

      <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
        <Link to="/shop" className="btn-primary">View All Products</Link>
      </div>
    </section>
  );
}
