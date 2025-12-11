import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import Dashboard from '@/pages/Dashboard';
import UsagePage from '@/pages/UsagePage';
import ConsentPage from '@/pages/ConsentPage';
import BlockchainPage from '@/pages/BlockchainPage';
import SettingsPage from '@/pages/SettingsPage';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userIc, setUserIc] = useState('');
  const [userName, setUserName] = useState('');

  const handleLogin = (icNumber: string) => {
    setUserIc(icNumber);
    setUserName('Ahmad bin Abdullah');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserIc('');
    setUserName('');
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userName={userName} onLogout={handleLogout} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-[calc(100vh-4rem)] overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usage" element={<UsagePage />} />
            <Route path="/consent" element={<ConsentPage />} />
            <Route path="/blockchain" element={<BlockchainPage />} />
            <Route path="/settings" element={<SettingsPage userName={userName} icNumber={userIc} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Index;
