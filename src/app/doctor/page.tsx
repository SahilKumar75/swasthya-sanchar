"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { connectWallet, getCurrentAccount, formatAddress, onAccountsChanged, readContract, disconnectWallet, type WalletConnection } from "@/lib/web3";
import { HEALTH_RECORDS_ABI, HEALTH_RECORDS_ADDRESS } from "@/lib/contracts";
import { mockMedicalRecords, type MedicalRecord } from "@/lib/mockRecords";

export default function DoctorPortal() {
  const router = useRouter();
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuthorization, setCheckingAuthorization] = useState(false);
  const [patientAddress, setPatientAddress] = useState("");
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [patientRecords, setPatientRecords] = useState<MedicalRecord[] | null>(null);
  const [accessError, setAccessError] = useState<string | null>(null);

  useEffect(() => {
    // AUTH GUARD: Check wallet connection on mount
    async function checkConnection() {
      const account = await getCurrentAccount();
      if (!account) {
        // No wallet connected - redirect to landing
        router.push("/");
        return;
      }
      
      const conn = await connectWallet();
      setConnection(conn);
      if (conn) {
        await checkAuthorizationStatus(conn);
      }
      setLoading(false);
    }

    checkConnection();

    // Listen for account changes
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        // Wallet disconnected - redirect to landing
        setConnection(null);
        setIsAuthorized(false);
        router.push("/");
      } else {
        const conn = await connectWallet();
        setConnection(conn);
        if (conn) {
          await checkAuthorizationStatus(conn);
        }
      }
    };

    onAccountsChanged(handleAccountsChanged);
  }, [router]);

  async function checkAuthorizationStatus(conn: WalletConnection) {
    try {
      setCheckingAuthorization(true);
      const result = await readContract(conn, "authorizedDoctors", [conn.account]);
      setIsAuthorized(Boolean(result));
    } catch (error) {
      console.error("Error checking authorization:", error);
      setIsAuthorized(false);
    } finally {
      setCheckingAuthorization(false);
    }
  }

  const handleConnect = async () => {
    setLoading(true);
    const conn = await connectWallet();
    setConnection(conn);
    setLoading(false);
  };

  const handleLogout = () => {
    // Set logout flag and clear connection state
    disconnectWallet();
    setConnection(null);
    setIsAuthorized(false);
    setPatientRecords(null);
    setAccessError(null);
    router.push("/");
  };

  async function handleCheckAccess() {
    if (!connection || !isAuthorized) return;
    if (!patientAddress || !patientAddress.startsWith("0x")) {
      setAccessError("Please enter a valid Ethereum address");
      return;
    }

    try {
      setCheckingAccess(true);
      setAccessError(null);
      setPatientRecords(null);

      // Check if patient is registered
      const patientData = await readContract(connection, "getPatient", [patientAddress as `0x${string}`]);
      const patient = patientData as any;
      
      if (!patient.name || patient.name === "") {
        setAccessError("Patient not registered in the system");
        return;
      }

      // In a real system, we'd check if this doctor has access to this patient's records
      // For now, if doctor is authorized and patient exists, grant access
      setPatientRecords(mockMedicalRecords);
      
    } catch (error: any) {
      if (error?.message?.includes("Patient not registered")) {
        setAccessError("Patient not registered in the system");
      } else {
        console.error("Error checking access:", error);
        setAccessError("Failed to check access. Please try again.");
      }
    } finally {
      setCheckingAccess(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
            Swasthya Sanchar
          </Link>
          <div>
            {connection ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Connected:</span>
                <span className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-lg font-mono text-sm border border-neutral-200 dark:border-neutral-700">
                  {formatAddress(connection.account)}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition border border-neutral-200 dark:border-neutral-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={loading}
                className="px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition disabled:opacity-50"
              >
                {loading ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Doctor Portal</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Access patient records with consent—authorized, transparent, secure
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
              Connect Your Wallet
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Connect MetaMask to access your authorized doctor dashboard
            </p>
            <button
              onClick={handleConnect}
              disabled={loading}
              className="px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition disabled:opacity-50 font-medium"
              aria-label="Connect MetaMask wallet to access doctor portal"
            >
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Authorization Check Status */}
            {checkingAuthorization ? (
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 dark:border-neutral-100 mx-auto mb-4"></div>
                <p className="text-neutral-600 dark:text-neutral-400">Checking authorization status...</p>
              </div>
            ) : (
              <>
                {/* Connected Dashboard */}
                <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-neutral-100"></div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
                      Your Dashboard
                    </h2>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                    Connected as: <span className="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 px-2 py-1 rounded">{connection.account}</span>
                  </p>
                  {isAuthorized ? (
                    <div className="mb-4">
                      <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-4">
                        ✓ Authorized Doctor
                      </p>
                      
                      {/* Patient Access Form */}
                      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">Access Patient Records (Consent-Based)</h3>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={patientAddress}
                            onChange={(e) => setPatientAddress(e.target.value)}
                            placeholder="Enter patient address (0x...)"
                            className="flex-1 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                            disabled={checkingAccess}
                            aria-label="Enter patient blockchain address to check access"
                            aria-describedby="access-error"
                          />
                          <button
                            onClick={handleCheckAccess}
                            disabled={checkingAccess || !patientAddress}
                            className="px-6 py-2 bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                          >
                            {checkingAccess ? "Checking..." : "Check Access"}
                          </button>
                        </div>
                        
                        {accessError && (
                          <div className="mt-4 bg-neutral-200 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg p-4">
                            <p className="text-neutral-900 dark:text-neutral-100 text-sm">{accessError}</p>
                          </div>
                        )}
                      </div>

                      {/* Medical Records Display */}
                      {patientRecords && (
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                            Medical Records for {formatAddress(patientAddress as `0x${string}`)}
                          </h3>
                          <div className="space-y-4">
                            {patientRecords.map((record) => (
                              <div key={record.id} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="font-semibold text-neutral-900 dark:text-neutral-50">{record.type}</p>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">ID: {record.id}</p>
                                  </div>
                                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{record.date}</p>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <p><span className="font-medium text-neutral-700 dark:text-neutral-300">Diagnosis:</span> <span className="text-neutral-600 dark:text-neutral-400">{record.diagnosis}</span></p>
                                  <p><span className="font-medium text-neutral-700 dark:text-neutral-300">Prescription:</span> <span className="text-neutral-600 dark:text-neutral-400">{record.prescription}</span></p>
                                  <p><span className="font-medium text-neutral-700 dark:text-neutral-300">Doctor:</span> <span className="text-neutral-600 dark:text-neutral-400">{record.doctor}</span></p>
                                  <p><span className="font-medium text-neutral-700 dark:text-neutral-300">Notes:</span> <span className="text-neutral-600 dark:text-neutral-400">{record.notes}</span></p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-neutral-700 dark:text-neutral-300 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <p className="text-neutral-900 dark:text-neutral-50 font-medium">Not Authorized</p>
                          <p className="text-neutral-700 dark:text-neutral-300 text-sm mt-1">
                            Your wallet address is not authorized as a doctor. Please contact the system administrator to request authorization.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Future Features Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 ${!isAuthorized && 'opacity-50'}`}>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2">👨‍⚕️ Authorization</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{isAuthorized ? 'Authorized' : 'Not authorized'}</p>
                  </div>
                  <div className={`bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 ${!isAuthorized && 'opacity-50'}`}>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2">📋 Create Records</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Add new medical records</p>
                  </div>
                  <div className={`bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 ${!isAuthorized && 'opacity-50'}`}>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2">👥 Patients</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">View patient records</p>
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
