'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Star, Quote } from 'lucide-react';

export function CustomerReviews() {
  const { t } = useLanguage();

  const reviews = [
    {
      name: 'Miren Agirre',
      town: 'Lekeitio',
      rating: 5,
      comment: t.rev1_comment,
      date: t.rev1_date,
    },
    {
      name: 'Iñigo Goikoetxea',
      town: 'Donostia',
      rating: 5,
      comment: t.rev2_comment,
      date: t.rev2_date,
    },
    {
      name: 'Elena Fernández',
      town: 'Madrid',
      rating: 5,
      comment: t.rev3_comment,
      date: t.rev3_date,
    },
  ];

  return (
    <section id="opiniones" className="space-y-6 pt-8 pb-4">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
          {t.reviews_badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1D1D1B] dark:text-stone-100 tracking-tight font-serif">
          {t.reviews_title}
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
          {t.reviews_subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-serif">
        {reviews.map((rev, i) => (
          <div
            key={i}
            className="manduca-card bg-white dark:bg-[#1C1B19] p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-[#FFE259] text-[#C68D07]" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-stone-400">{rev.date}</span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <div>
                <span className="font-black text-xs text-stone-900 dark:text-stone-100 block">
                  {rev.name}
                </span>
                <span className="text-[10px] font-bold text-stone-500">
                  {rev.town} · {t.reviews_verified_buyer}
                </span>
              </div>
              <Quote className="w-5 h-5 text-stone-300 dark:text-stone-700 opacity-60" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}