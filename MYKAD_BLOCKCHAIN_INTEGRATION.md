# MyKad Usage + IPFS/Blockchain Integration

## How It Works Now

### Before (Without Blockchain):
```
User approves MyKad usage
    ↓
Just logged to console
    ↓
No permanent record
No audit trail
```

### After (With Blockchain + IPFS):
```
User approves MyKad usage at healthcare facility
    ↓
Metadata stored on PINATA IPFS:
- Request ID
- Institution name (e.g., "Universiti Malaya Medical Centre")
- Action (MYKAD_USAGE_APPROVED)
- Purpose (Patient registration, etc.)
- Location
- Timestamp
- User consent status
    ↓
Gets IPFS Hash: QmXxxx...
    ↓
Recorded on POLYGON BLOCKCHAIN:
- Transaction hash
- IPFS hash link
- Contract address
- User hash
    ↓
Immutable, verifiable audit trail
```

## What Happens When User Approves MyKad Usage

1. **Dialog appears** asking to approve MyKad usage
2. **User clicks Approve**
3. **System records:**
   - Creates metadata object with all details
   - Uploads to Pinata IPFS → Gets CID
   - Records on blockchain → Gets transaction hash
   - Links IPFS hash to blockchain transaction
4. **Console shows:**
   ```
   ✅ MyKad usage recorded on blockchain: {...}
   📦 IPFS Hash: QmXxxx...
   🔗 Transaction: https://amoy.polygonscan.com/tx/0x...
   ```

## How This Helps With MyKad

### Problem It Solves:
If MyKad is lost/stolen and someone uses it:
- ❌ Traditional: No proof of who authorized each usage
- ✅ Blockchain: Every usage has immutable timestamp + proof

### Use Cases:

**1. Lost MyKad Tracking**
- Each usage is permanently recorded
- If card is lost, can see exactly when it was lost
- Proof of all transactions before/after loss

**2. Dispute Resolution**
- Institution claims you used services you didn't
- You have blockchain proof with timestamp
- IPFS contains full details

**3. Regulatory Compliance**
- BNM (Bank Negara Malaysia) can audit
- PDPC (Personal Data Protection Commissioner) can verify
- Complete audit trail without trusting one company

**4. Identity Security**
- Each MyKad usage is logged
- Detect unusual patterns (different country, same time)
- Alert user immediately

## Example Scenario

```
Jan 1, 2025, 10:00 AM - Hospital Registration
  → IPFS: {"institution": "UMMC", "action": "registration", ...}
  → Blockchain: Qm...xyz

Jan 5, 2025, 3:00 PM - Bank Account Opening
  → IPFS: {"institution": "Maybank", "action": "account_opening", ...}
  → Blockchain: Qm...abc

Jan 10, 2025 - MyKad reported LOST
  → Can prove all valid usages before this date
  → Any usage after = fraudulent

Jan 15, 2025 - Suspicious usage in Thailand
  → Shows on blockchain with timestamp
  → Can file police report with proof
  → Insurance claim has immutable evidence
```

## Current Implementation

**File:** `src/pages/Index.tsx`

When user approves MyKad usage:
```typescript
const usageMetadata = {
  requestId: requestId,
  institution: confirmationRequest.institution.name,
  action: confirmationRequest.action,
  purpose: confirmationRequest.purpose,
  location: confirmationRequest.location,
  timestamp: new Date().toISOString(),
  status: 'approved',
  userConsent: 'given'
};

// Uploads to IPFS, links to blockchain
const result = await blockchainService.logConsentWithIPFS(
  userIc,
  institution,
  'MYKAD_USAGE_APPROVED',
  usageMetadata
);
```

## Testing

1. Login to app
2. Wait for MyKad usage confirmation dialog
3. Click **Approve**
4. Watch console (F12) for:
   - `✅ MyKad usage recorded on blockchain`
   - `📦 IPFS Hash: QmXxxx...`
   - Full transaction details

## Future Enhancements

- [ ] Store IPFS hashes in database for quick retrieval
- [ ] Show MyKad usage history on dashboard with IPFS links
- [ ] Enable users to download full audit trail as PDF
- [ ] Send notifications for each MyKad usage
- [ ] Implement fraud detection alerts
- [ ] Add geographic anomaly detection
