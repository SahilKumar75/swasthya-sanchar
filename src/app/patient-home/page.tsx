"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { connectWallet, readContract, type WalletConnection } from "@/lib/web3";
import { Navbar } from "@/components/Navbar";
import { FooterSection } from "@/components/ui/footer-section";
import {
  Edit2, User, Calendar, Phone, Mail, MapPin, AlertCircle, Heart, Activity,
  FileText, TrendingUp, Droplet, Stethoscope, Clock, Pill, FileCheck,
  ArrowUpRight, ArrowDownRight, Scale, Users
} from "lucide-react";

interface PatientData {
  name: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  allergies: string;
  chronicConditions: string;
  currentMedications: string;
  previousSurgeries: string;
  height?: string;
  weight?: string;
}

interface HealthMetrics {
  bmi: number;
  bmiCategory: string;
  lastCheckup: string;
  lastDoctor: string;
  bloodRarity: string;
  bloodPercentage: number;
  upcomingAppointments: number;
  medicationCount: number;
  documentCount: number;
}

export default function PatientHome() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

      if (session.user.role !== "patient") {
        router.push(session.user.role === "doctor" ? "/doctor/home" : "/patient-home");
        return;
      }

      // Auto-connect wallet
      try {
        const conn = await connectWallet();
        if (conn) {
          setConnection(conn);
          await linkWalletToAccount(conn.account);
          await loadPatientData(conn);
        }
      } catch (error) {
        console.log("Wallet connection failed, user can connect manually");
      }

      setLoading(false);
    }

    checkAuth();
  }, [session, status, router]);

  async function loadPatientData(conn: WalletConnection) {
    try {
      const result = await readContract(conn, "getPatient", [conn.account]);
      const patient = result as any;

      console.log("Loaded patient data:", patient);

      if (patient && patient.name) {
        // Parse the emergency contact hash to get additional data
        let emergencyData: any = {};
        try {
          if (patient.emergencyProfileHash) {
            emergencyData = JSON.parse(patient.emergencyProfileHash);
          }
        } catch (parseError) {
          console.error("Error parsing emergency data:", parseError);
        }

        // Calculate age from timestamp
        const birthDate = new Date(Number(patient.dateOfBirth) * 1000);
        const dateOfBirth = birthDate.toISOString().split('T')[0];

        setPatientData({
          name: patient.name || "",
          dateOfBirth: dateOfBirth,
          gender: emergencyData.gender || "",
          bloodGroup: emergencyData.bloodGroup || "",
          phone: emergencyData.phone || "",
          email: emergencyData.email || session?.user?.email || "",
          address: emergencyData.address || "",
          city: emergencyData.city || "",
          state: emergencyData.state || "",
          pincode: emergencyData.pincode || "",
          emergencyName: emergencyData.name || "",
          emergencyRelation: emergencyData.relation || "",
          emergencyPhone: emergencyData.emergencyPhone || "",
          allergies: emergencyData.allergies || "",
          chronicConditions: emergencyData.chronicConditions || "",
          currentMedications: emergencyData.currentMedications || "",
          previousSurgeries: emergencyData.previousSurgeries || "",
          height: emergencyData.height || "170", // Mock data in cm
          weight: emergencyData.weight || "70" // Mock data in kg
        });
      }
    } catch (error) {
      console.error("Error loading patient data:", error);
    }
  }

  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate BMI and health metrics
  const calculateHealthMetrics = (): HealthMetrics => {
    if (!patientData) {
      return {
        bmi: 0,
        bmiCategory: "Unknown",
        lastCheckup: "No records",
        lastDoctor: "Not available",
        bloodRarity: "Unknown",
        bloodPercentage: 0,
        upcomingAppointments: 0,
        medicationCount: 0,
        documentCount: 0
      };
    }

    const height = parseFloat(patientData.height || "170") / 100; // Convert cm to m
    const weight = parseFloat(patientData.weight || "70");
    const bmi = weight / (height * height);

    let bmiCategory = "";
    if (bmi < 18.5) bmiCategory = "Underweight";
    else if (bmi < 25) bmiCategory = "Normal";
    else if (bmi < 30) bmiCategory = "Overweight";
    else bmiCategory = "Obese";

    // Blood group rarity data (India statistics)
    const bloodRarityMap: { [key: string]: { rarity: string; percentage: number } } = {
      "O+": { rarity: "Common", percentage: 35 },
      "A+": { rarity: "Common", percentage: 30 },
      "B+": { rarity: "Common", percentage: 25 },
      "AB+": { rarity: "Rare", percentage: 7 },
      "O-": { rarity: "Very Rare", percentage: 1.5 },
      "A-": { rarity: "Rare", percentage: 0.8 },
      "B-": { rarity: "Rare", percentage: 0.5 },
      "AB-": { rarity: "Extremely Rare", percentage: 0.2 }
    };

    const bloodInfo = bloodRarityMap[patientData.bloodGroup] || { rarity: "Unknown", percentage: 0 };

    // Mock data for last checkup (would come from medical records in production)
    const mockLastCheckup = new Date();
    mockLastCheckup.setDate(mockLastCheckup.getDate() - 45); // 45 days ago

    const medicationCount = patientData.currentMedications
      ? patientData.currentMedications.split(',').length
      : 0;

    return {
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory,
      lastCheckup: mockLastCheckup.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastDoctor: "Dr. Rajesh Kumar", // Mock data
      bloodRarity: bloodInfo.rarity,
      bloodPercentage: bloodInfo.percentage,
      upcomingAppointments: 2, // Mock data
      medicationCount,
      documentCount: 8 // Mock data
    };
  };

  // Calculate health score based on data completeness
  const calculateHealthScore = () => {
    if (!patientData) return 0;
    let score = 0;
    const fields = [
      patientData.name, patientData.dateOfBirth, patientData.bloodGroup,
      patientData.phone, patientData.email, patientData.address,
      patientData.emergencyName, patientData.emergencyPhone,
      patientData.allergies, patientData.chronicConditions
    ];
    fields.forEach(field => {
      if (field && field.trim() !== "") score += 10;
    });
    return score;
  };

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

  if (!connection) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900">
        <Navbar connection={connection} />
        <main className="max-w-5xl mx-auto px-6 lg:px-8 py-12 pt-24">
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-8 text-center">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Please connect your MetaMask wallet to view your profile.
            </p>
            <button
              onClick={async () => {
                const conn = await connectWallet();
                if (conn) {
                  setConnection(conn);
                  await linkWalletToAccount(conn.account);
                  await loadPatientData(conn);
                }
              }}
              className="px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition"
            >
              Connect Wallet
            </button>
          </div>
        </main>
      </div>
    );
  }

  const healthMetrics = calculateHealthMetrics();

  // Calculate BMI category and percentage
  const calculateBMIInfo = (age: number) => {
    // Simulated BMI calculation based on age (would need height/weight in real scenario)
    // Normal range: 18.5-24.9
    const simulatedBMI = 22.5; // Placeholder
    return {
      value: simulatedBMI,
      percentage: ((simulatedBMI - 18.5) / (24.9 - 18.5)) * 100,
      status: simulatedBMI < 18.5 ? "Underweight" : simulatedBMI <= 24.9 ? "Normal" : simulatedBMI <= 29.9 ? "Overweight" : "Obese"
    };
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <Navbar connection={connection} />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 pt-24">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                Welcome back, {patientData?.name?.split(' ')[0] || "there"}!
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                Here's your health overview for today
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Patient ID</p>
              <p className="text-xs font-mono text-neutral-700 dark:text-neutral-300">
                {connection.account.slice(0, 10)}...{connection.account.slice(-8)}
              </p>
            </div>
          </div>
        </div>

        {!patientData ? (
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-8 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">
              No profile data found. Please complete your registration first.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Bento Grid Layout - Health Dashboard */}
            <div className="grid grid-cols-12 gap-4 auto-rows-[180px]">

              {/* BMI Card - Large Feature */}
              <div className="col-span-12 md:col-span-4 row-span-2 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-xl">
                      <Scale className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                      Body Mass Index
                    </span>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-6xl font-bold text-emerald-900 dark:text-emerald-100">
                        {healthMetrics.bmi}
                      </span>
                      <span className="text-2xl text-emerald-700 dark:text-emerald-300">kg/m²</span>
                    </div>
                    <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
                      {healthMetrics.bmiCategory}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Weight</p>
                      <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{patientData.weight} kg</p>
                    </div>
                    <div className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Height</p>
                      <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{patientData.height} cm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Last Checkup */}
              <div className="col-span-6 md:col-span-4 row-span-1 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Last Visit</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                    {healthMetrics.lastCheckup}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">45 days ago</p>
                </div>
              </div>

              {/* Last Doctor */}
              <div className="col-span-6 md:col-span-4 row-span-1 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl border border-violet-200 dark:border-violet-800 p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-lg">
                    <Stethoscope className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <span className="text-xs font-medium text-violet-700 dark:text-violet-300">Doctor</span>
                </div>
                <div>
                  <p className="text-lg font-bold text-violet-900 dark:text-violet-100 mb-1">
                    {healthMetrics.lastDoctor}
                  </p>
                  <p className="text-sm text-violet-700 dark:text-violet-300">General Physician</p>
                </div>
              </div>

              {/* Blood Group Rarity */}
              <div className="col-span-12 md:col-span-4 row-span-1 bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 rounded-2xl border-2 border-rose-200 dark:border-rose-800 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-lg">
                    <Droplet className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                    {healthMetrics.bloodRarity}
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-rose-900 dark:text-rose-100">
                    {patientData.bloodGroup}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-rose-700 dark:text-rose-300 mb-1">
                      {healthMetrics.bloodPercentage}% of population
                    </p>
                    <div className="w-full bg-white/50 dark:bg-neutral-800/50 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-rose-500 to-red-600 h-1.5 rounded-full"
                        style={{ width: `${Math.min(healthMetrics.bloodPercentage * 2, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Medications */}
              <div className="col-span-6 md:col-span-4 row-span-1 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-lg">
                    <Pill className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Active</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold text-amber-900 dark:text-amber-100">
                      {healthMetrics.medicationCount}
                    </span>
                    <span className="text-lg text-amber-700 dark:text-amber-300">meds</span>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">Current prescriptions</p>
                </div>
              </div>

              {/* Medical Documents */}
              <div className="col-span-6 md:col-span-4 row-span-1 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-lg">
                    <FileCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Records</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold text-indigo-900 dark:text-indigo-100">
                      {healthMetrics.documentCount}
                    </span>
                    <span className="text-lg text-indigo-700 dark:text-indigo-300">docs</span>
                  </div>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">Medical documents</p>
                </div>
              </div>

              {/* Current Location/Address */}
              <div className="col-span-12 md:col-span-6 row-span-1 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-4">
                <div className="p-3 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-xl">
                  <MapPin className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Current Address</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                    {patientData.address || "Address not set"}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {patientData.city}, {patientData.state} - {patientData.pincode}
                  </p>
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="col-span-6 md:col-span-3 row-span-1 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-5 flex flex-col justify-between">
                <div className="p-2.5 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-lg w-fit">
                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold text-green-900 dark:text-green-100">
                      {healthMetrics.upcomingAppointments}
                    </span>
                    <ArrowUpRight className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">Upcoming visits</p>
                </div>
              </div>

              {/* Age Stats */}
              <div className="col-span-6 md:col-span-3 row-span-1 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl border border-pink-200 dark:border-pink-800 p-5 flex flex-col justify-between">
                <div className="p-2.5 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-lg w-fit">
                  <Users className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold text-pink-900 dark:text-pink-100">
                      {calculateAge(patientData.dateOfBirth)}
                    </span>
                    <span className="text-lg text-pink-700 dark:text-pink-300">yrs</span>
                  </div>
                  <p className="text-sm text-pink-700 dark:text-pink-300">{patientData.gender || "N/A"}</p>
                </div>
              </div>

              {/* Quick Actions - Emergency QR */}
              <div className="col-span-6 md:col-span-4 row-span-1 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl">
                    <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Profile Score</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold text-green-900 dark:text-green-100">
                      {calculateHealthScore()}
                    </span>
                    <span className="text-2xl text-green-700 dark:text-green-300">%</span>
                  </div>
                  <div className="w-full bg-white/50 dark:bg-neutral-800/50 rounded-full h-2 mt-4">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${calculateHealthScore()}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="col-span-6 md:col-span-4 row-span-1 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl border border-red-200 dark:border-red-800 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">Emergency</span>
                </div>
                <div>
                  <p className="text-lg font-bold text-red-900 dark:text-red-100 mb-1">
                    {patientData.emergencyName || "Not set"}
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {patientData.emergencyRelation || "Relation not set"}
                  </p>
                  {patientData.emergencyPhone && (
                    <p className="text-sm font-mono text-red-800 dark:text-red-200 mt-2">
                      {patientData.emergencyPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Actions - Emergency QR */}
              <Link
                href="/patient/emergency"
                className="col-span-6 md:col-span-3 row-span-1 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer group"
              >
                <div className="p-3 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl w-fit">
                  <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-1 group-hover:translate-x-1 transition-transform">
                    Emergency QR →
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Generate code
                  </p>
                </div>
              </Link>

              {/* Medical Records */}
              <Link
                href="/patient/records"
                className="col-span-6 md:col-span-3 row-span-1 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl border-2 border-amber-200 dark:border-amber-800 p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer group"
              >
                <div className="p-3 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl w-fit">
                  <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-1 group-hover:translate-x-1 transition-transform">
                    Medical Records →
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    View history
                  </p>
                </div>
              </Link>

              {/* Doctor Access */}
              <Link
                href="/patient/permissions"
                className="col-span-6 md:col-span-3 row-span-1 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl border-2 border-cyan-200 dark:border-cyan-800 p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer group"
              >
                <div className="p-3 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl w-fit">
                  <User className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-cyan-900 dark:text-cyan-100 mb-1 group-hover:translate-x-1 transition-transform">
                    Doctor Access →
                  </p>
                  <p className="text-sm text-cyan-700 dark:text-cyan-300">
                    Manage permissions
                  </p>
                </div>
              </Link>

              {/* Activity Stats */}
              <div className="col-span-6 md:col-span-3 row-span-1 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl border border-violet-200 dark:border-violet-800 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl">
                    <Activity className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <span className="text-sm font-medium text-violet-700 dark:text-violet-300">Medical Data</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold text-violet-900 dark:text-violet-100">
                      {[patientData.allergies, patientData.chronicConditions, patientData.currentMedications, patientData.previousSurgeries].filter(f => f && f.trim()).length}
                    </span>
                    <span className="text-2xl text-violet-700 dark:text-violet-300">/4</span>
                  </div>
                  <p className="text-sm text-violet-700 dark:text-violet-300">Fields complete</p>
                </div>
              </div>

              {/* Allergies Alert */}
              {patientData.allergies && (
                <div className="col-span-12 md:col-span-6 row-span-1 bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 rounded-2xl border-2 border-rose-200 dark:border-rose-800 p-6 flex items-center gap-4">
                  <div className="p-3 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl">
                    <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-rose-700 dark:text-rose-300 mb-1">Known Allergies</p>
                    <p className="text-lg font-bold text-rose-900 dark:text-rose-100">
                      {patientData.allergies}
                    </p>
                  </div>
                </div>
              )}

              {/* Medications */}
              {patientData.currentMedications && (
                <div className="col-span-12 md:col-span-6 row-span-1 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl border border-teal-200 dark:border-teal-800 p-6 flex items-center gap-4">
                  <div className="p-3 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl">
                    <Heart className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-teal-700 dark:text-teal-300 mb-1">Current Medications</p>
                    <p className="text-lg font-bold text-teal-900 dark:text-teal-100">
                      {patientData.currentMedications}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Health Advisory Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                  <Heart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                    Health Advisory
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Based on your health profile</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-blue-100 dark:border-blue-900">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-1">BMI Status: {healthMetrics.bmiCategory}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Your BMI is {healthMetrics.bmi}. {healthMetrics.bmiCategory === "Normal"
                          ? "Great job maintaining a healthy weight!"
                          : "Consider consulting with a nutritionist for personalized advice."}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-blue-100 dark:border-blue-900">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-1">Regular Checkups</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Last checkup was 45 days ago. Schedule your next appointment within 2 weeks.
                      </p>
                    </div>
                  </div>
                </div>
                {patientData.allergies && (
                  <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-red-100 dark:border-red-900">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-1">Allergy Alert</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          Always inform healthcare providers about your allergies: {patientData.allergies}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-blue-100 dark:border-blue-900">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                      <Pill className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-1">Medication Adherence</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {healthMetrics.medicationCount > 0
                          ? `Take your ${healthMetrics.medicationCount} prescribed medication(s) as directed.`
                          : "No active medications. Keep up with preventive care!"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/patient/records"
                className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800 p-6 hover:scale-[1.02] transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-2">
                  Medical Records
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Access your complete medical history and documents
                </p>
              </Link>

              <Link
                href="/patient/emergency"
                className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl border-2 border-red-200 dark:border-red-800 p-6 hover:scale-[1.02] transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-red-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">
                  Emergency QR
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Generate your emergency medical QR code
                </p>
              </Link>

              <Link
                href="/patient-home/permissions"
                className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800 p-6 hover:scale-[1.02] transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <User className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
                  Doctor Access
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Manage doctor permissions to your records
                </p>
              </Link>
            </div>

            {/* Full Profile Details - Show when button clicked */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <Edit2 className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {isEditing ? "Hide" : "View"} Complete Medical Profile
                </span>
              </div>
            </button>

            {isEditing && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
                      Personal Information
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        Full Name
                      </label>
                      <p className="text-lg text-neutral-900 dark:text-neutral-100 font-medium">
                        {patientData.name || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        Date of Birth
                      </label>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-neutral-500" />
                        <p className="text-lg text-neutral-900 dark:text-neutral-100 font-medium">
                          {patientData.dateOfBirth || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        Gender
                      </label>
                      <p className="text-lg text-neutral-900 dark:text-neutral-100 font-medium capitalize">
                        {patientData.gender || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        Blood Group
                      </label>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-red-500" />
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">
                          {patientData.bloodGroup || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
                      Contact Information
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        Phone Number
                      </label>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-neutral-500" />
                        <p className="text-lg text-neutral-900 dark:text-neutral-100 font-medium">
                          {patientData.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        Email
                      </label>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-neutral-500" />
                        <p className="text-lg text-neutral-900 dark:text-neutral-100 font-medium">
                          {patientData.email || session?.user?.email || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        Address
                      </label>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-neutral-500 mt-1" />
                        <div>
                          <p className="text-lg text-neutral-900 dark:text-neutral-100 font-medium">
                            {patientData.address || "Not provided"}
                          </p>
                          {(patientData.city || patientData.state || patientData.pincode) && (
                            <p className="text-neutral-600 dark:text-neutral-400">
                              {[patientData.city, patientData.state, patientData.pincode].filter(Boolean).join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    <h2 className="text-2xl font-semibold text-red-900 dark:text-red-100">
                      Emergency Contact
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                        Contact Name
                      </label>
                      <p className="text-lg text-red-900 dark:text-red-100 font-medium">
                        {patientData.emergencyName || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                        Relationship
                      </label>
                      <p className="text-lg text-red-900 dark:text-red-100 font-medium capitalize">
                        {patientData.emergencyRelation || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                        Phone Number
                      </label>
                      <p className="text-lg text-red-900 dark:text-red-100 font-medium">
                        {patientData.emergencyPhone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
                      Medical Information
                    </h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        Known Allergies
                      </label>
                      <p className="text-neutral-900 dark:text-neutral-100">
                        {patientData.allergies || "None reported"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        Chronic Conditions
                      </label>
                      <p className="text-neutral-900 dark:text-neutral-100">
                        {patientData.chronicConditions || "None reported"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        Current Medications
                      </label>
                      <p className="text-neutral-900 dark:text-neutral-100">
                        {patientData.currentMedications || "None reported"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        Previous Surgeries
                      </label>
                      <p className="text-neutral-900 dark:text-neutral-100">
                        {patientData.previousSurgeries || "None reported"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Blockchain Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100">
                      Blockchain Information
                    </h2>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                      Wallet Address
                    </label>
                    <p className="text-blue-900 dark:text-blue-100 font-mono text-sm bg-blue-100 dark:bg-blue-900/40 px-3 py-2 rounded border border-blue-200 dark:border-blue-800">
                      {connection.account}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                      ✓ Your medical records are securely stored on the blockchain
                    </p>
                  </div>
                </div>

                {/* Edit Mode Notice */}
                {isEditing && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 p-6">
                    <p className="text-yellow-900 dark:text-yellow-100 font-medium">
                      🚧 Edit functionality coming soon! You'll be able to update your information through a blockchain transaction.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}

