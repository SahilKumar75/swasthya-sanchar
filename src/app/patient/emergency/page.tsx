"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { connectWallet, getCurrentAccount, formatAddress, onAccountsChanged, readContract, disconnectWallet, type WalletConnection } from "@/lib/web3";
import { PatientHeader } from "@/components/ui/patient-header";
import { useSession } from "next-auth/react";

interface PatientData {
  name: string;
  dateOfBirth: string;
  bloodGroup: string;
  phone: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  allergies: string;
  chronicConditions: string;
  currentMedications: string;
}

export default function EmergencyProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [checkingRegistration, setCheckingRegistration] = useState(true);

  useEffect(() => {
    // AUTH GUARD: Check session and wallet
    async function checkAuth() {
      if (status === "loading") return;

      if (status === "unauthenticated" || !session?.user) {
        router.push("/auth/login");
        return;
      }

      if (session.user.role !== "patient") {
        router.push(session.user.role === "doctor" ? "/doctor" : "/");
        return;
      }

      try {
        const conn = await connectWallet();
        if (conn) {
          setConnection(conn);
          await loadPatientData(conn);
        }
      } catch (error) {
        console.log("Error connecting wallet:", error);
      }

      setLoading(false);
      setCheckingRegistration(false);
    }

    checkAuth();
  }, [session, status, router]);

  async function loadPatientData(conn: WalletConnection) {
    try {
      const result = await readContract(conn, "getPatient", [conn.account]);
      const patient = result as any;

      if (patient && patient.name) {
        let emergencyData: any = {};
        try {
          if (patient.emergencyProfileHash) {
            emergencyData = JSON.parse(patient.emergencyProfileHash);
          }
        } catch (parseError) {
          console.error("Error parsing emergency data:", parseError);
        }

        const birthDate = new Date(Number(patient.dateOfBirth) * 1000);
        const dateOfBirth = birthDate.toISOString().split('T')[0];

        setPatientData({
          name: patient.name || "",
          dateOfBirth: dateOfBirth,
          bloodGroup: emergencyData.bloodGroup || "",
          phone: emergencyData.phone || "",
          emergencyName: emergencyData.name || "",
          emergencyRelation: emergencyData.relation || "",
          emergencyPhone: emergencyData.emergencyPhone || "",
          allergies: emergencyData.allergies || "",
          chronicConditions: emergencyData.chronicConditions || "",
          currentMedications: emergencyData.currentMedications || "",
        });

        setIsRegistered(true);
      } else {
        router.push("/patient");
      }
    } catch (error) {
      console.error("Error loading patient data:", error);
      router.push("/patient");
    }
  }

  const handleGenerateQR = () => {
    setQrGenerated(true);
  };

  const getEmergencyUrl = () => {
    if (!connection) return "";
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    return `${baseUrl}/emergency/${connection.account}`;
  };

  // Show loading state while checking registration
  if (checkingRegistration) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-neutral-100 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Verifying registration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <PatientHeader connection={connection} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Emergency Profile</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Generate your life-saving QR code—instant access for first responders, no wallet needed
          </p>
        </div>

        {!connection || !patientData ? (
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-neutral-100 mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Loading your emergency profile...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Emergency Profile Card */}
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Your Emergency Information</h2>
                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                  Emergency Access
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-900">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-3">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium text-neutral-700 dark:text-neutral-300">Name:</span> <span className="text-neutral-900 dark:text-neutral-100">{patientData.name}</span></p>
                    <p><span className="font-medium text-neutral-700 dark:text-neutral-300">Blood Group:</span> <span className="text-red-600 dark:text-red-400 font-bold">{patientData.bloodGroup || "Not provided"}</span></p>
                    <p><span className="font-medium text-neutral-700 dark:text-neutral-300">Date of Birth:</span> <span className="text-neutral-900 dark:text-neutral-100">{patientData.dateOfBirth}</span></p>
                  </div>
                </div>

                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-900">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-3">Emergency Contact</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium text-neutral-700 dark:text-neutral-300">Name:</span> <span className="text-neutral-900 dark:text-neutral-100">{patientData.emergencyName || "Not provided"}</span></p>
                    <p><span className="font-medium text-neutral-700 dark:text-neutral-300">Relationship:</span> <span className="text-neutral-900 dark:text-neutral-100">{patientData.emergencyRelation || "Not provided"}</span></p>
                    <p><span className="font-medium text-neutral-700 dark:text-neutral-300">Phone:</span> <span className="text-neutral-900 dark:text-neutral-100">{patientData.emergencyPhone || "Not provided"}</span></p>
                  </div>
                </div>

                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                  <h3 className="font-semibold text-red-900 dark:text-red-100 mb-3">⚠️ Allergies</h3>
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {patientData.allergies || "None reported"}
                  </p>
                </div>

                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20">
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">Medical Conditions</h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    {patientData.chronicConditions || "None reported"}
                  </p>
                </div>
              </div>

              <div className="mt-6 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-900">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-3">Current Medications</h3>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  {patientData.currentMedications || "None reported"}
                </p>
              </div>

              <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  📱 <strong>For First Responders:</strong> This information is stored securely on the blockchain. No login required to access in emergencies.
                </p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">Emergency QR Code</h2>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-8 bg-white dark:bg-neutral-900">
                {!qrGenerated ? (
                  <>
                    <svg className="w-24 h-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4 text-center">
                      Generate your life-saving QR code—responders scan it to access critical info instantly
                    </p>
                    <button
                      className="px-6 py-3 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition font-medium"
                      onClick={handleGenerateQR}
                    >
                      Generate Emergency QR Code
                    </button>
                    <p className="text-sm text-gray-500 mt-4 text-center">
                      💡 Print on your ID card or save to your phone's lock screen for 24/7 access
                    </p>
                  </>
                ) : (
                  <>
                    <div className="bg-white p-4 rounded-lg shadow-inner mb-4">
                      <QRCodeSVG
                        value={getEmergencyUrl()}
                        size={256}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <p className="text-green-600 dark:text-green-400 font-semibold mb-2">✓ QR Code Generated</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mb-4">
                      🚨 Responders scan this—no wallet, no login—instant access to your allergies, blood type, meds, and emergency contacts
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center bg-neutral-100 dark:bg-neutral-800 p-2 rounded font-mono break-all max-w-md">
                      {getEmergencyUrl()}
                    </p>
                    <button
                      className="mt-4 px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition text-sm"
                      onClick={() => setQrGenerated(false)}
                    >
                      Regenerate QR Code
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
