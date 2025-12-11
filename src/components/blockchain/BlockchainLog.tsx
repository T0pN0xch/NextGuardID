import { BlockchainRecord } from '@/types/identity';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Box, 
  CheckCircle2, 
  ExternalLink, 
  Copy,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface BlockchainLogProps {
  records: BlockchainRecord[];
}

const statusStyles = {
  granted: 'bg-success/20 text-success',
  revoked: 'bg-destructive/20 text-destructive',
  expired: 'bg-muted text-muted-foreground',
};

export function BlockchainLog({ records }: BlockchainLogProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Transaction hash has been copied.",
    });
  };

  return (
    <div className="space-y-4">
      {records.map((record, index) => (
        <div
          key={record.id}
          className="glass-elevated rounded-xl p-5 animate-slide-up hover:scale-[1.01] transition-transform"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
                <Box className="w-6 h-6 text-primary" />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{record.platform}</h3>
                  {record.verified && (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{record.action}</p>
                
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(record.timestamp, 'MMM d, yyyy HH:mm')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Box className="w-3 h-3" />
                    Block #{record.blockNumber.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            <Badge className={cn("border-0", statusStyles[record.consentStatus])}>
              {record.consentStatus.charAt(0).toUpperCase() + record.consentStatus.slice(1)}
            </Badge>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">Transaction Hash</p>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono text-primary bg-primary/10 px-3 py-2 rounded-lg flex-1 truncate">
                {record.transactionHash}
              </code>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => copyToClipboard(record.transactionHash)}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => window.open(`https://etherscan.io/tx/${record.transactionHash}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Verification:</span>
            <div className="flex items-center gap-1 text-xs text-success">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified on blockchain</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
