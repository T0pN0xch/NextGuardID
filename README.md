# NextGuard ID - Digital Identity Protection Platform

Blockchain-enabled platform protecting Malaysia's MyKad with real-time access control and immutable audit trails.

> **Quick Links:** [Setup Guide](SETUP_GUIDE.md) | [Quick Start](QUICKSTART_GUIDE.md) | [Implementation](NEXTGUARD_ID_IMPLEMENTATION.md) | [API Spec](API_SPECIFICATION.md) | [Design](DESIGN_MOCKUPS.md)

## 🎯 What It Does

- ✅ **Real-Time Approval** - Approve/deny MyKad access instantly  
- ✅ **Immutable Audit Trail** - Blockchain records all access events  
- ✅ **Privacy-First** - Only metadata on blockchain, no sensitive data  
- ✅ **Multi-Industry** - Healthcare, banking, government, telecom, education  
- ✅ **Fraud Prevention** - Prevents unauthorized usage before it happens  

## 🚀 Quick Start

```bash
npm install
npm run dev          # Frontend: http://localhost:5173
```

**Blockchain:**
```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

**Environment Setup:**
```bash
# .env file in project root
VITE_WEB3_STORAGE_TOKEN=your_token_from_web3.storage
```

Get token: https://web3.storage

## 📚 Documentation

| Guide | Purpose |
|-------|---------|
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Installation & configuration |
| [QUICKSTART_GUIDE.md](QUICKSTART_GUIDE.md) | Feature walkthrough & demo |
| [NEXTGUARD_ID_IMPLEMENTATION.md](NEXTGUARD_ID_IMPLEMENTATION.md) | Technical architecture & features |
| [DESIGN_MOCKUPS.md](DESIGN_MOCKUPS.md) | UI/UX specifications |
| [API_SPECIFICATION.md](API_SPECIFICATION.md) | Backend integration endpoints |
| [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md) | System architecture & flow |

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express.js |
| Blockchain | Polygon (Amoy Testnet), Solidity |
| Storage | IPFS (web3.storage) |

## Features

### 1. Real-Time MyKad Confirmation
When any institution requests your MyKad, a confirmation modal appears with:
- Institution details & verification status
- Action type and purpose
- Date, time, and location
- Approve or Deny buttons

**Component:** `src/components/mykad/MyKadUsageConfirmation.tsx`

### 2. Immutable Audit Trail
Complete access history recorded on Polygon blockchain:
- Institution name & action type
- Purpose of access
- Timestamp & location
- User approval/denial status
- IPFS metadata hash

**Page:** `src/pages/MyKadAuditTrailPage.tsx`

### 3. Dashboard & Analytics
- Access statistics (approved, denied, emergency)
- Geographic usage map
- Timeline of events
- Suspicious activity alerts
- Dark/light theme support

### 4. Consent Management
- Grant/revoke institutional access
- View active consents
- Complete consent history on blockchain

### 5. Privacy-First Design
What gets recorded:
- ✅ Timestamp, institution, action, purpose, location, decision

What doesn't:
- ❌ Medical records, financial data, biometrics, passwords

**Compliant with:** PDPA (Personal Data Protection Act Malaysia)

## Blockchain Integration

**Network:** Polygon Amoy Testnet  
**Explorer:** https://amoy.polygonscan.com  
**Contract Address:** See `blockchain/deployment-info.json`  
**Wallet:** Connect MetaMask for on-chain transactions (demo mode without wallet)

## Project Structure

```
src/
  ├── components/mykad/        # Confirmation modal
  ├── pages/                    # Audit trail & dashboard
  ├── lib/blockchain.js         # Blockchain utilities
  ├── hooks/useBlockchainEvents # Blockchain hook
  └── types/identity.ts         # Type definitions

blockchain/
  ├── contracts/                # Solidity smart contracts
  ├── scripts/                  # Deploy & test scripts
  └── hardhat.config.js         # Network config
```

## Usage Flow

1. **Login** → IC number + OTP
2. **Confirmation Modal** → Appears when institution requests MyKad access
3. **Approve/Deny** → Your choice is recorded on blockchain
4. **Audit Trail** → View all access history in MyKad Audit Trail page
5. **Manage Consents** → Grant/revoke institutional access

## Healthcare Features (Current Focus)

Implemented for hospital registration, medical records access, and specialist verification. Same architecture works for banking, government, telecom, education, and retail.

## License

MIT License | **Version:** 1.0.0 | **Updated:** December 2025
