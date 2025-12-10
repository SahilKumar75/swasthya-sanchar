"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Activity } from "lucide-react"
import Link from "next/link"

function FooterSection() {
  return (
    <footer className="relative border-t bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold tracking-tight">Swasthya Sanchar</h2>
            </div>
            <p className="mb-6 text-neutral-600 dark:text-neutral-400">
              Blockchain-powered healthcare records that save lives. Your health data, your control—securely stored and accessible when it matters most.
            </p>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-blue-600/10 blur-2xl" />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <Link href="/" className="block transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                Home
              </Link>
              <Link href="/patient" className="block transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                Patient Portal
              </Link>
              <Link href="/doctor" className="block transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                Doctor Portal
              </Link>
              <Link href="/emergency" className="block transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                Emergency Access
              </Link>
            </nav>
          </div>

          {/* Features */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Features</h3>
            <nav className="space-y-2 text-sm">
              <Link href="#" className="block transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                Blockchain Security
              </Link>
              <Link href="#" className="block transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                Emergency QR Codes
              </Link>
              <Link href="#" className="block transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                Medical Records
              </Link>
              <Link href="#" className="block transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                Doctor Access Control
              </Link>
            </nav>
          </div>

          {/* About */}
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">About the Project</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Built with cutting-edge blockchain technology to ensure your medical records are secure, private, and accessible in emergencies.
            </p>
            <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <p>🔒 End-to-end encryption</p>
              <p>⚡ Instant emergency access</p>
              <p>🔗 Powered by Ethereum</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 dark:border-neutral-800 pt-8 text-center md:flex-row">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            © {new Date().getFullYear()} Swasthya Sanchar. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <Link href="#" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              Terms of Service
            </Link>
            <Link href="#" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              Healthcare Compliance
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { FooterSection }
