import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.ethereum for MetaMask tests
global.window = global.window || {};
(global.window as any).ethereum = {
  request: vi.fn(),
  on: vi.fn(),
};
