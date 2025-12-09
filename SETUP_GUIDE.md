# Quick Setup Guide - Authentication System

## 🚀 Getting Started

Follow these steps to set up the new authentication system:

### 1. Environment Variables (Already Done ✓)

The `.env.local` file has been created with placeholder values. You'll need to update them:

```bash
# For local development, you can keep the default POSTGRES_URL
# For production, Vercel will auto-set this when you create a Postgres database

# Generate a secure secret:
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

Then paste it in `.env.local` replacing `your-secret-key-here-change-this-in-production`

### 2. Setup Vercel Postgres (Production)

**Option A: Via Vercel Dashboard (Recommended)**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Navigate to **Storage** tab
4. Click **Create Database** → **Postgres**
5. Follow the wizard (free tier is fine for development)
6. Vercel will automatically set `POSTGRES_URL` environment variable

**Option B: Via Vercel CLI**
```bash
vercel env add POSTGRES_URL
# Paste your connection string when prompted
```

### 3. Run Database Migrations

After setting up Postgres, create the tables:

```bash
# Push schema to database
npx drizzle-kit push
```

This will create the `users`, `patients`, and `doctors` tables.

### 4. Start Development Server

```bash
# Make sure Hardhat node is running (for blockchain features)
npx hardhat node

# In another terminal, start Next.js
npm run dev
```

### 5. Test the Authentication Flow

1. **Visit** http://localhost:3000
2. **Click** "Create Account"
3. **Sign up** with email, password, choose role (patient or doctor)
4. **Auto-redirect** to your portal after signup
5. **Connect wallet** (future step - will be implemented in portal)

## 📝 What Was Built

### Files Created

- ✅ `src/db/schema.ts` - Database schema (users, patients, doctors)
- ✅ `src/db/index.ts` - Database client initialization
- ✅ `src/app/api/auth/[...nextauth]/route.ts` - NextAuth config
- ✅ `src/app/api/auth/signup/route.ts` - Signup API
- ✅ `src/app/auth/login/page.tsx` - Login UI
- ✅ `src/app/auth/signup/page.tsx` - Signup UI
- ✅ `src/types/next-auth.d.ts` - TypeScript types for NextAuth
- ✅ `src/components/AuthProvider.tsx` - Session provider wrapper
- ✅ `.env.local` - Environment variables
- ✅ `drizzle.config.ts` - Drizzle migration config
- ✅ `AUTH_SYSTEM.md` - Complete documentation

### Files Modified

- ✅ `src/app/page.tsx` - Landing page with new auth flow
- ✅ `src/app/layout.tsx` - Added SessionProvider

### Next Steps (To Be Implemented)

- [ ] Update patient portal to check session
- [ ] Update doctor portal to check session  
- [ ] Add wallet connection flow AFTER login
- [ ] Link wallet address to user account
- [ ] Update blockchain registration to use session user ID
- [ ] Create onboarding flow for wallet connection
- [ ] Add profile completion pages

## 🔧 Troubleshooting

### "Error connecting to database"
- Check if `POSTGRES_URL` is set correctly in `.env.local`
- For local dev, you can use a local Postgres instance
- For production, ensure Vercel Postgres database is created

### "NEXTAUTH_SECRET not set"
- Generate one with: `openssl rand -base64 32`
- Add it to `.env.local`
- Restart dev server

### Signup fails with "User already exists"
- Email is already registered
- Try a different email or check your database

### Can't see signup/login pages
- Clear browser cache
- Check the URL: http://localhost:3000/auth/login
- Restart dev server

## 📖 Documentation

See `AUTH_SYSTEM.md` for complete documentation including:
- Architecture overview
- Database schema details
- API endpoint documentation
- Security features
- User flow diagrams

## 🎯 Current vs. New Architecture

### OLD (Wallet-Only):
```
User → Connect MetaMask → Check blockchain → Redirect to portal
```

### NEW (Hybrid Account + Wallet):
```
User → Signup/Login → Connect wallet → Link to account → Blockchain registration → Portal access
```

## ✅ Ready to Use

The authentication system is ready! You can now:
- ✅ Create accounts with email/password
- ✅ Login with credentials
- ✅ Role-based access (patient/doctor)
- ✅ Session management
- ✅ Auto-redirect based on role

**Next priority:** Connect wallet flow in patient/doctor portals after login.
