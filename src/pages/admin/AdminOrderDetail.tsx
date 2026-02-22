import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAdminStore } from '../../store/adminStore';
import StatusBadge from '../../components/admin/StatusBadge';
import type { AdminOrder, OrderStatus } from '../../types';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const { updateOrderStatus, updateOrderNotes } = useAdminStore();

  useEffect(() => {
    if (!id) return;
    supabase
      .from('orders')
      .select('*, order_items(*), profiles(full_name, email, phone)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          setOrder(data as AdminOrder);
          setNotes(data.notes || '');
        }
      });
  }, [id]);

  if (!order) {
    return <div className="admin-page-loading">Loading order...</div>;
  }

  const handleStatusChange = async (status: OrderStatus) => {
    await updateOrderStatus(order.id, status);
    setOrder((o) => o ? { ...o, status } : o);
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    await updateOrderNotes(order.id, notes);
    setSaving(false);
  };

  const address = order.shipping_address;

  return (
    <div>
      <Link to="/admin/orders" className="admin-back">
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      <div className="admin-page-top">
        <div>
          <h1 className="admin-page-title">{order.order_number}</h1>
          <p className="admin-page-subtitle">
            Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="admin-order-status-wrap">
          <StatusBadge status={order.status} />
          <select
            className="admin-status-select"
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-order-grid">
        {/* Customer */}
        <div className="admin-card">
          <h2 className="admin-card-title">Customer</h2>
          <p>{order.profiles?.full_name || '—'}</p>
          <p>{order.profiles?.email}</p>
          {order.profiles?.phone && <p>{order.profiles.phone}</p>}
        </div>

        {/* Shipping Address */}
        <div className="admin-card">
          <h2 className="admin-card-title">Shipping Address</h2>
          {address ? (
            <>
              <p>{address.full_name}</p>
              <p>{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              <p>{address.city}, {address.province} {address.postal_code}</p>
              <p>{address.country}</p>
            </>
          ) : (
            <p className="admin-empty">No address provided</p>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2 className="admin-card-title">Items</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Size</th>
              <th>Color</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {(order.order_items ?? []).map((item) => (
              <tr key={item.id}>
                <td className="admin-td-name">
                  <div className="admin-order-item-row">
                    {item.product_image && <img src={item.product_image} alt="" className="admin-table-thumb" />}
                    <span>{item.product_name}</span>
                  </div>
                </td>
                <td>{item.size || '—'}</td>
                <td>{item.color || '—'}</td>
                <td>{item.quantity}</td>
                <td>${Number(item.unit_price).toFixed(2)}</td>
                <td>${(item.quantity * Number(item.unit_price)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="admin-order-summary">
          <div className="admin-summary-row">
            <span>Subtotal</span>
            <span>${Number(order.subtotal).toFixed(2)}</span>
          </div>
          <div className="admin-summary-row">
            <span>Shipping</span>
            <span>${Number(order.shipping_cost).toFixed(2)}</span>
          </div>
          {Number(order.discount_amount) > 0 && (
            <div className="admin-summary-row">
              <span>Discount</span>
              <span>-${Number(order.discount_amount).toFixed(2)}</span>
            </div>
          )}
          <div className="admin-summary-row admin-summary-total">
            <span>Total</span>
            <span>${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2 className="admin-card-title">Admin Notes</h2>
        <textarea
          className="admin-form-textarea"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add internal notes about this order..."
        />
        <button className="admin-btn admin-btn-primary admin-btn-sm" style={{ marginTop: '0.75rem' }} onClick={handleSaveNotes} disabled={saving}>
          {saving ? 'Saving...' : 'Save Notes'}
        </button>
      </div>
    </div>
  );
}
