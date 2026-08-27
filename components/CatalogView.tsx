'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
import { ProductCard } from '@/components/ProductCard';
import { CategoryCircleGrid } from '@/components/CategoryCircleGrid';
import { ExperienceBanners } from '@/components/ExperienceBanners';
import { CustomerReviews } from '@/components/CustomerReviews';
import type { Category, ProductWithSeller } from '@/types/database';
import { getProductCategoryId } from '@/lib/productHelpers';
import { Search, SlidersHorizontal, Sparkles, ArrowDown, MessageCircle, MapPin, Clock } from 'lucide-react';

interface CatalogViewProps {
  products: ProductWithSeller[];
  categories: Category[];
  initialCategory?: string;
  isSeller?: boolean;
}

export function CatalogView({
  products,
  categories,
  initialCategory = 'all',
  isSeller = false,
}: CatalogViewProps) {
  const { t, language } = useLanguage();
  const { getSiteImage, getWhatsAppUrl, storeAddress } = useStoreConfig();
  const [selectedCat, setSelectedCat] = useState<string>(initialCategory);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'price_asc' | 'price_desc'>('name_asc');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCat !== 'all' && getProductCategoryId(p) !== selectedCat) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = (p.description || '').toLowerCase().includes(q);
          const matchOrigin = (p.origin_region || '').toLowerCase().includes(q);
          const matchSeller = (p.profiles?.full_name || '').toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchOrigin && !matchSeller) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
        if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
        if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
        return 0;
      });
  }, [products, selectedCat, search, sortBy]);

  const getCategoryName = (cat: Category) => {
    if (language === 'eu') return cat.name_eu;
    if (language === 'fr') return cat.name_fr;
    if (language === 'en') return cat.name_en;
    return cat.name_es;
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalogo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 font-serif">
      {/* 1. Hero Editorial Gourmet */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-14 lg:p-16 border border-[#E8E5DF] dark:border-[#2D2B27] shadow-xl min-h-[420px] flex items-center bg-[#FAF8F5]">
        <div className="absolute inset-0 z-0">
          <img
            src={getSiteImage('tienda_hero', '/images/secciones/Tienda.JPG')}
            alt="Tienda EkhiTeka Lekeitio"
            className="w-full h-full object-cover object-center scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20 dark:from-black/85 dark:via-black/65 dark:to-black/40" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          <div className="lg:col-span-8 space-y-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#1D1D1B]/90 backdrop-blur-xs text-white text-xs font-bold rounded-full uppercase tracking-[0.16em] shadow-md border border-stone-700/50">
              <Sparkles className="w-3.5 h-3.5 text-stone-300 stroke-[1.75]" /> {t.shop_specialty} · Lekeitio
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white drop-shadow-md">
              {t.shop_hero_title}
            </h1>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl font-normal drop-shadow-md">
              {t.shop_hero_desc}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={scrollToCatalog}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-bold text-xs sm:text-sm transition-all shadow-xl hover:scale-105 cursor-pointer uppercase tracking-[0.14em]"
              >
                <span>{t.shop_see_cheeses}</span>
                <ArrowDown className="w-4 h-4 stroke-[1.75]" />
              </button>

              <a
                href="https://wa.me/34600000000?text=Hola,%20quisiera%20hacer%20un%20encargo%20a%20medida"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1D1D1B]/80 hover:bg-[#1D1D1B] text-white font-bold text-xs sm:text-sm border border-stone-600 transition-all backdrop-blur-md shadow-lg hover:scale-105 uppercase tracking-[0.14em]"
              >
                <MessageCircle className="w-4 h-4 text-stone-300 stroke-[1.75]" />
                <span>{t.shop_whatsapp_orders}</span>
              </a>
            </div>
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

      {/* 2. Categorías */}
      <CategoryCircleGrid
        categories={categories}
        selectedCategory={selectedCat}
        onSelectCategory={(id) => {
          setSelectedCat(id);
          scrollToCatalog();
        }}
      />

      {/* 3. Catálogo Principal */}
      <section id="catalogo" className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-[#E8E5DF] dark:border-[#2D2B27]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 block">
              {t.shop_specialty}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1B] dark:text-stone-100 tracking-tight leading-tight uppercase">
              {t.cat_queso} & {t.brand_tagline}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 tracking-[0.14em] uppercase">
              {t.prod_showing ? `${filteredProducts.length} ${t.prod_showing}` : `${filteredProducts.length}`}
            </span>
          </div>
        </div>

        {/* Pestañas de Categorías */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar font-serif">
          <button
            type="button"
            onClick={() => setSelectedCat('all')}
            className={`flex items-center justify-center text-center gap-2 px-5 py-2.5 rounded-full tracking-[0.16em] uppercase text-[11px] font-bold whitespace-nowrap transition-all shadow-2xs cursor-pointer ${
              selectedCat === 'all'
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black border border-[#FFE259] scale-102 shadow-xs'
                : 'bg-white dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] text-stone-700 dark:text-stone-300 hover:border-stone-400 dark:hover:border-stone-600'
            }`}
          >
            <span>{t.cat_all}</span>
            <span className="text-[10px] opacity-80">({products.length})</span>
          </button>

          {categories.map((cat) => {
            const count = products.filter((p) => getProductCategoryId(p) === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={`flex items-center justify-center text-center gap-2 px-5 py-2.5 rounded-full tracking-[0.16em] uppercase text-[11px] font-bold whitespace-nowrap transition-all shadow-2xs cursor-pointer ${
                  selectedCat === cat.id
                    ? 'bg-[#FFE259] text-[#1D1D1B] font-black border border-[#FFE259] scale-102 shadow-xs'
                    : 'bg-white dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] text-stone-700 dark:text-stone-300 hover:border-stone-400 dark:hover:border-stone-600'
                }`}
              >
                <span>{getCategoryName(cat)}</span>
                <span className="text-[10px] opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Buscador y Orden */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-[#1C1B19] rounded-2xl border border-[#E8E5DF] dark:border-[#2D2B27] shadow-2xs">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.75]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.prod_search_placeholder}
              className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] dark:bg-[#141312] border border-[#E8E5DF] dark:border-[#2D2B27] rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-stone-400 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 font-sans"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end font-serif">
            <SlidersHorizontal className="w-4 h-4 text-stone-400 shrink-0 stroke-[1.75]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2 bg-[#FAF8F5] dark:bg-[#141312] border border-[#E8E5DF] dark:border-[#2D2B27] rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none cursor-pointer shadow-2xs font-serif uppercase tracking-[0.12em]"
            >
              <option value="name_asc">{t.prod_sort_name_asc}</option>
              <option value="name_desc">{t.prod_sort_name_desc}</option>
              <option value="price_asc">{t.prod_sort_price_asc}</option>
              <option value="price_desc">{t.prod_sort_price_desc}</option>
            </select>
          </div>
        </div>

        {/* Grid de Productos */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} isSeller={isSeller} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white dark:bg-[#1C1B19] rounded-3xl border border-[#E8E5DF] dark:border-[#2D2B27] p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 mx-auto">
              <Search className="w-6 h-6 text-stone-400 stroke-[1.75]" />
            </div>
            <h3 className="text-base font-bold font-serif text-stone-800 dark:text-stone-200 uppercase tracking-[0.14em]">
              {t.prod_no_results}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-normal">
              {t.prod_search_placeholder}
            </p>
          </div>
        )}
      </section>

      {/* 4. Experiencias */}
      <ExperienceBanners />

      {/* 5. Tienda Física */}
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
              <button
                type="button"
                onClick={scrollToCatalog}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-bold text-xs uppercase tracking-[0.14em] transition-all shadow-md hover:scale-105 cursor-pointer"
              >
                <ArrowDown className="w-4 h-4 stroke-[1.75]" />
                <span>{t.shop_see_cheeses}</span>
              </button>
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

      {/* 6. Opiniones */}
      <CustomerReviews />
    </div>
  );
}