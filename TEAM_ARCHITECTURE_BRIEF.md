# 📄 Team Brief: The "Sovereign Swasthya" Architecture

**To:** Engineering Team
**From:** [Your Name]
**Date:** February 17, 2026
**Subject:** Proposal for Zero-Backend, Local-First Architecture

---

## 🚀 Executive Summary

We are pivoting **Swasthya Sanchar** to a "Sovereign Architecture".
**Goal:** Achieve 100% Patient Data Ownership and Zero Third-Party Dependency.
**Change:** Removing central servers (AWS, Supabase, Auth0) in favor of a **Local-First** model powered by **Polygon** and **IPFS**.

---

## 🛑 The Problem with "Platform-First"
Currently, we rely on Supabase for data and Privy/Auth0 for login.
1.  **Custody Risk:** We technically "own" the patient's data. If we get hacked, they get hacked.
2.  **Vendor Lock-in:** We depend on AWS/Supabase uptime.
3.  **Not Web3 enough:** Users still need our permission to access their own history.

## ✅ The Solution: "Device-First" (The Sovereign Stack)

We are moving to a stack where **The User's Device** is the server.

| Feature | Old Architecture | **New "Sovereign" Architecture** |
| :--- | :--- | :--- |
| **Hosting** | AWS / DigitalOcean | **Vercel** (Global Edge Network) |
| **Identity** | Google / Supabase Auth | **The Device Cipher** (Standard Password + Crypto) |
| **Logic** | Python Backend | **Polygon Smart Contracts** |
| **Storage** | S3 Bucket | **IPFS** (Public Decentralized Network) |
| **Database** | PostgreSQL | **IndexedDB** (User Device) + **Smart Contract Registry** |

---

## 🔑 Key Innovation: "The Device Cipher" Authentication

We are solving the "Web3 UX Problem" (MetaMask is hard) without compromising security.

### How Login Works (No Servers)
1.  **Registration**:
    *   User enters `Email` + `Password`.
    *   Device generates a random **Wallet Key**.
    *   Device encrypts this key **twice**:
        *   **Lock A**: Encrypted with `Password` (Uploaded to IPFS).
        *   **Lock B**: Encrypted with `Device ID` (Stored in Browser).
2.  **Daily Login**:
    *   User opens app -> Device unlocks **Lock B** instantly (FaceID/PIN).
    *   **Result**: Instant login, no password typing needed.
3.  **New Device Login**:
    *   User enters `Password`.
    *   Device downloads **Lock A** from IPFS -> Decrypts Wallet -> Logged In.

---

## ⚡ Performance: The "Local-First" Sync Engine

**Q: Isn't fetching from IPFS slow?**
A: It would be, if we did it every time. But we **don't**.

We use a **Local-First Sync Protocol** (CRDTs like **Yjs**):
1.  **Instant Load**: The app reads data *instantly* from the device's local database (IndexedDB). Zero loading spinners.
2.  **Background Sync**: The app silently talks to IPFS/Polygon in the background to push/pull updates.
3.  **Conflict Resolution**: If you edit on your phone and laptop offline, the CRDT mathematics merges the changes automatically when you go online.

**Result**: The app feels as fast as Apple Notes, but is fully decentralized.

---

## 💾 Data Persistence: The "Pinning" Layer
You asked: *"IPFS files disappear if nodes go offline. How do we solve this?"*
A: We use a **Pinning Service**.

1.  **The Concept**: Just like you pay Google Drive to keep a file, you ask an IPFS node to "Pin" a file. This guarantees it stays online.
2.  **The Solution**:
    *   **Option A (Free)**: Web3.Storage (Filecoin-backed, free tier).
    *   **Option B (Sovereign)**: We run **one lightweight VPS** ($5/mo) with an IPFS node.
    *   **The Flow**: When a user saves data -> Their device uploads to the network -> Our "Pinning Node" detects it and pins it permanently.

## ⛽ Gas Fees: The "Paymaster"
You asked: *"Who is paying this gas fees?"*
A: **Technically Us, but it feels free.**

1.  **The Meta-Transaction**: The user signs a "Request", not a "Transaction".
2.  **The Relayer**: Our backend (or a service like Biconomy/Gelato) handles the request.
3.  **The Paymaster**: A smart contract that refunds the Relayer.
4.  **Cost**: Polygon transactions cost ~$0.01. For 1,000 users, it costs us ~$10.
5.  **User Experience**: The user never needs to buy MATIC.

---

## 🛡️ Disaster Recovery (The "Clear Cache" Scenario)

**Q: What if the user clears their browser cache?**
A: We have a "Blind Backup" system.

1.  **The Safety Net**: Every time data changes, the encrypted blob is pinned to IPFS.
2.  **Recovery**: If cache is cleared, the user just performs a **New Device Login** (enters Password). The app redownloads the encrypted key and data from the network.
3.  **Result**: No data loss, as long as they remember their password.

---

## 🛠️ Infrastructure Requirements

We are removing 90% of our DevOps overhead.

*   **Vercel**: Hosts the frontend code.
*   **Polygon**: Acts as our "User Directory" and "Access Control List".
*   **IPFS Node**: A single "dumb" node (or pinning service) that just pins encrypted files to ensure availability. It cannot read them.

## 📅 Migration Plan

1.  **Phase 1**: Install Crypto Libraries (`scrypt`, `ethers`).
2.  **Phase 2**: Remove Supabase/Privy SDKs.
3.  **Phase 3**: Deploy `IdentityRegistry` contract to Polygon.
4.  **Phase 4**: Update Frontend to use "Device Cipher" login flow.

---

**Action Item:** Please review and confirm if we are ready to proceed with the **Device Cipher** implementation.
