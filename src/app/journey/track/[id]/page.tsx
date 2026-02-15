"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import JourneyTracker from "@/components/JourneyTracker";
import { Heart, Shield, ArrowLeft } from "lucide-react";

export default function PublicJourneyTrackPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const shareCode = searchParams.get('share');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-neutral-900 dark:text-neutral-100">
                Swasthya Sanchar
              </h1>
              <p className="text-xs text-neutral-500">Family Journey Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Shield className="w-4 h-4" />
            Secure Link
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>Family Tracking View</strong> - You're viewing this journey because someone shared it with you.
            This page updates automatically every 30 seconds.
          </p>
        </div>

        {/* Journey Tracker */}
        <JourneyTracker
          journeyId={params.id}
          shareCode={shareCode || undefined}
        />

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-neutral-500">
          <p className="mb-4">
            Powered by <strong>Swasthya Sanchar</strong> - Healthcare Intelligence Platform
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Learn more about our platform
          </Link>
        </div>
      </main>
    </div>
  );
}
