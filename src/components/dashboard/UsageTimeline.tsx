import { IdentityUsage, RiskLevel } from '@/types/identity';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Clock, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface UsageTimelineProps {
  usages: IdentityUsage[];
  onViewDetails?: (usage: IdentityUsage) => void;
}

const riskStyles: Record<RiskLevel, { bg: string; text: string; icon: typeof Shield }> = {
  low: { bg: 'bg-success/10 border-success/30', text: 'text-success', icon: CheckCircle },
  medium: { bg: 'bg-warning/10 border-warning/30', text: 'text-warning', icon: AlertTriangle },
  high: { bg: 'bg-destructive/10 border-destructive/30', text: 'text-destructive', icon: AlertTriangle },
};

const statusStyles = {
  active: { bg: 'bg-success/20', text: 'text-success', label: 'Active' },
  revoked: { bg: 'bg-destructive/20', text: 'text-destructive', label: 'Revoked' },
  pending: { bg: 'bg-warning/20', text: 'text-warning', label: 'Pending' },
};

export function UsageTimeline({ usages, onViewDetails }: UsageTimelineProps) {
  return (
    <div className="space-y-3">
      {usages.map((usage, index) => {
        const riskStyle = riskStyles[usage.riskLevel];
        const RiskIcon = riskStyle.icon;
        const status = statusStyles[usage.status];

        return (
          <div
            key={usage.id}
            className={cn(
              "glass-elevated rounded-xl p-4 border transition-all duration-300 hover:scale-[1.01] cursor-pointer animate-slide-up",
              riskStyle.bg
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => onViewDetails?.(usage)}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{usage.serviceIcon}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{usage.serviceName}</h3>
                    <p className="text-sm text-muted-foreground">{usage.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn(status.bg, status.text, "border-0")}>
                      {usage.status === 'revoked' ? <XCircle className="w-3 h-3 mr-1" /> : null}
                      {status.label}
                    </Badge>
                    {usage.offlineNote && (
                      <Badge className="ml-2 bg-muted text-muted-foreground">Offline</Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={cn(
                        "border",
                        riskStyle.bg,
                        riskStyle.text
                      )}
                    >
                      <RiskIcon className="w-3 h-3 mr-1" />
                      {usage.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-2">{usage.purpose}</p>

                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Registered: {format(usage.dateTime, 'MMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Last access: {format(usage.lastAccessed, 'MMM d, yyyy')}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {usage.dataShared.slice(0, 3).map((data) => (
                    <span
                      key={data}
                      className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                    >
                      {data}
                    </span>
                  ))}
                  {usage.dataShared.length > 3 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      +{usage.dataShared.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
