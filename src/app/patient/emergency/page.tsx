"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { connectWallet, getCurrentAccount, formatAddress, onAccountsChanged, type WalletConnection } from "@/lib/web3";
import { mockEmergencyProfile } from "@/lib/mockRecords";

export default function EmergencyProfilePage() {
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrGenerated, setQrGenerated] = useState(false);

  useEffect(() => {
    async function checkConnection() {
      const account = await getCurrentAccount();
      if (account) {
        const conn = await connectWallet();
        setConnection(conn);
      }
      setLoading(false);
    }

    checkConnection();

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        setConnection(null);
      } else {
        const conn = await connectWallet();
        setConnection(conn);
      }
    };

    onAccountsChanged(handleAccountsChanged);
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    const conn = await connectWallet();
    setConnection(conn);
    setLoading(false);
  };

  const handleGenerateQR = () => {
    setQrGenerated(true);
  };

  const getEmergencyUrl = () => {
    if (!connection) return "";
    // For development, use localhost. In production, this would be the Vercel URL
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    return `${baseUrl}/emergency/${connection.account}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/patient" className="text-2xl font-bold text-red-600">
            ← Back to Patient Portal
          </Link>
          <div>
            {connection ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Connected:</span>
                <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-mono text-sm">
                  {formatAddress(connection.account)}
                </span>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={loading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Emergency Profile</h1>
          <p className="text-lg text-gray-600">
            Generate your life-saving QR code—instant access for first responders, no wallet needed
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
              Please connect your wallet to view your emergency profile
            </p>
            <button
              onClick={handleConnect}
              disabled={loading}
              className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-lg"
            >
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Emergency Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Your Emergency Information</h2>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  Emergency Access
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium text-gray-700">Patient Address:</span></p>
                    <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">{connection.account}</p>
                    <p><span className="font-medium text-gray-700">Blood Group:</span> {mockEmergencyProfile.bloodGroup}</p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Emergency Contact</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium text-gray-700">Name:</span> {mockEmergencyProfile.emergencyContact.name}</p>
                    <p><span className="font-medium text-gray-700">Relationship:</span> {mockEmergencyProfile.emergencyContact.relationship}</p>
                    <p><span className="font-medium text-gray-700">Phone:</span> {mockEmergencyProfile.emergencyContact.phone}</p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Allergies</h3>
                  <div className="space-y-1">
                    {mockEmergencyProfile.allergies.map((allergy, idx) => (
                      <span key={idx} className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Medical Conditions</h3>
                  <div className="space-y-1">
                    {mockEmergencyProfile.medicalConditions.map((condition, idx) => (
                      <span key={idx} className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Current Medications</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {mockEmergencyProfile.currentMedications.map((med, idx) => (
                    <li key={idx}>{med}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency QR Code</h2>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
                {!qrGenerated ? (
                  <>
                    <svg className="w-24 h-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <p className="text-gray-600 mb-4 text-center">
                      Generate your life-saving QR code—responders scan it to access critical info instantly
                    </p>
                    <button
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
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
                    <p className="text-green-600 font-semibold mb-2">✓ QR Code Generated</p>
                    <p className="text-sm text-gray-600 text-center mb-4">
                      🚨 Responders scan this—no wallet, no login—instant access to your allergies, blood type, meds, and emergency contacts
                    </p>
                    <p className="text-xs text-gray-500 text-center bg-gray-100 p-2 rounded font-mono break-all max-w-md">
                      {getEmergencyUrl()}
                    </p>
                    <button
                      className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
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
