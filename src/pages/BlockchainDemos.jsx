import React, { useState } from 'react';
import blockchainService from '../utils/blockchain';

const BlockchainDemo = () => {
  const [mykad, setMykad] = useState('900101015678');
  const [platform, setPlatform] = useState('Bank Negara Malaysia');
  const [action, setAction] = useState('CONSENT_GRANTED');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogTransaction = async () => {
    setLoading(true);
    
    // Log to blockchain (mock for demo)
    const tx = await blockchainService.logConsent(mykad, platform, action);
    
    setTransactions([tx, ...transactions]);
    
    setLoading(false);
    alert(`✅ Transaction logged!\nView: ${tx.etherscanUrl}`);
  };

  const handleViewTransactions = async () => {
    const events = await blockchainService.getUserEvents(mykad);
    setTransactions(events);
  };

  return (
    <div className="p-6 bg-gray-900 rounded-xl border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-white">🔗 Blockchain Audit Trail</h2>
      <p className="text-gray-400 mb-6">All identity actions are immutably recorded on Polygon Amoy Testnet</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">MyKad Number</label>
          <input
            type="text"
            value={mykad}
            onChange={(e) => setMykad(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="Enter MyKad number"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option>Bank Negara Malaysia</option>
            <option>MySejahtera</option>
            <option>Touch 'n Go eWallet</option>
            <option>Shopee Malaysia</option>
            <option>Maxis</option>
            <option>Maybank2u</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Action</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option>LOGIN</option>
            <option>CONSENT_GRANTED</option>
            <option>CONSENT_REVOKED</option>
            <option>SUSPICIOUS_ACTIVITY</option>
          </select>
        </div>
      </div>
      
      <div className="flex gap-3 mb-8">
        <button
          onClick={handleLogTransaction}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging...' : '📝 Log to Blockchain'}
        </button>
        
        <button
          onClick={handleViewTransactions}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white"
        >
          🔍 View History
        </button>
        
        <a
          href={`https://amoy.polygonscan.com/address/${blockchainService.CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium text-white border border-gray-700"
        >
          📊 View Contract
        </a>
      </div>
      
      {transactions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded">
                        {tx.action || tx.actionType}
                      </span>
                      <span className="text-gray-300">{tx.platform || tx.platformId}</span>
                    </div>
                    <div className="text-sm text-gray-400 font-mono">
                      TX: {tx.hash?.substring(0, 20)}...
                    </div>
                  </div>
                  <a
                    href={tx.etherscanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white"
                  >
                    Verify
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <h4 className="font-medium text-white mb-2">📋 Contract Information</h4>
        <div className="text-sm text-gray-400">
          <div className="flex items-center gap-2 mb-1">
            <span>Address:</span>
            <code className="bg-gray-900 px-2 py-1 rounded">{blockchainService.CONTRACT_ADDRESS}</code>
          </div>
          <div className="flex items-center gap-2">
            <span>Network:</span>
            <span className="text-green-400">Polygon Amoy Testnet</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainDemo;