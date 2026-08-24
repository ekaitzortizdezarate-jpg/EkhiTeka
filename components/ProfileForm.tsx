'use client';

import { useState } from 'react';
import { updateProfile, changeUserPassword } from '@/app/actions/admin';
import { type Profile, parseProfile, isProfileComplete } from '@/types/database';
import {
  Check,
  Pencil,
  Lock,
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  AlertCircle,
  ShieldCheck,
  Phone,
  Calendar,
  CreditCard,
  Building,
} from 'lucide-react';

interface ProfileFormProps {
  userProfile: Profile;
}

export function ProfileForm({ userProfile }: ProfileFormProps) {
  const profile = parseProfile(userProfile);
  const complete = isProfileComplete(userProfile);

  const [isEditing, setIsEditing] = useState(!complete);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Acordeón de cambiar contraseña
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateProfile(formData);
    setLoading(false);

    if (res?.error) {
      setMsg({ text: res.error, isError: true });
    } else {
      setMsg({ text: '¡Datos de perfil guardados y actualizados correctamente!', isError: false });
      setIsEditing(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMsg(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const res = await changeUserPassword(formData);
    setPasswordLoading(false);

    if (res?.error) {
      setPasswordMsg({ text: res.error, isError: true });
    } else {
      setPasswordMsg({ text: res?.message || '¡Contraseña actualizada con éxito!', isError: false });
      form.reset();
      setTimeout(() => {
        setPasswordOpen(false);
        setPasswordMsg(null);
      }, 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alerta de perfil incompleto */}
      {!complete && (
        <div className="p-4 rounded-2xl bg-[#FFE259]/20 border-2 border-[#FFE259] text-stone-900 dark:text-stone-100 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-[#C68D07] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-black uppercase tracking-wide">
              {profile.role === 'vendedor'
                ? 'Completa tu perfil de Vendedor EkhiTeka'
                : 'Completa tu perfil de Comprador'}
            </p>
            <p className="text-stone-700 dark:text-stone-300 font-medium">
              Para poder {profile.role === 'vendedor' ? 'publicar productos en el catálogo' : 'realizar compras y pedidos'}, es obligatorio rellenar todos los campos personales y de dirección marcados con (*).
            </p>
          </div>
        </div>
      )}

      {/* Mensaje de estado al guardar perfil */}
      {msg && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold text-center shadow-xs ${
            msg.isError
              ? 'bg-red-100 text-red-900 dark:bg-red-950/70 dark:text-red-200 border border-red-300 dark:border-red-800'
              : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* 1. MODO VISTA FIJA (Read-Only) */}
      {!isEditing ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE259] text-[#1D1D1B] flex items-center justify-center font-serif font-black text-lg shadow-xs">
                {profile.first_name?.[0]?.toUpperCase() || profile.full_name?.[0]?.toUpperCase() || 'E'}
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                  {profile.first_name} {profile.last_name_1} {profile.last_name_2 || ''}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FFE259] text-[#1D1D1B]">
                    {profile.role}
                  </span>
                  <span className="text-xs text-stone-500">{userProfile.email}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs hover:scale-102 cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Editar Datos</span>
            </button>
          </div>

          {/* Bloque: Datos Personales Fijos */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-1.5 font-sans">
              <User className="w-3.5 h-3.5 text-[#C68D07]" />
              <span>Información Personal</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Nombre Completo</span>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {profile.first_name} {profile.last_name_1} {profile.last_name_2 || ''}
                </span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">DNI / NIF</span>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {profile.dni || '—'}
                </span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Fecha de Nacimiento</span>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {profile.birth_date || '—'}
                </span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Teléfono de Contacto</span>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {profile.phone || '—'}
                </span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200/80 dark:border-stone-800 sm:col-span-2">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Email de la Cuenta</span>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {userProfile.email}
                </span>
              </div>
            </div>
          </div>

          {/* Bloque: Dirección y Ubicación Fija */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-1.5 font-sans">
              <MapPin className="w-3.5 h-3.5 text-[#C68D07]" />
              <span>Dirección & Ubicación {profile.role === 'vendedor' ? '(Tienda física)' : ''}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200/80 dark:border-stone-800 sm:col-span-2">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Calle y Número</span>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {profile.street ? `${profile.street}, Nº ${profile.number || ''}` : '—'}
                </span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Escalera</span>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {profile.stair || '—'}
                </span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Piso y Puerta</span>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {profile.floor ? `Piso ${profile.floor}, Pta ${profile.door || ''}` : '—'}
                </span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Código Postal</span>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {profile.postal_code || '—'}
                </span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Pueblo / Municipio</span>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {profile.town || '—'}
                </span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200/80 dark:border-stone-800 sm:col-span-2">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Provincia</span>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {profile.province || '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 2. MODO EDICIÓN DE PERFIL (14 campos individuales) */
        <form
          onSubmit={handleProfileSubmit}
          className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-sm"
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                Editar Datos del Perfil
              </h2>
              <p className="text-xs text-stone-500">
                Rellena todos los campos obligatorios (*)
              </p>
            </div>
            {complete && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 px-3 py-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>

          {/* Sección 1: Datos Personales */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#C68D07]" />
              <span>1. Datos Personales</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-black text-stone-700 dark:text-stone-300 uppercase">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="first_name"
                  required
                  defaultValue={profile.first_name || ''}
                  placeholder="Ej: Ekaitz"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-black text-stone-700 dark:text-stone-300 uppercase">
                  1er Apellido *
                </label>
                <input
                  type="text"
                  name="last_name_1"
                  required
                  defaultValue={profile.last_name_1 || ''}
                  placeholder="Ej: Ortiz"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-black text-stone-700 dark:text-stone-300 uppercase">
                  2º Apellido <span className="text-stone-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  name="last_name_2"
                  defaultValue={profile.last_name_2 || ''}
                  placeholder="Ej: de Zarate"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-black text-stone-700 dark:text-stone-300 uppercase">
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  name="birth_date"
                  required
                  defaultValue={profile.birth_date || ''}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-black text-stone-700 dark:text-stone-300 uppercase">
                  DNI / NIF *
                </label>
                <input
                  type="text"
                  name="dni"
                  required
                  defaultValue={profile.dni || ''}
                  placeholder="Ej: 12345678Z"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-black text-stone-700 dark:text-stone-300 uppercase">
                  Teléfono Móvil *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  defaultValue={profile.phone || ''}
                  placeholder="Ej: 600 000 000"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Sección 2: Dirección y Ubicación */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C68D07]" />
              <span>2. Dirección de Contacto {profile.role === 'vendedor' ? '(Tienda física)' : ''}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-black text-stone-700 dark:text-stone-300 uppercase">
                  Provincia *
                </label>
                <input
                  type="text"
                  name="province"
                  required
                  defaultValue={profile.province || 'Bizkaia'}
                  placeholder="Ej: Bizkaia, Gipuzkoa, Álava..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-black text-stone-700 dark:text-stone-300 uppercase">
                  Pueblo / Municipio *
                </label>
                <input
                  type="text"
                  name="town"
                  required
                  defaultValue={profile.town || 'Lekeitio'}
                  placeholder="Ej: Lekeitio"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-black text-stone-700 dark:text-stone-300 uppercase">
                  Código Postal *
                </label>
                <input
                  type="text"
                  name="postal_code"
                  required
                  defaultValue={profile.postal_code || '48280'}
                  placeholder="Ej: 48280"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="space-y-1 sm:col-span-8">
                <label className="block text-[11px] font-black text-stone-700 dark:text-stone-300 uppercase">
                  Calle / Avenida / Plaza *
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  defaultValue={profile.street || (profile.role === 'vendedor' ? 'Gamarra Kalea' : '')}
                  placeholder="Ej: Gamarra Kalea"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-4">
                <label className="block text-[11px] font-black text-stone-700 dark:text-stone-300 uppercase">
                  Número *
                </label>
                <input
                  type="text"
                  name="number"
                  required
                  defaultValue={profile.number || (profile.role === 'vendedor' ? '4' : '')}
                  placeholder="Ej: 4"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-black text-stone-700 dark:text-stone-300 uppercase">
                  Escalera <span className="text-stone-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  name="stair"
                  defaultValue={profile.stair || ''}
                  placeholder="Ej: A, Izq..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-black text-stone-700 dark:text-stone-300 uppercase">
                  Piso *
                </label>
                <input
                  type="text"
                  name="floor"
                  required
                  defaultValue={profile.floor || (profile.role === 'vendedor' ? 'Bajo' : '')}
                  placeholder="Ej: Bajo, 1º, 2º..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-black text-stone-700 dark:text-stone-300 uppercase">
                  Puerta *
                </label>
                <input
                  type="text"
                  name="door"
                  required
                  defaultValue={profile.door || (profile.role === 'vendedor' ? 'Local' : '')}
                  placeholder="Ej: A, B, Local, Izq..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
            {complete ? (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 text-xs font-bold text-stone-500 hover:text-stone-800 rounded-xl"
              >
                Cancelar
              </button>
            ) : (
              <div />
            )}

            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 bg-[#FFE259] hover:bg-[#F5D742] active:bg-[#E5C428] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Guardando...' : 'Guardar Datos del Perfil'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. DESPLEGABLE / ACORDEÓN: CAMBIAR CONTRASEÑA */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setPasswordOpen(!passwordOpen)}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-stone-50 dark:hover:bg-stone-850 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                Cambiar Contraseña
              </h3>
              <p className="text-[11px] text-stone-500">
                Actualiza tu clave de acceso introduciendo tu contraseña actual
              </p>
            </div>
          </div>
          {passwordOpen ? (
            <ChevronUp className="w-5 h-5 text-stone-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-stone-400" />
          )}
        </button>

        {passwordOpen && (
          <form
            onSubmit={handlePasswordSubmit}
            className="p-5 sm:p-6 pt-0 border-t border-stone-100 dark:border-stone-800 space-y-4 animate-fadeIn"
          >
            {passwordMsg && (
              <div
                className={`p-3 rounded-2xl text-xs font-bold text-center ${
                  passwordMsg.isError
                    ? 'bg-red-100 text-red-900 dark:bg-red-950/70 dark:text-red-200 border border-red-300'
                    : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200 border border-emerald-300'
                }`}
              >
                {passwordMsg.text}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[11px] font-black text-stone-700 dark:text-stone-300 uppercase">
                Contraseña Actual *
              </label>
              <input
                type="password"
                name="current_password"
                required
                placeholder="Introduce tu contraseña actual"
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-black text-stone-700 dark:text-stone-300 uppercase">
                  Nueva Contraseña *
                </label>
                <input
                  type="password"
                  name="new_password"
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-black text-stone-700 dark:text-stone-300 uppercase">
                  Confirmar Nueva Contraseña *
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  required
                  minLength={6}
                  placeholder="Repite la nueva contraseña"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={passwordLoading}
                className="px-6 py-2.5 bg-[#1D1D1B] dark:bg-white text-white dark:text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs hover:opacity-90 cursor-pointer"
              >
                {passwordLoading ? 'Comprobando...' : 'Actualizar Contraseña'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
