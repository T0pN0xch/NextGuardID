# NextGuard ID - Digital Identity Protection Platform

## Project Description

**NextGuard ID** is a comprehensive digital identity protection platform designed to safeguard users' personal information and provide transparency in how their identity data is being used. Built with modern web technologies and blockchain integration, the platform empowers users to monitor, manage, and control their digital identity across various services.

### Key Features

- **User Authentication & Authorization** - Secure multi-factor authentication with OTP verification
- **Personal Profile Management** - Comprehensive user profile with editable personal information
- **Consent Management** - Detailed consent tracking and management for data sharing with third-party services
- **Suspicious Activity Monitoring** - Real-time alerts and monitoring for unauthorized access attempts
- **MyKad Lost Tracking** - Geolocation tracking and timeline visualization for lost Malaysian ID cards
- **ID Usage Analytics** - Detailed logs and analytics of where and when your identity is being used
- **Blockchain Audit Trail** - Immutable blockchain records of all identity-related activities for full transparency
- **Dashboard Analytics** - Comprehensive dashboard with activity statistics and security insights
- **Dark/Light Theme Support** - User-friendly interface with theme customization

### Tech Stack

**Frontend:**
- React 18+ with TypeScript
- Vite for fast development and builds
- Tailwind CSS for styling
- shadcn/ui for accessible UI components
- React Router for navigation
- TanStack React Query for data fetching

**Backend/Smart Contracts:**
- Hardhat for Ethereum smart contract development
- Solidity for blockchain contracts (IdentityAudit contract)

**Additional:**
- Node.js runtime
- npm/bun for package management

### Project Structure

```
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── lib/             # Utility functions and blockchain integration
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   ├── data/            # Mock data
│   └── styles/          # Global styles
├── blockchain/          # Hardhat project for smart contracts
│   ├── contracts/       # Solidity smart contracts
│   ├── scripts/         # Deployment and testing scripts
│   └── test/            # Contract tests
└── public/              # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun package manager

### Installation & Setup

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd your-friendly-assistant-2d549601

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

```sh
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Blockchain Setup

```sh
# Navigate to blockchain directory
cd blockchain

# Install dependencies
npm install

# Compile smart contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

## Usage

1. **Login** - Authenticate using MyKad number or NFC card with OTP verification
2. **View Dashboard** - See an overview of your identity protection status
3. **Manage Profile** - Update your personal information in the Profile section
4. **Check Consents** - Review and revoke data sharing consents in the Consent page
5. **Monitor Activity** - Track suspicious activities and ID usage in dedicated sections
6. **View Blockchain Records** - Access immutable audit trails of all identity transactions

## Architecture

The platform follows a modern full-stack architecture:

- **Frontend**: Responsive React application with component-based architecture
- **State Management**: Local state with React hooks and React Query
- **Smart Contracts**: Ethereum-based contracts for transparent identity audit logs
- **Data Flow**: REST API integration with blockchain events

## Security Features

- ✅ Multi-factor authentication (OTP)
- ✅ Blockchain immutability for audit trails
- ✅ Encrypted data storage
- ✅ Secure session management
- ✅ Real-time activity monitoring

## Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please reach out to the project maintainers or open an issue in the repository.

---

**Version**: 1.0.0  
**Last Updated**: December 2025
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Blockchain / IPFS configuration

This project integrates with a smart contract deployed to the Polygon Amoy Testnet and uses IPFS (via web3.storage) to store consent metadata.

Required environment variables (Vite):

- `VITE_WEB3_STORAGE_TOKEN` — a web3.storage API token used to upload JSON metadata to IPFS. Create one at https://web3.storage and add it to a `.env` file at the project root:

```bash
VITE_WEB3_STORAGE_TOKEN=your_web3_storage_token_here
## AI Assistant (optional)

This project includes a local Express proxy at `server/chat-proxy.js` which forwards chat and summarization requests to Google's Gemini (Generative AI) endpoints. To enable it:

1. Copy `.env.example` to `.env` and set `GEMINI_API_KEY` to your server-side API key.
2. Start the proxy server in a separate terminal:

```bash
npm run start:server
```

3. Run the frontend dev server as usual:

```bash
npm run dev
```

The dashboard and Suspicious Activity pages include a small chat widget that posts to `/api/chat` and `/api/summarize`. The proxy must be running and `GEMINI_API_KEY` set for the assistant to respond.

Security note: Never store API keys in client-side env vars (VITE_ prefix). Use a server-side proxy like the included `server/chat-proxy.js` and keep keys out of version control.

If you've pasted your API key into the chat here, rotate it immediately — do NOT commit keys to the repository.
```

Wallet / signing:

- For real on-chain writes (granting/revoking consent) you must connect a browser wallet (MetaMask or similar) configured for the Polygon Amoy Testnet.
- The frontend will attempt to call `window.ethereum` and request accounts. After connecting, actions like revoking consent will upload metadata to IPFS and then call the contract.

Explorer / network:

- Transactions and contract verification use `https://amoy.polygonscan.com` (Polygon Amoy Testnet).

Notes:

- If a wallet is not connected or the user declines, the app will fall back to demo/mock behavior.
- The deployed contract address is recorded in `blockchain/deployment-info.json` and is used by the frontend.

