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
      badge: 'Favorito',
    },
    {
      id: 'salazon',
      title: 'Salazones & Anchoas',
      subtitle: 'Del Cantábrico',
      icon: '🐟',
      badge: 'Costera',
    },
    {
      id: 'atun',
      title: 'Bonito del Norte',
      subtitle: 'Conserva artesana',
      icon: '🌊',
      badge: 'Artesano',
    },
    {
      id: 'jildas',
      title: 'Gildas Selectas',
      subtitle: 'Aperitivo Bilbao',
      icon: '🫒',
      badge: 'Top Pintxo',
    },
    {
      id: 'txakoli',
      title: 'Txakoli & Vinos',
      subtitle: 'Maridaje perfecto',
      icon: '🍷',
      badge: 'Km0',
    },
    {
      id: 'cerveza',
      title: 'Cerveza & Sidra',
      subtitle: 'Elaboración local',
      icon: '🍺',
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {curatedCards.map((card) => {
          const isSelected = selectedCategory === card.id;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelectCategory(card.id)}
              className={`manduca-card group text-left p-4 sm:p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between h-38 sm:h-44 cursor-pointer ${
                isSelected
                  ? 'bg-[#FFE259] border-stone-800 text-[#1D1D1B] shadow-md scale-102 ring-2 ring-stone-900/10'
                  : 'bg-white dark:bg-[#1E1D1B] border-stone-200 dark:border-stone-800 hover:border-[#FFE259] text-stone-900 dark:text-stone-100 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl sm:text-4xl group-hover:scale-115 transition-transform duration-300">
                  {card.icon}
                </span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                  isSelected
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}>
                  {card.badge}
                </span>
              </div>

              <div>
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
