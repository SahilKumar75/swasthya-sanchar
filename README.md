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

## 🎬 3-Minute Live Demo

Perfect for judges and stakeholders - shows the complete emergency healthcare flow:

### **0:00-0:30 | The Problem**
*"Medical records are fragmented across hospitals. In emergencies, first responders can't access critical information like allergies or blood type—costing precious time and lives."*

### **0:30-1:30 | Patient Registration (LIVE)**
1. Navigate to `/patient`
2. Connect MetaMask wallet
3. Register with name + date of birth → **Writes to blockchain**
4. Go to `/patient/emergency`
5. Click "Generate Emergency QR Code"
6. **Show QR on screen** - "This contains my blockchain address. Print on ID or save to phone lock screen."

### **1:30-2:00 | Emergency Response (LIVE SCAN)**
1. **Scan QR with phone** → Opens `/emergency/[address]`
2. **"No wallet needed!"** - Page loads instantly showing:
   - 🩸 Blood Type: O+ (prominent display)
   - ⚠️ Allergies: Penicillin, Peanuts
   - 💊 Current Medications
   - 📞 Emergency Contact (clickable phone number)
3. *"First responder has life-saving info in 3 seconds—no login, no wallet, no delay."*

### **2:00-2:30 | Doctor Access (With Consent)**
1. Navigate to `/doctor`
2. Connect MetaMask (different wallet)
3. Enter patient address
4. View medical records (mock data for demo)
5. *"Consent-based access—patients control who sees what."*

### **2:30-3:00 | Tech Stack + Impact**
- **Built with:** Next.js 14 + Hardhat + Viem + Solidity
- **Deployed on:** Vercel (frontend) + Blockchain (data)
- **Impact:** 
  - ⚡ Saves lives in emergencies
  - 🔐 Returns data ownership to patients  
  - 🚫 Zero crypto knowledge required

**Live Production:** `https://swasthya-sanchar.vercel.app`

---

## Usage

### Patient Portal

1. Connect MetaMask wallet
2. Register with name and date of birth
3. Generate emergency QR code at `/patient/emergency`
4. Print QR or save to phone lock screen

### Doctor Portal

1. Connect MetaMask wallet
2. View authorization status
3. Enter patient blockchain address
4. Access patient records (with patient consent)

### Emergency Access

**No wallet required!** Scan patient QR code for instant access to:
- Blood type
- Allergies
- Medical conditions
- Current medications
- Emergency contact information

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests (Playwright)
```bash
# Requires dev server running on port 3000
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/e2e/emergency.spec.ts
```

### Smart Contract Tests
```bash
npx hardhat test
```

### 📋 TestSprite CI Configuration

For continuous integration and automated testing:

```yaml
repository: SahilKumar75/swasthya-sanchar
branch: main
testCommand: npm run test:e2e
devServer: npm run dev
port: 3000
framework: Playwright + Next.js 14

knownIssues:
  - 15/38 E2E tests fail on text matching (UI redesign changed copy)
  - Tests reference old gradient-based UI elements
  - Wallet mock tests (access.spec.ts) require MetaMask extension mock
  
priorityTests:
  - emergency.spec.ts (12 tests) - Emergency responder page structure
  - patient-portal.spec.ts (6 tests) - Patient registration flow
  - doctor-portal.spec.ts (8 tests) - Doctor authorization
  
notes: |
  Core functionality works correctly. Test failures are due to:
  1. Monochromatic UI redesign changed button/text selectors
  2. Emergency page added loading state (timing issues)
  3. Multiple "Connect Wallet" buttons causing strict mode violations
  
  To fix: Update test selectors to match new UI patterns.
```

**Test Status:** ✅ Core flows functional | ⚠️ Selectors need update post-redesign

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
