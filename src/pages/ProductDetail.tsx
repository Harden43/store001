import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct, useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useToastStore } from '../store/toastStore';
import { useRecentlyViewedStore } from '../store/recentlyViewedStore';
import SizeGuideModal from '../components/SizeGuideModal';
import SEO from '../components/SEO';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading, error } = useProduct(slug || '');
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);
  const { toggle, has } = useWishlistStore();
  const addToast = useToastStore((s) => s.add);
  const addRecent = useRecentlyViewedStore((s) => s.add);
  const recentProducts = useRecentlyViewedStore((s) => s.products);
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Track recently viewed
  useEffect(() => {
    if (product) addRecent(product);
  }, [product?.id]);

  // Reset selections when product changes
  useEffect(() => {
    setSelectedSize('');
    setSelectedColor('');
    setQty(1);
    setActiveImage(0);
  }, [slug]);

  // Related: same category, exclude current
  const { products: relatedProducts } = useProducts(
    product?.category?.slug ? { category: product.category.slug } : undefined
  );
  const related = relatedProducts.filter((p) => p.id !== product?.id).slice(0, 4);

  // Recently viewed: exclude current product
  const recent = recentProducts.filter((p) => p.id !== product?.id).slice(0, 4);

  if (loading) {
    return (
      <div className="page">
        <div className="pdp-grid">
          <div>
            <div className="skeleton-image" />
            <div className="pdp-thumbs">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-thumb" />
              ))}
            </div>
          </div>
          <div>
            <div className="skeleton-text skeleton-eyebrow" />
            <div className="skeleton-text skeleton-title" />
            <div className="skeleton-text skeleton-price" />
            <div className="skeleton-text skeleton-desc" />
            <div className="skeleton-text skeleton-desc" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page">
        <div className="cart-empty">
          <h1>Product not found</h1>
          <p>We couldn't find what you're looking for.</p>
          <Link to="/shop" className="btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    if (!selectedSize && product.sizes.length > 0) {
      addToast('Please select a size', 'error');
      return;
    }
    if (!selectedColor && product.colors.length > 0) {
      addToast('Please select a color', 'error');
      return;
    }
    addItem(product, selectedSize || 'One Size', selectedColor || 'Default', qty);
    addToast(`${product.name} added to bag`);
  };

  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const lowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
  const outOfStock = product.stock_quantity === 0;

  return (
    <div className="page">
      <SEO
        title={product.name}
        description={product.description || `Shop ${product.name} at The Aira Edit`}
        image={product.images[0]}
      />
      <div className="pdp-grid">
        {/* Images */}
        <div>
          <div className="pdp-image-main">
            {product.images[activeImage] ? (
              <img src={product.images[activeImage]} alt={product.name} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg,#b5c4b0,#8a9c85)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sage-light)', fontFamily: "'Jost', sans-serif", fontSize: '0.8rem' }}>
                No image available
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="pdp-thumbs">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`pdp-thumb ${i === activeImage ? 'active' : ''}`}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pdp-info">
          <span className="eyebrow">{product.category?.name}</span>
          <div className="pdp-title-row">
            <h1>{product.name}</h1>
            <button
              className={`pdp-wishlist ${has(product.id) ? 'active' : ''}`}
              onClick={() => {
                if (!user) { navigate('/account'); return; }
                const wasInWishlist = has(product.id);
                toggle(product.id, user.id);
                addToast(wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
              }}
            >
              {has(product.id) ? '\u2665' : '\u2661'}
            </button>
          </div>

          <div className="pdp-price">
            {hasDiscount && <span className="original">${product.compare_price!.toFixed(2)}</span>}
            ${product.price.toFixed(2)}
          </div>

          {/* Stock indicator */}
          {outOfStock && <span className="stock-badge out-of-stock">Out of Stock</span>}
          {lowStock && <span className="stock-badge low-stock">Only {product.stock_quantity} left</span>}

          {product.description && (
            <p className="pdp-description">{product.description}</p>
          )}

          {/* Size */}
          {product.sizes.length > 0 && (
            <div>
              <div className="pdp-option-header">
                <span className="pdp-option-label">Size</span>
                <button className="pdp-size-guide-link" onClick={() => setSizeGuideOpen(true)}>
                  Size Guide
                </button>
              </div>
              <div className="pdp-sizes">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color */}
          {product.colors.length > 0 && (
            <div>
              <span className="pdp-option-label">Color</span>
              <div className="pdp-colors">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`color-btn ${selectedColor === c.name ? 'active' : ''}`}
                  >
                    <span className="swatch" style={{ background: c.hex }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + Add */}
          <div className="pdp-actions">
            <div className="qty-control">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>&#x2212;</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button className="btn-add-bag" onClick={handleAdd} disabled={outOfStock}>
              {outOfStock ? 'Out of Stock' : 'Add to Bag'}
            </button>
          </div>

          {/* Details */}
          {(product.material || product.care_instructions) && (
            <div className="pdp-meta">
              {product.material && <p><strong>Material:</strong> {product.material}</p>}
              {product.care_instructions && <p><strong>Care:</strong> {product.care_instructions}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="pdp-related">
          <div className="section-header">
            <span className="section-eyebrow">You May Also Like</span>
            <h2 className="section-title">Related <em>Products</em></h2>
            <div className="section-rule" />
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <Link to={`/shop/${p.slug}`} key={p.id} className="product-card" style={{ textDecoration: 'none' }}>
                <div className="product-image-wrap">
                  {p.images[0] ? (
                    <img src={p.images[0]} alt={p.name} loading="lazy" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg,#b5c4b0,#8a9c85)' }} />
                  )}
                </div>
                <p className="product-category">{p.category?.name}</p>
                <h3 className="product-name">{p.name}</h3>
                <div className="product-price">${p.price.toFixed(2)}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      {recent.length > 0 && (
        <div className="pdp-related">
          <div className="section-header">
            <span className="section-eyebrow">Recently Viewed</span>
            <h2 className="section-title">Your <em>History</em></h2>
            <div className="section-rule" />
          </div>
          <div className="product-grid">
            {recent.map((p) => (
              <Link to={`/shop/${p.slug}`} key={p.id} className="product-card" style={{ textDecoration: 'none' }}>
                <div className="product-image-wrap">
                  {p.images[0] ? (
                    <img src={p.images[0]} alt={p.name} loading="lazy" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg,#b5c4b0,#8a9c85)' }} />
                  )}
                </div>
                <p className="product-category">{p.category?.name}</p>
                <h3 className="product-name">{p.name}</h3>
                <div className="product-price">${p.price.toFixed(2)}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}
