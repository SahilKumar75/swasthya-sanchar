"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import JourneyTracker from "@/components/JourneyTracker";
import { ArrowLeft, Share2, X, Copy, CheckCircle2, Phone } from "lucide-react";

interface ShareModalProps {
  journeyId: string;
  onClose: () => void;
}

function ShareModal({ journeyId, onClose }: ShareModalProps) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!phone) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/journey/${journeyId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, notifyViaWhatsApp: true })
      });

      const data = await response.json();
      if (response.ok) {
        setShareUrl(data.shareUrl);
      }
    } catch (error) {
      console.error("Share error:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Share with Family</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!shareUrl ? (
          <>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Enter your family member's phone number to share your live journey status.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-transparent"
                  />
                </div>
              </div>

              <button
                onClick={handleShare}
                disabled={!phone || loading}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? "Creating link..." : "Share via WhatsApp"}
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="font-semibold text-green-800 dark:text-green-200">Share Link Created!</p>
            </div>

            <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-3 flex items-center gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent text-sm truncate"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg"
              >
                {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <a
              href={`https://wa.me/91${phone}?text=${encodeURIComponent(`Track my hospital visit live: ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
            >
              <Phone className="w-5 h-5" />
              Send via WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function JourneyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);

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

        {/* Journey Tracker */}
        <JourneyTracker
          journeyId={params.id}
          onShare={() => setShowShareModal(true)}
        />

        {/* Share Modal */}
        {showShareModal && (
          <ShareModal
            journeyId={params.id}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </main>
    </div>
  );
}
