import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Swasthya Sanchar
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Blockchain-based Healthcare Records System
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
      </main>
    </div>
  );
}
