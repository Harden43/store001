import { X } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

export default function ToastContainer() {
  const { toasts, remove } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{t.message}</span>
          <button className="toast-close" onClick={() => remove(t.id)} aria-label="Dismiss notification"><X size={16} /></button>
        </div>
      ))}
    </div>
  );
}
