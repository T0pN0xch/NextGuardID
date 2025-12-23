# Query/History API - Audit Trail Implementation

## Overview

The Query/History API enables users to retrieve their complete, immutable identity audit trail from the blockchain and IPFS. This is **critical for your hackathon pitch** because it demonstrates:

1. **User-Centric Design** - Citizens can see exactly who accessed their MyKad and when
2. **Regulatory Compliance** - Complete audit trails satisfy BNM & PDPC requirements
3. **Trust-by-Default Architecture** - Immutable, transparent records build citizen confidence
4. **Decentralized Architecture** - No central database to breach; all data verified on blockchain

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                            │
│              AuditTrailPage.tsx (UI)                        │
└────────────────┬──────────────────────────────────────────────┘
                 │
                 │ HTTP Requests
                 ▼
┌─────────────────────────────────────────────────────────────┐
│            Express Backend (chat-proxy-es.mjs)              │
│  - GET /api/audit/history/:mykadNumber                      │
│  - GET /api/audit/consent/:mykadNumber                      │
│  - GET /api/audit/ipfs/:cid                                 │
│  - POST /api/audit/export                                   │
└────────┬─────────────────────────────────┬──────────────────┘
         │                                 │
         ▼                                 ▼
┌──────────────────────────┐  ┌──────────────────────────────┐
│  Polygon Amoy RPC        │  │  Pinata IPFS Gateway         │
│  Query blockchain events │  │  Fetch metadata from IPFS    │
│  Extract IPFS hashes     │  │  Verify content addressing   │
└──────────────────────────┘  └──────────────────────────────┘
```

---

## API Endpoints

### 1. GET `/api/audit/history/:mykadNumber`

**Purpose:** Retrieve complete identity audit trail (all events)

**Example Request:**
```bash
curl http://localhost:3001/api/audit/history/123456-12-1234
```

**Example Response:**
```json
{
  "success": true,
  "mykadNumber": "123456****",
  "totalRecords": 5,
  "records": [
    {
      "type": "IDENTITY_USED",
      "platformId": "Healthcare Ministry",
      "actionType": "patient_registration",
      "timestamp": "2025-12-23T10:30:00.000Z",
      "ipfsHash": "QmXxxx...",
      "metadata": {
        "institution": "Hospital Kuala Lumpur",
        "action": "registration",
        "purpose": "Patient Registration",
        "location": "Kuala Lumpur",
        "timestamp": "2025-12-23T10:30:00.000Z",
        "status": "approved"
      },
      "txHash": "0x1234...",
      "blockNumber": 12345678
    },
    ...
  ],
  "generatedAt": "2025-12-23T10:35:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing MyKad number
- `500` - Blockchain query error

---

### 2. GET `/api/audit/consent/:mykadNumber`

**Purpose:** Retrieve only consent-related events (CONSENT_GRANTED, CONSENT_REVOKED)

**Example Request:**
```bash
curl http://localhost:3001/api/audit/consent/123456-12-1234
```

**Response Format:**
Same as above but filtered to only consent events.

---

### 3. GET `/api/audit/ipfs/:cid`

**Purpose:** Fetch metadata from IPFS for a specific CID

**Example Request:**
```bash
curl http://localhost:3001/api/audit/ipfs/QmXxxx...
```

**Example Response:**
```json
{
  "success": true,
  "cid": "QmXxxx...",
  "metadata": {
    "requestId": "req_1234567890",
    "institution": "Hospital Kuala Lumpur",
    "action": "registration",
    "purpose": "Patient Registration - New Account",
    "location": "Kuala Lumpur, Malaysia",
    "timestamp": "2025-12-23T10:30:00.000Z",
    "status": "approved",
    "userConsent": "given"
  },
  "fetchedAt": "2025-12-23T10:35:00.000Z"
}
```

---

### 4. POST `/api/audit/export`

**Purpose:** Export complete audit trail as JSON file for download

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/audit/export \
  -H "Content-Type: application/json" \
  -d '{"mykadNumber": "123456-12-1234"}'
```

**Response:**
```json
{
  "exportedAt": "2025-12-23T10:35:00.000Z",
  "mykadNumber": "123456****",
  "totalRecords": 5,
  "auditTrail": [...],
  "summary": {
    "identityUsed": 3,
    "consentGranted": 2,
    "consentRevoked": 0
  }
}
```

---

## Frontend Implementation

### AuditTrailPage Component

**Location:** `src/pages/AuditTrailPage.tsx`

**Features:**

1. **Statistics Dashboard**
   - Total events
   - Identity usage count
   - Consent granted count
   - Consent revoked count

2. **Event Timeline**
   - Chronological order (newest first)
   - Color-coded by event type:
     - 🔐 IDENTITY_USED (blue)
     - ✅ CONSENT_GRANTED (green)
     - ❌ CONSENT_REVOKED (red)
   - Interactive expand/collapse for metadata

3. **Quick Actions**
   - **Refresh** - Fetch latest history from blockchain
   - **Export as JSON** - Download complete audit trail

4. **Detailed Information**
   - Event timestamp
   - Block number
   - Transaction hash (with Polygonscan link)
   - IPFS hash (with gateway link)
   - Full metadata on expand

5. **Security Information**
   - Blockchain verification notice
   - IPFS decentralization explanation
   - Regulatory compliance statement

---

## Backend Implementation

### Blockchain Query Functions

**File:** `server/chat-proxy-es.mjs`

#### `hashMyKad(mykadNumber)`
- Hashes MyKad using `ethers.keccak256()`
- Used to create indexed event filter

#### `fetchFromIPFS(cid)`
- Fetches metadata from Pinata gateway
- Falls back to public gateway if needed
- Returns null if IPFS unreachable

#### `getUserIdentityHistory(mykadNumber)`
- Queries contract for all events matching user hash
- Retrieves IPFS metadata for each event
- Filters events by type:
  - `IdentityUsed` events
  - `ConsentGranted` events
  - `ConsentRevoked` events
- Sorts by timestamp (newest first)
- Returns complete event objects with metadata

---

## Hackathon Pitch Angles

### 1. **"Complete Audit Trail"**
> "Citizens now have a tamper-proof, immutable record of every time their MyKad is accessed. Not just internally - they can independently verify each transaction on the blockchain explorer."

### 2. **"Regulatory Compliance Built-In"**
> "BNM and PDPC audits become instant - just query the blockchain for any citizen and get their complete access history. No database queries, no audit log manipulation risks."

### 3. **"User Empowerment"**
> "Citizens can download their complete identity history and verify it independently. This transparency builds trust in the system."

### 4. **"Developer-Friendly APIs"**
> "Agencies and developers get standardized REST endpoints to query audit trails, making integration simple and consistent."

### 5. **"Cost-Effective at Scale"**
> "No expensive database infrastructure. Blockchain queries are cheap; IPFS storage is decentralized. Perfect for government-scale systems."

---

## Testing the Feature

### Quick Test Steps

1. **Start the backend servers:**
   ```bash
   npm run start:server          # Starts chat proxy on port 3001
   npm run dev                   # Starts Vite on port 8081
   ```

2. **Login to the app:**
   - Navigate to http://localhost:8081
   - Login with any ID

3. **Approve a MyKad request:**
   - A confirmation dialog appears shortly after login
   - Click "Approve"
   - Watch console for blockchain recording message

4. **View audit trail:**
   - Click "Audit History" in sidebar
   - Should show the record you just created
   - Click "Refresh" to fetch fresh data
   - Expand a record to see IPFS metadata

5. **Export audit trail:**
   - Click "Export as JSON"
   - Download should contain complete history

6. **Verify on blockchain:**
   - Copy transaction hash from audit trail
   - Paste into [Amoy Polygonscan](https://amoy.polygonscan.com)
   - Verify transaction exists on-chain

---

## Security & Privacy Considerations

### What Gets Stored

**On Blockchain:**
- User hash (keccak256 of MyKad number)
- Institution name
- Action type
- IPFS hash reference
- Block number & timestamp

**On IPFS (via Pinata):**
- Request ID
- Institution name
- Action type
- Purpose
- Location
- Timestamp
- Consent status

### What Doesn't Get Stored

- Full MyKad number (only hash)
- Personal details (name, address)
- Payment information
- Health records

### Privacy Features

1. **MyKad Number Masked** - Only show `123456****` in UI
2. **Content Addressing** - IPFS ensures data integrity without storing content on blockchain
3. **No Central Database** - Reduces single point of failure
4. **User Control** - Citizens can download and share their own data

---

## Integration Points

### For Agencies

Agencies can query citizen audit trails:

```javascript
// Example: Healthcare ministry verifies a patient's consent history
async function verifyPatientConsent(icNumber) {
  const response = await fetch(
    `http://api.identity.gov.my/api/audit/consent/${icNumber}`
  );
  const { records } = await response.json();
  
  // Check if consent was given for healthcare access
  const hasConsent = records.some(
    r => r.type === 'CONSENT_GRANTED' && 
         r.platformId.includes('Health')
  );
  
  return hasConsent;
}
```

### For Developers

Developers can integrate audit verification:

```javascript
// Example: Verify MyKad access was recorded before processing
async function processWithAuditVerification(icNumber, action) {
  // 1. Check audit trail
  const history = await fetch(
    `http://api.identity.gov.my/api/audit/history/${icNumber}`
  );
  
  // 2. Process request
  // 3. Record approval in system
  
  // 4. Return audit proof to user
  return { processed: true, auditProof: history };
}
```

---

## Next Steps

### For the Hackathon

1. **Add Fraud Detection** (Priority 2)
   - Analyze location changes between approvals
   - Flag unusual time patterns
   - Alert on suspicious activity

2. **Implement Database Cache** (Priority 2)
   - Store frequently queried records locally
   - Reduce blockchain query load
   - Improve performance

3. **Add Real-time Notifications** (Priority 3)
   - Email alerts when MyKad is accessed
   - SMS alerts for high-risk actions
   - Rejection notifications

---

## Metrics for Judges

- ✅ **4 API endpoints** - Complete query interface
- ✅ **Full IPFS integration** - Metadata persistence
- ✅ **Blockchain verification** - Immutable records
- ✅ **User export feature** - Data portability
- ✅ **Regulatory ready** - BNM/PDPC compliance
- ✅ **Zero database** - Decentralized architecture

This feature **directly addresses** the hackathon theme: *"Security, trust-by-default flows, citizen data safety, and agency audit trails."*
