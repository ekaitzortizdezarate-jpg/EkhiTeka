'use client';

import { Star, Quote } from 'lucide-react';

export function CustomerReviews() {
  const reviews = [
    {
      name: 'Miren Agirre',
      town: 'Bilbao',
      rating: 5,
      comment: 'Los quesos son una auténtica locura. El afinado perfecto y el envío refrigerado llegó impecable en 24h. La mejor quesería de Bizkaia con diferencia.',
      date: 'Hace 3 días',
    },
    {
      name: 'Iñigo Goikoetxea',
      town: 'Donostia',
      rating: 5,
      comment: 'Encargué una tabla de quesos y conservas para un cumpleaños y todos los invitados quedaron fascinados. El trato cercano y la recomendación por WhatsApp un 10.',
      date: 'Hace 1 semana',
    },
    {
      name: 'Elena Fernández',
      town: 'Madrid',
      rating: 5,
      comment: 'Compro la selección de quesos y anchoas todos los meses. El empaquetado térmico mantiene el producto fresco como si estuvieras en la tienda física.',
      date: 'Hace 2 semanas',
    },
  ];

  return (
    <section id="opiniones" className="space-y-6 pt-8 pb-4">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
          Confianza & Pasión Gastronómica
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1D1D1B] dark:text-stone-100 tracking-tight">
          Opiniones de Nuestros Clientes
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
          Lo que dicen los amantes del buen queso que ya han probado nuestra selección
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  {rev.town} · Comprador verificado
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
