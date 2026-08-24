'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/i18n/translations';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'eu', label: 'EUS', flag: '🌱' },
    { code: 'es', label: 'ESP', flag: '🍷' },
    { code: 'en', label: 'ENG', flag: '🧀' },
    { code: 'fr', label: 'FRA', flag: '🥖' },
  ];

  return (
    <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
      <Globe className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 ml-1 shrink-0" />
      {languages.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLanguage(l.code)}
          className={`px-2 py-1 rounded-lg font-bold transition-all text-[11px] ${
            language === l.code
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-700/60'
          }`}
          title={l.label}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
