"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Navbar } from "@/components/Navbar";
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
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                            <Heart className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">
                                Emergency QR Code
                            </h1>
                            <p className="text-lg text-neutral-600 dark:text-neutral-400">
                                Life-saving information, accessible in seconds
                            </p>
                        </div>
                    </div>
                </div>

                {/* Alert Banner */}
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
                    <div className="flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                                Emergency Access - No Wallet Required
                            </h3>
                            <p className="text-red-800 dark:text-red-200 text-sm">
                                This QR code allows first responders to access your critical medical information
                                instantly, without needing a crypto wallet or any technical knowledge.
                                Your life-saving data is always accessible when it matters most.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* QR Code Display */}
                    <div className="bg-white dark:bg-neutral-800 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 p-8">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full mb-4">
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                    QR Code Ready
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                                Your Emergency QR Code
                            </h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Scan to access emergency medical information
                            </p>
                        </div>

                        {/* QR Code */}
                        <div
                            ref={qrRef}
                            className="bg-white p-8 rounded-lg border-4 border-neutral-900 dark:border-neutral-100 mb-6 flex items-center justify-center print:border-8"
                        >
                            <QRCodeSVG
                                value={emergencyUrl}
                                size={256}
                                level="H"
                                includeMargin={true}
                                className="w-full h-auto max-w-[256px]"
                            />
                        </div>

                        {/* Blockchain Address */}
                        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4 mb-6">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                                Blockchain Address
                            </p>
                            <p className="text-sm font-mono text-neutral-900 dark:text-neutral-100 break-all">
                                {walletAddress}
                            </p>
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

                    {/* Instructions */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                                    How to Use
                                </h3>
                            </div>
                            <ol className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                                <li className="flex gap-3">
                                    <span className="font-bold">1.</span>
                                    <span>Download or print your QR code</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold">2.</span>
                                    <span>Keep it in your wallet, phone case, or medical ID bracelet</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold">3.</span>
                                    <span>In an emergency, responders can scan it to access your medical info</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold">4.</span>
                                    <span>No wallet or crypto knowledge required for scanning</span>
                                </li>
                            </ol>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                                    What Information is Shared?
                                </h3>
                            </div>
                            <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    <span>Blood Type</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    <span>Allergies</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    <span>Current Medications</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    <span>Medical Conditions</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    <span>Emergency Contact</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                                    <QrCode className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                                    Best Practices
                                </h3>
                            </div>
                            <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                                <li>• Print on waterproof paper for durability</li>
                                <li>• Keep multiple copies in different locations</li>
                                <li>• Update your profile if medical info changes</li>
                                <li>• Share the QR with family members</li>
                                <li>• Consider adding to phone lock screen</li>
                            </ul>
                        </div>

                        {/* Test QR Code */}
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

                {/* Print Styles */}
                <style jsx global>{`
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
        `}</style>
            </main>
        </div>
    );
}
