# Swasthya Sanchar

A blockchain-based healthcare records management system enabling patient data ownership with emergency access capabilities.

## Overview

Swasthya Sanchar addresses fragmented medical records by providing a decentralized platform where patients control their health data. The system enables consent-based access for healthcare providers and wallet-free emergency information retrieval through QR codes.

## Features

- **Patient Portal**: Blockchain-based registration and profile management
- **Doctor Portal**: Authorization-based medical record access
- **Emergency Access**: QR code system for first responders (no wallet required)
- **Web3 Integration**: Secure wallet authentication via MetaMask
- **Smart Contracts**: Solidity-based patient registration and authorization

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: Hardhat, Viem, Solidity
- **Testing**: Vitest, Playwright
- **Libraries**: qrcode.react

## Prerequisites

- Node.js 18+
- MetaMask browser extension
- Git

## Installation

```bash
git clone https://github.com/SahilKumar75/swasthya-sanchar.git
cd swasthya-sanchar
npm install
```

## Running the Application

### Start Blockchain Node

```bash
npx hardhat node
```

Keep this terminal running.

### Deploy Smart Contracts

In a new terminal:

```bash
npx hardhat run contracts/scripts/deploy.ts --network localhost
```

### Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

### Configure MetaMask

1. Add Hardhat network:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency: ETH

2. Import test account using private key from node output

## Usage

### Patient Portal

1. Connect MetaMask wallet
2. Register with name and date of birth
3. Generate emergency QR code at /patient/emergency

### Doctor Portal

1. Connect MetaMask wallet
2. View authorization status
3. Access patient records (with authorization)

### Emergency Access

Scan patient QR code for wallet-free access to critical medical information.

## Testing

```bash
# Unit tests
npm test

# E2E tests (requires dev server running)
npm run test:e2e

# Smart contract tests
npx hardhat test
```

## Project Structure

```
swasthya-sanchar/
├── contracts/          # Smart contracts and deployment
├── src/
│   ├── app/           # Next.js pages
│   ├── components/    # React components
│   └── lib/           # Utilities and Web3 helpers
├── tests/             # Test suites
└── public/            # Static assets
```

## License

MIT
