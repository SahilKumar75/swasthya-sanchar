import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Swasthya Sanchar
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your Health, Your Control, Your Blockchain
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Patient-owned medical records with life-saving emergency access
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/patient"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Patient Portal
            </Link>
            <Link
              href="/doctor"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Doctor Portal
            </Link>
          </div>
        </div>

        {/* About/Story Section */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Swasthya Sanchar?
          </h2>
          
          <div className="space-y-6">
            {/* Problem */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">⚠</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">The Problem</h3>
                <p className="text-gray-600 text-sm">
                  Medical records are fragmented across hospitals. In emergencies, responders can't access critical info like allergies or blood type—costing precious time and lives.
                </p>
              </div>
            </div>

            {/* Solution */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">🔗</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Our Solution</h3>
                <p className="text-gray-600 text-sm">
                  A blockchain-based health locker where <strong>patients own</strong> their data. Doctors access records only with consent. Emergency QR codes provide instant, wallet-free access to life-saving info.
                </p>
              </div>
            </div>

            {/* Unique Value */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">🚨</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">The Emergency Edge</h3>
                <p className="text-gray-600 text-sm">
                  Patients generate a QR code (printed on ID or phone lock screen). First responders scan it—no wallet, no login—instantly seeing allergies, blood type, medications, and emergency contacts.
                </p>
              </div>
            </div>

            {/* Impact */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">✨</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Real-World Impact</h3>
                <p className="text-gray-600 text-sm">
                  Empowers patients with data sovereignty, streamlines doctor workflows, and saves lives by eliminating the "information gap" during critical moments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
