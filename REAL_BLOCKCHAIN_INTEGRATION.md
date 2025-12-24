# Real Blockchain Integration Guide

## Overview

The NextGuard ID system now supports **REAL blockchain transactions** on Polygon Amoy testnet. All MyKad audit trail events are recorded on-chain with verifiable transaction hashes and IPFS metadata storage.

## How It Works

### 1. **Event Recording Flow**

When a user interacts with the system:

1. **User Action**: Institution requests MyKad access
2. **Metadata Creation**: Event details are packaged into JSON
3. **IPFS Upload**: Metadata uploaded to Pinata IPFS (returns CID)
4. **Blockchain Record**: Transaction hash stored on Polygon Amoy contract
5. **Verification**: Real transaction hash visible on Polygonscan

### 2. **Blockchain Infrastructure**

```
Network: Polygon Amoy (testnet)
Contract: 0xb81988826bA44D5657309690b79a1137786cEb3d
RPC: https://rpc-amoy.polygon.technology/
Blockchain Explorer: https://amoy.polygonscan.com
IPFS Gateway: https://gateway.pinata.cloud/ipfs/
```

### 3. **IPFS Metadata Storage**

Each event stores metadata on Pinata IPFS:

```json
{
  "eventType": "MyKad Usage",
  "userHash": "0x15f2947fef5c131a61472a7094f92843e5fefd39a5487399cdcb36fbf6edc57d",
  "institution": "UMMC Healthcare System",
  "action": "IDENTITY_USED",
  "timestamp": "2024-01-15T10:30:45.000Z",
  "details": {},
  "chainId": 80002,
  "recordedAt": "2024-01-15T10:30:45.000Z"
}
```

## API Reference

### BlockchainService Methods

#### `connectWallet()`
Connects to MetaMask wallet on Polygon Amoy testnet.

```javascript
const success = await blockchainService.connectWallet();
if (success) {
    console.log('Wallet connected');
}
```

#### `recordMyKadEvent(userMyKad, institution, action, details)`
Records a MyKad event on blockchain with IPFS metadata.

```javascript
const result = await blockchainService.recordMyKadEvent(
    '000000000000',           // MyKad number
    'UMMC Healthcare',         // Institution name
    'Medical Records Access',  // Action description
    {                          // Optional details
        department: 'Cardiology',
        requestReason: 'Patient checkup'
    }
);

// Result structure:
// {
//     success: true,
//     transactionHash: "0x...",      // Real blockchain TX hash
//     blockNumber: 9245850,           // Block on Polygon Amoy
//     ipfsHash: "QmX5kGhZ8...",       // Metadata CID
//     etherscanUrl: "https://...",    // Polygonscan link
//     timestamp: 1705326645000,       // Unix timestamp
//     institution: "UMMC Healthcare",
//     action: "Medical Records Access"
// }
```

#### `getMyKadEventsForUser(userMyKad)`
Fetches all recorded blockchain events for a user.

```javascript
const events = await blockchainService.getMyKadEventsForUser('000000000000');

// Returns array of events with real blockchain data:
// [
//     {
//         id: "0x8c2e3b7a...#0",
//         userHash: "0x15f2947f...",
//         institution: "UMMC Healthcare System",
//         action: "IDENTITY_USED",
//         timestamp: 1705326645000,
//         ipfsHash: "QmX5kGhZ8...",
//         transactionHash: "0x8c2e3b7a...",
//         blockNumber: 9245850,
//         etherscanUrl: "https://amoy.polygonscan.com/tx/0x8c2e3b7a...",
//         verified: true,
//         source: "blockchain"
//     },
//     // ... more events
// ]
```

#### `uploadToIPFS(jsonObj, fileType)`
Uploads metadata to Pinata IPFS.

```javascript
const cid = await blockchainService.uploadToIPFS(
    { /* your data */ },
    'mykad-audit'  // File type for metadata tagging
);
// Returns: "QmX5kGhZ8t7vQ2mN9pY3wL4jR8sT1uV6wX9yZ0aB1cD2e"
```

