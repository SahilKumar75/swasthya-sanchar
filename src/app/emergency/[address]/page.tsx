"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readContract, connectWallet } from "@/lib/web3";
import { Shield } from "lucide-react";

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
      
      const connection = await connectWallet();
      if (!connection) {
        setError("Failed to connect to blockchain");
        return;
      }
      
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
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">Back to Home</Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-600 dark:bg-red-700 text-white rounded-lg p-4 mb-6 flex items-center gap-3 border border-red-700 dark:border-red-800" role="alert">
          <svg className="w-8 h-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-semibold text-lg">Instant Emergency Access</p>
            <p className="text-sm">Critical patient info from blockchain, accessible via QR scan</p>
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
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">Patient Emergency Profile</h2>
              
              {(isVisible('name') || isVisible('dateOfBirth') || isVisible('gender')) && (
                <div className="mb-6 grid grid-cols-3 gap-4">
                  {isVisible('name') && patientData.name && (<div><p className="text-sm text-neutral-600 dark:text-neutral-400">Name</p><p className="font-semibold">{patientData.name}</p></div>)}
                  {isVisible('dateOfBirth') && patientData.dateOfBirth && (<div><p className="text-sm text-neutral-600 dark:text-neutral-400">DOB</p><p className="font-semibold">{patientData.dateOfBirth}</p></div>)}
                  {isVisible('gender') && patientData.gender && (<div><p className="text-sm text-neutral-600 dark:text-neutral-400">Gender</p><p className="font-semibold capitalize">{patientData.gender}</p></div>)}
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h3 className="font-bold text-red-900 dark:text-red-100 mb-2">Blood Type</h3>
                  <p className="text-3xl font-bold text-red-900 dark:text-red-100">{patientData.bloodGroup || "Not specified"}</p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-800 rounded-lg p-4">
                  <h3 className="font-bold text-yellow-900 dark:text-yellow-100 mb-2">Allergies</h3>
                  {patientData.allergies ? patientData.allergies.split(',').map((a, i) => (<div key={i} className="bg-yellow-200 dark:bg-yellow-800 px-2 py-1 rounded text-sm mb-1">{a.trim()}</div>)) : <p>None reported</p>}
                </div>

                <div className="border-2 border-neutral-300 dark:border-neutral-700 rounded-lg p-4">
                  <h3 className="font-bold mb-2">Conditions</h3>
                  {patientData.chronicConditions ? (<ul>{patientData.chronicConditions.split(',').map((c, i) => (<li key={i}>• {c.trim()}</li>))}</ul>) : <p>None</p>}
                </div>

                <div className="border-2 border-neutral-300 dark:border-neutral-700 rounded-lg p-4">
                  <h3 className="font-bold mb-2">Medications</h3>
                  {patientData.currentMedications ? (<ul>{patientData.currentMedications.split(',').map((m, i) => (<li key={i}>• {m.trim()}</li>))}</ul>) : <p>None</p>}
                </div>
              </div>

              {isVisible('emergencyContact') && (patientData.emergencyName || patientData.emergencyPhone) && (
                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Emergency Contact</h3>
                  {patientData.emergencyName && <p><span className="font-semibold">Name:</span> {patientData.emergencyName}</p>}
                  {patientData.emergencyRelation && <p><span className="font-semibold">Relationship:</span> {patientData.emergencyRelation}</p>}
                  {patientData.emergencyPhone && <p><span className="font-semibold">Phone:</span> <a href={`tel:${patientData.emergencyPhone}`} className="text-blue-600 underline">{patientData.emergencyPhone}</a></p>}
                </div>
              )}

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <p className="text-sm font-semibold">Privacy Notice</p>
                </div>
                <p className="text-sm text-neutral-600 italic">Patient controls visibility. Critical medical info always shown for safety.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => window.print()} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Print Info</button>
              {patientData.emergencyPhone && (<a href={`tel:${patientData.emergencyPhone}`} className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center">Call Emergency Contact</a>)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
