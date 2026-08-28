'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Palette, RotateCcw, Check, Sparkles, Sun, Moon, ChevronDown, Save, Edit2, X } from 'lucide-react';
import { useTheme, type AccentPreset } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

export function AccentColorSelector() {
  const {
    accentLight,
    accentDark,
    presets,
    setAccentLight,
    setAccentDark,
    applyPreset,
    updatePreset,
    resetPresets,
    resolvedTheme,
  } = useTheme();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [editLight, setEditLight] = useState<string>('');
  const [editDark, setEditDark] = useState<string>('');
  const [updatedFeedbackId, setUpdatedFeedbackId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setEditingPresetId(null);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleUpdateFromActive = (preset: AccentPreset) => {
    updatePreset(preset.id, accentLight, accentDark);
    setUpdatedFeedbackId(preset.id);
    setTimeout(() => setUpdatedFeedbackId(null), 2500);
  };

  const handleStartEdit = (preset: AccentPreset) => {
    setEditingPresetId(preset.id);
    setEditLight(preset.light);
    setEditDark(preset.dark);
  };

  const handleSaveInlineEdit = (presetId: string) => {
    if (editLight && editDark) {
      updatePreset(presetId, editLight, editDark);
      setUpdatedFeedbackId(presetId);
      setTimeout(() => setUpdatedFeedbackId(null), 2500);
    }
    setEditingPresetId(null);
  };

  return (
    <div className="relative inline-block text-left font-serif" ref={dropdownRef}>
      {/* Botón Disparador en la Cabecera */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-[#1C1B19] border border-stone-200/90 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 shadow-xs transition-all cursor-pointer group"
        title={language === 'eu' ? 'Pertsonalizatu dendako koloreak' : 'Personalizar colores de la tienda'}
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
        <div className="absolute right-0 mt-2 w-84 sm:w-104 rounded-3xl bg-white dark:bg-[#1C1B19] border border-stone-200 dark:border-stone-800 shadow-2xl p-5 z-50 space-y-5 animate-in fade-in zoom-in-95 duration-150">
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
                  ? 'Aukeratu edo aldatu kolorea modu argian eta ilunean. Zure paletak gorde ditzakezu.'
                  : 'Ajusta el color activo o actualiza las paletas guardadas de EkhiTeka.'}
              </p>
            </div>

            <button
              type="button"
              onClick={resetPresets}
              className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-400 transition-colors shrink-0 cursor-pointer"
              title={language === 'eu' ? 'Berrezarri jatorrizko paletak' : 'Restablecer paletas por defecto'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 1. Color Activo Actual (Claro y Oscuro) */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block font-sans">
              {language === 'eu' ? 'Uneko Kolore Aktiboa:' : 'Color Activo Actual:'}
            </span>

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
          </div>

          {/* 2. Paletas EkhiTeka (1, 2, 3, 4) con opción a Actualizar individualmente */}
          <div className="space-y-2.5 pt-2 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-stone-900 dark:text-stone-100 block font-sans">
                {language === 'eu' ? 'Paletak EkhiTeka' : 'Paletas EkhiTeka'}
              </span>
              <span className="text-[10px] text-stone-400 font-sans">
                {language === 'eu' ? '4 Paleta pertsonalizagarri' : '4 Paletas personalizables'}
              </span>
            </div>

            <div className="space-y-2">
              {presets.map((p) => {
                const isSelected =
                  accentLight.toUpperCase() === p.light.toUpperCase() &&
                  accentDark.toUpperCase() === p.dark.toUpperCase();
                const isEditingThis = editingPresetId === p.id;
                const isUpdatedJustNow = updatedFeedbackId === p.id;

                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-amber-500/80 bg-amber-500/5 dark:bg-amber-500/10 shadow-xs'
                        : 'border-stone-200/80 dark:border-stone-800 bg-stone-50/60 dark:bg-[#141312]'
                    }`}
                  >
                    {/* Vista Normal de la Paleta */}
                    {!isEditingThis ? (
                      <div className="flex items-center justify-between gap-2">
                        {/* Clic para Aplicar esta Paleta */}
                        <div
                          onClick={() => applyPreset(p)}
                          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer group"
                        >
                          <div className="w-7 h-7 rounded-xl bg-stone-200/70 dark:bg-stone-800 flex items-center justify-center font-bold text-xs text-stone-700 dark:text-stone-300 shrink-0 font-sans">
                            {p.number}
                          </div>

                          {/* Swatches Claro y Oscuro */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 shadow-xs inline-block"
                              style={{ backgroundColor: p.light }}
                              title={`Claro: ${p.light}`}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-white/20 shadow-xs inline-block"
                              style={{ backgroundColor: p.dark }}
                              title={`Oscuro: ${p.dark}`}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 transition-colors">
                              {language === 'eu' ? p.name_eu || `Paleta ${p.number}` : `Paleta ${p.number}`}
                            </p>
                            <p className="text-[10px] text-stone-400 font-sans font-mono truncate">
                              {p.light} · {p.dark}
                            </p>
                          </div>

                          {isSelected && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md shrink-0">
                              {language === 'eu' ? 'Aktiboa' : 'Activa'}
                            </span>
                          )}
                        </div>

                        {/* Botones de Acción: Editar / Actualizar */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Botón Actualizar (guarda los colores activos actuales en esta paleta) */}
                          <button
                            type="button"
                            onClick={() => handleUpdateFromActive(p)}
                            className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                              isUpdatedJustNow
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-200/80 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                            }`}
                            title={
                              language === 'eu'
                                ? `Gorde uneko koloreak ${p.name_eu || 'Paleta ' + p.number}-(e)n`
                                : `Sobrescribir ${p.name || 'Paleta ' + p.number} con los colores actuales`
                            }
                          >
                            {isUpdatedJustNow ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>{language === 'eu' ? 'Egina!' : '¡Hecho!'}</span>
                              </>
                            ) : (
                              <>
                                <Save className="w-3 h-3" />
                                <span>{language === 'eu' ? 'Eguneratu' : 'Actualizar'}</span>
                              </>
                            )}
                          </button>

                          {/* Botón Editar manualmente los colores de esta paleta */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(p)}
                            className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400 transition-colors cursor-pointer"
                            title={language === 'eu' ? 'Editatu koloreak' : 'Editar colores de esta paleta'}
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Modo Edición en Línea de la Paleta */
                      <div className="space-y-3 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 dark:text-stone-100 font-sans">
                            {language === 'eu' ? `Editatu ${p.name_eu || 'Paleta ' + p.number}` : `Editando ${p.name || 'Paleta ' + p.number}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingPresetId(null)}
                            className="p-1 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {/* Color Claro */}
                          <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-[#1F1E1C] rounded-xl border border-stone-200 dark:border-stone-700">
                            <Sun className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <label className="relative w-5 h-5 rounded-md overflow-hidden cursor-pointer shrink-0">
                              <input
                                type="color"
                                value={editLight}
                                onChange={(e) => setEditLight(e.target.value)}
                                className="absolute -top-3 -left-3 w-12 h-12 opacity-0 cursor-pointer"
                              />
                              <span className="w-full h-full block rounded-md" style={{ backgroundColor: editLight }} />
                            </label>
                            <input
                              type="text"
                              value={editLight.toUpperCase()}
                              onChange={(e) => setEditLight(e.target.value)}
                              className="w-full text-[11px] font-mono font-bold bg-transparent outline-none text-stone-900 dark:text-stone-100"
                              maxLength={7}
                            />
                          </div>

                          {/* Color Oscuro */}
                          <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-[#1F1E1C] rounded-xl border border-stone-200 dark:border-stone-700">
                            <Moon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <label className="relative w-5 h-5 rounded-md overflow-hidden cursor-pointer shrink-0">
                              <input
                                type="color"
                                value={editDark}
                                onChange={(e) => setEditDark(e.target.value)}
                                className="absolute -top-3 -left-3 w-12 h-12 opacity-0 cursor-pointer"
                              />
                              <span className="w-full h-full block rounded-md" style={{ backgroundColor: editDark }} />
                            </label>
                            <input
                              type="text"
                              value={editDark.toUpperCase()}
                              onChange={(e) => setEditDark(e.target.value)}
                              className="w-full text-[11px] font-mono font-bold bg-transparent outline-none text-stone-900 dark:text-stone-100"
                              maxLength={7}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingPresetId(null)}
                            className="px-3 py-1 rounded-xl text-xs font-bold text-stone-500 hover:bg-stone-200/60 cursor-pointer font-sans"
                          >
                            {language === 'eu' ? 'Utzi' : 'Cancelar'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveInlineEdit(p.id)}
                            className="px-3.5 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs cursor-pointer font-sans"
                          >
                            <Save className="w-3 h-3" />
                            <span>{language === 'eu' ? 'Gorde eta Aplikatu' : 'Actualizar'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vista Previa en Vivo */}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <span className="text-[11px] font-sans text-stone-500 dark:text-stone-400">
              {language === 'eu' ? 'Aurreikusi botoia:' : 'Vista previa del botón:'}
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
