import { useState } from 'react';
import { BlockchainLog } from '@/components/blockchain/BlockchainLog';
import { mockBlockchainRecords } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Box, Shield, RefreshCw, ExternalLink, HardDrive } from 'lucide-react';
import { ConsentStatus } from '@/types/identity';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function BlockchainPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ConsentStatus | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredRecords = mockBlockchainRecords.filter((record) => {
    const matchesSearch = 
      record.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.transactionHash.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.consentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blockchain Audit Log</h1>
          <p className="text-muted-foreground">Immutable record of all identity transactions</p>
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
              <p className="text-2xl font-bold">{mockBlockchainRecords.length}</p>
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
              <p className="text-2xl font-bold">{mockBlockchainRecords.filter(r => r.verified).length}</p>
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
              <p className="text-2xl font-bold">18.2M</p>
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
              <p className="text-2xl font-bold">{mockBlockchainRecords.filter(r => r.ipfsHash).length}</p>
              <p className="text-sm text-muted-foreground">IPFS Stored</p>
            </div>
          </div>
        </div>
      </div>

      {/* Explorer Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a 
          href="https://etherscan.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="glass-elevated rounded-xl p-4 flex items-center gap-3 hover:scale-[1.02] transition-transform"
        >
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <ExternalLink className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">Blockchain Explorer</p>
            <p className="text-xs text-muted-foreground">View on Etherscan →</p>
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
        Showing {filteredRecords.length} of {mockBlockchainRecords.length} transactions
      </div>

      {/* Blockchain Log */}
      <BlockchainLog records={filteredRecords} />
    </div>
  );
}
