'use client';

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
            desc.includes('cata en casa')
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

      {/* 2. Cuatro Tarjetas de Experiencias */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-serif">
        {/* Tarjeta 1: Catas en Casa */}
        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-xs flex flex-col justify-between hover:border-[#FFE259] transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
                <Home className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] font-black uppercase text-stone-600 dark:text-stone-300 font-sans">
                {t.exp_home_tasting_badge}
              </span>
            </div>
            <h2 className="text-lg font-black text-stone-900 dark:text-stone-100 leading-tight">
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
        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-xs flex flex-col justify-between hover:border-[#FFE259] transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
                <Wine className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] font-black uppercase text-stone-600 dark:text-stone-300 font-sans">
                {t.exp_store_tasting_badge}
              </span>
            </div>
            <h2 className="text-lg font-black text-stone-900 dark:text-stone-100 leading-tight">
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
        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-xs flex flex-col justify-between hover:border-[#FFE259] transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] font-black uppercase text-stone-600 dark:text-stone-300 font-sans">
                {t.exp_wedding_badge}
              </span>
            </div>
            <h2 className="text-lg font-black text-stone-900 dark:text-stone-100 leading-tight">
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
        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-xs flex flex-col justify-between hover:border-[#FFE259] transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
                <Flame className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] font-black uppercase text-stone-600 dark:text-stone-300 font-sans">
                {t.exp_raclette_badge}
              </span>
            </div>
            <h2 className="text-lg font-black text-stone-900 dark:text-stone-100 leading-tight">
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
