import { ethers } from 'ethers';

// Contract ABI (simplified for demo)
const IDENTITY_AUDIT_ABI = [
  "event IdentityUsed(bytes32 indexed userHash, string platformId, string actionType, uint256 timestamp, string ipfsHash)",
  "event ConsentGranted(bytes32 indexed userHash, string platformId, uint256 timestamp, string ipfsHash)",
  "event ConsentRevoked(bytes32 indexed userHash, string platformId, uint256 timestamp, string ipfsHash)",
  "function logIdentityUsage(bytes32 userHash, string platformId, string actionType, string ipfsHash)",
  "function logConsentGranted(bytes32 userHash, string platformId, string ipfsHash)",
  "function logConsentRevoked(bytes32 userHash, string platformId, string ipfsHash)",
  "function owner() view returns (address)"
];

// Your deployed contract
export const CONTRACT_ADDRESS = "0xb81988826bA44D5657309690b79a1137786cEb3d";

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
  }

  // Connect wallet (for demo, we'll simulate)
  async connectWallet() {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.signer = new ethers.BrowserProvider(window.ethereum).getSigner();
      return true;
    }
    return false;
  }

  // Hash MyKad (demo-safe)
  hashMyKad(mykadNumber) {
    return ethers.keccak256(ethers.toUtf8Bytes(mykadNumber));
  }

  // Upload JSON data to IPFS via web3.storage (Vite env: VITE_WEB3_STORAGE_TOKEN)
  async uploadToIPFS(jsonObj) {
    const token = typeof window !== 'undefined' ? import.meta.env.VITE_WEB3_STORAGE_TOKEN : process.env.VITE_WEB3_STORAGE_TOKEN;
    if (!token) {
      throw new Error('Missing VITE_WEB3_STORAGE_TOKEN environment variable for IPFS upload');
    }

    const body = JSON.stringify(jsonObj);

    const res = await fetch('https://api.web3.storage/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/octet-stream'
      },
      body: new Blob([body], { type: 'application/json' })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`IPFS upload failed: ${res.status} ${text}`);
    }

    const data = await res.json();
    return data.cid; // return the CID
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
    
    const userHash = this.hashMyKad(userMyKad);
    const contractWithSigner = this.contract.connect(this.signer);
    
    const tx = await contractWithSigner.logIdentityUsage(
      userHash,
      platform,
      action,
      ipfsHash
    );
    
    await tx.wait();
    
    return {
      hash: tx.hash,
      etherscanUrl: `https://amoy.polygonscan.com/tx/${tx.hash}`
    };
  }

  // Upload consent metadata to IPFS and then log on-chain (requires wallet connected)
  async logConsentWithIPFS(userMyKad, platform, action, metadataObj) {
    const cid = await this.uploadToIPFS(metadataObj);
    const ipfsHash = cid;
    const txResult = await this.logConsentReal(userMyKad, platform, action, ipfsHash);
    return { ...txResult, ipfsHash };
  }

  // Get events for a user
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

      // If no events found for the user on-chain, fall back to demo events for UI clarity
      if (!enriched || enriched.length === 0) {
        console.warn(`No on-chain events found for user ${userHash}, returning demo events.`);
        return this.getDemoEvents(userHash);
      }

      return enriched;
      
    } catch (error) {
      console.error("Error fetching events:", error);
      return this.getDemoEvents(userHash);
    }
  }

  // Demo events for presentation
  getDemoEvents(userHash) {
    return [
      {
        userHash: userHash,
        platformId: "Bank Negara Malaysia",
        actionType: "LOGIN",
        timestamp: Math.floor(Date.now() / 1000) - 86400,
        ipfsHash: "QmDemo1",
        etherscanUrl: "https://amoy.polygonscan.com/tx/0x4a3bc2d1..."
      },
      {
        userHash: userHash,
        platformId: "MySejahtera",
        actionType: "CONSENT_GRANTED",
        timestamp: Math.floor(Date.now() / 1000) - 172800,
        ipfsHash: "QmDemo2",
        etherscanUrl: "https://amoy.polygonscan.com/tx/0x5b4cd3e2..."
      },
      {
        userHash: userHash,
        platformId: "Touch 'n Go eWallet",
        actionType: "CONSENT_REVOKED",
        timestamp: Math.floor(Date.now() / 1000) - 259200,
        ipfsHash: "QmDemo3",
        etherscanUrl: "https://amoy.polygonscan.com/tx/0x6c5de4f3..."
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
}

export default new BlockchainService();