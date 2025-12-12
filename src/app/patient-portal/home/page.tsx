"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { FooterSection } from "@/components/ui/footer-section";
import {
    FileText, Shield, QrCode, Loader2, CheckCircle,
    Heart, Activity, Droplet, Calendar, AlertCircle,
    TrendingUp, ArrowUpRight, Scale, Pill
} from "lucide-react";

interface PatientProfile {
    dateOfBirth?: string;
    bloodGroup?: string;
    allergies?: string;
    chronicConditions?: string;
    currentMedications?: string;
    emergencyName?: string;
    emergencyPhone?: string;
    isRegisteredOnChain?: boolean;
    walletAddress?: string;
}

export default function PatientHome() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<PatientProfile | null>(null);
    const [qrCode, setQrCode] = useState<string>("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/patient/status");
                const data = await res.json();
                setProfile(data);

                // Generate QR code if registered
                if (data.isRegisteredOnChain && data.walletAddress) {
                    const QRCode = (await import("qrcode")).default;
                    const emergencyUrl = `${window.location.origin}/emergency/${data.walletAddress}`;
                    const qr = await QRCode.toDataURL(emergencyUrl, { width: 200, margin: 2 });
                    setQrCode(qr);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchProfile();
        }
    }, [session]);

    const calculateAge = (dob?: string) => {
        if (!dob) return "N/A";
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const getBloodGroupRarity = (bloodGroup?: string) => {
        const rarityMap: Record<string, { rarity: string; percentage: number }> = {
            "O+": { rarity: "Common", percentage: 37.4 },
            "A+": { rarity: "Common", percentage: 35.7 },
            "B+": { rarity: "Uncommon", percentage: 8.5 },
            "AB+": { rarity: "Rare", percentage: 3.4 },
            "O-": { rarity: "Very Rare", percentage: 6.6 },
            "A-": { rarity: "Rare", percentage: 6.3 },
            "B-": { rarity: "Rare", percentage: 1.5 },
            "AB-": { rarity: "Extremely Rare", percentage: 0.6 }
        };
        return rarityMap[bloodGroup || ""] || { rarity: "Unknown", percentage: 0 };
    };

    const getMedicationCount = () => {
        if (!profile?.currentMedications) return 0;
        return profile.currentMedications.split(',').filter(m => m.trim()).length;
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const isRegistered = profile?.isRegisteredOnChain || false;
    const bloodInfo = getBloodGroupRarity(profile?.bloodGroup);
    const medicationCount = getMedicationCount();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                        Welcome back, {session.user?.email?.split('@')[0]}!
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                        Your health dashboard
                    </p>
                </div>

                {/* Registration Status Banner */}
                {!isRegistered && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-8">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                                    Complete Your Blockchain Registration
                                </p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                                    Register to unlock all features and secure your medical records.
                                </p>
                                <button
                                    onClick={() => router.push("/patient/register")}
                                    className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                                >
                                    Register Now →
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isRegistered && profile ? (
                    <>
                        {/* Bento Grid - Health Dashboard */}
                        <div className="grid grid-cols-12 gap-4 mb-8">
                            {/* Blood Group Card */}
                            <div className="col-span-12 md:col-span-4 bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 rounded-2xl border-2 border-rose-200 dark:border-rose-800 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2.5 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-lg">
                                        <Droplet className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                                    </div>
                                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                                        {bloodInfo.rarity}
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-3 mb-2">
                                    <span className="text-4xl font-bold text-rose-900 dark:text-rose-100">
                                        {profile.bloodGroup || "N/A"}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-sm text-rose-700 dark:text-rose-300 mb-1">
                                            {bloodInfo.percentage}% of population
                                        </p>
                                        <div className="w-full bg-white/50 dark:bg-neutral-800/50 rounded-full h-1.5">
                                            <div
                                                className="bg-gradient-to-r from-rose-500 to-red-600 h-1.5 rounded-full"
                                                style={{ width: `${Math.min(bloodInfo.percentage * 2, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Age Card */}
                            <div className="col-span-6 md:col-span-3 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl border border-pink-200 dark:border-pink-800 p-6">
                                <div className="p-2.5 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-lg w-fit mb-4">
                                    <Calendar className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-4xl font-bold text-pink-900 dark:text-pink-100">
                                            {calculateAge(profile.dateOfBirth)}
                                        </span>
                                        <span className="text-lg text-pink-700 dark:text-pink-300">yrs</span>
                                    </div>
                                    <p className="text-sm text-pink-700 dark:text-pink-300">Age</p>
                                </div>
                            </div>

                            {/* Active Medications */}
                            <div className="col-span-6 md:col-span-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2.5 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-lg">
                                        <Pill className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Active</span>
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-4xl font-bold text-amber-900 dark:text-amber-100">
                                            {medicationCount}
                                        </span>
                                        <span className="text-lg text-amber-700 dark:text-amber-300">meds</span>
                                    </div>
                                    <p className="text-sm text-amber-700 dark:text-amber-300">Current prescriptions</p>
                                </div>
                            </div>

                            {/* Emergency Contact */}
                            <div className="col-span-6 md:col-span-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl border border-red-200 dark:border-red-800 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl">
                                        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <span className="text-sm font-medium text-red-700 dark:text-red-300">Emergency</span>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-red-900 dark:text-red-100 mb-1">
                                        {profile.emergencyName || "Not set"}
                                    </p>
                                    {profile.emergencyPhone && (
                                        <p className="text-sm font-mono text-red-800 dark:text-red-200 mt-2">
                                            {profile.emergencyPhone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Emergency QR Code Display */}
                            <div className="col-span-12 md:col-span-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl">
                                        <QrCode className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                                            Emergency QR Code
                                        </p>
                                        <p className="text-sm text-purple-700 dark:text-purple-300">
                                            Scan for instant access
                                        </p>
                                    </div>
                                </div>
                                {qrCode ? (
                                    <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 flex flex-col items-center">
                                        <img
                                            src={qrCode}
                                            alt="Emergency QR Code"
                                            className="w-48 h-48 mb-3"
                                        />
                                        <Link
                                            href="/patient/emergency"
                                            className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                                        >
                                            View full page <ArrowUpRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center">
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            Generating QR code...
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Medical Records Link */}
                            <Link
                                href="#"
                                onClick={(e) => { e.preventDefault(); alert("Medical Records feature coming soon!"); }}
                                className="col-span-6 md:col-span-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-6 hover:scale-[1.02] transition-transform cursor-pointer group"
                            >
                                <div className="p-3 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl w-fit mb-4">
                                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-1 group-hover:translate-x-1 transition-transform">
                                        Medical Records →
                                    </p>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        View history
                                    </p>
                                </div>
                            </Link>

                            {/* Doctor Access/Permissions Link */}
                            <Link
                                href="#"
                                onClick={(e) => { e.preventDefault(); alert("Doctor Access feature coming soon!"); }}
                                className="col-span-6 md:col-span-3 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-2xl border-2 border-cyan-200 dark:border-cyan-800 p-6 hover:scale-[1.02] transition-transform cursor-pointer group"
                            >
                                <div className="p-3 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl w-fit mb-4">
                                    <Shield className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-cyan-900 dark:text-cyan-100 mb-1 group-hover:translate-x-1 transition-transform">
                                        Doctor Access →
                                    </p>
                                    <p className="text-sm text-cyan-700 dark:text-cyan-300">
                                        Manage permissions
                                    </p>
                                </div>
                            </Link>
                        </div>

                        {/* Quick Info Section */}
                        <div className="bg-white dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 p-8 mb-8">
                            <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">
                                Medical Information
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                                        Known Allergies
                                    </label>
                                    <p className="text-neutral-900 dark:text-neutral-100">
                                        {profile.allergies || "None reported"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                                        Chronic Conditions
                                    </label>
                                    <p className="text-neutral-900 dark:text-neutral-100">
                                        {profile.chronicConditions || "None reported"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                                        Current Medications
                                    </label>
                                    <p className="text-neutral-900 dark:text-neutral-100">
                                        {profile.currentMedications || "None reported"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-12 text-center">
                        <AlertCircle className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                            No profile data available. Please register on the blockchain first.
                        </p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <FooterSection />
        </div>
    );
}
