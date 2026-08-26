'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { updateProfile, changeUserPassword } from '@/app/actions/auth';
import type { Profile } from '@/types/database';
import { parseProfile, isProfileComplete } from '@/types/database';
import {
  User,
  Phone,
  MapPin,
  Lock,
  Check,
  ShieldCheck,
  Home,
  Pencil,
  X,
  ChevronDown,
  Calendar,
  CreditCard,
  Mail,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ProfileFormProps {
  profile?: Profile;
  userProfile?: Profile;
}

export function ProfileForm({ profile, userProfile }: ProfileFormProps) {
  const raw = profile || userProfile || ({} as Profile);
  const { t } = useLanguage();

  const [currentProfile, setCurrentProfile] = useState<Profile>(parseProfile(raw));
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const p = currentProfile;
  const isComplete = isProfileComplete(p);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateProfile(formData);
    setLoadingProfile(false);

    if (res?.error) {
      setProfileMsg({ text: res.error, isError: true });
    } else {
      setProfileMsg({ text: t.common_success, isError: false });
      if (res?.updatedProfile) {
        setCurrentProfile(parseProfile(res.updatedProfile));
      }
      setIsEditing(false);
      setTimeout(() => setProfileMsg(null), 3500);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingPassword(true);
    setPasswordMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await changeUserPassword(formData);
    setLoadingPassword(false);

    if (res?.error) {
      setPasswordMsg({ text: res.error, isError: true });
    } else {
      setPasswordMsg({ text: '¡Contraseña actualizada con éxito!', isError: false });
      (e.target as HTMLFormElement).reset();
      setTimeout(() => {
        setPasswordMsg(null);
        setIsPasswordOpen(false);
      }, 2500);
    }
  };

  const formattedAddress = [
    p.street,
    p.number ? `Nº ${p.number}` : '',
    p.stair ? `Esc ${p.stair}` : '',
    p.floor ? `Piso ${p.floor}` : '',
    p.door ? `Pta ${p.door}` : '',
    p.postal_code,
    p.town,
    p.province,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-8 font-serif">
      {/* 1. TARJETA PRINCIPAL DE PERFIL */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Cabecera con Estado y Botón Editar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-[#C68D07] dark:text-[#FFE259]">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100">
                  {p.full_name || 'Usuario EkhiTeka'}
                </h2>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider font-sans ${
                    isComplete
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  }`}
                >
                  {isComplete ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" /> {t.profile_status_complete}
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" /> {t.profile_status_incomplete}
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                {t.profile_subtitle}
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer hover:scale-105 shrink-0"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{t.profile_edit_btn}</span>
            </button>
          )}
        </div>

        {profileMsg && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold text-center font-sans ${
              profileMsg.isError
                ? 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
                : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
            }`}
          >
            {profileMsg.text}
          </div>
        )}

        {/* ----------------- MODO VISTA: CADA CAMPO UNO A UNO ----------------- */}
        {!isEditing ? (
          <div className="space-y-6 font-sans text-xs">
            {/* Bloque: Identificación Personal */}
            <div className="space-y-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] flex items-center gap-1.5 font-serif">
                <CreditCard className="w-3.5 h-3.5" />
                <span>{t.profile_personal_data}</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                    {t.profile_first_name}
                  </span>
                  <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {p.first_name || t.profile_not_specified}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                    {t.profile_last_name_1}
                  </span>
                  <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {p.last_name_1 || t.profile_not_specified}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                    {t.profile_last_name_2}
                  </span>
                  <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {p.last_name_2 || t.profile_not_specified}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                    {t.profile_dni}
                  </span>
                  <p className="font-bold text-stone-900 dark:text-stone-100 text-sm uppercase">
                    {p.dni || t.profile_not_specified}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                    {t.profile_birth_date}
                  </span>
                  <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {p.birth_date || t.profile_not_specified}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                    {t.profile_phone}
                  </span>
                  <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {p.phone || t.profile_not_specified}
                  </p>
                </div>
              </div>
            </div>

            {/* Bloque: Dirección de Entrega Completa */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] flex items-center gap-1.5 font-serif">
                <Home className="w-3.5 h-3.5" />
                <span>{t.profile_address_data}</span>
              </span>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
                  <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {formattedAddress || t.profile_not_specified}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-stone-200/50 dark:border-stone-700/50 text-[11px] text-stone-600 dark:text-stone-300">
                  <div>
                    <span className="text-[9px] uppercase font-black text-stone-400 block">{t.profile_street}</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{p.street || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black text-stone-400 block">{t.profile_number} / {t.profile_floor}</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">Nº {p.number || '-'} · Piso {p.floor || '-'} {p.door ? `(${p.door})` : ''}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black text-stone-400 block">{t.profile_postal_code}</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{p.postal_code || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black text-stone-400 block">{t.profile_town} / {t.profile_province}</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{p.town || 'Lekeitio'} ({p.province || 'Bizkaia'})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ----------------- MODO EDICIÓN: CAMPOS EDITABLES ----------------- */
          <form onSubmit={handleProfileSubmit} className="space-y-5 font-sans text-xs animate-fadeIn">
            {/* 1. Nombre y Apellidos */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block mb-2 font-serif">
                {t.profile_personal_data}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_first_name} *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    required
                    defaultValue={p.first_name || ''}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_last_name_1} *
                  </label>
                  <input
                    type="text"
                    name="last_name_1"
                    required
                    defaultValue={p.last_name_1 || ''}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_last_name_2}
                  </label>
                  <input
                    type="text"
                    name="last_name_2"
                    defaultValue={p.last_name_2 || ''}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* 2. DNI, Fecha Nacimiento y Teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_dni} *
                </label>
                <input
                  type="text"
                  name="dni"
                  required
                  defaultValue={p.dni || ''}
                  placeholder="12345678Z"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl uppercase"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_birth_date} *
                </label>
                <input
                  type="date"
                  name="birth_date"
                  required
                  defaultValue={p.birth_date || ''}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_phone} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  defaultValue={p.phone || ''}
                  placeholder="600 000 000"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
            </div>

            {/* 3. Dirección de Entrega */}
            <div className="pt-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block mb-2 font-serif">
                {t.profile_address_data}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_province} *
                  </label>
                  <input
                    type="text"
                    name="province"
                    required
                    defaultValue={p.province || 'Bizkaia'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_town} *
                  </label>
                  <input
                    type="text"
                    name="town"
                    required
                    defaultValue={p.town || 'Lekeitio'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_postal_code} *
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    required
                    defaultValue={p.postal_code || ''}
                    placeholder="48280"
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* 4. Calle, Número, Escalera, Piso y Puerta */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              <div className="col-span-2 sm:col-span-2">
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_street} *
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  defaultValue={p.street || ''}
                  placeholder="Gamarra Kalea"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_number} *
                </label>
                <input
                  type="text"
                  name="number"
                  required
                  defaultValue={p.number || ''}
                  placeholder="4"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_stair}
                </label>
                <input
                  type="text"
                  name="stair"
                  defaultValue={p.stair || ''}
                  placeholder="A"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_floor} *
                </label>
                <input
                  type="text"
                  name="floor"
                  required
                  defaultValue={p.floor || ''}
                  placeholder="2"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_door} *
                </label>
                <input
                  type="text"
                  name="door"
                  required
                  defaultValue={p.door || ''}
                  placeholder="B"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-3 font-serif">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold text-xs uppercase tracking-wider hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                {t.common_cancel}
              </button>
              <button
                type="submit"
                disabled={loadingProfile}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{loadingProfile ? t.common_loading : t.profile_save_changes_btn}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. TARJETA CAMBIAR CONTRASEÑA (Desplegable) */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs">
        <button
          type="button"
          onClick={() => setIsPasswordOpen(!isPasswordOpen)}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 font-serif">
                {t.profile_security}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                {isPasswordOpen ? 'Introduce tu contraseña actual y la nueva clave.' : 'Pulsa aquí para cambiar tu contraseña de acceso.'}
              </p>
            </div>
          </div>

          <div className={`p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 transition-transform duration-200 ${isPasswordOpen ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </button>

        {isPasswordOpen && (
          <form onSubmit={handlePasswordSubmit} className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800 space-y-4 font-sans text-xs max-w-md animate-fadeIn">
            {passwordMsg && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold text-center ${
                  passwordMsg.isError
                    ? 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
                    : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                }`}
              >
                {passwordMsg.text}
              </div>
            )}

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {t.profile_current_password} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="current_password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {t.profile_new_password} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="new_password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {t.profile_confirm_password} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="confirm_password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end font-serif">
              <button
                type="submit"
                disabled={loadingPassword}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1D1D1B] dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4 text-[#FFE259] dark:text-[#1D1D1B]" />
                <span>{loadingPassword ? t.common_loading : t.profile_change_password_btn}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
