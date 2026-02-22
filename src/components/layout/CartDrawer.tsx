import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal } = useCartStore();

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-backdrop" onClick={closeCart} />

      <div className="drawer">
        <div className="drawer-header">
          <h2>Your Bag</h2>
          <button className="drawer-close" onClick={closeCart}>&#x2715;</button>
        </div>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <p>Your bag is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.product.id}-${item.size}-${item.color}`} className="drawer-item">
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
                      <button onClick={() => updateQty(item.product.id, item.size, item.color, item.quantity - 1)}>&#x2212;</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(item.product.id, item.size, item.color, item.quantity + 1)}>+</button>
                    </div>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: 'var(--sage-dark)' }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeItem(item.product.id, item.size, item.color)}
                    >
                      &#x2715;
                    </button>
                  </div>
                </div>
              </div>
            ))
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
