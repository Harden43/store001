import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useAdminOrders } from '../../hooks/useAdmin';
import StatusBadge from '../../components/admin/StatusBadge';
import type { OrderStatus } from '../../types';

const STATUS_OPTIONS: (OrderStatus | 'all')[] = ['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { orders, loading, updateOrderStatus } = useAdminOrders(statusFilter);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as OrderStatus);
  };

  return (
    <div>
      <div className="admin-page-top">
        <h1 className="admin-page-title">Orders</h1>
      </div>

      <div className="admin-toolbar">
        <select
          className="admin-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="admin-page-loading">Loading orders...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="admin-td-name">{o.order_number}</td>
                  <td>{o.profiles?.full_name || o.profiles?.email || '—'}</td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td>{o.order_items?.length ?? 0}</td>
                  <td>
                    <select
                      className="admin-status-select"
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.filter((s) => s !== 'all').map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td>${Number(o.total).toFixed(2)}</td>
                  <td>
                    <Link to={`/admin/orders/${o.id}`} className="admin-btn-icon" title="View">
                      <Eye size={15} />
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={7} className="admin-empty">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
