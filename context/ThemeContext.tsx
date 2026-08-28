'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Theme = 'system' | 'light' | 'dark';

export const DEFAULT_ACCENT_LIGHT = '#C8821C'; // Dorado Ámbar Artesano / Tostado Gourmet
export const DEFAULT_ACCENT_DARK = '#F3BA4C'; // Oro Miel Cálido / Champagne Gourmet

export interface AccentPreset {
  id: string;
  name: string;
  name_eu: string;
  light: string;
  dark: string;
  description: string;
}

export const ACCENT_PRESETS: AccentPreset[] = [
  {
    id: 'artisan_amber',
    name: 'Ámbar Dorado Artesano (Recomendado)',
    name_eu: 'Artisau Urre-Anbarra (Gomendatua)',
    light: '#C8821C',
    dark: '#F3BA4C',
    description: 'Tonos cálidos y elegantes inspirados en quesos curados, corteza tostada y Txakoli.',
  },
  {
    id: 'gourmet_ochre',
    name: 'Ocre Gourmet & Oro Miel',
    name_eu: 'Okre Gourmet & Ezti-Urrea',
    light: '#D97706',
    dark: '#FBBF24',
    description: 'Dorado vivo con brillo ámbar suave y excelente contraste.',
  },
  {
    id: 'rustic_terracotta',
    name: 'Terracota Rústica & Melocotón',
    name_eu: 'Terrakota Rustikoa & Mertxika',
    light: '#C25E2A',
    dark: '#FB923C',
    description: 'Calidez artesanal de barro cocido, madera de roble y membrillo.',
  },
  {
    id: 'noble_bronze',
    name: 'Bronce Noble & Seda',
    name_eu: 'Brontze Noblea & Zeta',
    light: '#9A5B18',
    dark: '#E6BC65',
    description: 'Estilo sobrio, distinguido y clásico con reflejos champagne.',
  },
];

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  accentLight: string;
  accentDark: string;
  setAccentLight: (color: string) => void;
  setAccentDark: (color: string) => void;
  applyPreset: (preset: AccentPreset) => void;
  resetAccentColors: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'ekhiteka_theme';
const ACCENT_LIGHT_KEY = 'ekhiteka_accent_light';
const ACCENT_DARK_KEY = 'ekhiteka_accent_dark';

function getResolvedTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'dark') return 'dark';
  if (theme === 'light') return 'light';
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

function applyThemeToDOM(isDark: boolean) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

function getContrastTextColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  let r = 0, g = 0, b = 0;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  }
  // Formula YIQ para luminancia perceptiva
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? '#1D1D1B' : '#FFFFFF';
}

function applyAccentVariables(light: string, dark: string, isDark: boolean) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const currentAccent = isDark ? dark : light;
  const contrastText = getContrastTextColor(currentAccent);

  root.style.setProperty('--brand-accent-light', light);
  root.style.setProperty('--brand-accent-dark', dark);
  root.style.setProperty('--brand-accent', currentAccent);
  root.style.setProperty('--brand-accent-contrast', contrastText);
  root.style.setProperty('--color-manduca-yellow', currentAccent);
  root.style.setProperty('--accent-yellow', currentAccent);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [accentLight, setAccentLightState] = useState<string>(DEFAULT_ACCENT_LIGHT);
  const [accentDark, setAccentDarkState] = useState<string>(DEFAULT_ACCENT_DARK);

  const applyTheme = useCallback(
    (t: Theme, curLight = accentLight, curDark = accentDark) => {
      const resolved = getResolvedTheme(t);
      const isDark = resolved === 'dark';
      applyThemeToDOM(isDark);
      applyAccentVariables(curLight, curDark, isDark);
      setResolvedTheme(resolved);
    },
    [accentLight, accentDark]
  );

  // Carga inicial desde localStorage
  useEffect(() => {
    let savedTheme: Theme = 'system';
    let savedLight = DEFAULT_ACCENT_LIGHT;
    let savedDark = DEFAULT_ACCENT_DARK;

    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
        savedTheme = storedTheme;
      }
      const storedLight = localStorage.getItem(ACCENT_LIGHT_KEY);
      if (storedLight && storedLight.startsWith('#')) {
        savedLight = storedLight;
      }
      const storedDark = localStorage.getItem(ACCENT_DARK_KEY);
      if (storedDark && storedDark.startsWith('#')) {
        savedDark = storedDark;
      }
    } catch {}

    setThemeState(savedTheme);
    setAccentLightState(savedLight);
    setAccentDarkState(savedDark);
    applyTheme(savedTheme, savedLight, savedDark);
  }, [applyTheme]);

  // Listener para preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      setThemeState((current) => {
        if (current === 'system') {
          const isDark = mediaQuery.matches;
          applyThemeToDOM(isDark);
          applyAccentVariables(accentLight, accentDark, isDark);
          setResolvedTheme(isDark ? 'dark' : 'light');
        }
        return current;
      });
    };
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [accentLight, accentDark]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch {}
      applyTheme(newTheme, accentLight, accentDark);
    },
    [applyTheme, accentLight, accentDark]
  );

  const setAccentLight = useCallback(
    (color: string) => {
      setAccentLightState(color);
      try {
        localStorage.setItem(ACCENT_LIGHT_KEY, color);
      } catch {}
      applyAccentVariables(color, accentDark, resolvedTheme === 'dark');
    },
    [accentDark, resolvedTheme]
  );

  const setAccentDark = useCallback(
    (color: string) => {
      setAccentDarkState(color);
      try {
        localStorage.setItem(ACCENT_DARK_KEY, color);
      } catch {}
      applyAccentVariables(accentLight, color, resolvedTheme === 'dark');
    },
    [accentLight, resolvedTheme]
  );

  const applyPreset = useCallback(
    (preset: AccentPreset) => {
      setAccentLightState(preset.light);
      setAccentDarkState(preset.dark);
      try {
        localStorage.setItem(ACCENT_LIGHT_KEY, preset.light);
        localStorage.setItem(ACCENT_DARK_KEY, preset.dark);
      } catch {}
      applyAccentVariables(preset.light, preset.dark, resolvedTheme === 'dark');
    },
    [resolvedTheme]
  );

  const resetAccentColors = useCallback(() => {
    setAccentLightState(DEFAULT_ACCENT_LIGHT);
    setAccentDarkState(DEFAULT_ACCENT_DARK);
    try {
      localStorage.removeItem(ACCENT_LIGHT_KEY);
      localStorage.removeItem(ACCENT_DARK_KEY);
    } catch {}
    applyAccentVariables(DEFAULT_ACCENT_LIGHT, DEFAULT_ACCENT_DARK, resolvedTheme === 'dark');
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        accentLight,
        accentDark,
        setAccentLight,
        setAccentDark,
        applyPreset,
        resetAccentColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'system' as Theme,
      resolvedTheme: 'light' as const,
      setTheme: () => {},
      accentLight: DEFAULT_ACCENT_LIGHT,
      accentDark: DEFAULT_ACCENT_DARK,
      setAccentLight: () => {},
      setAccentDark: () => {},
      applyPreset: () => {},
      resetAccentColors: () => {},
    };
  }
  return context;
}
