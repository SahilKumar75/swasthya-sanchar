"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FeatureShowcase } from "@/components/landing/FeatureShowcase";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuthAndRedirect() {
      console.log("[AUTH CHECK] Starting authentication check...");
      console.log("[AUTH CHECK] Session status:", status);
      console.log("[AUTH CHECK] Session data:", session);
      
      if (status === "loading") {
        console.log("[AUTH CHECK] Still loading session...");
        return;
      }

      if (status === "unauthenticated" || !session?.user) {
        console.log("[AUTH CHECK] No active session - staying on landing page");
        setChecking(false);
        return;
      }

      // User is authenticated, redirect based on role
      const userRole = session.user.role;
      console.log("[AUTH CHECK] User authenticated with role:", userRole);

      if (userRole === "patient") {
        console.log("[AUTH CHECK] ✅ Redirecting patient to /patient");
        router.push("/patient");
      } else if (userRole === "doctor") {
        console.log("[AUTH CHECK] ✅ Redirecting doctor to /doctor");
        router.push("/doctor");
      } else {
        console.log("[AUTH CHECK] ⚠️ Unknown role, staying on landing page");
        setChecking(false);
      }
    }

    checkAuthAndRedirect();
  }, [session, status, router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-neutral-100 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-24 md:py-32">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Blockchain Healthcare Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Medical Records That Save Lives
            </h1>

            <p className="max-w-2xl text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Swasthya Sanchar puts you in control of your health data. Access your medical records anywhere, 
              share with doctors securely, and enable first responders to save your life in emergencies.
            </p>

            {/* Problem Statement */}
            <div className="max-w-2xl p-5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">The Problem:</span> In medical emergencies, 
                first responders often can't access critical information like blood type, allergies, 
                or current medications—wasting precious seconds that could mean life or death.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link
                href="/auth/login"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors duration-200"
              >
                Sign In
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-200"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-20 md:py-28 border-b border-neutral-200 dark:border-neutral-800">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
            Four simple steps from registration to life-saving emergency access. 
            See how blockchain technology empowers you and protects your privacy.
          </p>
        </div>
        
        <FeatureShowcase />
      </div>
      {/* Key Benefits Section */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-20 md:py-28 border-b border-neutral-200 dark:border-neutral-800">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            Why Blockchain for Healthcare?
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Traditional systems fail when you need them most. Here's what makes us different.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {/* Benefit Cards */}
          <div className="group p-6 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors duration-200">
            <div className="text-2xl mb-3">🔐</div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2">You Own Your Data</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">No hospital, no government, no corporation owns your health records. Only you control who sees what.</p>
          </div>

          <div className="group p-6 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors duration-200">
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2">Emergency Ready</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">QR code on your ID gives first responders instant access to life-saving info—no wallet or login needed.</p>
          </div>

          <div className="group p-6 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors duration-200">
            <div className="text-2xl mb-3">🔗</div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2">Permanent & Portable</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">Your records live on the blockchain forever. Change hospitals? Your history follows you automatically.</p>
          </div>

          <div className="group p-6 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors duration-200">
            <div className="text-2xl mb-3">✅</div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2">Consent-Based Sharing</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">Authorize specific doctors to view your records. Revoke access anytime. Every access is logged transparently.</p>
          </div>

          <div className="group p-6 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors duration-200">
            <div className="text-2xl mb-3">🌍</div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2">Global Access</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">Travel abroad? Your medical history is accessible worldwide, cutting through language and system barriers.</p>
          </div>

          <div className="group p-6 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors duration-200">
            <div className="text-2xl mb-3">🛡️</div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2">Tamper-Proof</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">Blockchain ensures your records can't be altered or deleted. Complete audit trail of every interaction.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-6 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <div className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
              100%
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 font-medium text-sm">Patient Owned</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">Complete control over your health data</p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <div className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
              24/7
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 font-medium text-sm">Emergency Access</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">First responders access critical info instantly</p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <div className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
              0
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 font-medium text-sm">Crypto Knowledge</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">Emergency QR works for anyone, anywhere</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-20 md:py-28">
        <div className="p-12 md:p-16 rounded-lg bg-neutral-900 dark:bg-neutral-800 border border-neutral-800 dark:border-neutral-700">
          <div className="space-y-6 max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-50">
              Ready to Take Control?
            </h2>
            <p className="text-lg text-neutral-300 dark:text-neutral-400">
              Join the future of healthcare where you own your records and technology saves lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link
                href="/patient"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-50 text-neutral-900 font-medium rounded-lg hover:bg-neutral-100 transition-colors duration-200"
              >
                Get Started Now
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                href="/emergency-qr"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-neutral-50 font-medium rounded-lg border border-neutral-700 hover:bg-neutral-800 transition-colors duration-200"
              >
                View Demo QR
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
