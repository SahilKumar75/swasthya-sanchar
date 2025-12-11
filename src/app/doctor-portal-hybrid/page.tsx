"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { uploadMedicalRecord, getPatientRecords } from "@/lib/api-client";
import { Navbar } from "@/components/Navbar";
import { Upload, FileText, Loader2, CheckCircle } from "lucide-react";

export default function HybridDoctorPortal() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [patientAddress, setPatientAddress] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

    if (!session || session.user?.role !== "doctor") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600">Access denied. Doctors only.</p>
            </div>
        );
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !patientAddress) {
            setError("Please select a file and enter patient address");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // Upload via backend API (NO MetaMask!)
            const result = await uploadMedicalRecord(selectedFile, patientAddress);

            setSuccess(`Record uploaded successfully! IPFS Hash: ${result.ipfsHash}`);
            setSelectedFile(null);
            setPatientAddress("");

            // Reset file input
            const fileInput = document.getElementById("file-input") as HTMLInputElement;
            if (fileInput) fileInput.value = "";
        } catch (err: any) {
            setError(err.message || "Failed to upload record");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Doctor Portal
                    </h1>
                    <p className="text-lg text-gray-600">
                        Upload medical records to the blockchain
                    </p>

                    {/* Show doctor info */}
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
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                        <p className="text-green-800">{success}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Upload Form */}
                <form onSubmit={handleUpload} className="bg-white rounded-xl shadow-lg p-8">
                    <div className="space-y-6">
                        {/* Patient Address */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Patient Wallet Address *
                            </label>
                            <input
                                type="text"
                                required
                                value={patientAddress}
                                onChange={(e) => setPatientAddress(e.target.value)}
                                placeholder="0x..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Enter the patient's blockchain wallet address
                            </p>
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <FileText className="w-4 h-4 mr-2" />
                                Medical Record File *
                            </label>
                            <input
                                id="file-input"
                                type="file"
                                required
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                accept=".pdf,.jpg,.jpeg,.png,.dcm"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Supported formats: PDF, JPG, PNG, DICOM
                            </p>
                        </div>

                        {/* Selected File Info */}
                        {selectedFile && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">Selected:</span> {selectedFile.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Uploading to IPFS & Blockchain...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5 mr-2" />
                                        Upload Medical Record
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                ✨ No MetaMask needed! Backend handles blockchain transactions.
                            </p>
                        </div>
                    </div>
                </form>

                {/* Info Box */}
                <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
                    <ul className="text-sm text-blue-800 space-y-2">
                        <li>• File is uploaded to IPFS (decentralized storage)</li>
                        <li>• IPFS hash is stored on blockchain</li>
                        <li>• Patient can access record anytime</li>
                        <li>• All transactions signed by backend (no MetaMask!)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
