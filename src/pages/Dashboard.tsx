import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Activity
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UsageTimeline } from '@/components/dashboard/UsageTimeline';
import { SuspiciousMap } from '@/components/dashboard/SuspiciousMap';
import { mockIdentityUsages, mockDashboardStats, mockSuspiciousAttempts } from '@/data/mockData';
import { useState } from 'react';
import { IdentityUsage } from '@/types/identity';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function Dashboard() {
  const [selectedUsage, setSelectedUsage] = useState<IdentityUsage | null>(null);
  const recentUsages = mockIdentityUsages.slice(0, 5);

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Monitor your digital identity usage across platforms</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Platforms"
          value={mockDashboardStats.totalPlatforms}
          icon={Shield}
          variant="primary"
          delay={0}
        />
        <StatsCard
          title="Active Platforms"
          value={mockDashboardStats.activePlatforms}
          icon={CheckCircle}
          variant="success"
          trend={{ value: 12, isPositive: true }}
          delay={100}
        />
        <StatsCard
          title="High Risk"
          value={mockDashboardStats.highRiskPlatforms}
          icon={AlertTriangle}
          variant="danger"
          delay={200}
        />
        <StatsCard
          title="Recent Registrations"
          value={mockDashboardStats.recentRegistrations}
          icon={Clock}
          variant="warning"
          trend={{ value: 5, isPositive: true }}
          delay={300}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-elevated rounded-xl p-5 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <h3 className="font-semibold">Identity Health</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-success">85%</span>
            <span className="text-sm text-muted-foreground">Security Score</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Your identity is well protected. Consider reviewing high-risk platforms.
          </p>
        </div>

        <div className="glass-elevated rounded-xl p-5 animate-slide-up" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <h3 className="font-semibold">Inactive Accounts</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-warning">{mockDashboardStats.inactiveAccounts}</span>
            <span className="text-sm text-muted-foreground">accounts</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Consider revoking access for unused platforms.
          </p>
        </div>

        <div className="glass-elevated rounded-xl p-5 animate-slide-up" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold">Last Activity</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">Maybank2u</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Login verified 2 hours ago via MyDigital ID
          </p>
        </div>
      </div>

      {/* Suspicious Activity Map */}
      <div className="animate-slide-up" style={{ animationDelay: '700ms' }}>
        <SuspiciousMap attempts={mockSuspiciousAttempts} />
      </div>

      {/* Recent Activity */}
      <div className="animate-slide-up" style={{ animationDelay: '800ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Identity Usage</h2>
          <a href="/usage" className="text-sm text-primary hover:underline">View all →</a>
        </div>
        <UsageTimeline usages={recentUsages} onViewDetails={setSelectedUsage} />
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedUsage} onOpenChange={() => setSelectedUsage(null)}>
        <DialogContent className="glass-elevated border-border/50 max-w-lg">
          {selectedUsage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-3xl">{selectedUsage.serviceIcon}</span>
                  {selectedUsage.serviceName}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{selectedUsage.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purpose</p>
                  <p className="font-medium">{selectedUsage.purpose}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registration Date</p>
                  <p className="font-medium">{format(selectedUsage.dateTime, 'PPP')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Accessed</p>
                  <p className="font-medium">{format(selectedUsage.lastAccessed, 'PPP')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Data Shared</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedUsage.dataShared.map((data) => (
                      <Badge key={data} variant="secondary">{data}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
