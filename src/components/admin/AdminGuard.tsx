import { useState } from 'react';
import { Outlet } from 'react-router-dom';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'aira2026';

export default function AdminGuard() {
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem('admin_password'));
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (authed) return <Outlet />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      // Store actual password so adminApi can send it to the Edge Function
      sessionStorage.setItem('admin_password', password);
      setAuthed(true);
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <span className="admin-logo-the">the</span>
          <span className="admin-logo-aira">aira</span>
          <span className="admin-logo-edit">edit</span>
        </div>
        <h1 className="admin-login-title">Admin Panel</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="admin-form-input"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            autoFocus
          />
          {error && <p className="admin-login-error">{error}</p>}
          <button type="submit" className="admin-btn admin-btn-primary admin-login-btn">
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
