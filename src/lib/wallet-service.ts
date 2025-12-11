// Backend Wallet Management Service
// This service handles wallet creation, encryption, and blockchain interactions

import { ethers } from 'ethers';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Encryption key from environment
const ENCRYPTION_KEY = process.env.WALLET_ENCRYPTION_KEY || 'default-key-change-in-production';

/**
 * Encrypt a private key for storage
 */
export function encryptPrivateKey(privateKey: string): string {
    // In production, use proper encryption like AES-256
    // For now, using bcrypt hash (one-way, not ideal for this use case)
    // TODO: Replace with proper encryption/decryption
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(privateKey + ENCRYPTION_KEY, salt);
}

/**
 * Create a new Ethereum wallet
 */
export function createWallet(): { address: string; privateKey: string } {
    const wallet = ethers.Wallet.createRandom();
    return {
        address: wallet.address,
        privateKey: wallet.privateKey,
    };
}

/**
 * Get wallet for a user (creates if doesn't exist)
 */
export async function getUserWallet(userId: string): Promise<{ address: string; privateKey: string }> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error('User not found');
    }

    // For now, we'll store the private key in memory
    // In production, use proper key management (HSM, KMS, etc.)
    // This is a simplified version for the hybrid architecture

    return {
        address: user.walletAddress,
        privateKey: user.encryptedPrivateKey, // TODO: Decrypt this properly
    };
}

/**
 * Sign a transaction with user's wallet
 */
export async function signTransaction(
    userId: string,
    transaction: ethers.TransactionRequest
): Promise<string> {
    const { privateKey } = await getUserWallet(userId);

    // Get RPC provider
    const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545'
    );

    // Create wallet instance
    const wallet = new ethers.Wallet(privateKey, provider);

    // Sign and send transaction
    const tx = await wallet.sendTransaction(transaction);
    await tx.wait();

    return tx.hash;
}

/**
 * Read from blockchain (no wallet needed)
 */
export async function readFromBlockchain(
    contractAddress: string,
    abi: readonly any[],
    functionName: string,
    args: any[]
): Promise<any> {
    const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545'
    );

    const contract = new ethers.Contract(contractAddress, abi as any[], provider);
    return await contract[functionName](...args);
}

/**
 * Write to blockchain (requires user's wallet)
 */
export async function writeToBlockchain(
    userId: string,
    contractAddress: string,
    abi: readonly any[],
    functionName: string,
    args: any[]
): Promise<string> {
    const { privateKey } = await getUserWallet(userId);

    const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545'
    );

    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi as any[], wallet);

    const tx = await contract[functionName](...args);
    await tx.wait();

    return tx.hash;
}

export { prisma };
