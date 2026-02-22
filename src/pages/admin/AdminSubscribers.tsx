import { useState } from 'react';
import { Trash2, Mail } from 'lucide-react';
import { useAdminSubscribers } from '../../hooks/useAdmin';
import ConfirmModal from '../../components/admin/ConfirmModal';

export default function AdminSubscribers() {
  const { subscribers, loading, deleteSubscriber } = useAdminSubscribers();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; email: string } | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteSubscriber(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="admin-page-top">
        <h1 className="admin-page-title">Newsletter Subscribers</h1>
        <div className="admin-stat-pill">
          <Mail size={16} />
          <span>{subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {loading ? (
        <p className="admin-page-loading">Loading subscribers...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Subscribed</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id}>
                  <td className="admin-td-name">{s.email}</td>
                  <td>{new Date(s.subscribed_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`admin-badge ${s.is_active ? 'admin-badge-green' : 'admin-badge-red'}`}>
                      {s.is_active ? 'Active' : 'Unsubscribed'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="admin-btn-icon danger" onClick={() => setDeleteTarget({ id: s.id, email: s.email })} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr><td colSpan={4} className="admin-empty">No subscribers yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Subscriber"
          message={`Remove "${deleteTarget.email}" from the mailing list?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
