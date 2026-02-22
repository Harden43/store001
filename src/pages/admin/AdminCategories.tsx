import { useState } from 'react';
import { Pencil, Trash2, ChevronUp, ChevronDown, Check, X } from 'lucide-react';
import { useAdminCategories } from '../../hooks/useAdmin';
import ConfirmModal from '../../components/admin/ConfirmModal';
import type { Category } from '../../types';

const generateSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

interface FormState {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
}

const EMPTY: FormState = { name: '', slug: '', description: '', image_url: '', sort_order: 0 };

export default function AdminCategories() {
  const { categories, loading, createCategory, updateCategory, deleteCategory, refetch } = useAdminCategories();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const handleAdd = () => {
    setEditId(null);
    setForm({ ...EMPTY, sort_order: categories.length + 1 });
    setShowForm(true);
  };

  const handleEdit = (cat: Category) => {
    setEditId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image_url: cat.image_url || '',
      sort_order: cat.sort_order,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    const payload = {
      name: form.name,
      slug: form.slug || generateSlug(form.name),
      description: form.description || null,
      image_url: form.image_url || null,
      sort_order: form.sort_order,
    };

    if (editId) {
      await updateCategory(editId, payload);
    } else {
      await createCategory(payload);
    }
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteCategory(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleReorder = async (cat: Category, direction: 'up' | 'down') => {
    const idx = categories.findIndex((c) => c.id === cat.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= categories.length) return;

    const other = categories[swapIdx];
    await updateCategory(cat.id, { sort_order: other.sort_order });
    await updateCategory(other.id, { sort_order: cat.sort_order });
    refetch();
  };

  return (
    <div>
      <div className="admin-page-top">
        <h1 className="admin-page-title">Categories</h1>
        <button className="admin-btn admin-btn-primary" onClick={handleAdd}>
          + Add Category
        </button>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="admin-card admin-inline-form">
          <h2 className="admin-card-title">{editId ? 'Edit Category' : 'New Category'}</h2>
          <div className="admin-form-row">
            <div className="admin-form-group admin-form-grow">
              <label className="admin-form-label">Name *</label>
              <input
                className="admin-form-input"
                value={form.name}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    name: e.target.value,
                    slug: editId ? f.slug : generateSlug(e.target.value),
                  }));
                }}
              />
            </div>
            <div className="admin-form-group admin-form-grow">
              <label className="admin-form-label">Slug</label>
              <input
                className="admin-form-input"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group admin-form-grow">
              <label className="admin-form-label">Description</label>
              <input
                className="admin-form-input"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Sort Order</label>
              <input
                className="admin-form-input"
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group admin-form-grow">
              <label className="admin-form-label">Image URL</label>
              <input
                className="admin-form-input"
                value={form.image_url}
                onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            {form.image_url && (
              <div className="admin-form-group">
                <label className="admin-form-label">Preview</label>
                <img src={form.image_url} alt="" style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 6 }} />
              </div>
            )}
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn-ghost" onClick={() => { setShowForm(false); setEditId(null); }}>
              <X size={14} /> Cancel
            </button>
            <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={!form.name}>
              <Check size={14} /> {editId ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="admin-page-loading">Loading categories...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Image</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="admin-reorder">
                      <button className="admin-btn-icon" onClick={() => handleReorder(c, 'up')} title="Move up"><ChevronUp size={14} /></button>
                      <span>{c.sort_order}</span>
                      <button className="admin-btn-icon" onClick={() => handleReorder(c, 'down')} title="Move down"><ChevronDown size={14} /></button>
                    </div>
                  </td>
                  <td>
                    {c.image_url ? (
                      <img src={c.image_url} alt="" style={{ width: 48, height: 34, objectFit: 'cover', borderRadius: 4 }} />
                    ) : (
                      <span style={{ color: '#aaa' }}>—</span>
                    )}
                  </td>
                  <td className="admin-td-name">{c.name}</td>
                  <td>{c.slug}</td>
                  <td>{c.description || '—'}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="admin-btn-icon" onClick={() => handleEdit(c)} title="Edit"><Pencil size={15} /></button>
                      <button className="admin-btn-icon danger" onClick={() => setDeleteTarget({ id: c.id, name: c.name })} title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={6} className="admin-empty">No categories</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Category"
          message={`Delete "${deleteTarget.name}"? Products in this category will become uncategorized.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
