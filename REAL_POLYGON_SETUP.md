# Real Polygon Amoy Integration Guide

## ✅ What's Ready

Your system is now set up for **real Polygon Amoy blockchain**:

| Component | Status | Details |
|-----------|--------|---------|
| Contract Deployment | ✅ DONE | Address: `0xb81988826bA44D5657309690b79a1137786cEb3d` |
| Wallet Connector | ✅ NEW | Prompts user to connect MetaMask |
| IPFS Integration | ✅ WORKING | Real Pinata uploads with JWT token |
| Blockchain Service | ✅ UPDATED | Supports both real & mock transactions |
| Audit Trail API | ✅ WORKING | Queries real blockchain events |

---

## 🚀 How to Use Real Polygon

### Step 1: Install MetaMask
1. Go to https://metamask.io/download/
2. Install for your browser
3. Create a wallet (or import existing)
4. **Save your seed phrase safely!**

### Step 2: Get Testnet MATIC Tokens
You need MATIC tokens on Polygon Amoy to pay for gas:

**Option A: Use Polygon Faucet (Free)**
1. Go to https://faucet.polygon.technology/
2. Select "Polygon Amoy" network
3. Enter your wallet address
4. Claim tokens (0.5 MATIC per day)

**Option B: Bridge from Ethereum Testnet (if you have ETH)**
1. Go to https://wallet.polygon.technology/bridge
2. Bridge Sepolia ETH to Amoy MATIC

**Option C: Buy from Exchange**
- Use exchanges like Aavegotchi, QuickSwap, etc.

### Step 3: Configure Network in MetaMask

The app will auto-add Polygon Amoy when you connect, but you can also add manually:

**Network Details:**
- **Network Name:** Polygon Amoy Testnet
- **RPC URL:** https://rpc-amoy.polygon.technology/
- **Chain ID:** 80002 (or 0x13882 in hex)
- **Symbol:** MATIC
- **Block Explorer:** https://amoy.polygonscan.com/

### Step 4: Connect Wallet in App

1. Refresh your app at http://localhost:8081
2. You'll see **"Connect MetaMask"** card at the top
3. Click the button
4. MetaMask popup appears → Click "Connect"
5. ✅ Wallet connected message appears

### Step 5: Approve MyKad Usage

1. Click **"📝 Test MyKad Request"** button
2. Dialog appears: "Healthcare Ministry wants to access your MyKad"
3. Click **"Approve"**
4. MetaMask transaction window pops up:
   - Shows gas fee (usually ~0.001-0.01 MATIC)
   - Click "Confirm"
5. Watch for confirmation:
   ```
   ✅ MyKad usage recorded on blockchain
   📦 IPFS Hash: QmXxxx...
   🔗 Transaction: https://amoy.polygonscan.com/tx/0x...
   ```

### Step 6: View Audit Trail

1. Click **"Audit History"** in sidebar
2. See your real blockchain record with:
   - ✅ Transaction hash (on Polygonscan)
   - ✅ IPFS hash (on Pinata)
   - ✅ Full metadata
3. Click transaction link to verify on Polygonscan

---

## 📊 Transaction Breakdown

### What Happens When You Approve:

```
1. User clicks "Approve" on MyKad dialog
   ↓
2. System uploads metadata to Pinata IPFS
   - Returns IPFS hash (e.g., QmXxxx...)
   ↓
3. System calls blockchain contract:
   - Function: logIdentityUsage()
   - Params: userHash, institution, action, ipfsHash
   ↓
4. MetaMask prompts for confirmation
   - Shows gas fee in MATIC
   ↓
5. Transaction sent to Polygon Amoy network
   - Mined in ~2-5 seconds
   ↓
6. IPFS + Blockchain linked forever
   - Immutable audit trail created
```

### Gas Costs

**Typical transaction costs on Polygon Amoy:**
- Simple transfer: ~0.001 MATIC (~$0.0001)
- Contract interaction: ~0.005-0.01 MATIC (~$0.0005-$0.001)
- Polygon is **100x cheaper** than Ethereum!

---

## 🔍 Verify on Polygonscan

After your transaction confirms:

