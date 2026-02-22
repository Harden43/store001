import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Account() {
  const { user, profile, loading, signInWithGoogle, signOut } = useAuthStore();
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
        <div className="account-page" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-mid)', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    const displayName = profile?.full_name
      || user.user_metadata?.full_name
      || user.user_metadata?.name
      || null;
    const avatarUrl = profile?.avatar_url
      || user.user_metadata?.avatar_url
      || user.user_metadata?.picture
      || null;

    return (
      <div className="page">
        <div className="account-page">
          <div className="page-header">
            <span className="section-eyebrow">Your Account</span>
            <h1 className="section-title"><em>Welcome back</em></h1>
          </div>

          <div className="cart-summary" style={{ textAlign: 'center' }}>
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={displayName || 'Profile'}
                referrerPolicy="no-referrer"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--gold)',
                  marginBottom: '1rem',
                }}
              />
            )}
            {displayName && (
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.3rem',
                color: 'var(--sage-dark)',
                fontWeight: 400,
                marginBottom: '0.25rem',
              }}>
                {displayName}
              </p>
            )}
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '0.85rem',
              color: 'var(--text-mid)',
              marginBottom: '0.5rem',
            }}>
              {user.email}
            </p>
            <button
              className="btn-outline"
              onClick={signOut}
              style={{ marginTop: '1.5rem', color: 'var(--text-dark)', borderColor: 'rgba(122,140,117,0.3)' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="account-page">
        <div className="page-header">
          <span className="section-eyebrow">Welcome</span>
          <h1 className="section-title"><em>Sign In</em></h1>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.05rem',
            color: 'var(--text-mid)',
            marginTop: '1rem',
            fontStyle: 'italic',
          }}>
            Continue with your Google account
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          {error && <p className="form-error" style={{ marginBottom: '1rem' }}>{error}</p>}

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
            {signingIn ? 'Redirecting...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
    </div>
  );
}
