import { useState, useEffect, useCallback } from 'react';
import BlockchainService from '@/lib/blockchain';

interface MyKadEvent {
  id: string;
  userHash: string;
  institution: string;
  action: string;
  timestamp: number;
  ipfsHash: string;
  transactionHash: string;
  blockNumber: number;
  etherscanUrl: string;
  eventType: string;
  verified: boolean;
  source: 'blockchain' | 'mock';
}

// Generate demo events for testing/presentation
function generateDemoEvents(userMyKad: string): MyKadEvent[] {
  const userHash = BlockchainService.hashMyKad(userMyKad);
  const now = Math.floor(Date.now() / 1000) * 1000;

  return [
    {
      id: '0x8c2e3b7a4d9f1e6c5b0a3d2f1e4c7b6a9d0e3f2c-0',
      userHash: userHash,
      institution: 'UMMC Healthcare System',
      action: 'IDENTITY_USED',
      timestamp: now - 3600000,
      ipfsHash: 'QmX5kGhZ8t7vQ2mN9pY3wL4jR8sT1uV6wX9yZ0aB1cD2e',
      transactionHash: '0x8c2e3b7a4d9f1e6c5b0a3d2f1e4c7b6a9d0e3f2c',
      blockNumber: 9245850,
      etherscanUrl: 'https://amoy.polygonscan.com/tx/0x8c2e3b7a4d9f1e6c5b0a3d2f1e4c7b6a9d0e3f2c',
      eventType: 'IdentityUsed',
      verified: true,
      source: 'mock'
    },
    {
      id: '0x9d3f4c8b5e0a3d2f1e4c7b6a9d0e3f2c5b8a1d4e-0',
      userHash: userHash,
      institution: 'Ministry of Health',
      action: 'IDENTITY_USED',
      timestamp: now - 7200000,
      ipfsHash: 'QmY7mK2jQ9sT4uV1wX8yZ5aB6cD3eF0gH1iJ2kL3mN4o',
      transactionHash: '0x9d3f4c8b5e0a3d2f1e4c7b6a9d0e3f2c5b8a1d4e',
      blockNumber: 9245827,
      etherscanUrl: 'https://amoy.polygonscan.com/tx/0x9d3f4c8b5e0a3d2f1e4c7b6a9d0e3f2c5b8a1d4e',
      eventType: 'IdentityUsed',
      verified: true,
      source: 'mock'
    },
    {
      id: '0xae4g5d9c6f1b4e3a2d5c8b7a0e3f2c1d5b8a1e4f-0',
      userHash: userHash,
      institution: 'Bank Negara Malaysia',
      action: 'CONSENT_GRANTED',
      timestamp: now - 86400000,
      ipfsHash: 'QmZ8nL3kP0qR5sT2uV9wX6yZ1aB4cD7eF8gH9iJ0kL1m',
      transactionHash: '0xae4g5d9c6f1b4e3a2d5c8b7a0e3f2c1d5b8a1e4f',
      blockNumber: 9245789,
      etherscanUrl: 'https://amoy.polygonscan.com/tx/0xae4g5d9c6f1b4e3a2d5c8b7a0e3f2c1d5b8a1e4f',
      eventType: 'ConsentGranted',
      verified: true,
      source: 'mock'
    },
    {
      id: '0xbf5h6e0d7g2c5f4b3e6d9c8b1f4e3d2c6b9a2e5f-0',
      userHash: userHash,
      institution: 'KPJ Healthcare',
      action: 'IDENTITY_USED',
      timestamp: now - 172800000,
      ipfsHash: 'QmA9oM4jN1rQ6sT3uV0wX7yZ2aB5cD8eF1gH2iJ3kL4m',
      transactionHash: '0xbf5h6e0d7g2c5f4b3e6d9c8b1f4e3d2c6b9a2e5f',
      blockNumber: 9245740,
      etherscanUrl: 'https://amoy.polygonscan.com/tx/0xbf5h6e0d7g2c5f4b3e6d9c8b1f4e3d2c6b9a2e5f',
      eventType: 'IdentityUsed',
      verified: true,
      source: 'mock'
    },
    {
      id: '0xcg6i7f1e8h3d6g5c4f7e0d9c2e5f4a3d7c0b3e6f-0',
      userHash: userHash,
      institution: 'MySejahtera Mobile App',
      action: 'CONSENT_REVOKED',
      timestamp: now - 259200000,
      ipfsHash: 'QmB0pN5kO2sR7tU4vW1xY8zA3cD6eF9gH0iJ1kL2mN3o',
      transactionHash: '0xcg6i7f1e8h3d6g5c4f7e0d9c2e5f4a3d7c0b3e6f',
      blockNumber: 9245680,
      etherscanUrl: 'https://amoy.polygonscan.com/tx/0xcg6i7f1e8h3d6g5c4f7e0d9c2e5f4a3d7c0b3e6f',
      eventType: 'ConsentRevoked',
      verified: true,
      source: 'mock'
    },
    {
      id: '0xdh7j8g2f9i4e7h6d5g8f1e0d3e6f5a4c8d1e4f7-0',
      userHash: userHash,
      institution: 'Touch n Go eWallet',
      action: 'IDENTITY_USED',
      timestamp: now - 345600000,
      ipfsHash: 'QmC1qO6lP3tS8uV5wW2xY9zA4cD7eF0gH1iJ2kL3mN4o',
      transactionHash: '0xdh7j8g2f9i4e7h6d5g8f1e0d3e6f5a4c8d1e4f7',
      blockNumber: 9245620,
      etherscanUrl: 'https://amoy.polygonscan.com/tx/0xdh7j8g2f9i4e7h6d5g8f1e0d3e6f5a4c8d1e4f7',
      eventType: 'IdentityUsed',
      verified: true,
      source: 'mock'
    }
  ];
}

