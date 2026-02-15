"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Language, translations, Translations } from '@/lib/i18n/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [language, setLanguageState] = useState<Language>('en')
  const [isLoading, setIsLoading] = useState(true)
  const [hasFetchedFromServer, setHasFetchedFromServer] = useState(false)

  // Fetch language from server for authenticated users
  const fetchUserLanguage = useCallback(async () => {
    try {
      const response = await fetch('/api/user/language')
      if (response.ok) {
        const data = await response.json()
        if (data.language && ['en', 'hi', 'mr', 'bh'].includes(data.language)) {
          setLanguageState(data.language as Language)
          localStorage.setItem('language', data.language)
        }
      }
    } catch (error) {
      console.error('Failed to fetch user language:', error)
    } finally {
      setIsLoading(false)
      setHasFetchedFromServer(true)
    }
  }, [])

  // Load language on mount
  useEffect(() => {
    // First check localStorage for immediate display
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language
      if (savedLanguage && ['en', 'hi', 'mr', 'bh'].includes(savedLanguage)) {
        setLanguageState(savedLanguage)
      }
    }

    // If authenticated and haven't fetched yet, get from server
    if (status === 'authenticated' && !hasFetchedFromServer) {
      fetchUserLanguage()
    } else if (status === 'unauthenticated') {
      setIsLoading(false)
    } else if (status === 'loading') {
      // Still loading session
    } else {
      setIsLoading(false)
    }
  }, [status, hasFetchedFromServer, fetchUserLanguage])

  // Save language to both localStorage and server
  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang)
    
    // Save to localStorage immediately for fast access
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }

    // If authenticated, also save to server
    if (session?.user) {
      try {
        await fetch('/api/user/language', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: lang })
        })
      } catch (error) {
        console.error('Failed to save language to server:', error)
      }
    }
  }, [session])

  const value = {
    language,
    setLanguage,
    t: translations[language],
    isLoading,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
