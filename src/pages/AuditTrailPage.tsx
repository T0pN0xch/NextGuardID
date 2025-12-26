import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, RefreshCw, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import blockchainService from '@/lib/blockchain';

interface AuditRecord {
  type: string;
  platformId?: string;
  actionType?: string;
  timestamp: string;
  ipfsHash: string;
  metadata?: Record<string, unknown>;
  txHash: string;
  blockNumber: number;
}

export default function AuditTrailPage() {
  const [mykadNumber] = useState('123456-12-1234'); // Mock user - in real app, get from auth context
  const [auditHistory, setAuditHistory] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    identityUsed: 0,
    consentGranted: 0,
    consentRevoked: 0
  });

  const fetchAuditHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch real blockchain events from Amoy Polygon contract
      const events = await blockchainService.getAllContractEvents();

      // Map blockchain events to AuditRecord format
      const records: AuditRecord[] = events.map((evt: any) => {
        // Handle actionType safely - it might be a string or object
        let actionType = 'UNKNOWN';
        if (typeof evt.actionType === 'string') {
          actionType = evt.actionType.toUpperCase();
        } else if (evt.event) {
          actionType = evt.event.toUpperCase();
        }

        return {
          type: actionType,
          platformId: evt.platformId || 'Unknown',
          actionType: evt.actionType || 'Unknown',
          timestamp: new Date(evt.timestamp * 1000).toISOString(),
          ipfsHash: evt.ipfsHash || '',
          txHash: evt.txHash || evt.transactionHash || '',
          blockNumber: evt.blockNumber || 0
        };
      });

      setAuditHistory(records);

      // Calculate stats
      const calculatedStats = {
        total: records.length,
        identityUsed: records.filter((r) => r.type === 'IDENTITY_USED' || r.actionType === 'LOGIN').length,
        consentGranted: records.filter((r) => r.type === 'CONSENT_GRANTED').length,
        consentRevoked: records.filter((r) => r.type === 'CONSENT_REVOKED').length
      };
      setStats(calculatedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch audit history');
      console.error('Error fetching audit history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleExport = async () => {
    try {
      const dataToExport = {
        mykadNumber,
        exportDate: new Date().toISOString(),
        totalRecords: auditHistory.length,
        records: auditHistory
      };

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-trail-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export audit trail');
      console.error('Export error:', err);
    }
  };

  useEffect(() => {
    fetchAuditHistory();
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'IDENTITY_USED':
        return '🔐';
      case 'CONSENT_GRANTED':
        return '✅';
      case 'CONSENT_REVOKED':
        return '❌';
      default:
        return '📝';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'IDENTITY_USED':
        return 'bg-blue-50 border-blue-200';
      case 'CONSENT_GRANTED':
        return 'bg-green-50 border-green-200';
      case 'CONSENT_REVOKED':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'IDENTITY_USED':
        return 'default';
      case 'CONSENT_GRANTED':
        return 'secondary';
      case 'CONSENT_REVOKED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6 h-full overflow-auto">
      <div>
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-slate-900">Identity Audit Trail</h1>
          <p className="text-sm text-slate-600 mt-2">
            Complete, immutable record of your MyKad usage and consent approvals
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
                <div className="text-sm text-slate-600 mt-1">Total Events</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.identityUsed}</div>
                <div className="text-sm text-slate-600 mt-1">Identity Used</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.consentGranted}</div>
                <div className="text-sm text-slate-600 mt-1">Consent Granted</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{stats.consentRevoked}</div>
                <div className="text-sm text-slate-600 mt-1">Consent Revoked</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={fetchAuditHistory}
            disabled={loading}
            variant="outline"
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </Button>
          <Button
            onClick={handleExport}
            disabled={loading || stats.total === 0}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Export as JSON
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Audit Records */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-slate-600">Loading audit trail...</p>
              </CardContent>
            </Card>
          ) : auditHistory.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-slate-600">No audit records found</p>
              </CardContent>
            </Card>
          ) : (
            auditHistory.map((record, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all ${getEventColor(record.type)} border-l-4`}
              >
                <div
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="p-4 md:p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getEventIcon(record.type)}</span>
                        <div>
                          <Badge variant={getBadgeVariant(record.type)} className="mb-1">
                            {record.type.replace(/_/g, ' ')}
                          </Badge>
                          <p className="text-sm text-slate-600">
                            {record.platformId && `Platform: ${record.platformId}`}
                            {record.actionType && ` • Action: ${record.actionType}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 text-sm text-slate-700">
                        <p>
                          <span className="font-semibold">Timestamp:</span>{' '}
                          {new Date(record.timestamp).toLocaleString()}
                        </p>
                        <p>
                          <span className="font-semibold">Block:</span> {record.blockNumber}
                        </p>
                        <p className="break-all">
                          <span className="font-semibold">TX:</span>{' '}
                          <a
                            href={`https://amoy.polygonscan.com/tx/${record.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {record.txHash.substring(0, 10)}...
                          </a>
                        </p>
                        {record.ipfsHash && (
                          <p className="break-all">
                            <span className="font-semibold">IPFS:</span>{' '}
                            <a
                              href={`https://gateway.pinata.cloud/ipfs/${record.ipfsHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {record.ipfsHash.substring(0, 16)}...
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      {expandedIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedIndex === index && record.metadata && (
                    <div className="mt-6 pt-6 border-t border-current border-opacity-20">
                      <h4 className="font-semibold text-slate-900 mb-4">Metadata Details</h4>
                      <div className="bg-white bg-opacity-50 rounded p-4">
                        <pre className="text-xs overflow-auto max-h-64 text-slate-700">
                          {JSON.stringify(record.metadata, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Security Notice */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🔐 Blockchain-Verified Records
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2">
            <p>
              • All records are anchored on the Polygon Amoy blockchain, making them immutable and tamper-proof.
            </p>
            <p>
              • Metadata is stored on IPFS via Pinata, ensuring decentralized access and preservation.
            </p>
            <p>
              • You can independently verify any transaction using the provided blockchain explorer links.
            </p>
            <p>
              • This audit trail helps comply with BNM and PDPC regulations for identity data protection.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
