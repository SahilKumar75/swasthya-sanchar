"use client";
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem } from "@/components/ui/navbar-menu";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { Magnetic } from "@/components/core/magnetic";
import { StarOfLife } from "@/components/icons/StarOfLife";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { Moon, Sun, Activity, Home, AlertCircle, FileText, Users, Navigation } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { formatAddress } from "@/lib/web3";

interface NavbarProps {
  connection?: { account: string } | null;
  minimal?: boolean; // New prop for registration pages
}

export function Navbar({ connection, minimal = false }: NavbarProps) {
  const [active, setActive] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isMobile, setIsMobile] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const { data: session } = useSession();
  const pathname = usePathname();
  const { t } = useLanguage();

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch profile picture
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!session?.user) return;

      try {
        const endpoint = session.user.role === "patient"
          ? "/api/patient/status"
          : "/api/doctor/profile";

        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          setProfilePicture(data.profilePicture || null);
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePicture();
  }, [session]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // If minimal mode, show only logo, avatar, theme, and language
  if (minimal) {
    return (
      <header className="w-full z-40 fixed top-0 left-0 bg-transparent">
        <div className="w-full px-4 md:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Logo + Title */}
            <Magnetic
              intensity={0.2}
              springOptions={{ bounce: 0.1 }}
              actionArea="global"
              range={200}
            >
              <div className="flex items-center gap-2 h-[44px] px-4 bg-white dark:bg-neutral-800 rounded-full shadow-sm cursor-default">
                <StarOfLife className="w-6 h-6 md:w-8 md:h-8 text-red-600 dark:text-red-500 flex-shrink-0" />
                <span className="text-xs md:text-sm text-neutral-900 dark:text-neutral-100 whitespace-nowrap tracking-wide font-bold">
                  Swasthya Sanchar
                </span>
              </div>
            </Magnetic>

            {/* Right: Avatar + Theme + Language */}
            <div className="flex items-center gap-1 h-[44px] px-1 bg-white dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm">
              {session?.user && (
                <ProfileDropdown
                  user={{
                    name: session.user.email?.split("@")[0] || "User",
                    email: session.user.email || "",
                    image: profilePicture,
                  }}
                  role={session.user.role || "patient"}
                  theme={theme}
                  onThemeToggle={toggleTheme}
                />
              )}

              <button
                onClick={toggleTheme}
                className="p-2 h-[32px] w-[32px] flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                ) : (
                  <Sun className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                )}
              </button>

              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Mobile Bottom Navigation
  if (isMobile && (session || process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') && pathname !== '/') {
    return (
      <>
        {/* Top bar with logo and controls */}
        <header className="w-full z-40 fixed top-0 left-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
          <div className="w-full px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StarOfLife className="w-6 h-6 text-red-600 dark:text-red-500" />
                <span className="text-xs text-neutral-900 dark:text-neutral-100 font-bold">Swasthya Sanchar</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? (
                    <Moon className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                  ) : (
                    <Sun className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                  )}
                </button>
                <LanguageSelector />
              </div>
            </div>
          </div>
        </header>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 pb-safe">
          <div className="flex items-center justify-around px-2 py-2">
            {session?.user?.role === "patient" ? (
              <>
                <Link
                  href="/patient-portal/home"
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[64px] ${pathname === "/patient-portal/home"
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{t.nav.home}</span>
                </Link>

                <Link
                  href="/patient/journey"
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[64px] ${pathname?.startsWith("/patient/journey")
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                >
                  <Navigation className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Journey</span>
                </Link>

                <Link
                  href="/patient/emergency"
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[64px] ${pathname === "/patient/emergency"
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                >
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{t.nav.emergency}</span>
                </Link>

                <Link
                  href="/patient/records"
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[64px] ${pathname === "/patient/records"
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                >
                  <FileText className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{t.nav.records}</span>
                </Link>

                <Link
                  href="/patient/permissions"
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[64px] ${pathname === "/patient/permissions"
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{t.nav.access}</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/doctor-portal/home"
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[64px] ${pathname === "/doctor-portal/home"
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{t.nav.home}</span>
                </Link>

                <Link
                  href="/doctor-portal/patients"
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[64px] ${pathname === "/doctor-portal/patients"
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{t.nav.patients}</span>
                </Link>

                <Link
                  href="/doctor-portal/upload"
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[64px] ${pathname === "/doctor-portal/upload"
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                >
                  <FileText className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Upload</span>
                </Link>
              </>
            )}

            {/* Profile in bottom nav */}
            <div className="flex flex-col items-center gap-1 px-3 py-2">
              <ProfileDropdown
                user={{
                  name: session?.user?.email?.split("@")[0] || "User",
                  email: session?.user?.email || "",
                  image: profilePicture,
                }}
                role={session?.user?.role || "patient"}
                theme={theme}
                onThemeToggle={toggleTheme}
                openUpward={true}
              />
            </div>
          </div>
        </nav>
      </>
    );
  }

  // Desktop Navbar (original with improvements)
  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-transparent">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo + Title (Capsule) */}
          <Magnetic
            intensity={0.2}
            springOptions={{ bounce: 0.1 }}
            actionArea="global"
            range={200}
          >
            <div className="flex items-center gap-2 h-[44px] px-4 bg-white dark:bg-neutral-800 rounded-full shadow-sm cursor-default">
              <Magnetic
                intensity={0.1}
                springOptions={{ bounce: 0.1 }}
                actionArea="global"
                range={200}
              >
                <StarOfLife className="w-8 h-8 text-red-600 dark:text-red-500 flex-shrink-0" />
              </Magnetic>
              <Magnetic
                intensity={0.1}
                springOptions={{ bounce: 0.1 }}
                actionArea="global"
                range={200}
              >
                <span className="text-sm text-neutral-900 dark:text-neutral-100 whitespace-nowrap tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 'bold' }}>Swasthya Sanchar</span>
              </Magnetic>
            </div>
          </Magnetic>

          {/* Center: Navigation Links - Reduced spacing */}
          {(session || process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') && pathname !== '/' && (
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
              <div className="bg-white dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm px-1 h-[44px] flex items-center gap-0.5">
                <Menu setActive={setActive}>
                  <Link
                    href={session?.user?.role === "patient" ? "/patient-portal/home" : session?.user?.role === "doctor" ? "/doctor-portal/home" : "/patient-portal/home"}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all h-[36px] flex items-center ${pathname === "/patient-portal/home" || pathname === "/doctor-portal/home"
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 hover:shadow-sm"
                      }`}
                  >
                    {t.nav.home}
                  </Link>

                  {(session?.user?.role === "patient" && process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH !== 'true') || (!session && process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH !== 'true') ? (
                    <>
                      <Link
                        href="/patient/journey"
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all h-[36px] flex items-center ${pathname?.startsWith("/patient/journey")
                          ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md"
                          : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 hover:shadow-sm"
                          }`}
                      >
                        Journey
                      </Link>
                      <Link
                        href="/patient/emergency"
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all h-[36px] flex items-center ${pathname === "/patient/emergency"
                          ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md"
                          : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 hover:shadow-sm"
                          }`}
                      >
                        {t.nav.emergency}
                      </Link>
                      <Link
                        href="/patient/records"
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all h-[36px] flex items-center ${pathname === "/patient/records"
                          ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md"
                          : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 hover:shadow-sm"
                          }`}
                      >
                        {t.nav.medicalRecords}
                      </Link>
                      <Link
                        href="/patient/permissions"
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all h-[36px] flex items-center ${pathname === "/patient/permissions"
                          ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md"
                          : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 hover:shadow-sm"
                          }`}
                      >
                        {t.nav.doctorAccess}
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/doctor-portal/patients"
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all h-[36px] flex items-center ${pathname === "/doctor-portal/patients"
                          ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md"
                          : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 hover:shadow-sm"
                          }`}
                      >
                        {t.nav.patients}
                      </Link>
                      <Link
                        href="/doctor-portal/upload"
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all h-[36px] flex items-center ${pathname === "/doctor-portal/upload"
                          ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md"
                          : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 hover:shadow-sm"
                          }`}
                      >
                        {t.nav.uploadRecords}
                      </Link>
                    </>
                  )}
                </Menu>
              </div>
            </div>
          )}

          {/* Right: Avatar + Theme Toggle + Language */}
          <div className="flex items-center gap-1 h-[44px] px-1 bg-white dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm">
            {(session?.user || process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') && pathname !== '/' && (
              <div className="flex items-center h-full">
                <ProfileDropdown
                  user={{
                    name: session?.user?.email?.split("@")[0] || "Developer",
                    email: session?.user?.email || "dev@example.com",
                    image: profilePicture,
                  }}
                  role={session?.user?.role || (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true' ? "doctor" : "patient")}
                  theme={theme}
                  onThemeToggle={toggleTheme}
                />
              </div>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 h-[32px] w-[32px] flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              ) : (
                <Sun className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              )}
            </button>

            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
}
