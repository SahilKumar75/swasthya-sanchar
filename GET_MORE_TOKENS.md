# 🚨 Need More Testnet MATIC

Your wallet has **0.1 MATIC** but needs **~0.3 MATIC** to deploy.

## Get More Tokens from These Faucets:

### 1. Alchemy Faucet (Recommended - No 24hr limit)
https://www.alchemy.com/faucets/polygon-amoy

### 2. Stakely Faucet
https://stakely.io/en/faucet/polygon-amoy-testnet

### 3. QuickNode Faucet  
https://faucet.quicknode.com/polygon/amoy

## Your Wallet Address:
```
0x2c57db7ec15a01ec3b51979ab0c85d0c0d98c433
```

## After Getting More Tokens:

Run this command to deploy:
```bash
npx hardhat run contracts/scripts/deploy-amoy.ts --network amoy
```

It will show your balance and deploy if you have enough funds.

## Alternative: Deploy to Vercel NOW with Demo Mode

Your app already works without blockchain! The emergency page shows demo data automatically.

```bash
git add .
git commit -m "Add Polygon Amoy configuration" 
git push origin main
```

Then scan QR codes - they'll show demo patient data. Deploy the contract later when you have tokens.
