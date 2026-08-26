'use client';

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

        // Si no hay productos específicos marcados en la base de datos, mostramos los productos activos
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

      {/* 2. Tres Bloques de Experiencias de Regalo */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 font-serif">
        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between hover:border-[#FFE259] transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
              <Package className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {t.gifts_card1_title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
              {t.gifts_card1_desc}
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2 font-sans">
            <Truck className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
            <span>{t.gifts_card1_feature}</span>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between hover:border-[#FFE259] transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
              <Gift className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {t.gifts_card2_title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
              {t.gifts_card2_desc}
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2 font-sans">
            <Sparkles className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
            <span>{t.gifts_card2_feature}</span>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between hover:border-[#FFE259] transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {t.gifts_card3_title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
              {t.gifts_card3_desc}
            </p>
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
