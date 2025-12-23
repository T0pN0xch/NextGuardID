import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'warning' | 'danger' | 'success';
  delay?: number;
}

const variantStyles = {
  default: 'bg-white border-gray-200',
  primary: 'bg-white border-blue-200',
  warning: 'bg-white border-amber-200',
  danger: 'bg-white border-red-200',
  success: 'bg-white border-emerald-200',
};

const iconVariantStyles = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-blue-100 text-blue-600',
  warning: 'bg-amber-100 text-amber-600',
  danger: 'bg-red-100 text-red-600',
  success: 'bg-emerald-100 text-emerald-600',
};

const shadowVariants = {
  default: 'hover:shadow-gray-500/30',
  primary: 'hover:shadow-blue-500/30',
  warning: 'hover:shadow-amber-500/30',
  danger: 'hover:shadow-red-500/30',
  success: 'hover:shadow-emerald-500/30',
};

export function StatsCard({ title, value, icon: Icon, trend, variant = 'default', delay = 0 }: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-8 animate-slide-up group hover:shadow-2xl transition-all duration-300 border-2 hover:-translate-y-2",
        variantStyles[variant],
        shadowVariants[variant]
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">{title}</p>
          <p className="text-5xl font-bold text-gray-900 mt-3">{value}</p>
          {trend && (
            <p className={cn(
              "text-sm mt-4 flex items-center gap-1 font-bold",
              trend.isPositive ? "text-emerald-600" : "text-red-600"
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6",
          iconVariantStyles[variant]
        )}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}
