"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft, Users, Shield, Clock, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DoctorAccess {
    id: string;
    doctorId: string;
    doctorName: string;
    grantedAt: string;
    expiresAt?: string;
    isActive: boolean;
}

export default function DoctorPermissions() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [permissions, setPermissions] = useState<DoctorAccess[]>([]);
    const { t } = useLanguage();

    useEffect(() => {
        async function checkAuth() {
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
            // TODO: Load doctor permissions from API
            // await loadPermissions();
        }

        checkAuth();
    }, [session, status, router]);

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
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                        Doctor Access Permissions
                    </h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">
                        Manage which doctors can access your medical records
                    </p>
                </div>

                {/* Coming Soon Message */}
                <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-12 text-center">
                    <Shield className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                        Coming Soon
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                        Doctor access management feature is currently under development.
                    </p>
                    <Link
                        href="/patient-portal/home"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                </div>
            </main>
        </div>
    );
}
