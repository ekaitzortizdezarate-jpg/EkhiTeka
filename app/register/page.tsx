'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { register } from '@/app/actions/auth';
import { Lock, Mail, User, Phone, MapPin, Store, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { t } = useLanguage();
  const [role, setRole] = useState<'comprador' | 'vendedor'>('comprador');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    formData.set('role', role);

    const res = await register(formData);
    if (res?.error) {
      setErrorMsg(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-black text-2xl flex items-center justify-center mx-auto border-2 border-amber-500/30">
          🧀
        </div>
        <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100">
          {t.nav_register}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Únete a la comunidad de gastronomía artesana de EkhiTeka.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-700 text-red-900 dark:text-red-200 text-xs font-bold rounded-2xl text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-sm">
        {/* Selector de Rol */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            Tipo de Cuenta
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('comprador')}
              className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 text-xs font-black transition-all cursor-pointer ${
                role === 'comprador'
                  ? 'border-amber-600 bg-amber-50 dark:bg-amber-950 text-amber-950 dark:text-amber-200 shadow-xs'
                  : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{t.role_buyer}</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('vendedor')}
              className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 text-xs font-black transition-all cursor-pointer ${
                role === 'vendedor'
                  ? 'border-amber-600 bg-amber-50 dark:bg-amber-950 text-amber-950 dark:text-amber-200 shadow-xs'
                  : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>{t.role_seller}</span>
            </button>
          </div>
        </div>

        {/* Nombre */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            {role === 'vendedor' ? 'Nombre del Artesano / Tienda' : t.auth_full_name} *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="full_name"
              required
              placeholder={role === 'vendedor' ? 'Ej: Quesería Idiazabal Etxea' : 'Tu nombre y apellidos'}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            {t.auth_email} *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              name="email"
              required
              placeholder="tu@email.com"
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>

        {/* Contraseña */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            {t.auth_password} *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              name="password"
              required
              placeholder="Mínimo 6 caracteres"
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>

        {/* Teléfono y Ciudad */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {t.auth_phone}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                placeholder="600 000 000"
                className="w-full pl-8 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {t.auth_town}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="town"
                defaultValue="Bilbao"
                className="w-full pl-8 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
        >
          {loading ? (
            <span>{t.common_loading}</span>
          ) : (
            <>
              <span>{t.nav_register}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-center">
          <Link
            href="/login"
            className="text-xs font-bold text-stone-500 dark:text-stone-400 hover:text-amber-600 transition-colors"
          >
            {t.auth_have_account}
          </Link>
        </div>
      </form>
    </div>
  );
}
