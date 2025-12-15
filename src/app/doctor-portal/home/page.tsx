"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { FooterSection } from "@/components/ui/footer-section";
import {
    Users, Loader2, CheckCircle, TrendingUp
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DoctorStats {
    totalPatients: number;
    activePermissions: number;
}

interface DiseaseData {
    name: string;
    count: number;
    percentage: number;
    color: string;
}

interface MedicationData {
    name: string;
    prescriptions: number;
    color: string;
}

export default function DoctorHome() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DoctorStats | null>(null);
    const [diseases, setDiseases] = useState<DiseaseData[]>([]);
    const [medications, setMedications] = useState<MedicationData[]>([]);
    const { t } = useLanguage();

    useEffect(() => {
        async function checkAuth() {


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
            await loadDoctorData();
        }

        checkAuth();
    }, [session, status, router]);



    async function loadDoctorData() {
        try {
            const response = await fetch("/api/doctor/dashboard");
            const data = await response.json();
            setStats(data.stats || null);
            setDiseases(data.diseases || []);
            setMedications(data.medications || []);
        } catch (error) {
            console.error("Error loading doctor data:", error);
        }
    }

    // Calculate pie chart path for SVG
    const createPieSlice = (percentage: number, startAngle: number) => {
        const angle = (percentage / 100) * 360;
        const endAngle = startAngle + angle;

        const startRad = (startAngle - 90) * (Math.PI / 180);
        const endRad = (endAngle - 90) * (Math.PI / 180);

        const x1 = 50 + 40 * Math.cos(startRad);
        const y1 = 50 + 40 * Math.sin(startRad);
        const x2 = 50 + 40 * Math.cos(endRad);
        const y2 = 50 + 40 * Math.sin(endRad);

        const largeArc = angle > 180 ? 1 : 0;

        return `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!session && process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH !== 'true') {
        return null;
    }

    const totalMedications = medications.reduce((sum, med) => sum + med.prescriptions, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                        {t.portal.doctorHome.welcome}, Dr. {session?.user?.email?.split('@')[0] || 'Developer'}!
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                        {session?.user?.email || 'dev@example.com'}
                    </p>
                </div>

                {/* Stats with Line Dividers */}
                <div className="flex items-start gap-8 mb-12">
                    {/* Total Patients */}
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-3 mb-2">
                            <span className="text-5xl font-bold text-neutral-900 dark:text-neutral-50">
                                {stats?.totalPatients || 0}
                            </span>
                            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{t.portal.doctorHome.totalPatients}</h3>
                    </div>

                    {/* Separator */}
                    <span className="text-3xl text-neutral-300 dark:text-neutral-600 mt-2">|</span>

                    {/* Active Permissions */}
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-3 mb-2">
                            <span className="text-5xl font-bold text-green-600 dark:text-green-400">
                                {stats?.activePermissions || 0}
                            </span>
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{t.portal.doctorHome.activePermissions}</h3>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Diagnosed Diseases Pie Chart */}
                    <div>
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-6">
                            {t.portal.doctorHome.patientsDiagnosed}
                        </h3>

                        <div className="flex items-center gap-8">
                            {/* Pie Chart */}
                            <div className="relative w-48 h-48 flex-shrink-0">
                                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                    {diseases.map((disease, index) => {
                                        const startAngle = diseases
                                            .slice(0, index)
                                            .reduce((sum, d) => sum + (d.percentage / 100) * 360, 0);
                                        return (
                                            <path
                                                key={disease.name}
                                                d={createPieSlice(disease.percentage, startAngle)}
                                                fill={disease.color}
                                                className="hover:opacity-80 transition-opacity cursor-pointer"
                                            />
                                        );
                                    })}
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                                            {stats?.totalPatients || 0}
                                        </p>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400">{t.portal.doctorHome.patients}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex-1 space-y-3">
                                {diseases.map((disease) => (
                                    <div key={disease.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: disease.color }}
                                            />
                                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                                {disease.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                                                {disease.count}
                                            </span>
                                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                                ({disease.percentage.toFixed(1)}%)
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Most Prescribed Medications */}
                    <div>
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-6">
                            {t.portal.doctorHome.mostPrescribed}
                        </h3>

                        <div className="space-y-4">
                            {medications.map((medication, index) => {
                                const percentage = (medication.prescriptions / totalMedications) * 100;
                                return (
                                    <div key={medication.name}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                                                {medication.name}
                                            </span>
                                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                                {medication.prescriptions} {t.portal.doctorHome.prescriptions}
                                            </span>
                                        </div>
                                        <div className="relative h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                                            <div
                                                className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: medication.color
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Total */}
                        <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    {t.portal.doctorHome.totalPrescriptions}
                                </span>
                                <span className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                                    {totalMedications}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <FooterSection />
        </div>
    );
}
