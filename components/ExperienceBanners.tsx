'use client';

import Link from 'next/link';
import { Wine, Gift, Sparkles, MessageCircle, PartyPopper, Users } from 'lucide-react';

export function ExperienceBanners() {
  return (
    <section id="experiencias" className="space-y-8 pt-8">
      <div>
        <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
          Aquí pasan cosas...
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1D1D1B] dark:text-stone-100 tracking-tight leading-tight">
          Catas, Eventos & Experiencias EkhiTeka
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Banner 1: Catas en Bilbao */}
        <div className="manduca-card group relative bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs overflow-hidden">
          <div className="space-y-4">
            {/* Foto Cabecera de la Experiencia */}
            <div className="w-full h-44 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Catas.JPG"
                alt="Catas Presenciales & Talleres"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent && !parent.querySelector('.icon-fallback')) {
                    const div = document.createElement('div');
                    div.className = 'icon-fallback w-full h-full flex items-center justify-center text-4xl bg-[#FFE259]/20 text-[#1D1D1B]';
                    div.innerText = '🍷';
                    parent.appendChild(div);
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 leading-snug">
                Catas Presenciales & Talleres
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                Aprende a degustar quesos artesanales internacionales y locales, maridados con sidras naturales, txakolis y vinos de autor en Bilbao.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/34600000000?text=Hola,%20quisiera%20información%20sobre%20las%20catas%20presenciales%20de%20EkhiTeka"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs transition-all shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultar Próximas Fechas</span>
          </a>
        </div>

        {/* Banner 2: Cheese Corners & Eventos */}
        <div className="manduca-card group relative bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-44 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Mesas.JPG"
                alt="Mesas de Quesos para Bodas"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent && !parent.querySelector('.icon-fallback')) {
                    const div = document.createElement('div');
                    div.className = 'icon-fallback w-full h-full flex items-center justify-center text-4xl bg-stone-900 text-[#FFE259]';
                    div.innerText = '🧀';
                    parent.appendChild(div);
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 leading-snug">
                Mesas de Quesos para Bodas & Fiestas
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                Montamos impresionantes 'Cheese Corners' personalizados con flores comestibles, panes artesanos y maridajes para tu celebración.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/34600000000?text=Hola,%20quisiera%20presupuesto%20para%20un%20evento/boda%20con%20mesa%20de%20quesos"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-black text-xs transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-[#FFE259]" />
            <span>Pedir Presupuesto Evento</span>
          </a>
        </div>

        {/* Banner 3: Cestas y Regalos a Medida */}
        <div className="manduca-card group relative bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-44 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Cestas.JPG"
                alt="Cestas Gourmet a Medida"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent && !parent.querySelector('.icon-fallback')) {
                    const div = document.createElement('div');
                    div.className = 'icon-fallback w-full h-full flex items-center justify-center text-4xl bg-[#FFE259]/20 text-[#1D1D1B]';
                    div.innerText = '🎁';
                    parent.appendChild(div);
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 leading-snug">
                Cestas Gourmet & Regalos de Empresa
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                Diseñamos cajas gastronómicas exclusivas con embalaje premium, notas caligráficas y la mejor selección de quesos afinados y salazones.
              </p>
            </div>
          </div>

          <Link
            href="/chat"
            className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs transition-all shadow-xs"
          >
            <Gift className="w-4 h-4" />
            <span>Configurar Cesta a Medida</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
