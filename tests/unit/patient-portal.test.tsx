import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PatientPortal from "@/app/patient-portal/page";

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

describe('Patient Portal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the patient portal title', () => {
    render(<PatientPortal />);
    expect(screen.getByText('Patient Portal')).toBeInTheDocument();
  });

  it('should render Swasthya Sanchar header', () => {
    render(<PatientPortal />);
    expect(screen.getByText('Swasthya Sanchar')).toBeInTheDocument();
  });

  it('should show connect wallet button when not connected', async () => {
    const { getCurrentAccount } = await import('@/lib/web3');
    vi.mocked(getCurrentAccount).mockResolvedValue(null);

    render(<PatientPortal />);

    await waitFor(() => {
      expect(screen.getAllByText('Connect Wallet')[0]).toBeInTheDocument();
    });
  });

  it('should display placeholder message about future features', () => {
    render(<PatientPortal />);
    expect(
      screen.getByText(/Patient registration and record management features will be added/i)
    ).toBeInTheDocument();
  });

  it('should show feature preview cards', () => {
    render(<PatientPortal />);
    expect(screen.getByText('📝 Registration')).toBeInTheDocument();
    expect(screen.getByText('🏥 Records')).toBeInTheDocument();
    expect(screen.getByText('🔐 Access')).toBeInTheDocument();
  });

  it('should call connectWallet when connect button is clicked', async () => {
    const { connectWallet, getCurrentAccount } = await import('@/lib/web3');
    vi.mocked(getCurrentAccount).mockResolvedValue(null);
    vi.mocked(connectWallet).mockResolvedValue({
      account: '0x1234567890123456789012345678901234567890' as `0x${string}`,
      publicClient: {} as any,
      walletClient: {} as any,
    });

    render(<PatientPortal />);

    await waitFor(() => {
      const buttons = screen.getAllByRole('button', { name: /Connect Wallet/i });
      fireEvent.click(buttons[0]);
    });

    await waitFor(() => {
      expect(connectWallet).toHaveBeenCalled();
    });
  });

  it('should have link back to home in header', () => {
    render(<PatientPortal />);
    const homeLink = screen.getByText('Swasthya Sanchar').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
