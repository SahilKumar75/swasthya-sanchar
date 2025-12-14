"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FeatureShowcase } from "@/components/landing/FeatureShowcase";
import { Navbar } from "@/components/Navbar";
import { FooterSection } from "@/components/ui/footer-section";
import { Lock, Zap, Link as LinkIcon, CheckCircle, Globe, Shield } from "lucide-react";
import { TeamMemberCard } from "@/components/landing/TeamMemberCard";
import { AuthenticationLayout, GlassInputWrapper } from "@/components/ui/sign-in";
import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
} from "@/components/ui/expandable-screen";
import { BlockchainFeatureSection } from "@/components/ui/accordion-feature-section";
import { Timeline } from "@/components/ui/timeline";
import { MatrixText } from "@/components/ui/matrix-text";

const howItWorksData = [
  {
    title: "1. Create Account",
    content: (
      <p>
        Sign up securely using your email. We verify your identity to ensure a trusted network of patients and healthcare providers.
      </p>
    ),
  },
  {
    title: "2. Add Medical History",
    content: (
      <p>
        Upload your existing records, allergies, and medications. Your data is encrypted and stored on the blockchain, owned only by you.
      </p>
    ),
  },
  {
    title: "3. Get Your QR Code",
    content: (
      <p>
        Receive a unique QR code linked to your profile. This is your key to quick, secure sharing of vital information.
      </p>
    ),
  },
  {
    title: "4. Emergency Access",
    content: (
      <p>
        In an emergency, first responders scan your QR code to instantly access critical life-saving data like blood type and allergies.
      </p>
    ),
  },
];

