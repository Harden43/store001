import { useState } from 'react';
import { Shield, ShieldOff } from 'lucide-react';
import { useAdminCustomers } from '../../hooks/useAdmin';
import ConfirmModal from '../../components/admin/ConfirmModal';
import type { CustomerProfile } from '../../types';

export default function AdminCustomers() {
  const { customers, loading, toggleAdmin } = useAdminCustomers();
  const [adminToggle, setAdminToggle] = useState<{ id: string; name: string; value: boolean } | null>(null);

  const handleToggle = async () => {
    if (!adminToggle) return;
    await toggleAdmin(adminToggle.id, adminToggle.value);
    setAdminToggle(null);
  };

  const formatCurrency = (n: number) => `$${n.toFixed(2)}`;

  return (
    <div>
      <div className="admin-page-top">
        <h1 className="admin-page-title">Customers</h1>
        <div className="admin-stat-pill">
          <span>{customers.length} customer{customers.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {loading ? (
        <p className="admin-page-loading">Loading customers...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c: CustomerProfile) => (
                <tr key={c.id}>
                  <td className="admin-td-name">{c.full_name || '—'}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || '—'}</td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td>{c.order_count}</td>
                  <td>{formatCurrency(c.total_spent)}</td>
                  <td>
                    <span className={`admin-badge ${c.is_admin ? 'admin-badge-gold' : 'admin-badge-gray'}`}>
                      {c.is_admin ? 'Admin' : 'Customer'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      {c.is_admin ? (
                        <button
                          className="admin-btn-icon danger"
                          onClick={() => setAdminToggle({ id: c.id, name: c.full_name || c.email, value: false })}
                          title="Remove admin"
                        >
                          <ShieldOff size={15} />
                        </button>
                      ) : (
                        <button
                          className="admin-btn-icon"
                          onClick={() => setAdminToggle({ id: c.id, name: c.full_name || c.email, value: true })}
                          title="Make admin"
                        >
                          <Shield size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr><td colSpan={8} className="admin-empty">No customers</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {adminToggle && (
        <ConfirmModal
          title={adminToggle.value ? 'Grant Admin Access' : 'Remove Admin Access'}
          message={
            adminToggle.value
              ? `Make "${adminToggle.name}" an admin? They will have full access to this panel.`
              : `Remove admin access from "${adminToggle.name}"?`
          }
          confirmLabel={adminToggle.value ? 'Grant' : 'Remove'}
          onConfirm={handleToggle}
          onCancel={() => setAdminToggle(null)}
        />
      )}
    </div>
  );
}
