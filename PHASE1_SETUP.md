# Quick Setup Guide - Phase 1 Testing

## Prerequisites

1. **Pinata Account** (Free tier is sufficient)
   - Sign up at: https://app.pinata.cloud/
   - Navigate to: API Keys → New Key
   - Permissions: `pinFileToIPFS`, `pinJSONToIPFS`
   - Copy the JWT token

2. **Environment Variables**
   ```bash
   # Add to .env.local
   NEXT_PUBLIC_PINATA_JWT=your_jwt_token_here
   NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud
   ```

## Quick Start (5 minutes)

### Terminal 1: Blockchain Node
```bash
npx hardhat node
```
Leave running. Copy Account #0 and #1 private keys.

### Terminal 2: Deploy Contract
```bash
npx hardhat run contracts/scripts/deploy.ts --network localhost
```
Note the deployed contract address.

### Terminal 3: Start App
```bash
npm run dev
```
Open http://localhost:3000

### MetaMask Setup
1. Add network:
   - Name: Hardhat Local
   - RPC: http://127.0.0.1:8545
   - Chain ID: 31337

2. Import accounts using private keys from Terminal 1

## Test Flow (3 minutes)

1. **Patient (Account #0)**
   - Register at `/patient`
   - Go to `/patient/permissions`
   - Grant access to Account #1 address

2. **Doctor (Account #1)**
   - Go to `/doctor/home`
   - Enter patient address
   - Upload a PDF or image file
   - View the uploaded record

3. **Verify**
   - Check IPFS hash in success message
   - View record in doctor portal
   - Download file from IPFS

## Troubleshooting

| Error | Solution |
|-------|----------|
| "IPFS not configured" | Add `NEXT_PUBLIC_PINATA_JWT` to `.env.local` |
| "Not authorized by patient" | Patient must grant access first |
| "User rejected" | Approve transaction in MetaMask |
| Contract not found | Redeploy contract and update address in `contracts.ts` |

## What's New

✅ **IPFS Integration** - Real file storage
✅ **Patient Permissions** - Grant/revoke doctor access
✅ **Upload Component** - Drag-and-drop with progress
✅ **Record Viewer** - PDF and image display
✅ **Smart Contract** - Patient-controlled authorization

## Next Steps

- Test with real medical documents
- Verify IPFS retrieval speed
- Test permission revocation
- Proceed to Phase 2 (Encryption)
