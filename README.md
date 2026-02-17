# Swasthya Sanchar

A decentralized healthcare records management system enabling patient data ownership, hospital journey tracking, and instant emergency access using blockchain technology.

## Overview

Swasthya Sanchar gives patients control over their data and streamlines hospital visits. It includes secure document storage on IPFS, consent-based access for doctors, a QR code system for first responders (including offline Zero-Net protocol), and full journey tracking with family sharing, WhatsApp/SMS notifications, and wait-time estimates.

## Features

- **Patient Portal**: Blockchain identity, medical profile, and hospital journey tracking (start visit, view checkpoints, share with family).
- **Doctor Portal**: Verifiable credentials, patient data access, and AI voice documentation (SOAP notes from speech).
- **Emergency Access**: Critical data (blood type, allergies) via QR scan; offline Zero-Net QR with multi-language read-aloud.
- **Journey Tracking**: Real-time checkpoint updates, queue position, estimated wait; staff dashboard and checkpoint updater.
- **WhatsApp & SMS**: Bot commands (status, qr, help) via webhook; journey share notifications; SMS fallback when WhatsApp is unavailable.
- **Wait Time Prediction**: Historical queue stats and rule-based estimates; prediction API and display in journey tracker.
- **Accessibility**: Language preference (EN/HI/MR/TA), simple mode, high contrast, reduced motion; voice commands for patients.
- **Data Security**: End-to-end encryption and decentralized storage where applicable.

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

Copy `.env.example` to `.env` and set:

- **Database**: `DATABASE_URL`, `DIRECT_URL` (Supabase)
- **Auth**: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (for Realtime)
- **AI/Voice**: `GROQ_API_KEY` (SOAP notes)
- **QR**: `QR_SIGNING_KEY` (Zero-Net signing)
- **Twilio (optional)**: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER`, `TWILIO_PHONE_NUMBER`; `WHATSAPP_VERIFY_TOKEN` for Meta webhook verification

Import the test account usage private keys provided by the Hardhat node into your MetaMask wallet.
Network: Localhost 8545 (Chain ID: 31337)

## API Summary

- **Journey**: `GET/POST /api/journey`, `GET/PATCH /api/journey/[id]`, `POST /api/journey/[id]/checkpoint`, `GET/POST/DELETE /api/journey/[id]/share`
- **Hospitals**: `GET/POST /api/hospitals`, `GET /api/hospitals/[id]/journeys`
- **Queue**: `GET /api/queue/predict?departmentId=`, `POST /api/queue/stats/log`
- **Voice**: `POST /api/voice/soap-note`, `GET /api/voice/notes`, `GET /api/voice/notes/[id]`
- **WhatsApp**: `GET/POST /api/whatsapp/webhook` (Twilio/Meta)
- **SMS**: `POST /api/sms/send` (body: `{ to, message }`)
- **User**: `GET/POST /api/user/language`
- **Demo**: `POST /api/seed`

## Testing

Run the test suite:
```bash
npm run test:e2e
```

## License

MIT
