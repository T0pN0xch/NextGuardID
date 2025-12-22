import { useState } from 'react';
import { UsageTimeline } from '@/components/dashboard/UsageTimeline';
import { mockIdentityUsages } from '@/data/mockData';
import { IdentityUsage, RiskLevel, IdentityStatus } from '@/types/identity';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function UsagePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<IdentityStatus | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUsage, setSelectedUsage] = useState<IdentityUsage | null>(null);
  // offline / manual IC usage records stored locally
  const [offlineUsages, setOfflineUsages] = useState<IdentityUsage[]>(() => {
    try {
      const raw = localStorage.getItem('offlineUsages');
      if (raw) {
        const parsed = JSON.parse(raw);
        // revive dates
        return parsed.map((p: any) => ({ ...p, dateTime: new Date(p.dateTime), lastAccessed: new Date(p.lastAccessed) }));
      }
    } catch (e) {
      console.warn('Failed to load offline usages', e);
    }
    // default example offline records
    return [
      {
        id: 'o1',
        serviceName: "Clinic Walk-in Registration",
        serviceIcon: '🏥',
        dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        purpose: 'Patient registration (manual IC entry at front desk)',
        status: 'active' as IdentityStatus,
        riskLevel: 'low' as RiskLevel,
        category: 'Healthcare',
        dataShared: ['Full Name', 'IC Number', 'Phone Number'],
        lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        offlineNote: 'IC entered on paper form at Klinik Sejahtera reception'
      },
      {
        id: 'o2',
        serviceName: "Bank Branch Account Opening",
        serviceIcon: '🏦',
        dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        purpose: 'Account opening (manual IC scanned/copied)',
        status: 'active' as IdentityStatus,
        riskLevel: 'medium' as RiskLevel,
        category: 'Banking',
        dataShared: ['Full Name', 'IC Number', 'Address'],
        lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        offlineNote: 'IC photocopied and attached to paper application'
      }
    ];
  });

  // form state for adding offline usage
  const [formService, setFormService] = useState('');
  const [formPurpose, setFormPurpose] = useState('');
  const [formCategory, setFormCategory] = useState('Other');
  const [formDataShared, setFormDataShared] = useState('IC Number, Full Name');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [formNote, setFormNote] = useState('');
  const { toast } = useToast();

  // combine offline + mocked online usages (offline first so users see them)
  const combinedUsages = [...offlineUsages, ...mockIdentityUsages];

  const filteredUsages = combinedUsages
    .filter((usage) => {
      const matchesSearch = (usage.serviceName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (usage.category || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = riskFilter === 'all' || usage.riskLevel === riskFilter;
      const matchesStatus = statusFilter === 'all' || usage.status === statusFilter;
      return matchesSearch && matchesRisk && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.dateTime).getTime();
      const dateB = new Date(b.dateTime).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Identity Usage History</h1>
        <p className="text-muted-foreground">Complete timeline of where your MyKad has been used</p>
      </div>

      {/* Offline/manual IC reporting */}
      <div className="glass-elevated rounded-xl p-4">
        <h3 className="text-sm font-medium mb-2">Report an Offline / Manual IC Use</h3>
        <p className="text-xs text-muted-foreground mb-3">Add where you manually entered or handed your IC so you can track offline usage.</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input placeholder="Service name (e.g., Clinic)" value={formService} onChange={(e) => setFormService(e.target.value)} />
          <Input placeholder="Purpose (e.g., registration)" value={formPurpose} onChange={(e) => setFormPurpose(e.target.value)} />
          <Input placeholder="Category (e.g., Healthcare)" value={formCategory} onChange={(e) => setFormCategory(e.target.value)} />
          <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <Input value={formDataShared} onChange={(e) => setFormDataShared(e.target.value)} placeholder="Data shared (comma separated)" />
          <Input value={formNote} onChange={(e) => setFormNote(e.target.value)} placeholder="Optional note (where IC was entered)" />
        </div>
        <div className="flex gap-2 mt-3">
          <Button onClick={() => {
            // validation
            if (!formService.trim()) {
              toast({ title: 'Missing service', description: 'Please enter the service name.' });
              return;
            }
            if (!formDate) {
              toast({ title: 'Missing date', description: 'Please select a date.' });
              return;
            }
            const dataSharedArr = formDataShared.split(',').map(s => s.trim()).filter(Boolean);
            if (dataSharedArr.length === 0) {
              toast({ title: 'No data types', description: 'Please list at least one data type shared.' });
              return;
            }

            // create new offline usage
            const newUsage: IdentityUsage = {
              id: `o-${Date.now()}`,
              serviceName: formService || 'Unknown Service',
              serviceIcon: '📄',
              dateTime: new Date(formDate),
              purpose: formPurpose || 'Manual IC entry',
              status: 'active',
              riskLevel: 'low',
              category: formCategory || 'Other',
              dataShared: dataSharedArr,
              lastAccessed: new Date(formDate),
              offlineNote: formNote || `Reported via app`,
            };
            const next = [newUsage, ...offlineUsages];
            setOfflineUsages(next);
            try { localStorage.setItem('offlineUsages', JSON.stringify(next)); } catch (e) { /* ignore */ }
            toast({ title: 'Offline usage added', description: `${newUsage.serviceName} recorded.` });
            // reset form
            setFormService(''); setFormPurpose(''); setFormCategory('Other'); setFormDataShared('IC Number, Full Name'); setFormDate(new Date().toISOString().slice(0, 10)); setFormNote('');
          }}>Add Offline Usage</Button>
          <Button variant="ghost" onClick={() => { setOfflineUsages([]); localStorage.removeItem('offlineUsages'); toast({ title: 'Offline records cleared' }); }}>Clear Offline Records</Button>
          <Button variant="outline" onClick={() => {
            // export combined usages as CSV
            try {
              const rows = combinedUsages.map(u => ({
                id: u.id,
                serviceName: u.serviceName,
                dateTime: (u.dateTime instanceof Date) ? u.dateTime.toISOString() : new Date(u.dateTime).toISOString(),
                purpose: u.purpose,
                category: u.category,
                status: u.status,
                riskLevel: u.riskLevel,
                dataShared: (u.dataShared || []).join('|'),
                offlineNote: (u as any).offlineNote || ''
              }));
              const header = Object.keys(rows[0] || {}).join(',') + '\n';
              const csv = header + rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `identity_usages_${Date.now()}.csv`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
              toast({ title: 'Exported CSV', description: 'Identity usages exported.' });
            } catch (e) {
              toast({ title: 'Export failed', description: 'Could not export CSV.' });
            }
          }}>Export CSV</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-elevated rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={riskFilter} onValueChange={(v) => setRiskFilter(v as RiskLevel | 'all')}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risks</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as IdentityStatus | 'all')}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            >
              {sortOrder === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredUsages.length} of {combinedUsages.length} platforms
      </div>

      {/* Timeline */}
      <UsageTimeline usages={filteredUsages} onViewDetails={setSelectedUsage} />

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
                <div className="pt-4 border-t border-border">
                  <Button variant="warning" className="w-full">
                    Request Data Review
                  </Button>
                </div>
                {selectedUsage.offlineNote && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    <p className="font-medium">Offline Note</p>
                    <p>{selectedUsage.offlineNote}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
