import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { HeartIcon } from '../components/ui/EmptyStateIcons';
import type { Product } from '../types';

export default function Wishlist() {
  const user = useAuthStore((s) => s.user);
  const { productIds, toggle } = useWishlistStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/account');
      return;
    }

    async function fetchWishlistProducts() {
      const ids = Array.from(productIds);
      if (ids.length === 0 || !isSupabaseConfigured) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .in('id', ids)
        .eq('is_active', true);

      setProducts(data || []);
      setLoading(false);
    }

    fetchWishlistProducts();
  }, [user, productIds, navigate]);

  const handleRemove = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) toggle(productId, user.id);
  };

  return (
    <div className="page">
      <div className="page-inner">
        <div className="page-header">
          <span className="section-eyebrow">Saved Items</span>
          <h1 className="section-title">Your <em>Wishlist</em></h1>
          <div className="section-rule" />
        </div>

        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="product-card skeleton-card" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.map((p) => {
              const hasDiscount = p.compare_price && p.compare_price > p.price;
              return (
                <Link to={`/shop/${p.slug}`} key={p.id} className="product-card" style={{ textDecoration: 'none' }}>
                  <div className="product-image-wrap">
                    {p.images[0] ? (
                      <img src={p.images[0]} alt={p.name} loading="lazy" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg,#b5c4b0,#8a9c85)' }} />
                    )}
                    {hasDiscount && <div className="product-badge sale">Sale</div>}
                    <button
                      className="product-wishlist active"
                      onClick={(e) => handleRemove(e, p.id)}
                      aria-label={`Remove ${p.name} from wishlist`}
                    >
                      <Heart size={16} fill="currentColor" />
                    </button>
                  </div>
                  <p className="product-category">{p.category?.name}</p>
                  <h3 className="product-name">{p.name}</h3>
                  <div className="product-price">
                    {hasDiscount && <span className="original">${p.compare_price!.toFixed(2)}</span>}
                    ${p.price.toFixed(2)}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="cart-empty">
            <div className="empty-state-icon"><HeartIcon /></div>
            <h2>No saved items yet</h2>
            <p>Browse our collection and tap the heart to save your favourites.</p>
            <Link to="/shop" className="btn-primary">Shop Now</Link>
          </div>
        )}
      </div>
    </div>
  );
}
