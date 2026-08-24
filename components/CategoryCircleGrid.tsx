'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { Category } from '@/types/database';

interface CategoryCircleGridProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryCircleGrid({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryCircleGridProps) {
  const { t, language } = useLanguage();

  const curatedCards = [
    {
      id: 'queso',
      title: 'Quesos de Autor',
      subtitle: 'Afinados & Selección',
      icon: '🧀',
      image: '/images/secciones/Quesos.JPG',
      badge: 'Favorito',
    },
    {
      id: 'salazon',
      title: 'Salazones & Anchoas',
      subtitle: 'Del Cantábrico',
      icon: '🐟',
      image: '/images/secciones/Salazones.JPG',
      badge: 'Costera',
    },
    {
      id: 'atun',
      title: 'Bonito del Norte',
      subtitle: 'Conserva artesana',
      icon: '🌊',
      image: '/images/secciones/Bonito.JPG',
      badge: 'Artesano',
    },
    {
      id: 'jildas',
      title: 'Gildas Selectas',
      subtitle: 'Aperitivo Lekeitio',
      icon: '🫒',
      image: '/images/secciones/Gildas.JPG',
      badge: 'Top Pintxo',
    },
    {
      id: 'txakoli',
      title: 'Txakoli & Vinos',
      subtitle: 'Maridaje perfecto',
      icon: '🍷',
      image: '/images/secciones/Txakoli.JPG',
      badge: 'Km0',
    },
    {
      id: 'cerveza',
      title: 'Cerveza Artesana',
      subtitle: 'Elaboración local',
      icon: '🍺',
      image: '/images/secciones/Cerveza.JPG',
      badge: 'Craft',
    },
    {
      id: 'sidra',
      title: 'Sidra Natural',
      subtitle: 'Tradición vasca',
      icon: '🍏',
      image: '/images/secciones/Sidra.JPG',
      badge: 'Natural',
    },
  ];

  return (
    <section className="space-y-6 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
            Descubre nuestras joyas
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1D1D1B] dark:text-stone-100 tracking-tight leading-tight">
            ¿Qué te apetece hoy?
          </h2>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
          Selecciona una categoría para explorar nuestros bocados más especiales
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5">
        {curatedCards.map((card) => {
          const isSelected = selectedCategory === card.id;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelectCategory(card.id)}
              className={`manduca-card group text-left p-3.5 sm:p-4 rounded-3xl border transition-all duration-300 flex flex-col justify-between h-44 sm:h-50 cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-[#FFE259] border-stone-800 text-[#1D1D1B] shadow-md scale-102 ring-2 ring-stone-900/10'
                  : 'bg-white dark:bg-[#1E1D1B] border-stone-200 dark:border-stone-800 hover:border-[#FFE259] text-stone-900 dark:text-stone-100 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between z-10 w-full">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 flex items-center justify-center border border-stone-200/60 dark:border-stone-700 shadow-2xs">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent && !parent.querySelector('.emoji-fallback')) {
                        const span = document.createElement('span');
                        span.className = 'emoji-fallback text-2xl';
                        span.innerText = card.icon;
                        parent.appendChild(span);
                      }
                    }}
                  />
                </div>
                <span className={`text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase ${
                  isSelected
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}>
                  {card.badge}
                </span>
              </div>

              <div className="z-10 pt-2">
                <h3 className="font-black text-xs sm:text-sm leading-tight group-hover:text-stone-950 dark:group-hover:text-white">
                  {card.title}
                </h3>
                <p className={`text-[10px] sm:text-[11px] font-semibold pt-0.5 leading-tight ${
                  isSelected ? 'text-stone-800' : 'text-stone-500 dark:text-stone-400'
                }`}>
                  {card.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
