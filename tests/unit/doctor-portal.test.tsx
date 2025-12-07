import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DoctorPortal from '@/app/doctor/page';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// Mock web3 functions
vi.mock('@/lib/web3', () => ({
  connectWallet: vi.fn(),
  getCurrentAccount: vi.fn(),
  formatAddress: vi.fn((addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`),
  onAccountsChanged: vi.fn(),
}));

describe('Doctor Portal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the doctor portal title', () => {
    render(<DoctorPortal />);
    expect(screen.getByText('Doctor Portal')).toBeInTheDocument();
  });

  it('should render Swasthya Sanchar header', () => {
    render(<DoctorPortal />);
    expect(screen.getByText('Swasthya Sanchar')).toBeInTheDocument();
  });

  it('should show connect wallet button when not connected', async () => {
    const { getCurrentAccount } = await import('@/lib/web3');
    vi.mocked(getCurrentAccount).mockResolvedValue(null);

    render(<DoctorPortal />);

    await waitFor(() => {
      expect(screen.getAllByText('Connect Wallet')[0]).toBeInTheDocument();
    });
  });

  it('should display placeholder message about future features', () => {
    render(<DoctorPortal />);
    expect(
      screen.getByText(/Doctor authorization and patient record management features will be added/i)
    ).toBeInTheDocument();
  });

  it('should show feature preview cards', () => {
    render(<DoctorPortal />);
    expect(screen.getByText('👨‍⚕️ Authorization')).toBeInTheDocument();
    expect(screen.getByText('📋 Create Records')).toBeInTheDocument();
    expect(screen.getByText('👥 Patients')).toBeInTheDocument();
  });

  it('should call connectWallet when connect button is clicked', async () => {
    const { connectWallet, getCurrentAccount } = await import('@/lib/web3');
    vi.mocked(getCurrentAccount).mockResolvedValue(null);
    vi.mocked(connectWallet).mockResolvedValue({
      account: '0x1234567890123456789012345678901234567890' as `0x${string}`,
      publicClient: {} as any,
      walletClient: {} as any,
    });

    render(<DoctorPortal />);

    await waitFor(() => {
      const buttons = screen.getAllByRole('button', { name: /Connect Wallet/i });
      fireEvent.click(buttons[0]);
    });

    await waitFor(() => {
      expect(connectWallet).toHaveBeenCalled();
    });
  });

  it('should have link back to home in header', () => {
    render(<DoctorPortal />);
    const homeLink = screen.getByText('Swasthya Sanchar').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
