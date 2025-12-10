"use client"

import * as React from "react"
import { signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"
import { 
  User, 
  Settings, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  Moon,
  Sun,
  LayoutDashboard,
  ChevronDown,
  Stethoscope
} from "lucide-react"

interface ProfileDropdownProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  role?: string
  theme?: "light" | "dark"
  onThemeToggle?: () => void
}

export function ProfileDropdown({ user, role, theme, onThemeToggle }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Close on escape key
  React.useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const getInitials = (email: string) => {
    return email
      .split("@")[0]
      .split(".")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
    router.refresh()
  }

  const menuItems = role === "doctor" ? [
    {
      label: t.nav.doctorPortal,
      icon: Stethoscope,
      onClick: () => {
        setIsOpen(false)
        router.push("/doctor")
      },
    },
    {
      label: t.nav.settings,
      icon: Settings,
      onClick: () => {
        setIsOpen(false)
        router.push("/doctor/settings")
      },
    },
  ] : [
    {
      label: t.nav.patientPortal,
      icon: LayoutDashboard,
      onClick: () => {
        setIsOpen(false)
        router.push("/patient")
      },
    },
    {
      label: t.nav.settings,
      icon: Settings,
      onClick: () => {
        setIsOpen(false)
        router.push("/patient/settings")
      },
    },
  ]

  // Check if any menu item route matches current path
  const isProfileActive = role === "doctor" 
    ? pathname === "/doctor" || pathname === "/doctor/settings"
    : pathname === "/patient" || pathname === "/patient/settings"

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
          isOpen || isProfileActive
            ? "bg-neutral-900 dark:bg-white shadow-sm"
            : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
        }`}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-xs">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(user.email || "U")
          )}
        </div>
        <div className="hidden md:flex flex-col items-start">
          <span className={`text-sm font-medium transition-colors ${
            isOpen || isProfileActive
              ? "text-white dark:text-neutral-900"
              : "text-neutral-900 dark:text-neutral-100"
          }`}>
            {user.name || user.email?.split("@")[0] || "User"}
          </span>
          <span className={`text-xs transition-colors ${
            isOpen || isProfileActive
              ? "text-neutral-300 dark:text-neutral-600"
              : "text-neutral-600 dark:text-neutral-400"
          }`}>
            {user.email}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-all ${
            isOpen ? "rotate-180" : ""
          } ${
            isOpen || isProfileActive
              ? "text-white dark:text-neutral-900"
              : "text-neutral-600 dark:text-neutral-400"
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div className="px-4 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-base">{getInitials(user.email || "U")}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                  {user.name || user.email?.split("@")[0] || "User"}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left group"
              >
                <item.icon className="w-4 h-4 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
                  {item.label}
                </span>
              </button>
            ))}

            {/* Theme Toggle */}
            {onThemeToggle && (
              <button
                onClick={() => {
                  onThemeToggle()
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left group"
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors" />
                ) : (
                  <Sun className="w-4 h-4 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors" />
                )}
                <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
                  {theme === "light" ? t.nav.darkMode : t.nav.lightMode}
                </span>
              </button>
            )}

            {/* Help */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left group"
            >
              <HelpCircle className="w-4 h-4 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
                {t.nav.helpSupport}
              </span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left group"
            >
              <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                {t.nav.logout}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
