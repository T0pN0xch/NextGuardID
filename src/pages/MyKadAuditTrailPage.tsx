import { useState, useEffect } from 'react';
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
    Zap,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { useBlockchainEvents } from '@/hooks/useBlockchainEvents';
import blockchainService from '@/utils/blockchain';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const getActionLabel = (action: string): string => {
    const labels: Record<string, string> = {
        'IDENTITY_USED': 'Identity Usage',
        'CONSENT_GRANTED': 'Consent Granted',
        'CONSENT_REVOKED': 'Consent Revoked',
        'registration': 'Patient Registration',
        'record_access': 'Medical Records Access',
        'verification': 'Identity Verification',
        'consent_approval': 'Consent Approval',
        'emergency_access': 'Emergency Access',
    };
    return labels[action] || action;
};

const getActionIcon = (action: string) => {
    switch (action.toUpperCase()) {
        case 'IDENTITY_USED':
        case 'registration':
            return <Shield className="w-4 h-4" />;
        case 'CONSENT_GRANTED':
        case 'consent_approval':
            return <CheckCircle2 className="w-4 h-4" />;
        case 'CONSENT_REVOKED':
            return <XCircle className="w-4 h-4" />;
        case 'record_access':
            return <Lock className="w-4 h-4" />;
        case 'verification':
            return <TrendingUp className="w-4 h-4" />;
        case 'emergency_access':
            return <AlertTriangle className="w-4 h-4" />;
        default:
            return <Shield className="w-4 h-4" />;
    }
};

const getActionBadgeColor = (action: string): string => {
    const actionUpper = action.toUpperCase();
    const colors: Record<string, string> = {
        'IDENTITY_USED': 'bg-blue-100 text-blue-800 border-blue-300',
        'CONSENT_GRANTED': 'bg-emerald-100 text-emerald-800 border-emerald-300',
        'CONSENT_REVOKED': 'bg-red-100 text-red-800 border-red-300',
        'registration': 'bg-blue-100 text-blue-800 border-blue-300',
        'record_access': 'bg-purple-100 text-purple-800 border-purple-300',
        'verification': 'bg-cyan-100 text-cyan-800 border-cyan-300',
        'consent_approval': 'bg-emerald-100 text-emerald-800 border-emerald-300',
        'emergency_access': 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[actionUpper] || colors[action] || 'bg-gray-100 text-gray-800 border-gray-300';
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'approved':
            return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
        case 'denied':
            return <XCircle className="w-4 h-4 text-red-600" />;
        case 'pending':
            return <Clock className="w-4 h-4 text-amber-600" />;
        case 'emergency_used':
            return <AlertTriangle className="w-4 h-4 text-red-600" />;
        default:
            return <Shield className="w-4 h-4" />;
    }
};

const getStatusColor = (status: string): string => {
    switch (status) {
        case 'approved':
            return 'bg-emerald-100 text-emerald-800 border-emerald-300';
        case 'denied':
            return 'bg-red-100 text-red-800 border-red-300';
        case 'pending':
            return 'bg-amber-100 text-amber-800 border-amber-300';
        case 'emergency_used':
            return 'bg-red-100 text-red-800 border-red-300';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-300';
    }
};

const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
        'approved': 'Approved',
        'denied': 'Denied',
        'pending': 'Pending',
        'emergency_used': 'Emergency Used',
    };
    return labels[status] || status;
};

interface AuditDetailsProps {
    event: any;
}

