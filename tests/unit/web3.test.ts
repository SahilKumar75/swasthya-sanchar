import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  isMetaMaskInstalled,
  formatAddress,
  connectWallet,
  getCurrentAccount,
} from '@/lib/web3';

describe('Web3 Utilities', () => {
  describe('isMetaMaskInstalled', () => {
    it('should return true when ethereum is available', () => {
      (global.window as any).ethereum = {};
      expect(isMetaMaskInstalled()).toBe(true);
    });

    it('should return false when ethereum is not available', () => {
      (global.window as any).ethereum = undefined;
      expect(isMetaMaskInstalled()).toBe(false);
    });

    it('should return false in server-side environment', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      expect(isMetaMaskInstalled()).toBe(false);
      global.window = originalWindow;
    });
  });

  describe('formatAddress', () => {
    it('should format valid Ethereum address correctly', () => {
      const address = '0x1234567890123456789012345678901234567890';
      const formatted = formatAddress(address);
      expect(formatted).toBe('0x1234...7890');
    });

    it('should handle short addresses', () => {
      const address = '0x12345';
      const formatted = formatAddress(address);
      expect(formatted).toBe('0x1234...345');
    });

    it('should return empty string for empty address', () => {
      expect(formatAddress('')).toBe('');
    });

    it('should return empty string for null/undefined', () => {
      expect(formatAddress(null as any)).toBe('');
      expect(formatAddress(undefined as any)).toBe('');
    });
  });

  describe('connectWallet', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      (global.window as any).ethereum = {
        request: vi.fn(),
        on: vi.fn(),
      };
    });

    it('should return null if MetaMask is not installed', async () => {
      (global.window as any).ethereum = undefined;
      const result = await connectWallet();
      expect(result).toBeNull();
    });

    it('should request accounts from MetaMask', async () => {
      const mockAccounts = ['0x1234567890123456789012345678901234567890'];
      (global.window as any).ethereum.request.mockResolvedValue(mockAccounts);

      await connectWallet();

      expect((global.window as any).ethereum.request).toHaveBeenCalledWith({
        method: 'eth_requestAccounts',
      });
    });

    it('should return WalletConnection with account when successful', async () => {
      const mockAccount = '0x1234567890123456789012345678901234567890';
      (global.window as any).ethereum.request.mockResolvedValue([mockAccount]);

      const result = await connectWallet();

      expect(result).not.toBeNull();
      expect(result?.account).toBe(mockAccount);
      expect(result?.publicClient).toBeDefined();
      expect(result?.walletClient).toBeDefined();
    });

    it('should handle error when no accounts returned', async () => {
      (global.window as any).ethereum.request.mockResolvedValue([]);

      const result = await connectWallet();

      expect(result).toBeNull();
    });

    it('should handle request rejection', async () => {
      (global.window as any).ethereum.request.mockRejectedValue(
        new Error('User rejected request')
      );

      const result = await connectWallet();

      expect(result).toBeNull();
    });
  });

  describe('getCurrentAccount', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      (global.window as any).ethereum = {
        request: vi.fn(),
        on: vi.fn(),
      };
    });

    it('should return null if MetaMask is not installed', async () => {
      (global.window as any).ethereum = undefined;
      const result = await getCurrentAccount();
      expect(result).toBeNull();
    });

    it('should call eth_accounts method', async () => {
      const mockAccounts = ['0x1234567890123456789012345678901234567890'];
      (global.window as any).ethereum.request.mockResolvedValue(mockAccounts);

      await getCurrentAccount();

      expect((global.window as any).ethereum.request).toHaveBeenCalledWith({
        method: 'eth_accounts',
      });
    });

    it('should return first account when available', async () => {
      const mockAccount = '0x1234567890123456789012345678901234567890';
      (global.window as any).ethereum.request.mockResolvedValue([mockAccount]);

      const result = await getCurrentAccount();

      expect(result).toBe(mockAccount);
    });

    it('should return null when no accounts available', async () => {
      (global.window as any).ethereum.request.mockResolvedValue([]);

      const result = await getCurrentAccount();

      expect(result).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      (global.window as any).ethereum.request.mockRejectedValue(
        new Error('Network error')
      );

      const result = await getCurrentAccount();

      expect(result).toBeNull();
    });
  });
});
