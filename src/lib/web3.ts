"use client";

import { createPublicClient, createWalletClient, custom, http, type PublicClient, type WalletClient } from "viem";
import { localhost } from "viem/chains";
import { HEALTH_RECORDS_ABI, HEALTH_RECORDS_ADDRESS } from "./contracts";

// Types
export interface WalletConnection {
  account: `0x${string}`;
  publicClient: PublicClient;
  walletClient: WalletClient;
}

// Check if MetaMask is installed
export function isMetaMaskInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return typeof (window as any).ethereum !== "undefined";
}

// Connect to MetaMask and get the current account
export async function connectWallet(): Promise<WalletConnection | null> {
  if (!isMetaMaskInstalled()) {
    alert("Please install MetaMask to use this application");
    return null;
  }

  try {
    // Request to switch to localhost network
    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x7a69" }], // 31337 in hex
      });
    } catch (switchError: any) {
      // If the chain hasn't been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x7a69",
                chainName: "Localhost 8545",
                rpcUrls: ["http://127.0.0.1:8545"],
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add network:", addError);
          alert("Please manually add Hardhat Local network (Chain ID: 31337, RPC: http://127.0.0.1:8545) to MetaMask");
          return null;
        }
      } else if (switchError.code === 4001) {
        // User rejected the request
        alert("Please switch to Hardhat Local network in MetaMask to continue");
        return null;
      } else {
        console.error("Failed to switch network:", switchError);
        alert("Failed to switch network. Please manually select Hardhat Local (Chain ID: 31337) in MetaMask");
        return null;
      }
    }

    // Request account access
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found");
    }

    const account = accounts[0] as `0x${string}`;

    // Create public client for reading blockchain data
    const publicClient = createPublicClient({
      chain: localhost,
      transport: http(),
    });

    // Create wallet client for signing transactions
    const walletClient = createWalletClient({
      account,
      chain: localhost,
      transport: custom((window as any).ethereum),
    });

    return {
      account,
      publicClient,
      walletClient,
    };
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    return null;
  }
}

// Get the current connected account without requesting connection
export async function getCurrentAccount(): Promise<`0x${string}` | null> {
  if (!isMetaMaskInstalled()) return null;

  try {
    const accounts = await (window as any).ethereum.request({
      method: "eth_accounts",
    });
    
    return accounts && accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error("Failed to get current account:", error);
    return null;
  }
}

// Listen for account changes
export function onAccountsChanged(callback: (accounts: string[]) => void) {
  if (!isMetaMaskInstalled()) return;

  (window as any).ethereum.on("accountsChanged", callback);
}

// Contract interaction helpers
export async function readContract(
  connection: WalletConnection,
  functionName: string,
  args?: readonly unknown[]
) {
  return connection.publicClient.readContract({
    address: HEALTH_RECORDS_ADDRESS,
    abi: HEALTH_RECORDS_ABI,
    functionName: functionName as any,
    args: args as any,
  });
}

export async function writeContract(
  connection: WalletConnection,
  functionName: string,
  args?: readonly unknown[]
) {
  // Simulate the contract call first to check for errors
  await connection.publicClient.simulateContract({
    address: HEALTH_RECORDS_ADDRESS,
    abi: HEALTH_RECORDS_ABI,
    functionName: functionName as any,
    args: args as any,
    account: connection.account,
  });

  // Write to the contract
  const hash = await connection.walletClient.writeContract({
    address: HEALTH_RECORDS_ADDRESS,
    abi: HEALTH_RECORDS_ABI,
    functionName: functionName as any,
    args: args as any,
    chain: localhost,
    account: connection.account,
  });

  // Wait for transaction confirmation
  const receipt = await connection.publicClient.waitForTransactionReceipt({
    hash,
  });

  return receipt;
}

// Format address for display
export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