export function useBlockchainEvents(userMyKad?: string) {
  const [events, setEvents] = useState<MyKadEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const blockchainService = BlockchainService;

  // Check wallet connection status
  const checkWalletStatus = useCallback(() => {
    const connected = blockchainService.isWalletConnected();
    setIsWalletConnected(connected);
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const success = await blockchainService.connectWallet();
      setIsWalletConnected(success);
      return success;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(message);
      console.error('❌ Wallet connection error:', message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch events from blockchain
  const fetchEvents = useCallback(async (myKad: string) => {
    if (!myKad) {
      setError('MyKad number is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('📡 Fetching blockchain events for MyKad:', myKad);

      const blockchainEvents = await blockchainService.getMyKadEventsForUser(myKad);
      console.log(`✅ Fetched ${blockchainEvents.length} blockchain events`);

      // If no real events exist, show demo events for testing
      if (blockchainEvents.length === 0) {
        console.log('📋 No real blockchain events found, showing demo events for testing...');
        const demoEvents = generateDemoEvents(myKad);
        setEvents(demoEvents);
      } else {
        setEvents(blockchainEvents);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch events';
      setError(message);
      console.error('❌ Event fetch error:', message);
      
      // Show demo events on error
      console.log('📋 Error occurred, showing demo events for testing...');
      const demoEvents = generateDemoEvents(myKad);
      setEvents(demoEvents);
    } finally {
      setLoading(false);
    }
  }, []);

  // Record a new MyKad event on blockchain
  const recordEvent = useCallback(
    async (institution: string, action: string, details?: any) => {
      if (!userMyKad) {
        setError('MyKad number is required');
        return null;
      }

      if (!isWalletConnected) {
        setError('Wallet must be connected to record events');
        return null;
      }

      try {
        setLoading(true);
        setError(null);
        console.log(`🎫 Recording MyKad event: ${action} at ${institution}`);

        const result = await blockchainService.recordMyKadEvent(
          userMyKad,
          institution,
          action,
          details
        );

        console.log('✅ Event recorded:', result);

        // Refresh events list after recording
        if (result.success) {
          await fetchEvents(userMyKad);
        }

        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to record event';
        setError(message);
        console.error('❌ Event recording error:', message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userMyKad, isWalletConnected, fetchEvents]
  );

  // Fetch events on mount if MyKad is provided
  useEffect(() => {
    if (userMyKad) {
      fetchEvents(userMyKad);
    }
    checkWalletStatus();
  }, [userMyKad, fetchEvents, checkWalletStatus]);

  return {
    events,
    loading,
    error,
    isWalletConnected,
    connectWallet,
    fetchEvents,
    recordEvent,
    checkWalletStatus
  };
}
