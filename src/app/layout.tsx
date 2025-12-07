import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Swasthya Sanchar - Healthcare Records",
  description: "Blockchain-based healthcare records management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
