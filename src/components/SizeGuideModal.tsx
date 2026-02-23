import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface Props {
  open: boolean;
  onClose: () => void;
}

const SIZES = [
  { size: 'XS', bust: '31-32"', waist: '24-25"', hips: '34-35"' },
  { size: 'S',  bust: '33-34"', waist: '26-27"', hips: '36-37"' },
  { size: 'M',  bust: '35-36"', waist: '28-29"', hips: '38-39"' },
  { size: 'L',  bust: '37-39"', waist: '30-32"', hips: '40-42"' },
  { size: 'XL', bust: '40-42"', waist: '33-35"', hips: '43-45"' },
  { size: 'XXL', bust: '43-45"', waist: '36-38"', hips: '46-48"' },
];

export default function SizeGuideModal({ open, onClose }: Props) {
  const trapRef = useFocusTrap(open);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="size-guide-overlay" onClick={onClose}>
      <div className="size-guide-modal" role="dialog" aria-modal="true" aria-label="Size guide" onClick={(e) => e.stopPropagation()} ref={trapRef}>
        <div className="size-guide-header">
          <h2>Size Guide</h2>
          <button className="size-guide-close" onClick={onClose} aria-label="Close size guide"><X size={20} /></button>
        </div>
        <p className="size-guide-note">
          Measurements are in inches. If you're between sizes, we recommend sizing up for a relaxed fit.
        </p>
        <table className="size-guide-table">
          <thead>
            <tr>
              <th>Size</th>
              <th>Bust</th>
              <th>Waist</th>
              <th>Hips</th>
            </tr>
          </thead>
          <tbody>
            {SIZES.map((s) => (
              <tr key={s.size}>
                <td><strong>{s.size}</strong></td>
                <td>{s.bust}</td>
                <td>{s.waist}</td>
                <td>{s.hips}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