## React Hook: `useBlockchainEvents`

Custom hook for managing blockchain events in React components:

```typescript
const {
    events,                  // Array of blockchain events
    loading,                 // Loading state
    error,                   // Error message
    isWalletConnected,       // Wallet connection status
    connectWallet,           // Function to connect wallet
    fetchEvents,             // Function to fetch events
    recordEvent,             // Function to record new event
    checkWalletStatus        // Check wallet status
} = useBlockchainEvents(userMyKad);
```

### Usage Example

```typescript
import { useBlockchainEvents } from '@/hooks/useBlockchainEvents';

export function MyAuditPage() {
    const {
        events,
        loading,
        isWalletConnected,
        connectWallet,
        recordEvent
    } = useBlockchainEvents('000000000000');

    const handleRecordEvent = async () => {
        const result = await recordEvent(
            'Hospital Name',
            'Medical Records Access'
        );
        if (result.success) {
            console.log('Event recorded:', result.transactionHash);
        }
    };

    return (
        <div>
            {!isWalletConnected && (
                <button onClick={connectWallet}>Connect Wallet</button>
            )}
            {isWalletConnected && (
                <button onClick={handleRecordEvent}>Record Event</button>
            )}
            {events.map(event => (
                <div key={event.id}>
                    <p>{event.institution} - {event.action}</p>
                    <a href={event.etherscanUrl} target="_blank">
                        View on Polygonscan
                    </a>
                </div>
            ))}
        </div>
    );
}
```

## Environment Configuration

### Required Environment Variables

1. **VITE_WEB3_STORAGE_TOKEN** (Optional, for real IPFS uploads)
   - Get a Pinata JWT token from https://pinata.cloud
   - Format: `eyJ...` (JWT token)
   - Without this, system falls back to demo mode with generated CIDs

```env
VITE_WEB3_STORAGE_TOKEN=your_pinata_jwt_token_here
```

### Polygon Amoy Testnet Setup

1. **Add Network to MetaMask**
   - Network Name: `Polygon Amoy`
   - RPC URL: `https://rpc-amoy.polygon.technology/`
   - Chain ID: `80002`
   - Currency: `MATIC`
   - Block Explorer: `https://amoy.polygonscan.com`

2. **Get Test MATIC**
   - Visit: https://www.faucet.polygon.technology/
   - Select: Polygon Amoy (Testnet)
   - Get test MATIC tokens for gas fees

## Data Flow Diagram

```
User Action
    ↓
Create Metadata JSON
    ↓
Upload to Pinata IPFS → Get CID
    ↓
Record on Polygon Contract with IPFS CID
    ↓
MetaMask Confirmation (user signs)
    ↓
Transaction broadcast to Polygon Amoy RPC
    ↓
Transaction mined into block
    ↓
Real Transaction Hash returned
    ↓
Display on UI with Polygonscan link
    ↓
User can verify on blockchain explorer
```

## Verification Steps

### 1. **Via Application UI**
- Navigate to "MyKad Audit Trail" page
- Connect MetaMask wallet
- View all recorded blockchain events
- Click "View Proof" to see transaction details

### 2. **Via Polygonscan Explorer**
- Go to: https://amoy.polygonscan.com
- Search transaction hash (e.g., `0x8c2e3b7a...`)
- View contract address: `0xb81988826bA44D5657309690b79a1137786cEb3d`
- See function calls and event emissions

### 3. **Via IPFS Gateway**
- Go to: https://gateway.pinata.cloud/ipfs/`{IPFS_CID}`
- View metadata JSON stored on distributed IPFS network
- Verify event details and timestamps

