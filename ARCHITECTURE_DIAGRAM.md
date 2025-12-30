# 🏗️ Blockchain Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   NEXTGUARD ID - MyKad System                   │
└─────────────────────────────────────────────────────────────────┘

                         USER INTERFACE
┌──────────────────────────────────────────────────────────────────┐
│  React 18+ Application (TypeScript + Vite + Tailwind CSS)       │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ MyKad Audit Trail Page                                      │ │
│  │ • Connect Wallet Button                                     │ │
│  │ • Real blockchain events table                              │ │
│  │ • Transaction hash verification                             │ │
│  │ • Block number display                                      │ │
│  │ • Polygonscan links                                         │ │
│  │ • IPFS metadata inspection                                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                            ↓
                  CUSTOM REACT HOOK
┌──────────────────────────────────────────────────────────────────┐
│  useBlockchainEvents(userMyKad)                                  │
│  • Manages wallet connection state                               │
│  • Fetches blockchain events                                     │
│  • Records new events                                            │
│  • Handles errors & loading                                      │
│  • Provides isWalletConnected status                             │
└──────────────────────────────────────────────────────────────────┘
                            ↓
                   BLOCKCHAIN SERVICE
┌──────────────────────────────────────────────────────────────────┐
│  BlockchainService (src/lib/blockchain.js)                      │
│                                                                   │
│  connectWallet()             recordMyKadEvent()                  │
│  • Opens MetaMask           • Creates metadata                   │
│  • Connects to Polygon      • Uploads to IPFS                    │
│  • Gets signer              • Records on blockchain              │
│  • Sets contract instance   • Returns TX hash + block            │
│                                                                   │
│  getMyKadEventsForUser()    uploadToIPFS()                      │
│  • Queries contract         • Uploads JSON to Pinata             │
│  • Filters by user hash     • Returns IPFS CID                   │
│  • Enriches with timestamps • Handles JWT auth                   │
│  • Sorts by block desc.     • Falls back to demo mode            │
└──────────────────────────────────────────────────────────────────┘
                            ↓↓↓
         ┌────────────────┬────────────────┬────────────────┐
         ↓                ↓                ↓                ↓
    MetaMask         Polygon RPC      Pinata IPFS      Smart Contract
    Wallet           Amoy Testnet     Gateway          Audit Trail
┌──────────────────┬──────────────┬──────────────────┬───────────────┐
│ User signs       │ Transaction  │ Metadata stored  │ Events logged  │
│ transactions     │ broadcast    │ on IPFS          │ on-chain       │
│ via popup        │ to network   │ Distributed      │ Immutable      │
│ Approves gas     │ Mined in     │ Redundant        │ Verifiable     │
│ fees             │ block        │ Encrypted        │ Searchable     │
└──────────────────┴──────────────┴──────────────────┴───────────────┘
         ↑                ↑                ↑                ↑
         └────────────────┴────────────────┴────────────────┘
                            ↓
                    VERIFICATION LAYER
┌──────────────────────────────────────────────────────────────────┐
│  Polygonscan Explorer       │    IPFS Gateway                    │
│  https://amoy.polygonscan   │    https://gateway.pinata.cloud    │
│  • View TX details          │    • Download metadata JSON        │
│  • See block number         │    • Verify event details          │
│  • Check gas used           │    • Confirm timestamp             │
│  • Review function calls     │    • Inspect all data              │
└──────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Recording an Event

```
User Action (MyKad Request)
        ↓
    [useBlockchainEvents Hook]
        ↓
    Check: Wallet Connected?
    ↙                    ↘
   YES                   NO
   ↓                     ↓
Real TX             IPFS Only
   ↓                     ↓
[recordMyKadEvent]  Skip blockchain
   ↓
Create JSON Metadata:
{
  eventType: "MyKad Usage",
  userHash: keccak256(myKad),
  institution: "Hospital",
  action: "Medical Records Access",
  timestamp: ISO string,
  details: {...}
}
   ↓
[uploadToIPFS]
   ↓
   POST to Pinata API
   ↓
   Get IPFS CID
   (e.g., QmX5kGhZ8...)
   ↓
   [recordMyKadEvent continues]
   ↓
   Contract.logIdentityUsage(
     userHash,
     institution,
     action,
     ipfsHash
   )
   ↓
   MetaMask Shows:
   - Function: logIdentityUsage
   - Gas Estimate: ~100k
   - Network: Polygon Amoy
   ↓
   User Approves in MetaMask
   ↓
   [tx.wait()]
   ↓
   Transaction Mined
   ↓
   Return:
   {
     success: true,
     transactionHash: "0x8c2e3b7a...",
     blockNumber: 9245850,
     ipfsHash: "QmX5kGhZ8...",
     etherscanUrl: "https://amoy.polygonscan.com/tx/0x8c2e...",
     timestamp: 1705326645000
   }
   ↓
   Display in UI with
   Polygonscan Link
```

