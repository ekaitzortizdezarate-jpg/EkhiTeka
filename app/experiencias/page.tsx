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

      {/* 2. Kits de Catas en Casa Disponibles */}
      {homeTastingKits.length > 0 && (
        <section className="space-y-6 pt-2 font-serif">
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

      {/* 3. Próximos Eventos de Catas Presenciales */}
      {storeTastings.length > 0 && (
        <section id="catas-tienda" className="space-y-6 pt-2 font-serif">
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

      {/* 4. Catas en Casa y Catas en la Tienda (2 Tarjetas Informativas) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 font-serif">
        {/* Tarjeta 1: Catas en Casa */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 space-y-5 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-52 sm:h-60 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Cestas.JPG"
                alt={t.exp_home_tasting_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black uppercase tracking-wider rounded-full shadow-md font-sans">
                {t.exp_home_tasting_badge}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-[#C68D07] dark:text-[#FFE259]">
                <Home className="w-5 h-5" />
                <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {t.exp_home_tasting_title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
                {t.exp_home_tasting_desc}
              </p>
            </div>
          </div>
          <a
            href={getWhatsAppUrl('Hola, quisiera solicitar un Kit de Cata en Casa')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-xs hover:scale-102"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.exp_home_tasting_btn}</span>
          </a>
        </div>

        {/* Tarjeta 2: Catas en la Tienda */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 space-y-5 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-52 sm:h-60 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Catas.JPG"
                alt={t.exp_store_tasting_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black uppercase tracking-wider rounded-full shadow-md font-sans">
                {t.exp_store_tasting_badge}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-[#C68D07] dark:text-[#FFE259]">
                <Wine className="w-5 h-5" />
                <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {t.exp_store_tasting_title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
                {t.exp_store_tasting_desc}
              </p>
            </div>
          </div>
          <a
            href="#catas-tienda"
            className="w-full py-3 px-4 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-xs hover:scale-102"
          >
            <Ticket className="w-4 h-4" />
            <span>{t.exp_store_tasting_btn}</span>
          </a>
        </div>
      </section>

      {/* 5. Mesa para Bodas y Préstamo de Raclette (2 Tarjetas Informativas) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 font-serif">
        {/* Tarjeta 3: Mesas para Bodas */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 space-y-5 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-52 sm:h-60 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Mesas.JPG"
                alt={t.exp_wedding_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black uppercase tracking-wider rounded-full shadow-md font-sans">
                {t.exp_wedding_badge}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-[#C68D07] dark:text-[#FFE259]">
                <HeartHandshake className="w-5 h-5" />
                <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {t.exp_wedding_title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
                {t.exp_wedding_desc}
              </p>
            </div>
          </div>
          <a
            href={getWhatsAppUrl('Hola, quisiera pedir presupuesto para Mesa de Quesos de Boda')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-xs hover:scale-102"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.exp_wedding_btn}</span>
          </a>
        </div>

        {/* Tarjeta 4: Préstamo de Raclette */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 space-y-5 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-52 sm:h-60 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Quesos.JPG"
                alt={t.exp_raclette_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Tienda.JPG';
                }}
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black uppercase tracking-wider rounded-full shadow-md font-sans">
                {t.exp_raclette_badge}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-[#C68D07] dark:text-[#FFE259]">
                <Flame className="w-5 h-5" />
                <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {t.exp_raclette_title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
                {t.exp_raclette_desc}
              </p>
            </div>
          </div>
          <a
            href={getWhatsAppUrl('Hola, quisiera consultar disponibilidad para préstamo de Raclette')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-xs hover:scale-102"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.exp_raclette_btn}</span>
          </a>
        </div>
      </section>
    </div>
  );
}
