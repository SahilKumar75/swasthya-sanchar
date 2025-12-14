"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { FooterSection } from "@/components/ui/footer-section";
import { CardFlip, CardFlipFront, CardFlipBack } from "@/components/ui/card-flip";
import {
  Edit2, User, Calendar, Phone, Mail, MapPin, AlertCircle, Heart, Activity,
  FileText, QrCode, Save, X, Shield, ArrowUpRight, Loader2, Share2
} from "lucide-react";
import QRCode from "qrcode";

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
  height: string;
  weight: string;
}

export default function PatientPortal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [qrCode, setQrCode] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<PatientData | null>(null);
  const [updating, setUpdating] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");

  useEffect(() => {
    // Development bypass - skip auth checks if enabled
    if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') {
      console.log('[DEV BYPASS] 🔓 Patient portal - auth bypass enabled');
      return;
    }

    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    loadPatientData();
  }, [session]);

  async function loadPatientData() {
    try {
      setLoading(true);

      // Development bypass - use mock data
      if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') {
        console.log('[DEV BYPASS] 🔓 Loading mock patient data');
        const mockProfile: PatientData = {
          name: "John Doe",
          dateOfBirth: "1990-01-15",
          gender: "male",
          bloodGroup: "O+",
          phone: "+91 9876543210",
          email: "john.doe@example.com",
          address: "123 Main Street",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
          emergencyName: "Jane Doe",
          emergencyRelation: "Spouse",
          emergencyPhone: "+91 9876543211",
          allergies: "Penicillin, Peanuts",
          chronicConditions: "None",
          currentMedications: "None",
          previousSurgeries: "Appendectomy (2015)",
          height: "175",
          weight: "70"
        };

        setPatientData(mockProfile);
        setEditFormData(mockProfile);
        setWalletAddress("0x1234567890abcdef1234567890abcdef12345678");

        // Generate QR code
        const emergencyUrl = `${window.location.origin}/emergency/0x1234567890abcdef1234567890abcdef12345678`;
        const qr = await QRCode.toDataURL(emergencyUrl, { width: 200, margin: 2 });
        setQrCode(qr);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/patient/profile");
      const data = await res.json();

      if (data.error) {
        console.error("Error loading profile:", data.error);
        return;
      }

      const profile: PatientData = {
        name: session?.user?.email?.split('@')[0] || "Patient",
        dateOfBirth: data.dateOfBirth || "",
        gender: data.gender || "",
        bloodGroup: data.bloodGroup || "",
        phone: data.phone || "",
        email: session?.user?.email || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
        emergencyName: data.emergencyName || "",
        emergencyRelation: data.emergencyRelation || "",
        emergencyPhone: data.emergencyPhone || "",
        allergies: data.allergies || "",
        chronicConditions: data.chronicConditions || "",
        currentMedications: data.currentMedications || "",
        previousSurgeries: data.previousSurgeries || "",
        height: data.height || "",
        weight: data.weight || ""
      };

      setPatientData(profile);
      setEditFormData(profile);
      setWalletAddress(data.walletAddress || "");

      // Generate QR code
      if (data.walletAddress) {
        const emergencyUrl = `${window.location.origin}/emergency/${data.walletAddress}`;
        const qr = await QRCode.toDataURL(emergencyUrl, { width: 200, margin: 2 });
        setQrCode(qr);
      }
    } catch (error) {
      console.error("Error loading patient data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile() {
    if (!editFormData) return;

    try {
      setUpdating(true);
      const res = await fetch("/api/patient/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData)
      });

      const data = await res.json();

      if (data.error) {
        alert("Failed to update profile: " + data.error);
        return;
      }

      await loadPatientData();
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  }

  const handleEditChange = (field: keyof PatientData, value: string) => {
    if (editFormData) {
      setEditFormData({ ...editFormData, [field]: value });
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "N/A";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Allow rendering without session if DEV_BYPASS is enabled
  if (!session && process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH !== 'true') {
    return null;
  }

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-24">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-yellow-900 mb-2">No Profile Data</h2>
            <p className="text-yellow-700 mb-4">Please complete your registration first.</p>
            <button
              onClick={() => router.push("/patient-portal/home")}
              className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header with Wallet Address */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">My Portal</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">Manage your complete health profile</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditFormData(patientData);
                  }}
                  disabled={updating}
                  className="flex items-center gap-2 px-5 py-2.5 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-xl hover:bg-neutral-300 dark:hover:bg-neutral-600 transition disabled:opacity-50 font-medium"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition disabled:opacity-50 font-medium shadow-lg shadow-blue-500/30"
                >
                  <Save className="w-4 h-4" />
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
                  <Shield className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Wallet Address</p>
                    <p className="text-xs text-neutral-900 dark:text-neutral-100 font-mono">
                      {walletAddress ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}` : "Not registered"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">

          {/* Personal Information and Emergency Contact - Stacked Column (Spans 2 rows) */}
          <div className="lg:col-span-2 lg:row-span-2 flex flex-col gap-4">
            {/* Personal Information - Compact */}
            <div className="bg-white dark:bg-neutral-800/50 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                    <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Personal Information</h3>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                    title="Edit Profile"
                  >
                    <Edit2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editFormData?.name || ""}
                      onChange={(e) => handleEditChange("name", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm"
                    />
                  ) : (
                    <p className="text-base text-neutral-900 dark:text-neutral-100 font-semibold">{patientData.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">DOB</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editFormData?.dateOfBirth || ""}
                      onChange={(e) => handleEditChange("dateOfBirth", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm"
                    />
                  ) : (
                    <p className="text-sm text-neutral-900 dark:text-neutral-100 font-medium">
                      {patientData.dateOfBirth ? `${patientData.dateOfBirth.split('-')[0]} (${calculateAge(patientData.dateOfBirth)} yrs)` : "N/A"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">Gender</label>
                  {isEditing ? (
                    <select
                      value={editFormData?.gender || ""}
                      onChange={(e) => handleEditChange("gender", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p className="text-sm text-neutral-900 dark:text-neutral-100 font-medium capitalize">{patientData.gender || "N/A"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">Blood Group</label>
                  {isEditing ? (
                    <select
                      value={editFormData?.bloodGroup || ""}
                      onChange={(e) => handleEditChange("bloodGroup", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm"
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">{patientData.bloodGroup || "N/A"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editFormData?.phone || ""}
                      onChange={(e) => handleEditChange("phone", e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm"
                    />
                  ) : (
                    <p className="text-sm text-neutral-900 dark:text-neutral-100 font-medium">{patientData.phone || "N/A"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">Email</label>
                  <p className="text-sm text-neutral-900 dark:text-neutral-100 font-medium truncate">{patientData.email}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">Address</label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={editFormData?.address || ""}
                        onChange={(e) => handleEditChange("address", e.target.value)}
                        placeholder="Street address"
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 mb-2 text-sm"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={editFormData?.city || ""}
                          onChange={(e) => handleEditChange("city", e.target.value)}
                          placeholder="City"
                          className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm"
                        />
                        <input
                          type="text"
                          value={editFormData?.state || ""}
                          onChange={(e) => handleEditChange("state", e.target.value)}
                          placeholder="State"
                          className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm"
                        />
                        <input
                          type="text"
                          value={editFormData?.pincode || ""}
                          onChange={(e) => handleEditChange("pincode", e.target.value)}
                          placeholder="Pincode"
                          className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm"
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-neutral-900 dark:text-neutral-100 font-medium">
                      {patientData.address || "N/A"}
                      {(patientData.city || patientData.state || patientData.pincode) && (
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {", "}{[patientData.city, patientData.state, patientData.pincode].filter(Boolean).join(", ")}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact - Fills remaining space */}
            <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-red-900/20 dark:via-rose-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-red-200 dark:border-red-800 p-4 shadow-sm hover:shadow-md transition-shadow flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Emergency Contact</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-red-700 dark:text-red-300 mb-1 uppercase tracking-wider">Contact Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editFormData?.emergencyName || ""}
                      onChange={(e) => handleEditChange("emergencyName", e.target.value)}
                      placeholder="Emergency contact name"
                      className="w-full px-3 py-2 rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-red-900/30 text-red-900 dark:text-red-100 text-sm"
                    />
                  ) : (
                    <p className="text-base text-red-900 dark:text-red-100 font-semibold">{patientData.emergencyName || "Not provided"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-red-700 dark:text-red-300 mb-1 uppercase tracking-wider">Relationship</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editFormData?.emergencyRelation || ""}
                      onChange={(e) => handleEditChange("emergencyRelation", e.target.value)}
                      placeholder="e.g., Spouse, Parent"
                      className="w-full px-3 py-2 rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-red-900/30 text-red-900 dark:text-red-100 text-sm"
                    />
                  ) : (
                    <p className="text-base text-red-900 dark:text-red-100 font-semibold capitalize">{patientData.emergencyRelation || "Not provided"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-red-700 dark:text-red-300 mb-1 uppercase tracking-wider">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editFormData?.emergencyPhone || ""}
                      onChange={(e) => handleEditChange("emergencyPhone", e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full px-3 py-2 rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-red-900/30 text-red-900 dark:text-red-100 text-sm"
                    />
                  ) : (
                    <p className="text-base text-red-900 dark:text-red-100 font-semibold">{patientData.emergencyPhone || "Not provided"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Vitals and Medical Information - Stacked Column (Spans 2 rows) */}
          <div className="lg:row-span-2 flex flex-col gap-4">
            {/* Physical Measurements - Compact Card */}
            <div className="bg-white dark:bg-neutral-800/50 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                  <Activity className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Vitals</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">Height</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editFormData?.height || ""}
                      onChange={(e) => handleEditChange("height", e.target.value)}
                      placeholder="cm"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    />
                  ) : (
                    <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{patientData.height ? `${patientData.height} cm` : "N/A"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">Weight</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editFormData?.weight || ""}
                      onChange={(e) => handleEditChange("weight", e.target.value)}
                      placeholder="kg"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    />
                  ) : (
                    <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{patientData.weight ? `${patientData.weight} kg` : "N/A"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Information - Bluish Theme (Stacked below Vitals) */}
            <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-blue-900/20 dark:via-sky-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-4 shadow-sm hover:shadow-md transition-shadow flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Medical Info</h3>
              </div>
              <div className="grid grid-cols-1 gap-3 flex-1">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">Allergies</label>
                  {isEditing ? (
                    <textarea
                      value={editFormData?.allergies || ""}
                      onChange={(e) => handleEditChange("allergies", e.target.value)}
                      placeholder="List allergies"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm"
                    />
                  ) : (
                    <p className="text-sm text-neutral-900 dark:text-neutral-100 leading-relaxed">{patientData.allergies || "None"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">Conditions</label>
                  {isEditing ? (
                    <textarea
                      value={editFormData?.chronicConditions || ""}
                      onChange={(e) => handleEditChange("chronicConditions", e.target.value)}
                      placeholder="List conditions"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm"
                    />
                  ) : (
                    <p className="text-sm text-neutral-900 dark:text-neutral-100 leading-relaxed">{patientData.chronicConditions || "None"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">Medications</label>
                  {isEditing ? (
                    <textarea
                      value={editFormData?.currentMedications || ""}
                      onChange={(e) => handleEditChange("currentMedications", e.target.value)}
                      placeholder="List medications"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm"
                    />
                  ) : (
                    <p className="text-sm text-neutral-900 dark:text-neutral-100 leading-relaxed">{patientData.currentMedications || "None"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">Surgeries</label>
                  {isEditing ? (
                    <textarea
                      value={editFormData?.previousSurgeries || ""}
                      onChange={(e) => handleEditChange("previousSurgeries", e.target.value)}
                      placeholder="List surgeries"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm"
                    />
                  ) : (
                    <p className="text-sm text-neutral-900 dark:text-neutral-100 leading-relaxed">{patientData.previousSurgeries || "None"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Emergency QR Code - Tall Card with Flip Animation (Rightmost) */}
          <div className="lg:row-span-2 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-900/20 dark:via-red-900/20 dark:to-pink-900/20 rounded-2xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-full blur-3xl"></div>

            <Link
              href={`/emergency/${walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 right-4 p-2 rounded-lg bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:shadow-lg transition-shadow group z-10"
            >
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <div className="relative z-10 p-6 h-full flex flex-col">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">Emergency QR</h3>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Hover to see actions
                </p>
              </div>

              <CardFlip className="flex-1" height="100%">
                <CardFlipFront>
                  {({ onFlip }) => (
                    <div className="flex flex-col h-full">
                      {qrCode ? (
                        <div className="mb-4">
                          <div className="w-full p-4 bg-white rounded-xl shadow-lg flex items-center justify-center">
                            <img src={qrCode} alt="Emergency QR Code" className="w-48 h-48" />
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4">
                          <div className="w-full p-4 bg-white/50 dark:bg-neutral-800/50 rounded-xl flex items-center justify-center">
                            <Loader2 className="w-12 h-12 animate-spin text-neutral-400" />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 flex-1 flex flex-col justify-end">
                        <button
                          onClick={() => {
                            if (qrCode) {
                              const link = document.createElement('a');
                              link.download = 'emergency-qr-code.png';
                              link.href = qrCode;
                              link.click();
                            }
                          }}
                          className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-3.5 rounded-xl hover:shadow-lg transition-shadow font-semibold flex items-center justify-center gap-2 text-base"
                        >
                          <QrCode className="w-5 h-5" />
                          Download QR
                        </button>

                        <button
                          onClick={() => {
                            const emergencyUrl = `${window.location.origin}/emergency/${walletAddress}`;
                            navigator.clipboard.writeText(emergencyUrl);
                            alert('Emergency link copied to clipboard!');
                          }}
                          className="w-full bg-white dark:bg-neutral-800 text-orange-600 dark:text-orange-400 border-2 border-orange-200 dark:border-orange-800 py-3.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors font-semibold flex items-center justify-center gap-2 text-base"
                        >
                          <Share2 className="w-5 h-5" />
                          Share Link
                        </button>

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-2">
                          Hover to preview emergency info
                        </p>
                      </div>
                    </div>
                  )}
                </CardFlipFront>

                <CardFlipBack>
                  {({ onFlip }) => (
                    <div className="flex flex-col h-full p-4 overflow-y-auto">
                      <div className="text-center mb-3">
                        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-1" />
                        <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-50">Emergency Info Preview</h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                          What responders will see
                        </p>
                      </div>

                      <div className="space-y-2 text-xs flex-1">
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-2 border border-neutral-200 dark:border-neutral-700">
                          <p className="text-neutral-500 dark:text-neutral-400 font-semibold mb-1">Patient</p>
                          <p className="text-neutral-900 dark:text-neutral-100 font-medium">{patientData.name}</p>
                        </div>

                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-2 border border-neutral-200 dark:border-neutral-700">
                          <p className="text-neutral-500 dark:text-neutral-400 font-semibold mb-1">Blood Group</p>
                          <p className="text-red-600 dark:text-red-400 font-bold text-base">{patientData.bloodGroup || "N/A"}</p>
                        </div>

                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-2 border border-neutral-200 dark:border-neutral-700">
                          <p className="text-neutral-500 dark:text-neutral-400 font-semibold mb-1">Allergies</p>
                          <p className="text-neutral-900 dark:text-neutral-100">{patientData.allergies || "None"}</p>
                        </div>

                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-2 border border-neutral-200 dark:border-neutral-700">
                          <p className="text-neutral-500 dark:text-neutral-400 font-semibold mb-1">Emergency Contact</p>
                          <p className="text-neutral-900 dark:text-neutral-100 font-medium">{patientData.emergencyName || "N/A"}</p>
                          <p className="text-neutral-600 dark:text-neutral-400">{patientData.emergencyPhone || "N/A"}</p>
                        </div>

                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-2 border border-neutral-200 dark:border-neutral-700">
                          <p className="text-neutral-500 dark:text-neutral-400 font-semibold mb-1">Conditions</p>
                          <p className="text-neutral-900 dark:text-neutral-100">{patientData.chronicConditions || "None"}</p>
                        </div>
                      </div>

                      <button
                        onClick={onFlip}
                        className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors py-2"
                      >
                        ← Back to QR
                      </button>
                    </div>
                  )}
                </CardFlipBack>
              </CardFlip>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
