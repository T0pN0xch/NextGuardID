import { useState, useEffect, useCallback } from 'react';
import {
    Building2,
    CheckCircle2,
    XCircle,
    Clock,
    Lock,
    Shield,
    TrendingUp,
    AlertTriangle,
    Loader,
    ExternalLink,
    AlertCircle,
    Wifi,
    WifiOff,
    Download,
    RefreshCw,
    Search,
    Filter,
    SortAsc,
    SortDesc,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useBlockchainEvents } from '@/hooks/useBlockchainEvents';
import blockchainService from '@/utils/blockchain';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { IdentityUsage, RiskLevel, IdentityStatus } from '@/types/identity';
import { mockIdentityUsages } from '@/data/mockData';

interface UnifiedAuditRecord {
    id: string;
    type: 'online' | 'offline' | 'blockchain';
    action: string;
    platform?: string;
    institution?: string;
    timestamp: Date;
    status: 'approved' | 'pending' | 'revoked' | 'active';
    riskLevel?: RiskLevel;
    category?: string;
    dataShared?: string[];
    details?: string;
    txHash?: string;
    ipfsHash?: string;
}

const getActionIcon = (action: string) => {
    const actionUpper = action.toUpperCase();
    switch (actionUpper) {
        case 'IDENTITY_USED':
        case 'REGISTRATION':
            return <Shield className="w-4 h-4" />;
        case 'CONSENT_GRANTED':
        case 'CONSENT_APPROVAL':
            return <CheckCircle2 className="w-4 h-4" />;
        case 'CONSENT_REVOKED':
            return <XCircle className="w-4 h-4" />;
        case 'RECORD_ACCESS':
            return <Lock className="w-4 h-4" />;
        case 'VERIFICATION':
            return <TrendingUp className="w-4 h-4" />;
        case 'EMERGENCY_ACCESS':
            return <AlertTriangle className="w-4 h-4" />;
        default:
            return <Shield className="w-4 h-4" />;
    }
};

const getActionLabel = (action: string): string => {
    const labels: Record<string, string> = {
        'IDENTITY_USED': 'Identity Usage',
        'CONSENT_GRANTED': 'Consent Granted',
        'CONSENT_REVOKED': 'Consent Revoked',
        'REGISTRATION': 'Registration',
        'RECORD_ACCESS': 'Records Accessed',
        'VERIFICATION': 'Identity Verified',
        'CONSENT_APPROVAL': 'Consent Approved',
        'EMERGENCY_ACCESS': 'Emergency Access',
    };
    return labels[action] || action;
};

const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
        'approved': 'bg-green-100 text-green-800',
        'active': 'bg-green-100 text-green-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'revoked': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

const getRiskColor = (risk?: RiskLevel): string => {
    const colors: Record<string, string> = {
        'low': 'bg-green-100 text-green-800',
        'medium': 'bg-yellow-100 text-yellow-800',
        'high': 'bg-red-100 text-red-800',
    };
    return colors[risk || 'low'] || 'bg-gray-100 text-gray-800';
};

