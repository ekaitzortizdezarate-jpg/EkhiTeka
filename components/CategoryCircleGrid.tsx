'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { Category } from '@/types/database';

interface CategoryCircleGridProps {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export function CategoryCircleGrid({
  categories,
  selectedCategory = 'all',
  onSelectCategory,
}: CategoryCircleGridProps) {
  const { t, language } = useLanguage();

  const getCategoryName = (cat: Category) => {
    if (language === 'eu') return cat.name_eu;
    if (language === 'fr') return cat.name_fr;
    if (language === 'en') return cat.name_en;
    return cat.name_es;
  };

  const getCategorySubtitle = (slug: string) => {
    switch (slug) {
      case 'quesos':
        return language === 'eu' ? 'Artisau & Afinatuak' : 'Artesanos & Afinados';
      case 'atun':
        return language === 'eu' ? 'Kantauri itsasoa' : 'Cantábrico Costera';
      case 'salazones':
        return language === 'eu' ? 'Antxoak & Gatzadurak' : 'Anchoas & Salazón';
      case 'gildas':
        return language === 'eu' ? 'Gilda & Ozpinetakoak' : 'Gildas & Encurtidos';
      case 'cerveza':
        return language === 'eu' ? 'Garagardo Bereziak' : 'Craft & Especiales';
      case 'txakoli':
        return language === 'eu' ? 'Bizkaiko Txakolina' : 'Bizkaiko Txakolina';
      case 'sidra':
        return language === 'eu' ? 'Euskal Sagardoa' : 'Euskal Sagardoa';
      default:
        return 'Gourmet Selection';
    }
  };

  return (
    <section className="space-y-6 pt-2">
      <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
            {t.cat_explore}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 uppercase font-serif tracking-tight">
            Categorías Selección EkhiTeka
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory?.(cat.id)}
              className={`group relative p-3 sm:p-4 rounded-3xl border-2 text-center transition-all flex flex-col items-center justify-between cursor-pointer hover:scale-103 shadow-xs ${
                isSelected
                  ? 'bg-[#FFE259] border-stone-900 dark:border-white shadow-md'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-[#FFE259] dark:hover:border-[#FFE259]'
              }`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-stone-200 dark:border-stone-700 group-hover:border-[#FFE259] mb-2 p-0.5 bg-[#FAF8F5]">
                <img
                  src={cat.image_url || '/images/secciones/Quesos.JPG'}
                  alt={getCategoryName(cat)}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="space-y-0.5 min-w-0 w-full">
                <span className={`block font-serif font-black text-xs sm:text-[13px] truncate leading-tight ${
                  isSelected ? 'text-[#1D1D1B]' : 'text-stone-900 dark:text-stone-100 group-hover:text-[#C68D07] dark:group-hover:text-[#FFE259]'
                }`}>
                  {getCategoryName(cat)}
                </span>
                <span className={`block text-[9.5px] font-sans font-bold uppercase tracking-wider truncate ${
                  isSelected ? 'text-stone-800' : 'text-stone-400 dark:text-stone-500'
                }`}>
                  {getCategorySubtitle(cat.slug)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}