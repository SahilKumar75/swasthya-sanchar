"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { connectWallet, getCurrentAccount, formatAddress, onAccountsChanged, readContract, type WalletConnection } from "@/lib/web3";
import { HEALTH_RECORDS_ABI, HEALTH_RECORDS_ADDRESS } from "@/lib/contracts";

export default function DoctorPortal() {
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuthorization, setCheckingAuthorization] = useState(false);

  useEffect(() => {
    // Check if already connected on mount
    async function checkConnection() {
      const account = await getCurrentAccount();
      if (account) {
        const conn = await connectWallet();
        setConnection(conn);
        if (conn) {
          await checkAuthorizationStatus(conn);
        }
      }
      setLoading(false);
    }

    checkConnection();

    // Listen for account changes
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        setConnection(null);
        setIsAuthorized(false);
      } else {
        const conn = await connectWallet();
        setConnection(conn);
        if (conn) {
          await checkAuthorizationStatus(conn);
        }
      }
    };

    onAccountsChanged(handleAccountsChanged);
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            Swasthya Sanchar
          </Link>
          <div>
            {connection ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Connected:</span>
                <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-mono text-sm">
                  {formatAddress(connection.account)}
                </span>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Doctor Portal</h1>
          <p className="text-lg text-gray-600">
            Access and manage patient medical records
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
              Please connect your MetaMask wallet to access the doctor portal
            </p>
            <button
              onClick={handleConnect}
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 text-lg"
            >
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Authorization Check Status */}
            {checkingAuthorization ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Checking authorization status...</p>
              </div>
            ) : (
              <>
                {/* Connected Dashboard */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-3 h-3 rounded-full ${isAuthorized ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Your Dashboard
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-2">
                    Connected as: <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{connection.account}</span>
                  </p>
                  {isAuthorized ? (
                    <div className="mb-4">
                      <p className="text-green-600 font-medium mb-2">
                        ✓ Authorized Doctor
                      </p>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <p className="text-gray-500">
                          🏥 Patient record management features will be added in the next phase.
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          Coming soon: Create records, view patient data, and more.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <p className="text-yellow-800 font-medium">Not Authorized</p>
                          <p className="text-yellow-700 text-sm mt-1">
                            Your wallet address is not authorized as a doctor. Please contact the system administrator to request authorization.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Future Features Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500 ${!isAuthorized && 'opacity-50'}`}>
                    <h3 className="font-semibold text-gray-900 mb-2">👨‍⚕️ Authorization</h3>
                    <p className="text-sm text-gray-600">{isAuthorized ? 'Authorized' : 'Not authorized'}</p>
                  </div>
                  <div className={`bg-white rounded-lg shadow p-4 border-l-4 border-green-500 ${!isAuthorized && 'opacity-50'}`}>
                    <h3 className="font-semibold text-gray-900 mb-2">📋 Create Records</h3>
                    <p className="text-sm text-gray-600">Add new medical records</p>
                  </div>
                  <div className={`bg-white rounded-lg shadow p-4 border-l-4 border-blue-500 ${!isAuthorized && 'opacity-50'}`}>
                    <h3 className="font-semibold text-gray-900 mb-2">👥 Patients</h3>
                    <p className="text-sm text-gray-600">View patient records</p>
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
