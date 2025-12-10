# 🚀 Deployment Guide for Vercel + Phone Scanning

This guide shows how to deploy your blockchain healthcare app to Vercel so you can scan QR codes from your phone and see real patient data.

## Prerequisites

- [ ] MetaMask wallet installed
- [ ] Vercel account connected to your GitHub repo
- [ ] Access to your phone for QR scanning

## Step 1: Get Testnet Tokens (Free)

1. **Get Polygon Amoy testnet MATIC** (required for deploying contract):
   - Visit: https://faucet.polygon.technology/
   - Select "Polygon Amoy" from the network dropdown
   - Paste your MetaMask wallet address
   - Click "Submit" to receive free testnet MATIC
   - Wait 1-2 minutes for tokens to arrive

2. **Verify tokens received**:
   ```bash
   # Check your wallet balance on Amoy testnet in MetaMask
   # Should show ~0.5 MATIC or more
   ```

## Step 2: Configure Your Environment

1. **Export your private key from MetaMask**:
   - Open MetaMask
   - Click the three dots on your account
   - Select "Account Details"
   - Click "Show Private Key"
   - Enter your password
   - Copy the private key

2. **Update `.env.local` file**:
   ```bash
   # Replace 'your_private_key_here' with your actual private key
   PRIVATE_KEY=0xYourActualPrivateKeyHere
   ```
   
   ⚠️ **NEVER commit this file to GitHub!** It's already in `.gitignore`.

## Step 3: Add Polygon Amoy to MetaMask

1. Open MetaMask
2. Click the network dropdown (top left)
3. Click "Add Network" → "Add a network manually"
4. Enter the following details:
   - **Network Name**: Polygon Amoy Testnet
   - **RPC URL**: `https://rpc-amoy.polygon.technology/`
   - **Chain ID**: `80002`
   - **Currency Symbol**: `MATIC`
   - **Block Explorer**: `https://amoy.polygonscan.com/`
5. Click "Save"
6. Switch to the Polygon Amoy network

## Step 4: Deploy Smart Contract to Testnet

```bash
# Deploy the HealthRecords contract to Polygon Amoy
npx hardhat run contracts/scripts/deploy.ts --network amoy
```

**Expected output:**
```
🏥 Deploying Swasthya Sanchar contracts...

✅ HealthRecords deployed to: 0xABC123...
📍 Deployer address: 0xYourAddress...
💰 Deployer balance: 0.49 ETH

✨ Deployment complete!

Contract addresses:
-------------------
HealthRecords: 0xABC123...
```

**Copy the deployed contract address** (e.g., `0xABC123...`) - you'll need it in the next step.

## Step 5: Update Contract Address in Code

1. Open `src/lib/contracts.ts`
2. Find line 463 (at the bottom of the file)
3. Replace the address with your new deployed contract address:

```typescript
export const HEALTH_RECORDS_ADDRESS = "0xYOUR_NEW_ADDRESS_FROM_STEP_4" as `0x${string}`;
```

4. Save the file

## Step 6: Commit and Push to GitHub

```bash
# Add the updated contract address
git add src/lib/contracts.ts hardhat.config.ts

# Commit the changes
git commit -m "Deploy contract to Polygon Amoy testnet"

# Push to GitHub
git push origin main
```

⚠️ **Verify `.env.local` is NOT included in the commit!**

## Step 7: Deploy to Vercel

1. **Push triggers automatic deployment**:
   - Vercel will automatically detect your push
   - Build will start automatically
   - Wait ~2-3 minutes for deployment

2. **Or manually trigger from Vercel dashboard**:
   - Go to https://vercel.com/dashboard
   - Select your project
   - Click "Redeploy" if needed

3. **Get your production URL**:
   - Example: `https://swasthya-sanchar.vercel.app`

## Step 8: Test with Phone Scanning

### Register a Patient

1. **On your computer**, visit your Vercel app URL
2. Go to `/patient`
3. Connect MetaMask (make sure you're on Polygon Amoy network)
4. Click "Register as Patient"
5. Fill in your information:
   - Name, Date of Birth (required)
   - Blood Group, Allergies, Medications
   - Emergency Contact details
6. Click through all steps and submit to blockchain
7. Wait for transaction confirmation (~5-10 seconds)
8. Go to `/patient/emergency` or your dashboard to generate QR code

### Scan QR Code from Phone

1. **Download/screenshot the QR code** from your dashboard
2. **On your phone**, open camera or QR scanner
3. **Scan the QR code**
4. Your phone will open a URL like:
   ```
   https://swasthya-sanchar.vercel.app/emergency/0xYourWalletAddress
   ```
5. **See your real patient data** displayed instantly! 🎉

## Step 9: Configure Privacy Settings (Optional)

Control what information is visible on your emergency QR:

1. Go to your patient dashboard
2. Scroll to "Privacy Settings"
3. Toggle optional fields (name, blood type, allergies always visible for safety)
4. Click "Update Privacy Settings"
5. Re-scan QR to see updated visibility

## Troubleshooting

### "Patient not found or not registered"
- Ensure you completed registration and the transaction was confirmed
- Check you're using the correct wallet address in the QR URL
- Verify contract address is updated in `src/lib/contracts.ts`

### "Demo data showing instead of real data"
- This means the blockchain connection failed
- Check that the contract is deployed to Amoy (not localhost)
- Verify the contract address in `src/lib/contracts.ts` matches your deployment
- Check Polygon Amoy RPC is accessible: https://rpc-amoy.polygon.technology/

### "Transaction failed" during registration
- Ensure you have enough testnet MATIC (get more from faucet)
- Switch MetaMask to Polygon Amoy network
- Try increasing gas limit in MetaMask

### QR code doesn't scan
- Make sure the QR image is clear and not blurry
- Try increasing brightness on your screen
- Use a dedicated QR scanner app if camera doesn't work

## Network Information

| Property | Value |
|----------|-------|
| Network Name | Polygon Amoy Testnet |
| RPC URL | https://rpc-amoy.polygon.technology/ |
| Chain ID | 80002 |
| Currency | MATIC |
| Explorer | https://amoy.polygonscan.com/ |
| Faucet | https://faucet.polygon.technology/ |

## Verifying Your Deployment

### Check Contract on Block Explorer
1. Visit: https://amoy.polygonscan.com/
2. Paste your contract address
3. You should see:
   - Contract creation transaction
   - Patient registration transactions
   - Contract code (verified)

### Test Emergency Access
1. Visit: `https://your-app.vercel.app/emergency/YOUR_WALLET_ADDRESS`
2. Should see your patient information without needing wallet
3. Works on any device with internet

## Next Steps

- ✅ Share QR code with family/friends for emergencies
- ✅ Print QR on medical ID card
- ✅ Add to phone lock screen
- ✅ Authorize doctors via doctor portal
- ✅ Update medical information as needed

## Security Notes

- ✅ `.env.local` is in `.gitignore` (private key protected)
- ✅ Only emergency info visible via QR (patient controls privacy)
- ✅ Full records require doctor authorization
- ✅ Smart contract is immutable and auditable
- ✅ You own your data (stored on blockchain, not centralized server)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all steps were completed in order
3. Check MetaMask is on Polygon Amoy network
4. Ensure sufficient testnet MATIC balance

---

**Congratulations!** 🎉 Your blockchain healthcare app is now live and accessible from any phone via QR scanning!
