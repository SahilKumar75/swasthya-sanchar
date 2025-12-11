'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    connectWallet,
    getCurrentAccount,
    onAccountsChanged,
    type WalletConnection,
    readContract as readContractHelper,
    writeContract as writeContractHelper
} from '@/lib/web3';
import { HEALTH_RECORDS_ABI, HEALTH_RECORDS_ADDRESS } from '@/lib/contracts';
import { isAddress } from 'viem';

interface AuthorizedDoctor {
    address: string;
    grantedAt: bigint;
}

export default function PermissionsPage() {
    const router = useRouter();
    const [connection, setConnection] = useState<WalletConnection | null>(null);
    const [address, setAddress] = useState<string>('');
    const [authorizedDoctors, setAuthorizedDoctors] = useState<AuthorizedDoctor[]>([]);
    const [newDoctorAddress, setNewDoctorAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Initialize wallet connection
    useEffect(() => {
        initWallet();

        // Listen for account changes
        onAccountsChanged((accounts) => {
            if (accounts.length === 0) {
                setConnection(null);
                setAddress('');
            } else {
                initWallet();
            }
        });
    }, []);

    // Fetch authorized doctors when connection changes
    useEffect(() => {
        if (connection && address) {
            fetchAuthorizedDoctors();
        }
    }, [connection, address]);

    const initWallet = async () => {
        const currentAccount = await getCurrentAccount();
        if (currentAccount) {
            const conn = await connectWallet();
            if (conn) {
                setConnection(conn);
                setAddress(conn.account);
            }
        }
    };

    const handleConnect = async () => {
        const conn = await connectWallet();
        if (conn) {
            setConnection(conn);
            setAddress(conn.account);
        }
    };

    const fetchAuthorizedDoctors = async () => {
        if (!connection || !address) return;

        try {
            const doctorsResult = await readContractHelper(
                connection,
                'getAuthorizedDoctors',
                [address as `0x${string}`]
            );

            const doctors = doctorsResult as unknown as `0x${string}`[];

            // Fetch grant timestamps for each doctor
            const doctorsWithTimestamps = await Promise.all(
                doctors.map(async (doctorAddr) => {
                    const timestamp = await readContractHelper(
                        connection,
                        'accessGrantedAt',
                        [address as `0x${string}`, doctorAddr]
                    ) as bigint;

                    return {
                        address: doctorAddr,
                        grantedAt: timestamp,
                    };
                })
            );

            setAuthorizedDoctors(doctorsWithTimestamps);
        } catch (err) {
            console.error('Error fetching authorized doctors:', err);
            setError('Failed to load authorized doctors');
        }
    };

    const handleGrantAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate address
        if (!isAddress(newDoctorAddress)) {
            setError('Invalid Ethereum address');
            return;
        }

        if (!connection) {
            setError('Please connect your wallet');
            return;
        }

        setLoading(true);

        try {
            // Call grantDoctorAccess on smart contract
            await writeContractHelper(
                connection,
                'grantDoctorAccess',
                [newDoctorAddress as `0x${string}`]
            );

            setSuccess(`Access granted to ${newDoctorAddress}`);
            setNewDoctorAddress('');

            // Refresh the list
            await fetchAuthorizedDoctors();
        } catch (err: any) {
            console.error('Error granting access:', err);
            if (err.message?.includes('Doctor already authorized')) {
                setError('This doctor is already authorized');
            } else if (err.message?.includes('User rejected') || err.message?.includes('User denied')) {
                setError('Transaction rejected');
            } else {
                setError('Failed to grant access. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRevokeAccess = async (doctorAddress: string) => {
        if (!connection) return;

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await writeContractHelper(
                connection,
                'revokeDoctorAccess',
                [doctorAddress as `0x${string}`]
            );

            setSuccess(`Access revoked from ${doctorAddress}`);

            // Refresh the list
            await fetchAuthorizedDoctors();
        } catch (err: any) {
            console.error('Error revoking access:', err);
            setError('Failed to revoke access. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!connection) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
                    <p className="text-gray-400 mb-6">Please connect your wallet to manage doctor permissions</p>
                    <button
                        onClick={handleConnect}
                        className="bg-white text-black px-6 py-3 rounded font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Connect Wallet
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/patient-home')}
                        className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold mb-2">Manage Doctor Access</h1>
                    <p className="text-gray-400">
                        Control which doctors can view your medical records
                    </p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-6">
                        {success}
                    </div>
                )}

                {/* Grant Access Form */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Grant Access to Doctor</h2>
                    <form onSubmit={handleGrantAccess} className="space-y-4">
                        <div>
                            <label htmlFor="doctorAddress" className="block text-sm font-medium text-gray-300 mb-2">
                                Doctor Wallet Address
                            </label>
                            <input
                                type="text"
                                id="doctorAddress"
                                value={newDoctorAddress}
                                onChange={(e) => setNewDoctorAddress(e.target.value)}
                                placeholder="0x..."
                                className="w-full bg-black border border-zinc-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-zinc-500"
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !newDoctorAddress}
                            className="w-full bg-white text-black font-semibold py-3 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Processing...' : 'Grant Access'}
                        </button>
                    </form>
                </div>

                {/* Authorized Doctors List */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Authorized Doctors</h2>

                    {authorizedDoctors.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <p>No doctors authorized yet</p>
                            <p className="text-sm mt-2">Grant access to a doctor using the form above</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {authorizedDoctors.map((doctor) => (
                                <div
                                    key={doctor.address}
                                    className="flex items-center justify-between bg-black border border-zinc-800 rounded p-4"
                                >
                                    <div className="flex-1">
                                        <p className="font-mono text-sm">{doctor.address}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Granted: {new Date(Number(doctor.grantedAt) * 1000).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRevokeAccess(doctor.address)}
                                        disabled={loading}
                                        className="ml-4 bg-red-500/10 text-red-500 border border-red-500 px-4 py-2 rounded hover:bg-red-500/20 disabled:opacity-50 transition-colors"
                                    >
                                        Revoke
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-500/10 border border-blue-500 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-400 mb-2">ℹ️ How it works</h3>
                    <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Only authorized doctors can view your medical records</li>
                        <li>• You can revoke access at any time</li>
                        <li>• All access changes are recorded on the blockchain</li>
                        <li>• Doctors need your explicit permission to create new records</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
