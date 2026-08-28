'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
import { getCategoryImage } from '@/lib/productHelpers';
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
  const { getSiteImage } = useStoreConfig();

  const getCategorySiteKey = (slug: string) => {
    if (slug.includes('queso')) return 'cat_quesos';
    if (slug.includes('atun') || slug.includes('bonito') || slug.includes('hegaluze')) return 'cat_bonito';
    if (slug.includes('salazon') || slug.includes('anchoa') || slug.includes('antxoa')) return 'cat_salazones';
    if (slug.includes('gilda') || slug.includes('jilda')) return 'cat_gildas';
    if (slug.includes('cerveza') || slug.includes('garagardo')) return 'cat_cerveza';
    if (slug.includes('txakoli')) return 'cat_txakoli';
    if (slug.includes('sidra') || slug.includes('sagardo')) return 'cat_sidra';
    return null;
  };

  const getCategoryName = (cat: Category) => {
    if (language === 'eu') return cat.name_eu || cat.name_es;
    if (language === 'fr') return cat.name_fr || cat.name_es;
    if (language === 'en') return cat.name_en || cat.name_es;
    return cat.name_es;
  };

  const getCategorySubtitle = (cat: Category) => {
    const slug = (cat.slug || cat.id || '').toLowerCase();
    if (slug.includes('queso')) return t.sub_quesos;
    if (slug.includes('atun') || slug.includes('bonito')) return t.sub_atun;
    if (slug.includes('salazon') || slug.includes('anchoa') || slug.includes('antxoa')) return t.sub_salazones;
    if (slug.includes('gilda') || slug.includes('jilda')) return t.sub_gildas;
    if (slug.includes('cerveza') || slug.includes('garagardo')) return t.sub_cerveza;
    if (slug.includes('txakoli')) return t.sub_txakoli;
    if (slug.includes('sidra') || slug.includes('sagardo')) return t.sub_sidra;
    if (slug.includes('cesta')) return t.sub_cesta;
    if (slug.includes('cata') || slug.includes('experiencia')) return t.sub_catas;
    return t.sub_default;
  };

  return (
    <section className="space-y-6 pt-2">
      <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
            {t.cat_explore}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 uppercase font-serif tracking-tight">
            {t.cat_section_title}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const siteKey = getCategorySiteKey((cat.slug || cat.id || '').toLowerCase());
          const fallbackImg = getCategoryImage(cat);
          const imageSrc =
            cat.image_url && cat.image_url.trim()
              ? cat.image_url
              : siteKey
              ? getSiteImage(siteKey, fallbackImg)
              : fallbackImg;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory?.(cat.id)}
              className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] flex items-center justify-center p-3 sm:p-5 text-center cursor-pointer transition-all duration-300 hover:scale-103 shadow-md border-2 ${
                isSelected
                  ? 'border-[#FFE259] ring-2 ring-[#FFE259] scale-103 shadow-lg'
                  : 'border-transparent hover:border-[#FFE259]'
              }`}
            >
              {/* Imagen ocupando todo el fondo de la tarjeta */}
              <img
                src={imageSrc}
                alt={getCategoryName(cat)}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
              <div
                className={`absolute inset-0 transition-colors duration-300 ${
                  isSelected
                    ? 'bg-black/40'
                    : 'bg-black/55 group-hover:bg-black/40'
                }`}
              />

              {/* Texto del nombre de la categoría en el centro */}
              <div className="relative z-10 space-y-1.5 px-2 text-center">
                <span className="block font-serif font-black text-sm sm:text-base lg:text-lg text-white drop-shadow-md uppercase tracking-wider leading-tight">
                  {getCategoryName(cat)}
                </span>
                {isSelected && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFE259] text-[#1D1D1B] text-[9px] font-sans font-black uppercase tracking-widest shadow-xs">
                    ✓
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
