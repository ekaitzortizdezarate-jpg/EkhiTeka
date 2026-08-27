'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
import { MessageCircle, Sparkles, Gift } from 'lucide-react';

export function ExperienceBanners() {
  const { t } = useLanguage();
  const { getWhatsAppUrl, hasActiveWhatsApp, getSiteImage } = useStoreConfig();

  return (
    <section id="experiencias" className="space-y-8 pt-8">
      <div>
        <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
          {t.exp_banner_badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1D1D1B] dark:text-stone-100 tracking-tight leading-tight font-serif">
          {t.exp_banner_title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-serif">
        {/* Banner 1: Catas Presenciales */}
        <div className="manduca-card group relative bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-44 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src={getSiteImage('exp_catas', '/images/secciones/Catas.JPG')}
                alt={t.exp_b1_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 leading-snug">
                {t.exp_b1_title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium font-sans">
                {t.exp_b1_desc}
              </p>
            </div>
          </div>

          {hasActiveWhatsApp ? (
            <a
              href={getWhatsAppUrl('Hola, quisiera información sobre las catas presenciales de EkhiTeka')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.exp_b1_btn}</span>
            </a>
          ) : (
            <Link
              href="/experiencias"
              className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259] text-stone-900 dark:text-stone-100 hover:text-[#1D1D1B] font-black text-xs transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.exp_b1_btn}</span>
            </Link>
          )}
        </div>

        {/* Banner 2: Mesas de Quesos */}
        <div className="manduca-card group relative bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-44 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src={getSiteImage('exp_mesas', '/images/secciones/Mesas.JPG')}
                alt={t.exp_b2_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 leading-snug">
                {t.exp_b2_title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium font-sans">
                {t.exp_b2_desc}
              </p>
            </div>
          </div>

          {hasActiveWhatsApp ? (
            <a
              href={getWhatsAppUrl('Hola, quisiera presupuesto para un evento o boda con mesa de quesos')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.exp_b2_btn}</span>
            </a>
          ) : (
            <Link
              href="/regalos-empresa"
              className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259] text-stone-900 dark:text-stone-100 hover:text-[#1D1D1B] font-black text-xs transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.exp_b2_btn}</span>
            </Link>
          )}
        </div>

        {/* Banner 3: Cestas y Regalos */}
        <div className="manduca-card group relative bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-44 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src={getSiteImage('exp_cestas', '/images/secciones/Cestas.JPG')}
                alt={t.exp_b3_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 leading-snug">
                {t.exp_b3_title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium font-sans">
                {t.exp_b3_desc}
              </p>
            </div>
          </div>

          <Link
            href="/regalos-gourmet"
            className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs transition-all shadow-xs"
          >
            <Gift className="w-4 h-4" />
            <span>{t.exp_b3_btn}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
