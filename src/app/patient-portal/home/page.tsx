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
    TrendingUp, ArrowUpRight, Scale, Pill, Sparkles, RefreshCw
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import MedicalDataPrompt from "@/components/patient/MedicalDataPrompt";
import CustomAIInputModal, { CustomHealthData } from "@/components/patient/CustomAIInputModal";

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
    profilePicture?: string;
    fullName?: string;
}

export default function PatientHome() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<PatientProfile | null>(null);
    const [qrCode, setQrCode] = useState<string>("");
    const { t } = useLanguage();

    // AI Health Insights state
    const [showDataPrompt, setShowDataPrompt] = useState(false);
    const [medicalDataComplete, setMedicalDataComplete] = useState(false);
    const [missingFields, setMissingFields] = useState<string[]>([]);
    const [aiInsights, setAiInsights] = useState<any>(null);
    const [loadingInsights, setLoadingInsights] = useState(false);
    const [showCustomInput, setShowCustomInput] = useState(false);

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
    }, [session, router]);

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

        // Auto-generate insights if data is complete
        if (missing.length === 0) {
            generateAIInsights(data);
        }
    };

    // Generate AI health insights
    const generateAIInsights = async (data: PatientProfile) => {
        setLoadingInsights(true);
        try {
            const age = calculateAge(data.dateOfBirth);
            const bmiValue = calculateBMI();
            const bmiCategory = bmiValue ? getBMICategory(parseFloat(bmiValue)).category : 'Unknown';

            const requestBody = {
                age: typeof age === 'number' ? age : 30,
                gender: 'Not specified',
                bloodGroup: data.bloodGroup || 'Unknown',
                bmi: bmiValue ? parseFloat(bmiValue) : 22,
                bmiCategory,
                allergies: data.allergies || '',
                chronicConditions: data.chronicConditions || '',
                currentMedications: data.currentMedications || '',
                previousSurgeries: ''
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
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                        <span className="block text-base md:text-lg font-normal text-neutral-600 dark:text-neutral-400 mb-1">
                            {t.portal.patientHome.welcomeBack},
                        </span>
                        {profile?.fullName || session?.user?.email?.split('@')[0] || 'Developer'}!
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-1 hidden md:block">
                        {session?.user?.email || 'dev@example.com'}
                    </p>
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
                        {/* Simplified Layout - Two Column Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Left Column: BMI, Blood Group, and Current Medications */}
                            <div className="space-y-8">
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

                            {/* Right Column: Diagnosis & Health Tips */}
                            <div className="space-y-6">
                                {/* Diagnosed Conditions */}
                                <div>
                                    <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-3">{t.portal.patientHome.diagnosedWith}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-lg text-sm font-medium">
                                            Hypothyroidism
                                        </span>
                                        <span className="text-xs text-neutral-500 dark:text-neutral-400">{t.portal.patientHome.since} Dec 2023</span>
                                    </div>
                                </div>

                                {/* AI Health Insights */}
                                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-xl border border-purple-200 dark:border-purple-800 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">AI Health Insights</h3>
                                        </div>
                                        {medicalDataComplete && aiInsights && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setShowCustomInput(true)}
                                                    disabled={loadingInsights}
                                                    className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition flex items-center gap-1.5 disabled:opacity-50"
                                                >
                                                    <Sparkles className="w-3.5 h-3.5" />
                                                    Customize
                                                </button>
                                                <button
                                                    onClick={() => profile && generateAIInsights(profile)}
                                                    disabled={loadingInsights}
                                                    className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition flex items-center gap-1.5 disabled:opacity-50"
                                                >
                                                    <RefreshCw className={`w-3.5 h-3.5 ${loadingInsights ? 'animate-spin' : ''}`} />
                                                    Refresh
                                                </button>
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
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {/* Condition Management */}
                                                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-purple-100 dark:border-purple-900">
                                                        <div className="flex items-start gap-2">
                                                            <Heart className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-50 mb-1">
                                                                    {aiInsights.conditionManagement?.title || "Condition Management"}
                                                                </h4>
                                                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                                                    {aiInsights.conditionManagement?.advice || "No advice available"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Medication Guidance */}
                                                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-purple-100 dark:border-purple-900">
                                                        <div className="flex items-start gap-2">
                                                            <Pill className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5" />
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-50 mb-1">
                                                                    {aiInsights.medicationAdherence?.title || "Medication Guidance"}
                                                                </h4>
                                                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                                                    {aiInsights.medicationAdherence?.advice || "No advice available"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Allergy Safety */}
                                                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-red-100 dark:border-red-900">
                                                        <div className="flex items-start gap-2">
                                                            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-50 mb-1">
                                                                    {aiInsights.allergySafety?.title || "Allergy Safety"}
                                                                </h4>
                                                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                                                    {aiInsights.allergySafety?.advice || "No advice available"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Lifestyle Tips */}
                                                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-green-100 dark:border-green-900">
                                                        <div className="flex items-start gap-2">
                                                            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-50 mb-1">
                                                                    {aiInsights.lifestyleAdvice?.title || "Lifestyle Tips"}
                                                                </h4>
                                                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                                                    {aiInsights.lifestyleAdvice?.advice || "No advice available"}
                                                                </p>
                                                            </div>
                                                        </div>
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
                                        age: profile?.dateOfBirth ? calculateAge(profile.dateOfBirth) : 30,
                                        bloodGroup: profile?.bloodGroup || '',
                                        bmi: calculateBMI() ? parseFloat(calculateBMI()!) : 22,
                                        allergies: profile?.allergies || '',
                                        chronicConditions: profile?.chronicConditions || '',
                                        currentMedications: profile?.currentMedications || ''
                                    }}
                                />
                            </div>
                        </div>
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
