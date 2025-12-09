"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readContract, getProvider } from "@/lib/web3";
import { Shield, Eye, EyeOff } from "lucide-react";

interface PrivacySettings {
  bloodGroup: boolean;
  allergies: boolean;
  chronicConditions: boolean;
  currentMedications: boolean;
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

interface PatientEmergencyData {
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
  privacySettings: PrivacySettings;
}

export default function EmergencyResponderPage({ params }: { params: { address: string } }) {
  const [address, setAddress] = useState<string>(params.address || "");
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<PatientEmergencyData | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadEmergencyData();
  }, [address]);

  async function loadEmergencyData() {
    try {
      setLoading(true);
      setError("");
      
      const provider = await getProvider();
      const connection = { provider, account: address };
      
      const result = await readContract(connection, "getPatient", [address]);
      const patient = result as any;

      if (!patient || !patient.name) {
        setError("Patient not found or not registered");
        return;
      }

      let emergencyData: any = {};
      if (patient.emergencyProfileHash) {
        emergencyData = JSON.parse(patient.emergencyProfileHash);
      }

      const birthDate = new Date(Number(patient.dateOfBirth) * 1000);
      const dateOfBirth = birthDate.toISOString().split('T')[0];

      const data: PatientEmergencyData = {
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
        privacySettings: emergencyData.privacySettings || {
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

      setPatientData(data);
    } catch (error) {
      console.error("Error loading emergency data:", error);
      setError("Failed to load patient emergency data");
    } finally {
      setLoading(false);
    }
  }

  // Helper function to check if field should be visible
  const isVisible = (field: keyof PrivacySettings): boolean => {
    if (!patientData) return false;
    return patientData.privacySettings[field] ?? false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading emergency profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-red-600">Emergency Access</h1>
                <p className="text-sm text-gray-600">First Responder View</p>
              </div>
            </div>
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Emergency Alert Banner */}
        <div 
          className="bg-red-600 dark:bg-red-700 text-white rounded-lg p-4 mb-6 flex items-center gap-3 border border-red-700 dark:border-red-800"
          role="alert"
          aria-live="polite"
        >
          <svg className="w-8 h-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-semibold text-lg">⚡ Instant Emergency Access—No Wallet Required</p>
            <p className="text-sm">Critical patient info from blockchain, accessible via QR scan in seconds</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-900 dark:text-red-100">{error}</p>
          </div>
        )}

        {!patientData && !error && (
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">No patient data available</p>
          </div>
        )}

        {patientData && (
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Patient Emergency Profile</h2>
            <div className="bg-neutral-100 dark:bg-neutral-900 p-3 rounded border border-neutral-200 dark:border-neutral-700">
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Patient Blockchain Address:</p>
              <p className="font-mono text-sm break-all text-neutral-900 dark:text-neutral-100">{address}</p>
            </div>
          </div>

          {/* Personal Information - Conditional based on privacy */}
          {(isVisible('name') || isVisible('dateOfBirth') || isVisible('gender')) && (
            <div className="mb-6 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 rounded-lg p-4">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-50 mb-3">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isVisible('name') && patientData.name && (
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Name</p>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{patientData.name}</p>
                  </div>
                )}
                {isVisible('dateOfBirth') && patientData.dateOfBirth && (
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Date of Birth</p>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{patientData.dateOfBirth}</p>
                  </div>
                )}
                {isVisible('gender') && patientData.gender && (
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Gender</p>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 capitalize">{patientData.gender}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Critical Information - Always visible */}
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
              <h3 className="font-bold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                CRITICAL: Blood Type
              </h3>
              <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                {patientData.bloodGroup || "Not specified"}
              </p>
            </div>

            {/* Allergies - Always visible */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-800 rounded-lg p-4">
              <h3 className="font-bold text-yellow-900 dark:text-yellow-100 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                ALLERGIES
              </h3>
              <div className="space-y-2">
                {patientData.allergies ? (
                  patientData.allergies.split(',').map((allergy, idx) => (
                    <div key={idx} className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 px-3 py-2 rounded font-semibold">
                      ⚠️ {allergy.trim()}
                    </div>
                  ))
                ) : (
                  <p className="text-yellow-900 dark:text-yellow-100">None reported</p>
                )}
              </div>
            </div>

            {/* Medical Conditions - Always visible */}
            <div className="border-2 border-neutral-300 dark:border-neutral-700 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-800/50">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-50 mb-3">Medical Conditions</h3>
              {patientData.chronicConditions ? (
                <ul className="space-y-2">
                  {patientData.chronicConditions.split(',').map((condition, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                      <span className="text-neutral-700 dark:text-neutral-300">{condition.trim()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-neutral-600 dark:text-neutral-400">None reported</p>
              )}
            </div>

            {/* Current Medications - Always visible */}
          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">Privacy Notice</p>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">
              ⚡ This info is blockchain-backed and QR-accessible—no login, no wallet, instant life-saving data.
              The patient has control over what information is visible here. Critical medical information (blood group, allergies, conditions, medications) is always visible for emergency situations.
            </p>
          </div>
          </div>
        )}

        {patientData && (
          <div className="mt-6 flex gap-4">
            <button 
              onClick={() => window.print()}
              className="flex-1 px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition font-medium border border-blue-700 dark:border-blue-800"
            >
              Print Emergency Info
            </button>
            {patientData.emergencyPhone && (
              <a 
                href={`tel:${patientData.emergencyPhone}`}
                className="flex-1 px-6 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition font-medium border border-green-700 dark:border-green-800 text-center"
              >
                Call Emergency Contact
              </a>
            )}
          </div>
        )}
      </main>sVisible('phone') || isVisible('email') || isVisible('address')) && (
            <div className="mt-6 border-2 border-neutral-300 dark:border-neutral-700 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-800/50">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-50 mb-3">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isVisible('phone') && patientData.phone && (
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Phone</p>
                    <a href={`tel:${patientData.phone}`} className="text-blue-600 dark:text-blue-400 underline font-semibold">
                      {patientData.phone}
                    </a>
                  </div>
                )}
                {isVisible('email') && patientData.email && (
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Email</p>
                    <a href={`mailto:${patientData.email}`} className="text-blue-600 dark:text-blue-400 underline">
                      {patientData.email}
                    </a>
                  </div>
                )}
                {isVisible('address') && patientData.address && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Address</p>
                    <p className="text-neutral-900 dark:text-neutral-100">
                      {patientData.address}
                      {patientData.city && `, ${patientData.city}`}
                      {patientData.state && `, ${patientData.state}`}
                      {patientData.pincode && ` - ${patientData.pincode}`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Physical Measurements - Conditional */}
          {(isVisible('height') || isVisible('weight') || isVisible('waistCircumference')) && 
           (patientData.height || patientData.weight || patientData.waistCircumference) && (
            <div className="mt-6 border-2 border-neutral-300 dark:border-neutral-700 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-800/50">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-50 mb-3">Physical Measurements</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isVisible('height') && patientData.height && (
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Height</p>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{patientData.height} cm</p>
                  </div>
                )}
                {isVisible('weight') && patientData.weight && (
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Weight</p>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{patientData.weight} kg</p>
                  </div>
                )}
                {isVisible('waistCircumference') && patientData.waistCircumference && (
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Waist</p>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{patientData.waistCircumference} cm</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Previous Surgeries - Conditional */}
          {isVisible('previousSurgeries') && patientData.previousSurgeries && (
            <div className="mt-6 border-2 border-neutral-300 dark:border-neutral-700 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-800/50">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-50 mb-3">Previous Surgeries</h3>
              <p className="text-neutral-700 dark:text-neutral-300">{patientData.previousSurgeries}</p>
            </div>
          )}

          {/* Emergency Contact - Conditional */}
          {isVisible('emergencyContact') && (patientData.emergencyName || patientData.emergencyPhone) && (
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Emergency Contact
              </h3>
              <div className="space-y-2">
                {patientData.emergencyName && (
                  <p className="text-neutral-900 dark:text-neutral-100">
                    <span className="font-semibold">Name:</span> {patientData.emergencyName}
                  </p>
                )}
                {patientData.emergencyRelation && (
                  <p className="text-neutral-900 dark:text-neutral-100">
                    <span className="font-semibold">Relationship:</span> {patientData.emergencyRelation}
                  </p>
                )}
                {patientData.emergencyPhone && (
                  <p className="text-neutral-900 dark:text-neutral-100">
                    <span className="font-semibold">Phone:</span>{" "}
                    <a href={`tel:${patientData.emergencyPhone}`} className="text-blue-600 dark:text-blue-400 underline font-semibold">
                      {patientData.emergencyPhone}
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">
              ⚡ This info is blockchain-backed and QR-accessible—no login, no wallet, instant life-saving data.
              For full medical history, contact authorized healthcare providers with patient consent.
            </p>
          </div>
        </div>

        {/* Action Buttons for Responders */}
        <div className="mt-6 flex gap-4">
          <button className="flex-1 px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition font-medium border border-blue-700 dark:border-blue-800">
            Print Emergency Info
          </button>
          <button className="flex-1 px-6 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition font-medium border border-green-700 dark:border-green-800">
            Contact Emergency Contact
          </button>
        </div>
      </main>
    </div>
  );
}