### 4. **Via Smart Contract**
- Contract Explorer: https://amoy.polygonscan.com/address/0xb81988826bA44D5657309690b79a1137786cEb3d
- View all events emitted: `IdentityUsed`, `ConsentGranted`, `ConsentRevoked`
- Filter by user hash to see their complete audit trail

## Production Deployment

### Before Going Live

1. **Move to Polygon Mainnet**
   ```javascript
   // Update in blockchain.js:
   const RPC_URL = "https://polygon-rpc.com/"; // Mainnet RPC
   const CONTRACT_ADDRESS = "0x..."; // Deploy new contract
   ```

2. **Deploy Smart Contract to Mainnet**
   ```bash
   cd blockchain
   npx hardhat run scripts/deploy.js --network polygon
   ```

3. **Real IPFS Setup**
   - Create Pinata account: https://pinata.cloud
   - Generate API keys (JWT token)
   - Store in production environment variables

4. **Security Checklist**
   - Contract audited by security firm
   - Private key management via secure wallet
   - Rate limiting on blockchain calls
   - Error handling and fallback mechanisms
   - Regular blockchain event backups

### Gas Fee Optimization

- Events are batched where possible
- Metadata stored on IPFS (cheaper than full data on-chain)
- Only transaction hash + IPFS CID stored on blockchain
- Estimated cost per event: $0.01-$0.05 USD on Polygon

## Troubleshooting

### Issue: "Wallet not connected"
**Solution**: Click "Connect Wallet" button → Approve in MetaMask → Ensure Polygon Amoy network selected

### Issue: "IPFS upload failed"
**Solution**: 
- Check VITE_WEB3_STORAGE_TOKEN is set correctly
- Verify Pinata account has API quota
- System falls back to demo mode if token missing

### Issue: "Transaction failed"
**Solution**:
- Ensure wallet has sufficient MATIC for gas
- Check Polygon Amoy network is selected
- Verify contract address is correct
- Check RPC endpoint status

### Issue: "Can't view event on Polygonscan"
**Solution**:
- Wait 15-30 seconds for transaction to be mined
- Check transaction hash is correct
- Verify you're on: https://amoy.polygonscan.com (not mainnet)

## Example Real-World Scenario

```
1. Patient arrives at hospital
2. Hospital requests access to MyKad via NextGuard ID
3. User sees real-time approval modal
4. User confirms with their phone (MetaMask popup)
5. Event metadata created:
   {
     "institution": "UMMC Hospital",
     "action": "Medical Records Access",
     "timestamp": "2024-01-15T10:30:45Z"
   }
6. Metadata uploaded to Pinata: QmX5kGhZ8...
7. Transaction sent to blockchain with IPFS hash
8. MetaMask confirms transaction
9. Real transaction hash: 0x8c2e3b7a...
10. Block 9245850 on Polygon Amoy
11. User navigates to audit trail
12. Sees event with clickable Polygonscan link
13. Can verify metadata on IPFS gateway
14. Complete immutable proof of when access occurred
```

## API Endpoints (Contract ABI)

```solidity
// Write Functions
function logIdentityUsage(
    bytes32 userHash,
    string platform,
    string actionType,
    string ipfsHash
) external

function logConsentGranted(
    bytes32 userHash,
    string platform,
    string ipfsHash
) external

function logConsentRevoked(
    bytes32 userHash,
    string platform,
    string ipfsHash
) external

// Events
event IdentityUsed(
    bytes32 indexed userHash,
    string platformId,
    string actionType,
    uint256 timestamp,
    string ipfsHash
)

event ConsentGranted(
    bytes32 indexed userHash,
    string platformId,
    uint256 timestamp,
    string ipfsHash
)

event ConsentRevoked(
    bytes32 indexed userHash,
    string platformId,
    uint256 timestamp,
    string ipfsHash
)

// Read Functions
function getOwner() external view returns (address)
```

---

**Last Updated**: January 2024
**Status**: Production Ready on Polygon Amoy Testnet
**Support**: Check console logs for detailed blockchain interaction details
