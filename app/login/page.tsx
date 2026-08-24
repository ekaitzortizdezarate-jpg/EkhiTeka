'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { login } from '@/app/actions/auth';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await login(formData);
    if (res?.error) {
      setErrorMsg(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-12 px-4">
      {/* Fondo de pantalla: Tienda */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/secciones/Tienda.JPG"
          alt="EkhiTeka Tienda"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight drop-shadow-md">
            {t.nav_login}
          </h1>
          <p className="text-xs font-medium text-stone-200 dark:text-stone-300 font-serif">
            Accede a tu cuenta gourmet en EkhiTeka.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-700 text-red-900 dark:text-red-200 text-xs font-bold rounded-2xl text-center shadow-lg">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-3xl border-2 border-stone-200/90 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-2xl"
        >
          <div className="space-y-1.5">
            <label className="block text-xs font-black font-serif text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {t.auth_email}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                placeholder="tu@email.com"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFE259] text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black font-serif text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {t.auth_password}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFE259] text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#FFE259] hover:bg-[#F5D742] active:bg-[#E5C428] disabled:opacity-50 text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2 font-serif hover:scale-102"
          >
            {loading ? (
              <span>{t.common_loading}</span>
            ) : (
              <>
                <span>{t.nav_login}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-center font-serif">
            <Link
              href="/register"
              className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-[#C68D07] dark:hover:text-[#FFE259] transition-colors"
            >
              {t.auth_no_account}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}