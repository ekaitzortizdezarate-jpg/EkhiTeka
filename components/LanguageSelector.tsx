'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/i18n/translations';
import { ChevronDown, Check } from 'lucide-react';

// Ikurrina SVG inline (bandera del País Vasco)
function IkurrinaSVG({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 600"
      className={className}
      aria-label="Ikurrina"
      role="img"
    >
      {/* Fondo rojo */}
      <rect width="900" height="600" fill="#D52B1E" />
      {/* Cruz blanca */}
      <rect x="0" y="225" width="900" height="150" fill="#FFFFFF" />
      <rect x="375" y="0" width="150" height="600" fill="#FFFFFF" />
      {/* Aspa verde */}
      <line x1="0" y1="0" x2="900" y2="600" stroke="#007A3D" strokeWidth="130" />
      <line x1="900" y1="0" x2="0" y2="600" stroke="#007A3D" strokeWidth="130" />
      {/* Cruz blanca encima del aspa */}
      <rect x="0" y="250" width="900" height="100" fill="#FFFFFF" />
      <rect x="400" y="0" width="100" height="600" fill="#FFFFFF" />
    </svg>
  );
}

// Bandera de España
function EspanaSVG({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 750 500"
      className={className}
      aria-label="Bandera de España"
      role="img"
    >
      <rect width="750" height="500" fill="#AA151B" />
      <rect y="125" width="750" height="250" fill="#F1BF00" />
    </svg>
  );
}

// Bandera del Reino Unido (Union Jack)
function UkSVG({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 30"
      className={className}
      aria-label="Union Jack"
      role="img"
    >
      <rect width="60" height="30" fill="#012169" />
      {/* Aspa de San Andrés (Escocia) */}
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
      {/* Aspa de San Patricio (Irlanda) */}
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
      {/* Cruz de San Jorge (Inglaterra) */}
      <rect x="25" y="0" width="10" height="30" fill="#FFFFFF" />
      <rect x="0" y="10" width="60" height="10" fill="#FFFFFF" />
      <rect x="27" y="0" width="6" height="30" fill="#C8102E" />
      <rect x="0" y="12" width="60" height="6" fill="#C8102E" />
    </svg>
  );
}

// Bandera de Francia
function FranciaSVG({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 600"
      className={className}
      aria-label="Bandera de Francia"
      role="img"
    >
      <rect width="300" height="600" fill="#002395" />
      <rect x="300" width="300" height="600" fill="#FFFFFF" />
      <rect x="600" width="300" height="600" fill="#ED2939" />
    </svg>
  );
}

type FlagKey = 'eu' | 'es' | 'en' | 'fr';

const FLAG_COMPONENTS: Record<FlagKey, (props: { className?: string }) => JSX.Element> = {
  eu: IkurrinaSVG,
  es: EspanaSVG,
  en: UkSVG,
  fr: FranciaSVG,
};

type LanguageEntry = {
  code: Language;
  label: string;
  name: string;
};

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: LanguageEntry[] = [
    { code: 'eu', label: 'Eus', name: 'Euskara' },
    { code: 'es', label: 'Cas', name: 'Castellano' },
    { code: 'en', label: 'Eng', name: 'English' },
    { code: 'fr', label: 'Fra', name: 'Français' },
  ];

  const currentLanguage = languages.find((l) => l.code === language) || languages[0];
  const flagClass = 'w-5 h-[13px] rounded-[2px] shadow-sm flex-shrink-0';

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
        {(() => {
          const FlagComponent = FLAG_COMPONENTS[currentLanguage.code as FlagKey];
          return <FlagComponent className={flagClass} />;
        })()}
        <span className="font-bold text-[11px] tracking-wider font-sans">
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
            const FlagComponent = FLAG_COMPONENTS[l.code as FlagKey];

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
                  <FlagComponent className={flagClass} />
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
