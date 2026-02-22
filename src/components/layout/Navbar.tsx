import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

interface Props {
  onSearchOpen?: () => void;
}

export default function Navbar({ onSearchOpen }: Props) {
  const totalItems = useCartStore((s) => s.totalItems);
  const openCart = useCartStore((s) => s.openCart);
  const wishlistCount = useWishlistStore((s) => s.productIds.size);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav className="site-nav">
        <ul className="nav-links">
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/collections">Collections</Link></li>
          <li><Link to="/lookbook">Lookbook</Link></li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className={`mobile-menu-btn ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>

        <Link to="/" className="nav-logo">
          <span className="the">the</span>
          <span className="aira">aira</span>
          <span className="edit">e d i t</span>
        </Link>

        <div className="nav-actions">
          <ul className="nav-links">
            <li><Link to="/about">About</Link></li>
          </ul>
          <button title="Search" onClick={onSearchOpen} aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <Link to="/wishlist" className="nav-wishlist-link" title="Wishlist">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
          </Link>
          <Link to="/account" className="nav-account-link" title="Account">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
          </Link>
          <button className="cart-btn" title="Cart" onClick={openCart} aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {totalItems() > 0 && (
              <span className="cart-badge">{totalItems()}</span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-inner">
          <Link to="/shop" className="mobile-menu-link">Shop</Link>
          <Link to="/collections" className="mobile-menu-link">Collections</Link>
          <Link to="/lookbook" className="mobile-menu-link">Lookbook</Link>
          <Link to="/about" className="mobile-menu-link">About</Link>
          <div className="mobile-menu-divider" />
          <Link to="/account" className="mobile-menu-link">Account</Link>
          <Link to="/wishlist" className="mobile-menu-link">Wishlist</Link>
        </div>
      </div>
      {menuOpen && <div className="mobile-menu-backdrop" onClick={() => setMenuOpen(false)} />}
    </>
  );
}
