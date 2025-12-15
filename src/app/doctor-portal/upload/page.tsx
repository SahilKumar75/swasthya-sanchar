"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Upload, FileText, Calendar, User, CheckCircle, AlertCircle, X } from "lucide-react";

interface Patient {
    id: string;
    name: string;
    email: string;
}

interface UploadedRecord {
    id: string;
    patientName: string;
    fileName: string;
    category: string;
    uploadedAt: string;
    description: string;
}

export default function DoctorUploadPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [uploadHistory, setUploadHistory] = useState<UploadedRecord[]>([]);
    const [selectedPatient, setSelectedPatient] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

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
            await loadPatients();
            await loadUploadHistory();

            const patientId = searchParams.get("patient");
            if (patientId) setSelectedPatient(patientId);
        }

        checkAuth();
    }, [session, status, router, searchParams]);



    async function loadPatients() {
        try {
            const response = await fetch("/api/doctor/patients?status=granted");
            const data = await response.json();
            setPatients(data.patients || []);
        } catch (error) {
            console.error("Error loading patients:", error);
        }
    }

    async function loadUploadHistory() {
        try {
            const response = await fetch("/api/doctor/upload/history");
            const data = await response.json();
            setUploadHistory(data.records || []);
        } catch (error) {
            console.error("Error loading upload history:", error);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError(t.portal.upload.fileSizeError);
            return;
        }

        setSelectedFile(file);
        setError("");
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPatient || !selectedFile || !category) {
            setError(t.portal.upload.fillAllFields);
            return;
        }

        try {
            setUploading(true);
            setError("");

            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("patientId", selectedPatient);
            formData.append("category", category);
            formData.append("description", description);

            const response = await fetch("/api/doctor/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            setSuccess(t.portal.upload.success);
            setSelectedFile(null);
            setCategory("");
            setDescription("");
            await loadUploadHistory();

            setTimeout(() => setSuccess(""), 3000);
        } catch (error: any) {
            setError(error.message || t.portal.upload.error);
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-neutral-400">{t.common.loading}</p>
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
                            <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                                {t.portal.upload.pageTitle}
                            </h1>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            {t.portal.upload.pageDescription}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Upload Form */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-6">
                                {t.portal.upload.uploadNew}
                            </h2>

                            {success && (
                                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    <p className="text-green-800 dark:text-green-200">{success}</p>
                                </div>
                            )}

                            {error && (
                                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    <p className="text-red-800 dark:text-red-200">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleUpload} className="space-y-4">
                                {/* Patient Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                        {t.portal.upload.selectPatient} <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={selectedPatient}
                                        onChange={(e) => setSelectedPatient(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                                    >
                                        <option value="">{t.portal.upload.selectPatient || "Choose a patient..."}</option>
                                        {patients.map(patient => (
                                            <option key={patient.id} value={patient.id}>
                                                {patient.name} ({patient.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                        {t.portal.upload.categoryLabel} <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                                    >
                                        <option value="">{t.portal.upload.categoryPlaceholder}</option>
                                        <option value="Lab Results">Lab Results</option>
                                        <option value="Imaging">Imaging (X-ray, MRI, CT)</option>
                                        <option value="Prescription">Prescription</option>
                                        <option value="Diagnosis">Diagnosis Report</option>
                                        <option value="Treatment Plan">Treatment Plan</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* File Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                        {t.portal.upload.uploadFileLabel} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </div>
                                    {selectedFile && (
                                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                                            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                        {t.portal.upload.supportedFormats}
                                    </p>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                        {t.portal.upload.descriptionLabel}
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        placeholder={t.portal.upload.descriptionPlaceholder}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={uploading || !selectedPatient || !selectedFile || !category}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    {uploading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            {t.portal.upload.uploading}
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5" />
                                            {t.portal.upload.uploadButton}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Upload History */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-6">
                                {t.portal.upload.recentUploads}
                            </h2>

                            <div className="space-y-4 max-h-[600px] overflow-y-auto">
                                {uploadHistory.length === 0 ? (
                                    <div className="text-center py-8">
                                        <FileText className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                                        <p className="text-neutral-600 dark:text-neutral-400">{t.portal.upload.noUploads}</p>
                                    </div>
                                ) : (
                                    uploadHistory.map(record => (
                                        <div
                                            key={record.id}
                                            className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition"
                                        >
                                            <div className="flex items-start gap-3">
                                                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-neutral-900 dark:text-neutral-50">
                                                        {record.fileName}
                                                    </h4>
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                                        {record.patientName} • {record.category}
                                                    </p>
                                                    {record.description && (
                                                        <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                                                            {record.description}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                                                        {new Date(record.uploadedAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
