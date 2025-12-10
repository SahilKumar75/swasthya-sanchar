"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { connectWallet, readContract, type WalletConnection } from "@/lib/web3";
import { Navbar } from "@/components/Navbar";
import { FooterSection } from "@/components/ui/footer-section";
import { 
  Stethoscope, Users, FileCheck, Clock, TrendingUp, Calendar, 
  Activity, UserCheck, Shield, ClipboardList, Bell, ArrowUpRight
} from "lucide-react";

interface DoctorStats {
  totalPatients: number;
  todayAppointments: number;
  pendingRecords: number;
  recentAccessRequests: number;
  authorizedStatus: boolean;
  activeConsultations: number;
}

export default function DoctorHome() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [stats, setStats] = useState<DoctorStats>({
    totalPatients: 0,
    todayAppointments: 0,
    pendingRecords: 0,
    recentAccessRequests: 0,
    authorizedStatus: false,
    activeConsultations: 0
  });

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
        router.push(session.user.role === "patient" ? "/patient/home" : "/");
        return;
      }

      try {
        const conn = await connectWallet();
        if (conn) {
          setConnection(conn);
          await linkWalletToAccount(conn.account);
          await loadDoctorStats(conn);
        }
      } catch (error) {
        console.log("No wallet connected yet");
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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-neutral-100"></div>
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
            Doctor Dashboard
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Welcome back, Dr. {session?.user?.email?.split("@")[0]}
          </p>
        </div>

        {/* Authorization Status Banner */}
        {connection && !stats.authorizedStatus && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900 dark:text-yellow-100">Authorization Pending</p>
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
                <h3 className="text-lg font-medium mb-2">Total Patients</h3>
                <p className="text-5xl font-bold mb-2">{stats.totalPatients}</p>
                <p className="text-blue-100 text-sm">Under your care</p>
              </div>
              <Link href="/doctor#patients" className="flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all">
                View all patients <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Today's Appointments */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow">
            <Calendar className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Today</p>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">{stats.todayAppointments}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">Appointments</p>
          </div>

          {/* Active Consultations */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow">
            <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Active</p>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">{stats.activeConsultations}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">Consultations</p>
          </div>

          {/* Authorization Status */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-3">
              <Shield className={`w-8 h-8 ${stats.authorizedStatus ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                stats.authorizedStatus 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
              }`}>
                {stats.authorizedStatus ? 'Authorized' : 'Pending'}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
              Blockchain Status
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {stats.authorizedStatus 
                ? 'You are authorized to access patient records'
                : 'Authorization required for full access'}
            </p>
          </div>

          {/* Pending Records */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow">
            <FileCheck className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-3" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Pending</p>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">{stats.pendingRecords}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">Records</p>
          </div>

          {/* Access Requests */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow">
            <Bell className="w-8 h-8 text-red-600 dark:text-red-400 mb-3" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">New</p>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">{stats.recentAccessRequests}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">Requests</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/doctor#patients"
              className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">View Patients</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Access patient records</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/doctor#create-records"
              className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">Create Record</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Add new medical record</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/doctor#authorization"
              className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">Authorization</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Check status</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">Recent Activity</h2>
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                <div className="bg-green-100 dark:bg-green-900/30 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 dark:text-neutral-50">New patient access granted</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Patient 0xf39f...2266 granted access</p>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-500">2 hours ago</p>
              </div>
              
              <div className="flex items-center gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 dark:text-neutral-50">Medical record created</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Record #1247 for consultation</p>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-500">5 hours ago</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 dark:text-neutral-50">Access request received</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">New patient requested access</p>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