function AuditDetailsDialog({ event }: AuditDetailsProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                    View Proof
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>🔐 Blockchain Verification Details</DialogTitle>
                    <DialogDescription>
                        Complete immutable proof recorded on Polygon Amoy testnet
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Header */}
                    <div className="border-b pb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <h3 className="font-semibold">Blockchain-Verified Event</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            This event is permanently recorded on the distributed blockchain and cannot be modified or deleted.
                        </p>
                    </div>

                    {/* Event Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Institution</p>
                            <p className="font-semibold">{event.institution || 'Unknown'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Action Type</p>
                            <p className="font-semibold">{getActionLabel(event.action)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Timestamp</p>
                            <p className="font-semibold">{format(event.timestamp, 'MMM dd, yyyy HH:mm:ss')}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                            <Badge className="w-fit bg-emerald-100 text-emerald-800 border-emerald-300">
                                ✓ Verified
                            </Badge>
                        </div>
                    </div>

                    <hr />

                    {/* Blockchain Details */}
                    <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Blockchain Details
                        </h4>

                        <div className="bg-slate-50 p-4 rounded-lg space-y-3 text-xs">
                            <div>
                                <p className="text-muted-foreground mb-1 font-semibold">Transaction Hash:</p>
                                <p className="break-all text-blue-600 select-all font-mono text-xs">{event.transactionHash}</p>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="mt-2 p-0 h-auto text-blue-600 flex items-center gap-1"
                                    onClick={() => window.open(event.etherscanUrl, '_blank')}
                                >
                                    View on Polygonscan <ExternalLink className="w-3 h-3" />
                                </Button>
                            </div>
                            <hr />
                            <div>
                                <p className="text-muted-foreground mb-1 font-semibold">Block Number:</p>
                                <p className="text-slate-900 font-mono">{event.blockNumber?.toLocaleString() || 'N/A'}</p>
                            </div>
                            {event.ipfsHash && (
                                <>
                                    <hr />
                                    <div>
                                        <p className="text-muted-foreground mb-1 font-semibold">IPFS Hash (Metadata):</p>
                                        <p className="break-all text-purple-600 select-all font-mono text-xs">{event.ipfsHash}</p>
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="mt-2 p-0 h-auto text-purple-600 flex items-center gap-1"
                                            onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${event.ipfsHash}`, '_blank')}
                                        >
                                            View on IPFS <ExternalLink className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </>
                            )}
                            <hr />
                            <div>
                                <p className="text-muted-foreground mb-1 font-semibold">Verification Status:</p>
                                <p className="text-emerald-600 font-semibold">✓ Verified on Polygon Amoy</p>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Assurance */}
                    <Alert className="border-blue-200 bg-blue-50">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-900 font-semibold">Privacy Assurance</AlertTitle>
                        <AlertDescription className="text-blue-800 text-sm mt-1">
                            Only this usage event is recorded on the blockchain. No personal data, medical records, or health information is stored on-chain. Your health data remains private while creating an immutable audit trail for accountability.
                        </AlertDescription>
                    </Alert>

                    {/* Copy Buttons */}
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(event.transactionHash)}
                            className="flex-1 min-w-[150px]"
                        >
                            Copy TX Hash
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(event.blockNumber?.toString() || '')}
                            className="flex-1 min-w-[150px]"
                        >
                            Copy Block #{event.blockNumber}
                        </Button>
                        {event.ipfsHash && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigator.clipboard.writeText(event.ipfsHash)}
                                className="flex-1 min-w-[150px]"
                            >
                                Copy IPFS Hash
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function MyKadAuditTrailPage() {
    // Use the blockchain hook to fetch real events
    const {
        events,
        loading,
        error,
        isWalletConnected,
        connectWallet,
        checkWalletStatus
    } = useBlockchainEvents('000000000000'); // Demo MyKad number

    const [isCreatingEvents, setIsCreatingEvents] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [createSuccess, setCreateSuccess] = useState(false);

    useEffect(() => {
        checkWalletStatus();
    }, [checkWalletStatus]);

    const handleCreateRealEvents = async () => {
        if (!isWalletConnected) {
            setCreateError('Wallet must be connected to create real blockchain events');
            return;
        }

        setIsCreatingEvents(true);
        setCreateError(null);
        setCreateSuccess(false);

        try {
            console.log('🚀 Creating real blockchain events...');
            const results = await blockchainService.createRealTestEvents();
            const successCount = results.filter((r: any) => r.status === 'confirmed').length;
            
            if (successCount > 0) {
                setCreateSuccess(true);
                console.log(`✅ Successfully created ${successCount} real blockchain events!`);
                // Refresh events after a delay
                setTimeout(() => {
                    checkWalletStatus();
                }, 3000);
            } else {
                setCreateError('Failed to create any blockchain events');
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error';
            setCreateError(`Error creating blockchain events: ${errorMsg}`);
            console.error('❌ Error:', err);
        } finally {
            setIsCreatingEvents(false);
        }
    };

    const approvedCount = events.filter(e => e.action === 'IDENTITY_USED').length;
    const deniedCount = events.filter(e => e.action === 'CONSENT_REVOKED').length;
    const grantedCount = events.filter(e => e.action === 'CONSENT_GRANTED').length;

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            {/* Page Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">MyKad Audit Trail</h1>
                </div>
                <p className="text-muted-foreground">
                    Complete blockchain-verified history of your MyKad identity usage in healthcare systems
                </p>
            </div>

            {/* Wallet Status Alert */}
            {!isWalletConnected && (
                <Alert className="border-amber-200 bg-amber-50">
                    <WifiOff className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-900 font-semibold">Wallet Not Connected</AlertTitle>
                    <AlertDescription className="text-amber-800 text-sm">
                        Connect your MetaMask wallet to submit new MyKad usage events to the blockchain.
                    </AlertDescription>
                    <Button
                        onClick={connectWallet}
                        size="sm"
                        className="mt-3 bg-amber-600 hover:bg-amber-700"
                    >
                        <Wifi className="w-4 h-4 mr-2" />
                        Connect Wallet
                    </Button>
                </Alert>
            )}

            {isWalletConnected && (
                <Alert className="border-emerald-200 bg-emerald-50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <AlertTitle className="text-emerald-900 font-semibold">Wallet Connected</AlertTitle>
                    <AlertDescription className="text-emerald-800 text-sm mt-1">
                        Your MetaMask wallet is connected. You can now record MyKad usage events to the blockchain.
                    </AlertDescription>
                    <Button
                        onClick={handleCreateRealEvents}
                        disabled={isCreatingEvents}
                        size="sm"
                        className="mt-3 bg-emerald-600 hover:bg-emerald-700"
                    >
                        {isCreatingEvents ? (
                            <>
                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                Creating Events...
                            </>
                        ) : (
                            <>
                                <Zap className="w-4 h-4 mr-2" />
                                Create Real Blockchain Test Events
                            </>
                        )}
                    </Button>
                </Alert>
            )}

            {/* Error Alert */}
            {error && (
                <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-900 font-semibold">Error Loading Events</AlertTitle>
                    <AlertDescription className="text-red-800 text-sm mt-1">
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {/* Create Events Error */}
            {createError && (
                <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-900 font-semibold">Error Creating Events</AlertTitle>
                    <AlertDescription className="text-red-800 text-sm mt-1">
                        {createError}
                    </AlertDescription>
                </Alert>
            )}

            {/* Create Events Success */}
            {createSuccess && (
                <Alert className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-900 font-semibold">Real Blockchain Events Created!</AlertTitle>
                    <AlertDescription className="text-green-800 text-sm mt-1">
                        Successfully created real blockchain test events. Refreshing event list...
                    </AlertDescription>
                </Alert>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="glass-elevated border-border/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Identity Usages
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? <Loader className="w-6 h-6 animate-spin" /> : <p className="text-3xl font-bold">{approvedCount}</p>}
                        <p className="text-xs text-muted-foreground mt-1">Recorded on blockchain</p>
                    </CardContent>
                </Card>

                <Card className="glass-elevated border-border/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                            Consents Granted
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? <Loader className="w-6 h-6 animate-spin" /> : <p className="text-3xl font-bold">{grantedCount}</p>}
                        <p className="text-xs text-muted-foreground mt-1">Active permissions</p>
                    </CardContent>
                </Card>

                <Card className="glass-elevated border-border/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-600" />
                            Consents Revoked
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? <Loader className="w-6 h-6 animate-spin" /> : <p className="text-3xl font-bold">{deniedCount}</p>}
                        <p className="text-xs text-muted-foreground mt-1">Withdrawn permissions</p>
                    </CardContent>
                </Card>

                <Card className="glass-elevated border-border/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Lock className="w-4 h-4 text-primary" />
                            Verified Events
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? <Loader className="w-6 h-6 animate-spin" /> : <p className="text-3xl font-bold">{events.length}</p>}
                        <p className="text-xs text-muted-foreground mt-1">On Polygon Amoy</p>
                    </CardContent>
                </Card>
            </div>

            {/* Information Alert */}
            <Alert className="border-blue-200 bg-blue-50">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900 font-semibold">Why Your Audit Trail Matters</AlertTitle>
                <AlertDescription className="text-blue-800 text-sm mt-2">
                    <ul className="list-disc list-inside space-y-1 mt-2">
                        <li><strong>Fraud Prevention:</strong> Detect unauthorized use of your MyKad identity</li>
                        <li><strong>Transparency:</strong> See exactly when and where your identity was used</li>
                        <li><strong>Accountability:</strong> Healthcare providers are accountable for accessing your data</li>
                        <li><strong>Immutable Records:</strong> Blockchain ensures records cannot be tampered with</li>
                        <li><strong>Privacy Protected:</strong> No medical data is stored on the blockchain</li>
                    </ul>
                </AlertDescription>
            </Alert>

            {/* Timeline View */}
            <Card className="glass-elevated border-border/50">
                <CardHeader>
                    <CardTitle>Chronological Event Log</CardTitle>
                    {loading ? (
                        <CardDescription>
                            <span className="flex items-center gap-2">
                                <Loader className="w-4 h-4 animate-spin" />
                                Fetching blockchain events...
                            </span>
                        </CardDescription>
                    ) : events.length === 0 ? (
                        <CardDescription>
                            No MyKad events recorded yet. MyKad usage events will appear here when recorded on blockchain.
                        </CardDescription>
                    ) : (
                        <CardDescription>
                            Complete history of MyKad usage requests and approvals ({events.length} total)
                        </CardDescription>
                    )}
                </CardHeader>
                {!loading && events.length > 0 && events[0].source === 'mock' && (
                    <CardContent>
                        <Alert className="border-blue-200 bg-blue-50 mb-4">
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                            <AlertTitle className="text-blue-900 font-semibold">Demo Events</AlertTitle>
                            <AlertDescription className="text-blue-800 text-sm mt-1">
                                These are sample blockchain events showing what real transactions will look like. Click "View Proof" to see how events are verified on Polygonscan.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                )}
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-center">
                                <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                                <p className="text-muted-foreground">Loading blockchain events from Polygon Amoy...</p>
                            </div>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-center">
                                <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-muted-foreground">No MyKad events recorded yet.</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    MyKad usage events will appear here when recorded on blockchain.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-b border-border/50">
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Institution</TableHead>
                                        <TableHead>Action</TableHead>
                                        <TableHead>Blockchain Status</TableHead>
                                        <TableHead className="text-right">Proof</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {events.map((event) => (
                                        <TableRow key={event.id} className="hover:bg-slate-50 border-b border-border/30">
                                            {/* Timestamp */}
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                {format(event.timestamp, 'MMM dd HH:mm:ss')}
                                            </TableCell>

                                            {/* Institution */}
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                    <div>
                                                        <p className="font-medium text-sm">{event.institution || 'Unknown'}</p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Action */}
                                            <TableCell>
                                                <Badge className={cn("text-xs gap-1", getActionBadgeColor(event.action))}>
                                                    {getActionIcon(event.action)}
                                                    {getActionLabel(event.action)}
                                                </Badge>
                                            </TableCell>

                                            {/* Blockchain Status */}
                                            <TableCell>
                                                <Badge className="text-xs gap-1 flex items-center w-fit bg-emerald-100 text-emerald-800 border-emerald-300">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Block #{event.blockNumber}
                                                </Badge>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="text-right">
                                                <AuditDetailsDialog event={event} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Trust & Security Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-elevated border-border/50 bg-gradient-to-br from-emerald-50 to-transparent">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            How Blockchain Protects You
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                            <div>
                                <p className="font-medium">Immutable Records</p>
                                <p className="text-muted-foreground">Once recorded on Polygon Amoy, audit entries cannot be modified</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                            <div>
                                <p className="font-medium">Transparent Access</p>
                                <p className="text-muted-foreground">You see exactly when your MyKad identity is used on-chain</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                            <div>
                                <p className="font-medium">Verifiable Proofs</p>
                                <p className="text-muted-foreground">Every event has a real transaction hash on Polygonscan</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-elevated border-border/50 bg-gradient-to-br from-blue-50 to-transparent">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-600" />
                            Your Privacy is Safe
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</div>
                            <div>
                                <p className="font-medium">No Medical Data Stored</p>
                                <p className="text-muted-foreground">Medical records stay private; only usage events recorded</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</div>
                            <div>
                                <p className="font-medium">You Control Access</p>
                                <p className="text-muted-foreground">Approve or deny MyKad usage in real-time via MetaMask</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</div>
                            <div>
                                <p className="font-medium">Encrypted Communications</p>
                                <p className="text-muted-foreground">All requests and IPFS metadata are encrypted end-to-end</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
