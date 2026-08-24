'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { ShieldCheck, Cookie } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'ekhiteka_cookie_consent';

export function CookieBanner() {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        setShow(true);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    } catch {
      // Ignore
    }
    setShow(false);
  };

  const handleReject = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    } catch {
      // Ignore
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <aside aria-label="Aviso de cookies" className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 p-5 bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 shadow-2xl space-y-4 animate-fadeIn">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xs font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider">
            {t.legal_cookies}
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {t.cookie_text}{' '}
            <Link href="/cookies" className="underline font-bold hover:text-amber-600">
              Más información
            </Link>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={handleReject}
          className="px-3.5 py-1.5 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
        >
          {t.cookie_reject}
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="px-4 py-1.5 text-xs font-black bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition-all"
        >
          {t.cookie_accept}
        </button>
      </div>
    </aside>
  );
}
