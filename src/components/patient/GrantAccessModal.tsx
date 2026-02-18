
"use client";

import { useState } from "react";
import { Search, UserPlus, X, CheckCircle, AlertCircle, MapPin, Stethoscope } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Doctor {
    id: string;
    name: string;
    specialization: string;
    hospital: string;
    walletAddress: string;
}

interface GrantAccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGrantSuccess: () => void;
}

export function GrantAccessModal({ isOpen, onClose, onGrantSuccess }: GrantAccessModalProps) {
    const { t } = useLanguage();
    const [query, setQuery] = useState("");
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(false);
    const [granting, setGranting] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/patient/doctors-search?query=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                setDoctors([]);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to search doctors");
        } finally {
            setLoading(false);
        }
    };

    const handleGrant = async (doctor: Doctor) => {
        try {
            setGranting(doctor.id);
            setError("");

            const res = await fetch("/api/patient/grant-access", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ doctorAddress: doctor.walletAddress })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to grant access");

            setSuccess(`Access granted to Dr. ${doctor.name}`);
            setTimeout(() => {
                onGrantSuccess();
                onClose();
                setSuccess("");
                setDoctors([]);
                setQuery("");
            }, 1500);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setGranting(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                        Grant Access to Doctor
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg">
                        <X className="w-5 h-5 text-neutral-500" />
                    </button>
                </div>

                <div className="p-6 space-y-4 flex-1 overflow-hidden flex flex-col">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search by name, hospital, or specialty..."
                                className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </form>

                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {doctors.length === 0 && !loading && query && (
                            <p className="text-center text-neutral-500 py-4">No doctors found.</p>
                        )}

                        {doctors.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                                <div>
                                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-50">{doc.name}</h4>
                                    <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                        <div className="flex items-center gap-1">
                                            <Stethoscope className="w-3 h-3" />
                                            {doc.specialization}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {doc.hospital}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleGrant(doc)}
                                    disabled={granting === doc.id}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                                >
                                    {granting === doc.id ? "Granting..." : (
                                        <>
                                            <UserPlus className="w-4 h-4" /> Grant Access
                                        </>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
