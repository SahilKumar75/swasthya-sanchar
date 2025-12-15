"use client";

import { Navbar } from "@/components/Navbar";
import { useSession } from "next-auth/react";
import {
    HelpCircle, MessageCircle, FileQuestion, AlertCircle
} from "lucide-react";

export default function HelpSupportPage() {
    const { data: session } = useSession();

    const faqItems = [
        {
            question: "How do I access my medical records?",
            answer: "Navigate to the Medical Records section from your patient portal. You can view, download, and share your records securely."
        },
        {
            question: "How does the emergency QR code work?",
            answer: "Your emergency QR code contains your critical medical information. First responders can scan it to access your blood type, allergies, medications, and emergency contacts instantly."
        },
        {
            question: "How do I grant access to a doctor?",
            answer: "Go to Doctor Access in your patient portal, enter the doctor's email address, and click Grant Access. You can revoke access at any time."
        },
        {
            question: "Is my medical data secure?",
            answer: "Yes! Your data is encrypted and stored securely. We use industry-standard security practices to protect your information."
        },
        {
            question: "Can I update my emergency information?",
            answer: "Yes, you can update your emergency information anytime from your patient portal settings."
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 pt-24">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                        <HelpCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-5xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
                        Help & Support
                    </h1>
                    <p className="text-xl text-neutral-600 dark:text-neutral-400">
                        We're here to help you get the most out of Swasthya Sanchar
                    </p>
                </div>

                {/* Contact Section - Team Members */}
                <div id="contact">
                    <h2 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4 text-center">
                        Contact These Idiots
                    </h2>
                    <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-14 text-center">
                        They made this website
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                        {/* Sahil Kumar Singh */}
                        <div className="bg-white dark:bg-neutral-800 rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-2xl hover:scale-105 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 group">
                            <div className="aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                                <img
                                    src="/sahil-kumar-singh.jpg"
                                    alt="Sahil Kumar Singh"
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-50 mb-2">
                                    Sahil Kumar Singh
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                                    Full Stack Developer
                                </p>
                                <a
                                    href="mailto:sahil@example.com"
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold inline-flex items-center gap-1"
                                >
                                    Contact →
                                </a>
                            </div>
                        </div>

                        {/* Shivam Rana */}
                        <div className="bg-white dark:bg-neutral-800 rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-2xl hover:scale-105 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 group">
                            <div className="aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                                <img
                                    src="/shivam-rana.jpg"
                                    alt="Shivam Rana"
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-50 mb-2">
                                    Shivam Rana
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                                    Blockchain Developer
                                </p>
                                <a
                                    href="mailto:shivam@example.com"
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold inline-flex items-center gap-1"
                                >
                                    Contact →
                                </a>
                            </div>
                        </div>

                        {/* Siddhant Tiwari */}
                        <div className="bg-white dark:bg-neutral-800 rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-2xl hover:scale-105 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 group">
                            <div className="aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                                <img
                                    src="/siddhant-tiwari.jpg"
                                    alt="Siddhant Tiwari"
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-50 mb-2">
                                    Siddhant Tiwari
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                                    UI/UX Designer
                                </p>
                                <a
                                    href="mailto:siddhant@example.com"
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold inline-flex items-center gap-1"
                                >
                                    Contact →
                                </a>
                            </div>
                        </div>

                        {/* Akshit Thakur */}
                        <div className="bg-white dark:bg-neutral-800 rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-2xl hover:scale-105 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 group">
                            <div className="aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                                <img
                                    src="/akshit-thakur.jpg"
                                    alt="Akshit Thakur"
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-50 mb-2">
                                    Akshit Thakur
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                                    Backend Developer
                                </p>
                                <a
                                    href="mailto:akshit@example.com"
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold inline-flex items-center gap-1"
                                >
                                    Contact →
                                </a>
                            </div>
                        </div>

                        {/* Nancy */}
                        <div className="bg-white dark:bg-neutral-800 rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-2xl hover:scale-105 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 group">
                            <div className="aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                                <img
                                    src="/nancy.jpg"
                                    alt="Nancy"
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-50 mb-2">
                                    Nancy
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                                    Project Manager
                                </p>
                                <a
                                    href="mailto:nancy@example.com"
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold inline-flex items-center gap-1"
                                >
                                    Contact →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
