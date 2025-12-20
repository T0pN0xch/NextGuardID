import { TollTransaction } from '@/data/tollMockData';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, CreditCard, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TollTimelineProps {
  transactions: TollTransaction[];
  lostMode: boolean;
}

export function TollTimeline({ transactions, lostMode }: TollTimelineProps) {
  const sortedTransactions = [...transactions].sort(
    (a, b) => b.dateTime.getTime() - a.dateTime.getTime()
  );

  const getRiskStyles = (riskLevel: string, isNewSinceLost?: boolean) => {
    if (lostMode && isNewSinceLost) {
      return {
        badge: 'bg-destructive/20 text-destructive border-destructive/30',
        dot: 'bg-destructive',
        card: 'border-destructive/50 bg-destructive/5',
      };
    }
    
    switch (riskLevel) {
      case 'high':
        return {
          badge: 'bg-destructive/20 text-destructive border-destructive/30',
          dot: 'bg-destructive',
          card: 'border-destructive/30',
        };
      case 'medium':
        return {
          badge: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
          dot: 'bg-amber-500',
          card: 'border-amber-500/30',
        };
      default:
        return {
          badge: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
          dot: 'bg-emerald-500',
          card: 'border-border/50',
        };
    }
  };

  const getRiskLabel = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'Unknown / Distant Location';
      case 'medium':
        return 'Unusual Timing';
      default:
        return 'Expected Location';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        Transaction Timeline
      </h3>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {sortedTransactions.map((tx, index) => {
          const styles = getRiskStyles(tx.riskLevel, tx.isNewSinceLost);
          
          return (
            <div
              key={tx.id}
              className={cn(
                "relative pl-6 pb-4",
                index !== sortedTransactions.length - 1 && "border-l-2 border-border/30 ml-2"
              )}
            >
              {/* Timeline dot */}
              <div className={cn(
                "absolute left-0 top-0 w-4 h-4 rounded-full border-2 border-background -translate-x-[7px]",
                styles.dot,
                lostMode && tx.isNewSinceLost && "animate-pulse"
              )} />
              
              <div className={cn(
                "glass rounded-lg p-4 border transition-all",
                styles.card
              )}>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      {tx.tollPlaza}
                      {lostMode && tx.isNewSinceLost && (
                        <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">{tx.highway}</p>
                  </div>
                  <Badge variant="outline" className={cn("text-xs", styles.badge)}>
                    {tx.riskLevel.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{tx.state}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{tx.dateTime.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>RM {tx.amount.toFixed(2)}</span>
                  </div>
                  <div className="text-xs">
                    {tx.dateTime.toLocaleDateString()}
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-border/30">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Risk Assessment:</span> {getRiskLabel(tx.riskLevel)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
