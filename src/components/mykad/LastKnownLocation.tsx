import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TollTransaction, userHomeLocation, calculateDistance } from '@/data/tollMockData';
import { MapPin, Clock, Navigation, Brain, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface LastKnownLocationProps {
  transactions: TollTransaction[];
  lostMode: boolean;
}

export function LastKnownLocation({ transactions, lostMode }: LastKnownLocationProps) {
  const sortedTransactions = [...transactions].sort(
    (a, b) => b.dateTime.getTime() - a.dateTime.getTime()
  );
  
  const lastTransaction = sortedTransactions[0];
  
  if (!lastTransaction) {
    return null;
  }
  
  const distanceFromHome = calculateDistance(
    userHomeLocation.lat,
    userHomeLocation.lng,
    lastTransaction.coordinates.lat,
    lastTransaction.coordinates.lng
  );
  
  // AI confidence calculation based on distance and risk
  const calculateConfidence = () => {
    if (distanceFromHome < 50) return 95;
    if (distanceFromHome < 100) return 85;
    if (distanceFromHome < 200) return 70;
    if (distanceFromHome < 300) return 55;
    return 40;
  };
  
  const confidence = calculateConfidence();
  
  const isHighRisk = lostMode && lastTransaction.isNewSinceLost;
  
  return (
    <Card className={cn(
      "glass-elevated border transition-all",
      isHighRisk ? "border-destructive/50 bg-destructive/5" : "border-border/50"
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Navigation className="w-5 h-5 text-primary" />
          Last Known Location
          {isHighRisk && (
            <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              isHighRisk ? "bg-destructive/20" : "bg-primary/10"
            )}>
              <MapPin className={cn(
                "w-5 h-5",
                isHighRisk ? "text-destructive" : "text-primary"
              )} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{lastTransaction.tollPlaza}</h4>
              <p className="text-sm text-muted-foreground">
                {lastTransaction.highway}, {lastTransaction.state}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="glass rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">Date & Time</span>
              </div>
              <p className="text-sm font-semibold">
                {lastTransaction.dateTime.toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {lastTransaction.dateTime.toLocaleTimeString()}
              </p>
            </div>
            
            <div className="glass rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Navigation className="w-4 h-4" />
                <span className="text-xs font-medium">Distance</span>
              </div>
              <p className="text-sm font-semibold">
                {distanceFromHome.toFixed(1)} km
              </p>
              <p className="text-xs text-muted-foreground">
                from usual area
              </p>
            </div>
          </div>
          
          <div className="glass rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Brain className="w-4 h-4" />
                <span className="text-xs font-medium">AI Confidence</span>
              </div>
              <Badge variant="outline" className={cn(
                "text-xs",
                confidence >= 80 ? "bg-emerald-500/20 text-emerald-500" :
                confidence >= 60 ? "bg-amber-500/20 text-amber-500" :
                "bg-destructive/20 text-destructive"
              )}>
                {confidence}%
              </Badge>
            </div>
            <Progress 
              value={confidence} 
              className={cn(
                "h-2",
                confidence >= 80 ? "[&>div]:bg-emerald-500" :
                confidence >= 60 ? "[&>div]:bg-amber-500" :
                "[&>div]:bg-destructive"
              )}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {confidence >= 80 
                ? "Location matches typical travel patterns"
                : confidence >= 60
                ? "Location partially matches known patterns"
                : "Location deviates significantly from usual patterns"
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
