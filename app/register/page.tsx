'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { signup } from '@/app/actions/auth';
import { UserPlus, Mail, Lock, User, Phone, MapPin, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await signup(formData);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 sm:p-10 space-y-8 shadow-xl font-serif">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#FFE259] text-[#1D1D1B] flex items-center justify-center mx-auto shadow-xs">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {t.nav_register}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Crea tu cuenta para disfrutar de nuestros quesos y experiencias.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 rounded-2xl text-xs font-bold text-red-800 dark:text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
              {t.auth_full_name} *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="full_name"
                required
                placeholder="Nombre y Apellidos"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
              {t.auth_email} *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                placeholder="tu@email.com"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
              {t.auth_password} *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                required
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                {t.auth_phone}
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="600 000 000"
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                {t.auth_town}
              </label>
              <input
                type="text"
                name="town"
                placeholder="Lekeitio / Bilbao"
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : t.nav_register}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100 dark:border-stone-800">
          <Link
            href="/login"
            className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          >
            {t.auth_have_account}
          </Link>
        </div>
      </div>
    </div>
  );
}
