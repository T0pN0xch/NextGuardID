import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertTriangle, MapPin, Clock, Globe, Shield, ShieldAlert, Server, X } from 'lucide-react';
import { mockSuspiciousAttempts } from '@/data/mockData';
import { SuspiciousAttempt } from '@/types/identity';
import { SuspiciousMap } from '@/components/dashboard/SuspiciousMap';
import ChatWidget from '@/components/chat/ChatWidget';

export default function SuspiciousActivityPage() {
  const [selectedAttempt, setSelectedAttempt] = useState<SuspiciousAttempt | null>(null);

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-destructive';
    if (score >= 50) return 'text-warning';
    return 'text-success';
  };

  const getRiskBadge = (score: number) => {
    if (score >= 80) return <Badge variant="destructive">Critical Risk</Badge>;
    if (score >= 50) return <Badge variant="warning">Medium Risk</Badge>;
    return <Badge variant="success">Low Risk</Badge>;
  };

  const getAttemptTypeExplanation = (type: string) => {
    const explanations: Record<string, string> = {
      'Login Attempt': 'Someone tried to access your account using your credentials. This could indicate password compromise or brute-force attack.',
      'Account Creation': 'Someone attempted to create a new account using your identity. This is a common identity theft tactic.',
      'Verification Request': 'A verification request was made using your identity documents. This could be fraudulent account verification.',
      'Data Access': 'There was an attempt to access your personal data. Unauthorized data access can lead to privacy breaches.'
    };
    return explanations[type] || 'Unrecognized suspicious activity detected.';
  };

  const getRecommendations = (attempt: SuspiciousAttempt) => {
    const recommendations = [];

    if (attempt.riskScore >= 80) {
      recommendations.push('Immediately change your passwords for all linked accounts');
      recommendations.push('Enable two-factor authentication if not already active');
      recommendations.push('Report this incident to relevant authorities');
    } else if (attempt.riskScore >= 50) {
      recommendations.push('Review your recent account activities');
      recommendations.push('Consider changing passwords as a precaution');
      recommendations.push('Monitor your accounts for unusual activities');
    } else {
      recommendations.push('Keep monitoring your account activities');
      recommendations.push('Ensure your security settings are up to date');
    }

    if (!attempt.blocked) {
      recommendations.unshift('URGENT: This attempt was not blocked - take immediate action');
    }

    return recommendations;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Suspicious Activity</h1>
        <p className="text-muted-foreground mt-1">
          Monitor and investigate suspicious attempts to use your identity
        </p>
      </div>

      {/* Map Overview */}
      <SuspiciousMap attempts={mockSuspiciousAttempts} />

      {/* Activity List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            All Suspicious Activities ({mockSuspiciousAttempts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockSuspiciousAttempts.map((attempt) => (
              <button
                key={attempt.id}
                onClick={() => setSelectedAttempt(attempt)}
                className="w-full text-left p-4 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {attempt.blocked ? (
                        <Shield className="w-4 h-4 text-success" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-destructive" />
                      )}
                      <span className="font-medium">{attempt.attemptType}</span>
                      {getRiskBadge(attempt.riskScore)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {attempt.city}, {attempt.country}
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {attempt.platform}
                      </div>
                      <div className="flex items-center gap-1">
                        <Server className="w-3 h-3" />
                        {attempt.ipAddress}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(attempt.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getRiskColor(attempt.riskScore)}`}>
                      {attempt.riskScore}%
                    </div>
                    <div className="text-xs text-muted-foreground">Risk Score</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Click for detailed analysis →
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedAttempt} onOpenChange={() => setSelectedAttempt(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Suspicious Activity Details
            </DialogTitle>
            <DialogDescription>
              Detailed analysis of this security incident
            </DialogDescription>
          </DialogHeader>

          {selectedAttempt && (
            <div className="space-y-6">
              {/* Status Banner */}
              <div className={`p-4 rounded-lg ${selectedAttempt.blocked ? 'bg-success/10 border border-success/30' : 'bg-destructive/10 border border-destructive/30'}`}>
                <div className="flex items-center gap-2">
                  {selectedAttempt.blocked ? (
                    <>
                      <Shield className="w-5 h-5 text-success" />
                      <span className="font-semibold text-success">This attempt was blocked</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-5 h-5 text-destructive" />
                      <span className="font-semibold text-destructive">This attempt was NOT blocked - Action required</span>
                    </>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Attempt Type</div>
                  <div className="font-medium">{selectedAttempt.attemptType}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Risk Score</div>
                  <div className={`font-bold text-xl ${getRiskColor(selectedAttempt.riskScore)}`}>
                    {selectedAttempt.riskScore}% {getRiskBadge(selectedAttempt.riskScore)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-medium">{selectedAttempt.city}, {selectedAttempt.country}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Platform</div>
                  <div className="font-medium">{selectedAttempt.platform}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">IP Address</div>
                  <div className="font-mono text-sm">{selectedAttempt.ipAddress}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Timestamp</div>
                  <div className="font-medium">{new Date(selectedAttempt.timestamp).toLocaleString()}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Coordinates</div>
                  <div className="font-mono text-sm">
                    {selectedAttempt.coordinates.lat.toFixed(4)}, {selectedAttempt.coordinates.lng.toFixed(4)}
                  </div>
                </div>
              </div>

              {/* Why Suspicious */}
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  Why is this suspicious?
                </h4>
                <p className="text-muted-foreground text-sm bg-secondary/30 p-3 rounded-lg">
                  {getAttemptTypeExplanation(selectedAttempt.attemptType)}
                </p>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Recommended Actions
                </h4>
                <ul className="space-y-2">
                  {getRecommendations(selectedAttempt).map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className={rec.includes('URGENT') ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                        {rec}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <Button className="flex-1">Report to Authorities</Button>
                <Button variant="outline" className="flex-1">Mark as Resolved</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assistant for this page */}
      <div className="mt-6">
        <ChatWidget title="Suspicious Activity Assistant" />
      </div>
    </div>
  );
}