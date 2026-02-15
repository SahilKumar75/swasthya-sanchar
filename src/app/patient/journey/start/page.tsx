"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  ArrowLeft, Building2, MapPin, Clock, CheckCircle2,
  Search, Loader2, AlertCircle, ChevronRight, Navigation
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  code: string;
  type: string;
  icon?: string;
  color?: string;
  floor: number;
  wing?: string;
  avgServiceTime: number;
  currentQueue: number;
  maxCapacity: number;
}

interface Hospital {
  id: string;
  name: string;
  code: string;
  address?: string;
  city: string;
  state: string;
  type: string;
  departments?: Department[];
}

const visitTypes = [
  { id: 'opd', label: 'OPD Visit', icon: '🏥', description: 'General outpatient consultation' },
  { id: 'follow-up', label: 'Follow-up', icon: '📋', description: 'Returning for scheduled follow-up' },
  { id: 'diagnostic', label: 'Diagnostic', icon: '🔬', description: 'Tests, X-rays, or scans' },
  { id: 'emergency', label: 'Emergency', icon: '🚑', description: 'Urgent medical attention' }
];

const departmentTypeOrder = ['registration', 'consultation', 'diagnostic', 'pharmacy', 'billing'];

export default function StartJourneyPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedVisitType, setSelectedVisitType] = useState<string>('opd');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    fetchHospitals();
  }, [status]);

  const fetchHospitals = async () => {
    try {
      const response = await fetch("/api/hospitals?departments=true");
      const data = await response.json();
      
      if (response.ok) {
        setHospitals(data.hospitals);
      }
    } catch (error) {
      console.error("Failed to fetch hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHospitals = hospitals.filter(h =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    // Auto-select departments based on visit type
    if (hospital.departments) {
      const defaultDepts = hospital.departments
        .filter(d => {
          if (selectedVisitType === 'opd') {
            return ['registration', 'consultation', 'pharmacy'].includes(d.type);
          }
          if (selectedVisitType === 'diagnostic') {
            return ['registration', 'diagnostic', 'billing'].includes(d.type);
          }
          return true;
        })
        .sort((a, b) => departmentTypeOrder.indexOf(a.type) - departmentTypeOrder.indexOf(b.type))
        .map(d => d.id);
      setSelectedDepartments(defaultDepts);
    }
    setStep(2);
  };

  const handleToggleDepartment = (deptId: string) => {
    setSelectedDepartments(prev =>
      prev.includes(deptId)
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };

  const handleStartJourney = async () => {
    if (!selectedHospital || selectedDepartments.length === 0) {
      setError("Please select at least one department");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId: selectedHospital.id,
          visitType: selectedVisitType,
          chiefComplaint,
          departmentIds: selectedDepartments
        })
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/patient/journey/${data.journey.id}`);
      } else {
        setError(data.error || "Failed to start journey");
      }
    } catch (error) {
      setError("Failed to connect to server");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Back Button */}
        <Link
          href="/patient/journey"
          className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Journeys
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Start Hospital Visit
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {step === 1 ? "Select a hospital to begin your journey" : "Customize your visit path"}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                s < step 
                  ? 'bg-green-500 text-white' 
                  : s === step 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 rounded ${
                  s < step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Hospital */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search hospitals by name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Hospital List */}
            {filteredHospitals.length === 0 ? (
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center">
                <Building2 className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  {hospitals.length === 0 
                    ? "No hospitals available. Contact support to add your hospital."
                    : "No hospitals match your search"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredHospitals.map((hospital) => (
                  <button
                    key={hospital.id}
                    onClick={() => handleSelectHospital(hospital)}
                    className="w-full text-left bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 hover:border-blue-500 dark:hover:border-blue-500 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                          <Building2 className="w-7 h-7 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg">
                            {hospital.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-neutral-500 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {hospital.city}, {hospital.state}
                            </span>
                            <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700 rounded-full text-xs">
                              {hospital.type}
                            </span>
                          </div>
                          {hospital.departments && (
                            <p className="text-xs text-neutral-400 mt-1">
                              {hospital.departments.length} departments available
                            </p>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-neutral-400 group-hover:text-blue-500 transition" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Configure Visit */}
        {step === 2 && selectedHospital && (
          <div className="space-y-6">
            {/* Selected Hospital */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      {selectedHospital.name}
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {selectedHospital.city}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setStep(1); setSelectedHospital(null); }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Visit Type */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Type of Visit
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {visitTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedVisitType(type.id)}
                    className={`p-4 rounded-xl border-2 text-left transition ${
                      selectedVisitType === type.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <h4 className="font-semibold mt-2">{type.label}</h4>
                    <p className="text-sm text-neutral-500 mt-1">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Chief Complaint */}
            <div>
              <label className="block text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                What brings you here today? (Optional)
              </label>
              <textarea
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="e.g., Fever for 3 days, headache..."
                className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                rows={3}
              />
            </div>

            {/* Departments */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Your Journey Path
              </h3>
              <p className="text-sm text-neutral-500 mb-4">
                Select the departments you need to visit (in order)
              </p>
              
              {selectedHospital.departments && selectedHospital.departments.length > 0 ? (
                <div className="space-y-2">
                  {selectedHospital.departments
                    .sort((a, b) => departmentTypeOrder.indexOf(a.type) - departmentTypeOrder.indexOf(b.type))
                    .map((dept, index) => {
                      const isSelected = selectedDepartments.includes(dept.id);
                      const orderIndex = selectedDepartments.indexOf(dept.id);
                      
                      return (
                        <button
                          key={dept.id}
                          onClick={() => handleToggleDepartment(dept.id)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition flex items-center justify-between ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {isSelected && (
                              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                {orderIndex + 1}
                              </div>
                            )}
                            <div>
                              <h4 className="font-semibold">{dept.name}</h4>
                              <p className="text-sm text-neutral-500">
                                Floor {dept.floor}{dept.wing && `, Wing ${dept.wing}`} • 
                                ~{dept.avgServiceTime} min • 
                                Queue: {dept.currentQueue}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              dept.currentQueue < dept.maxCapacity * 0.5
                                ? 'bg-green-100 text-green-700'
                                : dept.currentQueue < dept.maxCapacity * 0.8
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {dept.currentQueue < dept.maxCapacity * 0.5 ? 'Low' : 
                               dept.currentQueue < dept.maxCapacity * 0.8 ? 'Medium' : 'High'} wait
                            </span>
                          </div>
                        </button>
                      );
                    })}
                </div>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-yellow-700 dark:text-yellow-300">
                  <AlertCircle className="w-5 h-5 inline mr-2" />
                  No departments configured for this hospital yet
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-red-700 dark:text-red-300">
                <AlertCircle className="w-5 h-5 inline mr-2" />
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 rounded-xl font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
              >
                Back
              </button>
              <button
                onClick={handleStartJourney}
                disabled={submitting || selectedDepartments.length === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Navigation className="w-5 h-5" />
                )}
                Start Journey
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
