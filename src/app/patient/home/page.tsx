"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { connectWallet, readContract, type WalletConnection } from "@/lib/web3";
import { Navbar } from "@/components/Navbar";
import { Edit2, User, Calendar, Phone, Mail, MapPin, AlertCircle, Heart, Activity, FileText } from "lucide-react";

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
}

export default function PatientHome() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
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
        console.log("No wallet connected yet");
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
          previousSurgeries: emergencyData.previousSurgeries || ""
        });
      }
    } catch (error) {
      console.error("Error loading patient data:", error);
    }
  }

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
            <p className="text-neutral-600 dark:text-neutral-400">
              Please connect your MetaMask wallet to view your profile.
            </p>
          </div>
        </main>
      </div>
    );
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

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <Navbar connection={connection} />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-12 pt-24">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Hi, {patientData?.name?.split(' ')[0] || "there"} 👋
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Welcome to your health dashboard
          </p>
        </div>

        {!patientData ? (
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-8 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">
              No profile data found. Please complete your registration first.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {calculateAge(patientData.dateOfBirth)}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Years Old</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg border border-red-200 dark:border-red-800 p-6">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                  {patientData.bloodGroup || "N/A"}
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">Blood Group</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800 p-6">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {calculateHealthScore()}%
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">Profile Complete</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800 p-6">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {patientData.emergencyName ? "✓" : "✗"}
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">Emergency Contact</p>
              </div>
            </div>

            {/* Health Metrics */}
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
                  Health Metrics
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition"
                >
                  <Edit2 className="w-3 h-3" />
                  View Details
                </button>
              </div>

              <div className="space-y-6">
                {/* Age Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Age Progress (0-100 years)
                    </span>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {calculateAge(patientData.dateOfBirth)} years
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((calculateAge(patientData.dateOfBirth) / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* BMI Indicator */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Health Score (Profile Completeness)
                    </span>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {calculateHealthScore()}/100
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        calculateHealthScore() >= 80 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : calculateHealthScore() >= 50 
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' 
                          : 'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${calculateHealthScore()}%` }}
                    ></div>
                  </div>
                </div>

                {/* Activity Level */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Medical Data Completeness
                    </span>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {[patientData.allergies, patientData.chronicConditions, patientData.currentMedications, patientData.previousSurgeries].filter(f => f && f.trim()).length}/4 fields
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${([patientData.allergies, patientData.chronicConditions, patientData.currentMedications, patientData.previousSurgeries].filter(f => f && f.trim()).length / 4) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Emergency Preparedness */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Emergency Preparedness
                    </span>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {[patientData.emergencyName, patientData.emergencyPhone, patientData.bloodGroup, patientData.allergies].filter(f => f && f.trim()).length}/4 critical fields
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${([patientData.emergencyName, patientData.emergencyPhone, patientData.bloodGroup, patientData.allergies].filter(f => f && f.trim()).length / 4) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg border-2 border-red-200 dark:border-red-800 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  <h3 className="text-xl font-bold text-red-900 dark:text-red-100">Emergency QR</h3>
                </div>
                <p className="text-red-700 dark:text-red-200 mb-4 text-sm">
                  Generate your life-saving QR code for first responders
                </p>
                <Link
                  href="/patient/emergency"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition font-medium text-sm"
                >
                  Generate QR Code →
                </Link>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">Full Profile</h3>
                </div>
                <p className="text-blue-700 dark:text-blue-200 mb-4 text-sm">
                  View and manage all your health information
                </p>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition font-medium text-sm"
                >
                  View Profile →
                </button>
              </div>
            </div>

            {/* Full Profile Details */}
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
    </div>
  );
}

