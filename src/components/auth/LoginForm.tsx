import { useState, useMemo, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Fingerprint, Loader2, Smartphone, ArrowLeft } from 'lucide-react';
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

export const LoginForm = forwardRef<HTMLDivElement, LoginFormProps>(({ onLogin }, ref) => {
  const [icNumber, setIcNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'ic' | 'nfc' | 'digital'>('digital');
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

    // Accept any 6-digit code - no validation against hardcoded OTP
    toast({
      title: "Authentication Successful",
      description: "Welcome to NextGuard ID!",
    });
    onLogin(icNumber || '880101145678');

    setIsLoading(false);
  };

  // NFC login removed — MyDigital ID is the only login method

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 via-blue-50 to-emerald-50 relative overflow-hidden">
      {/* Background animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-emerald-300/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-pink-300/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="w-full max-w-md animate-slide-up relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-10">
          {/* NextGuard ID Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/nexguard.png"
              alt="NextGuard ID Logo"
              className="h-28 w-28 object-contain drop-shadow-lg hover:drop-shadow-xl transition-all duration-300"
            />
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">NextGuard ID</h1>
          <p className="text-gray-600 mt-2 text-lg font-medium">Digital Identity Protection</p>
          <p className="text-gray-500 text-sm mt-1">Powered by Malaysia's MyDigitalID</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-white/40 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300">
          {step === 'credentials' ? (
            <>
              {/* Credentials Step */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600 text-sm">Sign in with your MyDigitalID to protect your digital identity</p>
              </div>

              <div className="space-y-4 mb-8">
                <button
                  onClick={handleDigitalID}
                  disabled={isLoading}
                  className="w-full h-16 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl font-semibold flex items-center justify-start gap-4 px-6 shadow-md hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  <div className="w-20 h-20 rounded-lg bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all">
                    <img
                      src="/mydigitalid-logo.png"
                      alt="MyDigitalID"
                      className="w-14 h-14 object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-base">MyDigital ID</p>
                    <p className="text-xs text-white/80">Government-verified authentication</p>
                  </div>
                  <div className="ml-auto">
                    <Shield className="w-5 h-5 text-white/60 group-hover:text-white transition-all" />
                  </div>
                </button>
              </div>

              {/* Info Section */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-200">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Why MyDigitalID?</p>
                    <p className="text-xs text-gray-600 mt-1">Government-verified identity with biometric security and immutable records.</p>
                  </div>
                </div>
              </div>

              {/* Footer Info */}
              <p className="text-xs text-center text-gray-500 mt-8">
                By logging in, you agree to our <span className="text-blue-600 font-semibold cursor-pointer hover:underline">Terms of Service</span> and <span className="text-blue-600 font-semibold cursor-pointer hover:underline">Privacy Policy</span>
              </p>
            </>
          ) : (
            <>
              {/* OTP Step */}
              <button
                onClick={handleBackToCredentials}
                disabled={isLoading}
                className="mb-6 text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>

              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-100 flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-emerald-500/30 transition-all">
                  <Smartphone className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Two-Factor Authentication</h2>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                  Enter the 6-digit code from your authenticator app to complete your login
                </p>
              </div>

              <form onSubmit={handleOTPSubmit} className="space-y-8">
                {/* OTP Input */}
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpCode}
                    onChange={(value) => setOtpCode(value)}
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="text-lg font-bold h-14 w-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 focus:border-blue-600 transition-colors" />
                      <InputOTPSlot index={1} className="text-lg font-bold h-14 w-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 focus:border-blue-600 transition-colors" />
                      <InputOTPSlot index={2} className="text-lg font-bold h-14 w-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 focus:border-blue-600 transition-colors" />
                    </InputOTPGroup>
                    <span className="mx-3 text-gray-400 text-2xl font-light">-</span>
                    <InputOTPGroup>
                      <InputOTPSlot index={3} className="text-lg font-bold h-14 w-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 focus:border-blue-600 transition-colors" />
                      <InputOTPSlot index={4} className="text-lg font-bold h-14 w-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 focus:border-blue-600 transition-colors" />
                      <InputOTPSlot index={5} className="text-lg font-bold h-14 w-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 focus:border-blue-600 transition-colors" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {/* Demo Info */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
                  <div className="flex gap-3">
                    <div className="text-xl flex-shrink-0">ℹ️</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Demo Mode Active</p>
                      <p className="text-xs text-gray-600 mt-1">Enter any 6-digit code to proceed with the demo</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || otpCode.length !== 6}
                  className="w-full h-14 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-2xl font-bold text-base shadow-md hover:shadow-lg hover:shadow-emerald-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 group-hover:drop-shadow-lg transition-all" />
                      Verify & Login
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-center text-gray-500 mt-6">
                Your connection is encrypted and secure. <span className="text-emerald-600 font-semibold">Privacy guaranteed.</span>
              </p>
            </>
          )}
        </div>

        {/* Bottom Trust Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/50 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300">
            <span className="text-lg">🔒</span>
            <span className="text-xs font-semibold text-gray-700">Powered by MyDigitalID</span>
          </div>
          <p className="text-xs text-gray-600 mt-4">
            Personal Data Secured with Blockchain Technology
          </p>
        </div>
      </div>
    </div>
  );
});

LoginForm.displayName = 'LoginForm';
