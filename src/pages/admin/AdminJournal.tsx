import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { useAdminJournal } from '../../hooks/useAdmin';
import ConfirmModal from '../../components/admin/ConfirmModal';

export default function AdminJournal() {
  const { journalPosts, loading, deleteJournalPost } = useAdminJournal();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteJournalPost(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="admin-page-top">
        <h1 className="admin-page-title">Journal Posts</h1>
        <Link to="/admin/journal/new" className="admin-btn admin-btn-primary">
          <Plus size={14} /> New Post
        </Link>
      </div>

      {loading ? (
        <p className="admin-page-loading">Loading posts...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {journalPosts.map((p) => (
                <tr key={p.id}>
                  <td className="admin-td-name">{p.title}</td>
                  <td>{p.category || '—'}</td>
                  <td>
                    <span className={`admin-badge ${p.is_published ? 'admin-badge-green' : 'admin-badge-yellow'}`}>
                      {p.is_published ? (
                        <><Eye size={12} /> Published</>
                      ) : (
                        <><EyeOff size={12} /> Draft</>
                      )}
                    </span>
                  </td>
                  <td>{new Date(p.published_at || p.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-table-actions">
                      <Link to={`/admin/journal/${p.id}/edit`} className="admin-btn-icon" title="Edit"><Pencil size={15} /></Link>
                      <button className="admin-btn-icon danger" onClick={() => setDeleteTarget({ id: p.id, title: p.title })} title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {journalPosts.length === 0 && (
                <tr><td colSpan={5} className="admin-empty">No journal posts yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Post"
          message={`Delete "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
