'use client';

import { useTheme, type Theme } from '@/context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

const MODES: { value: Theme; icon: React.ReactNode; label: string }[] = [
  { value: 'light', icon: <Sun className="w-3.5 h-3.5" />, label: 'Claro' },
  { value: 'system', icon: <Monitor className="w-3.5 h-3.5" />, label: 'Auto' },
  { value: 'dark', icon: <Moon className="w-3.5 h-3.5" />, label: 'Oscuro' },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="flex items-center rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 p-0.5 gap-0.5 shadow-2xs"
      role="group"
      aria-label="Seleccionar tema"
    >
      {MODES.map(({ value, icon, label }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            title={label}
            aria-pressed={isActive}
            className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all cursor-pointer ${
              isActive
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
