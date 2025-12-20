import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin, Shield, AlertTriangle, Info } from 'lucide-react';
import { TollMap } from '@/components/mykad/TollMap';
import { TollTimeline } from '@/components/mykad/TollTimeline';
import { LastKnownLocation } from '@/components/mykad/LastKnownLocation';
import { ActionsPanel } from '@/components/mykad/ActionsPanel';
import { mockTollTransactions } from '@/data/tollMockData';
import { cn } from '@/lib/utils';

export default function MyKadLostTrackingPage() {
  const [lostMode, setLostMode] = useState(false);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">MyKad Lost Tracking</h1>
            <Badge 
              variant="outline" 
              className={cn(
                "text-sm",
                lostMode 
                  ? "bg-destructive/20 text-destructive border-destructive/30 animate-pulse" 
                  : "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
              )}
            >
              {lostMode ? '🔴 Lost Mode Activated' : '🟢 Normal'}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Track recent activity linked to your MyKad via Touch 'n Go
          </p>
        </div>

        {/* Lost Mode Toggle */}
        <Card className={cn(
          "glass-elevated border transition-all",
          lostMode ? "border-destructive/50 bg-destructive/5" : "border-border/50"
        )}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Activate Lost Mode
              </h3>
              <p className="text-xs text-muted-foreground">
                Locks identity usage and highlights suspicious activity
              </p>
            </div>
            <Switch
              checked={lostMode}
              onCheckedChange={setLostMode}
              className={cn(
                lostMode && "data-[state=checked]:bg-destructive"
              )}
            />
          </CardContent>
        </Card>
      </div>

      {/* Lost Mode Warning Banner */}
      {lostMode && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/10 animate-slide-up">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="font-semibold">Lost Mode Activated</AlertTitle>
          <AlertDescription className="mt-2">
            <p>Your identity usage is now in read-only mode. New transactions are highlighted in red.</p>
            <p className="mt-2 font-medium">Recommended actions:</p>
            <ul className="list-disc list-inside mt-1 text-sm">
              <li>Report your lost MyKad to JPN (Jabatan Pendaftaran Negara)</li>
              <li>File a police report at the nearest station</li>
              <li>Contact Touch 'n Go to suspend MyKad-linked transactions</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-elevated border-border/50">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Transaction Locations
              </h3>
              <TollMap 
                transactions={mockTollTransactions} 
                lostMode={lostMode}
              />
              <div className="flex items-center gap-6 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>Normal Usage</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span>Unusual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span>Suspicious</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="glass-elevated border-border/50">
            <CardContent className="p-4">
              <TollTimeline 
                transactions={mockTollTransactions} 
                lostMode={lostMode}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Last Location & Actions */}
        <div className="space-y-6">
          <LastKnownLocation 
            transactions={mockTollTransactions} 
            lostMode={lostMode}
          />
          
          <ActionsPanel lostMode={lostMode} />

          {/* Disclaimer */}
          <Card className="glass border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground space-y-2">
                  <p className="font-semibold text-foreground">
                    ⚠️ Prototype / Demo
                  </p>
                  <p>
                    This is a demonstration feature using simulated Touch 'n Go 
                    transaction data. No real-time government data access.
                  </p>
                  <p>
                    This feature complies with PDPA (Personal Data Protection Act) 
                    and requires explicit user consent for data visualization.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
