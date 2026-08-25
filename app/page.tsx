'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sparkles,
  ShoppingBag,
  Gift,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 1. Hero Principal de Bienvenida */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-14 lg:p-18 border-2 border-stone-800 shadow-2xl min-h-[460px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/secciones/Tienda.JPG"
            alt="EkhiTeka Quesería Gourmet Lekeitio"
            className="w-full h-full object-cover object-center scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/25 to-black/10 dark:from-black/90 dark:via-black/75 dark:to-black/50" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          <div className="lg:col-span-8 space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-black rounded-full uppercase tracking-wider shadow-md font-serif">
              <Sparkles className="w-3.5 h-3.5" /> {t.home_hero_badge}
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] font-serif text-white drop-shadow-md">
              Ekhi<span className="text-[#FFE259]">Teka</span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-light text-stone-200 mt-2">
                {t.home_hero_subtitle}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-white/95 leading-relaxed max-w-xl font-medium drop-shadow-md">
              {t.home_hero_desc}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs sm:text-sm transition-all shadow-xl hover:scale-105 uppercase tracking-wider font-serif"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.home_explore_btn}</span>
              </Link>

              <Link
                href="/regalos-gourmet"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border-2 border-white/40 transition-all backdrop-blur-md shadow-lg hover:scale-105 uppercase tracking-wider font-serif"
              >
                <Gift className="w-4 h-4 text-[#FFE259]" />
                <span>{t.home_gourmet_gifts_btn}</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full overflow-hidden border-4 border-[#FFE259] shadow-2xl p-1 bg-[#FAF7F2] hover:scale-105 transition-transform duration-500">
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
      <section className="space-y-6 font-serif">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
            {t.home_pillars_badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 uppercase tracking-tight">
            {t.home_pillars_title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans">
            {t.home_pillars_desc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tarjeta 1: Tienda */}
          <Link
            href="/tienda"
            className="group relative rounded-3xl overflow-hidden bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src="/images/secciones/Quesos.JPG"
                alt={t.home_card1_title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black uppercase tracking-wider rounded-full shadow-md font-sans">
                {t.home_card1_badge}
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE259] block font-sans">
                  {t.home_card1_sub}
                </span>
                <h3 className="font-serif font-bold text-xl leading-tight">
                  {t.home_card1_title}
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
                {t.home_card1_desc}
              </p>
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#C68D07] dark:text-[#FFE259] pt-2 uppercase tracking-wider">
                <span>{t.home_card1_btn}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Tarjeta 2: Regalos Gourmet */}
          <Link
            href="/regalos-gourmet"
            className="group relative rounded-3xl overflow-hidden bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src="/images/secciones/Cestas.JPG"
                alt={t.home_card2_title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black uppercase tracking-wider rounded-full shadow-md font-sans">
                {t.home_card2_badge}
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE259] block font-sans">
                  {t.home_card2_sub}
                </span>
                <h3 className="font-serif font-bold text-xl leading-tight">
                  {t.home_card2_title}
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
                {t.home_card2_desc}
              </p>
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#C68D07] dark:text-[#FFE259] pt-2 uppercase tracking-wider">
                <span>{t.home_card2_btn}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Tarjeta 3: Catas & Experiencias */}
          <Link
            href="/experiencias"
            className="group relative rounded-3xl overflow-hidden bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src="/images/secciones/Catas.JPG"
                alt={t.home_card3_title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black uppercase tracking-wider rounded-full shadow-md font-sans">
                {t.home_card3_badge}
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE259] block font-sans">
                  {t.home_card3_sub}
                </span>
                <h3 className="font-serif font-bold text-xl leading-tight">
                  {t.home_card3_title}
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
                {t.home_card3_desc}
              </p>
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#C68D07] dark:text-[#FFE259] pt-2 uppercase tracking-wider">
                <span>{t.home_card3_btn}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Tarjeta 4: Regalos de Empresa */}
          <Link
            href="/regalos-empresa"
            className="group relative rounded-3xl overflow-hidden bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src="/images/secciones/Empresas.JPG"
                alt={t.home_card4_title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black uppercase tracking-wider rounded-full shadow-md font-sans">
                {t.home_card4_badge}
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE259] block font-sans">
                  {t.home_card4_sub}
                </span>
                <h3 className="font-serif font-bold text-xl leading-tight">
                  {t.home_card4_title}
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
                {t.home_card4_desc}
              </p>
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#C68D07] dark:text-[#FFE259] pt-2 uppercase tracking-wider">
                <span>{t.home_card4_btn}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Nuestra Tienda Física en Lekeitio */}
      <section className="relative rounded-3xl bg-[#FAF7F2] dark:bg-[#1C1B19] border-2 border-stone-200/90 dark:border-stone-800 p-8 sm:p-12 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
              {t.shop_visit_subtitle}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#1D1D1B] dark:text-stone-100 tracking-tight leading-tight font-serif">
              {t.shop_visit_title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              {t.shop_visit_desc}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-stone-700 dark:text-stone-300">
              <div className="flex items-center gap-2">
                <span className="text-base">📍</span>
                <span>Gamarra Kalea 4, Lekeitio · Bizkaia</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">🕒</span>
                <span>{t.footer_schedule_weekdays}</span>
              </div>
            </div>
            <div className="pt-2 flex flex-wrap gap-3 font-serif">
              <a
                href="https://wa.me/34600000000?text=Hola,%20quisiera%20consultar%20disponibilidad%20en%20tienda%20Lekeitio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1D1D1B] dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 text-[#FFE259] dark:text-[#1D1D1B]" />
                <span>{t.shop_visit_contact}</span>
              </a>
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.nav_shop}</span>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200 dark:border-stone-700 h-64 sm:h-80 group">
              <img
                src="/images/secciones/Tienda.JPG"
                alt="Tienda EkhiTeka Lekeitio"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black rounded-full uppercase tracking-wider shadow-md">
                Lekeitio Centro
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}