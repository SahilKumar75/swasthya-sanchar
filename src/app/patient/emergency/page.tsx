"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Navbar } from "@/components/Navbar";
import { CardFlip, CardFlipFront, CardFlipBack } from "@/components/ui/card-flip";
import {
    ArrowLeft, Download, Printer, Share2, AlertCircle, Shield,
    Heart, QrCode, CheckCircle, Info
} from "lucide-react";

export default function PatientEmergencyQR() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [walletAddress, setWalletAddress] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const qrRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function loadWalletAddress() {
            // Development bypass - skip auth checks if enabled
            if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') {
                console.log('[DEV BYPASS] 🔓 Emergency page - auth bypass enabled');
                // Use mock wallet address for development
                setWalletAddress('0x1234567890abcdef1234567890abcdef12345678');
                setLoading(false);
                return;
            }

            if (status === "loading") return;

            if (status === "unauthenticated" || !session?.user) {
                router.push("/auth/login");
                return;
            }

            if (session.user.role !== "patient") {
                router.push(session.user.role === "doctor" ? "/doctor/home" : "/patient-home");
                return;
            }

            // Fetch wallet address from database
            try {
                const response = await fetch("/api/user/wallet");
                if (response.ok) {
                    const data = await response.json();
                    setWalletAddress(data.walletAddress);
                } else {
                    console.error("Failed to fetch wallet address");
                }
            } catch (error) {
                console.error("Error fetching wallet address:", error);
            }

            setLoading(false);
        }

        loadWalletAddress();
    }, [session, status, router]);

    const emergencyUrl = walletAddress
        ? `${window.location.origin}/emergency/${walletAddress}`
        : "";

    const downloadQR = () => {
        if (!qrRef.current) return;

        const svg = qrRef.current.querySelector('svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");

            const downloadLink = document.createElement("a");
            downloadLink.download = "emergency-qr-code.png";
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    const printQR = () => {
        window.print();
    };

    const shareQR = async () => {
        if (navigator.share && emergencyUrl) {
            try {
                await navigator.share({
                    title: "My Emergency Medical QR Code",
                    text: "Scan this QR code to access my emergency medical information",
                    url: emergencyUrl,
                });
            } catch (error) {
                console.log("Share failed:", error);
            }
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-neutral-100 mx-auto mb-4"></div>
                    <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!walletAddress && !loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-neutral-900">
                <Navbar />
                <main className="max-w-5xl mx-auto px-6 lg:px-8 py-12 pt-24">
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-8 text-center">
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                            No Wallet Found
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            Your account doesn't have a wallet address yet. Please complete patient registration first.
                        </p>
                        <Link
                            href="/patient/register"
                            className="px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition inline-block"
                        >
                            Go to Registration
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 lg:px-8 py-12 pt-24">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/patient-home"
                        className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-4 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <div>
                        <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                            Emergency QR Code
                        </h1>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400">
                            Life-saving information, accessible in seconds
                        </p>
                    </div>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* QR Code Display - Flip Card */}
                    <CardFlip height="700px">
                        <CardFlipFront className="bg-white dark:bg-neutral-800 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 p-8">
                            <div className="h-full flex flex-col">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                                        Your Emergency QR Code
                                    </h2>
                                </div>

                                {/* QR Code */}
                                <div
                                    ref={qrRef}
                                    className="bg-white p-8 rounded-lg border-4 border-neutral-900 dark:border-neutral-100 mb-6 flex items-center justify-center print:border-8 flex-1"
                                >
                                    <QRCodeSVG
                                        value={emergencyUrl}
                                        size={320}
                                        level="H"
                                        includeMargin={true}
                                        className="w-full h-auto max-w-[320px]"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-3 print:hidden">
                                    <button
                                        onClick={downloadQR}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                    <button
                                        onClick={printQR}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition font-medium"
                                    >
                                        <Printer className="w-4 h-4" />
                                        Print
                                    </button>
                                    {typeof navigator !== 'undefined' && 'share' in navigator && (
                                        <button
                                            onClick={shareQR}
                                            className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                                        >
                                            <Share2 className="w-4 h-4" />
                                            Share QR Code
                                        </button>
                                    )}
                                </div>
                            </div>
                        </CardFlipFront>

                        {/* Back - Blockchain Info */}
                        <CardFlipBack className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 p-8">
                            <div className="h-full flex flex-col">
                                <div className="text-center mb-6">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl w-fit mx-auto mb-3">
                                        <Info className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                                        QR Code Details
                                    </h2>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        Technical information
                                    </p>
                                </div>

                                <div className="flex-1 space-y-4 overflow-y-auto">
                                    {/* Blockchain Address */}
                                    <div className="bg-white/50 dark:bg-neutral-900/50 rounded-lg p-4">
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mb-1 font-semibold">
                                            Blockchain Address
                                        </p>
                                        <p className="text-xs font-mono text-blue-900 dark:text-blue-100 break-all">
                                            {walletAddress}
                                        </p>
                                    </div>

                                    {/* Emergency URL */}
                                    <div className="bg-white/50 dark:bg-neutral-900/50 rounded-lg p-4">
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mb-1 font-semibold">
                                            Emergency Page URL
                                        </p>
                                        <p className="text-xs font-mono text-blue-900 dark:text-blue-100 break-all">
                                            {emergencyUrl}
                                        </p>
                                    </div>

                                    {/* Security Info */}
                                    <div className="bg-white/50 dark:bg-neutral-900/50 rounded-lg p-4">
                                        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                            🔒 Security Features
                                        </h3>
                                        <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
                                            <li>• Blockchain-secured data</li>
                                            <li>• No wallet required to scan</li>
                                            <li>• Instant access for responders</li>
                                            <li>• Tamper-proof records</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                                    <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                                        Hover to flip back
                                    </p>
                                </div>
                            </div>
                        </CardFlipBack>
                    </CardFlip>

                    {/* First Responder View Preview */}
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-lg overflow-hidden" style={{ height: '700px' }}>
                        <div className="h-full flex flex-col">
                            {/* Header */}
                            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                                        First Responder View
                                    </h2>
                                </div>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Emergency medical information preview
                                </p>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {/* Patient Info */}
                                <div className="flex items-center gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-700">
                                    <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 font-bold text-xl flex-shrink-0">
                                        JD
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                                            John Doe
                                        </h3>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                            Patient ID: #12345
                                        </p>
                                    </div>
                                </div>

                                {/* Medical Information List */}
                                <div className="py-6 space-y-5">
                                    {/* Blood Type */}
                                    <div className="flex items-baseline gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                                        <dt className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide w-32 flex-shrink-0">
                                            Blood Type
                                        </dt>
                                        <dd className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                                            O+
                                        </dd>
                                    </div>

                                    {/* Allergies */}
                                    <div className="flex gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                                        <dt className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide w-32 flex-shrink-0">
                                            Allergies
                                        </dt>
                                        <dd className="flex-1">
                                            <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
                                                <li>Penicillin</li>
                                                <li>Peanuts</li>
                                            </ul>
                                        </dd>
                                    </div>

                                    {/* Medications */}
                                    <div className="flex gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                                        <dt className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide w-32 flex-shrink-0">
                                            Medications
                                        </dt>
                                        <dd className="flex-1">
                                            <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
                                                <li>Aspirin 75mg daily</li>
                                                <li>Vitamin D 1000 IU</li>
                                            </ul>
                                        </dd>
                                    </div>

                                    {/* Conditions */}
                                    <div className="flex gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                                        <dt className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide w-32 flex-shrink-0">
                                            Conditions
                                        </dt>
                                        <dd className="flex-1">
                                            <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
                                                <li>Hypothyroidism</li>
                                            </ul>
                                        </dd>
                                    </div>

                                    {/* Emergency Contact */}
                                    <div className="flex gap-3">
                                        <dt className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide w-32 flex-shrink-0">
                                            Emergency Contact
                                        </dt>
                                        <dd className="flex-1">
                                            <div className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
                                                <p><span className="font-semibold">Name:</span> Jane Doe</p>
                                                <p><span className="font-semibold">Relation:</span> Spouse</p>
                                                <p><span className="font-semibold">Phone:</span> +1 (555) 123-4567</p>
                                            </div>
                                        </dd>
                                    </div>
                                </div>
                            </div>

                            {/* Emergency Helpline - Footer Strip */}
                            <div className="bg-red-600 dark:bg-red-700 px-6 py-4">
                                <p className="text-sm text-white font-bold text-center">
                                    Emergency Helpline: <a href="tel:108" className="underline hover:text-red-100">108</a> (Ambulance) • <a href="tel:102" className="underline hover:text-red-100">102</a> (Medical)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Test QR Code Button */}
                    <div className="lg:col-span-2">
                        <a
                            href={emergencyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition font-medium text-center"
                        >
                            Test Emergency Page →
                        </a>
                    </div>
                </div>

                {/* Footer Information Section */}
                <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* How to Use */}
                        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                                    How to Use
                                </h3>
                            </div>
                            <ol className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                                <li className="flex gap-2">
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">1.</span>
                                    <span>Download or print your QR code</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">2.</span>
                                    <span>Keep it in your wallet or phone case</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">3.</span>
                                    <span>Responders scan to access your info</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">4.</span>
                                    <span>No wallet or crypto knowledge needed</span>
                                </li>
                            </ol>
                        </div>

                        {/* What Information is Shared */}
                        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                                    Information Shared
                                </h3>
                            </div>
                            <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                    <span>Blood Type</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                    <span>Allergies</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                    <span>Current Medications</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                    <span>Medical Conditions</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                    <span>Emergency Contact</span>
                                </li>
                            </ul>
                        </div>

                        {/* Best Practices */}
                        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                    <QrCode className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                                    Best Practices
                                </h3>
                            </div>
                            <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                                    <span>Print on waterproof paper</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                                    <span>Keep multiple copies</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                                    <span>Update if info changes</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                                    <span>Share with family members</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                                    <span>Add to phone lock screen</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div >

                {/* Print Styles */}
                < style jsx global > {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print\\:border-8,
            .print\\:border-8 * {
              visibility: visible;
            }
            .print\\:border-8 {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
          }
        `}</style >
            </main >
        </div >
    );
}
