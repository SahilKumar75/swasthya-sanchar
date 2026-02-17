"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { VoiceRecorder } from "@/components/voice/VoiceRecorder";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";

interface ClinicalNote {
  id: string;
  chiefComplaint: string;
  diagnosis: string;
  status: string;
  createdAt: string;
}

export default function DoctorVoicePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (session?.user?.role !== "doctor") {
      router.push("/doctor-portal/home");
      return;
    }
    fetchNotes();
  }, [status, session, router]);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/voice/notes");
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      }
    } catch (_) {}
    finally {
      setLoading(false);
    }
  };

  const handleNoteGenerated = () => {
    fetchNotes();
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <Link
          href="/doctor-portal/home"
          className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-6"
          aria-label="Back to doctor home"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
          Voice Documentation
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          Record your consultation; AI will generate a SOAP note.
        </p>

        <div className="mb-8">
          <VoiceRecorder
            language="en-IN"
            onNoteGenerated={handleNoteGenerated}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Recent Notes
          </h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" aria-hidden />
            </div>
          ) : notes.length === 0 ? (
            <p className="text-neutral-500 py-6">No voice notes yet. Record a consultation above.</p>
          ) : (
            <ul className="space-y-3">
              {notes.map((note) => (
                <li key={note.id}>
                  <Link
                    href={`/doctor-portal/voice/${note.id}`}
                    className="block p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-blue-500 transition"
                    aria-label={`View note: ${note.chiefComplaint || note.diagnosis || note.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-neutral-500 flex-shrink-0" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                          {note.chiefComplaint || note.diagnosis || "Untitled note"}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {new Date(note.createdAt).toLocaleDateString()} - {note.status}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
