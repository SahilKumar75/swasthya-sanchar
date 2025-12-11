"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { connectWallet, onAccountsChanged, readContract, type WalletConnection } from "@/lib/web3";
import { Navbar } from "@/components/Navbar";
import {
  User, Mail, Phone, Calendar, MapPin, Award, Building,
  FileText, Shield, CheckCircle, AlertCircle, ArrowRight, Edit2, X, Save, BadgeCheck
} from "lucide-react";
import { INDIAN_STATES, getCitiesForState } from "@/lib/indianPostal";
import { CustomSelect } from "@/components/ui/custom-select";

interface DoctorData {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specialization: string;
  qualification: string;
  experience: string;
  hospital: string;
  city: string;
  state: string;
  walletAddress: string;
  isAuthorized: boolean;
}

export default function DoctorProfile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [registering, setRegistering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<typeof formData | null>(null);
  const [formData, setFormData] = useState({
    // Step 1: Personal & Contact Information
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",

    // Step 2: Professional Details
    specialization: "",
    qualification: "",
    experience: "",
    hospital: "",

    // Step 3: Location Information
    city: "",
    state: ""
  });

  // Handle state change and update available cities
  function handleStateChange(state: string) {
    setFormData({ ...formData, state, city: "" });
    setAvailableCities(getCitiesForState(state));
  }

  async function linkWalletToAccount(walletAddress: string) {
    try {
      const response = await fetch("/api/user/link-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Failed to link wallet:", data.error);
      }
    } catch (error) {
      console.error("Error linking wallet:", error);
    }
  }

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

      try {
        const conn = await connectWallet();
        if (conn) {
          setConnection(conn);
          await linkWalletToAccount(conn.account);
          await loadDoctorData(conn);
        }
      } catch (error) {
        console.log("No wallet connected yet");
      }

      setLoading(false);
    }

    checkAuth();

    // Listen for account changes
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        setConnection(null);
        setIsRegistered(false);
      } else {
        const conn = await connectWallet();
        setConnection(conn);
        if (conn) {
          await linkWalletToAccount(conn.account);
          await loadDoctorData(conn);
        }
      }
    };

    onAccountsChanged(handleAccountsChanged);
  }, [session, status, router]);

  async function loadDoctorData(conn: WalletConnection) {
    try {
      // Check if doctor is authorized on blockchain
      const isAuthorized = await readContract(conn, "authorizedDoctors", [conn.account]);

      // Fetch doctor profile from database
      const response = await fetch("/api/doctor/profile");
      const data = await response.json();

      if (data.doctor) {
        // Load existing doctor data
        const dbData: DoctorData = {
          name: data.doctor.name,
          email: data.doctor.email || session?.user?.email || "",
          phone: data.doctor.phone || "",
          licenseNumber: data.doctor.licenseNumber,
          specialization: data.doctor.specialization || "",
          qualification: data.doctor.qualification || "",
          experience: data.doctor.experience || "",
          hospital: data.doctor.hospital || "",
          city: data.doctor.city || "",
          state: data.doctor.state || "",
          walletAddress: conn.account,
          isAuthorized: Boolean(isAuthorized)
        };

        setDoctorData(dbData);
        setIsRegistered(true);
        setFormData({
          name: dbData.name,
          email: dbData.email,
          phone: dbData.phone,
          licenseNumber: dbData.licenseNumber,
          specialization: dbData.specialization,
          qualification: dbData.qualification,
          experience: dbData.experience,
          hospital: dbData.hospital,
          city: dbData.city,
          state: dbData.state
        });
        setEditFormData({
          name: dbData.name,
          email: dbData.email,
          phone: dbData.phone,
          licenseNumber: dbData.licenseNumber,
          specialization: dbData.specialization,
          qualification: dbData.qualification,
          experience: dbData.experience,
          hospital: dbData.hospital,
          city: dbData.city,
          state: dbData.state
        });
        if (dbData.state) {
          setAvailableCities(getCitiesForState(dbData.state));
        }
      } else {
        // No profile yet - show empty form
        setIsRegistered(false);
        setFormData({
          name: session?.user?.email?.split("@")[0] || "",
          email: session?.user?.email || "",
          phone: "",
          licenseNumber: "",
          specialization: "",
          qualification: "",
          experience: "",
          hospital: "",
          city: "",
          state: ""
        });
      }
    } catch (error) {
      console.error("Error loading doctor data:", error);
      setIsRegistered(false);
    }
  }

  async function handleRegister() {
    if (!connection) return;

    // Validate current step
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.phone || !formData.licenseNumber) {
        alert("Please fill in all required fields");
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!formData.specialization || !formData.qualification || !formData.experience) {
        alert("Please fill in all professional details");
        return;
      }
      setCurrentStep(3);
      return;
    }

    // Final step - Submit to database
    if (currentStep === 3) {
      if (!formData.city || !formData.state) {
        alert("Please fill in your location information");
        return;
      }

      try {
        setRegistering(true);

        const response = await fetch("/api/doctor/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert("Error: " + errorData.error);
          return;
        }

        const data = await response.json();
        alert(data.message || "Profile created successfully! Redirecting to dashboard...");

        setTimeout(() => {
          router.push("/doctor/home");
        }, 1500);

      } catch (error) {
        console.error("Registration error:", error);
        alert("Failed to save profile. Please try again.");
      } finally {
        setRegistering(false);
      }
    }
  }

  async function handleUpdateProfile() {
    try {
      setLoading(true);

      const response = await fetch("/api/doctor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
        return;
      }

      const data = await response.json();
      alert(data.message || "Profile updated successfully!");

      setIsEditing(false);
      // Reload doctor data
      if (connection) {
        await loadDoctorData(connection);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-neutral-100"></div>
      </div>
    );
  }

  if (!connection) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900">
        <Navbar connection={connection} />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
          <div className="text-center">
            <Shield className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
              Connect Your Wallet
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Connect your MetaMask wallet to access the doctor portal and manage patient records securely.
            </p>
            <button
              onClick={async () => {
                const conn = await connectWallet();
                if (conn) {
                  setConnection(conn);
                  await linkWalletToAccount(conn.account);
                  await loadDoctorData(conn);
                }
              }}
              className="px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition font-medium"
            >
              Connect Wallet
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Navbar connection={connection} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">
              {isRegistered ? "Doctor Profile" : "Complete Your Profile"}
            </h1>
            {isRegistered && doctorData?.isAuthorized && (
              <div className="group relative">
                <div className="relative w-8 h-8 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white dark:text-neutral-900" fill="white" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Verified Doctor
                </div>
              </div>
            )}
          </div>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            {isRegistered
              ? "Manage your professional information and credentials"
              : "Let's set up your professional profile to get started"
            }
          </p>
        </div>

        {/* Step-wise Registration for New Doctors */}
        {!isRegistered ? (
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-8">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold ${currentStep >= step
                        ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                        : 'bg-white dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 border-neutral-300 dark:border-neutral-700'
                      }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`flex-1 h-1 mx-2 ${currentStep > step
                          ? 'bg-neutral-900 dark:bg-neutral-100'
                          : 'bg-neutral-300 dark:bg-neutral-700'
                        }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
                <span>Personal & Contact</span>
                <span>Professional Details</span>
                <span>Location</span>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
              {currentStep === 1 && "Personal & Contact Information"}
              {currentStep === 2 && "Professional Details"}
              {currentStep === 3 && "Location Information"}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              {currentStep === 1 && "Let's start with your basic details and contact information"}
              {currentStep === 2 && "Tell us about your professional qualifications and expertise"}
              {currentStep === 3 && "Where are you practicing?"}
            </p>

            {/* Success message during registration */}
            {registering && (
              <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-blue-900 dark:text-blue-100 font-medium">
                  ⏳ Saving your profile... Please wait
                </p>
              </div>
            )}

            <div className="space-y-4 max-w-3xl">
              {/* Step 1: Personal & Contact Information */}
              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        <User className="w-4 h-4" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. John Doe"
                        className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        <Award className="w-4 h-4" />
                        Medical License Number *
                      </label>
                      <input
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        placeholder="e.g., MCI-123456"
                        className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="doctor@hospital.com"
                        className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        <Phone className="w-4 h-4" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Professional Details */}
              {currentStep === 2 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        <FileText className="w-4 h-4" />
                        Specialization *
                      </label>
                      <CustomSelect
                        value={formData.specialization}
                        onChange={(value) => setFormData({ ...formData, specialization: value })}
                        options={[
                          { value: "", label: "Select Specialization" },
                          { value: "General Physician", label: "General Physician" },
                          { value: "Cardiologist", label: "Cardiologist" },
                          { value: "Dermatologist", label: "Dermatologist" },
                          { value: "ENT Specialist", label: "ENT Specialist" },
                          { value: "Gastroenterologist", label: "Gastroenterologist" },
                          { value: "Gynecologist", label: "Gynecologist" },
                          { value: "Neurologist", label: "Neurologist" },
                          { value: "Oncologist", label: "Oncologist" },
                          { value: "Ophthalmologist", label: "Ophthalmologist" },
                          { value: "Orthopedic", label: "Orthopedic" },
                          { value: "Pediatrician", label: "Pediatrician" },
                          { value: "Psychiatrist", label: "Psychiatrist" },
                          { value: "Pulmonologist", label: "Pulmonologist" },
                          { value: "Radiologist", label: "Radiologist" },
                          { value: "Urologist", label: "Urologist" },
                          { value: "Other", label: "Other" }
                        ]}
                        placeholder="Select Specialization"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        <Award className="w-4 h-4" />
                        Qualification *
                      </label>
                      <CustomSelect
                        value={formData.qualification}
                        onChange={(value) => setFormData({ ...formData, qualification: value })}
                        options={[
                          { value: "", label: "Select Qualification" },
                          { value: "MBBS", label: "MBBS" },
                          { value: "MBBS, MD", label: "MBBS, MD" },
                          { value: "MBBS, MS", label: "MBBS, MS" },
                          { value: "MBBS, DNB", label: "MBBS, DNB" },
                          { value: "MBBS, DM", label: "MBBS, DM" },
                          { value: "MBBS, MCh", label: "MBBS, MCh" },
                          { value: "BDS", label: "BDS" },
                          { value: "BDS, MDS", label: "BDS, MDS" },
                          { value: "BAMS", label: "BAMS" },
                          { value: "BHMS", label: "BHMS" },
                          { value: "BUMS", label: "BUMS" },
                          { value: "Other", label: "Other" }
                        ]}
                        placeholder="Select Qualification"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        <Calendar className="w-4 h-4" />
                        Years of Experience *
                      </label>
                      <CustomSelect
                        value={formData.experience}
                        onChange={(value) => setFormData({ ...formData, experience: value })}
                        options={[
                          { value: "", label: "Select Experience" },
                          { value: "Less than 1 year", label: "Less than 1 year" },
                          { value: "1-2 years", label: "1-2 years" },
                          { value: "3-5 years", label: "3-5 years" },
                          { value: "6-10 years", label: "6-10 years" },
                          { value: "11-15 years", label: "11-15 years" },
                          { value: "16-20 years", label: "16-20 years" },
                          { value: "20+ years", label: "20+ years" }
                        ]}
                        placeholder="Select Experience"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        <Building className="w-4 h-4" />
                        Hospital/Clinic Name
                      </label>
                      <input
                        type="text"
                        value={formData.hospital}
                        onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                        placeholder="e.g., City General Hospital"
                        className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Location Information */}
              {currentStep === 3 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        <MapPin className="w-4 h-4" />
                        State *
                      </label>
                      <CustomSelect
                        value={formData.state}
                        onChange={handleStateChange}
                        options={[
                          { value: "", label: "Select State" },
                          ...INDIAN_STATES.map(state => ({ value: state, label: state }))
                        ]}
                        placeholder="Select State"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        <MapPin className="w-4 h-4" />
                        City *
                      </label>
                      {availableCities.length > 0 ? (
                        <>
                          <CustomSelect
                            value={formData.city}
                            onChange={(value) => setFormData({ ...formData, city: value })}
                            options={[
                              { value: "", label: "Select City" },
                              ...availableCities.map(city => ({ value: city, label: city })),
                              { value: "other", label: "Other (Type below)" }
                            ]}
                            placeholder="Select City"
                          />
                          {formData.city === "other" && (
                            <input
                              type="text"
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              placeholder="Type your city name"
                              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100 mt-2"
                            />
                          )}
                        </>
                      ) : (
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Enter city name"
                          className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                        />
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    disabled={registering}
                    className="px-6 py-3 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition disabled:opacity-50 font-medium"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="flex-1 px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {registering ? "Submitting..." : currentStep === 3 ? "Complete Profile" : "Next"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Registered Doctor - Edit Profile */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Profile Card */}
            <div className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
              {/* Header with Edit Button */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                  Professional Information
                </h2>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditFormData(formData);
                        }}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editFormData?.name}
                      onChange={(e) => setEditFormData(editFormData ? { ...editFormData, name: e.target.value } : null)}
                      className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100">
                      {formData.name || "—"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <Award className="w-4 h-4" />
                    License Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editFormData?.licenseNumber}
                      onChange={(e) => setEditFormData(editFormData ? { ...editFormData, licenseNumber: e.target.value } : null)}
                      className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100">
                      {formData.licenseNumber || "—"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <FileText className="w-4 h-4" />
                    Specialization
                  </label>
                  {isEditing ? (
                    <CustomSelect
                      value={editFormData?.specialization || ""}
                      onChange={(value) => setEditFormData(editFormData ? { ...editFormData, specialization: value } : null)}
                      options={[
                        { value: "", label: "Select Specialization" },
                        { value: "General Physician", label: "General Physician" },
                        { value: "Cardiologist", label: "Cardiologist" },
                        { value: "Dermatologist", label: "Dermatologist" },
                        { value: "ENT Specialist", label: "ENT Specialist" },
                        { value: "Gastroenterologist", label: "Gastroenterologist" },
                        { value: "Gynecologist", label: "Gynecologist" },
                        { value: "Neurologist", label: "Neurologist" },
                        { value: "Oncologist", label: "Oncologist" },
                        { value: "Ophthalmologist", label: "Ophthalmologist" },
                        { value: "Orthopedic", label: "Orthopedic" },
                        { value: "Pediatrician", label: "Pediatrician" },
                        { value: "Psychiatrist", label: "Psychiatrist" },
                        { value: "Pulmonologist", label: "Pulmonologist" },
                        { value: "Radiologist", label: "Radiologist" },
                        { value: "Urologist", label: "Urologist" },
                        { value: "Other", label: "Other" }
                      ]}
                      placeholder="Select Specialization"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100">
                      {formData.specialization || "—"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <Award className="w-4 h-4" />
                    Qualification
                  </label>
                  {isEditing ? (
                    <CustomSelect
                      value={editFormData?.qualification || ""}
                      onChange={(value) => setEditFormData(editFormData ? { ...editFormData, qualification: value } : null)}
                      options={[
                        { value: "", label: "Select Qualification" },
                        { value: "MBBS", label: "MBBS" },
                        { value: "MBBS, MD", label: "MBBS, MD" },
                        { value: "MBBS, MS", label: "MBBS, MS" },
                        { value: "MBBS, DNB", label: "MBBS, DNB" },
                        { value: "MBBS, DM", label: "MBBS, DM" },
                        { value: "MBBS, MCh", label: "MBBS, MCh" },
                        { value: "BDS", label: "BDS" },
                        { value: "BDS, MDS", label: "BDS, MDS" },
                        { value: "BAMS", label: "BAMS" },
                        { value: "BHMS", label: "BHMS" },
                        { value: "BUMS", label: "BUMS" },
                        { value: "Other", label: "Other" }
                      ]}
                      placeholder="Select Qualification"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100">
                      {formData.qualification || "—"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <Calendar className="w-4 h-4" />
                    Experience (Years)
                  </label>
                  {isEditing ? (
                    <CustomSelect
                      value={editFormData?.experience || ""}
                      onChange={(value) => setEditFormData(editFormData ? { ...editFormData, experience: value } : null)}
                      options={[
                        { value: "", label: "Select Experience" },
                        { value: "Less than 1 year", label: "Less than 1 year" },
                        { value: "1-2 years", label: "1-2 years" },
                        { value: "3-5 years", label: "3-5 years" },
                        { value: "6-10 years", label: "6-10 years" },
                        { value: "11-15 years", label: "11-15 years" },
                        { value: "16-20 years", label: "16-20 years" },
                        { value: "20+ years", label: "20+ years" }
                      ]}
                      placeholder="Select Experience"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100">
                      {formData.experience || "—"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <Building className="w-4 h-4" />
                    Hospital/Clinic
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editFormData?.hospital}
                      onChange={(e) => setEditFormData(editFormData ? { ...editFormData, hospital: e.target.value } : null)}
                      className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100">
                      {formData.hospital || "—"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editFormData?.email}
                      onChange={(e) => setEditFormData(editFormData ? { ...editFormData, email: e.target.value } : null)}
                      className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100">
                      {formData.email || "—"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editFormData?.phone}
                      onChange={(e) => setEditFormData(editFormData ? { ...editFormData, phone: e.target.value } : null)}
                      className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100">
                      {formData.phone || "—"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <MapPin className="w-4 h-4" />
                    State
                  </label>
                  {isEditing ? (
                    <CustomSelect
                      value={editFormData?.state || ""}
                      onChange={(value) => {
                        if (editFormData) {
                          setEditFormData({ ...editFormData, state: value, city: "" });
                          setAvailableCities(getCitiesForState(value));
                        }
                      }}
                      options={[
                        { value: "", label: "Select State" },
                        ...INDIAN_STATES.map(state => ({ value: state, label: state }))
                      ]}
                      placeholder="Select State"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100">
                      {formData.state || "—"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <MapPin className="w-4 h-4" />
                    City
                  </label>
                  {isEditing ? (
                    <>
                      {availableCities.length > 0 ? (
                        <>
                          <CustomSelect
                            value={editFormData?.city || ""}
                            onChange={(value) => setEditFormData(editFormData ? { ...editFormData, city: value } : null)}
                            options={[
                              { value: "", label: "Select City" },
                              ...availableCities.map(city => ({ value: city, label: city })),
                              { value: "other", label: "Other (Type below)" }
                            ]}
                            placeholder="Select City"
                          />
                          {editFormData?.city === "other" && (
                            <input
                              type="text"
                              onChange={(e) => setEditFormData(editFormData ? { ...editFormData, city: e.target.value } : null)}
                              placeholder="Type your city name"
                              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 dark:text-neutral-100 mt-2"
                            />
                          )}
                        </>
                      ) : (
                        <input
                          type="text"
                          value={editFormData?.city}
                          onChange={(e) => setEditFormData(editFormData ? { ...editFormData, city: e.target.value } : null)}
                          placeholder="Enter city name"
                          className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                        />
                      )}
                    </>
                  ) : (
                    <p className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100">
                      {formData.city || "—"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Blockchain Info Card */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-4">
                  Blockchain Identity
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Wallet Address</p>
                    <p className="text-xs font-mono bg-neutral-100 dark:bg-neutral-900 p-2 rounded break-all text-neutral-900 dark:text-neutral-100">
                      {connection.account}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Status</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${doctorData?.isAuthorized
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                      }`}>
                      {doctorData?.isAuthorized ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {doctorData?.isAuthorized ? 'Authorized' : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Profile QR Code */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-4">
                  Share Profile
                </h3>
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg mb-3">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/doctor/profile/${connection.account}` : '')}`}
                      alt="Doctor Profile QR Code"
                      className="w-36 h-36"
                    />
                  </div>
                  <p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
                    Scan to view doctor profile
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
