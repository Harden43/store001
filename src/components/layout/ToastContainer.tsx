import { useToastStore } from '../../store/toastStore';

export default function ToastContainer() {
  const { toasts, remove } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{t.message}</span>
          <button className="toast-close" onClick={() => remove(t.id)}>&times;</button>
        </div>
      ))}
    </div>
  );
}
