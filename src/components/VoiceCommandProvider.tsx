"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mic, MicOff, X, Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type VoiceIntent =
    | "go_home"
    | "go_journey"
    | "go_emergency"
    | "go_records"
    | "go_permissions"
    | "read_medications"
    | "read_allergies"
    | "read_conditions"
    | "read_bmi"
    | "read_blood_group"
    | "book_appointment"
    | "share_journey"
    | "share_medications"
    | "help"
    | "unknown";

interface VoiceCommandContextType {
    isListening: boolean;
    isProcessing: boolean;
    isSupported: boolean;
    lastTranscript: string;
    lastResponse: string;
    startListening: () => void;
    stopListening: () => void;
    // Inject patient data so the provider can speak it back
    setPatientContext: (ctx: PatientContext) => void;
}

interface PatientContext {
    name?: string;
    medications?: string;
    allergies?: string;
    conditions?: string;
    bmi?: string;
    bmiCategory?: string;
    bloodGroup?: string;
}

// ─── Language → BCP-47 ────────────────────────────────────────────────────────

const LANG_MAP: Record<string, string> = {
    en: "en-IN",
    hi: "hi-IN",
    mr: "mr-IN",
    bh: "hi-IN", // Bhojpuri falls back to Hindi recognition
};

// ─── TTS — female voice with warm settings ────────────────────────────────────

const FEMALE_VOICE_KEYWORDS = [
    "female", "woman", "girl",
    // macOS / iOS
    "samantha", "karen", "moira", "tessa", "veena",
    // Indian
    "lekha", "neerja", "aditi",
    // Windows
    "zira", "hazel", "susan",
    // Google
    "google हिन्दी", "google hindi",
];

function pickFemaleVoice(bcp47: string): SpeechSynthesisVoice | null {
    const voices = window.speechSynthesis.getVoices();
    const langCode = bcp47.split("-")[0].toLowerCase();
    const langVoices = voices.filter((v) => v.lang.toLowerCase().startsWith(langCode));
    const femaleInLang = langVoices.find((v) =>
        FEMALE_VOICE_KEYWORDS.some((kw) => v.name.toLowerCase().includes(kw))
    );
    if (femaleInLang) return femaleInLang;
    const anyFemale = voices.find((v) =>
        FEMALE_VOICE_KEYWORDS.some((kw) => v.name.toLowerCase().includes(kw))
    );
    return anyFemale || langVoices[0] || null;
}

function speak(text: string, lang: string) {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const bcp47 = LANG_MAP[lang] || "hi-IN";
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = bcp47;
    utter.rate = 0.88;   // calm, unhurried
    utter.pitch = 1.1;   // slightly higher — warmer, feminine
    utter.volume = 1.0;

    const doSpeak = () => {
        const voice = pickFemaleVoice(bcp47);
        if (voice) utter.voice = voice;
        window.speechSynthesis.speak(utter);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
        doSpeak();
    } else {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.onvoiceschanged = null;
            doSpeak();
        };
    }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const VoiceCommandContext = createContext<VoiceCommandContextType | null>(null);