---

## Data Flow: Fetching Events

```
Component Renders (MyKadAuditTrailPage)
        ↓
[useBlockchainEvents(userMyKad)]
        ↓
useEffect triggers on mount
        ↓
[getMyKadEventsForUser]
        ↓
Get contract deployment block
        ↓
Query filters:
- IdentityUsed(userHash)
- ConsentGranted(userHash)
- ConsentRevoked(userHash)
        ↓
Call: contract.queryFilter(filter, fromBlock, 'latest')
        ↓
Receive raw events from Polygon RPC
        ↓
For each event:
  - Get block object (contains timestamp)
  - Extract args array
  - Normalize field names
  - Build etherscanUrl
        ↓
Sort by blockNumber descending
        ↓
Return enriched events array:
[
  {
    id: "0x8c2e3b7a...#0",
    userHash: "0x15f2947f...",
    institution: "UMMC Healthcare",
    action: "IDENTITY_USED",
    timestamp: 1705326645000,
    ipfsHash: "QmX5kGhZ8...",
    transactionHash: "0x8c2e3b7a...",
    blockNumber: 9245850,
    etherscanUrl: "https://amoy.polygonscan.com/tx/...",
    verified: true,
    source: "blockchain"
  },
  ...
]
        ↓
Display in Table:
- Date/Time from timestamp
- Institution name
- Action type with icon
- Block number badge
- View Proof button
```

---

## Network Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S COMPUTER                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Browser                                          │  │
│  │ • React App                                      │  │
│  │ • ethers.js v6                                   │  │
│  │ • MetaMask Extension                             │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
        ↓ HTTPS ↓ JSON-RPC ↓ ethers.BrowserProvider
┌─────────────────────────────────────────────────────────┐
│                  PUBLIC INFRASTRUCTURE                  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Polygon Amoy RPC                                 │  │
│  │ https://rpc-amoy.polygon.technology/             │  │
│  │ • Receives transactions                          │  │
│  │ • Broadcasts to validators                       │  │
│  │ • Returns receipts & events                      │  │
│  │ • Syncs latest block data                        │  │
│  └──────────────────────────────────────────────────┘  │
│                         ↓                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Polygon Amoy Network                             │  │
│  │ • ChainID: 80002                                 │  │
│  │ • Validators: Consensus                          │  │
│  │ • Blocks: Created every ~2 seconds               │  │
│  │ • Gas: Proof-of-Stake                            │  │
│  └──────────────────────────────────────────────────┘  │
│                         ↓                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Smart Contract                                   │  │
│  │ 0xb81988826bA44D5657309690b79a1137786cEb3d     │  │
│  │ • logIdentityUsage()                             │  │
│  │ • logConsentGranted()                            │  │
│  │ • logConsentRevoked()                            │  │
│  │ • Event logs                                     │  │
│  └──────────────────────────────────────────────────┘  │
│                         ↓                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Polygonscan Explorer                             │  │
│  │ https://amoy.polygonscan.com                     │  │
│  │ • Indexes blocks & transactions                  │  │
│  │ • Provides readable UI                           │  │
│  │ • Shows event details                            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
        ↓ HTTPS ↓ pinata.cloud API
┌─────────────────────────────────────────────────────────┐
│                    PINATA IPFS                          │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Pinata Cloud (pinata.cloud)                      │  │
│  │ • Receives JSON via POST                         │  │
│  │ • Validates JWT authentication                   │  │
│  │ • Returns IPFS CID                               │  │
│  │ • Pins content for redundancy                    │  │
│  └──────────────────────────────────────────────────┘  │
│                         ↓                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ IPFS Network                                     │  │
│  │ • Distributed content storage                    │  │
│  │ • Content-addressed (hash-based)                 │  │
│  │ • Redundant across nodes                         │  │
│  │ • Accessible via gateway.pinata.cloud            │  │
│  └──────────────────────────────────────────────────┘  │
│                         ↓                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ IPFS Gateway (gateway.pinata.cloud/ipfs/...)     │  │
│  │ • HTTP access to IPFS content                    │  │
│  │ • Human-readable view of JSON                    │  │
│  │ • Downloadable metadata                          │  │
│  │ • Verification point for users                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────┐
│           MyKadAuditTrailPage.tsx (React)               │
│                                                          │
│  • Renders audit trail UI                              │
│  • Calls useBlockchainEvents hook                      │
│  • Displays events in table                            │
│  • Shows "Connect Wallet" button                       │
│  • Renders proof dialogs on click                      │
└─────────────────────────────────────────────────────────┘
                        ↓ uses
