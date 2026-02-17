"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";

interface Note {
  id: string;
  chiefComplaint: string;
  historyOfPresent: string;
  examination: string;
  diagnosis: string;
  plan: string;
  medications: string;
  followUp: string;
  rawTranscript?: string;
  status: string;
  createdAt: string;
}

export default function VoiceNoteDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [note, setNote] = useState<Note | null>(null);
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
    fetchNote();
  }, [status, session, params.id, router]);

  const fetchNote = async () => {
    try {
      const res = await fetch(`/api/voice/notes/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setNote(data.note);
      }
    } catch (_) {}
    finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" aria-hidden />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8 pt-24">
          <p className="text-neutral-500">Note not found.</p>
          <Link href="/doctor-portal/voice" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Voice Notes
          </Link>
        </main>
      </div>
    );
  }

  const sections = [
    { label: "Chief Complaint", value: note.chiefComplaint },
    { label: "History of Present Illness", value: note.historyOfPresent },
    { label: "Examination", value: note.examination },
    { label: "Diagnosis / Impression", value: note.diagnosis },
    { label: "Plan", value: note.plan },
    { label: "Medications", value: note.medications },
    { label: "Follow-up", value: note.followUp },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <Link
          href="/doctor-portal/voice"
          className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-6"
          aria-label="Back to voice notes"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Voice Notes
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-neutral-500" aria-hidden />
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              {note.chiefComplaint || "Clinical Note"}
            </h1>
            <p className="text-sm text-neutral-500">
              {new Date(note.createdAt).toLocaleString()} - {note.status}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {sections.map(({ label, value }) =>
              value ? (
                <div key={label} className="p-6">
                  <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
                    {label}
                  </h2>
                  <p className="text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap">
                    {value}
                  </p>
                </div>
              ) : null
            )}
          </div>

          {note.rawTranscript && (
            <div className="p-6 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
              <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
                Raw Transcript
              </h2>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                {note.rawTranscript}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
