import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Sparkles,
  Loader2
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UsageTimeline } from '@/components/dashboard/UsageTimeline';
import { SuspiciousMap } from '@/components/dashboard/SuspiciousMap';
import { mockIdentityUsages, mockDashboardStats, mockSuspiciousAttempts } from '@/data/mockData';
import { useState, useEffect } from 'react';
import { IdentityUsage } from '@/types/identity';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export default function Dashboard() {
  const [selectedUsage, setSelectedUsage] = useState<IdentityUsage | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const recentUsages = mockIdentityUsages.slice(0, 5);

  // Auto-generate page summary on mount
  useEffect(() => {
    const generateSummary = async () => {
      setLoadingSummary(true);
      try {
        const pageContent = `
NEXTGUARD ID - COMPREHENSIVE DASHBOARD SECURITY ANALYSIS & ACTION PLAN

=== YOUR IDENTITY PORTFOLIO OVERVIEW ===
Total Registered Platforms: ${mockDashboardStats.totalPlatforms} platforms
- Active Platforms: ${mockDashboardStats.activePlatforms} actively using your identity
- Inactive/Unused: ${mockDashboardStats.inactiveAccounts} platforms (dormant)
- New Registrations This Month: ${mockDashboardStats.recentRegistrations}

=== SECURITY POSTURE & THREAT ASSESSMENT ===
Overall Security Score: 85/100 (GOOD - Above Average)
  - This score indicates good overall protection
  - Room for improvement: Address high-risk platforms and suspicious attempts

High-Risk Platforms: ${mockDashboardStats.highRiskPlatforms} platform(s) requiring immediate attention
  - These platforms have elevated security risks
  - May use outdated security protocols or have weak access controls
  
Suspicious Activity Detection:
  - Total Attempts Detected: ${mockSuspiciousAttempts.length}
  - Successfully Blocked: ${mockSuspiciousAttempts.filter(a => a.blocked).length} attempts (System protected you)
  - Active/Unresolved: ${mockSuspiciousAttempts.filter(a => !a.blocked).length} attempt(s) needing review

=== CURRENT STATUS & WHAT IT MEANS ===
✓ Good News: Your identity has active protection with ${mockSuspiciousAttempts.filter(a => a.blocked).length} blocked attempts showing system effectiveness
⚠ Needs Attention: ${mockDashboardStats.highRiskPlatforms} high-risk platform(s) and ${mockSuspiciousAttempts.filter(a => !a.blocked).length} unresolved suspicious attempt(s)
◆ Improvement Opportunity: ${mockDashboardStats.inactiveAccounts} inactive account(s) still consuming your digital footprint

=== RECOMMENDED ACTIONS (PRIORITY ORDER) ===

PRIORITY 1 - URGENT (This Week):
1. Review Suspicious Attempts:
   - Check the ${mockSuspiciousAttempts.filter(a => !a.blocked).length} unresolved suspicious attempt(s) in the Suspicious Activity section
   - Determine if these are legitimate access attempts or unauthorized activity
   - Take action: Approve, Block, or Mark as Not Me

2. Audit High-Risk Platforms:
   - Identify the ${mockDashboardStats.highRiskPlatforms} high-risk platform(s) on your dashboard
   - Review what data you've shared with these platforms
   - Consider: Updating passwords, reviewing permissions, or revoking access if not actively used

PRIORITY 2 - IMPORTANT (This Month):
3. Clean Up Inactive Accounts:
   - You have ${mockDashboardStats.inactiveAccounts} inactive account(s) that you're no longer using
   - These still hold your personal data and pose unnecessary risk
   - Action: Go to each inactive platform and revoke consent or close the account
   - Expected result: Reduce security footprint and minimize data exposure

4. Monitor Recent Registrations:
   - Review your ${mockDashboardStats.recentRegistrations} new registration(s)
   - Verify these are legitimate services you intended to join
   - Ensure consent settings match your privacy expectations

PRIORITY 3 - ONGOING:
5. Maintain Current Security Practices:
   - You've achieved an 85% security score - maintain current good practices
   - Continue monitoring the Identity Usage section for unexpected activity
   - Set reminders to review this dashboard monthly

=== DASHBOARD NAVIGATION GUIDE ===
- Suspicious Activity Map: Shows geographic location of login attempts (red/yellow pins)
- Recent Identity Usage: Details of where your identity was used
- Consent Page: See and revoke data sharing permissions
- Profile Page: Update personal information and security settings
- MyKad Lost Tracking: Monitor Touch 'n Go transactions if card lost

=== NEXT STEPS ===
1. Immediately review ${mockSuspiciousAttempts.filter(a => !a.blocked).length} unresolved suspicious attempt(s) in Suspicious Activity section
2. This week: Audit ${mockDashboardStats.highRiskPlatforms} high-risk platform(s) and update security
3. This month: Deactivate or close ${mockDashboardStats.inactiveAccounts} inactive account(s)
4. Schedule monthly dashboard reviews to maintain 85%+ security score

`;
        const highRiskCount = mockSuspiciousAttempts.filter(a => !a.blocked).length;
        const blockedCount = mockSuspiciousAttempts.filter(a => a.blocked).length;

        const proxy = (window as any).__CHAT_PROXY_URL__ || 'http://localhost:3001';
        const res = await fetch(`${proxy}/api/summarize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: pageContent }),
        });

        if (res.ok) {
          const data = await res.json();
          setSummary(data.summary || getDetailedFallback());
        } else {
          setSummary(getDetailedFallback());
        }
      } catch (error) {
        setSummary(getDetailedFallback());
      } finally {
        setLoadingSummary(false);
      }
    };

    const getDetailedFallback = () => {
      const highRiskCount = mockSuspiciousAttempts.filter(a => !a.blocked).length;
      const blockedCount = mockSuspiciousAttempts.filter(a => a.blocked).length;
      return `Dashboard Summary: You have ${mockDashboardStats.totalPlatforms} platforms with ${mockDashboardStats.activePlatforms} active and ${mockDashboardStats.inactiveAccounts} inactive. Security Score: 85% (Good). Current Issues: ${mockDashboardStats.highRiskPlatforms} high-risk platform(s), ${highRiskCount} unresolved suspicious attempt(s), ${blockedCount} successfully blocked. Immediate Actions: (1) Review ${highRiskCount} suspicious attempt(s) in Suspicious Activity section - determine if legitimate and take action; (2) Audit ${mockDashboardStats.highRiskPlatforms} high-risk platform(s) - review shared data and security settings; (3) Deactivate ${mockDashboardStats.inactiveAccounts} inactive account(s) - remove unused platforms from your digital footprint. Timeline: Address issues this week to improve security score. Monthly check-ins recommended to maintain protection.`;
    };

    generateSummary();
  }, []);

  return (
    <div className="space-y-8 p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-lg text-gray-600 mt-2">Monitor your digital identity usage across platforms</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-8 border-2 border-emerald-200 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 animate-slide-up hover:-translate-y-2" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Identity Health</h3>
          </div>
          <div className="mb-4">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-emerald-600">85%</span>
              <span className="text-base text-gray-600 font-medium">Security Score</span>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <p className="text-sm text-gray-700 font-medium">
              ✓ Your identity is well protected. Consider reviewing high-risk platforms.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border-2 border-amber-200 shadow-lg hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 animate-slide-up hover:-translate-y-2" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Inactive Accounts</h3>
          </div>
          <div className="mb-4">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-amber-600">{mockDashboardStats.inactiveAccounts}</span>
              <span className="text-base text-gray-600 font-medium">accounts</span>
            </div>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <p className="text-sm text-gray-700 font-medium">
              ⚠️ Consider revoking access for unused platforms.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border-2 border-blue-200 shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 animate-slide-up hover:-translate-y-2" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Activity className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Last Activity</h3>
          </div>
          <div className="mb-4">
            <span className="text-2xl font-bold text-blue-600">Maybank2u</span>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-gray-700 font-medium">
              ✓ Login verified 2 hours ago via MyDigital ID
            </p>
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <div className="h-1 bg-gradient-to-r from-blue-200 via-cyan-200 to-emerald-200 rounded-full my-4"></div>

      {/* Suspicious Activity Map */}
      <div className="animate-slide-up" style={{ animationDelay: '700ms' }}>
        <SuspiciousMap attempts={mockSuspiciousAttempts} />
      </div>

      {/* Separator Line */}
      <div className="h-1 bg-gradient-to-r from-blue-200 via-cyan-200 to-emerald-200 rounded-full my-4"></div>

      {/* Recent Activity */}
      <div className="animate-slide-up" style={{ animationDelay: '800ms' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Identity Usage</h2>
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
