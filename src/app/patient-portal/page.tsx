"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { FooterSection } from "@/components/ui/footer-section";
import {
  Edit2, User, Calendar, Phone, Mail, MapPin, AlertCircle, Heart, Activity,
  FileText, QrCode, Save, X, Shield, ArrowUpRight, Loader2
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

  if (!session) {
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header with Edit Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">Patient Portal</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">Manage your complete health profile</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditFormData(patientData);
                  }}
                  disabled={updating}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editFormData?.name || ""}
                      onChange={(e) => handleEditChange("name", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    />
                  ) : (
                    <p className="text-lg text-neutral-900 dark:text-neutral-100 font-medium">{patientData.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editFormData?.dateOfBirth || ""}
                      onChange={(e) => handleEditChange("dateOfBirth", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      <p className="text-lg text-neutral-900 dark:text-neutral-100 font-medium">
                        {patientData.dateOfBirth ? `${patientData.dateOfBirth} (${calculateAge(patientData.dateOfBirth)} years)` : "Not provided"}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Gender</label>
                  {isEditing ? (
                    <select
                      value={editFormData?.gender || ""}
                      onChange={(e) => handleEditChange("gender", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p className="text-lg text-neutral-900 dark:text-neutral-100 font-medium capitalize">{patientData.gender || "Not provided"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Blood Group</label>
                  {isEditing ? (
                    <select
                      value={editFormData?.bloodGroup || ""}
                      onChange={(e) => handleEditChange("bloodGroup", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    >
                      <option value="">Select Blood Group</option>
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
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-red-500" />
                      <p className="text-lg font-bold text-red-600 dark:text-red-400">{patientData.bloodGroup || "Not provided"}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Contact Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editFormData?.phone || ""}
                      onChange={(e) => handleEditChange("phone", e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-neutral-500" />
                      <p className="text-lg text-neutral-900 dark:text-neutral-100 font-medium">{patientData.phone || "Not provided"}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-neutral-500" />
                    <p className="text-lg text-neutral-900 dark:text-neutral-100 font-medium">{patientData.email}</p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Address</label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={editFormData?.address || ""}
                        onChange={(e) => handleEditChange("address", e.target.value)}
                        placeholder="Street address"
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 mb-2"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={editFormData?.city || ""}
                          onChange={(e) => handleEditChange("city", e.target.value)}
                          placeholder="City"
                          className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                        />
                        <input
                          type="text"
                          value={editFormData?.state || ""}
                          onChange={(e) => handleEditChange("state", e.target.value)}
                          placeholder="State"
                          className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                        />
                        <input
                          type="text"
                          value={editFormData?.pincode || ""}
                          onChange={(e) => handleEditChange("pincode", e.target.value)}
                          placeholder="Pincode"
                          className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                        />
                      </div>
                    </>
                  ) : (
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
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                <h3 className="text-xl font-semibold text-red-900 dark:text-red-100">Emergency Contact</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">Contact Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editFormData?.emergencyName || ""}
                      onChange={(e) => handleEditChange("emergencyName", e.target.value)}
                      placeholder="Emergency contact name"
                      className="w-full px-3 py-2 rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-red-900/30 text-red-900 dark:text-red-100"
                    />
                  ) : (
                    <p className="text-lg text-red-900 dark:text-red-100 font-medium">{patientData.emergencyName || "Not provided"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">Relationship</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editFormData?.emergencyRelation || ""}
                      onChange={(e) => handleEditChange("emergencyRelation", e.target.value)}
                      placeholder="e.g., Spouse, Parent"
                      className="w-full px-3 py-2 rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-red-900/30 text-red-900 dark:text-red-100"
                    />
                  ) : (
                    <p className="text-lg text-red-900 dark:text-red-100 font-medium capitalize">{patientData.emergencyRelation || "Not provided"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editFormData?.emergencyPhone || ""}
                      onChange={(e) => handleEditChange("emergencyPhone", e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full px-3 py-2 rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-red-900/30 text-red-900 dark:text-red-100"
                    />
                  ) : (
                    <p className="text-lg text-red-900 dark:text-red-100 font-medium">{patientData.emergencyPhone || "Not provided"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Medical Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Known Allergies</label>
                  {isEditing ? (
                    <textarea
                      value={editFormData?.allergies || ""}
                      onChange={(e) => handleEditChange("allergies", e.target.value)}
                      placeholder="List any known allergies"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    />
                  ) : (
                    <p className="text-neutral-900 dark:text-neutral-100">{patientData.allergies || "None reported"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Chronic Conditions</label>
                  {isEditing ? (
                    <textarea
                      value={editFormData?.chronicConditions || ""}
                      onChange={(e) => handleEditChange("chronicConditions", e.target.value)}
                      placeholder="List any chronic conditions"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    />
                  ) : (
                    <p className="text-neutral-900 dark:text-neutral-100">{patientData.chronicConditions || "None reported"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Current Medications</label>
                  {isEditing ? (
                    <textarea
                      value={editFormData?.currentMedications || ""}
                      onChange={(e) => handleEditChange("currentMedications", e.target.value)}
                      placeholder="List current medications"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    />
                  ) : (
                    <p className="text-neutral-900 dark:text-neutral-100">{patientData.currentMedications || "None reported"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Previous Surgeries</label>
                  {isEditing ? (
                    <textarea
                      value={editFormData?.previousSurgeries || ""}
                      onChange={(e) => handleEditChange("previousSurgeries", e.target.value)}
                      placeholder="List any previous surgeries"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    />
                  ) : (
                    <p className="text-neutral-900 dark:text-neutral-100">{patientData.previousSurgeries || "None reported"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Physical Measurements */}
            <div className="bg-white dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Physical Measurements</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Height (cm)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editFormData?.height || ""}
                      onChange={(e) => handleEditChange("height", e.target.value)}
                      placeholder="e.g., 170"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    />
                  ) : (
                    <p className="text-neutral-900 dark:text-neutral-100">{patientData.height ? `${patientData.height} cm` : "Not provided"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Weight (kg)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editFormData?.weight || ""}
                      onChange={(e) => handleEditChange("weight", e.target.value)}
                      placeholder="e.g., 70"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    />
                  ) : (
                    <p className="text-neutral-900 dark:text-neutral-100">{patientData.weight ? `${patientData.weight} kg` : "Not provided"}</p>
                  )}
                </div>

              </div>
            </div>

            {/* Blockchain Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Blockchain Information</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Wallet Address</label>
                <p className="text-blue-900 dark:text-blue-100 font-mono text-sm bg-blue-100 dark:bg-blue-900/40 px-3 py-2 rounded border border-blue-200 dark:border-blue-800 break-all">
                  {walletAddress || "Not registered"}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  ✓ Your medical records are securely stored on the blockchain
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar with QR Code */}
          <div className="space-y-6">
            <div className="sticky top-24">
              {/* Emergency QR Code */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-lg hover:shadow-xl transition-shadow relative">
                <Link
                  href={`/emergency/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-6 right-6 p-2 rounded-lg bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:shadow-lg transition-shadow group z-10"
                >
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>

                <div className="text-center mb-6 pr-12">
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Emergency QR Code</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Scan for instant emergency access
                  </p>
                </div>

                {qrCode ? (
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-white rounded-xl border-4 border-neutral-200 dark:border-neutral-700">
                      <img src={qrCode} alt="Emergency QR Code" className="w-48 h-48" />
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center mb-6">
                    <div className="w-48 h-48 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <p className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    Blockchain-secured data
                  </p>
                  <p className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-600" />
                    Critical medical info
                  </p>
                  <p className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    Instant emergency access
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (qrCode) {
                      const link = document.createElement('a');
                      link.download = 'emergency-qr-code.png';
                      link.href = qrCode;
                      link.click();
                    }
                  }}
                  className="w-full mt-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-3 rounded-lg hover:shadow-lg transition-shadow font-medium"
                >
                  Download QR Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
