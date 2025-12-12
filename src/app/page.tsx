"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FeatureShowcase } from "@/components/landing/FeatureShowcase";
import { Navbar } from "@/components/Navbar";
import { FooterSection } from "@/components/ui/footer-section";
import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
} from "@/components/ui/expandable-screen";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [checking, setChecking] = useState(true);

  // Auth form states for login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Auth form states for signup
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupRole, setSignupRole] = useState<"patient" | "doctor">("patient");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (result?.error) {
        setLoginError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setLoginError("An error occurred. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }

    if (signupPassword.length < 8) {
      setSignupError("Password must be at least 8 characters");
      return;
    }

    setSignupLoading(true);

    try {
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail, password: signupPassword, role: signupRole }),
      });

      const data = await signupRes.json();

      if (!signupRes.ok) {
        setSignupError(data.error || "Failed to create account");
        setSignupLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email: signupEmail,
        password: signupPassword,
        redirect: false,
      });

      if (result?.error) {
        setSignupError("Account created but failed to sign in. Please try logging in.");
        setSignupLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setSignupError("An error occurred. Please try again.");
      setSignupLoading(false);
    }
  };

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
        console.log("[AUTH CHECK] ✅ Redirecting patient to /patient-portal");
        router.push("/patient-portal");
      } else if (userRole === "doctor") {
        console.log("[AUTH CHECK] ✅ Redirecting doctor to /doctor/home");
        router.push("/doctor/home");
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
      <Navbar />
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

            {/* CTA Buttons with Expandable Screens */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {/* Login Expandable Screen */}
              <ExpandableScreen
                layoutId="login-card"
                triggerRadius="8px"
                contentRadius="0px"
                animationDuration={0.5}
              >
                <div>
                  <ExpandableScreenTrigger>
                    <button className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors duration-200">
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
                    </button>
                  </ExpandableScreenTrigger>

                  <ExpandableScreenContent className="bg-neutral-900 dark:bg-neutral-950">
                    <div className="min-h-screen flex items-center justify-center px-4 py-12">
                      <div className="w-full max-w-2xl">
                        <div className="text-center mb-12">
                          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Welcome Back
                          </h2>
                          <p className="text-lg text-neutral-400">
                            Sign in to access your medical records
                          </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                          <div>
                            <label htmlFor="login-email" className="block text-sm font-medium text-neutral-300 mb-2 uppercase tracking-wide">
                              Email *
                            </label>
                            <input
                              id="login-email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border-0 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                              placeholder=""
                            />
                          </div>

                          <div>
                            <label htmlFor="login-password" className="block text-sm font-medium text-neutral-300 mb-2 uppercase tracking-wide">
                              Password *
                            </label>
                            <input
                              id="login-password"
                              name="password"
                              type="password"
                              autoComplete="current-password"
                              required
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border-0 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                              placeholder=""
                            />
                          </div>

                          {loginError && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                              {loginError}
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full py-4 px-6 bg-white hover:bg-neutral-100 text-neutral-900 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
                          >
                            {loginLoading ? "Signing in..." : "Sign in"}
                          </button>

                          <div className="text-center text-sm text-neutral-400 pt-4">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/signup" className="text-white hover:underline font-medium">
                              Create one
                            </Link>
                          </div>
                        </form>
                      </div>
                    </div>
                  </ExpandableScreenContent>
                </div>
              </ExpandableScreen>

              {/* Signup Expandable Screen */}
              <ExpandableScreen
                layoutId="signup-card"
                triggerRadius="8px"
                contentRadius="0px"
                animationDuration={0.5}
              >
                <div>
                  <ExpandableScreenTrigger>
                    <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-200">
                      Create Account
                    </button>
                  </ExpandableScreenTrigger>

                  <ExpandableScreenContent className="bg-neutral-900 dark:bg-neutral-950">
                    <div className="min-h-screen flex items-center justify-center px-4 py-12">
                      <div className="w-full max-w-2xl">
                        <div className="text-center mb-12">
                          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Join Swasthya Sanchar
                          </h2>
                          <p className="text-lg text-neutral-400">
                            Create your account and take control of your health data
                          </p>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-6">
                          <div>
                            <label htmlFor="signup-email" className="block text-sm font-medium text-neutral-300 mb-2 uppercase tracking-wide">
                              Email *
                            </label>
                            <input
                              id="signup-email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              value={signupEmail}
                              onChange={(e) => setSignupEmail(e.target.value)}
                              className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border-0 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                              placeholder=""
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="signup-password" className="block text-sm font-medium text-neutral-300 mb-2 uppercase tracking-wide">
                                Password *
                              </label>
                              <input
                                id="signup-password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={signupPassword}
                                onChange={(e) => setSignupPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border-0 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                                placeholder=""
                              />
                              <p className="mt-2 text-xs text-neutral-500">
                                Must be at least 8 characters
                              </p>
                            </div>

                            <div>
                              <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-neutral-300 mb-2 uppercase tracking-wide">
                                Confirm Password *
                              </label>
                              <input
                                id="signup-confirm-password"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={signupConfirmPassword}
                                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border-0 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                                placeholder=""
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-3 uppercase tracking-wide">
                              Account Type *
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                              <button
                                type="button"
                                onClick={() => setSignupRole("patient")}
                                className={`px-6 py-4 rounded-lg border-2 transition-all font-medium ${signupRole === "patient"
                                  ? "border-white bg-white/10 text-white"
                                  : "border-neutral-700 text-neutral-400 hover:border-neutral-600"
                                  }`}
                              >
                                Patient
                              </button>
                              <button
                                type="button"
                                onClick={() => setSignupRole("doctor")}
                                className={`px-6 py-4 rounded-lg border-2 transition-all font-medium ${signupRole === "doctor"
                                  ? "border-white bg-white/10 text-white"
                                  : "border-neutral-700 text-neutral-400 hover:border-neutral-600"
                                  }`}
                              >
                                Doctor
                              </button>
                            </div>
                          </div>

                          {signupError && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                              {signupError}
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={signupLoading}
                            className="w-full py-4 px-6 bg-white hover:bg-neutral-100 text-neutral-900 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
                          >
                            {signupLoading ? "Creating account..." : "Create account"}
                          </button>

                          <div className="text-center text-sm text-neutral-400 pt-4">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-white hover:underline font-medium">
                              Sign in
                            </Link>
                          </div>
                        </form>
                      </div>
                    </div>
                  </ExpandableScreenContent>
                </div>
              </ExpandableScreen>
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
                href="/patient-portal"
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

      {/* Footer */}
      <FooterSection />
    </main>
  );
}
