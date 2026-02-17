"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StarOfLife } from "@/components/icons/StarOfLife"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"

function FooterSection() {
  const { t } = useLanguage()

  return (
    <footer className="relative border-t bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand Section */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <StarOfLife className="w-8 h-8 text-red-600 dark:text-red-500 flex-shrink-0" />
              <span className="text-xl text-neutral-900 dark:text-neutral-100 tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 'bold' }}>Swasthya Sanchar</span>
            </div>
            <p className="mb-6 text-neutral-600 dark:text-neutral-400">
              {t.footer.brandDescription}
            </p>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-blue-600/10 blur-2xl" />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t.footer.quickLinks}</h3>
            <nav className="space-y-2 text-sm">
              <Link href="/" className="block transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                {t.footer.home}
              </Link>
              <Link href="/patient-portal" className="block transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                {t.footer.patientPortal}
              </Link>
              <Link href="/doctor-portal" className="block transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                {t.footer.doctorPortal}
              </Link>
              <Link href="/emergency" className="block transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                {t.footer.emergencyAccess}
              </Link>
            </nav>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t.footer.keyFeatures}</h3>
            <nav className="space-y-2 text-sm">
              <Link href="#" className="block transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                {t.footer.dataOwnership}
              </Link>
              <Link href="#" className="block transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                {t.footer.emergencyReady}
              </Link>
              <Link href="#" className="block transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                {t.footer.permanentPortable}
              </Link>
              <Link href="#" className="block transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                {t.footer.consentSharing}
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 dark:border-neutral-800 pt-8 text-center md:flex-row">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            © {new Date().getFullYear()} {t.footer.allRightsReserved}
          </p>
          <nav className="flex gap-4 text-sm">
            <Link href="#" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              {t.footer.privacyPolicy}
            </Link>
            <Link href="#" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              {t.footer.termsOfService}
            </Link>
            <Link href="#" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              {t.footer.healthcareCompliance}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { FooterSection }
