import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { useAuthStore } from '../../store/authStore';
import ErrorBoundary from '../ErrorBoundary';

export default function AdminLayout() {
  const profile = useAuthStore((s) => s.profile);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ErrorBoundary>
    <div className="admin-layout">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="admin-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
      <div className="admin-content">
        <header className="admin-header">
          <button
            className="admin-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>
          <div className="admin-header-right">
            <span className="admin-header-name">{profile?.full_name || profile?.email}</span>
            {profile?.avatar_url && (
              <img src={profile.avatar_url} alt="" className="admin-avatar" />
            )}
          </div>
        </header>
        <div className="admin-body">
          <Outlet />
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
