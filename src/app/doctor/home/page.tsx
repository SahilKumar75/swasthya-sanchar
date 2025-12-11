"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { connectWallet, readContract, type WalletConnection } from "@/lib/web3";
import { Navbar } from "@/components/Navbar";
import { FooterSection } from "@/components/ui/footer-section";
import { useLanguage } from "@/contexts/LanguageContext";
import UploadRecord from "@/components/upload-record";
import RecordViewer from "@/components/record-viewer";
import {
  Stethoscope, Users, FileCheck, Clock, TrendingUp, Calendar,
  Activity, UserCheck, Shield, ClipboardList, Bell, ArrowUpRight,
  Upload, Eye, X
} from "lucide-react";

interface DoctorStats {
  totalPatients: number;
  todayAppointments: number;
  pendingRecords: number;
  recentAccessRequests: number;
  authorizedStatus: boolean;
  activeConsultations: number;
}

interface MedicalRecord {
  id: bigint;
  patient: string;
  doctor: string;
  recordHash: string;
  timestamp: bigint;
  recordType: string;
  notes: string;
}

export default function DoctorHome() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [stats, setStats] = useState<DoctorStats>({
    totalPatients: 0,
    todayAppointments: 0,
    pendingRecords: 0,
    recentAccessRequests: 0,
    authorizedStatus: false,
    activeConsultations: 0
  });
  const [patientAddress, setPatientAddress] = useState("");
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

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
        router.push(session.user.role === "patient" ? "/patient-home" : "/");
        return;
      }

      // Auto-connect wallet
      try {
        const conn = await connectWallet();
        if (conn) {
          setConnection(conn);
          await linkWalletToAccount(conn.account);
          await loadDoctorStats(conn);
        }
      } catch (error) {
        console.log("Wallet connection failed, user can connect manually");
      }
    }

    checkAuth();
  }, [session, status, router]);

  async function loadDoctorStats(conn: WalletConnection) {
    try {
      // Check authorization status
      const isAuthorized = await readContract(conn, "authorizedDoctors", [conn.account]);

      // Mock data - replace with actual blockchain/database queries
      setStats({
        totalPatients: 24,
        todayAppointments: 5,
        pendingRecords: 3,
        recentAccessRequests: 2,
        authorizedStatus: Boolean(isAuthorized),
        activeConsultations: 2
      });
    } catch (error) {
      console.error("Error loading doctor stats:", error);
    }
  }

  async function fetchPatientRecords() {
    if (!connection || !patientAddress) return;

    setLoadingRecords(true);
    try {
      // Check if doctor is authorized by patient
      const authorized = await readContract(connection, "isDoctorAuthorized", [
        patientAddress as `0x${string}`,
        connection.account
      ]);

      setIsAuthorized(Boolean(authorized));

      if (!authorized) {
        setRecords([]);
        setLoadingRecords(false);
        return;
      }

      // Fetch patient records
      const recordIds = await readContract(connection, "getPatientRecords", [
        patientAddress as `0x${string}`
      ]) as unknown as bigint[];

      // Fetch each record's details
      const recordsData = await Promise.all(
        recordIds.map(async (id) => {
          const record = await readContract(connection, "medicalRecords", [id]) as any;
          console.log('Fetched record from blockchain:', record);

          // Blockchain returns array: [recordId, patient, doctor, recordHash, timestamp, isActive]
          const recordData = {
            id: record[0], // recordId
            patient: record[1], // patient address
            doctor: record[2], // doctor address
            recordHash: record[3], // IPFS hash
            timestamp: record[4], // timestamp
            isActive: record[5], // isActive
            recordType: "General", // Not stored in contract
            notes: "" // Not stored in contract
          };

          console.log('Mapped record data:', recordData);
          return recordData;
        })
      );

      console.log('All records data:', recordsData);
      setRecords(recordsData);
    } catch (error) {
      console.error("Error fetching records:", error);
      setRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-neutral-100"></div>
        <span className="ml-3 text-neutral-900 dark:text-neutral-100">{t.common.loading}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Navbar connection={connection} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            {t.dashboard.doctorDashboard}
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            {t.dashboard.welcome}, Dr. {session?.user?.email?.split("@")[0]}
          </p>
        </div>

        {/* Authorization Status Banner */}
        {connection && !stats.authorizedStatus && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900 dark:text-yellow-100">{t.doctorReg.pendingAuth}</p>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Your wallet address is not authorized as a doctor. Please contact the system administrator.
              </p>
            </div>
          </div>
        )}

        {/* Bento Grid Dashboard */}
        <div className="grid grid-cols-12 gap-4 auto-rows-[180px] mb-8">
          {/* Total Patients - Large Card */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">{t.dashboard.totalPatients}</h3>
                <p className="text-5xl font-bold mb-2">{stats.totalPatients}</p>
                <p className="text-blue-100 text-sm">{t.dashboard.underYourCare}</p>
              </div>
              <Link href="/doctor#patients" className="flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all">
                {t.dashboard.viewRecords} <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Today's Appointments */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow">
            <Calendar className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{t.dashboard.today}</p>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">{stats.todayAppointments}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">{t.dashboard.upcomingAppointments}</p>
          </div>

          {/* Active Consultations */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow">
            <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{t.dashboard.active}</p>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">{stats.activeConsultations}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">{t.dashboard.consultations}</p>
          </div>

          {/* Authorization Status */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-3">
              <Shield className={`w-8 h-8 ${stats.authorizedStatus ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${stats.authorizedStatus
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                }`}>
                {stats.authorizedStatus ? t.doctorReg.authorized : t.doctorReg.pendingAuth}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
              {t.doctorReg.blockchainIdentity}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {stats.authorizedStatus
                ? t.doctorReg.authorized
                : t.doctorReg.pendingAuth}
            </p>
          </div>

          {/* Pending Records */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow">
            <FileCheck className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-3" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{t.dashboard.pending}</p>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">{stats.pendingRecords}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">{t.dashboard.records}</p>
          </div>

          {/* Access Requests */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow">
            <Bell className="w-8 h-8 text-red-600 dark:text-red-400 mb-3" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{t.dashboard.new}</p>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">{stats.recentAccessRequests}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">{t.dashboard.requests}</p>
          </div>
        </div>

        {/* Patient Records Section */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">Patient Medical Records</h2>

          {/* Patient Address Input */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              placeholder="Enter patient wallet address (0x...)"
              className="flex-1 px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 dark:text-neutral-100"
            />
            <button
              onClick={fetchPatientRecords}
              disabled={!patientAddress || loadingRecords}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {loadingRecords ? "Loading..." : "Load Records"}
            </button>
            <button
              onClick={() => setShowUpload(!showUpload)}
              disabled={!patientAddress || !isAuthorized}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Record
            </button>
          </div>

          {/* Upload Section */}
          {showUpload && patientAddress && isAuthorized && connection && (
            <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Upload New Medical Record</h3>
                <button
                  onClick={() => setShowUpload(false)}
                  className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <UploadRecord
                patientAddress={patientAddress as `0x${string}`}
                connection={connection}
                onSuccess={() => {
                  setShowUpload(false);
                  fetchPatientRecords();
                }}
              />
            </div>
          )}

          {/* Authorization Status Message */}
          {patientAddress && !loadingRecords && !isAuthorized && records.length === 0 && (
            <div className="text-center py-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <Shield className="w-16 h-16 text-yellow-600 dark:text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Not Authorized</h3>
              <p className="text-yellow-800 dark:text-yellow-200">
                You don't have permission to view this patient's records. The patient must grant you access first.
              </p>
            </div>
          )}

          {/* Records List */}
          {records.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
                Medical Records ({records.length})
              </h3>
              {records.map((record) => (
                <div
                  key={record.id.toString()}
                  className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-medium rounded">
                        {record.recordType}
                      </span>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {new Date(Number(record.timestamp) * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      {record.notes || "No notes provided"}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1 font-mono">
                      IPFS: {record.recordHash?.slice(0, 20) || 'N/A'}...
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedRecord(record)}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!patientAddress && (
            <div className="text-center py-12 text-neutral-500 dark:text-neutral-500">
              <FileCheck className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Enter a patient's wallet address to view their medical records</p>
            </div>
          )}
        </div>

        {/* Record Viewer Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Medical Record</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
                <RecordViewer
                  recordHash={selectedRecord.recordHash}
                  recordType={selectedRecord.recordType}
                  metadata={{
                    doctor: selectedRecord.doctor,
                    timestamp: selectedRecord.timestamp,
                    notes: selectedRecord.notes
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <FooterSection />
    </div>
  );
}
