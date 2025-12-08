# Swasthya Sanchar

A decentralized healthcare records management system built with Next.js, Hardhat, and Ethereum smart contracts.

## Features

- 🏥 **Patient Portal**: Blockchain-based patient registration and emergency profile management
- 👨‍⚕️ **Doctor Portal**: Authorization-based access to patient medical records
- 🚨 **Emergency Access**: QR code-based emergency information for first responders
- 🔒 **Web3 Integration**: Secure wallet connection via MetaMask
- 📋 **Smart Contracts**: Solidity contracts for patient registration and doctor authorization

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: Hardhat, Viem, Solidity
- **Testing**: Vitest (unit tests), Playwright (E2E tests)
- **QR Generation**: qrcode.react

---

## Getting Started

### Prerequisites

- Node.js 18+ (Note: Hardhat requires Node 20+, but works with warnings on Node 18)
- MetaMask browser extension
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/SahilKumar75/swasthya-sanchar.git
cd swasthya-sanchar

# Install dependencies
npm install
```

---

## Running the Application

### 1. Start the Hardhat Local Blockchain

Open a terminal and run:

```bash
cd contracts
npx hardhat node
```

This will:
- Start a local Ethereum node at `http://127.0.0.1:8545`
- Deploy test accounts with 10,000 ETH each
- Display account addresses and private keys (for development only)

**Keep this terminal running.**

### 2. Deploy the Smart Contracts

Open a **new terminal** and run:

```bash
cd contracts
npx hardhat run scripts/deploy.ts --network localhost
```

This will deploy the `HealthRecords` smart contract to your local blockchain.

**Note the deployed contract address** - it should be `0x5FbDB2315678afecb367f032d93F642f64180aa3` (default first deployment).

### 3. Configure MetaMask

1. Open MetaMask extension
2. Add a custom network:
   - **Network Name**: `Localhost 8545`
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: `ETH`
3. Import a test account:
   - Click "Import Account"
   - Paste private key from Hardhat node output (e.g., Account #0):
     ```
     0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
     ```

### 4. Start the Next.js Development Server

In the project root (in a **new terminal**):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Using the Application

### Patient Portal (`/patient`)

1. Connect your MetaMask wallet
2. Register as a patient (name + date of birth)
3. Access emergency profile at `/patient/emergency`
4. Generate QR code for emergency responders

### Doctor Portal (`/doctor`)

1. Connect your MetaMask wallet
2. Check authorization status (requires admin authorization via smart contract)
3. Enter patient address to view medical records (mock data for now)

### Emergency Responder View (`/emergency/[address]`)

- No wallet required
- Public access to critical emergency information
- Scan patient's QR code to access this page

---

## Running Tests

### Unit Tests (Vitest)

```bash
# Run all unit tests
npm test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage
```

### Smart Contract Tests (Hardhat)

```bash
cd contracts
npx hardhat test
```

### End-to-End Tests (Playwright)

**Important**: Start the dev server before running E2E tests.

```bash
# In one terminal
npm run dev

# In another terminal
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed
```

#### E2E Test Coverage

- **access.spec.ts**: Doctor portal authorization and access control
- **emergency.spec.ts**: Emergency responder page functionality
- **doctor-portal.spec.ts**: Doctor portal basic functionality
- **patient-portal.spec.ts**: Patient portal basic functionality
- **landing.spec.ts**: Landing page navigation
- **navigation.spec.ts**: Inter-page navigation

---

## Project Structure

```
swasthya-sanchar/
├── contracts/              # Hardhat smart contracts
│   ├── contracts/         # Solidity contracts
│   ├── scripts/           # Deployment scripts
│   └── test/              # Contract tests
├── src/
│   ├── app/               # Next.js app router pages
│   │   ├── doctor/       # Doctor portal
│   │   ├── patient/      # Patient portal + emergency profile
│   │   └── emergency/    # Public emergency responder view
│   ├── components/        # React components
│   └── lib/               # Utilities
│       ├── web3.ts       # Web3 connection helpers
│       ├── contracts.ts  # Contract ABI and addresses
│       └── mockRecords.ts # Mock medical data
├── tests/
│   ├── e2e/              # Playwright E2E tests
│   └── unit/             # Vitest unit tests
└── public/               # Static assets
```

---

## Smart Contract Functions

### `HealthRecords.sol`

- `registerPatient(name, dateOfBirth, emergencyHash)` - Self-registration for patients
- `authorizeDoctor(address)` - Admin-only: Authorize doctor accounts
- `getPatient(address)` - Get patient information
- `authorizedDoctors(address)` - Check if address is authorized doctor
- `createRecord(patient, recordHash)` - Authorized doctors can create records

---

## Environment Variables

Create a `.env.local` file for production:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CHAIN_ID=31337
```

For Vercel deployment, update the contract address and chain ID accordingly.

---

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables
4. Deploy!

The app will automatically build and deploy on push to `main`.

### Deploy Smart Contracts to Testnet

Update `hardhat.config.ts` with your testnet configuration and deploy:

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

Update `src/lib/contracts.ts` with the deployed contract address.

---

## Notes for TestSprite / CI

- **Dev Server**: Tests require `npm run dev` to be running on `localhost:3000`
- **Wallet Mocking**: Some tests are skipped (`test.skip`) as they require MetaMask mocking
- **Test Isolation**: Each E2E test is independent and doesn't require previous test state
- **No Auth**: Emergency responder tests don't require wallet connection
- **Mock Data**: Medical records currently use mock data from `src/lib/mockRecords.ts`

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test && npm run test:e2e`
5. Create a pull request

---

## License

MIT

---

## Support

For issues or questions, please open an issue on GitHub.

