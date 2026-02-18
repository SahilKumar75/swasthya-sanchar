# Sovereign Data Flow: Zero-Knowledge Medical Records

This plan details how to implement **Client-Side Encryption** and **Decentralized Storage** within the existing `swasthya-sanchar` Next.js application.

## 🎯 Objective
Empower patients with **True Ownership** of their medical data.
1.  **Zero-Knowledge Architecture**: The server (Supabase) never sees unencrypted medical data.
2.  **Sovereign Storage**: Data lives on IPFS/Filecoin (via Pinata), not in a centralized database.
3.  **Verifiable History**: Record hashes are anchored on Polygon blockchain.

---

## 🏗️ Architecture Overview

### The "Hybrid Sovereign" Model

We use **Supabase for Indexing** (speed) and **IPFS for Truth** (sovereignty).

| Layer | Technology | Purpose | Data Visibility |
| :--- | :--- | :--- | :--- |
| **Identity** | **User Wallet / Device Key** | Encryption/Decryption | **Private** |
| **App Logic** | Next.js (Client) | Encrypts/Decrypts Data | **Private** (In Memory) |
| **Indexing** | Supabase (PostgreSQL) | Search, Filter, List Views | **Public** (Metadata Only) |
| **Storage** | **IPFS (Pinata)** | The actual Medical Record | **Encrypted Blob** (Opaque) |
| **Anchor** | **Polygon** | Proof of Existence/Timestamp | **Public Hash** |

---

## 🔐 Phase 1: Client-Side Encryption (The "Device Cipher")

### 1.1 Key Generation (On Login/Signup)
Instead of a raw password, we derive a **Encryption Key** from the user's secret.
-   **User Secret**: A unique phrase or derived from their Wallet Signature.
-   **Algorithm**: PBKDF2 or similar standard.

```typescript
// Proposed Utility: src/lib/crypto/encryption.ts
import { ethers } from 'ethers';

// Derive a key from a signature (Simplest for Hackathon)
export async function deriveKeyFromSignature(signature: string, salt: string): Promise<CryptoKey> {
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(signature),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}
```

### 1.2 Encrypting Data (Before Upload)
When a doctor saves a note:
1.  **Input**: JSON Data (SOAP Note, Vitals).
2.  **Process**:
    *   `JSON.stringify(data)` -> `Uint8Array`
    *   `crypto.subtle.encrypt(AES-GCM, key, iv, data)`
3.  **Output**: `iv` + `EncryptedBlob`.

---

## 💾 Phase 2: IPFS Storage (The "Vault")

### 2.1 Storage Flow
1.  **Client** generates the `EncryptedBlob`.
2.  **Client** uploads this blob directly to **Pinata** (using a temporary upload token from our API to avoid exposing secrets).
3.  **Pinata** returns an **IPFS Hash (CID)**.
    *   Example: `QmXoypizjW3WknFiJnKLwHCn...`

### 2.2 Metadata Storage (Supabase)
We save the **Pointer** to Supabase, NOT the data.

**New Schema Field**: `ipfsHash` (Already exists in your `ClinicalNote` model!)
*   **Update**: Ensure `encrypted_key` requires a new field or we use the user's wallet.

**Supabase Record**:
```json
{
  "id": "note_123",
  "patient_id": "pat_456",
  "doctor_id": "doc_789",
  "ipfs_hash": "QmXoy...",
  "encrypted_symmetric_key": "optional_if_sharing", 
  "metadata": {
    "type": "Consultation",
    "date": "2026-02-18",
    "hospital": "AIIMS"
  }
  // NO CLINICAL DATA HERE
}
```

---

## ⛓️ Phase 3: Blockchain Anchor (The "Receipt")

### 3.1 Smart Contract: `HealthRecordRegistry.sol`
A simple registry on Polygon.

```solidity
contract HealthRecordRegistry {
    event RecordAdded(address indexed patient, string ipfsHash, uint256 timestamp);

    function addRecord(address patient, string memory ipfsHash) public {
        // In a hackathon, the doctor's wallet might call this, 
        // or a Relayer (OpenZeppelin Defender / Biconomy) 
        emit RecordAdded(patient, ipfsHash, block.timestamp);
    }
}
```

---

## 🚀 Implementation Plan (5 Days)

### Day 1: Encryption & IPFS Hook
1.  Create `useEncryption` hook (wraps `window.crypto`).
2.  Create `usePinata` hook for uploading `Files`/`Blobs`.
3.  Update the "Save Note" button in `DoctorConsultation` component:
    *   **Old**: POST /api/notes
    *   **New**: Encrypt -> Upload IPFS -> POST /api/notes (with Hash)

### Day 2: Decryption & Viewing
1.  Update `PatientJourney` and `ClinicalNoteDetail` components.
2.  **Load**: Fetch Metadata from Supabase.
3.  **Decrypt**:
    *   Fetch IPFS content (via gateway `gateway.pinata.cloud/ipfs/...`).
    *   Decrypt using User's Key.
    *   Display decrypted JSON.

### Day 3: The "Verify" Badge
1.  Add a UI Toggle: "View Source".
    *   Shows the Raw Encrypted Blob from IPFS.
    *   Shows the Decrypted JSON.
    *   Shows the Polygon Transaction Hash.

### Day 4: Polygon Integration
1.  Deploy the simple `HealthRecordRegistry` contract.
2.  Call `addRecord` after successful IPFS upload.

---

## ⚠️ Key UX Considerations
1.  **Key Recovery**: For the hackathon, **store the encryption key in `localStorage`** or allow regenerating it from a "Recovery Phrase" (just a deterministic signature).
2.  **Sharing**: If Doctor needs to see it, User must "Share" the key.
    *   *Hackathon Shortcut*: Encrypt with a **Shared Secret** known to both, or store the Key encrypted with the Doctor's Public Key in Supabase (Hybrid).

## 📝 Next Steps
- [ ] Create `src/lib/crypto.ts`
- [ ] Create `src/lib/ipfs.ts`
- [ ] Update `ClinicalNote` creation flow.
