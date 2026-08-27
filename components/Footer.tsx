'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
import { Truck, Store, Sparkles } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();
  const { storeAddress, whatsappPhone, getWhatsAppUrl, hasActiveWhatsApp } = useStoreConfig();

  return (
    <footer className="border-t border-[#2D2B27] bg-[#141312] text-stone-300 transition-colors pt-0 pb-8 font-serif">
      {/* 1. Banner Destacado Amarillo (Solo si WhatsApp está habilitado) */}
      {hasActiveWhatsApp && (
        <div className="bg-[#FFE259] text-[#1D1D1B] py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] block text-[#1D1D1B]/80">
                {t.footer_club_title}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {t.footer_club_subtitle}
              </h3>
              <p className="text-xs sm:text-sm font-normal text-[#1D1D1B]/90 max-w-xl">
                {t.footer_club_desc}
              </p>
            </div>

            <a
              href={getWhatsAppUrl('Hola, quisiera unirme a las novedades del Club de Amigos de EkhiTeka')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1D1D1B] text-white hover:bg-stone-800 font-bold text-xs uppercase tracking-[0.14em] transition-all shadow-md shrink-0 hover:scale-105"
            >
              <span>{t.footer_join_whatsapp}</span>
            </a>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pt-12">
        {/* 2. Valores Gourmet - Monocromáticos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-[#2D2B27] text-center md:text-left">
          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#1C1B19] text-stone-200 flex items-center justify-center shrink-0 border border-[#2D2B27]">
              <Sparkles className="w-5 h-5 stroke-[1.75] text-stone-300" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-[0.14em]">{t.cat_queso} & {t.shop_specialty}</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-normal">
                {t.footer_cheese_desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#1C1B19] text-stone-200 flex items-center justify-center shrink-0 border border-[#2D2B27]">
              <Truck className="w-5 h-5 stroke-[1.75] text-stone-300" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-[0.14em]">{t.deliv_home}</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-normal">
                {t.footer_delivery_desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#1C1B19] text-stone-200 flex items-center justify-center shrink-0 border border-[#2D2B27]">
              <Store className="w-5 h-5 stroke-[1.75] text-stone-300" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-[0.14em]">{t.deliv_store_pickup}</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-normal">
                {t.footer_pickup_desc}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Enlaces & Categorías */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-[0.16em] text-[11px]">{t.footer_categories}</h4>
            <ul className="space-y-2 text-stone-400 font-normal">
              <li><Link href="/categoria/queso" className="hover:text-white transition-colors">{t.cat_queso}</Link></li>
              <li><Link href="/categoria/salazon" className="hover:text-white transition-colors">{t.cat_salazon}</Link></li>
              <li><Link href="/categoria/atun" className="hover:text-white transition-colors">{t.cat_atun}</Link></li>
              <li><Link href="/categoria/jildas" className="hover:text-white transition-colors">{t.cat_jildas}</Link></li>
              <li><Link href="/categoria/txakoli" className="hover:text-white transition-colors">{t.cat_txakoli}</Link></li>
              <li><Link href="/categoria/cerveza" className="hover:text-white transition-colors">{t.cat_cerveza}</Link></li>
              <li><Link href="/categoria/sidra" className="hover:text-white transition-colors">{t.cat_sidra}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-[0.16em] text-[11px]">{t.footer_experiences}</h4>
            <ul className="space-y-2 text-stone-400 font-normal">
              <li><Link href="/experiencias" className="hover:text-white transition-colors">{t.footer_exp_tasting}</Link></li>
              <li><Link href="/experiencias" className="hover:text-white transition-colors">{t.footer_exp_weddings}</Link></li>
              <li><Link href="/experiencias" className="hover:text-white transition-colors">{t.footer_exp_gifts}</Link></li>
              <li><Link href="/chat" className="hover:text-white transition-colors">{t.footer_exp_consult}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-[0.16em] text-[11px]">{t.footer_legal}</h4>
            <ul className="space-y-2 text-stone-400 font-normal">
              <li><Link href="/terminos" className="hover:text-white transition-colors">{t.legal_terms}</Link></li>
              <li><Link href="/privacidad" className="hover:text-white transition-colors">{t.legal_privacy}</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">{t.legal_cookies}</Link></li>
              <li><Link href="/aviso-legal" className="hover:text-white transition-colors">{t.legal_notice}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/Logo.jpg"
                alt="EkhiTeka"
                className="w-10 h-10 rounded-full object-cover border border-stone-600"
              />
              <h4 className="font-bold text-white uppercase tracking-[0.14em] text-[12px]">EkhiTeka Lekeitio</h4>
            </div>

            <div className="w-full h-24 rounded-2xl overflow-hidden border border-[#2D2B27] relative">
              <img
                src="/images/secciones/Tienda.JPG"
                alt="Quesería EkhiTeka Lekeitio"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-stone-400 leading-relaxed font-normal">
              {storeAddress}
            </p>
            <div className="text-stone-400 font-normal space-y-0.5 text-[11px]">
              <p className="font-bold text-stone-300 uppercase tracking-[0.12em]">{t.footer_schedule_title}</p>
              <p>{t.footer_schedule_weekdays}</p>
              <p>{t.footer_schedule_saturday}</p>
            </div>
            {hasActiveWhatsApp && whatsappPhone && (
              <p className="text-stone-300 font-bold text-[11px]">
                WhatsApp: +{whatsappPhone}
              </p>
            )}
          </div>
        </div>

        {/* 4. Copyright */}
        <div className="pt-8 border-t border-[#2D2B27] flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-xs font-normal">
          <p>© {new Date().getFullYear()} EkhiTeka Gourmet S.L. {t.footer_copyright}</p>
          <div className="flex items-center gap-2">
            <span>{t.footer_tagline}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
