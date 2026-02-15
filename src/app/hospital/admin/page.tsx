"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  Building2, Users, Activity, Clock, TrendingUp,
  AlertCircle, CheckCircle2, Loader2, RefreshCw,
  ArrowRight, MapPin
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  code: string;
  currentQueue: number;
  maxCapacity: number;
  avgServiceTime: number;
  floor: number;
  wing?: string;
}

interface Hospital {
  id: string;
  name: string;
  code: string;
  city: string;
  departments: Department[];
}

interface ActiveJourney {
  id: string;
  tokenNumber: string;
  status: string;
  progressPercent: number;
  patient: {
    fullName?: string;
  };
  currentCheckpoint?: {
    department: {
      name: string;
    };
  };
}

export default function HospitalAdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [activeJourneys, setActiveJourneys] = useState<ActiveJourney[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      fetchHospitals();
    }
  }, [status, router]);

  const fetchHospitals = async () => {
    try {
      const response = await fetch("/api/hospitals?departments=true");
      const data = await response.json();
      
      if (response.ok) {
        setHospitals(data.hospitals);
        if (data.hospitals.length > 0) {
          setSelectedHospital(data.hospitals[0]);
          fetchActiveJourneys(data.hospitals[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveJourneys = async (hospitalId: string) => {
    try {
      const response = await fetch(`/api/hospitals/${hospitalId}/journeys`);
      if (response.ok) {
        const data = await response.json();
        setActiveJourneys(data.journeys || []);
      }
    } catch (error) {
      console.error("Failed to fetch active journeys:", error);
    }
  };

  const handleRefresh = async () => {
    if (!selectedHospital) return;
    
    setRefreshing(true);
    await Promise.all([
      fetchHospitals(),
      fetchActiveJourneys(selectedHospital.id)
    ]);
    setRefreshing(false);
  };

  const handleHospitalChange = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    fetchActiveJourneys(hospital.id);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const totalQueue = selectedHospital?.departments.reduce((sum, d) => sum + d.currentQueue, 0) || 0;
  const avgWaitTime = selectedHospital?.departments.reduce((sum, d) => sum + (d.currentQueue * d.avgServiceTime), 0) || 0;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
              Hospital Queue Management
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Monitor and manage patient journeys in real-time
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Hospital Selector */}
        {hospitals.length > 1 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Select Hospital
            </label>
            <select
              value={selectedHospital?.id || ''}
              onChange={(e) => {
                const hospital = hospitals.find(h => h.id === e.target.value);
                if (hospital) handleHospitalChange(hospital);
              }}
              className="px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name} ({hospital.code})
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedHospital ? (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Total in Queue</p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{totalQueue}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Active Journeys</p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{activeJourneys.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Avg Wait Time</p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {Math.round(avgWaitTime / (totalQueue || 1))} min
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Departments</p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {selectedHospital.departments.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Queue Status */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 mb-8">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Department Queue Status
                </h2>
              </div>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {selectedHospital.departments.map((dept) => {
                  const utilization = (dept.currentQueue / dept.maxCapacity) * 100;
                  const status = utilization < 50 ? 'low' : utilization < 80 ? 'medium' : 'high';
                  const statusColor = {
                    low: 'text-green-600 bg-green-50 dark:bg-green-900/30',
                    medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30',
                    high: 'text-red-600 bg-red-50 dark:bg-red-900/30'
                  }[status];

                  return (
                    <div key={dept.id} className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {dept.name}
                            </h3>
                            <span className="text-xs text-neutral-500">
                              Floor {dept.floor}{dept.wing && `, Wing ${dept.wing}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                            <span>Queue: {dept.currentQueue}/{dept.maxCapacity}</span>
                            <span>Avg Service: {dept.avgServiceTime} min</span>
                            <span>Est Wait: {dept.currentQueue * dept.avgServiceTime} min</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-32">
                            <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${status === 'low' ? 'bg-green-500' : status === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.min(utilization, 100)}%` }}
                              />
                            </div>
                            <p className="text-xs text-neutral-500 mt-1">{Math.round(utilization)}% capacity</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                            {status === 'low' ? 'Low' : status === 'medium' ? 'Medium' : 'High'} Load
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Journeys */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Active Patient Journeys
                </h2>
              </div>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {activeJourneys.length === 0 ? (
                  <div className="p-12 text-center text-neutral-500">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No active journeys at the moment</p>
                  </div>
                ) : (
                  activeJourneys.map((journey) => (
                    <Link
                      key={journey.id}
                      href={`/hospital/journey/${journey.id}`}
                      className="block p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {journey.patient.fullName || 'Patient'}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-neutral-500 mt-1">
                              <span className="font-mono">{journey.tokenNumber}</span>
                              {journey.currentCheckpoint && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {journey.currentCheckpoint.department.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                              {journey.progressPercent}%
                            </div>
                            <div className="w-24 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden mt-1">
                              <div 
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${journey.progressPercent}%` }}
                              />
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-blue-500 transition" />
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-12 text-center border border-neutral-200 dark:border-neutral-700">
            <AlertCircle className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              No hospitals configured yet
            </p>
            <p className="text-neutral-500 text-sm mt-2">
              Contact administrator to set up hospital data
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
