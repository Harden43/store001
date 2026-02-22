import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Grid3X3, Tag, Mail, Users, BookOpen, Settings, ExternalLink } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Products', end: false },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders', end: false },
  { to: '/admin/categories', icon: Grid3X3, label: 'Categories', end: false },
  { to: '/admin/promo-codes', icon: Tag, label: 'Promo Codes', end: false },
  { to: '/admin/subscribers', icon: Mail, label: 'Subscribers', end: false },
  { to: '/admin/customers', icon: Users, label: 'Customers', end: false },
  { to: '/admin/journal', icon: BookOpen, label: 'Journal', end: false },
  { to: '/admin/settings', icon: Settings, label: 'Settings', end: false },
];

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <span className="admin-logo-the">the</span>
        <span className="admin-logo-aira">aira</span>
        <span className="admin-logo-edit">edit</span>
      </div>
      <div className="admin-sidebar-label">Admin Panel</div>

      <nav className="admin-nav">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-nav-divider" />

      <NavLink to="/" className="admin-nav-item admin-back-link">
        <ExternalLink size={18} />
        <span>Back to Store</span>
      </NavLink>
    </aside>
  );
}
