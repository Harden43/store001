import type { OrderStatus } from '../../types';

const STATUS_STYLES: Record<OrderStatus, { bg: string; color: string }> = {
  pending:    { bg: '#fff3cd', color: '#856404' },
  paid:       { bg: '#d1ecf1', color: '#0c5460' },
  processing: { bg: '#e2d5f1', color: '#563d7c' },
  shipped:    { bg: '#cce5ff', color: '#004085' },
  delivered:  { bg: '#d4edda', color: '#155724' },
  cancelled:  { bg: '#f8d7da', color: '#721c24' },
  refunded:   { bg: '#e2e3e5', color: '#383d41' },
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
  return (
    <span
      className="admin-status-badge"
      style={{ background: style.bg, color: style.color }}
    >
      {status}
    </span>
  );
}
