'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import {
  Briefcase,
  Building2,
  Sparkles,
  MessageCircle,
  Truck,
  CheckCircle2,
  Users,
  ShieldCheck,
} from 'lucide-react';

export default function RegalosEmpresaPage() {
  const { t } = useLanguage();
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role === 'vendedor' || profile?.role === 'admin') {
          setIsSeller(true);
        }
      }
    }
    checkUser();
  }, []);

  return (
    <div className="space-y-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 font-serif">
      {/* 1. Hero Principal */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border border-[#E8E5DF] dark:border-[#2D2B27] shadow-xl min-h-[380px] flex items-center bg-[#FAF8F5]">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/secciones/Cestas.JPG"
            alt={t.corp_hero_title}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20 dark:from-black/90 dark:via-black/75 dark:to-black/50" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4 text-white">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#1D1D1B]/90 backdrop-blur-xs text-white text-xs font-bold rounded-full uppercase tracking-[0.16em] shadow-md border border-stone-700/50">
            <Building2 className="w-3.5 h-3.5 text-stone-300 stroke-[1.75]" /> {t.corp_hero_badge}
          </span>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            {t.corp_hero_title} <span className="text-[#FFE259]">{t.corp_hero_title_highlight}</span>
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
            {t.corp_hero_desc}
          </p>

          {!isSeller && (
            <div className="pt-2">
              <a
                href="https://wa.me/34600000000?text=Hola,%20quisiera%20solicitar%20un%20presupuesto%20para%20Regalos%20de%20Empresa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-bold text-xs uppercase tracking-[0.14em] transition-all shadow-lg hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 stroke-[1.75]" />
                <span>{t.corp_whatsapp_btn}</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* 2. Tarjetas con Imagen: Lotes, Catas y Personalización */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta 1: Lotes y Cestas de Navidad */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] hover:border-[#C8C1B3] dark:hover:border-stone-700 p-6 space-y-4 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-48 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-[#141312] border border-[#E8E5DF] dark:border-[#2D2B27] relative">
              <img
                src="/images/secciones/Cestas.JPG"
                alt={t.corp_card1_title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 border border-[#E8E5DF] dark:border-[#2D2B27] flex items-center justify-center text-stone-700 dark:text-stone-300">
                <Briefcase className="w-4 h-4 stroke-[1.75]" />
              </div>
              <h2 className="text-xl font-bold text-[#1D1D1B] dark:text-stone-100 leading-snug">
                {t.corp_card1_title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                {t.corp_card1_desc}
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Catas Privadas & Team Building */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] hover:border-[#C8C1B3] dark:hover:border-stone-700 p-6 space-y-4 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-48 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-[#141312] border border-[#E8E5DF] dark:border-[#2D2B27] relative">
              <img
                src="/images/secciones/Catas.JPG"
                alt={t.corp_card2_title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 border border-[#E8E5DF] dark:border-[#2D2B27] flex items-center justify-center text-stone-700 dark:text-stone-300">
                <Users className="w-4 h-4 stroke-[1.75]" />
              </div>
              <h2 className="text-xl font-bold text-[#1D1D1B] dark:text-stone-100 leading-snug">
                {t.corp_card2_title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                {t.corp_card2_desc}
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Personalización con tu Marca */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] hover:border-[#C8C1B3] dark:hover:border-stone-700 p-6 space-y-4 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-48 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-[#141312] border border-[#E8E5DF] dark:border-[#2D2B27] relative">
              <img
                src="/images/secciones/Mesas.JPG"
                alt={t.corp_card3_title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 border border-[#E8E5DF] dark:border-[#2D2B27] flex items-center justify-center text-stone-700 dark:text-stone-300">
                <Sparkles className="w-4 h-4 stroke-[1.75]" />
              </div>
              <h2 className="text-xl font-bold text-[#1D1D1B] dark:text-stone-100 leading-snug">
                {t.corp_card3_title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                {t.corp_card3_desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Garantías de Logística */}
      <section className="rounded-3xl bg-[#FAF7F2] dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] p-8 sm:p-12 shadow-xs space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 block">
            {t.corp_logistics_badge}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1B] dark:text-stone-100">
            {t.corp_logistics_title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            {t.corp_logistics_desc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-[#141312] border border-[#E8E5DF] dark:border-[#2D2B27] shadow-2xs">
            <Truck className="w-4 h-4 text-stone-700 dark:text-stone-300 stroke-[1.75] shrink-0" />
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-stone-800 dark:text-[#F5F5F0]">
              {t.corp_logistics_feat1}
            </span>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-[#141312] border border-[#E8E5DF] dark:border-[#2D2B27] shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-stone-700 dark:text-stone-300 stroke-[1.75] shrink-0" />
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-stone-800 dark:text-[#F5F5F0]">
              {t.corp_logistics_feat2}
            </span>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-[#141312] border border-[#E8E5DF] dark:border-[#2D2B27] shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-stone-700 dark:text-stone-300 stroke-[1.75] shrink-0" />
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-stone-800 dark:text-[#F5F5F0]">
              {t.corp_logistics_feat3}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
