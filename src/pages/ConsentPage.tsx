import { useState, useEffect } from 'react';
import { ConsentCard } from '@/components/consent/ConsentCard';
import { mockConsentRecords, mockApprovalRequests } from '@/data/mockData';
import { ConsentRecord, ConsentStatus } from '@/types/identity';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FileKey, Clock, AlertCircle } from 'lucide-react';
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

interface ApprovalRequest {
  id: string;
  serviceName: string;
  serviceIcon: string;
  purpose: string;
  dataTypes: string[];
  requestedAt: Date;
  expiresIn: number;
  location: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export default function ConsentPage({ userIc }: ConsentPageProps) {
  const [consents, setConsents] = useState<ConsentRecord[]>(mockConsentRecords);
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(mockApprovalRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ConsentStatus | 'all'>('all');
  const [approvalDialog, setApprovalDialog] = useState<{
    type: 'approve' | 'reject' | null;
    requestId: string | null;
    serviceName: string;
  }>({ type: null, requestId: null, serviceName: '' });
  const [previewDialog, setPreviewDialog] = useState<{
    open: boolean;
    requestId: string | null;
  }>({ open: false, requestId: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionDialog, setActionDialog] = useState<{
    type: 'revoke' | 'delete' | null;
    consentId: string | null;
    serviceName: string;
  }>({ type: null, consentId: null, serviceName: '' });

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setApprovalRequests(prev =>
        prev.map(req => ({
          ...req,
          expiresIn: Math.max(0, req.expiresIn - 1)
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Sort requests: active first, then expired
  const sortedApprovalRequests = [...approvalRequests].sort((a, b) => {
    if ((a.expiresIn > 0) !== (b.expiresIn > 0)) {
      return a.expiresIn > 0 ? -1 : 1;
    }
    return b.expiresIn - a.expiresIn;
  });

  const filteredConsents = consents.filter((consent) => {
    const matchesSearch = consent.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || consent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (requestId: string) => {
    const request = approvalRequests.find(r => r.id === requestId);
    if (request) {
      setPreviewDialog({ open: true, requestId });
    }
  };

  const handleReject = (requestId: string) => {
    const request = approvalRequests.find(r => r.id === requestId);
    if (request) {
      setApprovalDialog({ type: 'reject', requestId, serviceName: request.serviceName });
    }
  };

  const confirmApproval = async () => {
    if (approvalDialog.type === 'approve' && approvalDialog.requestId) {
      setIsProcessing(true);
      try {
        const request = approvalRequests.find(r => r.id === approvalDialog.requestId);
        if (!request) return;

        // Ensure wallet connected
        if (!blockchainService.signer) {
          await blockchainService.connectWallet();
        }

        const metadata = {
          requestId: approvalDialog.requestId,
          serviceName: request.serviceName,
          action: 'CONSENT_GRANTED',
          purpose: request.purpose,
          dataTypes: request.dataTypes,
          location: request.location,
          timestamp: new Date().toISOString(),
          userApproval: 'given'
        };

        const subjectId = userIc || 'demo-user';
        const tx = await blockchainService.logConsentWithIPFS(
          subjectId,
          request.serviceName,
          'CONSENT_GRANTED',
          metadata
        );

        // Add to consents and remove from approvals
        const newConsent: ConsentRecord = {
          id: `c${Date.now()}`,
          serviceName: request.serviceName,
          serviceIcon: request.serviceIcon,
          consentDate: new Date(),
          status: 'granted',
          dataTypes: request.dataTypes,
          blockchainHash: tx.hash,
          ipfsHash: tx.ipfsHash,
          canRevoke: true,
          canDelete: true,
        };

        setConsents(prev => [...prev, newConsent]);
        setApprovalRequests(prev => prev.filter(r => r.id !== approvalDialog.requestId));

        toast({
          title: "Approval Granted ✅",
          description: `You have approved ${request.serviceName} to access your data. Tx: ${tx.hash?.slice(0, 20)}...`,
        });
      } catch (err) {
        console.error('Approval failed:', err);
        toast({
          title: "Approval Failed",
          description: "Failed to record approval on blockchain. Please try again.",
          variant: 'destructive'
        });
      } finally {
        setIsProcessing(false);
        setApprovalDialog({ type: null, requestId: null, serviceName: '' });
      }
    } else if (approvalDialog.type === 'reject' && approvalDialog.requestId) {
      setIsProcessing(true);
      try {
        const request = approvalRequests.find(r => r.id === approvalDialog.requestId);
        if (!request) return;

        const metadata = {
          requestId: approvalDialog.requestId,
          serviceName: request.serviceName,
          action: 'CONSENT_REJECTED',
          purpose: request.purpose,
          timestamp: new Date().toISOString(),
          userApproval: 'rejected'
        };

        const subjectId = userIc || 'demo-user';
        const tx = await blockchainService.logConsentWithIPFS(
          subjectId,
          request.serviceName,
          'CONSENT_REVOKED',
          metadata
        );

        setApprovalRequests(prev => prev.filter(r => r.id !== approvalDialog.requestId));

        toast({
          title: "Request Rejected ❌",
          description: `You have rejected the approval request from ${request.serviceName}. Tx: ${tx.hash?.slice(0, 20)}...`,
        });
      } catch (err) {
        console.error('Rejection failed:', err);
        setApprovalRequests(prev => prev.filter(r => r.id !== approvalDialog.requestId));
        toast({
          title: "Request Rejected ❌",
          description: `You have rejected the approval request from ${approvalDialog.serviceName}.`,
        });
      } finally {
        setIsProcessing(false);
        setApprovalDialog({ type: null, requestId: null, serviceName: '' });
      }
    }
  };

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
        setIsProcessing(true);
        try {
          // Ensure wallet connected
          if (!blockchainService.signer) {
            await blockchainService.connectWallet();
          }

          const metadata = {
            serviceName: actionDialog.serviceName,
            action: 'CONSENT_REVOKED',
            timestamp: new Date().toISOString(),
            dataTypes: consent?.dataTypes || [],
            previousBlockchainHash: consent?.blockchainHash
          };

          const subjectId = userIc || 'demo-user';
          const tx = await blockchainService.logConsentWithIPFS(
            subjectId,
            actionDialog.serviceName,
            'CONSENT_REVOKED',
            metadata
          );

          setConsents(prev => prev.map(c =>
            c.id === actionDialog.consentId
              ? { ...c, status: 'revoked' as ConsentStatus, canRevoke: false, canDelete: false, blockchainHash: tx.hash, ipfsHash: tx.ipfsHash }
              : c
          ));

          toast({
            title: "Access Revoked ✅",
            description: `${actionDialog.serviceName} no longer has access to your data. Tx: ${tx.hash?.slice(0, 20)}...`,
          });
        } catch (err) {
          console.error('Blockchain revoke failed', err);
          toast({
            title: "Revoke Failed",
            description: "Failed to record revocation on blockchain. Please try again.",
            variant: 'destructive'
          });
        } finally {
          setIsProcessing(false);
        }
      } else if (actionDialog.type === 'delete' && actionDialog.consentId) {
        setIsProcessing(true);
        try {
          const consent = consents.find(c => c.id === actionDialog.consentId);
          if (!consent) return;

          // Ensure wallet connected
          if (!blockchainService.signer) {
            await blockchainService.connectWallet();
          }

          const metadata = {
            serviceName: actionDialog.serviceName,
            action: 'DATA_DELETION_REQUESTED',
            timestamp: new Date().toISOString(),
            dataTypes: consent.dataTypes || []
          };

          const subjectId = userIc || 'demo-user';
          const tx = await blockchainService.logConsentWithIPFS(
            subjectId,
            actionDialog.serviceName,
            'DATA_DELETION_REQUESTED',
            metadata
          );

          setConsents(prev => prev.map(c =>
            c.id === actionDialog.consentId
              ? { ...c, status: 'deleted' as ConsentStatus, canRevoke: false, canDelete: false, blockchainHash: tx.hash, ipfsHash: tx.ipfsHash }
              : c
          ));

          toast({
            title: "Deletion Request Submitted ✅",
            description: `A request to delete your data from ${actionDialog.serviceName} has been recorded on blockchain. Tx: ${tx.hash?.slice(0, 20)}...`,
          });
        } catch (err) {
          console.error('Data deletion failed', err);
          toast({
            title: "Deletion Request Failed",
            description: "Failed to record deletion request on blockchain. Please try again.",
            variant: 'destructive'
          });
        } finally {
          setIsProcessing(false);
        }
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
    <div className="space-y-6 p-4 md:p-6 h-full overflow-auto">
      <div className="mb-2">
        <h1 className="text-3xl font-bold">Consent Management</h1>
        <p className="text-sm text-muted-foreground mt-2">Control your data sharing permissions across all platforms</p>
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
        <div className="glass-elevated rounded-xl p-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{approvalRequests.length}</p>
              <p className="text-sm text-muted-foreground">Pending Approvals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals Section */}
      {sortedApprovalRequests.length > 0 && (
        <div className="glass-elevated rounded-xl p-6 border-amber-500/30 border-2">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold">⏳ Pending Approvals ({sortedApprovalRequests.filter(r => r.expiresIn > 0).length} Active)</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sortedApprovalRequests.map((request, index) => (
              <div key={request.id} className={`glass-elevated border rounded-lg p-4 animate-slide-up ${request.expiresIn > 0 ? 'border-amber-500/30' : 'border-red-500/30 opacity-75'}`} style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{request.serviceIcon}</span>
                    <div>
                      <p className="font-semibold text-sm">{request.serviceName}</p>
                      <p className="text-xs text-muted-foreground">{request.purpose}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${request.riskLevel === 'high' ? 'bg-red-500/20 text-red-700' :
                    request.riskLevel === 'medium' ? 'bg-amber-500/20 text-amber-700' :
                      'bg-green-500/20 text-green-700'
                    }`}>
                    {request.riskLevel.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <p className="text-muted-foreground"><strong>Location:</strong> {request.location}</p>
                  <p className="text-muted-foreground"><strong>Data Requested:</strong> {request.dataTypes.join(', ')}</p>
                  <p className={`text-xs font-medium ${request.expiresIn <= 0 ? 'text-red-600' : request.expiresIn <= 30 ? 'text-amber-600' : 'text-green-600'}`}>
                    ⏱️ {request.expiresIn > 0 ? `Expires in ${request.expiresIn}s` : 'EXPIRED'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(request.id)}
                    disabled={isProcessing || request.expiresIn <= 0}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    ✅ Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(request.id)}
                    disabled={isProcessing}
                    variant="destructive"
                    className="flex-1"
                    size="sm"
                  >
                    ❌ Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* Active Consents Section */}
      <div>
        <h2 className="text-lg font-bold mb-4">Active Consents</h2>
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

      {/* Approval Confirmation Dialog */}
      <AlertDialog
        open={approvalDialog.type !== null}
        onOpenChange={() => setApprovalDialog({ type: null, requestId: null, serviceName: '' })}
      >
        <AlertDialogContent className="glass-elevated border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {approvalDialog.type === 'approve' ? '✅ Approve Access Request' : '❌ Reject Access Request'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {approvalDialog.type === 'approve'
                ? `Are you sure you want to approve ${approvalDialog.serviceName}'s request to access your personal data? This will be recorded on the blockchain.`
                : `Are you sure you want to reject the request from ${approvalDialog.serviceName}? This action will also be recorded on the blockchain.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmApproval}
              disabled={isProcessing}
              className={approvalDialog.type === 'reject' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              {isProcessing ? '⏳ Processing...' : (approvalDialog.type === 'approve' ? '✅ Approve' : '❌ Reject')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Dialog */}
      {previewDialog.requestId && (
        <AlertDialog
          open={previewDialog.open}
          onOpenChange={(open) => setPreviewDialog({ open, requestId: previewDialog.requestId })}
        >
          <AlertDialogContent className="glass-elevated border-border/50 max-h-[90vh] overflow-y-auto">
            {(() => {
              const request = approvalRequests.find(r => r.id === previewDialog.requestId);
              if (!request) return null;

              return (
                <>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-xl">
                      <span className="text-3xl">{request.serviceIcon}</span>
                      Review Access Request
                    </AlertDialogTitle>
                  </AlertDialogHeader>

                  <div className="space-y-4 py-4">
                    {/* Service Info */}
                    <div className="glass-elevated p-4 rounded-lg border border-border/50">
                      <h3 className="font-semibold text-lg mb-2">{request.serviceName}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{request.purpose}</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.riskLevel === 'high' ? 'bg-red-500/20 text-red-700' :
                          request.riskLevel === 'medium' ? 'bg-amber-500/20 text-amber-700' :
                            'bg-green-500/20 text-green-700'
                          }`}>
                          {request.riskLevel === 'high' && '⚠️ HIGH RISK'}
                          {request.riskLevel === 'medium' && '⚡ MEDIUM RISK'}
                          {request.riskLevel === 'low' && '✅ LOW RISK'}
                        </span>
                        <span className={`text-xs font-medium ${request.expiresIn <= 0 ? 'text-red-600' : request.expiresIn <= 30 ? 'text-amber-600' : 'text-green-600'}`}>
                          ⏱️ {request.expiresIn > 0 ? `${request.expiresIn}s remaining` : 'EXPIRED'}
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="glass-elevated p-4 rounded-lg border border-border/50">
                      <p className="text-sm font-semibold mb-2">📍 Request Location</p>
                      <p className="text-sm text-muted-foreground">{request.location}</p>
                    </div>

                    {/* Data Requested */}
                    <div className="glass-elevated p-4 rounded-lg border border-border/50">
                      <p className="text-sm font-semibold mb-3">📋 Data Requested</p>
                      <div className="space-y-2">
                        {request.dataTypes.map((dataType, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            {dataType}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Request Time */}
                    <div className="glass-elevated p-4 rounded-lg border border-border/50">
                      <p className="text-sm font-semibold mb-2">🕐 Request Details</p>
                      <p className="text-xs text-muted-foreground">
                        Requested: {new Date(request.requestedAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Warning for High Risk */}
                    {request.riskLevel === 'high' && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <p className="text-sm font-semibold text-red-700 mb-1">⚠️ High Risk Warning</p>
                        <p className="text-xs text-red-600">This service has been marked as high-risk. Please review the data carefully before approving.</p>
                      </div>
                    )}

                    {/* Warning for Medium Risk */}
                    {request.riskLevel === 'medium' && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                        <p className="text-sm font-semibold text-amber-700 mb-1">⚡ Medium Risk</p>
                        <p className="text-xs text-amber-600">Please review the requested data carefully before proceeding.</p>
                      </div>
                    )}
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        setPreviewDialog({ open: false, requestId: null });
                        setApprovalDialog({ type: 'approve', requestId: request.id, serviceName: request.serviceName });
                      }}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      ✅ Approve Access
                    </AlertDialogAction>
                    <AlertDialogAction
                      onClick={() => {
                        setPreviewDialog({ open: false, requestId: null });
                        handleReject(request.id);
                      }}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      ❌ Reject Request
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </>
              );
            })()}
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}


