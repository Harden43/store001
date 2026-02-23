import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Grid3X3, Tag, Mail, Users, BookOpen, Settings, ExternalLink, X } from 'lucide-react';

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

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: Props) {
  return (
    <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
      <div className="admin-sidebar-top">
        <div className="admin-sidebar-logo">
          <span className="admin-logo-the">the</span>
          <span className="admin-logo-aira">aira</span>
          <span className="admin-logo-edit">edit</span>
        </div>
        <button className="admin-sidebar-close" onClick={onClose} aria-label="Close navigation">
          <X size={18} />
        </button>
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
            onClick={onClose}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-nav-divider" />

      <NavLink to="/" className="admin-nav-item admin-back-link" onClick={onClose}>
        <ExternalLink size={18} />
        <span>Back to Store</span>
      </NavLink>
    </aside>
  );
}
