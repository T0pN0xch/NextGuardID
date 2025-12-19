import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, CreditCard, Fingerprint, Loader2, Smartphone, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface LoginFormProps {
  onLogin: (icNumber: string) => void;
}

// Generate a deterministic OTP based on IC number (for demo purposes)
function generateExpectedOTP(icNumber: string): string {
  let hash = 0;
  for (let i = 0; i < icNumber.length; i++) {
    const char = icNumber.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash % 1000000).toString().padStart(6, '0');
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [icNumber, setIcNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'ic' | 'nfc' | 'digital'>('ic');
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');

  // Generate expected OTP based on IC number
  const expectedOTP = useMemo(() => generateExpectedOTP(icNumber || '880101145678'), [icNumber]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginMethod === 'ic') {
      if (!icNumber || icNumber.length !== 12) {
        toast({
          title: "Invalid IC Number",
          description: "Please enter a valid 12-digit IC number.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsLoading(true);
    
    // Simulate credential verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Credentials Verified",
      description: "Please enter the 6-digit code from your authenticator app.",
    });
    
    setStep('otp');
    setIsLoading(false);
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otpCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit authenticator code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (otpCode === expectedOTP) {
      toast({
        title: "Authentication Successful",
        description: "Welcome to NextGuard ID!",
      });
      onLogin(icNumber || '880101145678');
    } else {
      toast({
        title: "Invalid Code",
        description: "The authenticator code is incorrect. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleNFCScan = async () => {
    setLoginMethod('nfc');
    setIsLoading(true);
    
    toast({
      title: "Scanning MyKad...",
      description: "Please place your MyKad on the NFC reader.",
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast({
      title: "MyKad Detected",
      description: "Please enter authenticator code to continue.",
    });
    
    setStep('otp');
    setIsLoading(false);
  };

  const handleDigitalID = async () => {
    setLoginMethod('digital');
    setIsLoading(true);
    
    toast({
      title: "Connecting to MyDigital ID",
      description: "Redirecting to secure authentication...",
    });
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    toast({
      title: "Identity Verified",
      description: "Please enter authenticator code for 2FA.",
    });
    
    setStep('otp');
    setIsLoading(false);
  };

  const handleBackToCredentials = () => {
    setStep('credentials');
    setOtpCode('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30 animate-float">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">NextGuard ID</h1>
          <p className="text-muted-foreground mt-2">Secure Digital Identity Management</p>
        </div>
        
        <div className="glass-elevated rounded-2xl p-8">
          {step === 'credentials' ? (
            <>
              <div className="space-y-4 mb-6">
                <Button
                  variant={loginMethod === 'nfc' ? 'hero' : 'outline'}
                  className="w-full h-14 justify-start gap-4"
                  onClick={handleNFCScan}
                  disabled={isLoading}
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">MyKad NFC Login</p>
                    <p className="text-xs text-muted-foreground">Tap your MyKad on NFC reader</p>
                  </div>
                </Button>
                
                <Button
                  variant={loginMethod === 'digital' ? 'hero' : 'outline'}
                  className="w-full h-14 justify-start gap-4"
                  onClick={handleDigitalID}
                  disabled={isLoading}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Fingerprint className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">MyDigital ID</p>
                    <p className="text-xs text-muted-foreground">Authenticate with MyDigital ID</p>
                  </div>
                </Button>
              </div>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or enter manually</span>
                </div>
              </div>
              
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ic-number">IC Number (MyKad)</Label>
                  <Input
                    id="ic-number"
                    type="text"
                    placeholder="880101145678"
                    value={icNumber}
                    onChange={(e) => setIcNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    className="h-12 text-lg font-mono tracking-wider"
                    maxLength={12}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">Enter your 12-digit IC number without dashes</p>
                </div>
                
                <Button 
                  type="submit" 
                  variant="hero" 
                  className="w-full h-12" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Continue
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToCredentials}
                className="mb-4 -ml-2"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
              
              <form onSubmit={handleOTPSubmit} className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpCode}
                    onChange={(value) => setOtpCode(value)}
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <span className="mx-2 text-muted-foreground">-</span>
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                
                <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
                  <p className="text-xs text-muted-foreground text-center">
                    <span className="font-semibold text-foreground">Demo Mode:</span> Use code <span className="font-mono text-primary font-bold">{expectedOTP}</span> to login
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  variant="hero" 
                  className="w-full h-12" 
                  disabled={isLoading || otpCode.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Verify & Login
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
          
          <p className="text-xs text-center text-muted-foreground mt-6">
            By logging in, you agree to our Terms of Service and Privacy Policy.
            Your identity is protected by blockchain technology.
          </p>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            🇲🇾 Powered by Malaysian Digital Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
}
