import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";

export const metadata: Metadata = {
  title: "Swasthya Sanchar - Healthcare Records",
  description: "Blockchain-based healthcare records management system for secure and decentralized medical data",
  applicationName: "Swasthya Sanchar",
  keywords: ["healthcare", "blockchain", "medical records", "EMR", "health data", "decentralized"],
  authors: [{ name: "Swasthya Sanchar Team" }],
  creator: "Swasthya Sanchar",
  publisher: "Swasthya Sanchar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Swasthya Sanchar",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://swasthya-sanchar.vercel.app",
    siteName: "Swasthya Sanchar",
    title: "Swasthya Sanchar - Healthcare Records",
    description: "Blockchain-based healthcare records management system",
    images: [
      {
        url: "/logo.svg",
        width: 200,
        height: 200,
        alt: "Swasthya Sanchar Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Swasthya Sanchar - Healthcare Records",
    description: "Blockchain-based healthcare records management system",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
        <AuthProvider>
          <LanguageProvider>
            <AccessibilityProvider>
              <ThemeProvider>
                {children}
              </ThemeProvider>
            </AccessibilityProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
