import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Package, Users, AlertTriangle } from 'lucide-react';
import { useAdminDashboard } from '../../hooks/useAdmin';
import StatsCard from '../../components/admin/StatsCard';
import StatusBadge from '../../components/admin/StatusBadge';
import type { OrderStatus } from '../../types';

export default function AdminDashboard() {
  const { stats, recentOrders, lowStockProducts, loading } = useAdminDashboard();

  if (loading) {
    return <div className="admin-page-loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>

      {/* Stats */}
      <div className="admin-stats-grid">
        <StatsCard icon={DollarSign} label="Total Revenue" value={`$${(stats?.totalRevenue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
        <StatsCard icon={ShoppingBag} label="Total Orders" value={String(stats?.totalOrders ?? 0)} />
        <StatsCard icon={Package} label="Active Products" value={String(stats?.totalProducts ?? 0)} />
        <StatsCard icon={Users} label="Total Users" value={String(stats?.totalUsers ?? 0)} />
      </div>

      <div className="admin-dashboard-grid">
        {/* Recent Orders */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="admin-link">View all</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="admin-empty">No orders yet</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td><Link to={`/admin/orders/${o.id}`} className="admin-link">{o.order_number}</Link></td>
                    <td>{o.profiles?.full_name || o.profiles?.email || '—'}</td>
                    <td><StatusBadge status={o.status as OrderStatus} /></td>
                    <td>${Number(o.total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Low Stock Alerts</h2>
            <Link to="/admin/products" className="admin-link">View all</Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="admin-empty">All products well stocked</p>
          ) : (
            <div className="admin-alert-list">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="admin-alert-item">
                  <AlertTriangle size={16} className="admin-alert-icon" />
                  <span className="admin-alert-name">{p.name}</span>
                  <span className="admin-alert-stock">{p.stock_quantity} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
