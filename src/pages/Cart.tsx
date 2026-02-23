import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function Cart() {
  const { items, removeItem, updateQty, subtotal } = useCartStore();
  const addToast = useToastStore((s) => s.add);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);

    if (!isSupabaseConfigured) {
      addToast('Promo codes require database connection', 'error');
      setPromoLoading(false);
      return;
    }

    const { data } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', promoCode.trim().toUpperCase())
      .eq('is_active', true)
      .maybeSingle();

    if (!data) {
      addToast('Invalid or expired promo code', 'error');
      setPromoLoading(false);
      return;
    }

    const sub = subtotal();
    if (data.min_order_value && sub < data.min_order_value) {
      addToast(`Minimum order of $${data.min_order_value.toFixed(2)} required`, 'error');
      setPromoLoading(false);
      return;
    }

    const discountAmount = data.discount_type === 'percentage'
      ? sub * (data.discount_value / 100)
      : data.discount_value;

    setDiscount(Math.min(discountAmount, sub));
    setAppliedCode(data.code);
    addToast(`Code "${data.code}" applied!`);
    setPromoLoading(false);
  };

  const handleRemovePromo = () => {
    setDiscount(0);
    setAppliedCode('');
    setPromoCode('');
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="cart-empty">
          <h1>Your Bag is Empty</h1>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const { get } = useSiteSettings();
  const shippingThreshold = parseFloat(get('shipping_threshold')) || 150;
  const shippingFlatRate = parseFloat(get('shipping_flat_rate')) || 9.95;
  const sub = subtotal();
  const shipping: number = sub >= shippingThreshold ? 0 : shippingFlatRate;
  const total = sub - discount + shipping;

  return (
    <div className="page">
      <div className="cart-page">
        <h1>Shopping Bag</h1>

        <div className="cart-layout">
          {/* Items */}
          <div>
            <ul className="cart-items">
              {items.map((item) => (
                <li key={`${item.product.id}-${item.size}-${item.color}`} className="cart-item">
                  <div className="cart-item-img">
                    {item.product.images[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#e8e0d4' }} />
                    )}
                  </div>

                  <div className="cart-item-details">
                    <div>
                      <Link to={`/shop/${item.product.slug}`} className="cart-item-name">
                        {item.product.name}
                      </Link>
                      <p className="cart-item-variant">{item.size} / {item.color}</p>
                    </div>

                    <div className="cart-item-bottom">
                      <div className="qty-control">
                        <button onClick={() => updateQty(item.product.id, item.size, item.color, item.quantity - 1)}>&#x2212;</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQty(item.product.id, item.size, item.color, item.quantity + 1)}>+</button>
                      </div>
                      <span className="cart-item-price">${(item.product.price * item.quantity).toFixed(2)}</span>
                      <button
                        className="cart-item-remove"
                        onClick={() => removeItem(item.product.id, item.size, item.color)}
                      >
                        &#x2715;
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <Link to="/shop" className="cart-back">&#x2190; Continue shopping</Link>
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>

            {/* Promo Code */}
            <div className="promo-section">
              {appliedCode ? (
                <div className="promo-applied">
                  <span>Code: <strong>{appliedCode}</strong> (-${discount.toFixed(2)})</span>
                  <button className="promo-remove" onClick={handleRemovePromo}>&times;</button>
                </div>
              ) : (
                <div className="promo-input-wrap">
                  <input
                    className="promo-input"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                  />
                  <button className="promo-apply-btn" onClick={handleApplyPromo} disabled={promoLoading}>
                    {promoLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>${sub.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="cart-summary-row cart-summary-discount">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="cart-summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping === 0 && sub > 0 && (
              <p className="cart-shipping-note">You've qualified for free shipping!</p>
            )}
            {shipping > 0 && (
              <p className="cart-shipping-note">Free shipping on orders over ${shippingThreshold.toFixed(0)}</p>
            )}
            <div className="cart-summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              className="btn-full"
              style={{ marginTop: '1.5rem' }}
              onClick={() => {
                if (!user) {
                  addToast('Please sign in to checkout', 'info');
                  navigate('/account');
                } else {
                  addToast('Checkout coming soon — payment integration in progress', 'info');
                }
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
