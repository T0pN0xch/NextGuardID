import { ConsentRecord } from '@/types/identity';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Link2,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';

interface ConsentCardProps {
  consent: ConsentRecord;
  onRevoke: (id: string) => void;
  onDelete: (id: string) => void;
  onViewBlockchain: (hash: string) => void;
}

const statusStyles = {
  granted: { bg: 'bg-success/10 border-success/30', text: 'text-success', icon: CheckCircle },
  revoked: { bg: 'bg-destructive/10 border-destructive/30', text: 'text-destructive', icon: XCircle },
  expired: { bg: 'bg-muted border-border', text: 'text-muted-foreground', icon: Ban },
};

export function ConsentCard({ consent, onRevoke, onDelete, onViewBlockchain }: ConsentCardProps) {
  const status = statusStyles[consent.status];
  const StatusIcon = status.icon;

  return (
    <div
      className={cn(
        "glass-elevated rounded-xl p-5 border transition-all duration-300 hover:shadow-lg animate-slide-up",
        status.bg
      )}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">{consent.serviceIcon}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground text-lg">{consent.serviceName}</h3>
              <Badge className={cn(status.bg, status.text, "border-0 mt-1")}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {consent.status.charAt(0).toUpperCase() + consent.status.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Consent given: {format(consent.consentDate, 'MMM d, yyyy')}</span>
            </div>
            {consent.expiryDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Expires: {format(consent.expiryDate, 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>

          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">Data shared:</p>
            <div className="flex flex-wrap gap-1">
              {consent.dataTypes.map((data) => (
                <span
                  key={data}
                  className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                >
                  {data}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">🔗 Blockchain:</p>
              <button
                onClick={() => onViewBlockchain(consent.blockchainHash)}
                className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors group w-full"
              >
                <Link2 className="w-3 h-3 flex-shrink-0" />
                <span className="font-mono truncate">{consent.blockchainHash?.slice(0, 20)}...</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </button>
            </div>
            {consent.ipfsHash && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">📦 IPFS:</p>
                <button
                  onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${consent.ipfsHash}`, '_blank')}
                  className="flex items-center gap-2 text-xs text-amber-600 hover:text-amber-700 transition-colors group w-full"
                >
                  <span className="font-mono truncate">{consent.ipfsHash?.slice(0, 20)}...</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </button>
              </div>
            )}
          </div>

          {consent.status === 'granted' && (
            <div className="flex gap-2 mt-4">
              {consent.canRevoke && (
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => onRevoke(consent.id)}
                  className="flex-1"
                >
                  <Ban className="w-4 h-4 mr-1" />
                  Revoke Access
                </Button>
              )}
              {consent.canDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(consent.id)}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Request Deletion
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
