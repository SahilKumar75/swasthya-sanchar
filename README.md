# Swasthya Sanchar

A decentralized healthcare records management system enabling patient data ownership and instant emergency access using blockchain technology.

## Overview

Swasthya Sanchar solves the problem of fragmented medical records by giving patients control over their data. It features secure document storage on IPFS, consent-based access for doctors, and a QR code system for first responders to access critical information without requiring a wallet.

## Features

- **Patient Portal**: Blockchain identity creation and medical profile management.
- **Doctor Portal**: Verifiable medical credentials and authorized patient data access.
- **Emergency Access**: Instant access to critical data (Blood Type, Allergies) via QR code scan.
- **Data Security**: End-to-end encryption with decentralized storage.
- **Global Availability**: Records are accessible anywhere with 100% uptime.

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: Solidity, Ethereum/Hardhat, Viem
- **Storage**: IPFS
- **Testing**: Playwright, Vitest

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/SahilKumar75/swasthya-sanchar.git
   cd swasthya-sanchar
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local blockchain node:
   ```bash
   npx hardhat node
   ```

4. Deploy smart contracts (in a separate terminal):
   ```bash
   npx hardhat run contracts/scripts/deploy.ts --network localhost
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:3000

## Configuration

Import the test account usage private keys provided by the Hardhat node into your MetaMask wallet.
Network: Localhost 8545 (Chain ID: 31337)

## Testing

Run the test suite:
```bash
npm run test:e2e
```

## License

MIT
