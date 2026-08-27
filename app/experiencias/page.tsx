'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
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
  const { getWhatsAppUrl } = useStoreConfig();
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
    <div className="space-y-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 font-serif">
      {/* 1. Hero Editorial */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border border-[#E8E5DF] dark:border-[#2D2B27] shadow-xl min-h-[380px] flex items-center bg-[#FAF8F5]">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/secciones/Catas.JPG"
            alt={t.exp_hero_title}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20 dark:from-black/90 dark:via-black/75 dark:to-black/50" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4 text-white">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#1D1D1B]/90 backdrop-blur-xs text-white text-xs font-bold rounded-full uppercase tracking-[0.16em] shadow-md border border-stone-700/50">
            <Sparkles className="w-3.5 h-3.5 text-stone-300 stroke-[1.75]" /> {t.exp_hero_badge}
          </span>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            {t.exp_hero_title} <span className="text-[#FFE259]">{t.exp_hero_title_highlight}</span>
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl font-normal">
            {t.exp_hero_desc}
          </p>
        </div>
      </section>

      {/* 2. Kits de Catas en Casa Disponibles */}
      {homeTastingKits.length > 0 && (
        <section id="catas-casa" className="space-y-6 pt-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E5DF] dark:border-[#2D2B27]">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 block">
                {t.event_home_catalog_subtitle}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1B] dark:text-stone-100 uppercase tracking-tight">
                {t.event_home_catalog_title}
              </h2>
            </div>
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 tracking-[0.14em] uppercase">
              {homeTastingKits.length} {t.prod_showing}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {homeTastingKits.map((product) => (
              <ProductCard key={product.id} product={product} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Próximos Eventos de Catas Presenciales */}
      {storeTastings.length > 0 && (
        <section id="catas-tienda" className="space-y-6 pt-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E5DF] dark:border-[#2D2B27]">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 block">
                {t.event_upcoming_subtitle}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1B] dark:text-stone-100 uppercase tracking-tight">
                {t.event_upcoming_title}
              </h2>
            </div>
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 tracking-[0.14em] uppercase">
              {storeTastings.length} {t.prod_showing}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {storeTastings.map((product) => (
              <ProductCard key={product.id} product={product} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Catas en Casa y Catas en la Tienda (2 Tarjetas Informativas) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tarjeta 1: Catas en Casa */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] hover:border-[#C8C1B3] dark:hover:border-stone-700 p-6 sm:p-7 space-y-5 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-56 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-850 border border-[#E8E5DF] dark:border-[#2D2B27] relative">
              <img
                src="/images/secciones/Quesos.JPG"
                alt={t.exp_home_tasting_title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Catas.JPG';
                }}
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#1D1D1B]/90 text-white text-[10px] font-bold uppercase tracking-[0.14em] rounded-xl shadow-md border border-stone-700/60 backdrop-blur-xs">
                {t.exp_home_tasting_badge}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-stone-800 dark:text-stone-200">
                <Home className="w-5 h-5 stroke-[1.75]" />
                <h2 className="text-2xl font-bold text-[#1D1D1B] dark:text-stone-100">
                  {t.exp_home_tasting_title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                {t.exp_home_tasting_desc}
              </p>
            </div>
          </div>
          <a
            href={getWhatsAppUrl('Hola, quisiera reservar una Cata en Casa personalizada')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-bold text-xs uppercase tracking-[0.14em] text-center transition-all flex items-center justify-center gap-2 shadow-xs hover:scale-[1.01]"
          >
            <MessageCircle className="w-4 h-4 stroke-[1.75]" />
            <span>{t.exp_home_tasting_btn}</span>
          </a>
        </div>

        {/* Tarjeta 2: Catas en la Tienda */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] hover:border-[#C8C1B3] dark:hover:border-stone-700 p-6 sm:p-7 space-y-5 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-56 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-850 border border-[#E8E5DF] dark:border-[#2D2B27] relative">
              <img
                src="/images/secciones/Catas.JPG"
                alt={t.exp_store_tasting_title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#1D1D1B]/90 text-white text-[10px] font-bold uppercase tracking-[0.14em] rounded-xl shadow-md border border-stone-700/60 backdrop-blur-xs">
                {t.exp_store_tasting_badge}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-stone-800 dark:text-stone-200">
                <Wine className="w-5 h-5 stroke-[1.75]" />
                <h2 className="text-2xl font-bold text-[#1D1D1B] dark:text-stone-100">
                  {t.exp_store_tasting_title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                {t.exp_store_tasting_desc}
              </p>
            </div>
          </div>
          <a
            href="#catas-tienda"
            className="w-full py-3.5 px-4 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-bold text-xs uppercase tracking-[0.14em] text-center transition-all flex items-center justify-center gap-2 shadow-xs hover:scale-[1.01]"
          >
            <Ticket className="w-4 h-4 stroke-[1.75]" />
            <span>{t.exp_store_tasting_btn}</span>
          </a>
        </div>
      </section>

      {/* 5. Mesa para Bodas y Préstamo de Raclette (2 Tarjetas Informativas) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tarjeta 3: Mesas para Bodas */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] hover:border-[#C8C1B3] dark:hover:border-stone-700 p-6 sm:p-7 space-y-5 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-56 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-850 border border-[#E8E5DF] dark:border-[#2D2B27] relative">
              <img
                src="/images/secciones/Mesas.JPG"
                alt={t.exp_wedding_title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#1D1D1B]/90 text-white text-[10px] font-bold uppercase tracking-[0.14em] rounded-xl shadow-md border border-stone-700/60 backdrop-blur-xs">
                {t.exp_wedding_badge}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-stone-800 dark:text-stone-200">
                <HeartHandshake className="w-5 h-5 stroke-[1.75]" />
                <h2 className="text-2xl font-bold text-[#1D1D1B] dark:text-stone-100">
                  {t.exp_wedding_title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                {t.exp_wedding_desc}
              </p>
            </div>
          </div>
          <a
            href={getWhatsAppUrl('Hola, quisiera pedir presupuesto para Mesa de Quesos de Boda')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-bold text-xs uppercase tracking-[0.14em] text-center transition-all flex items-center justify-center gap-2 shadow-xs hover:scale-[1.01]"
          >
            <MessageCircle className="w-4 h-4 stroke-[1.75]" />
            <span>{t.exp_wedding_btn}</span>
          </a>
        </div>

        {/* Tarjeta 4: Préstamo de Raclette */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] hover:border-[#C8C1B3] dark:hover:border-stone-700 p-6 sm:p-7 space-y-5 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-56 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-850 border border-[#E8E5DF] dark:border-[#2D2B27] relative">
              <img
                src="/images/secciones/Quesos.JPG"
                alt={t.exp_raclette_title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Tienda.JPG';
                }}
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#1D1D1B]/90 text-white text-[10px] font-bold uppercase tracking-[0.14em] rounded-xl shadow-md border border-stone-700/60 backdrop-blur-xs">
                {t.exp_raclette_badge}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-stone-800 dark:text-stone-200">
                <Flame className="w-5 h-5 stroke-[1.75]" />
                <h2 className="text-2xl font-bold text-[#1D1D1B] dark:text-stone-100">
                  {t.exp_raclette_title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                {t.exp_raclette_desc}
              </p>
            </div>
          </div>
          <a
            href={getWhatsAppUrl('Hola, quisiera consultar disponibilidad para préstamo de Raclette')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-bold text-xs uppercase tracking-[0.14em] text-center transition-all flex items-center justify-center gap-2 shadow-xs hover:scale-[1.01]"
          >
            <MessageCircle className="w-4 h-4 stroke-[1.75]" />
            <span>{t.exp_raclette_btn}</span>
          </a>
        </div>
      </section>
    </div>
  );
}
