// Backend Wallet Management Service
// Handles wallet creation, encryption, and blockchain transactions

import { ethers } from 'ethers';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

export const prisma = new PrismaClient();

// Encryption settings
const ENCRYPTION_KEY = process.env.WALLET_ENCRYPTION_KEY || 'default-encryption-key-change-in-production';
const ALGORITHM = 'aes-256-cbc';

/**
 * Encrypt private key using AES-256-CBC
 */
export function encryptPrivateKey(privateKey: string): string {
    const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt private key using AES-256-CBC
 */
export function decryptPrivateKey(encryptedKey: string): string {
    const parts = encryptedKey.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
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

    if (!user.encryptedPrivateKey) {
        throw new Error('User wallet not found');
    }

    // Decrypt the private key
    const privateKey = decryptPrivateKey(user.encryptedPrivateKey);

    return {
        address: user.walletAddress,
        privateKey,
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
