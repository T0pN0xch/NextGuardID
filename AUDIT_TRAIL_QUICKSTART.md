# Query/History API - Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Start the Backend Servers

**Terminal 1 - Gemini Chat Proxy:**
```bash
npm run start:server
```
Expected output:
```
✅ GEMINI_API_KEY loaded successfully
✅ PINATA_JWT loaded successfully
🚀 Chat proxy running on http://localhost:3001
📡 Endpoints: /api/chat, /api/summarize, /api/audit/history, /api/audit/consent, /api/audit/ipfs, /api/audit/export, /health
```

**Terminal 2 - Vite Frontend Dev Server:**
```bash
npm run dev
```
Expected output:
```
  VITE v4.x.x  ready in 234 ms

  ➜  Local:   http://localhost:8081/
```

### Step 2: Test the Audit Trail

1. Open http://localhost:8081 in browser
2. Login with any ID (system uses mock credentials)
3. Wait for MyKad confirmation dialog (appears 2 seconds after login)
4. Click "Approve" to record usage on blockchain
5. Watch console for success message:
   ```
   ✅ MyKad usage recorded on blockchain
   📦 IPFS Hash: QmXxxx...
   🔗 Transaction: https://amoy.polygonscan.com/tx/0x...
   ```

### Step 3: View Audit Trail

1. Click **"Audit History"** in the sidebar
2. Page loads and fetches all records from blockchain
3. You should see the record from Step 2
4. Click on any record to expand and see full metadata
5. Click **"Export as JSON"** to download

---

## 🧪 API Testing

### Test Endpoint: Get Complete History

```bash
curl http://localhost:3001/api/audit/history/123456-12-1234 | jq
```

Response includes:
- Total record count
- List of all events (IDENTITY_USED, CONSENT_GRANTED, CONSENT_REVOKED)
- IPFS hashes
- Transaction hashes
- Metadata from IPFS

### Test Endpoint: Get Only Consent Events

```bash
curl http://localhost:3001/api/audit/consent/123456-12-1234 | jq
```

Response includes only consent-related events.

### Test Endpoint: Fetch IPFS Metadata

```bash
curl http://localhost:3001/api/audit/ipfs/QmXxxx... | jq
```

Returns the metadata object stored on IPFS.

### Test Endpoint: Export Complete Audit Trail

```bash
curl -X POST http://localhost:3001/api/audit/export \
  -H "Content-Type: application/json" \
  -d '{"mykadNumber": "123456-12-1234"}' | jq
```

Returns complete audit trail with summary statistics.

---

## ✅ Validation Checklist

- [ ] Backend server starts on port 3001
- [ ] Frontend loads on port 8081
- [ ] Login succeeds with mock credentials
- [ ] MyKad confirmation dialog appears
- [ ] Approving MyKad logs to console
- [ ] IPFS hash returned (starts with `Qm`)
- [ ] Transaction hash returned
- [ ] Audit History page loads
- [ ] Records appear in timeline
- [ ] Expanding a record shows metadata
- [ ] Export button downloads JSON file
- [ ] API endpoints respond to curl requests
- [ ] Transaction link works on Polygonscan

---

## 🐛 Troubleshooting

### "Cannot GET /api/audit/history"
- Backend server not running on port 3001
- Fix: Run `npm run start:server` in separate terminal

### No records appear in Audit Trail page
- No MyKad approvals have been made yet
- Fix: Go back to dashboard, look for MyKad confirmation, approve it
- Check browser console for blockchain errors

### IPFS metadata shows as "null"
- IPFS data not yet fetched
- Fix: This is normal on first load; click "Refresh" button
- Check if Pinata JWT token is valid in `.env`

### Transaction hash appears but doesn't link to Polygonscan
- Transaction is in mock mode (no real blockchain)
- Fix: To use real blockchain, connect MetaMask wallet
- For now, mock mode is fine for testing

### CORS error when fetching IPFS
- Pinata gateway might be blocking requests
- Fix: Backend falls back to cloudflare-ipfs.com automatically
- Check that VITE_WEB3_STORAGE_TOKEN is set in `.env`

---

## 🎯 Hackathon Demo Script

**Time: 5 minutes**

1. **Show Backend Running** (30 sec)
   - Open terminal with backend logs
   - Show "Chat proxy running on http://localhost:3001"
   - Show all endpoints listed

2. **Show Frontend** (1 min)
   - Open http://localhost:8081
   - Login with demo credentials
   - Approve MyKad usage dialog
   - Show console output with blockchain recording

3. **Show Audit Trail UI** (2 min)
   - Click "Audit History" in sidebar
   - Show stats dashboard
   - Expand a record to show IPFS metadata
   - Show transaction link on Polygonscan
   - Click export to show JSON download

4. **Talk Through Architecture** (1.5 min)
   - "Every MyKad access is recorded on-chain"
   - "Metadata stored on IPFS for decentralization"
   - "Users can export and verify their own audit trail"
   - "Perfect for BNM/PDPC compliance audits"

---

## 📊 Key Metrics to Mention

- **4 API endpoints** - Full query interface
- **Real blockchain queries** - Polygon Amoy testnet
- **IPFS integration** - Pinata decentralized storage
- **Zero database** - Completely decentralized
- **User export** - Data portability enabled
- **Immutable records** - Tamper-proof audit trail

---

## 🚀 Next Steps

After demo:

1. **Show Fraud Detection** (if implemented)
   - "We can detect unusual location/time patterns"

2. **Mention Database Caching** (future)
   - "For production, we cache frequent queries locally"

3. **Talk Scale**
   - "This design scales to millions of citizens"
   - "No database bottlenecks at scale"

---

## 📝 Notes for Judges

Emphasize:
- ✅ **User Control** - Citizens own their audit trail
- ✅ **Transparency** - Complete visibility into MyKad access
- ✅ **Security** - Immutable blockchain records
- ✅ **Privacy** - No personal data on blockchain
- ✅ **Regulatory** - Built for BNM/PDPC compliance
- ✅ **Decentralized** - No central database to breach

This directly addresses the hackathon theme: *"trust-by-default flows that keep citizen data safe"*
