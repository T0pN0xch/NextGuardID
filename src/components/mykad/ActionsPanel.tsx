import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, 
  FileWarning, 
  Phone, 
  Link2, 
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface ActionsPanelProps {
  lostMode: boolean;
}

export function ActionsPanel({ lostMode }: ActionsPanelProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (action: string, title: string, description: string) => {
    setLoadingAction(action);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoadingAction(null);
    toast({
      title,
      description,
    });
  };

  const actions = [
    {
      id: 'download',
      icon: Download,
      label: 'Download Activity Report',
      description: 'Generate PDF report',
      onClick: () => handleAction('download', 'Report Generated', 'Your activity report has been downloaded as PDF.'),
      variant: 'outline' as const,
    },
    {
      id: 'report',
      icon: FileWarning,
      label: 'Report Lost MyKad',
      description: 'Notify JPN',
      onClick: () => handleAction('report', 'Report Submitted', 'Your lost MyKad report has been submitted to JPN.'),
      variant: lostMode ? 'destructive' as const : 'outline' as const,
    },
    {
      id: 'notify',
      icon: Phone,
      label: 'Notify Touch \'n Go',
      description: 'Contact support',
      onClick: () => handleAction('notify', 'Support Notified', 'Touch \'n Go support has been notified about your lost card.'),
      variant: 'outline' as const,
    },
    {
      id: 'blockchain',
      icon: Link2,
      label: 'Log to Blockchain',
      description: 'Create immutable record',
      onClick: () => handleAction('blockchain', 'Blockchain Record Created', 'Event logged to blockchain with hash: 0x7f8a9b...'),
      variant: 'secondary' as const,
    },
  ];

  return (
    <Card className="glass-elevated border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant}
            className="w-full justify-start gap-3 h-auto py-3"
            onClick={action.onClick}
            disabled={loadingAction !== null}
          >
            {loadingAction === action.id ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <action.icon className="w-5 h-5" />
            )}
            <div className="text-left">
              <p className="font-medium">{action.label}</p>
              <p className="text-xs opacity-70">{action.description}</p>
            </div>
            {loadingAction === action.id && (
              <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-500 hidden" />
            )}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
