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
    TrendingUp, ArrowUpRight, Scale, Pill, Sparkles, RefreshCw, Settings, RotateCw, XCircle,
    Check, X, CalendarDays, Clock, Stethoscope, ChevronRight, Share2, Users
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVoiceAssistant } from "@/components/VoiceCommandProvider";
import MedicalDataPrompt from "@/components/patient/MedicalDataPrompt";
import CustomAIInputModal, { CustomHealthData } from "@/components/patient/CustomAIInputModal";
import { AnimatedInsightText } from "@/components/ui/AnimatedInsightText";

interface PatientProfile {
    dateOfBirth?: string;
    gender?: string;
    bloodGroup?: string;
    phone?: string;
    streetAddress?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    allergies?: string;
    chronicConditions?: string;
    currentMedications?: string;
    previousSurgeries?: string;
    emergencyName?: string;
    emergencyRelation?: string;
    emergencyPhone?: string;
    isRegisteredOnChain?: boolean;
    walletAddress?: string;
    height?: string;
    weight?: string;
    profilePicture?: string;
    fullName?: string;
}

export default function PatientHome() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<PatientProfile | null>(null);
    const [qrCode, setQrCode] = useState<string>("");
    const { t, language } = useLanguage();

    // AI Health Insights state
    const [showDataPrompt, setShowDataPrompt] = useState(false);
    const [medicalDataComplete, setMedicalDataComplete] = useState(false);
    const [missingFields, setMissingFields] = useState<string[]>([]);
    const [aiInsights, setAiInsights] = useState<any>(null);
    const [loadingInsights, setLoadingInsights] = useState(false);
    const [showCustomInput, setShowCustomInput] = useState(false);

    const { setPatientContext } = useVoiceAssistant();

    // Sync patient data into the global voice assistant so it can read it back
    useEffect(() => {
        if (!profile) return;
        const h = profile.height ? parseFloat(profile.height) / 100 : null;
        const w = profile.weight ? parseFloat(profile.weight) : null;
        const bmiVal = h && w ? (w / (h * h)).toFixed(1) : null;
        const bmiCat = bmiVal
            ? parseFloat(bmiVal) < 18.5 ? "Underweight"
                : parseFloat(bmiVal) < 25 ? "Normal"
                    : parseFloat(bmiVal) < 30 ? "Overweight"
                        : "Obese"
            : null;
        setPatientContext({
            name: profile.fullName,
            medications: profile.currentMedications || "None",
            allergies: profile.allergies || "None",
            conditions: profile.chronicConditions || "None",
            bmi: bmiVal || undefined,
            bmiCategory: bmiCat || undefined,
            bloodGroup: profile.bloodGroup || undefined,
        });
    }, [profile, setPatientContext]);

    useEffect(() => {
        // Dev bypass: inject mock profile, skip auth + registration checks
        if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') {
            console.log('[DEV BYPASS] 🔓 Patient home - using mock profile');
            const mockProfile: PatientProfile = {
                fullName: 'John Doe',
                dateOfBirth: '1990-01-15',
                gender: 'male',
                bloodGroup: 'O+',
                phone: '+91 9876543210',
                address: '123 Main Street',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001',
                allergies: 'Penicillin, Peanuts',
                chronicConditions: 'None',
                currentMedications: 'None',
                previousSurgeries: 'Appendectomy (2015)',
                height: '175',
                weight: '70',
                isRegisteredOnChain: true,
                walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
            };
            setProfile(mockProfile);
            validateMedicalData(mockProfile);
            setLoading(false);
            return;
        }

        if (status === "unauthenticated") {
            router.push("/");
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/patient/status");
                const data = await res.json();

                // Check if user has completed registration
                if (!data.isRegisteredOnChain) {
                    console.log('User not registered, redirecting to registration page');
                    router.push("/patient/register");
                    return;
                }

                setProfile(data);

                // Validate medical data for AI
                validateMedicalData(data);

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
    }, [session, status]); // router intentionally omitted — it's not stable in Next.js and would cause infinite re-runs

    const calculateAge = (dob?: string): number | string => {
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

    const calculateAgeNumber = (dob?: string): number => {
        if (!dob) return 30; // Default age if not provided
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
            "O+": { rarity: t.portal.patientHome.common, percentage: 37.4 },
            "A+": { rarity: t.portal.patientHome.common, percentage: 35.7 },
            "B+": { rarity: t.portal.patientHome.uncommon, percentage: 8.5 },
            "AB+": { rarity: t.portal.patientHome.rare, percentage: 3.4 },
            "O-": { rarity: t.portal.patientHome.veryRare, percentage: 6.6 },
            "A-": { rarity: t.portal.patientHome.rare, percentage: 6.3 },
            "B-": { rarity: t.portal.patientHome.rare, percentage: 1.5 },
            "AB-": { rarity: t.portal.patientHome.extremelyRare, percentage: 0.6 }
        };
        return rarityMap[bloodGroup || ""] || { rarity: t.portal.patientHome.unknown, percentage: 0 };
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
        if (bmi < 18.5) return { category: t.portal.patientHome.underweight, color: 'text-blue-600 dark:text-blue-400' };
        if (bmi < 25) return { category: t.portal.patientHome.normal, color: 'text-green-600 dark:text-green-400' };
        if (bmi < 30) return { category: t.portal.patientHome.overweight, color: 'text-orange-600 dark:text-orange-400' };
        return { category: t.portal.patientHome.obese, color: 'text-red-600 dark:text-red-400' };
    };

    // Validate medical data completeness for AI
    const validateMedicalData = (data: PatientProfile) => {
        const missing: string[] = [];

        if (!data.allergies || data.allergies.trim() === '') {
            missing.push('allergies');
        }
        if (!data.chronicConditions || data.chronicConditions.trim() === '') {
            missing.push('chronic conditions');
        }
        if (!data.currentMedications || data.currentMedications.trim() === '') {
            missing.push('current medications');
        }

        setMissingFields(missing);
        setMedicalDataComplete(missing.length === 0);

        // Auto-generate insights only once (when aiInsights hasn't been fetched yet)
        if (missing.length === 0 && !aiInsights) {
            generateAIInsights(data);
        }
    };

    // Generate AI health insights
    const generateAIInsights = async (data: PatientProfile) => {
        setLoadingInsights(true);
        try {
            const age = calculateAge(data.dateOfBirth);
            const bmiValue = calculateBMI();
            const bmiNumber = bmiValue ? parseFloat(bmiValue) : 22; // Default BMI if not available
            const bmiCategory = bmiValue ? getBMICategory(bmiNumber).category : 'Normal';

            const requestBody = {
                age: typeof age === 'number' ? age : 30,
                gender: data.gender || 'Not specified',
                bloodGroup: data.bloodGroup || 'Unknown',
                bmi: bmiNumber,
                bmiCategory,
                allergies: data.allergies || '',
                chronicConditions: data.chronicConditions || '',
                currentMedications: data.currentMedications || '',
                previousSurgeries: data.previousSurgeries || ''
            };

            console.log('🤖 Generating AI insights with data:', requestBody);

            const response = await fetch('/api/ai/health-insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            console.log('📡 AI API response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('✅ AI insights received:', result);
                setAiInsights(result.insights);
            } else {
                const errorText = await response.text();
                console.error('❌ Failed to generate AI insights. Status:', response.status, 'Error:', errorText);
                alert(`Failed to generate AI insights: ${errorText}`);
            }
        } catch (error) {
            console.error('💥 Error generating AI insights:', error);
            alert(`Error generating AI insights: ${error}`);
        } finally {
            setLoadingInsights(false);
        }
    };

    // Generate AI insights with custom data
    const generateCustomAIInsights = async (customData: CustomHealthData) => {
        setLoadingInsights(true);
        try {
            const bmiCategory = customData.bmi < 18.5 ? 'Underweight' :
                customData.bmi < 25 ? 'Normal' :
                    customData.bmi < 30 ? 'Overweight' : 'Obese';

            const requestBody = {
                age: customData.age,
                gender: 'Not specified',
                bloodGroup: customData.bloodGroup,
                bmi: customData.bmi,
                bmiCategory,
                allergies: customData.allergies,
                chronicConditions: customData.chronicConditions,
                currentMedications: customData.currentMedications,
                previousSurgeries: ''
            };

            console.log('🤖 Generating AI insights with custom data:', requestBody);

            const response = await fetch('/api/ai/health-insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            console.log('📡 AI API response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('✅ AI insights received:', result);
                setAiInsights(result.insights);
            } else {
                const errorText = await response.text();
                console.error('❌ Failed to generate AI insights. Status:', response.status, 'Error:', errorText);
                alert(`Failed to generate AI insights: ${errorText}`);
            }
        } catch (error) {
            console.error('💥 Error generating AI insights:', error);
            alert(`Error generating AI insights: ${error}`);
        } finally {
            setLoadingInsights(false);
        }
    };

    // Save missing medical data
    const saveMedicalData = async (data: {
        allergies: string;
        chronicConditions: string;
        currentMedications: string;
    }) => {
        try {
            const response = await fetch('/api/patient/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Reload profile
                const res = await fetch("/api/patient/status");
                const updatedProfile = await res.json();
                setProfile(updatedProfile);
                validateMedicalData(updatedProfile);
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error saving medical data:', error);
            throw error;
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
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
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                {/* Header */}
                <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50" id="patient-welcome">
                            <span className="block text-base md:text-lg font-normal text-neutral-600 dark:text-neutral-400 mb-1">
                                {t.portal.patientHome.welcomeBack},
                            </span>
                            {profile?.fullName || session?.user?.email?.split('@')[0] || 'Developer'}!
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-1 hidden md:block">
                            {session?.user?.email || 'dev@example.com'}
                        </p>
                    </div>

                    {/* Right side: Book Appointment */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Book Appointment CTA */}
                        <button
                            id="book-appointment-btn"
                            onClick={() => router.push('/patient/appointments')}
                            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base"
                            aria-label="Book a new appointment"
                        >
                            <CalendarDays className="w-5 h-5" />
                            Book Appointment
                        </button>
                    </div>
                </div>

                {/* Registration Status Banner */}
                {!isRegistered && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-8">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                                    {t.portal.patientHome.completeRegistration}
                                </p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                                    {t.portal.patientHome.completeRegistrationDesc}
                                </p>
                                <button
                                    onClick={() => router.push("/patient/register")}
                                    className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                                >
                                    {t.portal.patientHome.registerNow}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isRegistered && profile ? (
                    <>
                        {/* 2-Panel Layout: Left = Patient Info (60%), Right = AI Insights (40%) */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                            {/* Left Panel: Patient Information (60% = 3/5) */}
                            <div className="lg:col-span-3 space-y-8">
                                {/* BMI | Blood Group - Side by Side with Values on Top */}
                                <div className="flex items-start gap-4 md:gap-8">
                                    {/* BMI */}
                                    {bmi && bmiInfo && (
                                        <div className="flex flex-col">
                                            <div className="flex items-baseline gap-2 md:gap-3 mb-1 md:mb-2">
                                                <span className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-50">{bmi}</span>
                                                <span className={`text-base md:text-xl font-medium ${bmiInfo.color}`}>{bmiInfo.category}</span>
                                            </div>
                                            <h3 className="text-xs md:text-sm font-medium text-neutral-600 dark:text-neutral-400">{t.portal.patientHome.bodyMassIndex}</h3>
                                        </div>
                                    )}

                                    {/* Separator */}
                                    {bmi && bmiInfo && <span className="text-2xl md:text-3xl text-neutral-300 dark:text-neutral-600 mt-1 md:mt-2">|</span>}

                                    {/* Blood Group */}
                                    <div className="flex flex-col">
                                        <div className="flex items-baseline gap-2 md:gap-3 mb-1 md:mb-2">
                                            <span className="text-3xl md:text-5xl font-bold text-rose-600 dark:text-rose-400">{profile.bloodGroup || "N/A"}</span>
                                            <span className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                                                {bloodInfo.rarity} • {bloodInfo.percentage}%
                                            </span>
                                        </div>
                                        <h3 className="text-xs md:text-sm font-medium text-neutral-600 dark:text-neutral-400">{t.portal.patientHome.bloodGroup}</h3>
                                    </div>

                                    {/* Separator */}
                                    {profile?.chronicConditions && <span className="text-2xl md:text-3xl text-neutral-300 dark:text-neutral-600 mt-1 md:mt-2">|</span>}

                                    {/* Diagnosed With */}
                                    {profile?.chronicConditions && (
                                        <div className="flex flex-col">
                                            <div className="flex items-baseline gap-2 md:gap-3 mb-1 md:mb-2">
                                                <span className="text-xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50 line-clamp-1">{profile.chronicConditions}</span>
                                            </div>
                                            <h3 className="text-xs md:text-sm font-medium text-neutral-600 dark:text-neutral-400">Diagnosed With</h3>
                                        </div>
                                    )}
                                </div>

                                {/* Current Medications */}
                                {profile.currentMedications && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-3">{t.portal.patientHome.currentMedications}</h3>
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
                                                                Self-reported medication
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Panel: AI Health Insights (40% = 2/5) */}
                            <div className="lg:col-span-2">
                                {/* AI Insights Card wrapper */}
                                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/60 shadow-sm">
                                    <div className="p-5">
                                        {/* AI Health Insights */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">AI Health Insights</h3>
                                                </div>
                                                {medicalDataComplete && aiInsights && (
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setShowCustomInput(!showCustomInput)}
                                                            disabled={loadingInsights}
                                                            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition disabled:opacity-40"
                                                            aria-label="Customize AI insights"
                                                        >
                                                            <Settings className="w-4 h-4" />
                                                        </button>

                                                        {/* Dropdown Menu */}
                                                        {showCustomInput && (
                                                            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 z-50 p-4 space-y-3">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-50">Customize Insights</h4>
                                                                    <button
                                                                        onClick={() => setShowCustomInput(false)}
                                                                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
                                                                    >
                                                                        <XCircle className="w-4 h-4 text-neutral-400" />
                                                                    </button>
                                                                </div>

                                                                <div>
                                                                    <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Age</label>
                                                                    <input
                                                                        type="number"
                                                                        defaultValue={profile?.dateOfBirth ? calculateAgeNumber(profile.dateOfBirth) : 30}
                                                                        className="w-full px-2 py-1.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">BMI</label>
                                                                    <input
                                                                        type="number"
                                                                        step="0.1"
                                                                        defaultValue={calculateBMI() || 22}
                                                                        className="w-full px-2 py-1.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                                                                    />
                                                                </div>

                                                                <button
                                                                    onClick={() => {
                                                                        setShowCustomInput(false);
                                                                        profile && generateAIInsights(profile);
                                                                    }}
                                                                    className="w-full px-3 py-2 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-700 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-sm rounded-lg transition font-medium"
                                                                >
                                                                    Regenerate
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Missing Data Prompt */}
                                            {!medicalDataComplete && (
                                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                                    <div className="flex items-start gap-3">
                                                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-amber-900 dark:text-amber-100 text-sm mb-2">
                                                                Complete Your Medical Profile
                                                            </p>
                                                            <p className="text-xs text-amber-800 dark:text-amber-200 mb-3">
                                                                To receive personalized AI health insights, please provide:
                                                            </p>
                                                            <ul className="space-y-1 mb-3">
                                                                {missingFields.map(field => (
                                                                    <li key={field} className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-200">
                                                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                                                        {field.charAt(0).toUpperCase() + field.slice(1)}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            <button
                                                                onClick={() => setShowDataPrompt(true)}
                                                                className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition font-medium"
                                                            >
                                                                Complete Profile →
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* AI Insights */}
                                            {medicalDataComplete && (
                                                <div className="space-y-3">
                                                    {loadingInsights ? (
                                                        <div className="text-center py-8">
                                                            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
                                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Generating personalized insights...</p>
                                                        </div>
                                                    ) : aiInsights ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            {/* Left Column: DO's */}
                                                            <div>
                                                                <h4 className="font-semibold text-lg text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
                                                                    <CheckCircle className="w-5 h-5" />
                                                                    DO's
                                                                </h4>
                                                                <ul className="space-y-3">
                                                                    {aiInsights.dos?.map((item: string, idx: number) => (
                                                                        <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                                                                            <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                                                            <AnimatedInsightText text={item} speed="fast" />
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            {/* Right Column: DON'Ts */}
                                                            <div>
                                                                <h4 className="font-semibold text-lg text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                                                                    <AlertCircle className="w-5 h-5" />
                                                                    DON'Ts
                                                                </h4>
                                                                <ul className="space-y-3">
                                                                    {aiInsights.donts?.map((item: string, idx: number) => (
                                                                        <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                                                                            <X className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                                                            <AnimatedInsightText text={item} speed="fast" />
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-6">
                                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                                                                Generate personalized health insights
                                                            </p>
                                                            <button
                                                                onClick={() => profile && generateAIInsights(profile)}
                                                                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition font-medium"
                                                            >
                                                                Generate Insights
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>{/* end card inner padding */}
                                </div>{/* end AI card wrapper */}

                                {/* Medical Data Prompt Modal */}
                                <MedicalDataPrompt
                                    isOpen={showDataPrompt}
                                    onClose={() => setShowDataPrompt(false)}
                                    onSave={saveMedicalData}
                                    missingFields={missingFields}
                                />

                                {/* Custom AI Input Modal */}
                                <CustomAIInputModal
                                    isOpen={showCustomInput}
                                    onClose={() => setShowCustomInput(false)}
                                    onGenerate={generateCustomAIInsights}
                                    currentData={{
                                        age: profile?.dateOfBirth ? calculateAgeNumber(profile.dateOfBirth) : 30,
                                        bloodGroup: profile?.bloodGroup || '',
                                        bmi: calculateBMI() ? parseFloat(calculateBMI()!) : 22,
                                        allergies: profile?.allergies || '',
                                        chronicConditions: profile?.chronicConditions || '',
                                        currentMedications: profile?.currentMedications || ''
                                    }}
                                />
                            </div>
                        </div>

                        {/* ── BOTTOM ROW: Last Visit + Share with Family ────── */}
                        <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-6">

                            {/* Last Visit — narrower (3/5) */}
                            <div className="lg:col-span-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/60 shadow-sm">
                                <div className="p-5">
                                    {/* Card header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                                                <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">Last Visit</h3>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Most recent consultation</p>
                                            </div>
                                        </div>
                                        <Link
                                            href="/patient/journey"
                                            className="flex items-center gap-1 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                                        >
                                            View all <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>

                                    {/* Doctor row */}
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/40 border border-neutral-100 dark:border-neutral-600/40 mb-3">
                                        <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center flex-shrink-0">
                                            <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">Dr. Priya Sharma</p>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">General Physician · Feb 10, 2026</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Follow-up</p>
                                            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Mar 10, 2026</p>
                                        </div>
                                    </div>

                                    {/* Diagnosis + Meds row */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/40 border border-neutral-100 dark:border-neutral-600/40">
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Diagnosis</p>
                                            <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm line-clamp-2">
                                                {profile?.chronicConditions && profile.chronicConditions !== 'None'
                                                    ? profile.chronicConditions.split(',')[0].trim()
                                                    : 'Routine Checkup'}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/40 border border-neutral-100 dark:border-neutral-600/40">
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1.5">Prescribed</p>
                                            <div className="flex flex-wrap gap-1">
                                                {profile?.currentMedications && profile.currentMedications !== 'None'
                                                    ? profile.currentMedications.split(',').filter(m => m.trim()).slice(0, 2).map((med, i) => (
                                                        <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-100 dark:border-blue-700/40">
                                                            <Pill className="w-2.5 h-2.5" />
                                                            {med.trim()}
                                                        </span>
                                                    ))
                                                    : <span className="text-xs text-neutral-400">None</span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Share with Family — wider (2/5) */}
                            <div className="lg:col-span-2 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/60 shadow-sm">
                                <div className="p-5 h-full flex flex-col">
                                    {/* Header */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                                            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">Share with Family</h3>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Let loved ones track your visit</p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                                        Share a live tracking link so your family can see your current queue position, wait time, and journey progress — in real time, without needing an account.
                                    </p>

                                    {/* Feature pills */}
                                    <div className="flex flex-wrap gap-1.5 mb-5">
                                        {['Live queue position', 'Wait time estimate', 'No login needed', 'WhatsApp share'].map(f => (
                                            <span key={f} className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs rounded-full">
                                                <Check className="w-2.5 h-2.5 text-green-500" />
                                                {f}
                                            </span>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <div className="mt-auto flex flex-col gap-2">
                                        <Link
                                            href="/patient/journey"
                                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-700 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-sm font-semibold rounded-xl transition-colors"
                                        >
                                            <Share2 className="w-4 h-4" />
                                            Share Journey Link
                                        </Link>
                                        <p className="text-center text-xs text-neutral-400 dark:text-neutral-500">
                                            Start a journey first to generate a share link
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>{/* end bottom row grid */}
                    </>
                ) : (
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-12 text-center">
                        <AlertCircle className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                            {t.portal.patientHome.noProfileData}
                        </p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <FooterSection />
        </div>
    );
}
