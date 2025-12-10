"use client";
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem } from "@/components/ui/navbar-menu";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { Moon, Sun, Activity } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatAddress } from "@/lib/web3";

interface NavbarProps {
  connection?: { account: string } | null;
}

export function Navbar({ connection }: NavbarProps) {
  const [active, setActive] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { data: session } = useSession();

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

  // If user is not logged in, show only theme toggle
  if (!session) {
    return (
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
        ) : (
          <Sun className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
        )}
      </button>
    );
  }

  // Full navbar for logged-in users
  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-transparent">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo + Title (Capsule) - Leftmost position */}
          <Link
            href={session.user.role === "patient" ? "/patient" : "/doctor"}
            className="flex items-center gap-2 h-[44px] px-4 bg-white dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100 whitespace-nowrap">Swasthya Sanchar</span>
          </Link>

          {/* Center: Home, Features, Emergency (Capsule with animated menu) - Centered */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
            <div className="bg-white dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm px-2 h-[44px] flex items-center">
              <Menu setActive={setActive}>
                <Link
                  href={session.user.role === "patient" ? "/patient/home" : "/doctor"}
                  className="px-4 py-2 text-sm font-medium text-neutral-900 hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300 transition-colors"
                >
                  Home
                </Link>

                <MenuItem setActive={setActive} active={active} item="Features">
                  <div className="flex flex-col space-y-4 text-sm">
                    <HoveredLink href="/patient/records">Medical Records</HoveredLink>
                    <HoveredLink href="/patient/emergency">Emergency QR</HoveredLink>
                    <HoveredLink href="/patient/access">Doctor Access</HoveredLink>
                    <HoveredLink href="#blockchain-security">Blockchain Security</HoveredLink>
                  </div>
                </MenuItem>

                <Link
                  href="/emergency"
                  className="px-4 py-2 text-sm font-medium text-neutral-900 hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300 transition-colors"
                >
                  Emergency
                </Link>
              </Menu>
            </div>
          </div>

          {/* Right: Wallet + Avatar + Theme Toggle (Capsule) - Rightmost position */}
          <div className="flex items-center gap-2 h-[44px] px-3 bg-white dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm">
            {connection && (
              <div className="hidden md:flex items-center gap-2 px-3 h-[28px] bg-neutral-100 dark:bg-neutral-700 rounded-full">
                <span className="text-xs text-neutral-600 dark:text-neutral-400">Wallet:</span>
                <span className="font-mono text-xs text-neutral-900 dark:text-neutral-100">
                  {formatAddress(connection.account)}
                </span>
              </div>
            )}

            {session?.user && (
              <div className="flex items-center h-full">
                <ProfileDropdown
                  user={{
                    name: session.user.email?.split("@")[0],
                    email: session.user.email,
                    image: null,
                  }}
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
          </div>
        </div>
      </div>
    </header>
  );
}
