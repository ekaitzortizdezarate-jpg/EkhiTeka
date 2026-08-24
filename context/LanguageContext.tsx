'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Language, TranslationDict, translations } from '@/lib/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDict;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'ekhiteka_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('eu');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (saved && (saved === 'eu' || saved === 'es' || saved === 'en' || saved === 'fr')) {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // Ignore
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      document.documentElement.lang = lang;
      window.dispatchEvent(new Event('ekhiteka_language_changed'));
    } catch {
      // Ignore
    }
  };

  const t = useMemo(() => translations[language] || translations.eu, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'eu' as Language,
      setLanguage: () => {},
      t: translations.eu,
    };
  }
  return context;
}
