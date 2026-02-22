import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export default function StatsCard({ icon: Icon, label, value }: StatsCardProps) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-icon">
        <Icon size={22} />
      </div>
      <div>
        <div className="admin-stat-value">{value}</div>
        <div className="admin-stat-label">{label}</div>
      </div>
    </div>
  );
}