┌─────────────────────────────────────────────────────────┐
│      useBlockchainEvents.ts (Custom Hook)              │
│                                                          │
│  State:                                                │
│  • events: BlockchainEvent[]                          │
│  • loading: boolean                                    │
│  • error: string | null                                │
│  • isWalletConnected: boolean                          │
│                                                          │
│  Methods:                                              │
│  • connectWallet() → boolean                           │
│  • fetchEvents(myKad) → void                           │
│  • recordEvent(inst, action) → TxResult | null        │
│  • checkWalletStatus() → void                          │
└─────────────────────────────────────────────────────────┘
                        ↓ calls
┌─────────────────────────────────────────────────────────┐
│   BlockchainService (blockchain.js)                     │
│                                                          │
│  Core Methods:                                         │
│                                                          │
│  connectWallet()                                       │
│  └─ Creates ethers.BrowserProvider                    │
│     └─ Gets signer from MetaMask                      │
│     └─ Returns connected status                       │
│                                                          │
│  recordMyKadEvent(myKad, inst, action, details)       │
│  ├─ Create metadata JSON                              │
│  ├─ uploadToIPFS(metadata)                            │
│  │  └─ POST to pinata.cloud                           │
│  │  └─ Returns IPFS CID                               │
│  ├─ contract.logIdentityUsage()                       │
│  │  └─ Send TX to Polygon RPC                         │
│  │  └─ Wait for confirmation                          │
│  └─ Return {txHash, blockNumber, ipfsHash}            │
│                                                          │
│  getMyKadEventsForUser(myKad)                          │
│  ├─ Hash MyKad with keccak256                         │
│  ├─ contract.queryFilter(filters)                     │
│  │  └─ Query Polygon RPC for events                   │
│  ├─ Enrich with block timestamps                      │
│  └─ Return sorted event array                         │
│                                                          │
│  uploadToIPFS(obj, fileType)                           │
│  ├─ Check for VITE_WEB3_STORAGE_TOKEN                 │
│  ├─ POST JSON to pinata.cloud/pinning/pinJSONToIPFS  │
│  ├─ Handle JWT auth header                            │
│  └─ Return IPFS CID (or generate demo)                │
└─────────────────────────────────────────────────────────┘
                        ↓↓↓
        ┌───────────────┬───────────────┬─────────────┐
        ↓               ↓               ↓             ↓
  window.ethereum   Polygon RPC    Pinata API    ethers.js
  (MetaMask)        Network         IPFS          Library
  • Request accts   • JSON-RPC      • Upload      • keccak256
  • Sign TXs        • Send TX        • JWT Auth    • Contract
  • Chain events    • Get events     • Pinning     • Provider
                    • Query blocks               • Signer
```

---

## State Management Flow

```
Initial State:
{
  events: [],
  loading: false,
  error: null,
  isWalletConnected: false
}
        ↓
useEffect on mount:
  checkWalletStatus()
        ↓
User clicks "Connect Wallet":
  connectWallet()
  ├─ loading = true
  ├─ Connect to MetaMask
  ├─ loading = false
  └─ isWalletConnected = true
        ↓
Auto-fetch events:
  fetchEvents(userMyKad)
  ├─ loading = true
  ├─ getMyKadEventsForUser()
  ├─ Receive array of events
  ├─ events = array
  ├─ loading = false
  └─ Re-render with data
        ↓
User clicks "Record Event":
  recordEvent(institution, action)
  ├─ loading = true
  ├─ recordMyKadEvent()
  ├─ Returns {success, txHash, block}
  ├─ Auto-refetch events
  ├─ events = updated array
  ├─ loading = false
  └─ Show success notification
        ↓
Error occurs:
  Any async error
  ├─ loading = false
  ├─ error = "error message"
  └─ Display error alert
```

---

## Security Model

```
┌─────────────────────────────────────────────────────────┐
│                   Security Layers                       │
└─────────────────────────────────────────────────────────┘

