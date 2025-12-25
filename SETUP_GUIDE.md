# NextGuard ID - Project Setup Guide

Complete step-by-step instructions to set up and run the NextGuard ID project locally.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Project Setup](#project-setup)
4. [Blockchain Setup](#blockchain-setup)
5. [Running the Project](#running-the-project)
6. [Verification Checklist](#verification-checklist)

---

## Prerequisites

### Required Software

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **Bun** (v1.0 or higher) - [Download Bun](https://bun.sh/)
- **Git** - [Download](https://git-scm.com/)

### Verify Installation

```bash
node --version    # Should be v18+
npm --version     # Should be v9+
bun --version     # Optional, if using Bun
git --version
```

---

## Environment Variables

### Step 1: Create `.env` File

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### Step 2: Add Required API Keys

Edit `.env` and add the following:

```dotenv
# Web3 Storage (for IPFS storage of audit trails)
# Get your token: https://web3.storage/
VITE_WEB3_STORAGE_TOKEN=your_web3_storage_token_here
```

### API Key Guide

#### **Web3.Storage Token** (Required for Blockchain)
- Go to https://web3.storage/
- Sign up with email or GitHub
- Create a new API token
- Copy the token and paste into `.env`
- This token stores audit trail data on IPFS (decentralized storage)

---

## Project Setup

### Step 1: Clone or Navigate to Project

```bash
# If cloning fresh
git clone https://github.com/T0pN0xch/NextGuardID.git
cd NextGuardID
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Or using Bun (faster):
```bash
bun install
```

### Step 3: Install Blockchain Dependencies

```bash
cd blockchain
npm install
cd ..
```

---

## Blockchain Setup

### What You Need for Blockchain

The project uses **Hardhat** to manage smart contracts on the **Polygon Amoy testnet**. You have two options:

#### **Option A: Local Development (Recommended for Testing)**

Best for local development and testing. Runs a local blockchain on your machine.

**Step 1: Set up `.env` in blockchain folder**

```bash
cd blockchain
cp .env .env  # Create empty or copy existing
```

**Step 2: Start Local Hardhat Node**

In a **new terminal**:
```bash
cd blockchain
npx hardhat node
```

You should see output like:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

**Step 3: Deploy Smart Contracts**

In **another new terminal**:
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```

The output will show your deployed contract address. Copy this for later use.

#### **Option B: Polygon Amoy Testnet (Live Network)**

For testing on a live blockchain network.

**Requirements:**
- Private key from wallet (MetaMask, Hardhat, etc.)
- MATIC tokens (get from [Polygon Faucet](https://faucet.polygon.technology/))

**Step 1: Set up environment**

```bash
cd blockchain
# Create .env file
echo PRIVATE_KEY=your_private_key_here > .env
```

**Step 2: Deploy to Amoy**

```bash
cd blockchain
npx hardhat run scripts/deploy.js --network amoy
```

---

## Running the Project

### Method 1: Complete Setup (Recommended)

#### Terminal 1: Start Local Blockchain (if using local setup)
```bash
cd blockchain
npx hardhat node
```

#### Terminal 2: Deploy Smart Contracts
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```

#### Terminal 3: Start Development Server
```bash
cd NextGuardID  # Navigate to root
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Method 2: Quick Start (Frontend Only)

If you only want to work on the UI:

```bash
npm run dev
```

The app will start at `http://localhost:5173`

**Note:** Blockchain features may not work without running the smart contracts.

### Available Commands

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run build:dev     # Build in development mode
npm run lint          # Run ESLint
npm run preview       # Preview production build locally
```

---

## Blockchain Commands

### In the `blockchain/` folder:

```bash
# Compile smart contracts
npx hardhat compile

# Run tests
npx hardhat test

# Run test setup (creates demo data)
npx hardhat run scripts/test-setup.js --network localhost

# View blockchain nodes running
npx hardhat node

# Deploy to localhost
npx hardhat run scripts/deploy.js --network localhost

# Deploy to Polygon Amoy
npx hardhat run scripts/deploy.js --network amoy
```

---

## Verification Checklist

Use this checklist to verify everything is working:

### ✅ Environment Setup
- [ ] `.env` file created with API keys
- [ ] `VITE_WEB3_STORAGE_TOKEN` set
- [ ] `GEMINI_API_KEY` set (optional)

### ✅ Dependencies
- [ ] `npm install` completed successfully in root
- [ ] `npm install` completed successfully in `blockchain/`
- [ ] No errors in terminal output

### ✅ Blockchain Setup
- [ ] Hardhat node running (if using local)
- [ ] Smart contracts deployed successfully
- [ ] Contract address obtained from deployment output
- [ ] Contract address matches in `src/lib/blockchain.js` (if needed)

### ✅ Frontend
- [ ] `npm run dev` starts without errors
- [ ] App loads at `http://localhost:5173`
- [ ] No console errors in browser DevTools

### ✅ Features
- [ ] Dashboard page loads
- [ ] Blockchain demo page accessible
- [ ] Audit trail page shows (even if empty initially)
- [ ] MyKad tracking page loads
- [ ] Theme toggle works (dark/light mode)

---

## Troubleshooting

### Common Issues

**Port 5173 Already in Use:**
```bash
# Kill process using port 5173 (Windows PowerShell)
Get-Process | Where-Object {$_.Id -eq (Get-NetTCPConnection -LocalPort 5173).OwningProcess} | Stop-Process -Force
```

**Port 8545 Already in Use (Hardhat):**
```bash
cd blockchain
npx hardhat node --port 8546  # Use different port
```

**Module Not Found Errors:**
```bash
# Clean install
rm -r node_modules package-lock.json
npm install
```

**Smart Contract Deployment Failed:**
- Check `.env` has correct `PRIVATE_KEY`
- Ensure account has MATIC for gas fees (Polygon Amoy)
- Verify Hardhat node is running

**Blockchain Features Not Working:**
- Confirm smart contracts are deployed
- Check browser console for contract address errors
- Verify contract address in `src/lib/blockchain.js`

---

## Project Structure

```
NextGuardID/
├── .env                    # Your API keys (create from .env.example)
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── lib/              # Utilities and blockchain.js
│   └── ...
├── blockchain/           # Hardhat smart contracts
│   ├── contracts/        # Solidity contracts
│   ├── scripts/          # Deploy and setup scripts
│   ├── hardhat.config.js # Hardhat configuration
│   └── .env             # Blockchain private key
├── public/              # Static assets
├── package.json         # Frontend dependencies
└── vite.config.ts       # Vite configuration
```

---

## Next Steps

After setup is complete:

1. **Explore the Dashboard** - View MyKad usage analytics
2. **Test Blockchain Features** - Try the Blockchain Demo page
3. **Check Audit Trail** - View blockchain-recorded events
4. **Enable Dark Mode** - Test theme toggle in top-right
5. **Review Documentation** - Check [README.md](README.md) for feature details

---

## Getting Help

- **Smart Contract Issues:** Check [BLOCKCHAIN_INTEGRATION_COMPLETE.md](BLOCKCHAIN_INTEGRATION_COMPLETE.md)
- **Onboarding Features:** See [ONBOARDING_IMPLEMENTATION.md](ONBOARDING_IMPLEMENTATION.md)
- **Architecture Details:** Review [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)
- **API Specification:** Consult [API_SPECIFICATION.md](API_SPECIFICATION.md)

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review relevant documentation files
3. Check console output for error messages
4. Ensure all prerequisites are installed
