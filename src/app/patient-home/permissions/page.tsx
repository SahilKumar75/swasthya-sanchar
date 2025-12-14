'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import { ArrowLeft, Shield, Trash2, Plus, Loader2 } from 'lucide-react';

interface AuthorizedDoctor {
    id: string;
    doctorEmail: string;
    doctorName?: string;
    grantedAt: string;
}

export default function PermissionsPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [authorizedDoctors, setAuthorizedDoctors] = useState<AuthorizedDoctor[]>([]);
    const [newDoctorEmail, setNewDoctorEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        async function checkAuth() {
            // Development bypass
            if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') {
                console.log('[DEV BYPASS] 🔓 Permissions page - auth bypass enabled');
                setLoading(false);
                loadMockDoctors();
                return;
            }

            if (status === "loading") return;

            if (status === "unauthenticated" || !session?.user) {
                router.push("/auth/login");
                return;
            }

            if (session.user.role !== "patient") {
                router.push("/");
                return;
            }

            setLoading(false);
            await fetchAuthorizedDoctors();
        }

        checkAuth();
    }, [session, status, router]);

    const loadMockDoctors = () => {
        const mockDoctors: AuthorizedDoctor[] = [
            {
                id: '1',
                doctorEmail: 'dr.smith@hospital.com',
                doctorName: 'Dr. John Smith',
                grantedAt: new Date().toISOString()
            },
            {
                id: '2',
                doctorEmail: 'dr.johnson@clinic.com',
                doctorName: 'Dr. Sarah Johnson',
                grantedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];
        setAuthorizedDoctors(mockDoctors);
    };

    const fetchAuthorizedDoctors = async () => {
        try {
            const response = await fetch('/api/patient/authorized-doctors');
            if (response.ok) {
                const data = await response.json();
                setAuthorizedDoctors(data.doctors || []);
            }
        } catch (err) {
            console.error('Error fetching authorized doctors:', err);
            setError('Failed to load authorized doctors');
        }
    };

    const handleGrantAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!newDoctorEmail || !newDoctorEmail.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setSubmitting(true);

        try {
            // Dev bypass
            if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const newDoctor: AuthorizedDoctor = {
                    id: Date.now().toString(),
                    doctorEmail: newDoctorEmail,
                    grantedAt: new Date().toISOString()
                };
                setAuthorizedDoctors([...authorizedDoctors, newDoctor]);
                setSuccess(`Access granted to ${newDoctorEmail}`);
                setNewDoctorEmail('');
                setSubmitting(false);
                return;
            }

            const response = await fetch('/api/patient/grant-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ doctorEmail: newDoctorEmail })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(`Access granted to ${newDoctorEmail}`);
                setNewDoctorEmail('');
                await fetchAuthorizedDoctors();
            } else {
                setError(data.error || 'Failed to grant access');
            }
        } catch (err) {
            console.error('Error granting access:', err);
            setError('Failed to grant access. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRevokeAccess = async (doctorId: string, doctorEmail: string) => {
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            // Dev bypass
            if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setAuthorizedDoctors(authorizedDoctors.filter(d => d.id !== doctorId));
                setSuccess(`Access revoked from ${doctorEmail}`);
                setSubmitting(false);
                return;
            }

            const response = await fetch('/api/patient/revoke-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ doctorId })
            });

            if (response.ok) {
                setSuccess(`Access revoked from ${doctorEmail}`);
                await fetchAuthorizedDoctors();
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to revoke access');
            }
        } catch (err) {
            console.error('Error revoking access:', err);
            setError('Failed to revoke access. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-600 dark:text-neutral-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12 pt-24">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                        Manage Doctor Access
                    </h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">
                        Control which doctors can view your medical records
                    </p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-6">
                        {success}
                    </div>
                )}

                {/* Grant Access Form */}
                <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                        Grant Access to Doctor
                    </h2>
                    <form onSubmit={handleGrantAccess} className="space-y-4">
                        <div>
                            <label htmlFor="doctorEmail" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Doctor Email Address
                            </label>
                            <input
                                type="email"
                                id="doctorEmail"
                                value={newDoctorEmail}
                                onChange={(e) => setNewDoctorEmail(e.target.value)}
                                placeholder="doctor@hospital.com"
                                className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 py-2 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={submitting}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting || !newDoctorEmail}
                            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    Grant Access
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Authorized Doctors List */}
                <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                        Authorized Doctors
                    </h2>

                    {authorizedDoctors.length === 0 ? (
                        <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
                            <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="font-medium">No doctors authorized yet</p>
                            <p className="text-sm mt-2">Grant access to a doctor using the form above</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {authorizedDoctors.map((doctor) => (
                                <div
                                    key={doctor.id}
                                    className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                            {doctor.doctorName || doctor.doctorEmail}
                                        </p>
                                        {doctor.doctorName && (
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                {doctor.doctorEmail}
                                            </p>
                                        )}
                                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                                            Granted: {new Date(doctor.grantedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRevokeAccess(doctor.id, doctor.doctorEmail)}
                                        disabled={submitting}
                                        className="ml-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Revoke
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
