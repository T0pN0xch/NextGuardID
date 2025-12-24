import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  User,
  Bell,
  Shield,
  Smartphone,
  Key,
  Save,
  AlertTriangle,
  HardDrive,
  Zap,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useOnboarding } from '@/context/OnboardingContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface SettingsPageProps {
  userName: string;
  icNumber: string;
}

export default function SettingsPage({ userName, icNumber }: SettingsPageProps) {
  const { setShowOnboarding, currentStep } = useOnboarding();
  const [notifications, setNotifications] = useState({
    newRegistration: true,
    suspiciousActivity: true,
    weeklyReport: false,
    consentExpiry: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    biometric: true,
    loginAlerts: true,
  });

  const [ipfsStatus, setIpfsStatus] = useState({
    connected: true,
    responseTime: '45ms',
    lastSync: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    testing: false,
  });

  const handleTestIPFS = async () => {
    setIpfsStatus(prev => ({ ...prev, testing: true }));
    try {
      // Simulate IPFS connectivity test
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIpfsStatus(prev => ({
        ...prev,
        connected: true,
        responseTime: `${Math.floor(Math.random() * 50) + 20}ms`,
        lastSync: new Date(),
        testing: false,
      }));
      toast({
        title: "IPFS Connection Healthy",
        description: "All data is being securely stored on IPFS.",
      });
    } catch (error) {
      setIpfsStatus(prev => ({ ...prev, connected: false, testing: false }));
      toast({
        title: "IPFS Connection Failed",
        description: "Unable to reach IPFS node. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-4 p-4 md:p-6 h-full overflow-auto">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <Card className="glass-elevated border-border/50 animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profile Information
          </CardTitle>
          <CardDescription>Your personal identity details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={userName} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>IC Number (MyKad)</Label>
              <Input value={icNumber.replace(/(\d{6})(\d{2})(\d{4})/, '$1-$2-$3')} disabled className="bg-muted font-mono" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            <AlertTriangle className="w-3 h-3 inline mr-1" />
            Profile information is synced from MyDigital ID and cannot be edited here.
          </p>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card className="glass-elevated border-border/50 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>Choose what alerts you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Registration Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified when your ID is used to register</p>
            </div>
            <Switch
              checked={notifications.newRegistration}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, newRegistration: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Suspicious Activity</p>
              <p className="text-sm text-muted-foreground">Alerts for high-risk platform access</p>
            </div>
            <Switch
              checked={notifications.suspiciousActivity}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, suspiciousActivity: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Reports</p>
              <p className="text-sm text-muted-foreground">Receive weekly identity usage summary</p>
            </div>
            <Switch
              checked={notifications.weeklyReport}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReport: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Consent Expiry Reminders</p>
              <p className="text-sm text-muted-foreground">Notify before consent expires</p>
            </div>
            <Switch
              checked={notifications.consentExpiry}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, consentExpiry: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="glass-elevated border-border/50 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Security
          </CardTitle>
          <CardDescription>Protect your digital identity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Extra layer of security for login</p>
              </div>
            </div>
            <Switch
              checked={security.twoFactor}
              onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactor: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Help & Tutorial Section */}
      <Card className="glass-elevated border-border/50 animate-slide-up" style={{ animationDelay: '350ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Help & Tutorial
          </CardTitle>
          <CardDescription>Learn how to use NextGuard ID</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Get started with an interactive tutorial that guides you through every feature of NextGuard ID step-by-step.
          </p>
          <Button
            onClick={() => setShowOnboarding(true)}
            className="w-full gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            <HelpCircle className="w-4 h-4" />
            {currentStep !== undefined ? 'Resume Tutorial' : 'Start Interactive Tutorial'}
          </Button>
        </CardContent>
      </Card>

      {/* IPFS Connection Section */}
      <Card className="glass-elevated border-border/50 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-primary" />
            IPFS Connection Status
          </CardTitle>
          <CardDescription>Distributed storage for your blockchain records</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${ipfsStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
              <div>
                <p className="font-semibold">{ipfsStatus.connected ? 'Connected' : 'Disconnected'}</p>
                <p className="text-xs text-muted-foreground">{ipfsStatus.connected ? 'IPFS node is online and healthy' : 'Unable to reach IPFS node'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-semibold text-emerald-600">{ipfsStatus.responseTime}</p>
              <p className="text-xs text-muted-foreground">Response time</p>
            </div>
          </div>

          {/* Connection Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-secondary/20 border border-border/30">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Last Sync</p>
              <p className="text-sm font-medium mt-1">
                {ipfsStatus.lastSync.toLocaleTimeString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/20 border border-border/30">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Protocol</p>
              <p className="text-sm font-medium mt-1">IPFS / HTTP</p>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                All your audit trail records are encrypted and stored on IPFS, making them immutable and decentralized.
              </p>
            </div>
          </div>

          {/* Test Connection Button */}
          <Button
            variant="outline"
            onClick={handleTestIPFS}
            disabled={ipfsStatus.testing}
            className="w-full gap-2"
          >
            {ipfsStatus.testing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Test IPFS Connection
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium">Biometric Authentication</p>
                <p className="text-sm text-muted-foreground">Use fingerprint or face recognition</p>
              </div>
            </div>
            <Switch
              checked={security.biometric}
              onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, biometric: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-medium">Login Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified of new logins</p>
              </div>
            </div>
            <Switch
              checked={security.loginAlerts}
              onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, loginAlerts: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="hero" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
