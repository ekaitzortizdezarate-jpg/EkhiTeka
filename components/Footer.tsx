'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
import { Truck, Store } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();
  const { storeAddress, whatsappPhone, getWhatsAppUrl } = useStoreConfig();

  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-[#1D1D1B] text-stone-300 transition-colors pt-0 pb-8">
      {/* 1. Banner Destacado Amarillo */}
      <div className="bg-[#FFE259] text-[#1D1D1B] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[11px] font-black uppercase tracking-widest block text-stone-800">
              {t.footer_club_title}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight font-serif sm:font-sans">
              {t.footer_club_subtitle}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-stone-800 max-w-xl">
              {t.footer_club_desc}
            </p>
          </div>

          <a
            href={getWhatsAppUrl('Hola, quisiera unirme a las novedades del Club de Amigos de EkhiTeka')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1D1D1B] text-white hover:bg-stone-800 font-black text-xs uppercase tracking-wider transition-all shadow-md shrink-0 hover:scale-105"
          >
            <span>{t.footer_join_whatsapp}</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pt-12">
        {/* 2. Valores Gourmet */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-stone-800 text-center md:text-left">
          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE259]/15 text-[#FFE259] flex items-center justify-center shrink-0 text-xl border border-[#FFE259]/30">
              🧀
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-white">{t.cat_queso} & {t.shop_specialty}</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-medium">
                {t.footer_cheese_desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE259]/15 text-[#FFE259] flex items-center justify-center shrink-0 border border-[#FFE259]/30">
              <Truck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-white">{t.deliv_home}</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-medium">
                {t.footer_delivery_desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE259]/15 text-[#FFE259] flex items-center justify-center shrink-0 border border-[#FFE259]/30">
              <Store className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-white">{t.deliv_store_pickup}</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-medium">
                {t.footer_pickup_desc}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Enlaces & Categorías */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <h4 className="font-black text-white uppercase tracking-wider text-[11px]">{t.footer_categories}</h4>
            <ul className="space-y-2 text-stone-400 font-semibold">
              <li><Link href="/categoria/queso" className="hover:text-[#FFE259] transition-colors">{t.cat_queso}</Link></li>
              <li><Link href="/categoria/salazon" className="hover:text-[#FFE259] transition-colors">{t.cat_salazon}</Link></li>
              <li><Link href="/categoria/atun" className="hover:text-[#FFE259] transition-colors">{t.cat_atun}</Link></li>
              <li><Link href="/categoria/jildas" className="hover:text-[#FFE259] transition-colors">{t.cat_jildas}</Link></li>
              <li><Link href="/categoria/txakoli" className="hover:text-[#FFE259] transition-colors">{t.cat_txakoli}</Link></li>
              <li><Link href="/categoria/cerveza" className="hover:text-[#FFE259] transition-colors">{t.cat_cerveza}</Link></li>
              <li><Link href="/categoria/sidra" className="hover:text-[#FFE259] transition-colors">{t.cat_sidra}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-white uppercase tracking-wider text-[11px]">{t.footer_experiences}</h4>
            <ul className="space-y-2 text-stone-400 font-semibold">
              <li><Link href="/#experiencias" className="hover:text-[#FFE259] transition-colors">{t.footer_exp_tasting}</Link></li>
              <li><Link href="/#experiencias" className="hover:text-[#FFE259] transition-colors">{t.footer_exp_weddings}</Link></li>
              <li><Link href="/#experiencias" className="hover:text-[#FFE259] transition-colors">{t.footer_exp_gifts}</Link></li>
              <li><Link href="/chat" className="hover:text-[#FFE259] transition-colors">{t.footer_exp_consult}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-white uppercase tracking-wider text-[11px]">{t.footer_legal}</h4>
            <ul className="space-y-2 text-stone-400 font-semibold">
              <li><Link href="/terminos" className="hover:text-[#FFE259] transition-colors">{t.legal_terms}</Link></li>
              <li><Link href="/privacidad" className="hover:text-[#FFE259] transition-colors">{t.legal_privacy}</Link></li>
              <li><Link href="/cookies" className="hover:text-[#FFE259] transition-colors">{t.legal_cookies}</Link></li>
              <li><Link href="/aviso-legal" className="hover:text-[#FFE259] transition-colors">{t.legal_notice}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/Logo.jpg"
                alt="EkhiTeka"
                className="w-10 h-10 rounded-full object-cover border border-[#FFE259]"
              />
              <h4 className="font-black text-white uppercase tracking-wider text-[12px]">EkhiTeka Lekeitio</h4>
            </div>

            <div className="w-full h-24 rounded-2xl overflow-hidden border border-stone-800 relative">
              <img
                src="/images/secciones/Tienda.JPG"
                alt="Quesería EkhiTeka Lekeitio"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-stone-400 leading-relaxed font-medium">
              {storeAddress}
            </p>
            <div className="text-stone-400 font-medium space-y-0.5 text-[11px]">
              <p className="font-bold text-stone-300">{t.footer_schedule_title}</p>
              <p>{t.footer_schedule_weekdays}</p>
              <p>{t.footer_schedule_saturday}</p>
            </div>
            <p className="text-stone-300 font-bold text-[11px]">
              WhatsApp: +{whatsappPhone}
            </p>
          </div>
        </div>

        {/* 4. Copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-xs font-medium">
          <p>© {new Date().getFullYear()} EkhiTeka Gourmet S.L. {t.footer_copyright}</p>
          <div className="flex items-center gap-2">
            <span>{t.footer_tagline}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