export function useVoiceAssistant() {
    const ctx = useContext(VoiceCommandContext);
    if (!ctx) throw new Error("useVoiceAssistant must be used inside VoiceCommandProvider");
    return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function VoiceCommandProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { language } = useLanguage();

    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [lastTranscript, setLastTranscript] = useState("");
    const [lastResponse, setLastResponse] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [patientCtx, setPatientCtxState] = useState<PatientContext>({});

    const recognitionRef = useRef<any>(null);
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const supported =
            typeof window !== "undefined" &&
            !!(window.SpeechRecognition || window.webkitSpeechRecognition);
        setIsSupported(supported);
    }, []);

    const showToastFor = useCallback((ms = 4000) => {
        setShowToast(true);
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setShowToast(false), ms);
    }, []);

    // ── Execute intent returned by Groq ──────────────────────────────────────

    const executeIntent = useCallback(
        (result: any) => {
            const intent: VoiceIntent = result.intent || "unknown";
            const ttsText: string = result.response || "";

            // Speak the confirmation back
            if (ttsText) speak(ttsText, language);

            switch (intent) {
                case "go_home":
                    router.push("/patient-portal/home");
                    break;
                case "go_journey":
                    router.push("/patient/journey");
                    break;
                case "go_emergency":
                    router.push("/patient/emergency");
                    break;
                case "go_records":
                    router.push("/patient/records");
                    break;
                case "go_permissions":
                    router.push("/patient/permissions");
                    break;

                case "read_medications": {
                    const meds = patientCtx.medications || "No medications on record.";
                    const msg = `Your current medications are: ${meds}`;
                    speak(msg, language);
                    setLastResponse(msg);
                    break;
                }
                case "read_allergies": {
                    const al = patientCtx.allergies || "No allergies on record.";
                    const msg = `Your allergies are: ${al}`;
                    speak(msg, language);
                    setLastResponse(msg);
                    break;
                }
                case "read_conditions": {
                    const cond = patientCtx.conditions || "No conditions on record.";
                    const msg = `Your medical conditions are: ${cond}`;
                    speak(msg, language);
                    setLastResponse(msg);
                    break;
                }
                case "read_bmi": {
                    const msg = patientCtx.bmi
                        ? `Your BMI is ${patientCtx.bmi}, which is ${patientCtx.bmiCategory}.`
                        : "BMI data not available.";
                    speak(msg, language);
                    setLastResponse(msg);
                    break;
                }

                case "read_blood_group": {
                    const msg = patientCtx.bloodGroup
                        ? `Aapka blood group ${patientCtx.bloodGroup} hai!`
                        : "Blood group data not available.";
                    speak(msg, language);
                    setLastResponse(msg);
                    break;
                }

                case "book_appointment":
                    // Navigate to journey page with query params pre-filled if available
                    router.push(
                        `/patient/journey/start?hospital=${encodeURIComponent(result.hospital || "")}&date=${encodeURIComponent(result.date || "")}&time=${encodeURIComponent(result.time || "")}`
                    );
                    break;

                case "share_journey":
                    router.push("/patient/journey");
                    break;

                case "share_medications": {
                    // Copy medications to clipboard and speak
                    const meds = patientCtx.medications || "No medications on record.";
                    navigator.clipboard?.writeText(`Medications: ${meds}`).catch(() => { });
                    break;
                }

                case "help": {
                    const helpText =
                        "You can say: go home, open journey, emergency QR, my records, my medications, my allergies, my conditions, my BMI, book appointment, or share with family.";
                    speak(helpText, language);
                    setLastResponse(helpText);
                    break;
                }

                case "unknown":
                default:
                    // Already spoken by TTS from result.response
                    break;
            }
        },
        [router, language, patientCtx]
    );

    // ── Process transcript via Groq ───────────────────────────────────────────

    const processTranscript = useCallback(
        async (transcript: string) => {
            setIsProcessing(true);
            setLastTranscript(transcript);
            showToastFor(6000);

            try {
                const res = await fetch("/api/ai/voice-intent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ transcript, language }),
                });

                if (!res.ok) throw new Error("API error");
                const data = await res.json();
                setLastResponse(data.response || "");
                executeIntent(data);
            } catch {
                const fallback = "Sorry, I couldn't process that. Please try again.";
                setLastResponse(fallback);
                speak(fallback, language);
            } finally {
                setIsProcessing(false);
            }
        },
        [language, executeIntent, showToastFor]
    );

    // ── Speech recognition ────────────────────────────────────────────────────

    const startListening = useCallback(() => {
        if (!isSupported || isListening || isProcessing) return;

        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new Recognition();
        recognitionRef.current = recognition;

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = LANG_MAP[language] || "hi-IN";
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript || "";
            if (transcript.trim()) processTranscript(transcript);
        };

        recognition.start();
    }, [isSupported, isListening, isProcessing, language, processTranscript]);

    const stopListening = useCallback(() => {
        recognitionRef.current?.stop();
        setIsListening(false);
    }, []);

    const setPatientContext = useCallback((ctx: PatientContext) => {
        setPatientCtxState(ctx);
    }, []);

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <VoiceCommandContext.Provider
            value={{
                isListening,
                isProcessing,
                isSupported,
                lastTranscript,
                lastResponse,
                startListening,
                stopListening,
                setPatientContext,
            }}
        >
            {children}

            {/* ── Floating Mic Button ── */}
            {isSupported && (
                <div className="fixed bottom-24 right-5 z-[9999] flex flex-col items-end gap-3 md:bottom-8">

                    {/* Toast: transcript + response */}
                    {showToast && (lastTranscript || lastResponse) && (
                        <div className="max-w-xs w-72 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-4 text-sm animate-in slide-in-from-bottom-2 fade-in duration-200">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                                    {isProcessing ? "Thinking…" : "✨ Aarohi"}
                                </span>
                                <button
                                    onClick={() => setShowToast(false)}
                                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors flex-shrink-0"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {lastTranscript && (
                                <p className="text-neutral-700 dark:text-neutral-200 mb-1.5 leading-snug">
                                    <span className="text-neutral-400 dark:text-neutral-500 text-xs">You: </span>
                                    {lastTranscript}
                                </p>
                            )}
                            {lastResponse && !isProcessing && (
                                <p className="text-neutral-900 dark:text-neutral-100 font-medium leading-snug">
                                    <span className="text-pink-500 text-xs">Aarohi: </span>
                                    {lastResponse}
                                </p>
                            )}
                            {isProcessing && (
                                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Understanding your request…</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mic button */}
                    <button
                        onClick={isListening ? stopListening : startListening}
                        disabled={isProcessing}
                        aria-label={isListening ? "Stop listening" : "Start voice command"}
                        className={`
              w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200
              ${isListening
                                ? "bg-red-500 hover:bg-red-600 scale-110 ring-4 ring-red-300 dark:ring-red-800 animate-pulse"
                                : isProcessing
                                    ? "bg-blue-500 cursor-wait"
                                    : "bg-neutral-900 dark:bg-white hover:scale-105 hover:shadow-xl"
                            }
            `}
                    >
                        {isProcessing ? (
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : isListening ? (
                            <MicOff className="w-6 h-6 text-white" />
                        ) : (
                            <Mic className={`w-6 h-6 ${isListening ? "text-white" : "text-white dark:text-neutral-900"}`} />
                        )}
                    </button>

                    {/* Listening indicator label */}
                    {isListening && (
                        <span className="text-xs font-medium text-red-500 dark:text-red-400 animate-pulse text-right">
                            Listening…
                        </span>
                    )}
                </div>
            )}
        </VoiceCommandContext.Provider>
    );
}
