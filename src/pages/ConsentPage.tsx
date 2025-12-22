import { useState } from 'react';
import { ConsentCard } from '@/components/consent/ConsentCard';
import { mockConsentRecords } from '@/data/mockData';
import { ConsentRecord, ConsentStatus } from '@/types/identity';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FileKey } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import blockchainService from '@/utils/blockchain';

interface ConsentPageProps {
  userIc?: string;
}

export default function ConsentPage({ userIc }: ConsentPageProps) {
  const [consents, setConsents] = useState<ConsentRecord[]>(mockConsentRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ConsentStatus | 'all'>('all');
  const [actionDialog, setActionDialog] = useState<{
    type: 'revoke' | 'delete' | null;
    consentId: string | null;
    serviceName: string;
  }>({ type: null, consentId: null, serviceName: '' });

  const filteredConsents = consents.filter((consent) => {
    const matchesSearch = consent.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || consent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRevoke = (id: string) => {
    const consent = consents.find(c => c.id === id);
    if (consent) {
      setActionDialog({ type: 'revoke', consentId: id, serviceName: consent.serviceName });
    }
  };

  const handleDelete = (id: string) => {
    const consent = consents.find(c => c.id === id);
    if (consent) {
      setActionDialog({ type: 'delete', consentId: id, serviceName: consent.serviceName });
    }
  };

  const confirmAction = () => {
    (async () => {
      if (actionDialog.type === 'revoke' && actionDialog.consentId) {
        const consent = consents.find(c => c.id === actionDialog.consentId);
        try {
          // ensure wallet connected
          if (!blockchainService.signer) {
            await blockchainService.connectWallet();
          }

          const metadata = {
            serviceName: actionDialog.serviceName,
            action: 'CONSENT_REVOKED',
            timestamp: new Date().toISOString(),
            dataTypes: consent?.dataTypes || []
          };

          const subjectId = userIc || 'demo-user';
          const tx = await blockchainService.logConsentWithIPFS(subjectId, actionDialog.serviceName, 'CONSENT_REVOKED', metadata);

          setConsents(prev => prev.map(c =>
            c.id === actionDialog.consentId
              ? { ...c, status: 'revoked' as ConsentStatus, canRevoke: false, canDelete: false, blockchainHash: tx.hash, ipfsHash: tx.ipfsHash }
              : c
          ));

          toast({
            title: "Access Revoked",
            description: `${actionDialog.serviceName} no longer has access to your data. Tx: ${tx.hash}`,
          });
        } catch (err) {
          console.error('Blockchain revoke failed', err);
          // fallback to local state update if blockchain call fails
          setConsents(prev => prev.map(c =>
            c.id === actionDialog.consentId
              ? { ...c, status: 'revoked' as ConsentStatus, canRevoke: false, canDelete: false }
              : c
          ));
          toast({
            title: "Access Revoked (Local)",
            description: `${actionDialog.serviceName} marked revoked locally. Blockchain update failed.`,
            variant: 'destructive'
          });
        }
      } else if (actionDialog.type === 'delete' && actionDialog.consentId) {
        toast({
          title: "Deletion Request Submitted",
          description: `A request to delete your data from ${actionDialog.serviceName} has been submitted. You will be notified when complete.`,
        });
      }
      setActionDialog({ type: null, consentId: null, serviceName: '' });
    })();
  };

  const handleViewBlockchain = (hash: string) => {
    toast({
      title: "Blockchain Record",
      description: `Transaction hash: ${hash.slice(0, 20)}...`,
    });
    window.open(`https://amoy.polygonscan.com/tx/${hash}`, '_blank');
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Consent Management</h1>
        <p className="text-muted-foreground">Control your data sharing permissions across all platforms</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-elevated rounded-xl p-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <FileKey className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{consents.filter(c => c.status === 'granted').length}</p>
              <p className="text-sm text-muted-foreground">Active Consents</p>
            </div>
          </div>
        </div>
        <div className="glass-elevated rounded-xl p-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
              <FileKey className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{consents.filter(c => c.status === 'revoked').length}</p>
              <p className="text-sm text-muted-foreground">Revoked</p>
            </div>
          </div>
        </div>
        <div className="glass-elevated rounded-xl p-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <FileKey className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{consents.filter(c => c.canRevoke).length}</p>
              <p className="text-sm text-muted-foreground">Revocable</p>
            </div>
          </div>
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

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ConsentStatus | 'all')}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="granted">Granted</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Consent Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredConsents.map((consent, index) => (
          <div key={consent.id} style={{ animationDelay: `${index * 100}ms` }}>
            <ConsentCard
              consent={consent}
              onRevoke={handleRevoke}
              onDelete={handleDelete}
              onViewBlockchain={handleViewBlockchain}
            />
          </div>
        ))}
      </div>

      {/* Action Confirmation Dialog */}
      <AlertDialog
        open={actionDialog.type !== null}
        onOpenChange={() => setActionDialog({ type: null, consentId: null, serviceName: '' })}
      >
        <AlertDialogContent className="glass-elevated border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog.type === 'revoke' ? 'Revoke Access' : 'Request Data Deletion'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.type === 'revoke'
                ? `Are you sure you want to revoke ${actionDialog.serviceName}'s access to your personal data? This action will be recorded on the blockchain and cannot be undone.`
                : `Are you sure you want to request deletion of your data from ${actionDialog.serviceName}? This process may take up to 30 days.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={actionDialog.type === 'delete' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              {actionDialog.type === 'revoke' ? 'Revoke Access' : 'Request Deletion'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
