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
import { Search, SlidersHorizontal, Sparkles, ArrowDown, MessageCircle, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [sortBy, setSortBy] = useState<string>(initialCategory === 'all' ? 'category' : 'name_asc');

  const handleCategoryChange = (catId: string) => {
    setSelectedCat(catId);
    if (catId === 'all') {
      setSortBy('category');
    } else if (sortBy === 'category') {
      setSortBy('name_asc');
    }
    scrollToCatalog();
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCat === 'all' || getProductCategoryId(p) === selectedCat;
        const matchesSearch =
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
          (p.origin_region && p.origin_region.toLowerCase().includes(search.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
        if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
        if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
        return 0;
      });
  }, [products, selectedCat, search, sortBy]);

  const productsByCategory = useMemo(() => {
    const groups: { category: Category; items: ProductWithSeller[] }[] = [];
    const seenIds = new Set<string>();

    const targetCategories =
      selectedCat === 'all'
        ? categories
        : categories.filter((c) => c.id === selectedCat);

    targetCategories.forEach((cat) => {
      const items = filteredProducts.filter((p) => getProductCategoryId(p) === cat.id);
      if (items.length > 0) {
        items.forEach((p) => seenIds.add(p.id));
        groups.push({
          category: cat,
          items,
        });
      }
    });

    if (selectedCat === 'all') {
      const remaining = filteredProducts.filter((p) => !seenIds.has(p.id));
      if (remaining.length > 0) {
        groups.push({
          category: {
            id: 'otros',
            name_es: 'Otros Productos Gourmets',
            name_eu: 'Beste Gourmet Produktu Batzuk',
            name_fr: 'Autres Produits Gourmands',
            name_en: 'Other Gourmet Products',
            icon: 'Sparkles',
            is_active: true,
            display_order: 999,
          },
          items: remaining,
        });
      }
    }

    return groups;
  }, [filteredProducts, categories, selectedCat]);

  const scrollCategoryRow = (categoryId: string, direction: 'left' | 'right') => {
    const el = document.getElementById(`cat-row-${categoryId}`);
    if (el) {
      const scrollAmount = Math.max(280, el.clientWidth * 0.75);
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

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
    <div className="font-serif">
      {/* 1. Hero Editorial Gourmet a Pantalla Completa */}
      <section className="relative w-full overflow-hidden min-h-[480px] sm:min-h-[560px] lg:min-h-[620px] flex items-center bg-[#FAF8F5]">
        <div className="absolute inset-0 z-0">
          <img
            src={getSiteImage('tienda_hero', '/images/secciones/Tienda.JPG')}
            alt="Tienda EkhiTeka Lekeitio"
            className="w-full h-full object-cover object-center scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 dark:from-black/90 dark:via-black/75 dark:to-black/55" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            <div className="lg:col-span-8 space-y-5">
              <span className="inline-flex items-center px-3.5 py-1.5 bg-[#1D1D1B]/90 backdrop-blur-xs text-white text-xs font-bold rounded-full uppercase tracking-[0.16em] shadow-md border border-stone-700/50">
                {t.shop_specialty} · Lekeitio
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white drop-shadow-md">
                {t.shop_hero_title}
              </h1>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl font-normal drop-shadow-md">
                {t.shop_hero_desc}
              </p>
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
        </div>
      </section>

      {/* Contenedor del resto del contenido */}
      <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 2. Categorías */}
        <CategoryCircleGrid
          categories={categories}
          selectedCategory={selectedCat}
          onSelectCategory={(id) => handleCategoryChange(id)}
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
            onClick={() => handleCategoryChange('all')}
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
                onClick={() => handleCategoryChange(cat.id)}
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
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2 bg-[#FAF8F5] dark:bg-[#141312] border border-[#E8E5DF] dark:border-[#2D2B27] rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none cursor-pointer shadow-2xs font-serif uppercase tracking-[0.12em]"
            >
              {selectedCat === 'all' && (
                <option value="category">{t.prod_sort_category}</option>
              )}
              <option value="name_asc">{t.prod_sort_name_asc}</option>
              <option value="name_desc">{t.prod_sort_name_desc}</option>
              <option value="price_asc">{t.prod_sort_price_asc}</option>
              <option value="price_desc">{t.prod_sort_price_desc}</option>
            </select>
          </div>
        </div>

        {/* Filas de Categorías con Desplazamiento Horizontal */}
        {productsByCategory.length > 0 ? (
          <div className="space-y-12">
            {productsByCategory.map((group) => (
              <div key={group.category.id} className="space-y-4 sm:space-y-5 animate-fadeIn">
                {/* Cabecera de la Sección de Categoría */}
                <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b-2 border-[#FFE259] dark:border-[#FFE259]/60">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#FFE259] inline-block shrink-0 shadow-xs border border-stone-800/10" />
                    <h3 className="text-lg sm:text-2xl font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 font-serif">
                      {getCategoryName(group.category)}
                    </h3>
                    <span className="text-xs font-bold text-stone-400 font-mono">
                      ({group.items.length})
                    </span>
                  </div>

                  {/* Controles de desplazamiento y filtro */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {selectedCat === 'all' && (
                      <button
                        type="button"
                        onClick={() => handleCategoryChange(group.category.id)}
                        className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors font-serif hover:underline hidden md:inline-block cursor-pointer mr-2"
                      >
                        {language === 'eu' ? 'Ikusi kategoria hau soilik →' : 'Ver solo esta categoría →'}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => scrollCategoryRow(group.category.id, 'left')}
                      className="p-1.5 sm:p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer shadow-2xs"
                      aria-label="Desplazar a la izquierda"
                      title="Anterior"
                    >
                      <ChevronLeft className="w-4 h-4 stroke-[2]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollCategoryRow(group.category.id, 'right')}
                      className="p-1.5 sm:p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer shadow-2xs"
                      aria-label="Desplazar a la derecha"
                      title="Siguiente"
                    >
                      <ChevronRight className="w-4 h-4 stroke-[2]" />
                    </button>
                  </div>
                </div>

                {/* Panel de Productos Desplazable Horizontalmente con Altura Uniforme */}
                <div
                  id={`cat-row-${group.category.id}`}
                  className="flex items-stretch gap-3 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
                >
                  {group.items.map((product) => (
                    <div
                      key={product.id}
                      className="w-[calc(50%-6px)] sm:w-[260px] md:w-[280px] lg:w-[300px] shrink-0 snap-start flex flex-col h-auto"
                    >
                      <ProductCard product={product} isSeller={isSeller} />
                    </div>
                  ))}
                </div>
              </div>
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
  </div>
);
}