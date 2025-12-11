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
  AlertTriangle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
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

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
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
          <div className="flex items-center justify-between">
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
