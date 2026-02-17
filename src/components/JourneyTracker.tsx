"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Clock, CheckCircle2, Circle, ArrowRight,
  Share2, Phone, Volume2, VolumeX, Building2, User,
  Navigation, AlertCircle, Loader2, RefreshCw
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
}

interface Checkpoint {
  id: string;
  sequence: number;
  status: "pending" | "in_queue" | "in_progress" | "completed" | "skipped";
  queuePosition?: number;
  estimatedWaitMinutes?: number;
  actualWaitMinutes?: number;
  arrivedAt?: string;
  startedAt?: string;
  completedAt?: string;
  department: Department;
  notes?: string;
}

interface Hospital {
  id: string;
  name: string;
  code: string;
  city: string;
  address?: string;
  phone?: string;
}

interface Journey {
  id: string;
  tokenNumber: string;
  visitType: string;
  chiefComplaint?: string;
  status: "active" | "completed" | "cancelled" | "paused";
  startedAt: string;
  completedAt?: string;
  progressPercent: number;
  estimatedTotalMinutes?: number;
  estimatedRemainingMinutes?: number;
  actualTotalMinutes?: number;
  hospital: Hospital;
  checkpoints: Checkpoint[];
  currentCheckpoint?: Checkpoint;
  patient?: {
    fullName?: string;
    profilePicture?: string;
  };
}

interface JourneyTrackerProps {
  journeyId?: string;
  shareCode?: string;
  onShare?: () => void;
  compact?: boolean;
}

const statusConfig = {
  pending: {
    color: "bg-gray-200 dark:bg-gray-700",
    textColor: "text-gray-500 dark:text-gray-400",
    icon: Circle,
    label: "Pending"
  },
  in_queue: {
    color: "bg-yellow-100 dark:bg-yellow-900/30",
    textColor: "text-yellow-600 dark:text-yellow-400",
    icon: Clock,
    label: "In Queue"
  },
  in_progress: {
    color: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-600 dark:text-blue-400",
    icon: Loader2,
    label: "In Progress"
  },
  completed: {
    color: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-600 dark:text-green-400",
    icon: CheckCircle2,
    label: "Completed"
  },
  skipped: {
    color: "bg-gray-100 dark:bg-gray-800",
    textColor: "text-gray-400 dark:text-gray-500",
    icon: Circle,
    label: "Skipped"
  }
};

