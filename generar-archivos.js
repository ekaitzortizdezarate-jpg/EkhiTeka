const fs = require('fs');
const path = require('path');

const files = {
  // =========================================================================
  // 1. BANNERS DE EXPERIENCIAS (Botón de Mesas de Quesos con color unificado)
  // =========================================================================
  'components/ExperienceBanners.tsx': `'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
import { MessageCircle, Sparkles, Gift } from 'lucide-react';

export function ExperienceBanners() {
  const { t } = useLanguage();
  const { getWhatsAppUrl } = useStoreConfig();

  return (
    <section id="experiencias" className="space-y-8 pt-8">
      <div>
        <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
          {t.exp_banner_badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1D1D1B] dark:text-stone-100 tracking-tight leading-tight font-serif">
          {t.exp_banner_title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-serif">
        {/* Banner 1: Catas Presenciales */}
        <div className="manduca-card group relative bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-44 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Catas.JPG"
                alt={t.exp_b1_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 leading-snug">
                {t.exp_b1_title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium font-sans">
                {t.exp_b1_desc}
              </p>
            </div>
          </div>

          <a
            href={getWhatsAppUrl('Hola, quisiera información sobre las catas presenciales de EkhiTeka')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs transition-all shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.exp_b1_btn}</span>
          </a>
        </div>

        {/* Banner 2: Mesas de Quesos (Botón Amarillo unificado) */}
        <div className="manduca-card group relative bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-44 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Mesas.JPG"
                alt={t.exp_b2_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 leading-snug">
                {t.exp_b2_title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium font-sans">
                {t.exp_b2_desc}
              </p>
            </div>
          </div>

          <a
            href={getWhatsAppUrl('Hola, quisiera presupuesto para un evento o boda con mesa de quesos')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.exp_b2_btn}</span>
          </a>
        </div>

        {/* Banner 3: Cestas y Regalos */}
        <div className="manduca-card group relative bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-44 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Cestas.JPG"
                alt={t.exp_b3_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 leading-snug">
                {t.exp_b3_title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium font-sans">
                {t.exp_b3_desc}
              </p>
            </div>
          </div>

          <Link
            href="/regalos-gourmet"
            className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs transition-all shadow-xs"
          >
            <Gift className="w-4 h-4" />
            <span>{t.exp_b3_btn}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
`,

  // =========================================================================
  // 2. VENTANA CATAS & EXPERIENCIAS (Botones amarillos unificados en todas las tarjetas)
  // =========================================================================
  'app/experiencias/page.tsx': `'use client';

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

      {/* 2. Cuatro Tarjetas de Experiencias con Botones Amarillos Unificados */}
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
            href={getWhatsAppUrl('Hola, quisiera solicitar un Kit de Cata en Casa')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5 shadow-xs"
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
            href={getWhatsAppUrl('Hola, quisiera pedir presupuesto para Mesa de Quesos de Boda')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5 shadow-xs"
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
            href={getWhatsAppUrl('Hola, quisiera consultar disponibilidad para préstamo de Raclette')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5 shadow-xs"
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
  // 3. SELECTOR DE CANTIDAD (Modo Oscuro Corregido)
  // =========================================================================
  'components/ProductDetailAddToCart.tsx': `'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import type { ProductWithSeller } from '@/types/database';
import { ShoppingBag, Check, Pencil, Ticket } from 'lucide-react';

interface ProductDetailAddToCartProps {
  product: ProductWithSeller;
  isSeller?: boolean;
}

export function ProductDetailAddToCart({
  product,
  isSeller = false,
}: ProductDetailAddToCartProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isSoldOut = !product.is_unlimited_stock && (product.stock ?? 0) <= 0;
  const maxStock = product.is_unlimited_stock ? 99 : Math.max(0, product.stock ?? 0);
  const isEvent =
    product.category_id === 'catas' ||
    product.category_id === 'cata_presencial' ||
    product.category_id === 'experiencia' ||
    product.name.toLowerCase().includes('cata');

  const handleAdd = () => {
    if (isSoldOut || quantity <= 0) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product, 'EkhiTeka Selección');
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isSeller) {
    return (
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3">
        <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
          Modo Vendedor: Estás previsualizando la ficha de este producto.
        </p>
        <Link
          href={\`/vendedor/productos/\${product.id}/editar\`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all shadow-xs font-serif"
        >
          <Pencil className="w-4 h-4" />
          <span>Editar variables del producto</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-serif">
      <div className="flex items-center gap-3">
        {/* Selector de cantidad con modo oscuro nítido */}
        {!isSoldOut && (
          <div className="flex items-center rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-[#1F1E1C] p-1 shadow-inner">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-700 dark:text-stone-200 font-bold hover:bg-stone-200 dark:hover:bg-stone-800 disabled:opacity-30 cursor-pointer transition-colors"
            >
              -
            </button>
            <span className="w-10 text-center text-xs font-black text-stone-900 dark:text-[#F5F5F0]">
              {quantity}
            </span>
            <button
              type="button"
              disabled={quantity >= maxStock}
              onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-700 dark:text-stone-200 font-bold hover:bg-stone-200 dark:hover:bg-stone-800 disabled:opacity-30 cursor-pointer transition-colors"
            >
              +
            </button>
          </div>
        )}

        {/* Botón Principal */}
        <button
          type="button"
          disabled={isSoldOut}
          onClick={handleAdd}
          className={\`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer \${
            isSoldOut
              ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed shadow-none'
              : added
              ? 'bg-emerald-700 text-white'
              : 'bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] hover:scale-102 hover:shadow-lg'
          }\`}
        >
          {isSoldOut ? (
            <span>{isEvent ? t.event_capacity_full : t.prod_sold_out}</span>
          ) : added ? (
            <>
              <Check className="w-5 h-5" />
              <span>{isEvent ? t.event_seats_added : t.prod_added}</span>
            </>
          ) : (
            <>
              {isEvent ? <Ticket className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
              <span>{isEvent ? t.event_reserve_seat : t.prod_add_to_cart}</span>
            </>
          )}
        </button>
      </div>

      {/* Aviso de stock / plazas restantes */}
      {!isSoldOut && product.stock !== null && product.stock <= 5 && !product.is_unlimited_stock && (
        <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
          {isEvent ? \`¡Atención! Solo quedan \${product.stock} plazas disponibles.\` : \`¡Últimas \${product.stock} unidades en stock!\`}
        </p>
      )}
    </div>
  );
}
`,

  // =========================================================================
  // 4. FICHA DE PRODUCTO (Caja de dudas con Modo Oscuro Corregido)
  // =========================================================================
  'app/producto/[id]/page.tsx': `import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailAddToCart } from '@/components/ProductDetailAddToCart';
import { getProductImage } from '@/lib/productHelpers';
import type { ProductWithSeller } from '@/types/database';
import {
  ArrowLeft,
  MapPin,
  Truck,
  Store,
  ShieldCheck,
  MessageCircle,
  Ticket,
} from 'lucide-react';

export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: { user } }, { data: product }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('products')
      .select('*, profiles!products_seller_id_fkey(id, full_name, town, avatar_url, phone, role)')
      .eq('id', id)
      .single(),
  ]);

  if (!product) notFound();

  let isSeller = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role === 'vendedor' || profile?.role === 'admin') {
      isSeller = true;
    }
  }

  const { data: relatedData } = await supabase
    .from('products')
    .select('*, profiles!products_seller_id_fkey(id, full_name, town, avatar_url, phone)')
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .eq('is_active', true)
    .limit(4);

  const relatedProducts = (relatedData || []) as unknown as ProductWithSeller[];

  const isEvent =
    product.category_id === 'catas' ||
    product.category_id === 'cata_presencial' ||
    product.category_id === 'experiencia' ||
    product.name.toLowerCase().includes('cata');

  const imageUrl = getProductImage(product);

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Botón Volver */}
      <div>
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 text-xs font-bold font-serif uppercase tracking-wider text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100 transition-colors p-2 rounded-xl bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la selección</span>
        </Link>
      </div>

      {/* Grid Principal del Producto */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Imagen */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 sm:aspect-square w-full rounded-3xl overflow-hidden border-2 border-stone-200 dark:border-stone-800 bg-[#FAF7F2] dark:bg-stone-850 shadow-lg">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
              }}
            />
            {product.origin_region && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/80 backdrop-blur-xs text-white text-xs font-black rounded-xl uppercase tracking-wider shadow-md">
                <MapPin className="w-3.5 h-3.5 text-[#FFE259]" />
                <span>{product.origin_region}</span>
              </span>
            )}
            {isEvent && (
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-black rounded-xl uppercase tracking-wider shadow-md">
                <Ticket className="w-3.5 h-3.5" />
                <span>{product.stock} plazas disponibles</span>
              </span>
            )}
          </div>
        </div>

        {/* Información & Checkout */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2 border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259]">
              EkhiTeka Gourmet · Lekeitio
            </span>
            <h1 className="text-2xl sm:text-4xl font-black font-serif text-stone-900 dark:text-stone-100 leading-tight">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold text-stone-500 dark:text-stone-400">
              {product.format && (
                <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  Formato: {product.format}
                </span>
              )}
              {product.weight_g && (
                <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  Peso: {product.weight_g}g
                </span>
              )}
            </div>
          </div>

          {/* Precio y Componente de Compra/Reserva */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black font-serif text-[#1D1D1B] dark:text-stone-100">
                {Number(product.price).toFixed(2)} €
              </span>
              <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                {isEvent ? '/ plaza' : 'IVA incl.'}
              </span>
            </div>

            <ProductDetailAddToCart
              product={product as unknown as ProductWithSeller}
              isSeller={isSeller}
            />
          </div>

          {/* Descripción & Notas de Cata */}
          {product.description && (
            <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <h3 className="text-xs font-black uppercase tracking-wider font-serif text-stone-800 dark:text-stone-200">
                Descripción & Detalles
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Asesoramiento por Chat con Modo Oscuro Corregido */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-bold font-serif text-stone-900 dark:text-stone-100">
                ¿Tienes alguna duda sobre este producto?
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Consulta directamente con nuestros afinadores y expertos.
              </p>
            </div>
            <Link
              href={\`/chat/\${product.seller_id}?product_id=\${product.id}\`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] text-xs font-black uppercase tracking-wider transition-all font-serif shrink-0 shadow-xs hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Preguntar</span>
            </Link>
          </div>

          {/* Garantías de Entrega */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-bold text-stone-600 dark:text-stone-400">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-800">
              <Truck className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
              <span>Frío garantizado 24/48h</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-800">
              <Store className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
              <span>Recogida en Lekeitio</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-800">
              <ShieldCheck className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
              <span>Calidad artesanal km0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-stone-200 dark:border-stone-800">
          <div className="pb-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259]">
              Recomendaciones del afinador
            </span>
            <h3 className="text-2xl font-black font-serif text-stone-900 dark:text-stone-100 uppercase">
              También te puede interesar
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
`,

  // =========================================================================
  // 5. PROFILE FORM (Modo Oscuro con contraste perfecto en todos los datos)
  // =========================================================================
  'components/ProfileForm.tsx': `'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { updateProfile, changeUserPassword } from '@/app/actions/auth';
import type { Profile, PickupAddress } from '@/types/database';
import { parseProfile, isProfileComplete } from '@/types/database';
import {
  User,
  Phone,
  MapPin,
  Lock,
  Check,
  Home,
  Pencil,
  Plus,
  Trash2,
  ChevronDown,
  MessageCircle,
  Store,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ProfileFormProps {
  profile?: Profile;
  userProfile?: Profile;
}

export function ProfileForm({ profile, userProfile }: ProfileFormProps) {
  const raw = profile || userProfile || ({} as Profile);
  const { t } = useLanguage();

  const [currentProfile, setCurrentProfile] = useState<Profile>(parseProfile(raw));
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  // Estados específicos de vendedor
  const [pickupAddresses, setPickupAddresses] = useState<PickupAddress[]>(
    currentProfile.pickup_addresses || []
  );
  const [customWhatsApp, setCustomWhatsApp] = useState<string>(
    currentProfile.whatsapp_phone || currentProfile.phone || '34600000000'
  );
  const [whatsAppMode, setWhatsAppMode] = useState<'registered' | 'custom'>(
    currentProfile.whatsapp_phone && currentProfile.whatsapp_phone !== currentProfile.phone
      ? 'custom'
      : 'registered'
  );

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const p = currentProfile;
  const isSeller = p.role === 'vendedor' || p.role === 'admin';
  const isComplete = isProfileComplete(p);

  const handleSetActiveAddress = (id: string) => {
    const updated = pickupAddresses.map((addr) => ({
      ...addr,
      is_active: addr.id === id,
    }));
    setPickupAddresses(updated);
  };

  const handleAddAddress = () => {
    const newAddr: PickupAddress = {
      id: 'addr_' + Date.now(),
      title: 'Punto de Recogida #' + (pickupAddresses.length + 1),
      street: 'Gamarra Kalea',
      number: '4',
      town: 'Lekeitio',
      province: 'Bizkaia',
      postal_code: '48280',
      schedule: '10:00 - 14:30 | 17:00 - 20:30',
      is_active: pickupAddresses.length === 0,
    };
    setPickupAddresses([...pickupAddresses, newAddr]);
  };

  const handleUpdateAddress = (id: string, field: keyof PickupAddress, value: any) => {
    const updated = pickupAddresses.map((addr) =>
      addr.id === id ? { ...addr, [field]: value } : addr
    );
    setPickupAddresses(updated);
  };

  const handleDeleteAddress = (id: string) => {
    if (pickupAddresses.length <= 1) {
      alert('Debe haber al menos una dirección de tienda/recogida registrada.');
      return;
    }
    const filtered = pickupAddresses.filter((addr) => addr.id !== id);
    if (!filtered.some((a) => a.is_active)) {
      filtered[0].is_active = true;
    }
    setPickupAddresses(filtered);
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileMsg(null);

    const formData = new FormData(e.currentTarget);
    const resolvedWhatsApp = whatsAppMode === 'registered' ? (formData.get('phone') as string) : customWhatsApp;
    formData.append('whatsapp_phone', resolvedWhatsApp);
    formData.append('pickup_addresses', JSON.stringify(pickupAddresses));

    const res = await updateProfile(formData);
    setLoadingProfile(false);

    if (res?.error) {
      setProfileMsg({ text: res.error, isError: true });
    } else {
      setProfileMsg({ text: t.common_success, isError: false });
      if (res?.updatedProfile) {
        setCurrentProfile(parseProfile(res.updatedProfile));
      }
      setIsEditing(false);
      setTimeout(() => setProfileMsg(null), 3500);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingPassword(true);
    setPasswordMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await changeUserPassword(formData);
    setLoadingPassword(false);

    if (res?.error) {
      setPasswordMsg({ text: res.error, isError: true });
    } else {
      setPasswordMsg({ text: '¡Contraseña actualizada con éxito!', isError: false });
      (e.target as HTMLFormElement).reset();
      setTimeout(() => {
        setPasswordMsg(null);
        setIsPasswordOpen(false);
      }, 2500);
    }
  };

  const formattedAddress = [
    p.street,
    p.number ? \`Nº \${p.number}\` : '',
    p.stair ? \`Esc \${p.stair}\` : '',
    p.floor ? \`Piso \${p.floor}\` : '',
    p.door ? \`Pta \${p.door}\` : '',
    p.postal_code,
    p.town,
    p.province,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-8 font-serif">
      {/* 1. TARJETA PRINCIPAL DE PERFIL */}
      <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Cabecera con Estado y Botón Editar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-[#C68D07] dark:text-[#FFE259]">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100">
                  {p.full_name || 'Usuario EkhiTeka'}
                </h2>
                <span
                  className={\`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider font-sans \${
                    isComplete
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  }\`}
                >
                  {isComplete ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" /> {t.profile_status_complete}
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" /> {t.profile_status_incomplete}
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                {t.profile_subtitle}
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer hover:scale-105 shrink-0"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{t.profile_edit_btn}</span>
            </button>
          )}
        </div>

        {profileMsg && (
          <div
            className={\`p-4 rounded-2xl text-xs font-bold text-center font-sans \${
              profileMsg.isError
                ? 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
                : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
            }\`}
          >
            {profileMsg.text}
          </div>
        )}

        {/* ----------------- MODO VISTA CON MODO OSCURO NÍTIDO ----------------- */}
        {!isEditing ? (
          <div className="space-y-6 font-sans text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-400 block">
                  {t.profile_first_name} & {t.profile_last_name_1}
                </span>
                <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                  {[p.first_name, p.last_name_1, p.last_name_2].filter(Boolean).join(' ') || p.full_name || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-400 block">
                  {t.profile_dni}
                </span>
                <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm uppercase">
                  {p.dni || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-400 block">
                  {t.profile_birth_date}
                </span>
                <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                  {p.birth_date || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-400 block">
                  {t.profile_phone}
                </span>
                <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                  {p.phone || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-400 block">
                  {t.auth_email}
                </span>
                <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                  {p.email || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-400 block">
                  {t.profile_town} · {t.profile_province}
                </span>
                <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                  {p.town || 'Lekeitio'} ({p.province || 'Bizkaia'})
                </p>
              </div>
            </div>

            {/* Dirección Personal con Modo Oscuro */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#C68D07] dark:text-[#FFE259] flex items-center gap-1.5 font-serif">
                <Home className="w-3.5 h-3.5" />
                <span>{t.profile_address_data}</span>
              </span>
              <p className="text-sm font-bold text-stone-800 dark:text-[#F5F5F0]">
                {formattedAddress || t.profile_not_specified}
              </p>
            </div>

            {/* SECCIÓN VENDEDOR: WHATSAPP Y TIENDAS */}
            {isSeller && (
              <div className="space-y-4 pt-4 border-t border-stone-200/60 dark:border-stone-800">
                {/* WhatsApp Tienda */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block font-serif">
                        WhatsApp Oficial de la Tienda
                      </span>
                      <p className="text-sm font-black text-stone-900 dark:text-[#F5F5F0]">
                        +{p.whatsapp_phone || p.phone || '34600000000'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direcciones de Recogida en Tienda */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-400 block font-serif">
                    Puntos de Entrega & Recogida en Tienda ({pickupAddresses.length})
                  </span>
                  <div className="space-y-2">
                    {pickupAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={\`p-3.5 rounded-2xl border flex items-center justify-between gap-3 \${
                          addr.is_active
                            ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
                            : 'bg-stone-50 dark:bg-[#1F1E1C] border-stone-200 dark:border-stone-800'
                        }\`}
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <Store className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
                            <h4 className="font-bold text-stone-900 dark:text-[#F5F5F0] truncate">{addr.title}</h4>
                            {addr.is_active && (
                              <span className="px-2 py-0.5 rounded-full bg-[#FFE259] text-[#1D1D1B] font-black text-[9px] uppercase">
                                Activa
                              </span>
                            )}
                          </div>
                          <p className="text-stone-600 dark:text-stone-300 text-[11px] truncate">
                            {addr.street} {addr.number || ''}, {addr.town} ({addr.province}) · {addr.schedule || ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* MODO EDICIÓN */
          <form onSubmit={handleProfileSubmit} className="space-y-6 font-sans text-xs animate-fadeIn">
            {/* 1. Nombre y Apellidos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_first_name} *
                </label>
                <input
                  type="text"
                  name="first_name"
                  required
                  defaultValue={p.first_name || ''}
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_last_name_1} *
                </label>
                <input
                  type="text"
                  name="last_name_1"
                  required
                  defaultValue={p.last_name_1 || ''}
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_last_name_2}
                </label>
                <input
                  type="text"
                  name="last_name_2"
                  defaultValue={p.last_name_2 || ''}
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                />
              </div>
            </div>

            {/* 2. DNI, Fecha Nacimiento y Teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_dni} *
                </label>
                <input
                  type="text"
                  name="dni"
                  required
                  defaultValue={p.dni || ''}
                  placeholder="12345678Z"
                  className="w-full px-3.5 py-2.5 rounded-xl border uppercase bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_birth_date} *
                </label>
                <input
                  type="date"
                  name="birth_date"
                  required
                  defaultValue={p.birth_date || ''}
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_phone} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  defaultValue={p.phone || ''}
                  placeholder="600 000 000"
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                />
              </div>
            </div>

            {/* 3. Dirección Personal */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block font-serif">
                {t.profile_address_data}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_province} *
                  </label>
                  <input
                    type="text"
                    name="province"
                    required
                    defaultValue={p.province || 'Bizkaia'}
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_town} *
                  </label>
                  <input
                    type="text"
                    name="town"
                    required
                    defaultValue={p.town || 'Lekeitio'}
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_postal_code} *
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    required
                    defaultValue={p.postal_code || ''}
                    placeholder="48280"
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                <div className="col-span-2 sm:col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_street} *
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    defaultValue={p.street || ''}
                    placeholder="Gamarra Kalea"
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_number} *
                  </label>
                  <input
                    type="text"
                    name="number"
                    required
                    defaultValue={p.number || ''}
                    placeholder="4"
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_stair}
                  </label>
                  <input
                    type="text"
                    name="stair"
                    defaultValue={p.stair || ''}
                    placeholder="A"
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_floor} *
                  </label>
                  <input
                    type="text"
                    name="floor"
                    required
                    defaultValue={p.floor || ''}
                    placeholder="2"
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_door} *
                  </label>
                  <input
                    type="text"
                    name="door"
                    required
                    defaultValue={p.door || ''}
                    placeholder="B"
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN VENDEDOR: CONFIGURACIÓN WHATSAPP Y PUNTOS DE RECOGIDA (MODO EDICIÓN) */}
            {isSeller && (
              <div className="space-y-6 pt-4 border-t border-stone-200 dark:border-stone-800">
                {/* WhatsApp Config */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 font-serif">
                      WhatsApp Oficial de la Tienda
                    </h3>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Todos los botones de WhatsApp de la web se dirigirán a este número.
                  </p>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800 dark:text-stone-200">
                      <input
                        type="radio"
                        name="whatsapp_choice"
                        checked={whatsAppMode === 'registered'}
                        onChange={() => setWhatsAppMode('registered')}
                      />
                      <span>Usar el teléfono de contacto principal ({p.phone || 'registrado'})</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800 dark:text-stone-200">
                      <input
                        type="radio"
                        name="whatsapp_choice"
                        checked={whatsAppMode === 'custom'}
                        onChange={() => setWhatsAppMode('custom')}
                      />
                      <span>Introducir otro número de WhatsApp para la tienda</span>
                    </label>

                    {whatsAppMode === 'custom' && (
                      <div className="pt-1">
                        <input
                          type="text"
                          value={customWhatsApp}
                          onChange={(e) => setCustomWhatsApp(e.target.value)}
                          placeholder="Ej: 34600000000"
                          className="w-full sm:max-w-xs px-3.5 py-2 rounded-xl border font-bold bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Gestor de Direcciones de Tienda */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
                      <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 font-serif">
                        Direcciones de Recogida / Puntos de Venta
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddAddress}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-bold text-xs uppercase cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir Punto</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {pickupAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={\`p-4 rounded-2xl border-2 space-y-3 \${
                          addr.is_active
                            ? 'border-[#FFE259] bg-amber-50/40 dark:bg-amber-950/20'
                            : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#1F1E1C]'
                        }\`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={addr.title}
                              onChange={(e) => handleUpdateAddress(addr.id, 'title', e.target.value)}
                              placeholder="Nombre de la tienda / sede"
                              className="font-bold px-2 py-1 rounded-lg border text-xs bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                            />
                            {addr.is_active ? (
                              <span className="px-2 py-0.5 rounded-full bg-[#FFE259] text-[#1D1D1B] font-black text-[9px] uppercase">
                                Activa para clientes
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetActiveAddress(addr.id)}
                                className="px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 hover:bg-[#FFE259] text-stone-800 dark:text-stone-200 hover:text-[#1D1D1B] font-bold text-[9px] uppercase transition-colors cursor-pointer"
                              >
                                Activar esta
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1.5 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Eliminar punto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <input
                            type="text"
                            value={addr.street}
                            onChange={(e) => handleUpdateAddress(addr.id, 'street', e.target.value)}
                            placeholder="Calle"
                            className="px-2.5 py-1.5 rounded-lg border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                          />
                          <input
                            type="text"
                            value={addr.number || ''}
                            onChange={(e) => handleUpdateAddress(addr.id, 'number', e.target.value)}
                            placeholder="Nº"
                            className="px-2.5 py-1.5 rounded-lg border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                          />
                          <input
                            type="text"
                            value={addr.town}
                            onChange={(e) => handleUpdateAddress(addr.id, 'town', e.target.value)}
                            placeholder="Municipio"
                            className="px-2.5 py-1.5 rounded-lg border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                          />
                          <input
                            type="text"
                            value={addr.province}
                            onChange={(e) => handleUpdateAddress(addr.id, 'province', e.target.value)}
                            placeholder="Provincia"
                            className="px-2.5 py-1.5 rounded-lg border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                          />
                        </div>

                        <input
                          type="text"
                          value={addr.schedule || ''}
                          onChange={(e) => handleUpdateAddress(addr.id, 'schedule', e.target.value)}
                          placeholder="Horario de atención (Ej: Lun-Vie 10:00-14:30 | 17:00-20:30)"
                          className="w-full px-2.5 py-1.5 rounded-lg border text-[11px] bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-3 font-serif">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold text-xs uppercase tracking-wider hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                {t.common_cancel}
              </button>
              <button
                type="submit"
                disabled={loadingProfile}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{loadingProfile ? t.common_loading : t.profile_save_changes_btn}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. TARJETA CAMBIAR CONTRASEÑA */}
      <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs">
        <button
          type="button"
          onClick={() => setIsPasswordOpen(!isPasswordOpen)}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 font-serif">
                {t.profile_security}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                {isPasswordOpen ? 'Introduce tu contraseña actual y la nueva clave.' : 'Pulsa aquí para cambiar tu contraseña de acceso.'}
              </p>
            </div>
          </div>

          <div className={\`p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 transition-transform duration-200 \${isPasswordOpen ? 'rotate-180' : ''}\`}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </button>

        {isPasswordOpen && (
          <form onSubmit={handlePasswordSubmit} className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800 space-y-4 font-sans text-xs max-w-md animate-fadeIn">
            {passwordMsg && (
              <div
                className={\`p-3.5 rounded-2xl text-xs font-bold text-center \${
                  passwordMsg.isError
                    ? 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
                    : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                }\`}
              >
                {passwordMsg.text}
              </div>
            )}

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {t.profile_current_password} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="current_password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {t.profile_new_password} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="new_password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {t.profile_confirm_password} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="confirm_password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end font-serif">
              <button
                type="submit"
                disabled={loadingPassword}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1D1D1B] dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4 text-[#FFE259] dark:text-[#1D1D1B]" />
                <span>{loadingPassword ? t.common_loading : t.profile_change_password_btn}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
`,
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trimStart(), 'utf8');
  console.log(`✓ Actualizado: ${filePath}`);
});

console.log('\n🎉 ¡Todos los componentes, estilos oscuros y botones corregidos con éxito!');