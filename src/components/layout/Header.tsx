import { Shield, Bell, User, LogOut, X, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import blockchainService from '@/utils/blockchain';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

export function Header({ userName, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'Suspicious login attempt detected from Singapore',
      timestamp: new Date(Date.now() - 2 * 60000),
      read: false,
    },
    {
      id: '2',
      message: 'Your MyKad was used at a healthcare facility',
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Check wallet connection on mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
      }
    } catch (err) {
      console.error('Error checking wallet:', err);
    }
  };

  const connectWallet = async () => {
    setIsLoadingWallet(true);
    try {
      if (!window.ethereum) {
        alert('MetaMask is not installed. Please install it to continue.');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        const connected = await blockchainService.connectWallet();
        if (connected) {
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
        }
      }
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    } finally {
      setIsLoadingWallet(false);
    }
  };

  const handleNotificationRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleClearNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };
  return (
    <header className="bg-white sticky top-0 z-50 border-b-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="w-full px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">NextGuard ID</h1>
            <p className="text-xs text-gray-600 font-medium">Digital Identity</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Wallet Connection Button */}
          {walletConnected ? (
            <button className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100 transition-colors">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700">Connected</span>
              <span className="text-xs text-green-600">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
            </button>
          ) : (
            <Button
              onClick={connectWallet}
              disabled={isLoadingWallet}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Wallet className="w-4 h-4" />
              {isLoadingWallet ? 'Connecting...' : 'Connect MetaMask'}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                <Bell className="w-5 h-5 text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto bg-white border-2 border-gray-200 rounded-2xl shadow-lg">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50' : ''
                      }`}
                    onClick={() => handleNotificationRead(notification.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.floor((Date.now() - notification.timestamp.getTime()) / 60000)} minutes ago
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearNotification(notification.id);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 hover:bg-gray-100">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:inline text-sm font-bold text-gray-900">{userName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border-2 border-gray-200 rounded-2xl shadow-lg">
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-100 text-gray-900 font-semibold"
                onClick={() => navigate('/profile')}
              >
                <User className="w-4 h-4 mr-2" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600 font-semibold hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
