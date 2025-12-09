# Authentication System

## Overview

Swasthya Sanchar uses a **hybrid authentication system** that combines traditional email/password authentication with blockchain wallet integration.

## Architecture

### 1. Account Creation (NextAuth.js + Drizzle)
- Users create accounts with email and password
- Passwords are hashed using bcryptjs (12 rounds)
- User data stored in Vercel Postgres database
- JWT-based sessions for fast authentication

### 2. Wallet Connection (MetaMask)
- After login, users connect their MetaMask wallet
- Wallet address stored in user profile
- Used for blockchain interactions

### 3. Role-Based Access
- Users choose role during signup: **Patient** or **Doctor**
- Role determines portal access and permissions
- Stored in database and session

### 4. Blockchain Registration
- **Patients**: Register on blockchain after account creation
- **Doctors**: Wait for admin authorization on blockchain
- Blockchain stores immutable medical records

## Tech Stack

- **NextAuth.js**: Authentication framework
- **Drizzle ORM**: Database queries
- **Vercel Postgres**: Database hosting
- **bcryptjs**: Password hashing
- **JWT**: Session management
- **MetaMask**: Wallet connection
- **Hardhat**: Local blockchain development

## User Flow

```
1. Landing Page → Click "Create Account"
2. Signup Page → Enter email, password, choose role
3. Auto-login → Redirect to portal
4. Portal → Connect MetaMask wallet
5. Blockchain Registration:
   - Patient: Self-register on blockchain
   - Doctor: Wait for admin authorization
6. Full Access → Use portal features
```

## Database Schema

### Users Table
```typescript
{
  id: uuid (primary key)
  email: string (unique)
  passwordHash: string
  walletAddress: string | null (unique)
  role: "patient" | "doctor" | "admin"
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Patients Table
```typescript
{
  id: uuid (primary key)
  userId: uuid (foreign key → users.id, unique)
  name: string
  dateOfBirth: date
  registeredOnBlockchain: boolean
  blockchainTxHash: string | null
}
```

### Doctors Table
```typescript
{
  id: uuid (primary key)
  userId: uuid (foreign key → users.id, unique)
  name: string
  licenseNumber: string
  specialization: string
  authorizedOnBlockchain: boolean
  blockchainTxHash: string | null
}
```

## API Routes

### `/api/auth/signup` (POST)
- Creates new user account
- Validates email uniqueness
- Hashes password
- Returns user data

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "role": "patient"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "patient"
  }
}
```

### `/api/auth/[...nextauth]` (NextAuth.js)
- Handles login/logout
- JWT session management
- Credentials provider (email/password)

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

## Environment Variables

```bash
# Database
POSTGRES_URL="postgresql://user:password@localhost:5432/swasthya_sanchar"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Session Management

### Session Object
```typescript
{
  user: {
    id: string;
    email: string;
    role: "patient" | "doctor" | "admin";
    walletAddress: string | null;
  }
}
```

### Accessing Session
```typescript
import { useSession } from "next-auth/react";

const { data: session, status } = useSession();

if (status === "authenticated") {
  console.log(session.user.email);
  console.log(session.user.role);
}
```

## Protected Routes

Use NextAuth's session check + wallet verification:

```typescript
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <div>Protected content</div>;
}
```

## Logout

Logout clears both session and wallet connection:

```typescript
import { signOut } from "next-auth/react";
import { disconnectWallet } from "@/lib/web3";

const handleLogout = async () => {
  await disconnectWallet();
  await signOut({ callbackUrl: "/" });
};
```

## Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your values
   ```

3. **Start Hardhat node:**
   ```bash
   npx hardhat node
   ```

4. **Deploy contracts:**
   ```bash
   npx hardhat run scripts/deploy.ts --network localhost
   ```

5. **Run database migrations:**
   ```bash
   npx drizzle-kit push
   ```

6. **Start dev server:**
   ```bash
   npm run dev
   ```

## Production Deployment (Vercel)

1. **Create Vercel Postgres database:**
   - Go to Vercel dashboard → Storage → Create Postgres
   - Vercel auto-sets `POSTGRES_URL`

2. **Set environment variables:**
   ```bash
   NEXTAUTH_SECRET=$(openssl rand -base64 32)
   NEXTAUTH_URL=https://yourapp.vercel.app
   ```

3. **Run migrations on production:**
   ```bash
   npx drizzle-kit push
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

## Security Features

- ✅ Password hashing with bcryptjs (12 rounds)
- ✅ JWT-based sessions (httpOnly cookies)
- ✅ CSRF protection (NextAuth built-in)
- ✅ SQL injection prevention (Drizzle parameterized queries)
- ✅ Wallet signature verification
- ✅ Role-based access control
- ✅ Session expiration
- ✅ Secure password requirements (min 8 chars)

## Troubleshooting

### "User not found" error
- Check if user exists in database
- Verify email is correct
- Check database connection

### "Invalid password" error
- Ensure password is correct
- Check if bcrypt hash is valid
- Verify password field is not null

### Session not persisting
- Check NEXTAUTH_SECRET is set
- Verify cookies are enabled
- Check NEXTAUTH_URL matches your domain

### Wallet connection fails
- Ensure MetaMask is installed
- Check network (should be Hardhat localhost)
- Verify contract is deployed

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, GitHub)
- [ ] Account recovery
- [ ] Password strength meter
- [ ] Rate limiting on login attempts
- [ ] Audit logs for security events
