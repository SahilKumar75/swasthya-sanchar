"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Users, Clock, CheckCircle, XCircle, Upload, Search, Filter } from "lucide-react";
import Link from "next/link";

interface PatientPermission {
    id: string;
    patientId: string;
    patientName: string;
    patientEmail: string;
    status: "granted" | "revoked";
    grantedAt: string;
    revokedAt?: string;
    lastActivity: string;
}

export default function DoctorPatientsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState<PatientPermission[]>([]);
    const [filter, setFilter] = useState<"all" | "granted" | "revoked">("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function checkAuth() {
            if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') {
                setLoading(false);
                loadMockData();
                return;
            }

            if (status === "loading") return;

            if (status === "unauthenticated" || !session?.user) {
                router.push("/auth/login");
                return;
            }

            if (session.user.role !== "doctor") {
                router.push(session.user.role === "patient" ? "/patient-portal" : "/");
                return;
            }

            setLoading(false);
            await loadPatients();
        }

        checkAuth();
    }, [session, status, router]);

    async function loadMockData() {
        const mockPatients: PatientPermission[] = [
            {
                id: "1",
                patientId: "p1",
                patientName: "John Smith",
                patientEmail: "john@example.com",
                status: "granted",
                grantedAt: "2024-01-15T10:30:00Z",
                lastActivity: "2024-01-15T10:30:00Z"
            },
            {
                id: "2",
                patientId: "p2",
                patientName: "Sarah Johnson",
                patientEmail: "sarah@example.com",
                status: "granted",
                grantedAt: "2024-01-14T14:20:00Z",
                lastActivity: "2024-01-14T14:20:00Z"
            },
            {
                id: "3",
                patientId: "p3",
                patientName: "Mike Davis",
                patientEmail: "mike@example.com",
                status: "revoked",
                grantedAt: "2024-01-10T09:15:00Z",
                revokedAt: "2024-01-13T16:45:00Z",
                lastActivity: "2024-01-13T16:45:00Z"
            }
        ];
        setPatients(mockPatients);
    }

    async function loadPatients() {
        try {
            const response = await fetch("/api/doctor/patients");
            const data = await response.json();
            setPatients(data.patients || []);
        } catch (error) {
            console.error("Error loading patients:", error);
        }
    }

    const filteredPatients = patients
        .filter(p => filter === "all" || p.status === filter)
        .filter(p =>
            p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.patientEmail.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-neutral-400">Loading patients...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
            <Navbar />

            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                                My Patients
                            </h1>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Manage patients who have granted you access to their medical records
                        </p>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                                />
                            </div>

                            {/* Filter */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilter("all")}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${filter === "all"
                                            ? "bg-blue-600 text-white"
                                            : "bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                                        }`}
                                >
                                    All ({patients.length})
                                </button>
                                <button
                                    onClick={() => setFilter("granted")}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${filter === "granted"
                                            ? "bg-green-600 text-white"
                                            : "bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                                        }`}
                                >
                                    Active ({patients.filter(p => p.status === "granted").length})
                                </button>
                                <button
                                    onClick={() => setFilter("revoked")}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${filter === "revoked"
                                            ? "bg-red-600 text-white"
                                            : "bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                                        }`}
                                >
                                    Revoked ({patients.filter(p => p.status === "revoked").length})
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Patients List */}
                    <div className="space-y-4">
                        {filteredPatients.length === 0 ? (
                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-12 text-center">
                                <Users className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                                    No patients found
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    {searchQuery ? "Try adjusting your search" : "Patients who grant you access will appear here"}
                                </p>
                            </div>
                        ) : (
                            filteredPatients.map((patient) => (
                                <div
                                    key={patient.id}
                                    className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                                                    {patient.patientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                                                        {patient.patientName}
                                                    </h3>
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                        {patient.patientEmail}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Timeline */}
                                            <div className="ml-15 mt-4 space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                    <span className="text-neutral-700 dark:text-neutral-300">
                                                        Access granted on {new Date(patient.grantedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {patient.revokedAt && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                        <span className="text-neutral-700 dark:text-neutral-300">
                                                            Access revoked on {new Date(patient.revokedAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status and Actions */}
                                        <div className="flex flex-col items-end gap-3">
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${patient.status === "granted"
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                                                }`}>
                                                {patient.status === "granted" ? "Active Access" : "Access Revoked"}
                                            </div>

                                            {patient.status === "granted" && (
                                                <Link
                                                    href={`/doctor-portal/upload?patient=${patient.patientId}`}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    Upload Record
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
