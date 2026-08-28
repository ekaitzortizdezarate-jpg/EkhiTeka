'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
import {
  Sparkles,
  ShoppingBag,
  Gift,
  ChevronRight,
  MessageCircle,
  MapPin,
  Clock,
} from 'lucide-react';

export default function HomePage() {
  const { t, language } = useLanguage();
  const { getSiteImage, getWhatsAppUrl, storeAddress } = useStoreConfig();

  const heroHomeImage = getSiteImage('home_hero', '/images/secciones/Tienda.JPG');
  const card1Image = getSiteImage('cat_quesos', '/images/secciones/Quesos.JPG');
  const card2Image = getSiteImage('gifts_hero', '/images/secciones/Cestas.JPG');
  const card3Image = getSiteImage('exp_catas', '/images/secciones/Catas.JPG');
  const card4Image = getSiteImage('exp_cestas', '/images/secciones/Cestas.JPG');

  return (
    <div className="space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 font-serif">
      {/* 1. Hero Principal de Bienvenida */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-14 lg:p-18 border border-[#E8E5DF] dark:border-[#2D2B27] shadow-xl min-h-[460px] flex items-center bg-[#FAF8F5]">
        <div className="absolute inset-0 z-0">
          <img
            src={heroHomeImage}
            alt="EkhiTeka Quesería Gourmet Lekeitio"
            className="w-full h-full object-cover object-center scale-100"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/secciones/Tienda.JPG';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20 dark:from-black/90 dark:via-black/75 dark:to-black/50" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          <div className="lg:col-span-8 space-y-6">
            <span className="inline-flex items-center px-4 py-1.5 bg-[#1D1D1B]/90 backdrop-blur-xs text-white text-[11px] font-bold rounded-full uppercase tracking-[0.16em] shadow-md border border-stone-700/50">
              {t.home_hero_badge}
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white drop-shadow-md">
              Ekhi<span className="text-[#FFE259]">Teka</span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-light text-stone-200 mt-2">
                {t.home_hero_subtitle}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl font-normal drop-shadow-md">
              {t.home_hero_desc}
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full overflow-hidden border-2 border-white/60 shadow-2xl p-1 bg-[#FAF8F5] hover:scale-105 transition-transform duration-500">
              <img
                src="/Logo.jpg"
                alt="EkhiTeka Lekeitio"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Los 4 Pilares de EkhiTeka */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 block">
            {t.home_pillars_badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#1D1D1B] dark:text-stone-100 uppercase tracking-tight">
            {t.home_pillars_title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-normal">
            {t.home_pillars_desc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tarjeta 1: Tienda */}
          <Link
            href="/tienda"
            className="manduca-card group relative rounded-3xl overflow-hidden bg-white dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] hover:border-[#C8C1B3] dark:hover:border-stone-700 shadow-xs transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={card1Image}
                alt={t.home_card1_title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#1D1D1B]/90 text-white text-[10px] font-bold uppercase tracking-[0.14em] rounded-xl shadow-md border border-stone-700/60 backdrop-blur-xs">
                {t.home_card1_badge}
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-300 block">
                  {t.home_card1_sub}
                </span>
                <h3 className="font-serif font-bold text-xl leading-tight">
                  {t.home_card1_title}
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs sm:text-[13px] text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                {t.home_card1_desc}
              </p>
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#1D1D1B] dark:text-[#F5F5F0] pt-2 uppercase tracking-[0.14em] group-hover:text-[#C68D07] dark:group-hover:text-[#FFE259] transition-colors">
                <span>{t.home_card1_btn}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[1.75]" />
              </div>
            </div>
          </Link>

          {/* Tarjeta 2: Regalos Gourmet */}
          <Link
            href="/regalos-gourmet"
            className="manduca-card group relative rounded-3xl overflow-hidden bg-white dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] hover:border-[#C8C1B3] dark:hover:border-stone-700 shadow-xs transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={card2Image}
                alt={t.home_card2_title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#1D1D1B]/90 text-white text-[10px] font-bold uppercase tracking-[0.14em] rounded-xl shadow-md border border-stone-700/60 backdrop-blur-xs">
                {t.home_card2_badge}
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-300 block">
                  {t.home_card2_sub}
                </span>
                <h3 className="font-serif font-bold text-xl leading-tight">
                  {t.home_card2_title}
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs sm:text-[13px] text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                {t.home_card2_desc}
              </p>
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#1D1D1B] dark:text-[#F5F5F0] pt-2 uppercase tracking-[0.14em] group-hover:text-[#C68D07] dark:group-hover:text-[#FFE259] transition-colors">
                <span>{t.home_card2_btn}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[1.75]" />
              </div>
            </div>
          </Link>

          {/* Tarjeta 3: Catas & Experiencias */}
          <Link
            href="/experiencias"
            className="manduca-card group relative rounded-3xl overflow-hidden bg-white dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] hover:border-[#C8C1B3] dark:hover:border-stone-700 shadow-xs transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={card3Image}
                alt={t.home_card3_title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#1D1D1B]/90 text-white text-[10px] font-bold uppercase tracking-[0.14em] rounded-xl shadow-md border border-stone-700/60 backdrop-blur-xs">
                {t.home_card3_badge}
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-300 block">
                  {t.home_card3_sub}
                </span>
                <h3 className="font-serif font-bold text-xl leading-tight">
                  {t.home_card3_title}
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs sm:text-[13px] text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                {t.home_card3_desc}
              </p>
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#1D1D1B] dark:text-[#F5F5F0] pt-2 uppercase tracking-[0.14em] group-hover:text-[#C68D07] dark:group-hover:text-[#FFE259] transition-colors">
                <span>{t.home_card3_btn}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[1.75]" />
              </div>
            </div>
          </Link>

          {/* Tarjeta 4: Regalos de Empresa */}
          <Link
            href="/regalos-empresa"
            className="manduca-card group relative rounded-3xl overflow-hidden bg-white dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] hover:border-[#C8C1B3] dark:hover:border-stone-700 shadow-xs transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={card4Image}
                alt={t.home_card4_title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Tienda.JPG';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#1D1D1B]/90 text-white text-[10px] font-bold uppercase tracking-[0.14em] rounded-xl shadow-md border border-stone-700/60 backdrop-blur-xs">
                {t.home_card4_badge}
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-300 block">
                  {t.home_card4_sub}
                </span>
                <h3 className="font-serif font-bold text-xl leading-tight">
                  {t.home_card4_title}
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs sm:text-[13px] text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                {t.home_card4_desc}
              </p>
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#1D1D1B] dark:text-[#F5F5F0] pt-2 uppercase tracking-[0.14em] group-hover:text-[#C68D07] dark:group-hover:text-[#FFE259] transition-colors">
                <span>{t.home_card4_btn}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[1.75]" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Nuestra Tienda Física en Lekeitio */}
      <section className="relative rounded-3xl bg-[#FAF7F2] dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] p-8 sm:p-12 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 block">
              {t.shop_visit_subtitle}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#1D1D1B] dark:text-stone-100 tracking-tight leading-tight">
              {t.shop_visit_title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
              {t.shop_visit_desc}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-stone-700 dark:text-stone-300 font-sans">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-stone-700 dark:text-stone-300 stroke-[1.75]" />
                <span>{storeAddress || 'Gamarra Kalea 4, Lekeitio · Bizkaia'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-stone-700 dark:text-stone-300 stroke-[1.75]" />
                <span>{t.footer_schedule_weekdays}</span>
              </div>
            </div>
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={
                  getWhatsAppUrl(
                    language === 'eu'
                      ? 'Kaixo, Lekeitioko dendan produktuen eskuragarritasunari buruz galdetu nahi nuen.'
                      : 'Hola, quisiera consultar disponibilidad de productos en la tienda de Lekeitio.'
                  ) || 'https://wa.me/34600000000'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1D1D1B] hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white dark:text-stone-100 border border-stone-800 dark:border-stone-700 font-bold text-xs uppercase tracking-[0.14em] transition-all shadow-md hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 text-[#FFE259] stroke-[2]" />
                <span>{t.shop_visit_contact}</span>
              </a>
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-bold text-xs uppercase tracking-[0.14em] transition-all shadow-md hover:scale-105"
              >
                <ShoppingBag className="w-4 h-4 stroke-[1.75]" />
                <span>{t.shop_see_cheeses}</span>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-md border border-[#E8E5DF] dark:border-[#2D2B27] h-64 sm:h-80 group">
              <img
                src={getSiteImage('tienda_hero', '/images/secciones/Tienda.JPG')}
                alt={t.shop_visit_title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 px-3 py-1 bg-[#1D1D1B]/90 text-white text-[10px] font-bold rounded-xl uppercase tracking-[0.14em] shadow-md border border-stone-700/60 backdrop-blur-xs font-sans">
                Lekeitio Centro
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
