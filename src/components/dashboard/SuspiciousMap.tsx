import { AlertTriangle, MapPin, Shield, X } from 'lucide-react';
import { SuspiciousAttempt } from '@/types/identity';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useState } from 'react';

interface SuspiciousMapProps {
  attempts: SuspiciousAttempt[];
}

export function SuspiciousMap({ attempts }: SuspiciousMapProps) {
  const [selectedAttempt, setSelectedAttempt] = useState<SuspiciousAttempt | null>(null);

  // Map coordinates to percentage positions on the map
  const getPosition = (lat: number, lng: number) => {
    // Normalize coordinates to map area (approximate world map)
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(10, Math.min(90, y)) };
  };

  return (
    <div className="glass-elevated rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold">Suspicious Activity Map</h3>
            <p className="text-xs text-muted-foreground">{attempts.length} suspicious attempts detected</p>
          </div>
        </div>
        <Badge variant={attempts.some(a => !a.blocked) ? "destructive" : "success"}>
          {attempts.filter(a => a.blocked).length} Blocked
        </Badge>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 via-background to-cyan-500/5 border border-border/50">
        {/* World Map Background - Simplified */}
        <svg
          viewBox="0 0 1000 500"
          className="absolute inset-0 w-full h-full opacity-20"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Simplified continents outline */}
          <path
            d="M150,150 Q200,100 300,120 Q400,80 500,100 Q550,90 600,110 L620,140 Q650,130 700,150 L750,180 Q800,200 780,250 L720,280 Q680,320 600,300 L500,320 Q400,350 350,300 L250,280 Q180,250 150,200 Z"
            fill="currentColor"
            className="text-muted-foreground"
          />
          <path
            d="M100,200 Q80,250 120,300 Q150,350 200,380 L280,400 Q320,420 380,400 L420,360 Q400,320 350,300 L280,280 Q200,260 150,220 Z"
            fill="currentColor"
            className="text-muted-foreground"
          />
          <path
            d="M700,200 Q750,180 800,200 L850,250 Q900,300 880,350 L820,380 Q750,400 700,370 L650,320 Q620,280 650,240 Z"
            fill="currentColor"
            className="text-muted-foreground"
          />
          {/* Grid lines */}
          {[...Array(5)].map((_, i) => (
            <line
              key={`h${i}`}
              x1="0"
              y1={100 * (i + 1)}
              x2="1000"
              y2={100 * (i + 1)}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border"
              strokeDasharray="5,5"
            />
          ))}
          {[...Array(9)].map((_, i) => (
            <line
              key={`v${i}`}
              x1={100 * (i + 1)}
              y1="0"
              x2={100 * (i + 1)}
              y2="500"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border"
              strokeDasharray="5,5"
            />
          ))}
        </svg>

        {/* Location Markers */}
        {attempts.map((attempt) => {
          const pos = getPosition(attempt.coordinates.lat, attempt.coordinates.lng);
          return (
            <button
              key={attempt.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => setSelectedAttempt(attempt)}
            >
              {/* Pulse animation for active threats */}
              {!attempt.blocked && (
                <span className="absolute inset-0 w-8 h-8 -m-2 rounded-full bg-destructive/30 animate-ping" />
              )}
              <div
                className={`relative w-4 h-4 rounded-full flex items-center justify-center transition-transform group-hover:scale-150 ${
                  attempt.blocked
                    ? 'bg-warning shadow-lg shadow-warning/50'
                    : 'bg-destructive shadow-lg shadow-destructive/50'
                }`}
              >
                <MapPin className="w-2.5 h-2.5 text-white" />
              </div>
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-border shadow-lg">
                {attempt.city}, {attempt.country}
              </div>
            </button>
          );
        })}

        {/* User's safe location marker */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: '72%', top: '35%' }}
        >
          <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center shadow-lg shadow-success/50 border-2 border-background">
            <Shield className="w-3 h-3 text-success-foreground" />
          </div>
          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] text-success font-medium whitespace-nowrap">
            You (Malaysia)
          </span>
        </div>

        {/* Legend */}
        <div className="absolute bottom-2 left-2 flex gap-3 text-[10px]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Active Threat</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-muted-foreground">Blocked</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Your Location</span>
          </div>
        </div>
      </div>

      {/* Selected Attempt Details */}
      {selectedAttempt && (
        <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 relative">
          <button
            onClick={() => setSelectedAttempt(null)}
            className="absolute top-2 right-2 p-1 hover:bg-destructive/20 rounded"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{selectedAttempt.platform}</h4>
                <Badge variant={selectedAttempt.blocked ? "warning" : "destructive"}>
                  {selectedAttempt.blocked ? 'Blocked' : 'Active Threat'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedAttempt.attemptType.charAt(0).toUpperCase() + selectedAttempt.attemptType.slice(1)} attempt from{' '}
                <span className="font-medium text-foreground">{selectedAttempt.city}, {selectedAttempt.country}</span>
              </p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div>
                  <span className="text-muted-foreground">IP Address:</span>
                  <p className="font-mono">{selectedAttempt.ipAddress}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Time:</span>
                  <p>{format(selectedAttempt.timestamp, 'PPp')}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Risk Score:</span>
                  <p className={selectedAttempt.riskScore > 70 ? 'text-destructive font-bold' : 'text-warning'}>
                    {selectedAttempt.riskScore}/100
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p className={selectedAttempt.blocked ? 'text-success' : 'text-destructive'}>
                    {selectedAttempt.blocked ? 'Successfully Blocked' : 'Requires Attention'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
