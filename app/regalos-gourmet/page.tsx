'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
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
  const { getSiteImage } = useStoreConfig();
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
    <div className="font-serif">
      {/* 1. Hero Editorial a Pantalla Completa */}
      <section className="relative w-full overflow-hidden min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] flex items-center bg-[#FAF8F5]">
        <div className="absolute inset-0 z-0">
          <img
            src={getSiteImage('gifts_hero', '/images/secciones/Cestas.JPG')}
            alt={t.gifts_hero_title}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 dark:from-black/90 dark:via-black/75 dark:to-black/55" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 w-full">
          <div className="max-w-2xl space-y-4 text-white">
            <span className="inline-flex items-center px-3.5 py-1.5 bg-[#1D1D1B]/90 backdrop-blur-xs text-white text-xs font-bold rounded-full uppercase tracking-[0.16em] shadow-md border border-stone-700/50">
              {t.gifts_hero_badge}
            </span>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              {t.gifts_hero_title} <span className="text-[#FFE259]">{t.gifts_hero_title_highlight}</span>
            </h1>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
              {t.gifts_hero_desc}
            </p>

            {!isSeller && (
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/34600000000?text=Hola,%20quisiera%20encargar%20un%20regalo%20gourmet%20personalizado"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-bold text-xs uppercase tracking-[0.14em] transition-all shadow-lg hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4 stroke-[1.75]" />
                  <span>{t.gifts_whatsapp_btn}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contenedor del resto del contenido */}
      <div className="space-y-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 2. Catálogo de Packs y Regalos Disponibles */}
        {products.length > 0 && (
        <section className="space-y-6 pt-2">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DF] dark:border-[#2D2B27]">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 block">
                {t.gifts_catalog_badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1B] dark:text-stone-100 uppercase tracking-tight">
                {t.gifts_catalog_title}
              </h3>
            </div>
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 tracking-[0.14em] uppercase">
              {products.length} {t.prod_showing}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Tres Bloques Editoriales con Imagen: Cestas, Packs y Tarjetas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta 1: Cestas Gourmet a Medida */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] hover:border-[#C8C1B3] dark:hover:border-stone-700 p-6 space-y-4 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-48 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-850 border border-[#E8E5DF] dark:border-[#2D2B27] relative">
              <img
                src={getSiteImage('gifts_card1', '/images/secciones/Cestas.JPG')}
                alt={t.gifts_card1_title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 border border-[#E8E5DF] dark:border-[#2D2B27] flex items-center justify-center text-stone-700 dark:text-stone-300">
                <Package className="w-4 h-4 stroke-[1.75]" />
              </div>
              <h2 className="text-xl font-bold text-[#1D1D1B] dark:text-stone-100 leading-snug">
                {t.gifts_card1_title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                {t.gifts_card1_desc}
              </p>
            </div>
          </div>
          <div className="pt-2 text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2 tracking-[0.12em] uppercase">
            <Truck className="w-4 h-4 text-stone-600 dark:text-stone-400 stroke-[1.75]" />
            <span>{t.gifts_card1_feature}</span>
          </div>
        </div>

        {/* Tarjeta 2: Packs Degustación & Maridaje */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] hover:border-[#C8C1B3] dark:hover:border-stone-700 p-6 space-y-4 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-48 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-850 border border-[#E8E5DF] dark:border-[#2D2B27] relative">
              <img
                src={getSiteImage('gifts_card2', '/images/secciones/Quesos.JPG')}
                alt={t.gifts_card2_title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Catas.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 border border-[#E8E5DF] dark:border-[#2D2B27] flex items-center justify-center text-stone-700 dark:text-stone-300">
                <Gift className="w-4 h-4 stroke-[1.75]" />
              </div>
              <h2 className="text-xl font-bold text-[#1D1D1B] dark:text-stone-100 leading-snug">
                {t.gifts_card2_title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                {t.gifts_card2_desc}
              </p>
            </div>
          </div>
          <div className="pt-2 text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2 tracking-[0.12em] uppercase">
            <Sparkles className="w-4 h-4 text-stone-600 dark:text-stone-400 stroke-[1.75]" />
            <span>{t.gifts_card2_feature}</span>
          </div>
        </div>

        {/* Tarjeta 3: Tarjetas & Catas de Regalo */}
        <div className="manduca-card group rounded-3xl bg-white dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] hover:border-[#C8C1B3] dark:hover:border-stone-700 p-6 space-y-4 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-48 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-850 border border-[#E8E5DF] dark:border-[#2D2B27] relative">
              <img
                src={getSiteImage('gifts_card3', '/images/secciones/Mesas.JPG')}
                alt={t.gifts_card3_title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Catas.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 border border-[#E8E5DF] dark:border-[#2D2B27] flex items-center justify-center text-stone-700 dark:text-stone-300">
                <CreditCard className="w-4 h-4 stroke-[1.75]" />
              </div>
              <h2 className="text-xl font-bold text-[#1D1D1B] dark:text-stone-100 leading-snug">
                {t.gifts_card3_title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                {t.gifts_card3_desc}
              </p>
            </div>
          </div>
          <div className="pt-2 text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2 tracking-[0.12em] uppercase">
            <HeartHandshake className="w-4 h-4 text-stone-600 dark:text-stone-400 stroke-[1.75]" />
            <span>{t.gifts_card3_feature}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
);
}
