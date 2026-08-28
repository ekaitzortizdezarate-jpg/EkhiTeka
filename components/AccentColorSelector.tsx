'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Palette, RotateCcw, Check, Sparkles, Sun, Moon, ChevronDown } from 'lucide-react';
import { useTheme, ACCENT_PRESETS, DEFAULT_ACCENT_LIGHT, DEFAULT_ACCENT_DARK, type AccentPreset } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

export function AccentColorSelector() {
  const {
    accentLight,
    accentDark,
    setAccentLight,
    setAccentDark,
    applyPreset,
    resetAccentColors,
    resolvedTheme,
  } = useTheme();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const isDefault =
    accentLight.toUpperCase() === DEFAULT_ACCENT_LIGHT.toUpperCase() &&
    accentDark.toUpperCase() === DEFAULT_ACCENT_DARK.toUpperCase();

  return (
    <div className="relative inline-block text-left font-serif" ref={dropdownRef}>
      {/* Botón Disparador en la Cabecera */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-[#1C1B19] border border-stone-200/90 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 shadow-xs transition-all cursor-pointer group"
        title={language === 'eu' ? 'Pertsonalizatu dendako koloreak' : 'Personalizar colores de acento'}
      >
        <div className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 group-hover:scale-105 transition-transform">
          <Palette className="w-4 h-4" />
        </div>

        <div className="text-left hidden sm:block">
          <span className="text-[10px] uppercase tracking-wider font-bold text-stone-500 dark:text-stone-400 block font-sans leading-tight">
            {language === 'eu' ? 'Koloreak' : 'Color de acento'}
          </span>
          <div className="flex items-center gap-1.5 pt-0.5">
            {/* Swatch Claro */}
            <span
              className="w-3 h-3 rounded-full border border-black/10 shadow-xs inline-block"
              style={{ backgroundColor: accentLight }}
              title={`Modo Claro: ${accentLight}`}
            />
            {/* Swatch Oscuro */}
            <span
              className="w-3 h-3 rounded-full border border-white/20 shadow-xs inline-block"
              style={{ backgroundColor: accentDark }}
              title={`Modo Oscuro: ${accentDark}`}
            />
            <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200">
              {resolvedTheme === 'dark' ? accentDark : accentLight}
            </span>
          </div>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Menú Desplegable / Panel de Configuración */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white dark:bg-[#1C1B19] border border-stone-200 dark:border-stone-800 shadow-2xl p-5 z-50 space-y-5 animate-in fade-in zoom-in-95 duration-150">
          {/* Cabecera del Panel */}
          <div className="flex items-start justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3.5">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-black text-stone-900 dark:text-stone-100">
                  {language === 'eu' ? 'Dendako Kolore Pertsonalizatuak' : 'Personalizar Color de Acento'}
                </h3>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans leading-relaxed">
                {language === 'eu'
                  ? 'Aukeratu botoi eta nabarmentzeetan erabiliko diren koloreak (argia eta iluna).'
                  : 'Sustituye el color de botones, distintivos e indicadores de toda la web.'}
              </p>
            </div>

            {!isDefault && (
              <button
                type="button"
                onClick={resetAccentColors}
                className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-400 transition-colors shrink-0 cursor-pointer"
                title={language === 'eu' ? 'Berrezarri lehenetsiak' : 'Restablecer recomendados'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 1. Selectores de Color Manual (Claro y Oscuro) */}
          <div className="grid grid-cols-2 gap-3 font-serif">
            {/* Color Modo Claro */}
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                  {language === 'eu' ? 'Modu Argia' : 'Modo Claro'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <label className="relative w-8 h-8 rounded-xl overflow-hidden shadow-xs cursor-pointer border border-stone-300 dark:border-stone-700 shrink-0 group">
                  <input
                    type="color"
                    value={accentLight}
                    onChange={(e) => setAccentLight(e.target.value)}
                    className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer opacity-0"
                  />
                  <span
                    className="w-full h-full block rounded-xl transition-transform group-hover:scale-110"
                    style={{ backgroundColor: accentLight }}
                  />
                </label>
                <input
                  type="text"
                  value={accentLight.toUpperCase()}
                  onChange={(e) => {
                    if (e.target.value.startsWith('#') && e.target.value.length <= 7) {
                      setAccentLight(e.target.value);
                    }
                  }}
                  className="w-full px-2 py-1 bg-white dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-mono font-bold text-stone-900 dark:text-stone-100 text-center"
                  maxLength={7}
                />
              </div>
            </div>

            {/* Color Modo Oscuro */}
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                  {language === 'eu' ? 'Modu Iluna' : 'Modo Oscuro'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <label className="relative w-8 h-8 rounded-xl overflow-hidden shadow-xs cursor-pointer border border-stone-300 dark:border-stone-700 shrink-0 group">
                  <input
                    type="color"
                    value={accentDark}
                    onChange={(e) => setAccentDark(e.target.value)}
                    className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer opacity-0"
                  />
                  <span
                    className="w-full h-full block rounded-xl transition-transform group-hover:scale-110"
                    style={{ backgroundColor: accentDark }}
                  />
                </label>
                <input
                  type="text"
                  value={accentDark.toUpperCase()}
                  onChange={(e) => {
                    if (e.target.value.startsWith('#') && e.target.value.length <= 7) {
                      setAccentDark(e.target.value);
                    }
                  }}
                  className="w-full px-2 py-1 bg-white dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-mono font-bold text-stone-900 dark:text-stone-100 text-center"
                  maxLength={7}
                />
              </div>
            </div>
          </div>

          {/* 2. Paletas Gourmet Predefinidas */}
          <div className="space-y-2 pt-1 border-t border-stone-200 dark:border-stone-800">
            <span className="text-[10.5px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block font-sans">
              {language === 'eu' ? 'Gomendatutako Paletak:' : 'Paletas Sugeridas EkhiTeka:'}
            </span>

            <div className="space-y-1.5">
              {ACCENT_PRESETS.map((p) => {
                const isSelected =
                  accentLight.toUpperCase() === p.light.toUpperCase() &&
                  accentDark.toUpperCase() === p.dark.toUpperCase();

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-2xl border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 shadow-xs'
                        : 'border-stone-200/80 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50/60 dark:bg-[#141312]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Pareja de swatches */}
                      <div className="flex -space-x-1 shrink-0">
                        <span
                          className="w-4 h-4 rounded-full border border-white/60 dark:border-stone-900 shadow-xs inline-block"
                          style={{ backgroundColor: p.light }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-white/60 dark:border-stone-900 shadow-xs inline-block"
                          style={{ backgroundColor: p.dark }}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                          {language === 'eu' ? p.name_eu : p.name}
                        </p>
                        <p className="text-[10px] text-stone-500 dark:text-stone-400 font-sans truncate">
                          {p.description}
                        </p>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vista Previa en Vivo */}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <span className="text-[11px] font-sans text-stone-500 dark:text-stone-400">
              {language === 'eu' ? 'Aurreikusi botoia:' : 'Vista previa:'}
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFE259] text-xs font-bold uppercase tracking-wider shadow-xs">
              <Check className="w-3 h-3" />
              <span>Ejemplo</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
