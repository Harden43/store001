import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useOrders } from '../hooks/useOrders';
import { isSupabaseConfigured } from '../lib/supabase';
import SEO from '../components/SEO';

export default function Account() {
  const { user, profile, loading, signInWithGoogle, signOut } = useAuthStore();
  const totalItems = useCartStore((s) => s.totalItems);
  const wishlistCount = useWishlistStore((s) => s.productIds.size);
  const { orders, loading: ordersLoading } = useOrders(user?.id);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');

    if (!isSupabaseConfigured) {
      setError('Authentication not configured. Please add Supabase credentials.');
      return;
    }

    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError((err as Error).message);
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <SEO title="Account" />
        <div className="account-page">
          <div className="account-loading">
            <div className="account-loading-dot" />
            <div className="account-loading-dot" />
            <div className="account-loading-dot" />
          </div>
        </div>
      </div>
    );
  }

  // ── Signed-in view ──
  if (user) {
    const displayName = profile?.full_name
      || user.user_metadata?.full_name
      || user.user_metadata?.name
      || null;
    const avatarUrl = profile?.avatar_url
      || user.user_metadata?.avatar_url
      || user.user_metadata?.picture
      || null;
    const initials = displayName
      ? displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
      : (user.email?.[0] || '?').toUpperCase();
    const memberSince = user.created_at
      ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : null;

    return (
      <div className="page">
        <SEO title="My Account" />
        <div className="account-page account-signed-in">
          {/* Hero profile area */}
          <div className="account-hero">
            <div className="account-avatar-wrap">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName || 'Profile'}
                  referrerPolicy="no-referrer"
                  className="account-avatar"
                />
              ) : (
                <div className="account-avatar account-avatar-initials">
                  {initials}
                </div>
              )}
              <div className="account-avatar-ring" />
            </div>
            <h1 className="account-name">{displayName || 'Hello'}</h1>
            <p className="account-email">{user.email}</p>
            {memberSince && (
              <p className="account-member-since">Member since {memberSince}</p>
            )}
          </div>

          {/* Quick stats */}
          <div className="account-stats">
            <Link to="/wishlist" className="account-stat">
              <span className="account-stat-number">{wishlistCount}</span>
              <span className="account-stat-label">Wishlist</span>
            </Link>
            <div className="account-stat-divider" />
            <Link to="/cart" className="account-stat">
              <span className="account-stat-number">{totalItems()}</span>
              <span className="account-stat-label">In Bag</span>
            </Link>
          </div>

          {/* Quick links */}
          <div className="account-links">
            <Link to="/shop" className="account-link-card">
              <span className="account-link-icon">&#x2606;</span>
              <div>
                <span className="account-link-title">Browse Shop</span>
                <span className="account-link-desc">Discover new arrivals</span>
              </div>
              <span className="account-link-arrow">&#x2192;</span>
            </Link>
            <Link to="/wishlist" className="account-link-card">
              <span className="account-link-icon">&#x2661;</span>
              <div>
                <span className="account-link-title">My Wishlist</span>
                <span className="account-link-desc">Your saved pieces</span>
              </div>
              <span className="account-link-arrow">&#x2192;</span>
            </Link>
            <Link to="/collections" className="account-link-card">
              <span className="account-link-icon">&#x25C7;</span>
              <div>
                <span className="account-link-title">Collections</span>
                <span className="account-link-desc">Curated for you</span>
              </div>
              <span className="account-link-arrow">&#x2192;</span>
            </Link>
          </div>

          {/* Order History */}
          <div className="account-orders">
            <h2 className="account-section-title">Order History</h2>
            {ordersLoading ? (
              <p className="account-orders-loading">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="account-orders-empty">
                <p>No orders yet.</p>
                <Link to="/shop" className="btn-outline">Start Shopping &rarr;</Link>
              </div>
            ) : (
              <div className="order-list">
                {orders.map((order) => {
                  const isExpanded = expandedOrder === order.id;
                  const statusClass = order.status === 'delivered' ? 'delivered' : order.status === 'shipped' ? 'shipped' : order.status === 'cancelled' ? 'cancelled' : '';
                  return (
                    <div key={order.id} className="order-card">
                      <button
                        className="order-card-header"
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      >
                        <div className="order-card-info">
                          <span className="order-number">#{order.order_number}</span>
                          <span className="order-date">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="order-card-meta">
                          <span className={`order-status ${statusClass}`}>{order.status}</span>
                          <span className="order-total">${order.total.toFixed(2)}</span>
                          <ChevronDown size={16} className={`order-expand-icon ${isExpanded ? 'expanded' : ''}`} />
                        </div>
                      </button>
                      {isExpanded && order.order_items && (
                        <div className="order-card-items">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="order-item">
                              <div className="order-item-img">
                                {item.product_image ? (
                                  <img src={item.product_image} alt={item.product_name} />
                                ) : (
                                  <div style={{ width: '100%', height: '100%', background: '#e8e0d4' }} />
                                )}
                              </div>
                              <div className="order-item-details">
                                <span className="order-item-name">{item.product_name}</span>
                                {(item.size || item.color) && (
                                  <span className="order-item-variant">{[item.size, item.color].filter(Boolean).join(' / ')}</span>
                                )}
                              </div>
                              <span className="order-item-qty">x{item.quantity}</span>
                              <span className="order-item-price">${(item.unit_price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sign out */}
          <button className="account-signout" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // ── Sign-in view ──
  return (
    <div className="page">
      <SEO title="Sign In" />
      <div className="account-page account-signin">
        <div className="account-signin-content">
          <div className="account-signin-brand">
            <span className="account-signin-the">the</span>
            <span className="account-signin-aira">aira</span>
            <span className="account-signin-edit">e d i t</span>
          </div>

          <h1 className="account-signin-title">Welcome</h1>
          <p className="account-signin-subtitle">
            Sign in to access your wishlist, track orders, and enjoy a personalized experience.
          </p>

          {error && <p className="account-signin-error">{error}</p>}

          <button
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            className="google-signin-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l3.56-2.77z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {signingIn ? 'Redirecting...' : 'Continue with Google'}
          </button>

          <div className="account-signin-divider">
            <span>or</span>
          </div>

          <Link to="/shop" className="account-guest-btn">
            Browse as Guest
          </Link>

          <p className="account-signin-footer">
            By signing in, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