1. Copy the transaction hash from console output
2. Go to https://amoy.polygonscan.com/
3. Paste transaction hash in search
4. See:
   - ✅ Transaction confirmed
   - ✅ Your wallet address
   - ✅ Contract address
   - ✅ Input data (encoded params)

Example: https://amoy.polygonscan.com/tx/0x...

---

## 🐛 Troubleshooting

### "MetaMask is not installed"
- Install MetaMask from https://metamask.io/
- Refresh page

### "Insufficient balance to pay gas"
- Get free MATIC from https://faucet.polygon.technology/
- Select Polygon Amoy network
- Enter your address
- Wait a few minutes for funds

### "Wrong network" error
- MetaMask should auto-prompt to switch to Polygon Amoy
- If not, manually switch in MetaMask dropdown (top-right)
- Select "Polygon Amoy Testnet"

### Transaction fails with "Reverted"
- Check contract address is correct: `0xb81988826bA44D5657309690b79a1137786cEb3d`
- Check you have enough gas
- Check IPFS metadata was uploaded successfully

### Can't see transaction on Polygonscan
- Wait 1-2 minutes for confirmation
- Check chain ID is correct (80002)
- Try refreshing Polygonscan page

---

## 💡 Demo Script for Judges

**Time: 7 minutes**

```
1. Show MetaMask Connection (1 min)
   - Open app at http://localhost:8081
   - Show wallet connector card
   - Click "Connect MetaMask"
   - Show wallet connected confirmation

2. Create Blockchain Record (2 min)
   - Click "📝 Test MyKad Request"
   - Dialog: "Healthcare Ministry wants your MyKad"
   - Click "Approve"
   - MetaMask confirmation appears
   - Show gas fee
   - Click "Confirm"
   - Watch transaction being processed

3. Show Blockchain Proof (2 min)
   - Console: "MyKad usage recorded on blockchain"
   - Show IPFS hash: QmXxxx...
   - Show transaction link: https://amoy.polygonscan.com/tx/0x...
   - Click link → Verify on Polygonscan
   - Show transaction details on-chain

4. Show Audit Trail (2 min)
   - Click "Audit History"
   - Show record in timeline
   - Click transaction link → Polygonscan verification
   - Expand metadata to show IPFS content
   - Mention: "Real blockchain, real IPFS, immutable"
```

---

## 🎯 Key Points to Emphasize

1. **Real Blockchain**
   - "Every transaction is recorded on Polygon Amoy testnet"
   - "Judges can verify on Polygonscan independently"

2. **Immutable Records**
   - "Once approved, cannot be changed or deleted"
   - "Permanent audit trail for regulatory compliance"

3. **User Control**
   - "Citizens control their own private key"
   - "Can export and share their audit trail"
   - "No reliance on central authority"

4. **Cost Efficient**
   - "Each transaction costs ~0.005 MATIC (~$0.0001)"
   - "Scales to millions of transactions"
   - "No expensive database infrastructure"

---

## 📚 Additional Resources

- **Polygon Amoy Testnet:** https://polygon.technology/developers/tools/polygon-faucets
- **Polygonscan (Block Explorer):** https://amoy.polygonscan.com/
- **MetaMask Docs:** https://docs.metamask.io/
- **Ethers.js Docs:** https://docs.ethers.org/

---

## ✅ Pre-Demo Checklist

Before showing judges:
- [ ] MetaMask installed
- [ ] Polygon Amoy network added
- [ ] Have at least 0.1 MATIC for gas
- [ ] Backend server running (`npm run start:server`)
- [ ] Frontend running (`npm run dev`)
- [ ] Wallet connected in app
- [ ] Can click "Test MyKad Request"
- [ ] MetaMask popup appears on approve
- [ ] Transaction completes
- [ ] Polygonscan link works
- [ ] Audit history shows real transaction

---

**You're now ready for real blockchain integration! 🚀**

After connecting MetaMask and approving a MyKad request, every transaction will be **permanently recorded on Polygon Amoy** and **verifiable on Polygonscan.**

This is what impresses hackathon judges: working blockchain integration with real transactions, not mocks! 🎉