Layer 1: User Authentication
├─ MetaMask private key kept by user
├─ User approves each transaction
├─ No private keys sent to server
└─ User controls all wallet operations

Layer 2: Data Anonymization
├─ MyKad number → keccak256 hash
├─ Hash stored on-chain (not original)
├─ Full MyKad number never exposed
└─ Verifiable but private

Layer 3: Transaction Security
├─ Signed by user's private key
├─ Can only be processed by that signer
├─ Cryptographically verified
└─ Tamper-proof

Layer 4: Smart Contract Security
├─ Only logs events (no modifications)
├─ Events are immutable (append-only)
├─ No delete functionality
├─ No external admin controls

Layer 5: IPFS Storage
├─ Content-addressed (hash-verified)
├─ Pinned across multiple nodes
├─ No password authentication
├─ JWT auth for uploads

Layer 6: Data Privacy
├─ No personal data on-chain
├─ Medical records NOT stored
├─ Only access events recorded
├─ Compliant with PDPA

Layer 7: Network Security
├─ HTTPS for all communications
├─ Polygon network consensus
├─ Proof-of-Stake validators
└─ 13+ block finality
```

---

## Performance Characteristics

```
Operation                    Time        Network    Gas Cost
─────────────────────────────────────────────────────────────
Connect Wallet              Instant     None       None
(MetaMask popup)

Fetch Events (1st time)     2-5s        Polygon    None
(Query contract)            RPC         (read only)

Fetch Events (cached)       <100ms      Browser    None
                            Cache

Upload to IPFS              1-3s        Pinata     None
                            API

Record Event (1 TX)         5-15s       Polygon    ~100k gas
(Including wait)            Network     (~$0.01)

View Proof Dialog           Instant     None       None

Verify on Polygonscan       Instant     HTTPS      None
(Load webpage)
```

---

## Integration Points

```
Frontend ←→ MetaMask
  • Method: window.ethereum.request()
  • Auth: User approves popup
  • Data: Transaction parameters
  • Return: TX hash, signature

Frontend ←→ Polygon RPC
  • Method: ethers.JsonRpcProvider
  • Auth: None (public endpoint)
  • Data: Contract calls, queries
  • Return: TX receipts, events

Frontend ←→ Pinata API
  • Method: fetch() with JWT header
  • Auth: Bearer token
  • Data: JSON metadata
  • Return: IPFS CID

Frontend ←→ Smart Contract
  • Method: ethers.Contract.connect()
  • Auth: Signer from MetaMask
  • Data: Function calls
  • Return: TX hash, receipt

Polygonscan ←→ Polygon Blockchain
  • Method: Block explorer indexing
  • Auth: None (public)
  • Data: Blockchain data
  • Return: Human-readable UI

IPFS Gateway ←→ IPFS Network
  • Method: Content-addressed retrieval
  • Auth: None (public)
  • Data: File CID
  • Return: JSON content
```

---

## Deployment Architecture

```
Development (Current)
├─ Polygon Amoy Testnet
│  ├─ RPC: https://rpc-amoy.polygon.technology/
│  ├─ Contract: 0xb81988826bA44D5657309690b79a1137786cEb3d
│  ├─ Gas: Free test MATIC from faucet
│  └─ Purpose: Development & testing
│
└─ Pinata (Free tier)
   ├─ JWT: From pinata.cloud account
   ├─ Limit: Free tier rate limit
   └─ Purpose: IPFS development storage

Production (Future)
├─ Polygon Mainnet
│  ├─ RPC: https://polygon-rpc.com/
│  ├─ Contract: TBD (new deployment)
│  ├─ Gas: Real MATIC tokens
│  └─ Purpose: Live user data
│
├─ Pinata (Paid tier)
│  ├─ JWT: Production API key
│  ├─ Limit: High rate limit
│  └─ Purpose: Production IPFS storage
│
└─ Monitoring
   ├─ Sentry: Error tracking
   ├─ Chainlink: Price feed
   ├─ Alerts: Gas spike alerts
   └─ Logs: Blockchain event logs
```

---

This architecture provides:
✅ **Decentralization**: Users control their data via MetaMask
✅ **Immutability**: Events recorded on blockchain forever
✅ **Privacy**: No personal data stored on-chain
✅ **Transparency**: Verifiable via public blockchain explorers
✅ **Scalability**: Polygon mainnet for millions of users
✅ **Cost-Effective**: Minimal gas fees on Layer-2
✅ **User-Friendly**: Simple React integration
