'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme, type Theme } from '@/context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

const MODES: { value: Theme; icon: React.ReactNode; label: string }[] = [
  { value: 'light', icon: <Sun className="w-4 h-4" />, label: 'Claro' },
  { value: 'system', icon: <Monitor className="w-4 h-4" />, label: 'Auto' },
  { value: 'dark', icon: <Moon className="w-4 h-4" />, label: 'Oscuro' },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cierra al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const active = MODES.find((m) => m.value === theme) ?? MODES[1];
  const others = MODES.filter((m) => m.value !== theme);

  return (
    <div className="relative" ref={ref}>
      {/* Botón del modo activo */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        title={active.label}
        className="flex items-center justify-center w-7 h-7 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all shadow-2xs cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {active.icon}
      </button>

      {/* Dropdown con las otras opciones */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 flex flex-col gap-0.5 p-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-150">
          {others.map(({ value, icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => { setTheme(value); setIsOpen(false); }}
              title={label}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-all cursor-pointer"
            >
              {icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
