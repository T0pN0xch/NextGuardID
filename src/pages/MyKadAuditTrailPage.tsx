import { useState } from 'react';
import {
    Building2,
    CheckCircle2,
    XCircle,
    Clock,
    Lock,
    Shield,
    TrendingUp,
    AlertTriangle,
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
import { MyKadAuditEvent } from '@/types/identity';
import { mockMyKadAuditEvents } from '@/data/mockData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const getActionLabel = (action: string): string => {
    const labels: Record<string, string> = {
        'registration': 'Patient Registration',
        'record_access': 'Medical Records Access',
        'verification': 'Identity Verification',
        'consent_approval': 'Consent Approval',
        'emergency_access': 'Emergency Access',
    };
    return labels[action] || action;
};

const getActionIcon = (action: string) => {
    switch (action) {
        case 'registration':
            return <Shield className="w-4 h-4" />;
        case 'record_access':
            return <Lock className="w-4 h-4" />;
        case 'verification':
            return <TrendingUp className="w-4 h-4" />;
        case 'consent_approval':
            return <CheckCircle2 className="w-4 h-4" />;
        case 'emergency_access':
            return <AlertTriangle className="w-4 h-4" />;
        default:
            return <Shield className="w-4 h-4" />;
    }
};

const getActionBadgeColor = (action: string): string => {
    const colors: Record<string, string> = {
        'registration': 'bg-blue-100 text-blue-800 border-blue-300',
        'record_access': 'bg-purple-100 text-purple-800 border-purple-300',
        'verification': 'bg-cyan-100 text-cyan-800 border-cyan-300',
        'consent_approval': 'bg-emerald-100 text-emerald-800 border-emerald-300',
        'emergency_access': 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[action] || 'bg-gray-100 text-gray-800 border-gray-300';
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
    event: MyKadAuditEvent;
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
                    <DialogTitle>Blockchain Verification Details</DialogTitle>
                    <DialogDescription>
                        Complete audit trail and cryptographic proof for this MyKad usage event
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Header */}
                    <div className="border-b pb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Lock className="w-5 h-5 text-emerald-600" />
                            <h3 className="font-semibold">Blockchain-Verified Event</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            This event is recorded on a distributed ledger and cannot be modified or deleted.
                        </p>
                    </div>

                    {/* Event Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Institution</p>
                            <p className="font-semibold">{event.institution.name}</p>
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
                            <Badge className={cn("w-fit", getStatusColor(event.status))}>
                                {getStatusLabel(event.status)}
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

                        <div className="bg-slate-50 p-4 rounded-lg font-mono text-xs space-y-3">
                            <div>
                                <p className="text-muted-foreground mb-1">Transaction Hash:</p>
                                <p className="break-all text-blue-600 select-all">{event.blockchainHash}</p>
                            </div>
                            <hr />
                            <div>
                                <p className="text-muted-foreground mb-1">Block Number:</p>
                                <p className="text-slate-900">{event.blockNumber.toLocaleString()}</p>
                            </div>
                            <hr />
                            <div>
                                <p className="text-muted-foreground mb-1">Verification Status:</p>
                                <p className={cn(
                                    "font-semibold",
                                    event.verified ? "text-emerald-600" : "text-amber-600"
                                )}>
                                    {event.verified ? '✓ Verified' : '⏳ Pending'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Assurance */}
                    <Alert className="border-blue-200 bg-blue-50">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-900 font-semibold">Privacy Assurance</AlertTitle>
                        <AlertDescription className="text-blue-800 text-sm mt-1">
                            Only this access event is recorded on the blockchain. No personal data, medical records, or health information is stored on the ledger. This ensures your health data remains private while creating an immutable audit trail for accountability.
                        </AlertDescription>
                    </Alert>

                    {/* Copy Buttons */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(event.blockchainHash)}
                            className="flex-1"
                        >
                            Copy Transaction Hash
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(`Block: ${event.blockNumber}`)}
                            className="flex-1"
                        >
                            Copy Block Number
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function MyKadAuditTrailPage() {
    const [events] = useState<MyKadAuditEvent[]>(mockMyKadAuditEvents);
    const approvedCount = events.filter(e => e.status === 'approved').length;
    const deniedCount = events.filter(e => e.status === 'denied').length;
    const emergencyCount = events.filter(e => e.status === 'emergency_used').length;

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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="glass-elevated border-border/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Approved
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{approvedCount}</p>
                        <p className="text-xs text-muted-foreground mt-1">Successful accesses</p>
                    </CardContent>
                </Card>

                <Card className="glass-elevated border-border/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-600" />
                            Denied
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{deniedCount}</p>
                        <p className="text-xs text-muted-foreground mt-1">Blocked requests</p>
                    </CardContent>
                </Card>

                <Card className="glass-elevated border-border/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            Emergency Access
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{emergencyCount}</p>
                        <p className="text-xs text-muted-foreground mt-1">Critical usage</p>
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
                        <p className="text-3xl font-bold">{events.length}</p>
                        <p className="text-xs text-muted-foreground mt-1">All blockchain-recorded</p>
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
                    <CardDescription>
                        Complete history of MyKad usage requests and approvals, sorted by date (newest first)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b border-border/50">
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Institution</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Purpose</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Proof</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.map((event) => (
                                    <TableRow key={event.id} className="hover:bg-slate-50 border-b border-border/30">
                                        {/* Timestamp */}
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {format(event.timestamp, 'MMM dd HH:mm')}
                                        </TableCell>

                                        {/* Institution */}
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                <div>
                                                    <p className="font-medium text-sm">{event.institution.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {event.institution.type.charAt(0).toUpperCase() + event.institution.type.slice(1)}
                                                    </p>
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

                                        {/* Purpose */}
                                        <TableCell className="text-sm max-w-xs truncate" title={event.purpose}>
                                            {event.purpose}
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <Badge className={cn("text-xs gap-1 flex items-center w-fit", getStatusColor(event.status))}>
                                                {getStatusIcon(event.status)}
                                                {getStatusLabel(event.status)}
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
                                <p className="text-muted-foreground">Once recorded, audit entries cannot be modified or deleted</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                            <div>
                                <p className="font-medium">Transparent Access</p>
                                <p className="text-muted-foreground">You see exactly when your MyKad identity is used</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                            <div>
                                <p className="font-medium">Fraud Detection</p>
                                <p className="text-muted-foreground">Identify suspicious or unauthorized usage attempts</p>
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
                                <p className="text-muted-foreground">Medical records stay private; only access events are recorded</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</div>
                            <div>
                                <p className="font-medium">You Control Access</p>
                                <p className="text-muted-foreground">Approve or deny each MyKad usage request in real-time</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</div>
                            <div>
                                <p className="font-medium">Encrypted Communications</p>
                                <p className="text-muted-foreground">All requests and responses are encrypted end-to-end</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
