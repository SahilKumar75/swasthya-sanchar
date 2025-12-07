# Swasthya Sanchar - Smart Contracts

## Overview
Minimal Hardhat setup for blockchain-based healthcare records management.

## Structure
```
contracts/
├── contracts/          # Solidity source files
│   └── HealthRecords.sol
├── scripts/            # Deployment scripts
│   └── deploy.ts
├── test/              # Contract tests
│   └── HealthRecords.test.ts
└── tsconfig.json      # TypeScript config for Hardhat
```

## Smart Contract: HealthRecords.sol

### Features
- **Patient Registration**: Patients can self-register with basic info + emergency profile hash
- **Doctor Authorization**: Admin can authorize doctors to create records
- **Medical Records**: Authorized doctors can create records for patients (IPFS hash storage)
- **Access Control**: Role-based permissions (admin, doctors, patients)

### Key Functions
- `registerPatient()` - Register new patient
- `authorizeDoctor()` - Admin authorizes a doctor
- `createRecord()` - Doctor creates medical record for patient
- `getPatient()` - Retrieve patient information
- `getPatientRecords()` - Get all record IDs for a patient
- `getRecord()` - Get specific medical record

## Commands

### Compile Contracts
```bash
npx hardhat compile
```

### Run Tests
```bash
npx hardhat test
```

### Start Local Node
```bash
npm run node
# or
npx hardhat node
```

### Deploy to Local Network
```bash
npm run deploy
# or
npx hardhat run contracts/scripts/deploy.ts --network localhost
```

## Configuration
- Solidity Version: 0.8.24
- Network: Localhost (for development)
- Toolbox: Hardhat Viem

## Next Steps
- Add more sophisticated access control
- Implement record sharing/permissions
- Add emergency access features
- Integrate with IPFS for data storage
