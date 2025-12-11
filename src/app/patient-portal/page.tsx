"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerPatient } from "@/lib/api-client";
import { Navbar } from "@/components/Navbar";
import { User, Calendar, Heart, Phone, MapPin, Loader2 } from "lucide-react";

export default function HybridPatientPortal() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // Call backend API (NO MetaMask!)
            const result = await registerPatient({
                dateOfBirth: formData.dateOfBirth,
                emergencyData: {
                    bloodGroup: formData.bloodGroup,
                    allergies: formData.allergies,
                    chronicConditions: formData.chronicConditions,
                    currentMedications: formData.currentMedications,
                    emergencyName: formData.emergencyName,
                    emergencyPhone: formData.emergencyPhone,
                },
            });

            setSuccess("Registration successful! Your data is now on the blockchain.");
            console.log("Transaction hash:", result.transactionHash);

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                router.push("/patient/records");
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

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Patient Registration
                    </h1>
                    <p className="text-lg text-gray-600">
                        Register your medical information on the blockchain
                    </p>

                    {/* Show user info */}
                    <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-600">Logged in as:</p>
                        <p className="font-semibold text-gray-900">{session.user?.email}</p>
                        {session.user?.walletAddress && (
                            <p className="text-xs text-gray-500 mt-1">
                                Wallet: {session.user.walletAddress.slice(0, 6)}...{session.user.walletAddress.slice(-4)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800">{success}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
                    <div className="space-y-6">
                        {/* Date of Birth */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 mr-2" />
                                Date of Birth *
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Blood Group */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <Heart className="w-4 h-4 mr-2" />
                                Blood Group *
                            </label>
                            <select
                                required
                                value={formData.bloodGroup}
                                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                        {/* Allergies */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Allergies
                            </label>
                            <textarea
                                value={formData.allergies}
                                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                                placeholder="List any allergies (e.g., Penicillin, Peanuts)"
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Chronic Conditions */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Chronic Conditions
                            </label>
                            <textarea
                                value={formData.chronicConditions}
                                onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                                placeholder="List any chronic conditions (e.g., Diabetes, Hypertension)"
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Current Medications */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Current Medications
                            </label>
                            <textarea
                                value={formData.currentMedications}
                                onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                                placeholder="List current medications"
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Emergency Contact */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 mr-2" />
                                        Contact Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.emergencyName}
                                        onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                                        placeholder="Emergency contact name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Contact Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.emergencyPhone}
                                        onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                                        placeholder="Emergency contact phone"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Registering on Blockchain...
                                    </>
                                ) : (
                                    "Register on Blockchain"
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                ✨ No MetaMask needed! Your wallet is managed securely by the backend.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
