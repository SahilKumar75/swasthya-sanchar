"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import RecordViewer from "@/components/record-viewer";
import {
    ArrowLeft, FileText, Calendar, User, Eye, X, Loader2
} from "lucide-react";

interface MedicalRecord {
    id: string;
    patientId: string;
    doctorId: string;
    recordHash: string;
    timestamp: string;
    isActive: boolean;
    doctorName?: string;
}

export default function PatientRecords() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
    const [loadingRecords, setLoadingRecords] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            // Development bypass - skip auth checks if enabled
            if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') {
                console.log('[DEV BYPASS] 🔓 Patient records - auth bypass enabled');
                setLoading(false);
                await loadMockRecords();
                return;
            }

            if (status === "loading") return;

            if (status === "unauthenticated" || !session?.user) {
                router.push("/auth/login");
                return;
            }

            if (session.user.role !== "patient") {
                router.push(session.user.role === "doctor" ? "/doctor/home" : "/patient-home");
                return;
            }

            setLoading(false);
            await loadRecords();
        }

        checkAuth();
    }, [session, status, router]);

    async function loadMockRecords() {
        setLoadingRecords(true);
        // Mock data for development
        const mockRecords: MedicalRecord[] = [
            {
                id: "1",
                patientId: "mock-patient",
                doctorId: "mock-doctor",
                recordHash: "QmXxxx1234567890abcdef",
                timestamp: new Date().toISOString(),
                isActive: true,
                doctorName: "Dr. Smith"
            },
            {
                id: "2",
                patientId: "mock-patient",
                doctorId: "mock-doctor-2",
                recordHash: "QmYyyy0987654321fedcba",
                timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                isActive: true,
                doctorName: "Dr. Johnson"
            }
        ];
        setRecords(mockRecords);
        setLoadingRecords(false);
    }

    async function loadRecords() {
        try {
            setLoadingRecords(true);
            const response = await fetch("/api/records");
            if (response.ok) {
                const data = await response.json();
                setRecords(data.records || []);
            }
        } catch (error) {
            console.error("Error loading records:", error);
        } finally {
            setLoadingRecords(false);
        }
    }

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-neutral-100 mx-auto mb-4"></div>
                    <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 pt-24">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/patient-portal/home"
                        className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-4 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                        My Medical Records
                    </h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">
                        View and download your medical documents
                    </p>
                </div>

                {/* Records List */}
                {loadingRecords ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-neutral-600 dark:text-neutral-400" />
                    </div>
                ) : records.length === 0 ? (
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-12 text-center">
                        <FileText className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                            No Medical Records Yet
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            Your medical records will appear here once a doctor uploads them.
                        </p>
                        <Link
                            href="/patient-portal/home"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {records.map((record) => (
                            <div
                                key={record.id}
                                className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">
                                        Active
                                    </span>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Record ID</p>
                                        <p className="text-sm font-mono text-neutral-900 dark:text-neutral-100">
                                            #{record.id}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Upload Date
                                        </p>
                                        <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                            {formatDate(record.timestamp)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            Doctor
                                        </p>
                                        <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                            {record.doctorName || 'Unknown'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">IPFS Hash</p>
                                        <p className="text-xs font-mono text-neutral-700 dark:text-neutral-300">
                                            {record.recordHash?.slice(0, 20) || 'N/A'}...
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedRecord(record)}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    View Record
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Record Viewer Modal */}
            {selectedRecord && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Medical Record</h3>
                            <button
                                onClick={() => setSelectedRecord(null)}
                                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(90vh-60px)] p-6">
                            <RecordViewer
                                recordHash={selectedRecord.recordHash}
                                metadata={{
                                    doctor: selectedRecord.doctorName,
                                    timestamp: BigInt(Math.floor(new Date(selectedRecord.timestamp).getTime() / 1000)),
                                    notes: `Record ID: ${selectedRecord.id}`
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
