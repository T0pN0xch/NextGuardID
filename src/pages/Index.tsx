import { useState, forwardRef, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MyKadUsageConfirmation } from '@/components/mykad/MyKadUsageConfirmation';
import { InteractiveGuide } from '@/components/onboarding/InteractiveGuide';
import { useOnboarding } from '@/context/OnboardingContext';
import Dashboard from '@/pages/Dashboard';
import SuspiciousActivityPage from '@/pages/SuspiciousActivityPage';
import AuditLogPage from '@/pages/AuditLogPage';
import ConsentPage from '@/pages/ConsentPage';
import SettingsPage from '@/pages/SettingsPage';
import ProfilePage from '@/pages/ProfilePage';
import { MyKadUsageConfirmationRequest } from '@/types/identity';
import { mockHealthcareInstitutions } from '@/data/mockData';
import blockchainService from '@/utils/blockchain';


const Index = forwardRef<HTMLDivElement>((_, ref) => {
  const location = useLocation();
  const { setCurrentRoute } = useOnboarding();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Restore auth state from sessionStorage on mount
    const stored = sessionStorage.getItem('isAuthenticated');
    return stored === 'true';
  });
  const [userIc, setUserIc] = useState(() => {
    return sessionStorage.getItem('userIc') || '';
  });
  const [userName, setUserName] = useState(() => {
    return sessionStorage.getItem('userName') || '';
  });
  const [confirmationRequest, setConfirmationRequest] = useState<MyKadUsageConfirmationRequest | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Track current route for onboarding
  useEffect(() => {
    setCurrentRoute(location.pathname);
  }, [location.pathname, setCurrentRoute]);

  // Persist auth state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('isAuthenticated', isAuthenticated.toString());
    if (isAuthenticated && userIc) {
      sessionStorage.setItem('userIc', userIc);
      sessionStorage.setItem('userName', userName);
    }
  }, [isAuthenticated, userIc, userName]);

  const handleLogin = (icNumber: string) => {
    setUserIc(icNumber);
    setUserName('Ahmad bin Abdullah');
    setIsAuthenticated(true);
    // Show approval popup after 1 minute of login
    setTimeout(() => {
      showMockConfirmationRequest();
    }, 60000); // 1 minute = 60000 milliseconds
  };

  const showMockConfirmationRequest = () => {
    const mockRequest: MyKadUsageConfirmationRequest = {
      id: `req_${Date.now()}`,
      institution: mockHealthcareInstitutions[0],
      action: 'registration',
      purpose: 'Patient Registration - New Account Creation',
      timestamp: new Date(),
      location: 'Kuala Lumpur, Malaysia',
      expiresIn: 120,
    };
    setConfirmationRequest(mockRequest);
    setShowConfirmation(true);
  };

  const handleApprove = async (requestId: string) => {
    setIsProcessing(true);
    try {
      // Record MyKad usage on blockchain with IPFS
      if (confirmationRequest) {
        const usageMetadata = {
          requestId: requestId,
          institution: confirmationRequest.institution.name,
          action: confirmationRequest.action,
          purpose: confirmationRequest.purpose,
          location: confirmationRequest.location,
          timestamp: new Date().toISOString(),
          status: 'approved',
          userConsent: 'given'
        };

        // Record on blockchain with IPFS storage
        const result = await blockchainService.logConsentWithIPFS(
          userIc,
          confirmationRequest.institution.name,
          'MYKAD_USAGE_APPROVED',
          usageMetadata
        );

        console.log('✅ MyKad usage recorded on blockchain:', result);
        console.log('📦 IPFS Hash:', result.ipfsHash);
        console.log('🔗 Transaction:', result.etherscanUrl);
      }

      setShowConfirmation(false);
    } catch (error) {
      console.error('Failed to record MyKad usage:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeny = (requestId: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      console.log('MyKad usage denied:', requestId);
      setShowConfirmation(false);
      setIsProcessing(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserIc('');
    setUserName('');
    setShowConfirmation(false);
    // Clear session storage on logout
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userIc');
    sessionStorage.removeItem('userName');
  };

  const handleUpdateUserName = (newName: string) => {
    setUserName(newName);
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div ref={ref} className="min-h-screen bg-background">
      <Header userName={userName} onLogout={handleLogout} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-[calc(100vh-4rem)] overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/consent" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/suspicious" element={<SuspiciousActivityPage />} />
            <Route path="/audit-log" element={<AuditLogPage />} />
            <Route path="/consent" element={<ConsentPage userIc={userIc} />} />
            <Route path="/profile" element={<ProfilePage userName={userName} userIc={userIc} onUpdateUserName={handleUpdateUserName} />} />
            <Route path="/settings" element={<SettingsPage userName={userName} icNumber={userIc} />} />
          </Routes>
        </main>
      </div>

      {/* MyKad Usage Confirmation Modal */}
      <MyKadUsageConfirmation
        isOpen={showConfirmation}
        request={confirmationRequest}
        onApprove={handleApprove}
        onDeny={handleDeny}
        isLoading={isProcessing}
      />

      {/* Interactive Onboarding Guide */}
      <InteractiveGuide />
    </div>
  );
});

Index.displayName = 'Index';

export default Index;
