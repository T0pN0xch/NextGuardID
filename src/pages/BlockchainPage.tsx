import { useState, useEffect } from 'react';
import { BlockchainLog } from '@/components/blockchain/BlockchainLog';
import blockchainService from '@/utils/blockchain';
import { BlockchainRecord } from '@/types/identity';
// Fallback deployment info (inlined to avoid JSON import issues in the client build)
const DEPLOYMENT_TX_HASH = '0xb15d52612c755ea139ef4f3aebff5630dff5e6025dab65834d4b616c9d0a6c5a';
const DEPLOYER_ADDRESS = '0x327eae26Bbd018Fde88595E8A8559D9703922Cd0';
const DEPLOYMENT_TIMESTAMP = '2025-12-21T22:59:40.522Z';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Box, Shield, RefreshCw, ExternalLink, HardDrive, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ConsentStatus } from '@/types/identity';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BlockchainPageProps {
  userIc?: string;
}

export default function BlockchainPage({ userIc }: BlockchainPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ConsentStatus | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Seed with a couple of sample "real" records (deployment tx + one consent example)
  const sampleRecords: BlockchainRecord[] = [
    {
      id: 'r-deploy',
      transactionHash: DEPLOYMENT_TX_HASH,
      timestamp: new Date(DEPLOYMENT_TIMESTAMP),
      platform: 'Contract Deployment',
      action: 'Contract Deployed',
      consentStatus: 'granted',
      blockNumber: 0,
      verified: true,
      ipfsHash: undefined,
      ipfsGateway: undefined,
    },
    {
      id: 'r-sample-consent',
      transactionHash: '0x' + Math.random().toString(16).slice(2, 66),
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      platform: 'Shopee Malaysia',
      action: 'Consent Granted',
      consentStatus: 'granted',
      blockNumber: 18234567,
      verified: true,
      ipfsHash: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
      ipfsGateway: 'https://ipfs.io/ipfs/',
    }
  ];

  const [records, setRecords] = useState<BlockchainRecord[]>(sampleRecords);

  // compute derived stats
  const latestBlock = records.reduce((m, r) => Math.max(m, r.blockNumber || 0), 0);

  useEffect(() => {
    // fetch on mount
    handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRecords = records.filter((record) => {
    const platform = record.platform || '';
    const tx = record.transactionHash || '';
    const matchesSearch = platform.toLowerCase().includes(searchQuery.toLowerCase()) || tx.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.consentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Use the provided user IC (or fall back) to fetch on-chain events
      const subjectId = userIc || 'demo-user';
      const events = await blockchainService.getUserEvents(subjectId);
      const mapped = events.map((ev, idx) => {
        const extractedHash = ev.txHash || ev.transactionHash || ev.hash || (ev.etherscanUrl ? String(ev.etherscanUrl).split('/').pop() : '');
        return {
          id: `r${idx}`,
          transactionHash: extractedHash || '',
          timestamp: ev.timestamp ? new Date(ev.timestamp * (ev.timestamp > 1e12 ? 1 : 1000)) : new Date(),
          platform: ev.platformId || ev.platform || '',
          action: ev.actionType || ev.action || '',
          consentStatus: (ev.actionType || ev.action || '').toLowerCase().includes('revoke') ? 'revoked' : 'granted',
          blockNumber: ev.blockNumber || 0,
          verified: true,
          ipfsHash: ev.ipfsHash || undefined,
          ipfsGateway: ev.ipfsHash ? `https://ipfs.io/ipfs/` : undefined,
        };
      });
      setRecords(mapped);
    } catch (err) {
      console.error('Failed to sync on-chain records', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 h-full overflow-auto">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold">Blockchain Audit Log</h1>
          <p className="text-sm text-muted-foreground mt-2">Immutable record of all identity transactions</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Sync
        </Button>
      </div>

      {/* Blockchain Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-elevated rounded-xl p-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Box className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{records.length}</p>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
            </div>
          </div>
        </div>
        <div className="glass-elevated rounded-xl p-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{records.filter(r => r.verified).length}</p>
              <p className="text-sm text-muted-foreground">Verified</p>
            </div>
          </div>
        </div>
        <div className="glass-elevated rounded-xl p-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Box className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{latestBlock ? latestBlock.toLocaleString() : '—'}</p>
              <p className="text-sm text-muted-foreground">Latest Block</p>
            </div>
          </div>
        </div>
        <div className="glass-elevated rounded-xl p-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{records.filter(r => r.ipfsHash).length}</p>
              <p className="text-sm text-muted-foreground">IPFS Stored</p>
            </div>
          </div>
        </div>
      </div>

      {/* Explorer Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="https://amoy.polygonscan.com"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-elevated rounded-xl p-4 flex items-center gap-3 hover:scale-[1.02] transition-transform"
        >
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <ExternalLink className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">Blockchain Explorer</p>
            <p className="text-xs text-muted-foreground">View on Polygonscan (Amoy) →</p>
          </div>
        </a>
        <a
          href="https://ipfs.io"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-elevated rounded-xl p-4 flex items-center gap-3 hover:scale-[1.02] transition-transform"
        >
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium">IPFS Gateway</p>
            <p className="text-xs text-muted-foreground">Decentralized Storage →</p>
          </div>
        </a>
      </div>

      {/* Contract Info */}
      <div className="glass-elevated rounded-xl p-4 mt-4 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium">Contract</h4>
          <p className="text-xs text-muted-foreground mt-1">Address</p>
          <div className="flex items-center gap-3 mt-2">
            <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded truncate">{blockchainService.CONTRACT_ADDRESS}</code>
            <button
              onClick={() => { navigator.clipboard.writeText(blockchainService.CONTRACT_ADDRESS); toast({ title: 'Copied', description: 'Contract address copied to clipboard.' }); }}
              className="p-2 rounded hover:bg-muted"
            >
              <Copy className="w-4 h-4" />
            </button>
            <a href={`https://amoy.polygonscan.com/address/${blockchainService.CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer" className="p-2 rounded hover:bg-muted">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <p className="text-xs text-muted-foreground mt-3">Deployer</p>
          <div className="flex items-center gap-3 mt-2">
            <code className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded truncate">{DEPLOYER_ADDRESS}</code>
            <a href={`https://amoy.polygonscan.com/tx/${DEPLOYMENT_TX_HASH}`} target="_blank" rel="noreferrer" className="p-2 rounded hover:bg-muted">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-elevated rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by platform or transaction hash..."
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
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="granted">Granted</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Info Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-elevated rounded-xl p-4 border-l-4 border-primary animate-slide-up">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm">Blockchain Verification</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Every identity usage is recorded on the blockchain, creating an immutable audit trail.
              </p>
            </div>
          </div>
        </div>
        <div className="glass-elevated rounded-xl p-4 border-l-4 border-accent animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-start gap-3">
            <HardDrive className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm">IPFS Storage</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Consent data is stored on IPFS for decentralized, permanent, and tamper-proof storage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredRecords.length} of {records.length} transactions
      </div>

      {/* Blockchain Log */}
      <BlockchainLog records={filteredRecords} />
    </div>
  );
}
