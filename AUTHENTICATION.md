# Wallet-Based Authentication System

## Overview
This application uses **wallet-based authentication** (Option 3) - a Web3-native approach where wallet connection IS the authentication, and blockchain state IS the authorization. No backend, no JWT tokens, no separate login/signup forms.

## Architecture

### Authentication Flow
```
User visits any page
    ↓
Check wallet connection (getCurrentAccount)
    ↓
    ├─ No wallet? → Redirect to landing page (/)
    ↓
    └─ Wallet connected? → Check blockchain role
           ↓
           ├─ Registered patient? → Redirect to /patient
           ├─ Authorized doctor? → Redirect to /doctor
           └─ No role? → Stay on landing page
```

## Page Protection

### Landing Page (`/`)
- **Auth Logic**: Checks wallet on mount
- **Behavior**: 
  - Registered patients → auto-redirect to `/patient`
  - Authorized doctors → auto-redirect to `/doctor`
  - Unconnected/unauthorized → show landing page
- **UI**: Loading spinner during auth check

### Patient Portal (`/patient`)
- **Auth Guard**: Requires wallet connection
- **Behavior**:
  - No wallet → redirect to `/`
  - Wallet disconnected → redirect to `/`
  - Unregistered patient → show registration form
  - Registered patient → show dashboard
- **Features**: Logout button in header

### Doctor Portal (`/doctor`)
- **Auth Guard**: Requires wallet connection
- **Behavior**:
  - No wallet → redirect to `/`
  - Wallet disconnected → redirect to `/`
  - Unauthorized → show "not authorized" message
  - Authorized doctor → show access form
- **Features**: Logout button in header

### Emergency QR Page (`/patient/emergency`)
- **Auth Guard**: Requires wallet connection AND patient registration
- **Behavior**:
  - No wallet → redirect to `/`
  - Wallet disconnected → redirect to `/`
  - Not registered → alert + redirect to `/patient`
  - Registered patient → show QR generator
- **UI**: Loading screen while checking registration
- **Features**: Logout button in header

### Emergency Responder View (`/emergency/[address]`)
- **Auth**: None (publicly accessible)
- **Purpose**: First responders can access patient emergency info without wallet
- **Data Source**: Reads from blockchain using provided patient address

## Implementation Details

### Auth Check Pattern
```typescript
useEffect(() => {
  async function checkConnection() {
    const account = await getCurrentAccount();
    if (!account) {
      router.push("/");
      return;
    }
    
    const conn = await connectWallet();
    setConnection(conn);
    // ... check role from blockchain
  }
  
  checkConnection();
}, [router]);
```

### Account Change Listener
All protected pages listen for wallet disconnection:
```typescript
const handleAccountsChanged = async (accounts: string[]) => {
  if (accounts.length === 0) {
    setConnection(null);
    router.push("/");
  } else {
    // Re-check authorization
  }
};

onAccountsChanged(handleAccountsChanged);
```

### Logout Implementation
```typescript
const handleLogout = () => {
  setConnection(null);
  setIsRegistered(false); // or setIsAuthorized(false)
  router.push("/");
};
```

## Security Considerations

### ✅ Implemented
- Wallet connection required for all protected routes
- Blockchain state verification (not just wallet presence)
- Automatic redirect on wallet disconnection
- Role-based access control via smart contract
- Loading states to prevent UI flashing

### 🔒 Production Enhancements Needed
- Rate limiting on blockchain reads
- Caching of authorization checks (with TTL)
- Error boundary for failed auth checks
- Proper session timeout handling
- Multi-chain support considerations

## User Flows

### New Patient Registration
1. User visits landing page with wallet connected
2. Not registered → stays on landing
3. Clicks "Patient Portal" button
4. Redirected to `/patient`
5. No wallet check fails → redirected back to `/`
6. Connects wallet → auth guard passes
7. Sees registration form (not registered)
8. Fills form → registers on blockchain
9. Registration status updates → dashboard appears
10. Logout → returns to landing page

### Returning Patient
1. User visits landing page with wallet connected
2. Already registered → auto-redirected to `/patient`
3. Sees dashboard immediately
4. Clicks "Emergency Access" → goes to `/patient/emergency`
5. Auth guard checks registration → passes
6. Generates QR code
7. Logout → returns to landing page

### Doctor Access
1. Doctor visits landing page with wallet connected
2. Authorized → auto-redirected to `/doctor`
3. Sees access form
4. Enters patient address → checks access
5. Views patient records
6. Logout → returns to landing page

### Emergency Responder
1. Responder scans QR code (no wallet needed)
2. Opens `/emergency/[patient-address]`
3. Reads patient emergency info from blockchain
4. No authentication required (public emergency data)

## Testing Checklist

- [ ] Unconnected user visits `/patient` → redirects to `/`
- [ ] Unconnected user visits `/doctor` → redirects to `/`
- [ ] Unconnected user visits `/patient/emergency` → redirects to `/`
- [ ] Registered patient visits `/` → auto-redirects to `/patient`
- [ ] Authorized doctor visits `/` → auto-redirects to `/doctor`
- [ ] Unregistered patient on `/patient` → sees registration form
- [ ] Logout on `/patient` → returns to `/`
- [ ] Logout on `/doctor` → returns to `/`
- [ ] Logout on `/patient/emergency` → returns to `/`
- [ ] Wallet disconnect on any page → auto-redirects to `/`
- [ ] Emergency responder accesses `/emergency/[address]` → works without wallet

## Code Files Modified

1. `src/app/page.tsx` - Landing page with auth redirect
2. `src/app/patient/page.tsx` - Patient portal auth guard + logout
3. `src/app/doctor/page.tsx` - Doctor portal auth guard + logout
4. `src/app/patient/emergency/page.tsx` - Emergency page auth guard + logout
5. `src/lib/web3.ts` - Web3 utilities (unchanged)
6. `src/components/ThemeProvider.tsx` - Theme system (unchanged)

## Next Steps

- ✅ Landing page auth redirect
- ✅ Patient portal auth guard
- ✅ Doctor portal auth guard  
- ✅ Emergency page auth guard
- ✅ Logout functionality
- 🔲 Manual testing all flows
- 🔲 Add localStorage caching for auth checks
- 🔲 Implement proper error handling UI
- 🔲 Add wallet provider detection (MetaMask, etc.)