export function JourneyTracker({ 
  journeyId, 
  shareCode, 
  onShare,
  compact = false 
}: JourneyTrackerProps) {
  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [predictedWait, setPredictedWait] = useState<{ min: number; max: number; source: string } | null>(null);

  const fetchJourney = async () => {
    if (!journeyId) return;
    
    try {
      const url = shareCode 
        ? `/api/journey/${journeyId}?share=${shareCode}`
        : `/api/journey/${journeyId}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setJourney(data.journey);
        setError("");
      } else {
        setError(data.error || "Failed to load journey");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourney();
    
    // Refresh every 30 seconds for active journeys
    const interval = setInterval(() => {
      if (journey?.status === 'active') {
        fetchJourney();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [journeyId, shareCode]);

  // Fetch wait-time prediction for current checkpoint (in_queue)
  useEffect(() => {
    const cp = journey?.currentCheckpoint || journey?.checkpoints?.find(c => c.status === "in_queue" || c.status === "in_progress");
    if (!cp?.department?.id || (cp.status !== "in_queue" && cp.status !== "in_progress")) {
      setPredictedWait(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/queue/predict?departmentId=${cp.department.id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (cancelled || !data) return;
        setPredictedWait({
          min: data.confidenceLow,
          max: data.confidenceHigh,
          source: data.source === "historical" ? "historical" : "estimate",
        });
      })
      .catch(() => setPredictedWait(null));
    return () => { cancelled = true; };
  }, [journey?.id, journey?.currentCheckpoint?.id, journey?.checkpoints]);

  const speakStatus = () => {
    if (!journey || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const current = journey.currentCheckpoint;
    const text = current
      ? `आप अभी ${current.department.name} में हैं। ` +
        `कतार में आपकी स्थिति ${current.queuePosition || 'अगला'} है। ` +
        `अनुमानित प्रतीक्षा समय ${current.estimatedWaitMinutes || 10} मिनट है।`
      : `आपकी यात्रा ${journey.progressPercent}% पूरी हो चुकी है।`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !journey) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 dark:text-red-300">{error || "Journey not found"}</p>
        <button
          onClick={fetchJourney}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          <RefreshCw className="w-4 h-4 inline mr-2" />
          Retry
        </button>
      </div>
    );
  }

  const currentCheckpoint = journey.currentCheckpoint || 
    journey.checkpoints.find(c => c.status === 'in_queue' || c.status === 'in_progress');

  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden ${compact ? '' : 'shadow-lg'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-lg">{journey.hospital.name}</h3>
              <p className="text-blue-100 text-sm">{journey.hospital.city}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-200">Token</p>
            <p className="font-mono font-bold">{journey.tokenNumber}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-blue-800/50 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${journey.progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>{journey.progressPercent}% Complete</span>
          <span>{journey.estimatedRemainingMinutes || '?'} min remaining</span>
        </div>
      </div>

      {/* Current Status Banner */}
      {currentCheckpoint && journey.status === 'active' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 ${statusConfig[currentCheckpoint.status].color} border-b border-neutral-200 dark:border-neutral-700`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center shadow">
                <Navigation className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Current Location</p>
                <p className="font-bold text-lg text-neutral-900 dark:text-neutral-100">
                  {currentCheckpoint.department.name}
                </p>
                <p className="text-sm text-neutral-500">
                  Floor {currentCheckpoint.department.floor}
                  {currentCheckpoint.department.wing && `, Wing ${currentCheckpoint.department.wing}`}
                </p>
              </div>
            </div>
            <div className="text-right">
              {currentCheckpoint.queuePosition && (
                <div className="text-3xl font-bold text-blue-600">
                  #{currentCheckpoint.queuePosition}
                </div>
              )}
              {currentCheckpoint.estimatedWaitMinutes != null && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  ~{currentCheckpoint.estimatedWaitMinutes} min wait
                </p>
              )}
              {predictedWait && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {predictedWait.min}–{predictedWait.max} min {predictedWait.source === "historical" ? "(historical)" : ""}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Checkpoints Timeline */}
      <div className="p-4">
        <div className="space-y-0">
          {journey.checkpoints.map((checkpoint, index) => {
            const config = statusConfig[checkpoint.status];
            const StatusIcon = config.icon;
            const isLast = index === journey.checkpoints.length - 1;
            const isCurrent = checkpoint.id === currentCheckpoint?.id;

            return (
              <div key={checkpoint.id} className="relative">
                {/* Connecting Line */}
                {!isLast && (
                  <div 
                    className={`absolute left-5 top-10 w-0.5 h-full -mb-2 ${
                      checkpoint.status === 'completed' 
                        ? 'bg-green-500' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start gap-4 p-3 rounded-lg transition ${
                    isCurrent 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                      : ''
                  }`}
                >
                  {/* Status Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.color}`}>
                    <StatusIcon className={`w-5 h-5 ${config.textColor} ${
                      checkpoint.status === 'in_progress' ? 'animate-spin' : ''
                    }`} />
                  </div>

                  {/* Checkpoint Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {checkpoint.department.name}
                      </h4>
                      {isCurrent && (
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500">
                      {checkpoint.department.type} • Floor {checkpoint.department.floor}
                    </p>
                    
                    {/* Timing Info */}
                    {checkpoint.status !== 'pending' && (
                      <div className="flex items-center gap-4 mt-1 text-xs text-neutral-500">
                        {checkpoint.arrivedAt && (
                          <span>Arrived: {new Date(checkpoint.arrivedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                        {checkpoint.actualWaitMinutes !== undefined && (
                          <span>Waited: {checkpoint.actualWaitMinutes}m</span>
                        )}
                        {checkpoint.completedAt && (
                          <span>Done: {new Date(checkpoint.completedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Queue Position / Time */}
                  <div className="text-right flex-shrink-0">
                    {checkpoint.status === 'in_queue' && checkpoint.queuePosition && (
                      <div className="text-lg font-bold text-yellow-600">#{checkpoint.queuePosition}</div>
                    )}
                    {checkpoint.status === 'pending' && checkpoint.estimatedWaitMinutes && (
                      <div className="text-sm text-neutral-500">~{checkpoint.estimatedWaitMinutes}m</div>
                    )}
                    {checkpoint.status === 'completed' && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      {!compact && (
        <div className="border-t border-neutral-200 dark:border-neutral-700 p-4 flex gap-3">
          <button
            onClick={speakStatus}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
              isSpeaking 
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            {isSpeaking ? 'Stop' : 'Read Aloud'}
          </button>
          
          {onShare && (
            <button
              onClick={onShare}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              <Share2 className="w-5 h-5" />
              Share with Family
            </button>
          )}

          {journey.hospital.phone && (
            <a
              href={`tel:${journey.hospital.phone}`}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-lg font-medium hover:bg-neutral-200 dark:hover:bg-neutral-600 transition"
            >
              <Phone className="w-5 h-5" />
            </a>
          )}
        </div>
      )}

      {/* Journey Completed */}
      {journey.status === 'completed' && (
        <div className="bg-green-50 dark:bg-green-900/20 p-4 text-center border-t border-green-200 dark:border-green-800">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
          <p className="font-bold text-green-800 dark:text-green-200">Journey Completed!</p>
          <p className="text-sm text-green-600 dark:text-green-300">
            Total time: {journey.actualTotalMinutes || Math.round((new Date(journey.completedAt!).getTime() - new Date(journey.startedAt).getTime()) / 60000)} minutes
          </p>
        </div>
      )}
    </div>
  );
}

export default JourneyTracker;
