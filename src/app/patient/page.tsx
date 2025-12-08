"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { connectWallet, getCurrentAccount, formatAddress, onAccountsChanged, readContract, writeContract, type WalletConnection } from "@/lib/web3";
import { HEALTH_RECORDS_ABI, HEALTH_RECORDS_ADDRESS } from "@/lib/contracts";

export default function PatientPortal() {
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: "", dateOfBirth: "" });

  useEffect(() => {
    // Check if already connected on mount
    async function checkConnection() {
      const account = await getCurrentAccount();
      if (account) {
        const conn = await connectWallet();
        setConnection(conn);
        if (conn) {
          await checkRegistrationStatus(conn);
        }
      }
      setLoading(false);
    }

    checkConnection();

    // Listen for account changes
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        setConnection(null);
        setIsRegistered(false);
      } else {
        const conn = await connectWallet();
        setConnection(conn);
        if (conn) {
          await checkRegistrationStatus(conn);
        }
      }
    };

    onAccountsChanged(handleAccountsChanged);
  }, []);

  async function checkRegistrationStatus(conn: WalletConnection) {
    try {
      setCheckingRegistration(true);
      const result = await readContract(conn, "getPatient", [conn.account]);
      const patient = result as any;
      // If patient.name is not empty, they're registered
      setIsRegistered(patient.name && patient.name !== "");
    } catch (error: any) {
      // "Patient not registered" error means they need to register
      if (error?.message?.includes("Patient not registered")) {
        setIsRegistered(false);
      } else {
        console.error("Error checking registration:", error);
        setIsRegistered(false);
      }
    } finally {
      setCheckingRegistration(false);
    }
  }

  async function handleRegister() {
    if (!connection) return;
    if (!formData.name || !formData.dateOfBirth) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setRegistering(true);
      // Convert date string to Unix timestamp (seconds since epoch)
      const dateTimestamp = BigInt(Math.floor(new Date(formData.dateOfBirth).getTime() / 1000));
      // For emergency hash, we'll use an empty string for now (can be updated later)
      const emergencyHash = "";
      
      await writeContract(
        connection,
        "registerPatient",
        [formData.name, dateTimestamp, emergencyHash]
      );

      // Wait a moment and check registration status
      setTimeout(async () => {
        await checkRegistrationStatus(connection);
        setFormData({ name: "", dateOfBirth: "" });
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setRegistering(false);
    }
  }

  const handleConnect = async () => {
    setLoading(true);
    const conn = await connectWallet();
    setConnection(conn);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Swasthya Sanchar
          </Link>
          <div>
            {connection ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Connected:</span>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-mono text-sm">
                  {formatAddress(connection.account)}
                </span>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Portal</h1>
          <p className="text-lg text-gray-600">
            Your medical records, your control—securely stored on blockchain
          </p>
        </div>

        {!connection ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-6">
              Connect MetaMask to take ownership of your health data on blockchain
            </p>
            <button
              onClick={handleConnect}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-lg"
              aria-label="Connect MetaMask wallet to access patient portal"
            >
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Registration Check Status */}
            {checkingRegistration ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Checking registration status...</p>
              </div>
            ) : !isRegistered ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Register as a Patient
                </h2>
                <p className="text-gray-600 mb-6">
                  Create your blockchain identity—you control who accesses your records
                </p>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={registering}
                      aria-required="true"
                      aria-describedby="name-helper"
                    />
                  </div>
                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      id="dob"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={registering}
                    />
                  </div>
                  <button
                    onClick={handleRegister}
                    disabled={registering || !formData.name || !formData.dateOfBirth}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {registering ? "Registering..." : "Register on Blockchain"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Connected Dashboard - Registered */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Your Dashboard
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-2">
                    Connected as: <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{connection.account}</span>
                  </p>
                  <p className="text-green-600 font-medium mb-4">
                    ✓ Registered Patient
                  </p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500">
                      📋 Record management features will be added in the next phase.
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Coming soon: View your medical records, manage permissions, and more.
                    </p>
                  </div>
                </div>

                {/* Future Features Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                    <h3 className="font-semibold text-gray-900 mb-2">📝 Profile</h3>
                    <p className="text-sm text-gray-600">View your patient profile</p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                    <h3 className="font-semibold text-gray-900 mb-2">🏥 Records</h3>
                    <p className="text-sm text-gray-600">View your medical records</p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
                    <h3 className="font-semibold text-gray-900 mb-2">🔐 Access</h3>
                    <p className="text-sm text-gray-600">Grant doctor permissions</p>
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
