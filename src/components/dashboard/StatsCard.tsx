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
  default: 'from-secondary to-muted',
  primary: 'from-primary/20 to-cyan-500/20',
  warning: 'from-warning/20 to-amber-500/20',
  danger: 'from-destructive/20 to-red-500/20',
  success: 'from-success/20 to-emerald-500/20',
};

const iconVariantStyles = {
  default: 'from-secondary to-muted text-foreground',
  primary: 'from-primary to-cyan-500 text-primary-foreground',
  warning: 'from-warning to-amber-500 text-warning-foreground',
  danger: 'from-destructive to-red-600 text-destructive-foreground',
  success: 'from-success to-emerald-500 text-success-foreground',
};

export function StatsCard({ title, value, icon: Icon, trend, variant = 'default', delay = 0 }: StatsCardProps) {
  return (
    <div 
      className={cn(
        "glass-elevated rounded-xl p-5 animate-slide-up group hover:scale-[1.02] transition-transform duration-300",
        `bg-gradient-to-br ${variantStyles[variant]}`
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {trend && (
            <p className={cn(
              "text-xs mt-2 flex items-center gap-1",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
          iconVariantStyles[variant]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
