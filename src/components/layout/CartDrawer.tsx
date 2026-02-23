import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Minus, Plus } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { SmallBagIcon } from '../ui/EmptyStateIcons';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal } = useCartStore();
  const trapRef = useFocusTrap(isOpen);
  const [removingKey, setRemovingKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, closeCart]);

  const handleRemove = (productId: string, size: string, color: string) => {
    const key = `${productId}-${size}-${color}`;
    setRemovingKey(key);
    setTimeout(() => {
      removeItem(productId, size, color);
      setRemovingKey(null);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-backdrop" onClick={closeCart} />

      <div className="drawer" role="dialog" aria-modal="true" aria-label="Shopping bag" ref={trapRef}>
        <div className="drawer-header">
          <h2>Your Bag</h2>
          <button className="drawer-close" onClick={closeCart} aria-label="Close shopping bag"><X size={18} /></button>
        </div>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <SmallBagIcon />
              <p>Your bag is empty</p>
              <Link to="/shop" onClick={closeCart} className="btn-primary" style={{ marginTop: '1rem', fontSize: '0.65rem', padding: '0.65rem 1.5rem' }}>Continue Shopping</Link>
            </div>
          ) : (
            items.map((item) => {
              const key = `${item.product.id}-${item.size}-${item.color}`;
              return (
                <div key={key} className={`drawer-item ${removingKey === key ? 'removing' : ''}`}>
                  <div className="drawer-item-img">
                    {item.product.images[0] && (
                      <img src={item.product.images[0]} alt={item.product.name} />
                    )}
                  </div>

                  <div className="drawer-item-info">
                    <p className="drawer-item-name">{item.product.name}</p>
                    <p className="drawer-item-variant">{item.size} / {item.color}</p>

                    <div className="drawer-item-row">
                      <div className="qty-control">
                        <button onClick={() => updateQty(item.product.id, item.size, item.color, item.quantity - 1)} aria-label={`Decrease quantity of ${item.product.name}`}><Minus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQty(item.product.id, item.size, item.color, item.quantity + 1)} aria-label={`Increase quantity of ${item.product.name}`}><Plus size={14} /></button>
                      </div>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: 'var(--sage-dark)' }}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        className="cart-item-remove"
                        onClick={() => handleRemove(item.product.id, item.size, item.color)}
                        aria-label={`Remove ${item.product.name} from bag`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-subtotal">
              <span>Subtotal</span>
              <span>${subtotal().toFixed(2)}</span>
            </div>
            <Link to="/cart" onClick={closeCart} className="drawer-checkout">
              View Bag &amp; Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
