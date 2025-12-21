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

  // Mock blockchain interaction (for hackathon demo)
  async logConsent(userMyKad, platform, action) {
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

  // Get events for a user
  async getUserEvents(userMyKad) {
    const userHash = this.hashMyKad(userMyKad);
    
    try {
      // For demo - return mock events
      return this.getDemoEvents(userHash);
      
      // Real implementation:
      // const filter = this.contract.filters.IdentityUsed(userHash);
      // return await this.contract.queryFilter(filter, 0, 'latest');
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