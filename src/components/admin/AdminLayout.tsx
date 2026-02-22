import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuthStore } from '../../store/authStore';

export default function AdminLayout() {
  const profile = useAuthStore((s) => s.profile);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <header className="admin-header">
          <div />
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
  );
}
