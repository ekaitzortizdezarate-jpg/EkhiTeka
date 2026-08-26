const fs = require('fs');
const path = require('path');

const files = {
  // =========================================================================
  // 1. REGALOS DE EMPRESA (Hero con imagen + 3 tarjetas con sus imágenes)
  // =========================================================================
  'app/regalos-empresa/page.tsx': `'use client';

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
    <div className="space-y-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 1. Hero Principal */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border-2 border-stone-800 shadow-2xl min-h-[380px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/secciones/Cestas.JPG"
            alt={t.corp_hero_title}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/40 to-black/20 dark:from-black/90 dark:via-black/75 dark:to-black/50" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4 text-white">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-black rounded-full uppercase tracking-wider shadow-md font-serif">
            <Building2 className="w-3.5 h-3.5" /> {t.corp_hero_badge}
          </span>

          <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight">
            {t.corp_hero_title} <span className="text-[#FFE259]">{t.corp_hero_title_highlight}</span>
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
            {t.corp_hero_desc}
          </p>

          {!isSeller && (
            <div className="pt-2">
              <a
                href="https://wa.me/34600000000?text=Hola,%20quisiera%20solicitar%20un%20presupuesto%20para%20Regalos%20de%20Empresa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 font-serif"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.corp_whatsapp_btn}</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* 2. Tarjetas con Imagen: Lotes, Catas y Personalización */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 font-serif">
        {/* Tarjeta 1: Lotes y Cestas de Navidad */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 space-y-4 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Cestas.JPG"
                alt={t.corp_card1_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 leading-snug">
                {t.corp_card1_title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
                {t.corp_card1_desc}
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Catas Privadas & Team Building */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 space-y-4 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Catas.JPG"
                alt={t.corp_card2_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 leading-snug">
                {t.corp_card2_title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
                {t.corp_card2_desc}
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Personalización con tu Marca */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 space-y-4 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Mesas.JPG"
                alt={t.corp_card3_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 leading-snug">
                {t.corp_card3_title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
                {t.corp_card3_desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Garantías de Logística */}
      <section className="rounded-3xl bg-[#FAF7F2] dark:bg-[#1C1B19] border border-stone-200/90 dark:border-stone-800 p-8 sm:p-12 shadow-sm space-y-6 font-serif">
        <div className="max-w-2xl space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
            {t.corp_logistics_badge}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {t.corp_logistics_title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
            {t.corp_logistics_desc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-sans">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
            <Truck className="w-5 h-5 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
              {t.corp_logistics_feat1}
            </span>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
            <ShieldCheck className="w-5 h-5 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
              {t.corp_logistics_feat2}
            </span>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
            <CheckCircle2 className="w-5 h-5 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
              {t.corp_logistics_feat3}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
`,

  // =========================================================================
  // 2. CATAS & EXPERIENCIAS (Hero con imagen + 4 tarjetas con sus imágenes)
  // =========================================================================
  'app/experiencias/page.tsx': `'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { ProductCard } from '@/components/ProductCard';
import type { ProductWithSeller } from '@/types/database';
import {
  Sparkles,
  Wine,
  Home,
  HeartHandshake,
  Flame,
  MessageCircle,
  Ticket,
} from 'lucide-react';

export default function ExperienciasPage() {
  const { t } = useLanguage();
  const [storeTastings, setStoreTastings] = useState<ProductWithSeller[]>([]);
  const [homeTastingKits, setHomeTastingKits] = useState<ProductWithSeller[]>([]);
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role === 'vendedor' || profile?.role === 'admin') {
          setIsSeller(true);
        }
      }

      const { data } = await supabase
        .from('products')
        .select('*, profiles!products_seller_id_fkey(id, full_name, town, avatar_url, phone)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (data) {
        const prods = data as unknown as ProductWithSeller[];
        const storeEvents = prods.filter((p) => {
          const cat = (p.category_id || '').toLowerCase();
          const name = (p.name || '').toLowerCase();
          const desc = (p.description || '').toLowerCase();
          return (
            cat === 'cata_presencial' ||
            name.includes('presencial') ||
            (desc.includes('presencial') && !name.includes('casa'))
          );
        });

        const homeKits = prods.filter((p) => {
          const cat = (p.category_id || '').toLowerCase();
          const name = (p.name || '').toLowerCase();
          const desc = (p.description || '').toLowerCase();
          return (
            cat === 'cata_casa' ||
            name.includes('cata en casa') ||
            name.includes('etxeko dastaketa') ||
            desc.includes('cata en casa') ||
            desc.includes('dastaketa-kit')
          );
        });

        setStoreTastings(storeEvents);
        setHomeTastingKits(homeKits);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 1. Hero Editorial */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border-2 border-stone-800 shadow-2xl min-h-[380px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/secciones/Catas.JPG"
            alt={t.exp_hero_title}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/40 to-black/20 dark:from-black/90 dark:via-black/75 dark:to-black/50" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4 text-white">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-black rounded-full uppercase tracking-wider shadow-md font-serif">
            <Sparkles className="w-3.5 h-3.5" /> {t.exp_hero_badge}
          </span>

          <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight">
            {t.exp_hero_title} <span className="text-[#FFE259]">{t.exp_hero_title_highlight}</span>
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
            {t.exp_hero_desc}
          </p>
        </div>
      </section>

      {/* 2. Cuatro Tarjetas de Experiencias con Imagen */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-serif">
        {/* Tarjeta 1: Catas en Casa */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-5 space-y-4 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-3">
            <div className="w-full h-40 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Cestas.JPG"
                alt={t.exp_home_tasting_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
                <Home className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] font-black uppercase text-stone-600 dark:text-stone-300 font-sans">
                {t.exp_home_tasting_badge}
              </span>
            </div>
            <h2 className="text-base font-black text-stone-900 dark:text-stone-100 leading-tight">
              {t.exp_home_tasting_title}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
              {t.exp_home_tasting_desc}
            </p>
          </div>
          <a
            href="https://wa.me/34600000000?text=Hola,%20quisiera%20solicitar%20un%20Kit%20de%20Cata%20en%20Casa"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-[#FFE259] dark:bg-stone-800 dark:hover:bg-[#FFE259] text-stone-900 dark:text-stone-100 hover:text-[#1D1D1B] dark:hover:text-[#1D1D1B] font-black text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{t.exp_home_tasting_btn}</span>
          </a>
        </div>

        {/* Tarjeta 2: Catas en la Tienda */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-5 space-y-4 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-3">
            <div className="w-full h-40 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Catas.JPG"
                alt={t.exp_store_tasting_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
                <Wine className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] font-black uppercase text-stone-600 dark:text-stone-300 font-sans">
                {t.exp_store_tasting_badge}
              </span>
            </div>
            <h2 className="text-base font-black text-stone-900 dark:text-stone-100 leading-tight">
              {t.exp_store_tasting_title}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
              {t.exp_store_tasting_desc}
            </p>
          </div>
          <a
            href="#catas-tienda"
            className="w-full py-2.5 px-4 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>{t.exp_store_tasting_btn}</span>
          </a>
        </div>

        {/* Tarjeta 3: Mesas para Bodas */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-5 space-y-4 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-3">
            <div className="w-full h-40 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Mesas.JPG"
                alt={t.exp_wedding_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] font-black uppercase text-stone-600 dark:text-stone-300 font-sans">
                {t.exp_wedding_badge}
              </span>
            </div>
            <h2 className="text-base font-black text-stone-900 dark:text-stone-100 leading-tight">
              {t.exp_wedding_title}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
              {t.exp_wedding_desc}
            </p>
          </div>
          <a
            href="https://wa.me/34600000000?text=Hola,%20quisiera%20pedir%20presupuesto%20para%20Mesa%20de%20Quesos%20de%20Boda"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-[#FFE259] dark:bg-stone-800 dark:hover:bg-[#FFE259] text-stone-900 dark:text-stone-100 hover:text-[#1D1D1B] dark:hover:text-[#1D1D1B] font-black text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{t.exp_wedding_btn}</span>
          </a>
        </div>

        {/* Tarjeta 4: Préstamo de Raclette */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-5 space-y-4 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-3">
            <div className="w-full h-40 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Quesos.JPG"
                alt={t.exp_raclette_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Tienda.JPG';
                }}
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
                <Flame className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] font-black uppercase text-stone-600 dark:text-stone-300 font-sans">
                {t.exp_raclette_badge}
              </span>
            </div>
            <h2 className="text-base font-black text-stone-900 dark:text-stone-100 leading-tight">
              {t.exp_raclette_title}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
              {t.exp_raclette_desc}
            </p>
          </div>
          <a
            href="https://wa.me/34600000000?text=Hola,%20quisiera%20consultar%20disponibilidad%20para%20préstamo%20de%20Raclette"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-[#FFE259] dark:bg-stone-800 dark:hover:bg-[#FFE259] text-stone-900 dark:text-stone-100 hover:text-[#1D1D1B] dark:hover:text-[#1D1D1B] font-black text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{t.exp_raclette_btn}</span>
          </a>
        </div>
      </section>

      {/* 3. Catas Presenciales Disponibles */}
      {storeTastings.length > 0 && (
        <section id="catas-tienda" className="space-y-6 pt-4 font-serif">
          <div className="pb-3 border-b border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259]">
              {t.event_upcoming_subtitle}
            </span>
            <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 uppercase">
              {t.event_upcoming_title}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {storeTastings.map((product) => (
              <ProductCard key={product.id} product={product} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Kits de Cata para Casa */}
      {homeTastingKits.length > 0 && (
        <section className="space-y-6 pt-4 font-serif">
          <div className="pb-3 border-b border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259]">
              {t.event_home_catalog_subtitle}
            </span>
            <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 uppercase">
              {t.event_home_catalog_title}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {homeTastingKits.map((product) => (
              <ProductCard key={product.id} product={product} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
`,

  // =========================================================================
  // 3. REGALOS GOURMET (Hero con imagen + 3 tarjetas con sus imágenes)
  // =========================================================================
  'app/regalos-gourmet/page.tsx': `'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { ProductCard } from '@/components/ProductCard';
import type { ProductWithSeller } from '@/types/database';
import {
  Gift,
  Sparkles,
  Package,
  CreditCard,
  MessageCircle,
  Truck,
  HeartHandshake,
} from 'lucide-react';

export default function RegalosGourmetPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<ProductWithSeller[]>([]);
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role === 'vendedor' || profile?.role === 'admin') {
          setIsSeller(true);
        }
      }
      const { data } = await supabase
        .from('products')
        .select('*, profiles!products_seller_id_fkey(id, full_name, town, avatar_url, phone)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (data) {
        const prods = data as unknown as ProductWithSeller[];
        const filtered = prods.filter((p) => {
          const cat = (p.category_id || '').toLowerCase();
          const name = (p.name || '').toLowerCase();
          const desc = (p.description || '').toLowerCase();
          const format = (p.format || '').toLowerCase();

          return (
            cat === 'cesta' ||
            cat === 'tarjeta_regalo' ||
            cat === 'regalos_gourmet' ||
            cat === 'pack' ||
            format === 'pack' ||
            name.includes('regalo') ||
            name.includes('opari') ||
            name.includes('cesta') ||
            name.includes('saski') ||
            name.includes('pack') ||
            name.includes('lote') ||
            name.includes('tarjeta') ||
            name.includes('txartel') ||
            desc.includes('regalo') ||
            desc.includes('cesta') ||
            desc.includes('opari')
          );
        });

        setProducts(filtered.length > 0 ? filtered : prods.slice(0, 8));
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 1. Hero Editorial */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border-2 border-stone-800 shadow-2xl min-h-[380px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/secciones/Cestas.JPG"
            alt={t.gifts_hero_title}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/40 to-black/20 dark:from-black/90 dark:via-black/75 dark:to-black/50" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4 text-white">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-black rounded-full uppercase tracking-wider shadow-md font-serif">
            <Sparkles className="w-3.5 h-3.5" /> {t.gifts_hero_badge}
          </span>

          <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight">
            {t.gifts_hero_title} <span className="text-[#FFE259]">{t.gifts_hero_title_highlight}</span>
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
            {t.gifts_hero_desc}
          </p>

          {!isSeller && (
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="https://wa.me/34600000000?text=Hola,%20quisiera%20encargar%20un%20regalo%20gourmet%20personalizado"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 font-serif"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.gifts_whatsapp_btn}</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* 2. Tres Bloques con Imagen: Cestas, Packs y Tarjetas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 font-serif">
        {/* Tarjeta 1: Cestas Gourmet a Medida */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 space-y-4 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Cestas.JPG"
                alt={t.gifts_card1_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
                <Package className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 leading-snug">
                {t.gifts_card1_title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
                {t.gifts_card1_desc}
              </p>
            </div>
          </div>
          <div className="pt-2 text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2 font-sans">
            <Truck className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
            <span>{t.gifts_card1_feature}</span>
          </div>
        </div>

        {/* Tarjeta 2: Packs Degustación & Maridaje */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 space-y-4 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Quesos.JPG"
                alt={t.gifts_card2_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Catas.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
                <Gift className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 leading-snug">
                {t.gifts_card2_title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
                {t.gifts_card2_desc}
              </p>
            </div>
          </div>
          <div className="pt-2 text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2 font-sans">
            <Sparkles className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
            <span>{t.gifts_card2_feature}</span>
          </div>
        </div>

        {/* Tarjeta 3: Tarjetas & Catas de Regalo */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 space-y-4 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Mesas.JPG"
                alt={t.gifts_card3_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Catas.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 leading-snug">
                {t.gifts_card3_title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
                {t.gifts_card3_desc}
              </p>
            </div>
          </div>
          <div className="pt-2 text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2 font-sans">
            <HeartHandshake className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
            <span>{t.gifts_card3_feature}</span>
          </div>
        </div>
      </section>

      {/* 3. Catálogo de Packs y Regalos */}
      {products.length > 0 && (
        <section className="space-y-6 pt-2 font-serif">
          <div className="pb-3 border-b border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259]">
              {t.gifts_catalog_badge}
            </span>
            <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 uppercase">
              {t.gifts_catalog_title}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
`,
};

// Generar todos los archivos en disco
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trimStart(), 'utf8');
  console.log(`✓ Actualizado: ${filePath}`);
});

console.log('\n🎉 ¡Imágenes de tarjetas y traducciones completadas al 100%!');