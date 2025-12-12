"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { User, Calendar, Heart, Phone, Loader2, ChevronRight, ChevronLeft, Check, Activity, AlertCircle } from "lucide-react";

const STEPS = [
    { id: 1, title: "Personal Info", icon: User },
    { id: 2, title: "Medical Info", icon: Heart },
    { id: 3, title: "Emergency Contact", icon: AlertCircle },
];

export default function PatientRegister() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        dateOfBirth: "",
        bloodGroup: "",
        allergies: "",
        chronicConditions: "",
        currentMedications: "",
        emergencyName: "",
        emergencyPhone: "",
    });

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    // Check if already registered
    useEffect(() => {
        const checkRegistrationStatus = async () => {
            if (!session) return;
            
            try {
                const res = await fetch("/api/patient/status");
                const data = await res.json();
                
                if (data.isRegisteredOnChain) {
                    // Already registered, redirect to home
                    router.push("/patient-portal/home");
                }
            } catch (error) {
                console.error("Error checking registration status:", error);
            } finally {
                setCheckingStatus(false);
            }
        };

        if (session) {
            checkRegistrationStatus();
        }
    }, [session, router]);

    if (status === "loading" || checkingStatus) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Checking registration status...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const handleNext = () => {
        // Validate current step
        if (currentStep === 1) {
            if (!formData.dateOfBirth || !formData.bloodGroup) {
                setError("Please fill in all required fields");
                return;
            }
        } else if (currentStep === 3) {
            if (!formData.emergencyName || !formData.emergencyPhone) {
                setError("Please fill in all required fields");
                return;
            }
        }
        setError("");
        setCurrentStep(currentStep + 1);
    };

    const handlePrevious = () => {
        setError("");
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate final step
        if (!formData.emergencyName || !formData.emergencyPhone) {
            setError("Please fill in all required fields");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/patient/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dateOfBirth: formData.dateOfBirth,
                    emergencyData: {
                        bloodGroup: formData.bloodGroup,
                        allergies: formData.allergies,
                        chronicConditions: formData.chronicConditions,
                        currentMedications: formData.currentMedications,
                        emergencyName: formData.emergencyName,
                        emergencyPhone: formData.emergencyPhone,
                    },
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to register");
            }

            setSuccess("Registration successful! Redirecting...");
            console.log("Transaction hash:", data.transactionHash);

            // Redirect to home after 2 seconds
            setTimeout(() => {
                router.push("/patient-portal/home");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Failed to register");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Patient Registration
                    </h1>
                    <p className="text-gray-600">
                        Complete your profile in 3 simple steps
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon;
                            const isCompleted = currentStep > step.id;
                            const isCurrent = currentStep === step.id;

                            return (
                                <div key={step.id} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                                isCompleted
                                                    ? "bg-green-500 text-white"
                                                    : isCurrent
                                                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                                                    : "bg-gray-200 text-gray-500"
                                            }`}
                                        >
                                            {isCompleted ? (
                                                <Check className="w-6 h-6" />
                                            ) : (
                                                <Icon className="w-6 h-6" />
                                            )}
                                        </div>
                                        <p
                                            className={`mt-2 text-sm font-medium ${
                                                isCurrent ? "text-blue-600" : "text-gray-600"
                                            }`}
                                        >
                                            {step.title}
                                        </p>
                                    </div>
                                    {index < STEPS.length - 1 && (
                                        <div
                                            className={`h-1 flex-1 mx-4 rounded transition-all ${
                                                isCompleted ? "bg-green-500" : "bg-gray-200"
                                            }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <p className="text-green-800">{success}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Personal Info */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                                        Date of Birth <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.dateOfBirth}
                                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Blood Group */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Heart className="w-4 h-4 mr-2 text-red-600" />
                                        Blood Group <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <select
                                        required
                                        value={formData.bloodGroup}
                                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    >
                                        <option value="">Select Blood Group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Medical Info */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Medical Information</h3>
                                    <p className="text-sm text-gray-600 mb-6">Optional but recommended for emergency situations</p>
                                </div>

                                {/* Allergies */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Activity className="w-4 h-4 mr-2 text-orange-600" />
                                        Known Allergies
                                    </label>
                                    <textarea
                                        value={formData.allergies}
                                        onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                                        placeholder="e.g., Penicillin, Peanuts, Latex"
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Chronic Conditions */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Heart className="w-4 h-4 mr-2 text-purple-600" />
                                        Chronic Conditions
                                    </label>
                                    <textarea
                                        value={formData.chronicConditions}
                                        onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                                        placeholder="e.g., Diabetes, Hypertension, Asthma"
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Current Medications */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Activity className="w-4 h-4 mr-2 text-green-600" />
                                        Current Medications
                                    </label>
                                    <textarea
                                        value={formData.currentMedications}
                                        onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                                        placeholder="e.g., Aspirin 100mg daily, Metformin 500mg twice daily"
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Emergency Contact */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Emergency Contact</h3>
                                    <p className="text-sm text-gray-600 mb-6">Who should we contact in case of emergency?</p>
                                </div>

                                {/* Emergency Contact Name */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 mr-2 text-blue-600" />
                                        Contact Name <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.emergencyName}
                                        onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                                        placeholder="Full name of emergency contact"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Emergency Contact Phone */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="w-4 h-4 mr-2 text-green-600" />
                                        Contact Phone <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.emergencyPhone}
                                        onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                                        placeholder="+91 9876543210"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Summary */}
                                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="font-semibold text-blue-900 mb-3">Registration Summary</h4>
                                    <div className="space-y-2 text-sm text-blue-800">
                                        <p>✓ Date of Birth: {formData.dateOfBirth}</p>
                                        <p>✓ Blood Group: {formData.bloodGroup}</p>
                                        <p>✓ Emergency Contact: {formData.emergencyName}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                                className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                Previous
                            </button>

                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Next
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Registering...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Complete Registration
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            Your data will be securely stored on the blockchain
                        </p>
                    </form>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
