import { useState, useEffect } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Shield,
    MapPin,
    Clock,
    Building2,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Loader2,
} from 'lucide-react';
import { MyKadUsageConfirmationRequest } from '@/types/identity';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MyKadUsageConfirmationProps {
    isOpen: boolean;
    request: MyKadUsageConfirmationRequest | null;
    onApprove: (requestId: string) => void;
    onDeny: (requestId: string) => void;
    isLoading?: boolean;
}

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

const getActionColor = (action: string): string => {
    const colors: Record<string, string> = {
        'registration': 'bg-blue-100 text-blue-800 border-blue-300',
        'record_access': 'bg-purple-100 text-purple-800 border-purple-300',
        'verification': 'bg-cyan-100 text-cyan-800 border-cyan-300',
        'consent_approval': 'bg-emerald-100 text-emerald-800 border-emerald-300',
        'emergency_access': 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[action] || 'bg-gray-100 text-gray-800 border-gray-300';
};

export function MyKadUsageConfirmation({
    isOpen,
    request,
    onApprove,
    onDeny,
    isLoading = false,
}: MyKadUsageConfirmationProps) {
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const isEmergency = request?.action === 'emergency_access';

    useEffect(() => {
        if (!isOpen || !request) {
            setTimeRemaining(0);
            return;
        }

        setTimeRemaining(request.expiresIn);
        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen, request]);

    if (!request) return null;

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent className={cn(
                "max-w-2xl border-2 shadow-2xl",
                isEmergency ? "border-red-500" : "border-primary/30"
            )}>
                {/* Emergency Badge */}
                {isEmergency && (
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                        <Badge variant="destructive" className="animate-pulse text-xs px-3 py-1">
                            🚨 EMERGENCY ACCESS
                        </Badge>
                    </div>
                )}

                <AlertDialogHeader className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className={cn(
                            "p-3 rounded-lg",
                            isEmergency ? "bg-red-100" : "bg-primary/10"
                        )}>
                            <Shield className={cn(
                                "w-6 h-6",
                                isEmergency ? "text-red-600" : "text-primary"
                            )} />
                        </div>
                        <div className="flex-1">
                            <AlertDialogTitle className="text-xl">
                                MyKad Usage Request
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-xs mt-1">
                                Your MyKad identity is being requested by a healthcare provider
                            </AlertDialogDescription>
                        </div>
                    </div>
                </AlertDialogHeader>

                {/* Main Content */}
                <div className="space-y-4 py-4">
                    {/* Warning Alert */}
                    {isEmergency && (
                        <Alert className="border-red-300 bg-red-50">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800 text-sm">
                                This is an <strong>emergency access request</strong>. The institution is requesting immediate access for critical treatment. Your approval will be recorded on the blockchain.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Institution Information */}
                    <Card className="border-border/50 bg-slate-50">
                        <CardContent className="pt-6 space-y-4">
                            {/* Institution Name */}
                            <div className="flex items-start gap-3">
                                <Building2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Institution</p>
                                    <p className="font-semibold text-base">{request.institution.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {request.institution.type.charAt(0).toUpperCase() + request.institution.type.slice(1)} • {request.institution.location}
                                    </p>
                                </div>
                            </div>

                            <hr className="border-border/30" />

                            {/* Action Type */}
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Action Type</p>
                                    <div className="mt-2">
                                        <Badge className={cn("text-xs", getActionColor(request.action))}>
                                            {getActionLabel(request.action)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-border/30" />

                            {/* Purpose */}
                            <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Purpose of Use</p>
                                    <p className="text-sm font-medium mt-1">{request.purpose}</p>
                                </div>
                            </div>

                            <hr className="border-border/30" />

                            {/* Date & Time */}
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Requested At</p>
                                    <p className="text-sm font-medium mt-1">
                                        {format(request.timestamp, 'MMM dd, yyyy • HH:mm:ss')}
                                    </p>
                                </div>
                            </div>

                            <hr className="border-border/30" />

                            {/* Location */}
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                                    <p className="text-sm font-medium mt-1">{request.location}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy Notice */}
                    <Alert className="border-blue-200 bg-blue-50">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-900 text-xs">
                            <strong>Privacy Notice:</strong> Your MyKad identity will be shared. No sensitive medical data is stored on the blockchain, only this access event and consent record.
                        </AlertDescription>
                    </Alert>

                    {/* Timer */}
                    <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-900">Expires in:</span>
                        </div>
                        <span className={cn(
                            "text-lg font-bold",
                            timeRemaining < 10 ? "text-red-600 animate-pulse" : "text-amber-700"
                        )}>
                            {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <AlertDialogFooter className="gap-3 mt-2">
                    <AlertDialogCancel
                        onClick={() => onDeny(request.id)}
                        disabled={isLoading}
                        className="border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <XCircle className="w-4 h-4 mr-2" />
                        Deny Request
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => onApprove(request.id)}
                        disabled={isLoading}
                        className={cn(
                            "gap-2",
                            isEmergency
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        )}
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        <CheckCircle2 className="w-4 h-4" />
                        Approve & Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
