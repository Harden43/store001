import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAdminProducts } from '../../hooks/useAdmin';
import ConfirmModal from '../../components/admin/ConfirmModal';

export default function AdminProducts() {
  const { products, loading, deleteProduct, toggleProductField } = useAdminProducts();
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteProduct(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="admin-page-top">
        <h1 className="admin-page-title">Products</h1>
        <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search"
        />
      </div>

      {loading ? (
        <p className="admin-page-loading">Loading products...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Active</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt="" className="admin-table-thumb" />
                    ) : (
                      <div className="admin-table-thumb admin-thumb-placeholder" />
                    )}
                  </td>
                  <td className="admin-td-name">{p.name}</td>
                  <td>{p.category?.name || '—'}</td>
                  <td>
                    {p.compare_price && p.compare_price > p.price && (
                      <span className="admin-price-original">${Number(p.compare_price).toFixed(2)}</span>
                    )}
                    ${Number(p.price).toFixed(2)}
                  </td>
                  <td>
                    <span className={p.stock_quantity < 10 ? 'admin-stock-low' : ''}>
                      {p.stock_quantity}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`admin-toggle-btn ${p.is_active ? 'on' : ''}`}
                      onClick={() => toggleProductField(p.id, 'is_active', !p.is_active)}
                    >
                      {p.is_active ? 'Yes' : 'No'}
                    </button>
                  </td>
                  <td>
                    <button
                      className={`admin-toggle-btn ${p.is_featured ? 'on' : ''}`}
                      onClick={() => toggleProductField(p.id, 'is_featured', !p.is_featured)}
                    >
                      {p.is_featured ? 'Yes' : 'No'}
                    </button>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <Link to={`/admin/products/${p.id}/edit`} className="admin-btn-icon" title="Edit">
                        <Pencil size={15} />
                      </Link>
                      <button className="admin-btn-icon danger" onClick={() => setDeleteTarget({ id: p.id, name: p.name })} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="admin-empty">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
