'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { updateProfile, changeUserPassword } from '@/app/actions/auth';
import type { Profile } from '@/types/database';
import { parseProfile } from '@/types/database';
import { User, Phone, MapPin, Lock, Check, ShieldCheck, Home } from 'lucide-react';

interface ProfileFormProps {
  profile?: Profile;
  userProfile?: Profile;
}

export function ProfileForm({ profile, userProfile }: ProfileFormProps) {
  const raw = profile || userProfile || ({} as Profile);
  const p = parseProfile(raw);
  const { t } = useLanguage();

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

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
      setTimeout(() => setPasswordMsg(null), 3500);
    }
  };

  return (
    <div className="space-y-10 font-serif">
      {/* 1. SECCIÓN DATOS PERSONALES Y DIRECCIÓN */}
      <form
        onSubmit={handleProfileSubmit}
        className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-xs"
      >
        <div className="flex items-center gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-[#C68D07] dark:text-[#FFE259]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-stone-900 dark:text-stone-100">
              {t.profile_personal_data}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
              {t.profile_subtitle}
            </p>
          </div>
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

        <div className="space-y-4 font-sans text-xs">
          {/* Nombre y Apellidos */}
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

          {/* DNI, Fecha Nacimiento y Teléfono */}
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

          {/* Subtítulo Dirección */}
          <div className="pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-800 dark:text-stone-200 font-serif flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-[#C68D07] dark:text-[#FFE259]" />
              <span>{t.profile_address_data}</span>
            </h3>
          </div>

          {/* Provincia, Municipio y Código Postal */}
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

          {/* Calle, Nº, Escalera, Piso y Puerta */}
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
        </div>

        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <button
            type="submit"
            disabled={loadingProfile}
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-102 cursor-pointer font-serif disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{loadingProfile ? t.common_loading : t.profile_save_changes_btn}</span>
          </button>
        </div>
      </form>

      {/* 2. SECCIÓN CAMBIO DE CONTRASEÑA */}
      <form
        onSubmit={handlePasswordSubmit}
        className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-xs"
      >
        <div className="flex items-center gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-stone-900 dark:text-stone-100">
              {t.profile_security}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
              Actualiza tu clave de acceso para proteger tu cuenta.
            </p>
          </div>
        </div>

        {passwordMsg && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold text-center font-sans ${
              passwordMsg.isError
                ? 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
                : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
            }`}
          >
            {passwordMsg.text}
          </div>
        )}

        <div className="space-y-4 font-sans text-xs max-w-md">
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
        </div>

        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <button
            type="submit"
            disabled={loadingPassword}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D1D1B] dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-102 cursor-pointer font-serif disabled:opacity-50"
          >
            <Check className="w-4 h-4 text-[#FFE259] dark:text-[#1D1D1B]" />
            <span>{loadingPassword ? t.common_loading : t.profile_change_password_btn}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
