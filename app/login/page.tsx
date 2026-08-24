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
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-black text-2xl flex items-center justify-center mx-auto border-2 border-amber-500/30">
          🧀
        </div>
        <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100">
          {t.nav_login}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Accede a tu cuenta gourmet en EkhiTeka.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-700 text-red-900 dark:text-red-200 text-xs font-bold rounded-2xl text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="space-y-1.5">
          <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            {t.auth_email}
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

        <div className="space-y-1.5">
          <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            {t.auth_password}
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
            />
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
              <span>{t.nav_login}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-center">
          <Link
            href="/register"
            className="text-xs font-bold text-stone-500 dark:text-stone-400 hover:text-amber-600 transition-colors"
          >
            {t.auth_no_account}
          </Link>
        </div>
      </form>
    </div>
  );
}
