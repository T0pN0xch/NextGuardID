import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Lock,
  TrendingUp,
  Activity,
  Ban,
  Eye
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UsageTimeline } from '@/components/dashboard/UsageTimeline';
import { mockIdentityUsages, mockMyKadAuditEvents, mockSuspiciousAttempts } from '@/data/mockData';
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
  const blockedAttempts = mockSuspiciousAttempts.filter(a => a.blocked).length;
  const unblocked = mockSuspiciousAttempts.filter(a => !a.blocked).length;
  const myKadEvents = mockMyKadAuditEvents.slice(0, 5);

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">NextGuard ID Dashboard</h1>
        <p className="text-lg text-gray-600 mt-2">Monitor your MyKad usage & identity protection</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="MyKad Approvals"
          value={mockMyKadAuditEvents.filter(e => e.status === 'approved').length}
          icon={CheckCircle}
          variant="success"
          delay={0}
        />
        <StatsCard
          title="MyKad Denials"
          value={mockMyKadAuditEvents.filter(e => e.status === 'denied').length}
          icon={Ban}
          variant="danger"
          delay={100}
        />
        <StatsCard
          title="Access Attempts Blocked"
          value={blockedAttempts}
          icon={Ban}
          variant="primary"
          delay={200}
        />
        <StatsCard
          title="Unresolved Attempts"
          value={unblocked}
          icon={AlertTriangle}
          variant="warning"
          delay={300}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-8 border-2 border-emerald-200 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 animate-slide-up hover:-translate-y-2" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Lock className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Blockchain Security</h3>
          </div>
          <div className="mb-4">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-emerald-600">{mockMyKadAuditEvents.length}</span>
              <span className="text-base text-gray-600 font-medium">Immutable Records</span>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <p className="text-sm text-gray-700 font-medium">
              ✓ All MyKad usage events recorded on blockchain with IPFS storage
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border-2 border-blue-200 shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 animate-slide-up hover:-translate-y-2" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Activity className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">MyDigital ID Status</h3>
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-2xl font-bold text-emerald-600">Verified & Active</span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-gray-700 font-medium">
              ✓ Profile secured by Malaysia's government MyDigital ID system
            </p>
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <div className="h-1 bg-gradient-to-r from-blue-200 via-cyan-200 to-emerald-200 rounded-full my-4"></div>

      {/* MyKad Audit Trail Section */}
      <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
        <div className="bg-white rounded-2xl border-2 border-purple-200 p-8 shadow-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Eye className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Recent MyKad Usage</h2>
                <p className="text-sm text-gray-600">Verified access events from institutions</p>
              </div>
            </div>
            <a href="/mykad-audit-trail" className="text-base text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">View all →</a>
          </div>

          {/* MyKad Events Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase">Institution</th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase">Action</th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase">Status</th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase">Verified</th>
                </tr>
              </thead>
              <tbody>
                {myKadEvents.map((event) => (
                  <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900">{event.institution.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{format(event.timestamp, 'MMM dd, yyyy')}</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-blue-100 text-blue-700 capitalize text-xs">
                        {event.action.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={event.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : event.status === 'denied' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      {event.verified ? (
                        <span className="text-emerald-600 font-bold">✓ On Chain</span>
                      ) : (
                        <span className="text-gray-400">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <div className="h-1 bg-gradient-to-r from-blue-200 via-cyan-200 to-emerald-200 rounded-full my-4"></div>

      {/* General Identity Usage */}
      <div className="animate-slide-up" style={{ animationDelay: '700ms' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">General Identity Usage</h2>
          <a href="/usage" className="text-base text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">View all →</a>
        </div>
        <UsageTimeline usages={recentUsages} onViewDetails={setSelectedUsage} />
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedUsage} onOpenChange={() => setSelectedUsage(null)}>
        <DialogContent className="bg-white border-2 border-gray-200 shadow-2xl max-w-lg rounded-3xl">
          {selectedUsage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-4 text-2xl font-bold">
                  <span className="text-5xl">{selectedUsage.serviceIcon}</span>
                  {selectedUsage.serviceName}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-6">
                <div className="pb-4 border-b-2 border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Category</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">{selectedUsage.category}</p>
                </div>
                <div className="pb-4 border-b-2 border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Purpose</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">{selectedUsage.purpose}</p>
                </div>
                <div className="pb-4 border-b-2 border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Registration Date</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">{format(selectedUsage.dateTime, 'PPP')}</p>
                </div>
                <div className="pb-4 border-b-2 border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Last Accessed</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">{format(selectedUsage.lastAccessed, 'PPP')}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Data Shared</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsage.dataShared.map((data) => (
                      <Badge key={data} className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-2 rounded-lg">{data}</Badge>
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
