'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/i18n/translations';
import { ChevronDown, Check } from 'lucide-react';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string; name: string; flag: string }[] = [
    { code: 'eu', label: 'EUS', name: 'Euskara', flag: '🟢' },
    { code: 'es', label: 'ESP', name: 'Castellano', flag: '🇪🇸' },
    { code: 'en', label: 'ENG', name: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'FRA', name: 'Français', flag: '🇫🇷' },
  ];

  const currentLanguage = languages.find((l) => l.code === language) || languages[1];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative font-serif" ref={dropdownRef}>
      {/* Botón de Idioma Actual con Bandera */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-sm leading-none">{currentLanguage.flag}</span>
        <span className="font-bold text-[11px] tracking-wider uppercase font-sans">
          {currentLanguage.label}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Menú Desplegable con las Demás Opciones */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl p-1.5 min-w-[150px] space-y-1 animate-in fade-in zoom-in-95 duration-150">
          <p className="text-[9px] font-sans font-black uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500 px-2.5 py-1">
            Seleccionar Idioma
          </p>
          {languages.map((l) => {
            const isSelected = language === l.code;

            return (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLanguage(l.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-950 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{l.flag}</span>
                  <span className="text-[11px] font-serif">{l.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
