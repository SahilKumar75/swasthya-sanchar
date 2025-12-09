"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { connectWallet, onAccountsChanged, readContract, writeContract, type WalletConnection } from "@/lib/web3";
import { PatientHeader } from "@/components/ui/patient-header";
import { Edit2, User, Calendar, Phone, Mail, MapPin, AlertCircle, Heart, Activity, FileText, QrCode, Save, X, Lock, Unlock, Eye, EyeOff, Shield } from "lucide-react";
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
  waistCircumference: string;
  lastCheckedDate: string;
  privacySettings: PrivacySettings;
}

interface PrivacySettings {
  // Always public for emergency responders
  bloodGroup: boolean;  // Always true
  allergies: boolean;   // Always true
  chronicConditions: boolean;  // Always true
  currentMedications: boolean; // Always true
  
  // User can control
  name: boolean;
  dateOfBirth: boolean;
  gender: boolean;
  phone: boolean;
  email: boolean;
  address: boolean;
  emergencyContact: boolean;
  height: boolean;
  weight: boolean;
  waistCircumference: boolean;
  previousSurgeries: boolean;
}

function RegisteredDashboard({ connection }: { connection: WalletConnection }) {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<PatientData | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadPatientData();
  }, [connection]);

  async function loadPatientData() {
    try {
      const result = await readContract(connection, "getPatient", [connection.account]);
      const patient = result as any;

      console.log("Raw patient data from blockchain:", patient);
      console.log("Emergency profile hash:", patient.emergencyProfileHash);

      if (patient && patient.name) {
        let emergencyData: any = {};
        try {
          if (patient.emergencyProfileHash) {
            console.log("Parsing emergency profile hash:", patient.emergencyProfileHash);
            emergencyData = JSON.parse(patient.emergencyProfileHash);
            console.log("Parsed emergency data:", emergencyData);
          }
        } catch (parseError) {
          console.error("Error parsing emergency data:", parseError);
        }
        
        const birthDate = new Date(Number(patient.dateOfBirth) * 1000);
        const dateOfBirth = birthDate.toISOString().split('T')[0];

        const data: PatientData = {
          name: patient.name || "",
          dateOfBirth: dateOfBirth,
          gender: emergencyData.gender || "",
          bloodGroup: emergencyData.bloodGroup || "",
          phone: emergencyData.phone || "",
          email: emergencyData.email || "",
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
          height: emergencyData.height || "",
          weight: emergencyData.weight || "",
          waistCircumference: emergencyData.waistCircumference || "",
          lastCheckedDate: emergencyData.lastCheckedDate || "",
          privacySettings: emergencyData.privacySettings || {
            // Always public for emergency
            bloodGroup: true,
            allergies: true,
            chronicConditions: true,
            currentMedications: true,
            // Default to public for critical info
            name: true,
            dateOfBirth: true,
            gender: true,
            phone: true,
            email: false,
            address: true,
            emergencyContact: true,
            height: false,
            weight: false,
            waistCircumference: false,
            previousSurgeries: false
          }
        };

        setPatientData(data);
        setEditFormData(data); // Initialize edit form with current data
        
        // Sync to database cache
        try {
          await fetch("/api/patient/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              patientData: data,
              walletAddress: connection.account,
            }),
          });
          console.log("✓ Dashboard data synced to cache");
        } catch (syncError) {
          console.error("Failed to sync dashboard data:", syncError);
        }
        
        // Generate QR code
        const emergencyUrl = `${window.location.origin}/emergency/${connection.account}`;
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

      // Prepare updated data
      const dateTimestamp = BigInt(Math.floor(new Date(editFormData.dateOfBirth).getTime() / 1000));
      
      const emergencyData = {
        gender: editFormData.gender,
        bloodGroup: editFormData.bloodGroup,
        phone: editFormData.phone,
        email: editFormData.email,
        address: editFormData.address,
        city: editFormData.city,
        state: editFormData.state,
        pincode: editFormData.pincode,
        name: editFormData.emergencyName,
        relation: editFormData.emergencyRelation,
        emergencyPhone: editFormData.emergencyPhone,
        allergies: editFormData.allergies,
        chronicConditions: editFormData.chronicConditions,
        currentMedications: editFormData.currentMedications,
        previousSurgeries: editFormData.previousSurgeries,
        height: editFormData.height,
        weight: editFormData.weight,
        waistCircumference: editFormData.waistCircumference,
        lastCheckedDate: editFormData.lastCheckedDate,
        privacySettings: editFormData.privacySettings
      };
      
      const emergencyHash = JSON.stringify(emergencyData);

      // Update on blockchain
      await writeContract(
        connection,
        "updatePatient",
        [editFormData.name, dateTimestamp, emergencyHash]
      );

      console.log("✓ Profile updated on blockchain");

      // Sync to database cache
      await fetch("/api/patient/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientData: editFormData,
          walletAddress: connection.account,
        }),
      });

      console.log("✓ Profile synced to database");

      // Reload data
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

  const handlePrivacyChange = (field: keyof PrivacySettings, value: boolean) => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        privacySettings: {
          ...editFormData.privacySettings,
          [field]: value
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-neutral-100 mx-auto mb-4"></div>
        <p className="text-neutral-600 dark:text-neutral-400">Loading your profile...</p>
      </div>
    );
  }

  const calculateAge = (dob: string) => {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">Your Profile</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Complete health information at a glance</p>
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
                  <p className="text-lg text-neutral-900 dark:text-neutral-100 font-medium">{patientData?.name || <span className="text-neutral-400">Not provided</span>}</p>
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
                      {patientData?.dateOfBirth ? `${patientData.dateOfBirth} (${calculateAge(patientData.dateOfBirth)} years)` : <span className="text-neutral-400">Not provided</span>}
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
                  <p className="text-lg text-neutral-900 dark:text-neutral-100 font-medium capitalize">{patientData?.gender || <span className="text-neutral-400">Not provided</span>}</p>
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
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">{patientData?.bloodGroup || <span className="text-neutral-400 font-normal">Not provided</span>}</p>
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
                    <p className="text-lg text-neutral-900 dark:text-neutral-100 font-medium">{patientData?.phone || <span className="text-neutral-400">Not provided</span>}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editFormData?.email || ""}
                    onChange={(e) => handleEditChange("email", e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-neutral-500" />
                    <p className="text-lg text-neutral-900 dark:text-neutral-100 font-medium">{patientData?.email || <span className="text-neutral-400">Not provided</span>}</p>
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData?.address || ""}
                    onChange={(e) => handleEditChange("address", e.target.value)}
                    placeholder="Street address"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                ) : (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-neutral-500 mt-1" />
                    <div>
                      <p className="text-lg text-neutral-900 dark:text-neutral-100 font-medium">
                        {patientData?.address || <span className="text-neutral-400">Not provided</span>}
                      </p>
                      {(patientData?.city || patientData?.state || patientData?.pincode) && (
                        <p className="text-neutral-600 dark:text-neutral-400">
                          {[patientData?.city, patientData?.state, patientData?.pincode].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {isEditing && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">City</label>
                    <input
                      type="text"
                      value={editFormData?.city || ""}
                      onChange={(e) => handleEditChange("city", e.target.value)}
                      placeholder="City"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">State</label>
                    <input
                      type="text"
                      value={editFormData?.state || ""}
                      onChange={(e) => handleEditChange("state", e.target.value)}
                      placeholder="State"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={editFormData?.pincode || ""}
                      onChange={(e) => handleEditChange("pincode", e.target.value)}
                      placeholder="Pincode"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                </>
              )}
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
                  <p className="text-lg text-red-900 dark:text-red-100 font-medium">{patientData?.emergencyName || <span className="text-red-400">Not provided</span>}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">Relationship</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData?.emergencyRelation || ""}
                    onChange={(e) => handleEditChange("emergencyRelation", e.target.value)}
                    placeholder="e.g., Spouse, Parent, Sibling"
                    className="w-full px-3 py-2 rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-red-900/30 text-red-900 dark:text-red-100"
                  />
                ) : (
                  <p className="text-lg text-red-900 dark:text-red-100 font-medium capitalize">{patientData?.emergencyRelation || <span className="text-red-400">Not provided</span>}</p>
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
                  <p className="text-lg text-red-900 dark:text-red-100 font-medium">{patientData?.emergencyPhone || <span className="text-red-400">Not provided</span>}</p>
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
                    placeholder="List any known allergies (e.g., Penicillin, Peanuts)"
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                ) : (
                  <p className="text-neutral-900 dark:text-neutral-100">{patientData?.allergies || <span className="text-neutral-400">None reported</span>}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Chronic Conditions</label>
                {isEditing ? (
                  <textarea
                    value={editFormData?.chronicConditions || ""}
                    onChange={(e) => handleEditChange("chronicConditions", e.target.value)}
                    placeholder="List any chronic conditions (e.g., Diabetes, Hypertension)"
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                ) : (
                  <p className="text-neutral-900 dark:text-neutral-100">{patientData?.chronicConditions || <span className="text-neutral-400">None reported</span>}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Current Medications</label>
                {isEditing ? (
                  <textarea
                    value={editFormData?.currentMedications || ""}
                    onChange={(e) => handleEditChange("currentMedications", e.target.value)}
                    placeholder="List current medications with dosage"
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                ) : (
                  <p className="text-neutral-900 dark:text-neutral-100">{patientData?.currentMedications || <span className="text-neutral-400">None reported</span>}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Previous Surgeries</label>
                {isEditing ? (
                  <textarea
                    value={editFormData?.previousSurgeries || ""}
                    onChange={(e) => handleEditChange("previousSurgeries", e.target.value)}
                    placeholder="List any previous surgeries with dates"
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                ) : (
                  <p className="text-neutral-900 dark:text-neutral-100">{patientData?.previousSurgeries || <span className="text-neutral-400">None reported</span>}</p>
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
                  <p className="text-neutral-900 dark:text-neutral-100">{patientData?.height ? `${patientData.height} cm` : <span className="text-neutral-400">Not provided</span>}</p>
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
                  <p className="text-neutral-900 dark:text-neutral-100">{patientData?.weight ? `${patientData.weight} kg` : <span className="text-neutral-400">Not provided</span>}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Waist Circumference (cm)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editFormData?.waistCircumference || ""}
                    onChange={(e) => handleEditChange("waistCircumference", e.target.value)}
                    placeholder="e.g., 85"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                ) : (
                  <p className="text-neutral-900 dark:text-neutral-100">{patientData?.waistCircumference ? `${patientData.waistCircumference} cm` : <span className="text-neutral-400">Not provided</span>}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Last Checked Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editFormData?.lastCheckedDate || ""}
                    onChange={(e) => handleEditChange("lastCheckedDate", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                ) : (
                  <p className="text-neutral-900 dark:text-neutral-100">{patientData?.lastCheckedDate || <span className="text-neutral-400">Not provided</span>}</p>
                )}
              </div>
            </div>
          </div>

          {/* Privacy Settings - Only show in edit mode */}
          {isEditing && (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border-2 border-purple-200 dark:border-purple-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100">Privacy Settings</h3>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">
                Control what information is visible on your emergency QR code. Critical medical information (blood group, allergies, conditions, medications) is always public for your safety.
              </p>
              
              <div className="space-y-3">
                <div className="bg-white dark:bg-purple-900/30 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-3 uppercase">Always Public (For Emergency)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { key: 'bloodGroup', label: 'Blood Group', locked: true },
                      { key: 'allergies', label: 'Allergies', locked: true },
                      { key: 'chronicConditions', label: 'Chronic Conditions', locked: true },
                      { key: 'currentMedications', label: 'Current Medications', locked: true },
                    ].map(({ key, label, locked }) => (
                      <div key={key} className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/50 rounded">
                        <span className="text-sm text-purple-900 dark:text-purple-100">{label}</span>
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Public</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-purple-900/30 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-3 uppercase">You Control</p>
                  <div className="space-y-2">
                    {[
                      { key: 'name' as keyof PrivacySettings, label: 'Name', icon: User },
                      { key: 'dateOfBirth' as keyof PrivacySettings, label: 'Date of Birth', icon: Calendar },
                      { key: 'gender' as keyof PrivacySettings, label: 'Gender', icon: User },
                      { key: 'phone' as keyof PrivacySettings, label: 'Phone Number', icon: Phone },
                      { key: 'email' as keyof PrivacySettings, label: 'Email', icon: Mail },
                      { key: 'address' as keyof PrivacySettings, label: 'Address', icon: MapPin },
                      { key: 'emergencyContact' as keyof PrivacySettings, label: 'Emergency Contact', icon: AlertCircle },
                      { key: 'height' as keyof PrivacySettings, label: 'Height', icon: Activity },
                      { key: 'weight' as keyof PrivacySettings, label: 'Weight', icon: Activity },
                      { key: 'waistCircumference' as keyof PrivacySettings, label: 'Waist Circumference', icon: Activity },
                      { key: 'previousSurgeries' as keyof PrivacySettings, label: 'Previous Surgeries', icon: Heart },
                    ].map(({ key, label, icon: Icon }) => {
                      const isPublic = editFormData?.privacySettings[key] ?? false;
                      return (
                        <div key={key} className="flex items-center justify-between p-3 bg-white dark:bg-purple-900/40 rounded hover:bg-purple-50 dark:hover:bg-purple-900/60 transition">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span className="text-sm text-purple-900 dark:text-purple-100">{label}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handlePrivacyChange(key, !isPublic)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                              isPublic 
                                ? 'bg-green-600 dark:bg-green-500' 
                                : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                isPublic ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className={`text-xs font-medium ml-2 w-16 ${
                            isPublic 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blockchain Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Blockchain Information</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Wallet Address</label>
              <p className="text-blue-900 dark:text-blue-100 font-mono text-sm bg-blue-100 dark:bg-blue-900/40 px-3 py-2 rounded border border-blue-200 dark:border-blue-800 break-all">
                {connection.account}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                ✓ Your medical records are securely stored on the blockchain
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar with QR Code */}
        <div className="space-y-6">
          {/* Emergency QR Code */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg border-2 border-red-200 dark:border-red-800 p-6 sticky top-24">
            <div className="flex items-center gap-3 mb-4">
              <QrCode className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h3 className="text-xl font-bold text-red-900 dark:text-red-100">Emergency QR</h3>
            </div>
            <p className="text-sm text-red-700 dark:text-red-200 mb-4">
              First responders can scan this code to access your vital medical information instantly
            </p>
            {qrCode && (
              <div className="bg-white p-4 rounded-lg mb-4">
                <img src={qrCode} alt="Emergency QR Code" className="w-full" />
              </div>
            )}
            <Link
              href="/patient/emergency"
              className="block w-full text-center px-4 py-3 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition font-medium"
            >
              View Full Emergency Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function PatientDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    name: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    
    // Step 2: Contact Information
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    
    // Step 3: Emergency Contact
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    
    // Step 4: Medical Information
    allergies: "",
    chronicConditions: "",
    currentMedications: "",
    previousSurgeries: "",
    
    // Step 5: Physical Measurements (optional)
    height: "",
    weight: "",
    waistCircumference: "",
    lastCheckedDate: ""
  });

  useEffect(() => {
    // AUTH GUARD: Check session first
    async function checkAuth() {
      if (status === "loading") {
        return;
      }

      if (status === "unauthenticated" || !session?.user) {
        // Not logged in - redirect to login
        router.push("/auth/login");
        return;
      }

      if (session.user.role !== "patient") {
        // Not a patient - redirect to appropriate portal
        router.push(session.user.role === "doctor" ? "/doctor" : "/");
        return;
      }

      // User is authenticated as patient, now try to auto-connect wallet
      try {
        const conn = await connectWallet();
        if (conn) {
          setConnection(conn);
          await checkRegistrationStatus(conn);
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
        // Wallet disconnected
        setConnection(null);
        setIsRegistered(false);
      } else {
        // Wallet switched or connected
        const conn = await connectWallet();
        setConnection(conn);
        if (conn) {
          await checkRegistrationStatus(conn);
        }
      }
    };

    onAccountsChanged(handleAccountsChanged);
  }, [session, status, router]);

  async function checkRegistrationStatus(conn: WalletConnection) {
    try {
      setCheckingRegistration(true);
      const result = await readContract(conn, "getPatient", [conn.account]);
      const patient = result as any;
      // If patient.name exists and is not empty string, they're registered
      const isPatientRegistered = patient && patient.name && patient.name.trim() !== "" && patient.name !== "0x" && patient.name !== "0x0000000000000000000000000000000000000000000000000000000000000000";
      console.log("Registration check:", { patient, isPatientRegistered });
      setIsRegistered(isPatientRegistered);
    } catch (error: any) {
      // "Patient not registered" error means they need to register
      console.error("Error checking registration:", error);
      setIsRegistered(false);
    } finally {
      setCheckingRegistration(false);
    }
  }

  async function handleRegister() {
    if (!connection) return;
    
    // Validate current step
    if (currentStep === 1) {
      if (!formData.name || !formData.dateOfBirth || !formData.gender || !formData.bloodGroup) {
        alert("Please fill in all personal information fields");
        return;
      }
      setCurrentStep(2);
      return;
    }
    
    if (currentStep === 2) {
      if (!formData.phone || !formData.email || !formData.address) {
        alert("Please fill in all contact information fields");
        return;
      }
      setCurrentStep(3);
      return;
    }
    
    if (currentStep === 3) {
      if (!formData.emergencyName || !formData.emergencyRelation || !formData.emergencyPhone) {
        alert("Please fill in all emergency contact fields");
        return;
      }
      setCurrentStep(4);
      return;
    }
    
    if (currentStep === 4) {
      // Medical information is optional, move to physical measurements
      setCurrentStep(5);
      return;
    }
    
    // Final step - Submit to blockchain
    if (currentStep === 5) {
      try {
        setRegistering(true);
        
        // Convert date string to Unix timestamp (seconds since epoch)
        const dateTimestamp = BigInt(Math.floor(new Date(formData.dateOfBirth).getTime() / 1000));
        
        // Store ALL collected data in emergency contact hash
        const emergencyData = {
          // Personal info
          gender: formData.gender,
          bloodGroup: formData.bloodGroup,
          // Contact info
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          // Emergency contact
          name: formData.emergencyName,
          relation: formData.emergencyRelation,
          emergencyPhone: formData.emergencyPhone,
          // Medical info
          allergies: formData.allergies,
          chronicConditions: formData.chronicConditions,
          currentMedications: formData.currentMedications,
          previousSurgeries: formData.previousSurgeries,
          // Physical measurements
          height: formData.height,
          weight: formData.weight,
          waistCircumference: formData.waistCircumference,
          lastCheckedDate: formData.lastCheckedDate,
          // Privacy settings - default to public for critical info
          privacySettings: {
            bloodGroup: true,
            allergies: true,
            chronicConditions: true,
            currentMedications: true,
            name: true,
            dateOfBirth: true,
            gender: true,
            phone: true,
            email: false,
            address: true,
            emergencyContact: true,
            height: false,
            weight: false,
            waistCircumference: false,
            previousSurgeries: false
          }
        };
        const emergencyHash = JSON.stringify(emergencyData);
        
        console.log("=== REGISTRATION DATA ===");
        console.log("Name:", formData.name);
        console.log("Date of Birth:", formData.dateOfBirth);
        console.log("Full formData:", formData);
        console.log("Emergency Data Object:", emergencyData);
        console.log("Emergency Hash (JSON):", emergencyHash);
        console.log("========================");
        
        await writeContract(
          connection,
          "registerPatient",
          [formData.name, dateTimestamp, emergencyHash]
        );

        console.log("Transaction completed, waiting for blockchain state update...");

        // Sync data to database cache
        try {
          await fetch("/api/patient/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              patientData: {
                gender: formData.gender,
                bloodGroup: formData.bloodGroup,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                emergencyName: formData.emergencyName,
                emergencyRelation: formData.emergencyRelation,
                emergencyPhone: formData.emergencyPhone,
                allergies: formData.allergies,
                chronicConditions: formData.chronicConditions,
                currentMedications: formData.currentMedications,
                previousSurgeries: formData.previousSurgeries,
              },
              walletAddress: connection.account,
            }),
          });
          console.log("✓ Data synced to database cache");
        } catch (syncError) {
          console.error("Failed to sync to database cache:", syncError);
          // Don't block the flow if cache sync fails
        }

        // Wait for blockchain state to update
        setTimeout(async () => {
          console.log("First check after 3 seconds...");
          await checkRegistrationStatus(connection);
          
          // If still not registered, try again after another 2 seconds
          setTimeout(async () => {
            console.log("Second check after 5 seconds total...");
            await checkRegistrationStatus(connection);
          }, 2000);
        }, 3000);
        
      } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed. Please try again.");
        setRegistering(false);
      }
    }
  }

  const handleConnect = async () => {
    setLoading(true);
    const conn = await connectWallet();
    setConnection(conn);
    if (conn) {
      await checkRegistrationStatus(conn);
    }
    setLoading(false);
  };

  // Loading state for session check
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

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Header */}
      <PatientHeader connection={connection} />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-12 pt-24">{/* pt-24 for fixed header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Dashboard</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Your medical records, your control—securely stored on blockchain
          </p>
        </div>

        {!connection ? (
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-8 text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-neutral-400 dark:text-neutral-500"
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
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Welcome, {session?.user?.email}!
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Connect your MetaMask wallet to access your medical records on the blockchain.
            </p>
            <button
              onClick={handleConnect}
              disabled={loading}
              className="px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition disabled:opacity-50 font-medium"
            >
              {loading ? "Connecting..." : "Connect MetaMask Wallet"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Registration Check Status */}
            {checkingRegistration ? (
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 dark:border-neutral-100 mx-auto mb-4"></div>
                <p className="text-neutral-600 dark:text-neutral-400">Checking registration status...</p>
              </div>
            ) : !isRegistered ? (
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 p-8">
                {/* Progress Indicator */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div key={step} className="flex items-center flex-1">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold ${
                          currentStep >= step 
                            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                            : 'bg-white dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 border-neutral-300 dark:border-neutral-700'
                        }`}>
                          {step}
                        </div>
                        {step < 5 && (
                          <div className={`flex-1 h-1 mx-2 ${
                            currentStep > step 
                              ? 'bg-neutral-900 dark:bg-neutral-100' 
                              : 'bg-neutral-300 dark:bg-neutral-700'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
                    <span>Personal</span>
                    <span>Contact</span>
                    <span>Emergency</span>
                    <span>Medical</span>
                    <span>Physical</span>
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                  {currentStep === 1 && "Personal Information"}
                  {currentStep === 2 && "Contact Information"}
                  {currentStep === 3 && "Emergency Contact"}
                  {currentStep === 4 && "Medical Information"}
                  {currentStep === 5 && "Physical Measurements"}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  {currentStep === 1 && "Let's start with your basic details"}
                  {currentStep === 2 && "How can we reach you?"}
                  {currentStep === 3 && "Who should we contact in case of emergency?"}
                  {currentStep === 4 && "Important medical information for emergencies"}
                  {currentStep === 5 && "Optional health metrics to track your wellness"}
                </p>
                
                {/* Success message after registration */}
                {registering && (
                  <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-blue-900 dark:text-blue-100 font-medium">
                      ⏳ Submitting to blockchain... Please confirm in MetaMask
                    </p>
                  </div>
                )}
                
                <div className="space-y-4 max-w-2xl">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Date of Birth *
                          </label>
                          <input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Gender *
                          </label>
                          <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Blood Group *
                          </label>
                          <select
                            value={formData.bloodGroup}
                            onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          >
                            <option value="">Select blood group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 2: Contact Information */}
                  {currentStep === 2 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+91 9876543210"
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Address *
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Street address"
                          className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="City"
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            placeholder="State"
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            PIN Code
                          </label>
                          <input
                            type="text"
                            value={formData.pincode}
                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                            placeholder="PIN"
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 3: Emergency Contact */}
                  {currentStep === 3 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Emergency Contact Name *
                          </label>
                          <input
                            type="text"
                            value={formData.emergencyName}
                            onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                            placeholder="Jane Doe"
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Relationship *
                          </label>
                          <select
                            value={formData.emergencyRelation}
                            onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          >
                            <option value="">Select relationship</option>
                            <option value="spouse">Spouse</option>
                            <option value="parent">Parent</option>
                            <option value="sibling">Sibling</option>
                            <option value="child">Child</option>
                            <option value="friend">Friend</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Emergency Contact Phone *
                        </label>
                        <input
                          type="tel"
                          value={formData.emergencyPhone}
                          onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                          placeholder="+91 9876543210"
                          className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                        />
                      </div>
                    </>
                  )}

                  {/* Step 4: Medical Information */}
                  {currentStep === 4 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Known Allergies
                        </label>
                        <textarea
                          value={formData.allergies}
                          onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                          placeholder="e.g., Penicillin, Peanuts, etc."
                          rows={3}
                          className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Chronic Conditions
                        </label>
                        <textarea
                          value={formData.chronicConditions}
                          onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                          placeholder="e.g., Diabetes, Hypertension, etc."
                          rows={3}
                          className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Current Medications
                        </label>
                        <textarea
                          value={formData.currentMedications}
                          onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                          placeholder="List any medications you're currently taking"
                          rows={3}
                          className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Previous Surgeries
                        </label>
                        <textarea
                          value={formData.previousSurgeries}
                          onChange={(e) => setFormData({ ...formData, previousSurgeries: e.target.value })}
                          placeholder="List any previous surgeries or major medical procedures"
                          rows={3}
                          className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                        />
                      </div>
                    </>
                  )}

                  {/* Step 5: Physical Measurements (Optional) */}
                  {currentStep === 5 && (
                    <>
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Physical Measurements</h3>
                        <p className="text-neutral-600 dark:text-neutral-400">Optional - These help track your health metrics</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Height (cm)
                          </label>
                          <input
                            type="number"
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                            placeholder="e.g., 170"
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Weight (kg)
                          </label>
                          <input
                            type="number"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            placeholder="e.g., 70"
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Waist Circumference (cm)
                          </label>
                          <input
                            type="number"
                            value={formData.waistCircumference}
                            onChange={(e) => setFormData({ ...formData, waistCircumference: e.target.value })}
                            placeholder="e.g., 85"
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Last Checked Date
                          </label>
                          <input
                            type="date"
                            value={formData.lastCheckedDate}
                            onChange={(e) => setFormData({ ...formData, lastCheckedDate: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
                        These measurements are optional. You can skip this step or add them later through the edit profile feature.
                      </p>
                    </>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 pt-4">
                    {currentStep > 1 && (
                      <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        disabled={registering}
                        className="px-6 py-3 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition disabled:opacity-50 font-medium"
                      >
                        Back
                      </button>
                    )}
                    <button
                      onClick={handleRegister}
                      disabled={registering}
                      className="flex-1 px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {registering ? "Submitting to Blockchain..." : currentStep === 5 ? "Complete Registration" : "Next"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Connected Dashboard - Registered */}
                <RegisteredDashboard connection={connection} />
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
