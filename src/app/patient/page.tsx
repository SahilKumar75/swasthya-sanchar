"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { connectWallet, onAccountsChanged, readContract, writeContract, type WalletConnection } from "@/lib/web3";
import { PatientHeader } from "@/components/ui/patient-header";

export default function PatientPortal() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    name: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    
    // Step 2: Contact Information
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    
    // Step 3: Emergency Contact
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    
    // Step 4: Medical Information
    allergies: "",
    chronicConditions: "",
    currentMedications: "",
    previousSurgeries: ""
  });

  useEffect(() => {
    // AUTH GUARD: Check session first
    async function checkAuth() {
      if (status === "loading") {
        return;
      }

      if (status === "unauthenticated" || !session?.user) {
        // Not logged in - redirect to login
        router.push("/auth/login");
        return;
      }

      if (session.user.role !== "patient") {
        // Not a patient - redirect to appropriate portal
        router.push(session.user.role === "doctor" ? "/doctor" : "/");
        return;
      }

      // User is authenticated as patient, now try to auto-connect wallet
      try {
        const conn = await connectWallet();
        if (conn) {
          setConnection(conn);
          await checkRegistrationStatus(conn);
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
        // Wallet disconnected
        setConnection(null);
        setIsRegistered(false);
      } else {
        // Wallet switched or connected
        const conn = await connectWallet();
        setConnection(conn);
        if (conn) {
          await checkRegistrationStatus(conn);
        }
      }
    };

    onAccountsChanged(handleAccountsChanged);
  }, [session, status, router]);

  async function checkRegistrationStatus(conn: WalletConnection) {
    try {
      setCheckingRegistration(true);
      const result = await readContract(conn, "getPatient", [conn.account]);
      const patient = result as any;
      // If patient.name exists and is not empty string, they're registered
      const isPatientRegistered = patient && patient.name && patient.name.trim() !== "" && patient.name !== "0x" && patient.name !== "0x0000000000000000000000000000000000000000000000000000000000000000";
      console.log("Registration check:", { patient, isPatientRegistered });
      setIsRegistered(isPatientRegistered);
    } catch (error: any) {
      // "Patient not registered" error means they need to register
      console.error("Error checking registration:", error);
      setIsRegistered(false);
    } finally {
      setCheckingRegistration(false);
    }
  }

  async function handleRegister() {
    if (!connection) return;
    
    // Validate current step
    if (currentStep === 1) {
      if (!formData.name || !formData.dateOfBirth || !formData.gender || !formData.bloodGroup) {
        alert("Please fill in all personal information fields");
        return;
      }
      setCurrentStep(2);
      return;
    }
    
    if (currentStep === 2) {
      if (!formData.phone || !formData.email || !formData.address) {
        alert("Please fill in all contact information fields");
        return;
      }
      setCurrentStep(3);
      return;
    }
    
    if (currentStep === 3) {
      if (!formData.emergencyName || !formData.emergencyRelation || !formData.emergencyPhone) {
        alert("Please fill in all emergency contact fields");
        return;
      }
      setCurrentStep(4);
      return;
    }
    
    // Final step - Submit to blockchain
    if (currentStep === 4) {
      try {
        setRegistering(true);
        
        // Convert date string to Unix timestamp (seconds since epoch)
        const dateTimestamp = BigInt(Math.floor(new Date(formData.dateOfBirth).getTime() / 1000));
        
        // Create emergency contact hash (JSON string of emergency info)
        const emergencyData = {
          name: formData.emergencyName,
          relation: formData.emergencyRelation,
          phone: formData.emergencyPhone,
          allergies: formData.allergies,
          chronicConditions: formData.chronicConditions,
          currentMedications: formData.currentMedications,
          bloodGroup: formData.bloodGroup
        };
        const emergencyHash = JSON.stringify(emergencyData);
        
        console.log("Registering patient:", { name: formData.name, dateTimestamp });
        
        await writeContract(
          connection,
          "registerPatient",
          [formData.name, dateTimestamp, emergencyHash]
        );

        console.log("Transaction completed, waiting for blockchain state update...");

        // Wait for blockchain state to update
        setTimeout(async () => {
          console.log("First check after 3 seconds...");
          await checkRegistrationStatus(connection);
          
          // If still not registered, try again after another 2 seconds
          setTimeout(async () => {
            console.log("Second check after 5 seconds total...");
            await checkRegistrationStatus(connection);
          }, 2000);
        }, 3000);
        
      } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed. Please try again.");
        setRegistering(false);
      }
    }
  }

  const handleConnect = async () => {
    setLoading(true);
    const conn = await connectWallet();
    setConnection(conn);
    if (conn) {
      await checkRegistrationStatus(conn);
    }
    setLoading(false);
  };

  // Loading state for session check
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

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Header */}
      <PatientHeader connection={connection} />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-12 pt-24">{/* pt-24 for fixed header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Patient Portal</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Your medical records, your control—securely stored on blockchain
          </p>
        </div>

        {!connection ? (
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-8 text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-neutral-400 dark:text-neutral-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Welcome, {session?.user?.email}!
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Connect your MetaMask wallet to access your medical records on the blockchain.
            </p>
            <button
              onClick={handleConnect}
              disabled={loading}
              className="px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition disabled:opacity-50 font-medium"
            >
              {loading ? "Connecting..." : "Connect MetaMask Wallet"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Registration Check Status */}
            {checkingRegistration ? (
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 dark:border-neutral-100 mx-auto mb-4"></div>
                <p className="text-neutral-600 dark:text-neutral-400">Checking registration status...</p>
              </div>
            ) : !isRegistered ? (
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-8">
                {/* Progress Indicator */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex items-center flex-1">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold ${
                          currentStep >= step 
                            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                            : 'bg-white dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 border-neutral-300 dark:border-neutral-700'
                        }`}>
                          {step}
                        </div>
                        {step < 4 && (
                          <div className={`flex-1 h-1 mx-2 ${
                            currentStep > step 
                              ? 'bg-neutral-900 dark:bg-neutral-100' 
                              : 'bg-neutral-300 dark:bg-neutral-700'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
                    <span>Personal</span>
                    <span>Contact</span>
                    <span>Emergency</span>
                    <span>Medical</span>
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                  {currentStep === 1 && "Personal Information"}
                  {currentStep === 2 && "Contact Information"}
                  {currentStep === 3 && "Emergency Contact"}
                  {currentStep === 4 && "Medical Information"}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  {currentStep === 1 && "Let's start with your basic details"}
                  {currentStep === 2 && "How can we reach you?"}
                  {currentStep === 3 && "Who should we contact in case of emergency?"}
                  {currentStep === 4 && "Important medical information for emergencies"}
                </p>
                
                {/* Success message after registration */}
                {registering && (
                  <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-blue-900 dark:text-blue-100 font-medium">
                      ⏳ Submitting to blockchain... Please confirm in MetaMask
                    </p>
                  </div>
                )}
                
                <div className="space-y-4 max-w-2xl">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Date of Birth *
                          </label>
                          <input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Gender *
                          </label>
                          <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Blood Group *
                          </label>
                          <select
                            value={formData.bloodGroup}
                            onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          >
                            <option value="">Select blood group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 2: Contact Information */}
                  {currentStep === 2 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+91 9876543210"
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Address *
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Street address"
                          className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="City"
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            placeholder="State"
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            PIN Code
                          </label>
                          <input
                            type="text"
                            value={formData.pincode}
                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                            placeholder="PIN"
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 3: Emergency Contact */}
                  {currentStep === 3 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Emergency Contact Name *
                          </label>
                          <input
                            type="text"
                            value={formData.emergencyName}
                            onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                            placeholder="Jane Doe"
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Relationship *
                          </label>
                          <select
                            value={formData.emergencyRelation}
                            onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          >
                            <option value="">Select relationship</option>
                            <option value="spouse">Spouse</option>
                            <option value="parent">Parent</option>
                            <option value="sibling">Sibling</option>
                            <option value="child">Child</option>
                            <option value="friend">Friend</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Emergency Contact Phone *
                        </label>
                        <input
                          type="tel"
                          value={formData.emergencyPhone}
                          onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                          placeholder="+91 9876543210"
                          className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                        />
                      </div>
                    </>
                  )}

                  {/* Step 4: Medical Information */}
                  {currentStep === 4 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Known Allergies
                        </label>
                        <textarea
                          value={formData.allergies}
                          onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                          placeholder="e.g., Penicillin, Peanuts, etc."
                          rows={3}
                          className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Chronic Conditions
                        </label>
                        <textarea
                          value={formData.chronicConditions}
                          onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                          placeholder="e.g., Diabetes, Hypertension, etc."
                          rows={3}
                          className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Current Medications
                        </label>
                        <textarea
                          value={formData.currentMedications}
                          onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                          placeholder="List any medications you're currently taking"
                          rows={3}
                          className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Previous Surgeries
                        </label>
                        <textarea
                          value={formData.previousSurgeries}
                          onChange={(e) => setFormData({ ...formData, previousSurgeries: e.target.value })}
                          placeholder="List any previous surgeries or major medical procedures"
                          rows={3}
                          className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                        />
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
                      {registering ? "Submitting to Blockchain..." : currentStep === 4 ? "Complete Registration" : "Next"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Connected Dashboard - Registered */}
                <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 bg-neutral-900 dark:bg-neutral-100 rounded-full"></div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
                      Your Dashboard
                    </h2>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                    Connected as: <span className="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 px-2 py-1 rounded">{connection.account}</span>
                  </p>
                  <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-4">
                    ✓ Registered Patient
                  </p>
                  
                  {/* Emergency Access CTA */}
                  <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
                      🚨 Emergency Access
                    </h3>
                    <p className="text-red-700 dark:text-red-200 mb-4">
                      Generate your life-saving QR code for first responders—no wallet needed to scan
                    </p>
                    <Link
                      href="/patient/emergency"
                      className="inline-block px-6 py-3 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition font-medium"
                    >
                      Generate Emergency QR Code →
                    </Link>
                  </div>

                  <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-8 text-center">
                    <p className="text-neutral-500 dark:text-neutral-400">
                      📋 Record management features will be added in the next phase.
                    </p>
                    <p className="text-neutral-400 dark:text-neutral-500 text-sm mt-2">
                      Coming soon: View your medical records, manage permissions, and more.
                    </p>
                  </div>
                </div>

                {/* Future Features Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2">📝 Profile</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">View your patient profile</p>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2">🏥 Records</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">View your medical records</p>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2">🔐 Access</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Grant doctor permissions</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
