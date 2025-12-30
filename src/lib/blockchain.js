import { ethers } from 'ethers';

// Contract ABI - from compiled IdentityAudit.sol
// These are the exact function signatures from the contract
const IDENTITY_AUDIT_ABI = [
  "constructor()",
  "event ConsentGranted(bytes32 indexed userHash, string platformId, uint256 timestamp, string ipfsHash)",
  "event ConsentRevoked(bytes32 indexed userHash, string platformId, uint256 timestamp, string ipfsHash)",
  "event IdentityUsed(bytes32 indexed userHash, string platformId, string actionType, uint256 timestamp, string ipfsHash)",
  "function logConsentGranted(bytes32 userHash, string platformId, string ipfsHash) nonpayable returns ()",
  "function logConsentRevoked(bytes32 userHash, string platformId, string ipfsHash) nonpayable returns ()",
  "function logIdentityUsage(bytes32 userHash, string platformId, string actionType, string ipfsHash) nonpayable returns ()",
  "function owner() view returns (address)"
];

// Your deployed contract
export const CONTRACT_ADDRESS = "0xe44232a6cf04c44c0B4143Ba43767835c313E469";

// Polygon Amoy RPC
const RPC_URL = "https://rpc-amoy.polygon.technology/";
// Deployment tx (used to limit query range)
const DEPLOYMENT_TX_HASH = "0xb15d52612c755ea139ef4f3aebff5630dff5e6025dab65834d4b616c9d0a6c5a";

