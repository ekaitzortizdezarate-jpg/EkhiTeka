'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ProductCard } from '@/components/ProductCard';
import type { Category, ProductWithSeller } from '@/types/database';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

interface CatalogViewProps {
  products: ProductWithSeller[];
  categories: Category[];
  initialCategory?: string;
}

export function CatalogView({
  products,
  categories,
  initialCategory = 'all',
}: CatalogViewProps) {
  const { t, language } = useLanguage();
  const [selectedCat, setSelectedCat] = useState<string>(initialCategory);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'price_asc' | 'price_desc'>('name_asc');

  // Filtrado y ordenación
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCat !== 'all' && p.category_id !== selectedCat) return false;
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

  return (
    <div className="space-y-8">
      {/* 1. Hero Editorial Gourmet (Inspiración La Manducateca) */}
      <section className="relative rounded-3xl bg-stone-900 text-white overflow-hidden p-6 sm:p-12 border-2 border-stone-800 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Selección de Autor · Bilbao
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {t.brand_tagline}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
            {t.brand_subtitle}
          </p>
        </div>

        {/* Decoración gráfica de fondo */}
        <div className="absolute -bottom-10 -right-10 text-9xl opacity-10 select-none pointer-events-none">
          🧀
        </div>
      </section>

      {/* 2. Pestañas de Categorías (7 secciones + dinámicas) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedCat('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs whitespace-nowrap transition-all shadow-2xs cursor-pointer ${
            selectedCat === 'all'
              ? 'bg-amber-600 text-white scale-102 shadow-xs'
              : 'bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-500/50'
          }`}
        >
          <span>✨</span>
          <span>{t.cat_all}</span>
          <span className="text-[10px] opacity-75 font-normal">({products.length})</span>
        </button>

        {categories.map((cat) => {
          const count = products.filter((p) => p.category_id === cat.id).length;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCat(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs whitespace-nowrap transition-all shadow-2xs cursor-pointer ${
                selectedCat === cat.id
                  ? 'bg-amber-600 text-white scale-102 shadow-xs'
                  : 'bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-500/50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{getCategoryName(cat)}</span>
              <span className="text-[10px] opacity-75 font-normal">({count})</span>
            </button>
          );
        })}
      </div>

      {/* 3. Buscador y Selector de Orden */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-200 dark:border-stone-800 shadow-2xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.prod_search_placeholder}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <SlidersHorizontal className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
          >
            <option value="name_asc">{t.prod_sort_name_asc}</option>
            <option value="name_desc">{t.prod_sort_name_desc}</option>
            <option value="price_asc">{t.prod_sort_price_asc}</option>
            <option value="price_desc">{t.prod_sort_price_desc}</option>
          </select>
        </div>
      </div>

      {/* 4. Grid de Productos */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="text-base font-black text-stone-800 dark:text-stone-200">
            {t.prod_no_results}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Prueba a cambiar el término de búsqueda o selecciona otra categoría.
          </p>
        </div>
      )}
    </div>
  );
}
