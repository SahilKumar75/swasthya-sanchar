"use client";
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem } from "@/components/ui/navbar-menu";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { Magnetic } from "@/components/core/magnetic";
import { StarOfLife } from "@/components/icons/StarOfLife";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { Moon, Sun, Activity } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { formatAddress } from "@/lib/web3";

interface NavbarProps {
  connection?: { account: string } | null;
}

export function Navbar({ connection }: NavbarProps) {
  const [active, setActive] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
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

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Render Navbar
  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-transparent">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo + Title (Capsule) - Non-clickable with Magnetic effect */}
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

          {/* Center: Home, Features, Emergency (Capsule with animated menu) - Centered */}
          {/* Only show center menu if user is logged in OR in dev bypass mode */}
          {(session || process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') && (
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
              <div className="bg-white dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm px-1 h-[44px] flex items-center gap-1">
                <Menu setActive={setActive}>
                  <Link
                    href={session?.user?.role === "patient" ? "/patient-portal/home" : session?.user?.role === "doctor" ? "/doctor/home" : "/patient-portal/home"}
                    className={`px-5 py-2 text-sm font-medium rounded-full transition-all h-[36px] flex items-center ${pathname === "/patient-portal/home" || pathname === "/doctor/home"
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 hover:shadow-sm"
                      }`}
                  >
                    {t.nav.home}
                  </Link>

                  {(session?.user?.role === "patient" || !session) ? (
                    <MenuItem
                      setActive={setActive}
                      active={active}
                      item={t.nav.features}
                      isActive={pathname?.includes("/records") || pathname?.includes("/access")}
                    >
                      <div className="flex flex-col space-y-4 text-sm">
                        <div className="text-gray-500 italic">Coming Soon:</div>
                        <HoveredLink href="#">Medical Records</HoveredLink>
                        <HoveredLink href="#">Emergency QR</HoveredLink>
                        <HoveredLink href="#">Doctor Access</HoveredLink>
                        <HoveredLink href="#">Blockchain Security</HoveredLink>
                      </div>
                    </MenuItem>
                  ) : (
                    <MenuItem
                      setActive={setActive}
                      active={active}
                      item={t.nav.features}
                      isActive={pathname?.includes("/patients") || pathname?.includes("/records")}
                    >
                      <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink href="/doctor/patients">Patient Records</HoveredLink>
                        <HoveredLink href="/doctor/records">Create Records</HoveredLink>
                        <HoveredLink href="/doctor/authorization">Authorization Status</HoveredLink>
                      </div>
                    </MenuItem>
                  )}

                  <Link
                    href="/patient/emergency"
                    className={`px-5 py-2 text-sm font-medium rounded-full transition-all h-[36px] flex items-center ${pathname === "/patient/emergency"
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 hover:shadow-sm"
                      }`}
                  >
                    Emergency
                  </Link>
                </Menu>
              </div>
            </div>
          )}

          {/* Right: Avatar + Theme Toggle + Language (Capsule) - Rightmost position */}
          <div className="flex items-center gap-2 h-[44px] px-3 bg-white dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm">
            {session?.user && (
              <div className="flex items-center h-full">
                <ProfileDropdown
                  user={{
                    name: session.user.email?.split("@")[0],
                    email: session.user.email,
                    image: null,
                  }}
                  role={session.user.role}
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