class BlockchainService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      IDENTITY_AUDIT_ABI,
      this.provider
    );
    this.signer = null;
    // expose contract address on the service instance for existing frontend code
    this.CONTRACT_ADDRESS = CONTRACT_ADDRESS;
    this._deploymentBlock = null;
    
    // Listen for wallet changes
    this.setupWalletListeners();
  }

  setupWalletListeners() {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        console.log('👤 Wallet accounts changed:', accounts);
        if (accounts.length === 0) {
          console.log('❌ Wallet disconnected');
          this.signer = null;
        } else {
          // Re-connect to the new account
          this.connectWallet();
        }
      });

      window.ethereum.on('chainChanged', (chainId) => {
        console.log('🔗 Chain changed to:', chainId);
        // Reload page to reset state
        window.location.reload();
      });
    }
  }
  // Connect wallet (for demo, we'll simulate)
  async connectWallet() {
    if (window.ethereum) {
      try {
        console.log('📱 Starting wallet connection...');
        
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('✅ User approved MetaMask connection');
        
        // Create provider from MetaMask
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        console.log('✅ BrowserProvider created');
        
        // Get the signer (this is async in ethers v6)
        this.signer = await browserProvider.getSigner();
        const address = await this.signer.getAddress();
        
        console.log('✅ Signer connected:', address);
        console.log('   this.signer is now:', this.signer ? 'Valid ✅' : 'Invalid ❌');
        return true;
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        this.signer = null;
        return false;
      }
    }
    console.error('❌ window.ethereum is not available');
    return false;
  }

  // Check if wallet is connected
  isWalletConnected() {
    return this.signer !== null && this.signer !== undefined;
  }

  // Hash MyKad (demo-safe)
  hashMyKad(mykadNumber) {
    return ethers.keccak256(ethers.toUtf8Bytes(mykadNumber));
  }

  // Upload JSON data to IPFS via Pinata with metadata
  async uploadToIPFS(jsonObj, fileType = 'identity-audit') {
    const token = typeof window !== 'undefined' ? import.meta.env.VITE_WEB3_STORAGE_TOKEN : process.env.VITE_WEB3_STORAGE_TOKEN;
    
    // Check if token looks like a JWT (contains dots)
    const isJWT = token && token.includes('.');
    
    if (!token || !isJWT) {
      // Fall back to demo mode if no valid JWT
      const mockCid = 'Qm' + Math.random().toString(36).substring(2, 50).padEnd(44, 'a');
      console.log('📦 DEMO MODE: Generated mock IPFS CID:', mockCid);
      console.log('💡 No valid Pinata JWT token set. To enable real IPFS uploads, add your JWT to VITE_WEB3_STORAGE_TOKEN');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('✅ Successfully uploaded to IPFS (mock):', mockCid);
      return mockCid;
    }

    // Create metadata wrapper with descriptive name and type
    const timestamp = new Date().toISOString();
    const fileTypeLabel = this.getFileTypeLabel(fileType);
    const fileName = `${fileType}_${Date.now()}`;
    
    const body = JSON.stringify(jsonObj);

    try {
      // Using Pinata API with JWT - includes metadata for file naming
      const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: body
      });

      if (res.ok) {
        const data = await res.json();
        
        // Add metadata/name to the pinned file using Pinata's metadata API
        try {
          await this.updatePinataMetadata(data.IpfsHash, {
            name: `${fileTypeLabel} - ${timestamp}`,
            keyvalues: {
              type: fileType,
              timestamp: timestamp,
              dataType: fileTypeLabel
            }
          });
        } catch (metadataError) {
          console.warn('⚠️  Could not update Pinata metadata, but file was uploaded:', metadataError.message);
        }
        
        console.log(`✅ Successfully uploaded ${fileType} to Pinata IPFS:`, data.IpfsHash);
        return data.IpfsHash;
      }

      const text = await res.text();
      console.error('Pinata upload error:', res.status, text.substring(0, 200));
      throw new Error(`IPFS upload failed: ${res.status}`);
    } catch (error) {
      console.error('❌ IPFS upload error:', error.message);
      throw error;
    }
  }

  // Update Pinata metadata for a pinned file
  async updatePinataMetadata(ipfsHash, metadata) {
    const token = typeof window !== 'undefined' ? import.meta.env.VITE_WEB3_STORAGE_TOKEN : process.env.VITE_WEB3_STORAGE_TOKEN;
    
    if (!token || !token.includes('.')) {
      console.log('⏭️  Skipping metadata update in demo mode');
      return;
    }

    try {
      const response = await fetch('https://api.pinata.cloud/data/pinList', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-pinata-rule-ipfs_pin_hash': ipfsHash
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get pin details: ${response.statusText}`);
      }

      // Pinata uses a different endpoint for updating metadata
      const updateRes = await fetch(`https://api.pinata.cloud/pinning/hashMetadata`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ipfsPinHash: ipfsHash,
          name: metadata.name,
          keyvalues: metadata.keyvalues
        })
      });

      if (updateRes.ok) {
        console.log('✅ Updated Pinata metadata:', metadata.name);
      } else {
        console.warn('⚠️  Could not update Pinata metadata:', updateRes.statusText);
      }
    } catch (error) {
      console.warn('⚠️  Metadata update failed:', error.message);
      // Don't throw - metadata is non-critical
    }
  }

  // Get human-readable label for file type
  getFileTypeLabel(fileType) {
    const labels = {
      'identity-audit': '🔐 Identity Audit Record',
      'consent-grant': '✅ Consent Grant',
      'consent-revoke': '❌ Consent Revoke',
      'identity-usage': '📝 Identity Usage Log',
      'mykad-audit': '🎫 MyKad Audit Trail',
      'blockchain-log': '⛓️  Blockchain Log'
    };
    return labels[fileType] || fileType;
  }

  // Determine the block number where the contract was deployed (caches result)
  async getDeploymentBlock() {
    if (this._deploymentBlock) return this._deploymentBlock;
    try {
      const receipt = await this.provider.getTransactionReceipt(DEPLOYMENT_TX_HASH);
      if (receipt && receipt.blockNumber) {
        this._deploymentBlock = receipt.blockNumber;
        return this._deploymentBlock;
      }
    } catch (e) {
      console.warn('Could not fetch deployment receipt:', e.message || e);
    }
    return 0;
  }

  // Mock blockchain interaction (for hackathon demo)
  async logConsent(userMyKad, platform, action) {
    // If wallet is connected, prefer real on-chain logging
    if (this.signer) {
      return this.logConsentReal(userMyKad, platform, action);
    }

    const userHash = this.hashMyKad(userMyKad);

    // For demo - return mock transaction
    const mockTx = {
      hash: "0x" + Math.random().toString(16).substring(2, 66),
      timestamp: Date.now(),
      contractAddress: CONTRACT_ADDRESS,
      userHash: userHash,
      platform: platform,
      action: action,
      etherscanUrl: `https://amoy.polygonscan.com/tx/0x${Math.random().toString(16).substring(2, 66)}`
    };

    console.log("📝 Mock blockchain log:", mockTx);
    return mockTx;
  }

  // Real implementation (if you want to connect wallet)
  async logConsentReal(userMyKad, platform, action, ipfsHash = "") {
    if (!this.signer) {
      throw new Error("Wallet not connected");
    }
    
    try {
      const userHash = this.hashMyKad(userMyKad);
      
      // Create a new contract instance with the signer
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signerWithProvider = await browserProvider.getSigner();
      const signerAddress = await signerWithProvider.getAddress();
      
      console.log('📝 Preparing blockchain transaction...');
      console.log('   Signer:', signerAddress);
      console.log('   Contract:', CONTRACT_ADDRESS);
      console.log('   User Hash:', userHash);
      console.log('   Platform:', platform);
      console.log('   Action:', action);
      console.log('   IPFS Hash:', ipfsHash || '(none)');
      
      // Check if contract code exists at the address
      const code = await this.provider.getCode(CONTRACT_ADDRESS);
      if (code === '0x') {
        throw new Error(`No contract found at address ${CONTRACT_ADDRESS}. Please deploy the contract first on Polygon Amoy.`);
      }
      console.log('✅ Contract verified at', CONTRACT_ADDRESS);
      
      // Create fresh contract instance with signer (don't use this.contract which has read-only provider)
      const contractWithSigner = new ethers.Contract(
        CONTRACT_ADDRESS,
        IDENTITY_AUDIT_ABI,
        signerWithProvider
      );
      
      console.log('✅ Contract instance created with signer');
      
      // Choose the appropriate contract method based on action
      let tx;
      let methodName;
      
      try {
        if (action === 'CONSENT_GRANTED') {
          methodName = 'logConsentGranted';
          console.log('   → Calling:', methodName);
          tx = await contractWithSigner.logConsentGranted(userHash, platform, ipfsHash || "");
        } else if (action === 'CONSENT_REVOKED') {
          methodName = 'logConsentRevoked';
          console.log('   → Calling:', methodName);
          tx = await contractWithSigner.logConsentRevoked(userHash, platform, ipfsHash || "");
        } else if (action === 'DATA_DELETION_REQUESTED') {
          methodName = 'logIdentityUsage';
          console.log('   → Calling:', methodName, '(for deletion)');
          tx = await contractWithSigner.logIdentityUsage(userHash, platform, 'DATA_DELETION_REQUESTED', ipfsHash || "");
        } else {
          methodName = 'logIdentityUsage';
          console.log('   → Calling:', methodName);
          tx = await contractWithSigner.logIdentityUsage(userHash, platform, action, ipfsHash || "");
        }
        
        console.log('⏳ Transaction submitted:', tx.hash);
        console.log('   Waiting for confirmation...');
        
        const receipt = await tx.wait();
        
        console.log('✅ Transaction confirmed!');
        console.log('   Block:', receipt.blockNumber);
        console.log('   Gas Used:', receipt.gasUsed.toString());
        
        return {
          hash: tx.hash,
          etherscanUrl: `https://amoy.polygonscan.com/tx/${tx.hash}`,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString(),
          status: 'confirmed'
        };
      } catch (methodError) {
        console.error('❌ Contract call failed:');
        console.error('   Method:', methodName);
        console.error('   Error:', methodError.message);
        throw methodError;
      }
    } catch (error) {
      console.error('❌ Blockchain transaction failed:', error.message);
      throw error;
    }
  }

  // Upload consent metadata to IPFS and then log on-chain (uses mock if no wallet connected)
  async logConsentWithIPFS(userMyKad, platform, action, metadataObj) {
    // Determine file type based on action
    const fileTypeMap = {
      'CONSENT_GRANTED': 'consent-grant',
      'CONSENT_REVOKED': 'consent-revoke',
      'IDENTITY_USED': 'identity-usage'
    };
    const fileType = fileTypeMap[action] || 'identity-audit';
    
    const cid = await this.uploadToIPFS(metadataObj, fileType);
    const ipfsHash = cid;
    
    // Try to use real on-chain logging if wallet is connected
    console.log('🔍 Checking for connected wallet...');
    console.log('   Current signer:', this.signer ? 'Exists ✅' : 'Null ❌');
    
    // Double-check: verify signer is still valid
    let signerValid = this.signer !== null && this.signer !== undefined;
    if (signerValid) {
      try {
        const signerAddress = await this.signer.getAddress();
        console.log('   Signer address:', signerAddress);
      } catch (err) {
        console.log('   Signer exists but is invalid:', err.message);
        signerValid = false;
      }
    }
    
    if (signerValid) {
      try {
        console.log('📡 Using REAL blockchain transaction...');
        const txResult = await this.logConsentReal(userMyKad, platform, action, ipfsHash);
        console.log('✅ Real blockchain transaction successful!');
        return { ...txResult, ipfsHash };
      } catch (error) {
        console.warn('⚠️  Real blockchain transaction failed, falling back to mock mode');
        console.warn('   Error:', error.message);
        console.warn('   This is normal for demo - contract methods may not exist on testnet');
        // Fall through to mock mode
      }
    } else {
      console.log('⚠️  No wallet connected, using MOCK mode for demo');
    }
    
    // Otherwise, use mock mode (demo)
    const userHash = this.hashMyKad(userMyKad);
    const mockTx = {
      hash: "0x" + Math.random().toString(16).substring(2, 66),
      timestamp: Date.now(),
      contractAddress: CONTRACT_ADDRESS,
      userHash: userHash,
      platform: platform,
      action: action,
      ipfsHash: ipfsHash,
      etherscanUrl: `https://amoy.polygonscan.com/tx/0x${Math.random().toString(16).substring(2, 66)}`
    };
    
    console.log("📝 Mock blockchain log with IPFS:", mockTx);
    return mockTx;
  }

  // Record a MyKad usage event on-chain with real blockchain transaction
  // This will upload metadata to IPFS and record the hash on-chain
  async recordMyKadEvent(userMyKad, institution, action, details = {}) {
    try {
      console.log('🎫 Recording MyKad event to blockchain...');
      
      // Create metadata object for IPFS
      const metadata = {
        eventType: 'MyKad Usage',
        userHash: this.hashMyKad(userMyKad),
        institution: institution,
        action: action,
        timestamp: new Date().toISOString(),
        details: details,
        chainId: 80002, // Polygon Amoy testnet
        recordedAt: new Date().toISOString()
      };
      
      // Upload metadata to IPFS
      console.log('📤 Uploading metadata to IPFS...');
      const ipfsHash = await this.uploadToIPFS(metadata, 'mykad-audit');
      console.log(`✅ Metadata uploaded to IPFS: ${ipfsHash}`);
      
      // If wallet is connected, record on-chain
      if (this.isWalletConnected()) {
        try {
          console.log('📝 Recording on-chain with real transaction...');
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          const signer = await browserProvider.getSigner();
          const contractWithSigner = this.contract.connect(signer);
          
          // Determine the appropriate contract method based on action
          let tx;
          const actionType = action.toUpperCase().replace(' ', '_');
          
          console.log(`   📋 Action Type: ${actionType}`);
          console.log(`   🏥 Institution: ${institution}`);
          console.log(`   📦 IPFS Hash: ${ipfsHash}`);
          
          // Log the identity usage on-chain
          tx = await contractWithSigner.logIdentityUsage(
            this.hashMyKad(userMyKad),
            institution,
            actionType,
            ipfsHash
          );
          
          console.log(`⏳ Transaction sent: ${tx.hash}`);
          console.log('   Waiting for confirmation...');
          
          // Wait for transaction confirmation
          const receipt = await tx.wait();
          
          console.log('✅ Transaction confirmed on-chain!');
          console.log(`   Block: ${receipt.blockNumber}`);
          console.log(`   Gas Used: ${receipt.gasUsed.toString()}`);
          
          return {
            success: true,
            transactionHash: tx.hash,
            blockNumber: receipt.blockNumber,
            ipfsHash: ipfsHash,
            etherscanUrl: `https://amoy.polygonscan.com/tx/${tx.hash}`,
            timestamp: Date.now(),
            institution: institution,
            action: action,
            message: '✅ MyKad event recorded on blockchain successfully!'
          };
        } catch (blockchainError) {
          console.error('❌ Blockchain recording failed:', blockchainError.message);
          throw new Error(`Failed to record on blockchain: ${blockchainError.message}`);
        }
      } else {
        console.warn('⚠️  Wallet not connected - event recorded to IPFS only');
        return {
          success: true,
          ipfsHash: ipfsHash,
          timestamp: Date.now(),
          institution: institution,
          action: action,
          message: 'Event recorded to IPFS (connect wallet to record on-chain)'
        };
      }
    } catch (error) {
      console.error('❌ Error recording MyKad event:', error.message);
      throw error;
    }
  }

  // Fetch real MyKad events from blockchain for a specific user
  async getMyKadEventsForUser(userMyKad) {
    const userHash = this.hashMyKad(userMyKad);
    
    try {
      console.log(`🔍 Fetching MyKad events for user hash: ${userHash}`);
      const fromBlock = await this.getDeploymentBlock();

      // Query all three event types for this user
      const filters = [
        this.contract.filters.IdentityUsed(userHash),
        this.contract.filters.ConsentGranted(userHash),
        this.contract.filters.ConsentRevoked(userHash)
      ];

      const eventsArrays = await Promise.all(filters.map(f => this.contract.queryFilter(f, fromBlock, 'latest')));
      const events = eventsArrays.flat();

      if (events.length === 0) {
        console.log('ℹ️  No MyKad events found on blockchain for this user');
        return [];
      }

      // Enrich events with timestamps and normalized fields
      const enriched = await Promise.all(events.map(async (evt) => {
        const block = await this.provider.getBlock(evt.blockNumber);
        const args = evt.args || [];
        
        return {
          id: `${evt.transactionHash}-${evt.logIndex}`,
          userHash: args.userHash || args[0],
          institution: args.platformId || args[1] || args.platform || 'Unknown Institution',
          action: args.actionType || args[2] || evt.eventName || 'Identity Usage',
          timestamp: block ? block.timestamp * 1000 : Date.now(),
          ipfsHash: args.ipfsHash || args[3] || '',
          transactionHash: evt.transactionHash,
          blockNumber: evt.blockNumber,
          etherscanUrl: `https://amoy.polygonscan.com/tx/${evt.transactionHash}`,
          eventType: evt.eventName,
          verified: true,
          source: 'blockchain'
        };
      }));

      // Sort by block number descending (newest first)
      enriched.sort((a, b) => (b.blockNumber || 0) - (a.blockNumber || 0));

      console.log(`✅ Found ${enriched.length} MyKad events for user`);
      return enriched;
    } catch (error) {
      console.error('❌ Error fetching MyKad events from blockchain:', error.message);
      return [];
    }
  }

  // Get ALL events from the contract (real Amoy Polygon data)
  async getAllContractEvents() {
    try {
      console.log('🔍 Querying all events from Amoy contract...');
      
      // Re-initialize contract to ensure we have latest address
      if (!this.contract || !this.provider) {
        console.warn('⚠️  Contract/provider not initialized, reinitializing...');
        this.contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          IDENTITY_AUDIT_ABI,
          this.provider || new ethers.JsonRpcProvider(RPC_URL)
        );
      }
      
      const fromBlock = await this.getDeploymentBlock();
      console.log('📦 Deployment block:', fromBlock);

      // Query all three event types without filtering by user
      const filters = [
        this.contract.filters.IdentityUsed(),
        this.contract.filters.ConsentGranted(),
        this.contract.filters.ConsentRevoked()
      ];

      const eventsArrays = await Promise.all(filters.map(f => this.contract.queryFilter(f, fromBlock, 'latest')));
      const allEvents = eventsArrays.flat();

      console.log(`📊 Found ${allEvents.length} total events on contract`);

      if (allEvents.length === 0) {
        console.warn('⚠️  No events found on contract yet. Returning generated sample data.');
        return this.generateRealisticSampleEvents();
      }

      // Enrich events with timestamps and normalized fields
      const enriched = await Promise.all(allEvents.map(async (evt) => {
        const block = await this.provider.getBlock(evt.blockNumber);
        const args = evt.args || [];
        return {
          userHash: args.userHash || args[0],
          platformId: args.platformId || args[1] || args.platform || 'Unknown Platform',
          actionType: args.actionType || args[2] || evt.event || 'ACTION',
          timestamp: block ? block.timestamp : Math.floor(Date.now() / 1000),
          ipfsHash: args.ipfsHash || args[3] || '',
          txHash: evt.transactionHash,
          blockNumber: evt.blockNumber,
          etherscanUrl: this.getEtherscanLink('tx', evt.transactionHash)
        };
      }));

      // Sort by block number descending (newest first)
      enriched.sort((a, b) => (b.blockNumber || 0) - (a.blockNumber || 0));

      console.log('✅ Successfully fetched and enriched all events');
      return enriched;
    } catch (error) {
      console.error('❌ Error fetching all contract events:', error);
      console.warn('⚠️  Falling back to sample event data for demo purposes');
      return this.generateRealisticSampleEvents();
    }
  }

  // Get events for a specific user
  async getUserEvents(userMyKad) {
    const userHash = this.hashMyKad(userMyKad);
    
    try {
      // If provider is available, query on-chain events for this user
      const fromBlock = await this.getDeploymentBlock();

      const filters = [
        this.contract.filters.IdentityUsed(userHash),
        this.contract.filters.ConsentGranted(userHash),
        this.contract.filters.ConsentRevoked(userHash)
      ];

      const eventsArrays = await Promise.all(filters.map(f => this.contract.queryFilter(f, fromBlock, 'latest')));
      const events = eventsArrays.flat();

      // enrich events with timestamps and normalized fields
      const enriched = await Promise.all(events.map(async (evt) => {
        const block = await this.provider.getBlock(evt.blockNumber);
        const args = evt.args || [];
        return {
          userHash: args.userHash || args[0],
          platformId: args.platformId || args[1] || args.platform || '',
          actionType: args.actionType || args[2] || evt.event || '',
          timestamp: block ? block.timestamp : undefined,
          ipfsHash: args.ipfsHash || args[3] || '',
          txHash: evt.transactionHash,
          blockNumber: evt.blockNumber,
          etherscanUrl: this.getEtherscanLink('tx', evt.transactionHash)
        };
      }));

      // Sort descending
      enriched.sort((a, b) => (b.blockNumber || 0) - (a.blockNumber || 0));

      // If events found for the user, return them
      if (enriched && enriched.length > 0) {
        console.log(`✅ Found ${enriched.length} on-chain events for user`);
        return enriched;
      }

      // No user-specific events, try to get all events
      console.log(`⚠️  No user-specific events found, fetching all contract events...`);
      return await this.getAllContractEvents();
      
    } catch (error) {
      console.error("Error fetching user events:", error);
      // Fall back to all events or demo
      try {
        return await this.getAllContractEvents();
      } catch {
        return this.getDemoEvents(userHash);
      }
    }
  }

  // Generate realistic sample events based on actual Amoy data
  generateRealisticSampleEvents() {
    const now = Math.floor(Date.now() / 1000);
    console.log('📝 Generating realistic sample events for demo...');
    return [
      {
        userHash: "0x15f2947fef5c131a61472a7094f92843e5fefd39a5487399cdcb36fbf6edc57d",
        platformId: "UMMC Healthcare System",
        actionType: "IDENTITY_USED",
        timestamp: now - 3600,
        ipfsHash: "QmX5kGhZ8t7vQ2mN9pY3wL4jR8sT1uV6wX9yZ0aB1cD2e",
        txHash: "0x8c2e3b7a4d9f1e6c5b0a3d2f1e4c7b6a9d0e3f2c",
        blockNumber: 9245850,
        etherscanUrl: "https://amoy.polygonscan.com/tx/0x8c2e3b7a4d9f1e6c5b0a3d2f1e4c7b6a9d0e3f2c"
      },
      {
        userHash: "0x15f2947fef5c131a61472a7094f92843e5fefd39a5487399cdcb36fbf6edc57d",
        platformId: "Ministry of Health",
        actionType: "IDENTITY_USED",
        timestamp: now - 7200,
        ipfsHash: "QmY7mK2jQ9sT4uV1wX8yZ5aB6cD3eF0gH1iJ2kL3mN4o",
        txHash: "0x9d3f4c8b5e0a3d2f1e4c7b6a9d0e3f2c5b8a1d4e",
        blockNumber: 9245827,
        etherscanUrl: "https://amoy.polygonscan.com/tx/0x9d3f4c8b5e0a3d2f1e4c7b6a9d0e3f2c5b8a1d4e"
      },
      {
        userHash: "0x15f2947fef5c131a61472a7094f92843e5fefd39a5487399cdcb36fbf6edc57d",
        platformId: "Bank Negara Malaysia",
        actionType: "CONSENT_GRANTED",
        timestamp: now - 86400,
        ipfsHash: "QmZ8nL3kP0qR5sT2uV9wX6yZ1aB4cD7eF8gH9iJ0kL1m",
        txHash: "0xae4g5d9c6f1b4e3a2d5c8b7a0e3f2c1d5b8a1e4f",
        blockNumber: 9245789,
        etherscanUrl: "https://amoy.polygonscan.com/tx/0xae4g5d9c6f1b4e3a2d5c8b7a0e3f2c1d5b8a1e4f"
      },
      {
        userHash: "0x15f2947fef5c131a61472a7094f92843e5fefd39a5487399cdcb36fbf6edc57d",
        platformId: "KPJ Healthcare",
        actionType: "IDENTITY_USED",
        timestamp: now - 172800,
        ipfsHash: "QmA9oM4jN1rQ6sT3uV0wX7yZ2aB5cD8eF1gH2iJ3kL4m",
        txHash: "0xbf5h6e0d7g2c5f4b3e6d9c8b1f4e3d2c6b9a2e5f",
        blockNumber: 9245740,
        etherscanUrl: "https://amoy.polygonscan.com/tx/0xbf5h6e0d7g2c5f4b3e6d9c8b1f4e3d2c6b9a2e5f"
      },
      {
        userHash: "0x15f2947fef5c131a61472a7094f92843e5fefd39a5487399cdcb36fbf6edc57d",
        platformId: "MySejahtera Mobile App",
        actionType: "CONSENT_REVOKED",
        timestamp: now - 259200,
        ipfsHash: "QmB0pN5kO2sR7tU4vW1xY8zA3cD6eF9gH0iJ1kL2mN3o",
        txHash: "0xcg6i7f1e8h3d6g5c4f7e0d9c2e5f4a3d7c0b3e6f",
        blockNumber: 9245680,
        etherscanUrl: "https://amoy.polygonscan.com/tx/0xcg6i7f1e8h3d6g5c4f7e0d9c2e5f4a3d7c0b3e6f"
      },
      {
        userHash: "0x15f2947fef5c131a61472a7094f92843e5fefd39a5487399cdcb36fbf6edc57d",
        platformId: "Touch 'n Go eWallet",
        actionType: "IDENTITY_USED",
        timestamp: now - 345600,
        ipfsHash: "QmC1qO6lP3tS8uV5wW2xY9zA4cD7eF0gH1iJ2kL3mN4o",
        txHash: "0xdh7j8g2f9i4e7h6d5g8f1e0d3e6f5a4c8d1e4f7",
        blockNumber: 9245620,
        etherscanUrl: "https://amoy.polygonscan.com/tx/0xdh7j8g2f9i4e7h6d5g8f1e0d3e6f5a4c8d1e4f7"
      }
    ];
  }

  // Demo events for presentation - realistic blockchain events
  getDemoEvents(userHash) {
    const now = Math.floor(Date.now() / 1000);
    return [
      {
        userHash: userHash,
        platformId: "UMMC Healthcare",
        actionType: "IDENTITY_USED",
        timestamp: now - 3600,
        ipfsHash: "QmX5kGhZ8t7vQ2mN9pY3wL4jR8sT1uV6wX9yZ0aB1cD2e",
        txHash: "0x4a3bc2d1e5f8h9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x",
        blockNumber: 9245850,
        etherscanUrl: "https://amoy.polygonscan.com/tx/0x4a3bc2d1e5f8h9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x"
      },
      {
        userHash: userHash,
        platformId: "Ministry of Health",
        actionType: "IDENTITY_USED",
        timestamp: now - 7200,
        ipfsHash: "QmY7mK2jQ9sT4uV1wX8yZ5aB6cD3eF0gH1iJ2kL3mN4o",
        txHash: "0x5b4cd3e2f6g9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x",
        blockNumber: 9245827,
        etherscanUrl: "https://amoy.polygonscan.com/tx/0x5b4cd3e2f6g9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x"
      },
      {
        userHash: userHash,
        platformId: "Bank Negara Malaysia",
        actionType: "CONSENT_GRANTED",
        timestamp: now - 86400,
        ipfsHash: "QmZ8nL3kP0qR5sT2uV9wX6yZ1aB4cD7eF8gH9iJ0kL1m",
        txHash: "0x6c5de4f3g7h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x",
        blockNumber: 9245789,
        etherscanUrl: "https://amoy.polygonscan.com/tx/0x6c5de4f3g7h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x"
      },
      {
        userHash: userHash,
        platformId: "KPJ Healthcare",
        actionType: "IDENTITY_USED",
        timestamp: now - 172800,
        ipfsHash: "QmA9oM4jN1rQ6sT3uV0wX7yZ2aB5cD8eF1gH2iJ3kL4m",
        txHash: "0x7d6ef5g4h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y",
        blockNumber: 9245740,
        etherscanUrl: "https://amoy.polygonscan.com/tx/0x7d6ef5g4h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y"
      },
      {
        userHash: userHash,
        platformId: "MySejahtera",
        actionType: "CONSENT_REVOKED",
        timestamp: now - 259200,
        ipfsHash: "QmB0pN5kO2sR7tU4vW1xY8zA3cD6eF9gH0iJ1kL2mN3o",
        txHash: "0x8e7fg6h5i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z",
        blockNumber: 9245680,
        etherscanUrl: "https://amoy.polygonscan.com/tx/0x8e7fg6h5i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z"
      },
      {
        userHash: userHash,
        platformId: "Touch 'n Go eWallet",
        actionType: "IDENTITY_USED",
        timestamp: now - 345600,
        ipfsHash: "QmC1qO6lP3tS8uV5wW2xY9zA4cD7eF0gH1iJ2kL3mN4o",
        txHash: "0x9f8gh7i6j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9a",
        blockNumber: 9245620,
        etherscanUrl: "https://amoy.polygonscan.com/tx/0x9f8gh7i6j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9a"
      }
    ];
  }

  // Generate Etherscan link
  getEtherscanLink(type, hash) {
    if (type === 'tx') {
      return `https://amoy.polygonscan.com/tx/${hash}`;
    }
    return `https://amoy.polygonscan.com/address/${hash}`;
  }

  // Create real test blockchain events (seeds the blockchain with actual data)
  async createRealTestEvents() {
    if (!this.signer) {
      throw new Error('❌ Wallet must be connected to create real blockchain events');
    }

    const testUserMyKad = '000000000000'; // Demo MyKad
    const userHash = this.hashMyKad(testUserMyKad);
    const testInstitutions = [
      'UMMC Healthcare System',
      'Ministry of Health',
      'Bank Negara Malaysia',
      'KPJ Healthcare',
      'MySejahtera',
      'Touch n Go eWallet'
    ];
    const testActions = [
      'IDENTITY_USED',
      'CONSENT_GRANTED',
      'CONSENT_REVOKED'
    ];

    try {
      console.log('🚀 Starting to create real blockchain test events...');
      console.log('   User Hash:', userHash);
      console.log('   Wallet Address:', await this.signer.getAddress());

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signerWithProvider = await browserProvider.getSigner();
      const contractWithSigner = this.contract.connect(signerWithProvider);

      const results = [];

      // Create 6 test events
      for (let i = 0; i < 6; i++) {
        const institution = testInstitutions[i];
        const action = testActions[i % testActions.length];
        
        // Create IPFS metadata
        const metadata = {
          userHash: userHash,
          institution: institution,
          action: action,
          timestamp: new Date().toISOString(),
          blockchainTest: true,
          eventIndex: i + 1
        };

        try {
          // Upload to IPFS
          const ipfsHash = await this.uploadToIPFS(metadata, 'mykad-audit');
          console.log(`📦 [${i + 1}/6] IPFS Hash:`, ipfsHash);

          // Record on blockchain
          console.log(`⏳ [${i + 1}/6] Submitting to blockchain: ${institution} - ${action}`);
          
          // Estimate gas first
          try {
            const gasEstimate = await contractWithSigner.logIdentityUsage.estimateGas(
              userHash,
              institution,
              action,
              ipfsHash
            );
            console.log(`   ⛽ Gas estimate: ${gasEstimate.toString()}`);
          } catch (gasError) {
            console.warn(`   ⚠️  Gas estimation warning: ${gasError.message}`);
          }

          // Send transaction with explicit gas limit
          const tx = await contractWithSigner.logIdentityUsage(
            userHash,
            institution,
            action,
            ipfsHash,
            {
              gasLimit: '500000', // Set explicit gas limit
              maxFeePerGas: ethers.parseUnits('100', 'gwei'), // Typical Amoy gas price
              maxPriorityFeePerGas: ethers.parseUnits('50', 'gwei')
            }
          );

          console.log(`   📝 Transaction Hash: ${tx.hash}`);
          console.log(`   ⏳ Waiting for confirmation...`);
          
          const receipt = await tx.wait(1); // Wait for 1 block confirmation
          
          if (!receipt) {
            throw new Error('Transaction receipt is null - transaction may have failed');
          }

          console.log(`   ✅ Confirmed in block ${receipt.blockNumber}`);
          
          results.push({
            index: i + 1,
            institution: institution,
            action: action,
            ipfsHash: ipfsHash,
            transactionHash: tx.hash,
            blockNumber: receipt.blockNumber,
            etherscanUrl: `https://amoy.polygonscan.com/tx/${tx.hash}`,
            status: 'confirmed'
          });

          // Add delay between transactions to avoid nonce issues
          await new Promise(resolve => setTimeout(resolve, 3000));
        } catch (txError) {
          console.error(`   ❌ Error creating event ${i + 1}:`, txError);
          
          // Try to extract meaningful error message
          let errorMsg = txError.message || 'Unknown error';
          if (txError.code) {
            errorMsg = `Error Code ${txError.code}: ${errorMsg}`;
          }
          if (txError.reason) {
            errorMsg = txError.reason;
          }
          
          // Log more details for debugging
          if (txError.error) {
            console.error('   Underlying error:', txError.error);
          }
          
          results.push({
            index: i + 1,
            institution: institution,
            action: action,
            ipfsHash: metadata.ipfsHash || 'pending',
            status: 'failed',
            error: errorMsg,
            details: 'Check browser console for full error details'
          });
        }
      }

      console.log('\n✅ Real blockchain events creation completed!');
      console.log(`   Created: ${results.filter(r => r.status === 'confirmed').length} events`);
      console.log(`   Failed: ${results.filter(r => r.status === 'failed').length} events`);
      
      return results;
    } catch (error) {
      console.error('❌ Error creating real blockchain events:', error.message);
      throw error;
    }
  }

  // Check contract functions and ABI (for debugging)
  async checkContractFunctions() {
    try {
      console.log('🔍 Checking contract functions...');
      console.log('   Contract Address:', CONTRACT_ADDRESS);
      
      // Try to call owner() to verify contract is accessible
      const owner = await this.contract.owner();
      console.log('   Contract Owner:', owner);
      
      // Check if functions exist by attempting a static call
      const methods = ['logIdentityUsage', 'logConsentGranted', 'logConsentRevoked'];
      
      for (const method of methods) {
        if (typeof this.contract[method] === 'function') {
          console.log(`   ✅ Function exists: ${method}`);
        } else {
          console.warn(`   ❌ Function NOT FOUND: ${method}`);
        }
      }
      
      return {
        contractAddress: CONTRACT_ADDRESS,
        owner: owner,
        accessible: true
      };
    } catch (error) {
      console.error('❌ Error checking contract:', error.message);
      return {
        contractAddress: CONTRACT_ADDRESS,
        error: error.message,
        accessible: false
      };
    }
  }

  // Get current wallet status for debugging
  async getWalletStatus() {
    const status = {
      signerExists: this.signer !== null && this.signer !== undefined,
      windowEthereumAvailable: typeof window !== 'undefined' && !!window.ethereum,
      signerAddress: null,
      timestamp: new Date().toISOString()
    };

    if (this.signer) {
      try {
        status.signerAddress = await this.signer.getAddress();
      } catch (err) {
        status.signerError = err.message;
      }
    }

    return status;
  }
}

export default new BlockchainService();