export default function AuditLogPage() {
    const [records, setRecords] = useState<UnifiedAuditRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'online' | 'offline' | 'blockchain'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'revoked'>('all');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedRecord, setSelectedRecord] = useState<UnifiedAuditRecord | null>(null);
    const { toast } = useToast();

    // Load offline usages from localStorage
    const [offlineUsages, setOfflineUsages] = useState<UnifiedAuditRecord[]>(() => {
        try {
            const raw = localStorage.getItem('offlineUsages');
            if (raw) {
                const parsed = JSON.parse(raw);
                return parsed.map((p: any) => ({
                    ...p,
                    timestamp: new Date(p.timestamp || p.dateTime),
                    type: 'offline' as const,
                }));
            }
        } catch (e) {
            console.warn('Failed to load offline usages', e);
        }
        return [];
    });

    // Load blockchain records
    const fetchAuditRecords = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch blockchain events
            const events = await blockchainService.getAllContractEvents();
            const blockchainRecords: UnifiedAuditRecord[] = events.map((evt: any) => ({
                id: evt.transactionHash,
                type: 'blockchain' as const,
                action: evt.actionType?.toUpperCase() || 'UNKNOWN',
                institution: evt.platformId || 'Unknown',
                timestamp: new Date(evt.timestamp * 1000),
                status: evt.actionType === 'CONSENT_REVOKED' ? 'revoked' : 'approved',
                details: evt.metadata ? JSON.stringify(evt.metadata) : undefined,
                txHash: evt.transactionHash || evt.txHash,
                ipfsHash: evt.ipfsHash,
            }));

            // Combine all records
            const combinedRecords = [
                ...blockchainRecords,
                ...offlineUsages,
            ].sort((a, b) => (sortOrder === 'desc' ? b.timestamp.getTime() - a.timestamp.getTime() : a.timestamp.getTime() - b.timestamp.getTime()));

            setRecords(combinedRecords);
        } catch (err) {
            console.error('Error fetching audit records:', err);
            toast({
                title: 'Error',
                description: 'Failed to fetch audit records',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [offlineUsages, sortOrder, toast]);

    useEffect(() => {
        fetchAuditRecords();
    }, []);

    // Filter records
    const filteredRecords = records.filter((record) => {
        const matchesSearch =
            record.platform?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.institution?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.category?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = typeFilter === 'all' || record.type === typeFilter;
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'approved' && (record.status === 'approved' || record.status === 'active')) ||
            statusFilter === record.status;

        return matchesSearch && matchesType && matchesStatus;
    });

    // Calculate stats
    const stats = {
        total: records.length,
        online: records.filter((r) => r.type === 'blockchain').length,
        offline: records.filter((r) => r.type === 'offline').length,
        approved: records.filter((r) => r.status === 'approved' || r.status === 'active').length,
    };

    const handleExport = async () => {
        try {
            const dataToExport = {
                exportDate: new Date().toISOString(),
                totalRecords: filteredRecords.length,
                records: filteredRecords.map((r) => ({
                    type: r.type,
                    action: r.action,
                    platform: r.platform || r.institution,
                    timestamp: r.timestamp.toISOString(),
                    status: r.status,
                    category: r.category,
                    dataShared: r.dataShared?.join(', '),
                    details: r.details,
                    txHash: r.txHash,
                })),
            };

            const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `audit-log-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            toast({
                title: 'Exported',
                description: 'Audit log exported successfully',
            });
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to export audit log',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-4 p-4 md:p-6 h-full overflow-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Audit Log</h1>
                <p className="text-muted-foreground">Complete record of all identity usage across platforms</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="glass-elevated border-border/50">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <div className="text-xs text-muted-foreground mt-1">Total Events</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-elevated border-border/50">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{stats.online}</div>
                            <div className="text-xs text-muted-foreground mt-1">Online Records</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-elevated border-border/50">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-amber-600">{stats.offline}</div>
                            <div className="text-xs text-muted-foreground mt-1">Offline Records</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-elevated border-border/50">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                            <div className="text-xs text-muted-foreground mt-1">Approved</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Actions */}
            <Card className="glass-elevated border-border/50">
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        {/* Search and Sort */}
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search platform, institution, action..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                                title="Toggle sort order"
                            >
                                {sortOrder === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
                            </Button>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-3">
                            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="blockchain">Online (Blockchain)</SelectItem>
                                    <SelectItem value="offline">Offline (Manual)</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="revoked">Revoked</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex gap-2 md:ml-auto">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fetchAuditRecords()}
                                    disabled={loading}
                                    className="gap-2"
                                >
                                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                    Refresh
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleExport}
                                    disabled={filteredRecords.length === 0}
                                    className="gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Export
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Records Table */}
            <Card className="glass-elevated border-border/50">
                <CardHeader>
                    <CardTitle>Records ({filteredRecords.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredRecords.length === 0 ? (
                        <div className="text-center py-8">
                            <AlertCircle className="w-8 h-8 mx-auto mb-3 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground">No records found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-border/50">
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Action</TableHead>
                                        <TableHead>Platform</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRecords.map((record) => (
                                        <TableRow key={record.id} className="border-border/30 hover:bg-secondary/30">
                                            <TableCell className="text-xs">
                                                <div>{format(record.timestamp, 'MMM dd, yyyy')}</div>
                                                <div className="text-muted-foreground">{format(record.timestamp, 'HH:mm:ss')}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-xs">
                                                    {record.type === 'blockchain' ? '🔗 Online' : '📱 Offline'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getActionIcon(record.action)}
                                                    <span className="font-medium text-sm">{getActionLabel(record.action)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm">{record.platform || record.institution || '-'}</TableCell>
                                            <TableCell>
                                                <Badge className={cn('text-xs', getStatusColor(record.status))}>
                                                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setSelectedRecord(record)}
                                                            className="gap-1"
                                                        >
                                                            View <ExternalLink className="w-3 h-3" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                        <DialogHeader>
                                                            <DialogTitle>{getActionLabel(record.action)}</DialogTitle>
                                                            <DialogDescription>
                                                                {format(record.timestamp, 'PPpp')}
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <div className="text-xs font-semibold text-muted-foreground">Type</div>
                                                                    <div className="text-sm mt-1">{record.type === 'blockchain' ? 'Online (Blockchain)' : 'Offline (Manual)'}</div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs font-semibold text-muted-foreground">Status</div>
                                                                    <div className="text-sm mt-1">
                                                                        <Badge className={cn('text-xs', getStatusColor(record.status))}>
                                                                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs font-semibold text-muted-foreground">Platform</div>
                                                                    <div className="text-sm mt-1">{record.platform || record.institution || '-'}</div>
                                                                </div>
                                                                {record.category && (
                                                                    <div>
                                                                        <div className="text-xs font-semibold text-muted-foreground">Category</div>
                                                                        <div className="text-sm mt-1">{record.category}</div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {record.dataShared && record.dataShared.length > 0 && (
                                                                <div>
                                                                    <div className="text-xs font-semibold text-muted-foreground mb-2">Data Shared</div>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {record.dataShared.map((data) => (
                                                                            <Badge key={data} variant="secondary" className="text-xs">
                                                                                {data}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {record.riskLevel && (
                                                                <div>
                                                                    <div className="text-xs font-semibold text-muted-foreground mb-2">Risk Level</div>
                                                                    <Badge className={cn('text-xs', getRiskColor(record.riskLevel))}>
                                                                        {record.riskLevel.toUpperCase()}
                                                                    </Badge>
                                                                </div>
                                                            )}

                                                            {record.details && (
                                                                <div>
                                                                    <div className="text-xs font-semibold text-muted-foreground mb-2">Details</div>
                                                                    <pre className="text-xs bg-secondary/50 p-3 rounded border border-border/50 overflow-x-auto">
                                                                        {record.details}
                                                                    </pre>
                                                                </div>
                                                            )}

                                                            {record.txHash && (
                                                                <div>
                                                                    <div className="text-xs font-semibold text-muted-foreground mb-2">Transaction Hash</div>
                                                                    <div className="text-xs font-mono bg-secondary/50 p-3 rounded border border-border/50 break-all">
                                                                        {record.txHash}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {record.ipfsHash && (
                                                                <div>
                                                                    <div className="text-xs font-semibold text-muted-foreground mb-2">IPFS Hash</div>
                                                                    <div className="text-xs font-mono bg-secondary/50 p-3 rounded border border-border/50 break-all">
                                                                        {record.ipfsHash}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
