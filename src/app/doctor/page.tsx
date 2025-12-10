"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { connectWallet, onAccountsChanged, readContract, type WalletConnection } from "@/lib/web3";
import { Navbar } from "@/components/Navbar";
import { 
  User, Mail, Phone, Calendar, MapPin, Award, Building, 
  FileText, Shield, CheckCircle, AlertCircle, ArrowRight
} from "lucide-react";

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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    specialization: "",
    qualification: "",
    experience: "",
    hospital: "",
    city: "",
    state: ""
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
        router.push(session.user.role === "patient" ? "/patient" : "/");
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
      
      // Mock data - in production, fetch from database
      const mockData: DoctorData = {
        name: session?.user?.email?.split("@")[0] || "Dr. Smith",
        email: session?.user?.email || "",
        phone: "+91 98765 43210",
        licenseNumber: "MCI-" + Math.random().toString(36).substring(7).toUpperCase(),
        specialization: "General Physician",
        qualification: "MBBS, MD",
        experience: "5 years",
        hospital: "City General Hospital",
        city: "Mumbai",
        state: "Maharashtra",
        walletAddress: conn.account,
        isAuthorized: Boolean(isAuthorized)
      };

      setDoctorData(mockData);
      setIsRegistered(Boolean(isAuthorized));
      setFormData({
        name: mockData.name,
        email: mockData.email,
        phone: mockData.phone,
        licenseNumber: mockData.licenseNumber,
        specialization: mockData.specialization,
        qualification: mockData.qualification,
        experience: mockData.experience,
        hospital: mockData.hospital,
        city: mockData.city,
        state: mockData.state
      });
    } catch (error) {
      console.error("Error loading doctor data:", error);
      setIsRegistered(false);
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
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Doctor Profile
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Manage your professional information and credentials
          </p>
        </div>

        {/* Authorization Status */}
        <div className={`mb-6 rounded-xl p-4 border ${
          doctorData?.isAuthorized 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        }`}>
          <div className="flex items-center gap-3">
            {doctorData?.isAuthorized ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            )}
            <div>
              <p className={`font-semibold ${
                doctorData?.isAuthorized 
                  ? 'text-green-900 dark:text-green-100'
                  : 'text-yellow-900 dark:text-yellow-100'
              }`}>
                {doctorData?.isAuthorized ? 'Authorized Doctor' : 'Authorization Pending'}
              </p>
              <p className={`text-sm ${
                doctorData?.isAuthorized 
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-yellow-800 dark:text-yellow-200'
              }`}>
                {doctorData?.isAuthorized 
                  ? 'You can access patient records with consent'
                  : 'Contact the system administrator to authorize your wallet address'}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">
              Professional Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  <Award className="w-4 h-4" />
                  License Number
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  <FileText className="w-4 h-4" />
                  Specialization
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  <Award className="w-4 h-4" />
                  Qualification
                </label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  <Calendar className="w-4 h-4" />
                  Experience
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  <Building className="w-4 h-4" />
                  Hospital/Clinic
                </label>
                <input
                  type="text"
                  value={formData.hospital}
                  onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  <MapPin className="w-4 h-4" />
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  <MapPin className="w-4 h-4" />
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>

            <button
              className="mt-6 w-full px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition font-medium"
            >
              Save Profile
            </button>
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
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    doctorData?.isAuthorized 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                  }`}>
                    {doctorData?.isAuthorized ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {doctorData?.isAuthorized ? 'Authorized' : 'Pending'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href="/doctor/home"
                  className="flex items-center justify-between w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
                >
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
