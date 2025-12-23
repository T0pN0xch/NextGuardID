import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Wallet, CheckCircle2 } from 'lucide-react';
import blockchainService from '@/utils/blockchain';

export function WalletConnector() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Check if wallet is already connected
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (!window.ethereum) {
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        // Wallet is already connected, initialize the blockchain service
        console.log('🔄 Wallet already connected, initializing blockchain service...');
        const connected = await blockchainService.connectWallet();
        if (connected) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          console.log('✅ Blockchain service initialized with wallet:', accounts[0]);
        }
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install it to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Check network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const polygonAmoyChainId = '0x13882'; // Polygon Amoy testnet

      if (chainId !== polygonAmoyChainId) {
        // Try to switch to Polygon Amoy
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: polygonAmoyChainId }],
          });
        } catch (switchErr: any) {
          if (switchErr.code === 4902) {
            // Chain doesn't exist, add it
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: polygonAmoyChainId,
                  chainName: 'Polygon Amoy Testnet',
                  rpcUrls: ['https://rpc-amoy.polygon.technology/'],
                  nativeCurrency: {
                    name: 'MATIC',
                    symbol: 'MATIC',
                    decimals: 18,
                  },
                  blockExplorerUrls: ['https://amoy.polygonscan.com/'],
                },
              ],
            });
          } else {
            throw switchErr;
          }
        }
      }

      // Connect wallet via blockchain service
      const connected = await blockchainService.connectWallet();

      if (connected) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        console.log('✅ Wallet connected:', accounts[0]);
      } else {
        throw new Error('Failed to connect wallet');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isConnected) {
    return (
      <Card className="bg-green-50 border-green-200 m-4">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Wallet Connected</p>
              <p className="text-sm text-green-700 break-all">{walletAddress}</p>
              <p className="text-xs text-green-600 mt-1">
                ✅ Real blockchain transactions enabled
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-amber-50 border-amber-200 m-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Connect Wallet for Real Blockchain
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-700">
          To record MyKad usage on the real Polygon Amoy testnet blockchain, you need to connect your MetaMask wallet.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <Button
            onClick={connectWallet}
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            {isLoading ? 'Connecting...' : '🦊 Connect MetaMask'}
          </Button>
          <p className="text-xs text-slate-600 text-center">
            Need MetaMask?{' '}
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Download here
            </a>
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-700 space-y-1">
          <p className="font-semibold">What happens when you connect:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Your wallet address is securely verified</li>
            <li>MyKad usage approvals create real blockchain transactions</li>
            <li>Data is stored on IPFS and linked on Polygon Amoy testnet</li>
            <li>Audit trail becomes immutable and publicly verifiable</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