const blockchainFeatures = [
  {
    id: 1,
    title: "You Own Your Data",
    description: "No hospital, no government, no corporation owns your health records. Only you control who sees what with your private keys.",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2232&auto=format&fit=crop", // Blockchain/Lock concept
  },
  {
    id: 2,
    title: "Emergency Ready",
    description: "QR code on your ID gives first responders instant access to life-saving info like allergies and blood type—no wallet or login needed.",
    image: "https://images.unsplash.com/photo-1516574187841-693083f0498c?q=80&w=2370&auto=format&fit=crop", // Ambulance/Emergency
  },
  {
    id: 3,
    title: "Permanent & Portable",
    description: "Your records live on the blockchain forever. Change hospitals? Move cities? Your history follows you automatically without faxing papers.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop", // Connectivity/Portability
  },
  {
    id: 4,
    title: "Consent Based Sharing",
    description: "Authorize specific doctors to view your records for a limited time. Revoke access anytime. Every access is logged transparently.",
    image: "https://images.unsplash.com/photo-1576091160550-217358c7db81?q=80&w=2070&auto=format&fit=crop", // Doctor/Tablet consent
  },
  {
    id: 5,
    title: "Global Access",
    description: "Travel abroad? Your medical history is accessible worldwide, cutting through language and system barriers.",
    image: "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?q=80&w=2070&auto=format&fit=crop", // Map/Global
  },
  {
    id: 6,
    title: "Tamper-Proof",
    description: "Blockchain ensures your records can't be altered or deleted by malicious actors. Complete audit trail of every interaction.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", // Security/Tech
  },
];

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [checking, setChecking] = useState(true);

  /* State for text animation */
  const [index, setIndex] = useState(0);

  /* State for Auth Modals */
  const [activeModal, setActiveModal] = useState<"login" | "signup" | null>(null);

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

      // Development bypass - skip auth checks if enabled
      if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') {
        console.log("[AUTH CHECK] 🔓 Development bypass enabled - skipping auth");
        setChecking(false);
        return;
      }

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
            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <MatrixText className="text-neutral-900 dark:text-neutral-50">Your Health Identity,</MatrixText>
              <br />
              <MatrixText className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Decentralized & Secure.</MatrixText>
            </h1>

            <p className="max-w-2xl text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
              Empowering you with complete ownership of your medical history. Instant emergency access for first responders, seamless sharing for doctors, and privacy by design.
            </p>


            {/* CTA Buttons with Expandable Screens */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {/* Login Expandable Screen */}
              <ExpandableScreen
                layoutId="login-card"
                triggerRadius="8px"
                contentRadius="0px"
                animationDuration={0.5}
                expanded={activeModal === "login"}
                onExpandChange={(expanded) => setActiveModal(expanded ? "login" : null)}
              >
                <div>
                  <ExpandableScreenTrigger>
                    <button
                      onClick={() => setActiveModal("login")}
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
                    </button>
                  </ExpandableScreenTrigger>

                  <ExpandableScreenContent className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="h-full w-full overflow-y-auto">
                      <div className="min-h-screen">
                        <AuthenticationLayout
                          title="Welcome Back"
                          description="Sign in to access your secure medical records."
                          heroImageSrc="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop"
                          testimonials={[
                            {
                              avatarSrc: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
                              name: "Dr. Sarah Chen",
                              handle: "@drchen_md",
                              text: "Swasthya Sanchar has revolutionized how I access patient history in emergencies."
                            },
                            {
                              avatarSrc: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
                              name: "Marcus Johnson",
                              handle: "@marcus_j",
                              text: "I feel so much safer knowing my medical data is accessible to paramedics instantly."
                            }
                          ]}
                        >
                          <form onSubmit={handleLogin} className="space-y-5 animate-element animate-delay-300">
                            <div>
                              <label htmlFor="login-email" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                                Email Address
                              </label>
                              <GlassInputWrapper>
                                <input
                                  id="login-email"
                                  name="email"
                                  type="email"
                                  autoComplete="email"
                                  required
                                  value={loginEmail}
                                  onChange={(e) => setLoginEmail(e.target.value)}
                                  className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
                                  placeholder="Enter your email"
                                />
                              </GlassInputWrapper>
                            </div>

                            <div>
                              <label htmlFor="login-password" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                                Password
                              </label>
                              <GlassInputWrapper>
                                <input
                                  id="login-password"
                                  name="password"
                                  type="password"
                                  autoComplete="current-password"
                                  required
                                  value={loginPassword}
                                  onChange={(e) => setLoginPassword(e.target.value)}
                                  className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
                                  placeholder="Enter your password"
                                />
                              </GlassInputWrapper>
                            </div>

                            {loginError && (
                              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                                {loginError}
                              </div>
                            )}

                            <button
                              type="submit"
                              disabled={loginLoading}
                              className="w-full rounded-2xl bg-neutral-900 dark:bg-neutral-100 py-4 font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {loginLoading ? "Signing in..." : "Sign In"}
                            </button>

                            <div className="text-center text-sm text-neutral-500">
                              Don&apos;t have an account?{" "}
                              <button
                                type="button"
                                onClick={() => setActiveModal("signup")}
                                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                              >
                                Create one
                              </button>
                            </div>
                          </form>
                        </AuthenticationLayout>
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
                expanded={activeModal === "signup"}
                onExpandChange={(expanded) => setActiveModal(expanded ? "signup" : null)}
              >
                <div>
                  <ExpandableScreenTrigger>
                    <button
                      onClick={() => setActiveModal("signup")}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-200"
                    >
                      Create Account
                    </button>
                  </ExpandableScreenTrigger>

                  <ExpandableScreenContent className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="h-full w-full overflow-y-auto">
                      <div className="min-h-screen">
                        <AuthenticationLayout
                          title="Join Swasthya Sanchar"
                          description="Create your account and take control of your health data."
                          heroImageSrc="https://images.unsplash.com/photo-1579684385180-02581041b353?q=80&w=2070&auto=format&fit=crop"
                          testimonials={[
                            {
                              avatarSrc: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden",
                              name: "Aiden T.",
                              handle: "@aiden_tech",
                              text: "The blockchain security gives me peace of mind that my data is truly mine."
                            },
                            {
                              avatarSrc: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
                              name: "Emily R.",
                              handle: "@emily_nur",
                              text: "As a nurse, this platform saves us critical minutes during emergency intake."
                            }
                          ]}
                        >
                          <form onSubmit={handleSignup} className="space-y-4 animate-element animate-delay-300">
                            <div>
                              <label htmlFor="signup-email" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                                Email Address
                              </label>
                              <GlassInputWrapper>
                                <input
                                  id="signup-email"
                                  name="email"
                                  type="email"
                                  autoComplete="email"
                                  required
                                  value={signupEmail}
                                  onChange={(e) => setSignupEmail(e.target.value)}
                                  className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
                                  placeholder="Enter your email"
                                />
                              </GlassInputWrapper>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="signup-password" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                                  Password
                                </label>
                                <GlassInputWrapper>
                                  <input
                                    id="signup-password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={signupPassword}
                                    onChange={(e) => setSignupPassword(e.target.value)}
                                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
                                    placeholder="Min 8 chars"
                                  />
                                </GlassInputWrapper>
                              </div>

                              <div>
                                <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                                  Confirm Password
                                </label>
                                <GlassInputWrapper>
                                  <input
                                    id="signup-confirm-password"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={signupConfirmPassword}
                                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
                                    placeholder="Confirm password"
                                  />
                                </GlassInputWrapper>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3">
                                I am a...
                              </label>
                              <div className="grid grid-cols-2 gap-4">
                                <button
                                  type="button"
                                  onClick={() => setSignupRole("patient")}
                                  className={`px-4 py-3 rounded-2xl transition-all font-medium border ${signupRole === "patient"
                                    ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white"
                                    : "bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
                                    }`}
                                >
                                  Patient
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSignupRole("doctor")}
                                  className={`px-4 py-3 rounded-2xl transition-all font-medium border ${signupRole === "doctor"
                                    ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white"
                                    : "bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
                                    }`}
                                >
                                  Doctor
                                </button>
                              </div>
                            </div>

                            {signupError && (
                              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                                {signupError}
                              </div>
                            )}

                            <button
                              type="submit"
                              disabled={signupLoading}
                              className="w-full rounded-2xl bg-neutral-900 dark:bg-neutral-100 py-4 font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {signupLoading ? "Creating Account..." : "Create Account"}
                            </button>

                            <div className="text-center text-sm text-neutral-500">
                              Already have an account?{" "}
                              <button
                                type="button"
                                onClick={() => setActiveModal("login")}
                                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                              >
                                Sign in
                              </button>
                            </div>
                          </form>
                        </AuthenticationLayout>
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
      <div className="w-full py-20 md:py-28 border-b border-neutral-200 dark:border-neutral-800">
        <div className="mb-8 px-6 md:px-12 lg:px-20">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
            Four simple steps from registration to life-saving emergency access.
            See how blockchain technology empowers you and protects your privacy.
          </p>
        </div>

        <Timeline data={howItWorksData} />
      </div>
      {/* Key Benefits Section (Accordion) */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <BlockchainFeatureSection
          features={blockchainFeatures}
          title="Why Blockchain for Healthcare?"
          description="Traditional systems fail when you need them most. Here's what makes us different."
        />
      </div>

      {/* Meet the Team Section */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-20 md:py-28">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            Meet the Team
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            The passionate developers behind Swasthya Sanchar working to revolutionize healthcare data access.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          <TeamMemberCard
            name="Sahil Kumar Singh"
            role="Lead Developer"
            image="/sahil-kumar-singh.jpg"
            bio="Full-stack developer passionate about blockchain and healthcare innovation. Leading the technical architecture of Swasthya Sanchar."
          />
          <TeamMemberCard
            name="Siddhant Tiwari"
            role="Developer"
            image="/siddhant-tiwari.jpg"
            bio="Blockchain enthusiast and frontend specialist. Focused on creating seamless user experiences for patients and doctors."
          />
          <TeamMemberCard
            name="Akshit Thakur"
            role="Developer"
            image="/akshit-thakur.jpg"
            bio="Backend wizard ensuring secure and efficient data handling. dedicated to building robust medical record systems."
          />
          <TeamMemberCard
            name="Shivam Rana"
            role="Developer"
            image="/shivam-rana.jpg"
            bio="Smart contract developer with a keen eye for security. Implementing the core decentralized logic of the platform."
          />
          <TeamMemberCard
            name="Nancy"
            role="Developer"
            image="/nancy.jpg"
            bio="UI/UX designer and frontend developer creating intuitive healthcare interfaces. Ensuring accessibility and user-centered design."
          />
        </div>
      </div>

      {/* Footer */}
      <FooterSection />
    </main>
  );
}
