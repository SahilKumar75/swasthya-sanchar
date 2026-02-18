
"use client";

import { useState } from "react";
import { Upload, X, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PatientUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess: () => void;
}

export function PatientUploadModal({ isOpen, onClose, onUploadSuccess }: PatientUploadModalProps) {
    const { t } = useLanguage();
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            if (selected.size > 10 * 1024 * 1024) {
                setError("File is too large (max 10MB)");
                return;
            }
            setFile(selected);
            setError("");
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !category) {
            setError("Please select a file and category");
            return;
        }

        try {
            setUploading(true);
            setError("");

            const formData = new FormData();
            formData.append("file", file);
            formData.append("category", category);
            formData.append("description", description);

            const res = await fetch("/api/patient/upload", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Upload failed");
            }

            setSuccess("Document uploaded successfully!");
            setTimeout(() => {
                onUploadSuccess();
                onClose();
                setFile(null);
                setCategory("");
                setDescription("");
                setSuccess("");
            }, 1500);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                        Upload Medical Record
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg">
                        <X className="w-5 h-5 text-neutral-500" />
                    </button>
                </div>

                <form onSubmit={handleUpload} className="p-6 space-y-4">
                    {success && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Select File <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.jpg,.png,.doc,.docx"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-neutral-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100 dark:file:bg-neutral-700 dark:file:text-neutral-300"
                        />
                        {file && <p className="text-xs text-neutral-500 mt-1">{file.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                        >
                            <option value="">Select Category</option>
                            <option value="Lab Report">Lab Report</option>
                            <option value="Prescription">Prescription</option>
                            <option value="Scan/X-Ray">Scan/X-Ray</option>
                            <option value="Discharge Summary">Discharge Summary</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                            placeholder="Add brief details..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {uploading ? "Uploading..." : (
                            <>
                                <Upload className="w-4 h-4" /> Upload Document
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
