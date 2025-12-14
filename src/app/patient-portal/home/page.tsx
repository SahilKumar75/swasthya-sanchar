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
    height?: string;
    weight?: string;
}

export default function PatientHome() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<PatientProfile | null>(null);
    const [qrCode, setQrCode] = useState<string>("");

    useEffect(() => {
        // Development bypass - skip auth checks if enabled
        if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') {
            console.log('[DEV BYPASS] 🔓 Patient portal home - auth bypass enabled');
            return;
        }

        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Development bypass - use mock data
                if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') {
                    console.log('[DEV BYPASS] 🔓 Loading mock patient data for home page');
                    const mockProfile: PatientProfile = {
                        dateOfBirth: "1990-01-15",
                        bloodGroup: "O+",
                        allergies: "Penicillin, Peanuts",
                        chronicConditions: "None",
                        currentMedications: "Aspirin, Vitamin D",
                        emergencyName: "Jane Doe",
                        emergencyPhone: "+91 9876543211",
                        isRegisteredOnChain: true,
                        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
                        height: "175",
                        weight: "70"
                    };

                    setProfile(mockProfile);

                    // Generate QR code
                    const QRCode = (await import("qrcode")).default;
                    const emergencyUrl = `${window.location.origin}/emergency/0x1234567890abcdef1234567890abcdef12345678`;
                    const qr = await QRCode.toDataURL(emergencyUrl, { width: 200, margin: 2 });
                    setQrCode(qr);
                    setLoading(false);
                    return;
                }

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

        if (session || process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') {
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

    const calculateBMI = () => {
        if (!profile?.height || !profile?.weight) return null;
        const heightInMeters = parseFloat(profile.height) / 100;
        const weightInKg = parseFloat(profile.weight);
        if (heightInMeters <= 0 || weightInKg <= 0) return null;
        const bmi = weightInKg / (heightInMeters * heightInMeters);
        return bmi.toFixed(1);
    };

    const getBMICategory = (bmi: number) => {
        if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600 dark:text-blue-400' };
        if (bmi < 25) return { category: 'Normal', color: 'text-green-600 dark:text-green-400' };
        if (bmi < 30) return { category: 'Overweight', color: 'text-orange-600 dark:text-orange-400' };
        return { category: 'Obese', color: 'text-red-600 dark:text-red-400' };
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

    const isRegistered = profile?.isRegisteredOnChain || false;
    const bloodInfo = getBloodGroupRarity(profile?.bloodGroup);
    const medicationCount = getMedicationCount();
    const bmi = calculateBMI();
    const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                        Welcome back, {session?.user?.email?.split('@')[0] || 'Developer'}!
                    </h2>
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
                        {/* Simplified Layout - Two Column Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Left Column: BMI, Blood Group, and Current Medications */}
                            <div className="space-y-8">
                                {/* BMI | Blood Group - Side by Side with Values on Top */}
                                <div className="flex items-start gap-8">
                                    {/* BMI */}
                                    {bmi && bmiInfo && (
                                        <div className="flex flex-col">
                                            <div className="flex items-baseline gap-3 mb-2">
                                                <span className="text-5xl font-bold text-neutral-900 dark:text-neutral-50">{bmi}</span>
                                                <span className={`text-xl font-medium ${bmiInfo.color}`}>{bmiInfo.category}</span>
                                            </div>
                                            <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Body Mass Index (BMI)</h3>
                                        </div>
                                    )}

                                    {/* Separator */}
                                    {bmi && bmiInfo && <span className="text-3xl text-neutral-300 dark:text-neutral-600 mt-2">|</span>}

                                    {/* Blood Group */}
                                    <div className="flex flex-col">
                                        <div className="flex items-baseline gap-3 mb-2">
                                            <span className="text-5xl font-bold text-rose-600 dark:text-rose-400">{profile.bloodGroup || "N/A"}</span>
                                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                                {bloodInfo.rarity} • {bloodInfo.percentage}%
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Blood Group</h3>
                                    </div>
                                </div>

                                {/* Current Medications */}
                                {profile.currentMedications && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Current Medications</h3>
                                        <div className="ml-4 pl-4 space-y-3 relative">
                                            {profile.currentMedications.split(',').filter(m => m.trim()).map((med, idx, arr) => {
                                                const isLast = idx === arr.length - 1;
                                                return (
                                                    <div key={idx} className="relative">
                                                        {/* Vertical line (only if not last) */}
                                                        {!isLast && (
                                                            <div className="absolute left-[-1rem] top-0 bottom-0 w-0.5 bg-neutral-300 dark:bg-neutral-600"></div>
                                                        )}

                                                        {/* Vertical line for last item (only to the connector) */}
                                                        {isLast && (
                                                            <div className="absolute left-[-1rem] top-0 h-3 w-0.5 bg-neutral-300 dark:bg-neutral-600"></div>
                                                        )}

                                                        {/* Horizontal connector */}
                                                        <div className="absolute left-[-1rem] top-3 w-4 h-0.5 bg-neutral-300 dark:bg-neutral-600"></div>

                                                        {/* Medication info */}
                                                        <div>
                                                            <p className="font-medium text-neutral-900 dark:text-neutral-100">{med.trim()}</p>
                                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                                                Prescribed by Dr. Smith • Jan 15, 2024
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Diagnosis & Health Tips */}
                            <div className="space-y-6">
                                {/* Diagnosed Conditions */}
                                <div>
                                    <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Diagnosed With</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-lg text-sm font-medium">
                                            Hypothyroidism
                                        </span>
                                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Since Dec 2023</span>
                                    </div>
                                </div>

                                {/* Dietary Tips & Medication Schedule - Side by Side */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Dietary Tips */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Dietary Recommendations</h3>
                                        <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                                            <li>
                                                <span className="font-semibold text-green-700 dark:text-green-400">Do:</span> Include iodine-rich foods (seafood, dairy, eggs)
                                            </li>
                                            <li>
                                                <span className="font-semibold text-green-700 dark:text-green-400">Do:</span> Consume selenium sources (Brazil nuts, tuna, sardines)
                                            </li>
                                            <li>
                                                <span className="font-semibold text-red-700 dark:text-red-400">Don't:</span> Limit soy products and cruciferous vegetables
                                            </li>
                                            <li>
                                                <span className="font-semibold text-red-700 dark:text-red-400">Don't:</span> Avoid excessive caffeine intake
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Medication Schedule */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Medication Schedule</h3>
                                        <div className="space-y-3">
                                            <div className="border-l-4 border-blue-500 pl-4 py-2">
                                                <p className="font-medium text-neutral-900 dark:text-neutral-100">Aspirin</p>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                                    <span className="font-medium">Dosage:</span> 75mg daily
                                                </p>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    <span className="font-medium">Timing:</span> After breakfast with water
                                                </p>
                                            </div>
                                            <div className="border-l-4 border-purple-500 pl-4 py-2">
                                                <p className="font-medium text-neutral-900 dark:text-neutral-100">Vitamin D</p>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                                    <span className="font-medium">Dosage:</span> 1000 IU daily
                                                </p>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    <span className="font-medium">Timing:</span> Morning with meal
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features Section */}
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">Features</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Medical Records Link */}
                                <Link
                                    href="/patient/records"
                                    className="group relative overflow-hidden bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
                                                Medical Records
                                            </h3>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                Access your complete medical history
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 h-1 bg-blue-500 w-0 group-hover:w-full transition-all duration-300"></div>
                                </Link>

                                {/* Doctor Access Link */}
                                <Link
                                    href="/patient-home/permissions"
                                    className="group relative overflow-hidden bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-cyan-400 dark:hover:border-cyan-600 transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                            <Shield className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
                                                Doctor Access
                                            </h3>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                Manage doctor permissions
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 h-1 bg-cyan-500 w-0 group-hover:w-full transition-all duration-300"></div>
                                </Link>

                                {/* Emergency Card Link */}
                                <Link
                                    href="/patient/emergency"
                                    className="group relative overflow-hidden bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-red-400 dark:hover:border-red-600 transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                            <QrCode className="w-6 h-6 text-red-600 dark:text-red-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
                                                Emergency Card
                                            </h3>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                Quick access QR code
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 h-1 bg-red-500 w-0 group-hover:w-full transition-all duration-300"></div>
                                </Link>
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
