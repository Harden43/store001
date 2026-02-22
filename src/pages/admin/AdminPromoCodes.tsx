import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { useAdminPromoCodes } from '../../hooks/useAdmin';
import ConfirmModal from '../../components/admin/ConfirmModal';
import type { PromoCode } from '../../types';

interface FormState {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number;
  max_uses: string;
  expires_at: string;
  is_active: boolean;
}

const EMPTY: FormState = {
  code: '',
  discount_type: 'percentage',
  discount_value: 10,
  min_order_value: 0,
  max_uses: '',
  expires_at: '',
  is_active: true,
};

export default function AdminPromoCodes() {
  const { promoCodes, loading, createPromoCode, updatePromoCode, deletePromoCode } = useAdminPromoCodes();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; code: string } | null>(null);

  const handleAdd = () => {
    setEditId(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const handleEdit = (p: PromoCode) => {
    setEditId(p.id);
    setForm({
      code: p.code,
      discount_type: p.discount_type,
      discount_value: p.discount_value,
      min_order_value: p.min_order_value,
      max_uses: p.max_uses?.toString() || '',
      expires_at: p.expires_at ? p.expires_at.slice(0, 10) : '',
      is_active: p.is_active,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    const payload = {
      code: form.code.toUpperCase().trim(),
      discount_type: form.discount_type,
      discount_value: form.discount_value,
      min_order_value: form.min_order_value,
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      expires_at: form.expires_at || null,
      is_active: form.is_active,
    };

    if (editId) {
      await updatePromoCode(editId, payload);
    } else {
      await createPromoCode(payload);
    }
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deletePromoCode(deleteTarget.id);
    setDeleteTarget(null);
  };

  const formatDiscount = (p: PromoCode) =>
    p.discount_type === 'percentage' ? `${p.discount_value}%` : `$${p.discount_value.toFixed(2)}`;

  return (
    <div>
      <div className="admin-page-top">
        <h1 className="admin-page-title">Promo Codes</h1>
        <button className="admin-btn admin-btn-primary" onClick={handleAdd}>
          + Add Promo Code
        </button>
      </div>

      {showForm && (
        <div className="admin-card admin-inline-form">
          <h2 className="admin-card-title">{editId ? 'Edit Promo Code' : 'New Promo Code'}</h2>
          <div className="admin-form-row">
            <div className="admin-form-group admin-form-grow">
              <label className="admin-form-label">Code *</label>
              <input
                className="admin-form-input"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                placeholder="e.g. SPRING20"
                style={{ textTransform: 'uppercase' }}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Type</label>
              <select
                className="admin-form-input"
                value={form.discount_type}
                onChange={(e) => setForm((f) => ({ ...f, discount_type: e.target.value as 'percentage' | 'fixed' }))}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed ($)</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Value</label>
              <input
                className="admin-form-input"
                type="number"
                min={0}
                value={form.discount_value}
                onChange={(e) => setForm((f) => ({ ...f, discount_value: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Min Order ($)</label>
              <input
                className="admin-form-input"
                type="number"
                min={0}
                value={form.min_order_value}
                onChange={(e) => setForm((f) => ({ ...f, min_order_value: Number(e.target.value) }))}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Max Uses</label>
              <input
                className="admin-form-input"
                type="number"
                min={0}
                value={form.max_uses}
                onChange={(e) => setForm((f) => ({ ...f, max_uses: e.target.value }))}
                placeholder="Unlimited"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Expires</label>
              <input
                className="admin-form-input"
                type="date"
                value={form.expires_at}
                onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Active</label>
              <label className="admin-toggle">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                />
                <span className="admin-toggle-slider" />
              </label>
            </div>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn-ghost" onClick={() => { setShowForm(false); setEditId(null); }}>
              <X size={14} /> Cancel
            </button>
            <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={!form.code.trim()}>
              <Check size={14} /> {editId ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="admin-page-loading">Loading promo codes...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Min Order</th>
                <th>Uses</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((p) => (
                <tr key={p.id}>
                  <td className="admin-td-name" style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}>{p.code}</td>
                  <td>{formatDiscount(p)}</td>
                  <td>{p.min_order_value > 0 ? `$${p.min_order_value}` : '—'}</td>
                  <td>{p.current_uses}{p.max_uses ? ` / ${p.max_uses}` : ''}</td>
                  <td>{p.expires_at ? new Date(p.expires_at).toLocaleDateString() : '—'}</td>
                  <td>
                    <span className={`admin-badge ${p.is_active ? 'admin-badge-green' : 'admin-badge-red'}`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="admin-btn-icon" onClick={() => handleEdit(p)} title="Edit"><Pencil size={15} /></button>
                      <button className="admin-btn-icon danger" onClick={() => setDeleteTarget({ id: p.id, code: p.code })} title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {promoCodes.length === 0 && (
                <tr><td colSpan={7} className="admin-empty">No promo codes</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Promo Code"
          message={`Delete promo code "${deleteTarget.code}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
