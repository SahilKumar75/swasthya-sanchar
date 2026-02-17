"use client";

import { Navbar } from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useTheme } from "@/components/ThemeProvider";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import {
    Settings as SettingsIcon, Moon, Sun, Monitor,
    User, Bell, Lock, Globe, Accessibility, Contrast, Move
} from "lucide-react";

export default function SettingsPage() {
    const { data: session } = useSession();
    const { theme, toggleTheme } = useTheme();
    const { simpleMode, setSimpleMode, highContrast, setHighContrast, reducedMotion, setReducedMotion } = useAccessibility();

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 lg:px-8 py-12 pt-24">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                            <SettingsIcon className="w-8 h-8 text-neutral-700 dark:text-neutral-300" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">
                                Settings
                            </h1>
                            <p className="text-lg text-neutral-600 dark:text-neutral-400 mt-1">
                                Manage your preferences and account settings
                            </p>
                        </div>
                    </div>
                </div>

                {/* Settings Sections */}
                <div className="space-y-6">
                    {/* Appearance */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Monitor className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                                Appearance
                            </h2>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                                Theme
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={theme === 'dark' ? toggleTheme : undefined}
                                    className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition ${theme === 'light'
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                                        }`}
                                >
                                    <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-600 dark:text-neutral-400'}`} />
                                    <span className={`text-sm font-medium ${theme === 'light' ? 'text-blue-900 dark:text-blue-100' : 'text-neutral-700 dark:text-neutral-300'}`}>
                                        Light
                                    </span>
                                </button>

                                <button
                                    onClick={theme === 'light' ? toggleTheme : undefined}
                                    className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition ${theme === 'dark'
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                                        }`}
                                >
                                    <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-600 dark:text-neutral-400'}`} />
                                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-900 dark:text-blue-100' : 'text-neutral-700 dark:text-neutral-300'}`}>
                                        Dark
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Accessibility */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6" role="region" aria-labelledby="accessibility-heading">
                        <div className="flex items-center gap-3 mb-6">
                            <Accessibility className="w-5 h-5 text-neutral-700 dark:text-neutral-300" aria-hidden />
                            <h2 id="accessibility-heading" className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                                Accessibility
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-neutral-900 dark:text-neutral-50">Simple Mode</p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Larger buttons and text, fewer options. Better for elderly and low vision.
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer" aria-label="Toggle Simple Mode">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={simpleMode}
                                        onChange={(e) => setSimpleMode(e.target.checked)}
                                        aria-checked={simpleMode}
                                    />
                                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-neutral-900 dark:text-neutral-50">High Contrast</p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Stronger borders and text contrast for visibility.
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer" aria-label="Toggle High Contrast">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={highContrast}
                                        onChange={(e) => setHighContrast(e.target.checked)}
                                        aria-checked={highContrast}
                                    />
                                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-neutral-900 dark:text-neutral-50">Reduce Motion</p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Minimize animations and transitions.
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer" aria-label="Toggle Reduce Motion">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={reducedMotion}
                                        onChange={(e) => setReducedMotion(e.target.checked)}
                                        aria-checked={reducedMotion}
                                    />
                                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Account */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="w-5 h-5 text-neutral-700 dark:text-neutral-300" aria-hidden />
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                                Account
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={session?.user?.email || ''}
                                    disabled
                                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-50 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Role
                                </label>
                                <input
                                    type="text"
                                    value={session?.user?.role || 'N/A'}
                                    disabled
                                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-50 cursor-not-allowed capitalize"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Bell className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                                Notifications
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-neutral-900 dark:text-neutral-50">
                                        Email Notifications
                                    </p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Receive email updates about your account
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-neutral-900 dark:text-neutral-50">
                                        Push Notifications
                                    </p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Receive push notifications on your device
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Privacy & Security */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Lock className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                                Privacy & Security
                            </h2>
                        </div>

                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-3 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition">
                                <p className="font-medium text-neutral-900 dark:text-neutral-50">
                                    Change Password
                                </p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Update your password
                                </p>
                            </button>

                            <button className="w-full text-left px-4 py-3 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition">
                                <p className="font-medium text-neutral-900 dark:text-neutral-50">
                                    Two-Factor Authentication
                                </p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Add an extra layer of security
                                </p>
                            </button>

                            <button className="w-full text-left px-4 py-3 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition">
                                <p className="font-medium text-neutral-900 dark:text-neutral-50">
                                    Privacy Settings
                                </p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Manage your data and privacy
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
