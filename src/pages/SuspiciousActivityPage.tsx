import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock, AlertTriangle, MapPin, Zap } from 'lucide-react';
import { useState } from 'react';

interface SuspiciousActivity {
  id: string;
  type: 'unauthorized_access' | 'rapid_access' | 'unusual_location' | 'consent_violation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  location?: string;
  institution?: string;
  status: 'blocked' | 'flagged' | 'resolved';
}

export default function SuspiciousActivityPage() {
  const suspiciousActivities: SuspiciousActivity[] = [
    {
      id: '1',
      type: 'rapid_access',
      title: 'Rapid Multiple Access Attempts',
      description: 'Your MyKad was accessed 5 times in 2 minutes from different institutions',
      severity: 'high',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      institution: 'Multiple Banks',
      status: 'blocked'
    },
    {
      id: '2',
      type: 'unusual_location',
      title: 'Access from Unusual Location',
      description: 'MyKad used at a location 500km away from last known location',
      severity: 'medium',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      location: 'Johor Bahru (Last location: Kuala Lumpur)',
      status: 'flagged'
    },
    {
      id: '3',
      type: 'consent_violation',
      title: 'Consent Violation Attempt',
      description: 'Institution attempted to access data beyond granted consent scope',
      severity: 'high',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      institution: 'UnknownBank Ltd',
      status: 'blocked'
    },
    {
      id: '4',
      type: 'unauthorized_access',
      title: 'Failed Authentication Attempts',
      description: '3 failed login attempts detected with different IP addresses',
      severity: 'medium',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      status: 'resolved'
    },
  ];

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High Risk</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-warning/20 text-warning border-warning/30">Medium Risk</Badge>;
      case 'low':
        return <Badge variant="secondary" className="bg-success/20 text-success border-success/30">Low Risk</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'blocked':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">🛡️ Blocked</Badge>;
      case 'flagged':
        return <Badge className="bg-warning/20 text-warning border-warning/30">⚠️ Flagged</Badge>;
      case 'resolved':
        return <Badge className="bg-success/20 text-success border-success/30">✓ Resolved</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">MyKad Activity Security</h1>
        <p className="text-muted-foreground mt-1">
          Monitor unauthorized access attempts and consent violations on your MyKad identity
        </p>
      </div>

      {/* Security Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Security Alert Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-destructive/10 border border-destructive/30">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Blocked Attempts</div>
                  <div className="text-2xl font-bold text-destructive">2</div>
                  <p className="text-xs text-muted-foreground">Unauthorized access prevented</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-warning/10 border border-warning/30">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Flagged Events</div>
                  <div className="text-2xl font-bold text-warning">1</div>
                  <p className="text-xs text-muted-foreground">Unusual activity detected</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-success/10 border border-success/30">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Resolved</div>
                  <div className="text-2xl font-bold text-success">1</div>
                  <p className="text-xs text-muted-foreground">Handled and verified safe</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Suspicious Activities List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            Detected Activities ({suspiciousActivities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {suspiciousActivities.map((activity) => (
              <button
                key={activity.id}
                onClick={() => setExpandedId(expandedId === activity.id ? null : activity.id)}
                className="w-full text-left p-4 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className={`w-4 h-4 ${getSeverityColor(activity.severity)}`} />
                      <span className="font-medium">{activity.title}</span>
                      {getSeverityBadge(activity.severity)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.timestamp.toLocaleDateString()} {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {activity.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {activity.location}
                        </div>
                      )}
                      {activity.institution && (
                        <div className="flex items-center gap-1">
                          {activity.institution}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(activity.status)}
                    <div className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Click for details →
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === activity.id && (
                  <div className="mt-4 pt-4 border-t border-border/30 space-y-3">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">What Happened</h4>
                      <p className="text-sm text-muted-foreground">
                        {activity.type === 'rapid_access' && 'Your MyKad received multiple access requests in a very short time window. This could indicate an automated attack or compromise attempt.'}
                        {activity.type === 'unusual_location' && 'The geographic location of this access is significantly different from your normal usage patterns. This may indicate account compromise or unauthorized use.'}
                        {activity.type === 'consent_violation' && 'An institution attempted to access data scopes that you have not explicitly granted permission for. This access was automatically blocked by the blockchain smart contract.'}
                        {activity.type === 'unauthorized_access' && 'Multiple failed authentication attempts were detected, suggesting someone is trying to gain unauthorized access to your account.'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Status</h4>
                      <p className="text-sm text-muted-foreground">
                        {activity.status === 'blocked' && '✓ This access attempt was automatically blocked by our blockchain-powered security system. No unauthorized data was accessed.'}
                        {activity.status === 'flagged' && '⚠️ This activity has been flagged for review. We recommend you verify if this was a legitimate access request from your device or network.'}
                        {activity.status === 'resolved' && '✓ This activity has been investigated and verified as safe. No further action is required.'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Recommended Action</h4>
                      <p className="text-sm text-muted-foreground">
                        {activity.status === 'blocked' && 'Monitor your account for further suspicious activities. Consider reviewing your active consents.'}
                        {activity.status === 'flagged' && 'Review the access request details and confirm if this was legitimate. You can approve or deny the request.'}
                        {activity.status === 'resolved' && 'Your account is secure. Continue monitoring through the MyKad Audit Trail.'}
                      </p>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* What Gets Monitored */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            What We Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-3 text-sm">
              <Badge variant="outline" className="mt-0.5">Blockchain</Badge>
              <span className="text-muted-foreground">Every MyKad usage is recorded on Polygon blockchain and cannot be modified</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <Badge variant="outline" className="mt-0.5">Consent</Badge>
              <span className="text-muted-foreground">Each access verified against your active consents - violations are blocked immediately</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <Badge variant="outline" className="mt-0.5">Patterns</Badge>
              <span className="text-muted-foreground">Unusual access patterns, rapid requests, and anomalies are flagged for review</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <Badge variant="outline" className="mt-0.5">Location</Badge>
              <span className="text-muted-foreground">Geographic anomalies and location mismatches are detected and reported</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}