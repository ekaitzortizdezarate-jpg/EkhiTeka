import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/ProductCard';
import type { ProductWithSeller } from '@/types/database';
import {
  Wine,
  Store,
  HeartHandshake,
  Sparkles,
  MessageCircle,
  Flame,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

interface ParsedEvent {
  product: ProductWithSeller;
  dateStr: string;
  dateObj: Date | null;
  timeStr: string;
  attendees: number;
  tastingDetails: string;
}

export default async function ExperienciasPage() {
  const supabase = await createClient();

  const [{ data: { user } }, productsRes] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('products')
      .select('*, profiles!products_seller_id_fkey(id, full_name, town, avatar_url, phone)')
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
  ]);

  let isSeller = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role === 'vendedor' || profile?.role === 'admin') {
      isSeller = true;
    }
  }

  const allProducts = (productsRes.data || []) as unknown as ProductWithSeller[];

  // 1. Productos generales de catas / kits
  const experienceProducts = allProducts.filter((p) => {
    const cat = (p.category_id || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    return (
      cat === 'cata_casa' ||
      cat === 'experiencia' ||
      cat === 'catas' ||
      (cat !== 'cata_presencial' && (name.includes('cata') || name.includes('degustación')))
    );
  });

  // 2. Eventos de Cata Presencial generados por el vendedor
  const rawEvents = allProducts.filter((p) => (p.category_id || '').toLowerCase() === 'cata_presencial');

  // Parsear la información del evento y ordenar por fecha (más cercana a más lejana)
  const parsedEvents: ParsedEvent[] = rawEvents
    .map((p) => {
      const desc = p.description || '';
      const dateMatch = desc.match(/📅 FECHA:\s*([^\n\r]+)/);
      const timeMatch = desc.match(/⏰ HORARIO:\s*([^\n\r]+)/);
      const attendeesMatch = desc.match(/👥 PLAZAS DISPONIBLES:\s*(\d+)/);
      const tastingMatch = desc.match(/🍷 PRODUCTOS A DEGUSTAR:\s*([\s\S]*?)(?:\n\n|$)/);

      const rawDateStr = dateMatch ? dateMatch[1].trim() : '';
      let dateObj: Date | null = null;
      if (rawDateStr) {
        const parsed = new Date(rawDateStr);
        if (!isNaN(parsed.getTime())) {
          dateObj = parsed;
        }
      }

      return {
        product: p,
        dateStr: rawDateStr || 'Próximamente',
        dateObj,
        timeStr: timeMatch ? timeMatch[1].trim() : '19:30 - 21:30',
        attendees: attendeesMatch ? parseInt(attendeesMatch[1]) : (p.stock ?? 12),
        tastingDetails: tastingMatch ? tastingMatch[1].trim() : 'Selección afinada y maridaje vasco',
      };
    })
    .sort((a, b) => {
      if (!a.dateObj && !b.dateObj) return 0;
      if (!a.dateObj) return 1;
      if (!b.dateObj) return -1;
      return a.dateObj.getTime() - b.dateObj.getTime();
    });

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 1. Header Banner */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border-2 border-stone-800 shadow-2xl min-h-[380px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/secciones/Catas.JPG"
            alt="Catas & Experiencias EkhiTeka"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/25 to-black/10 dark:from-black/90 dark:via-black/75 dark:to-black/50" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4 text-white">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-black rounded-full uppercase tracking-wider shadow-md">
            <Sparkles className="w-3.5 h-3.5" /> Experiencias Gastronómicas
          </span>

          <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight">
            Catas & <span className="text-[#FFE259]">Experiencias</span>
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
            Descubre el arte del queso artesano a través de nuestras catas guiadas, eventos para celebraciones y servicios exclusivos para disfrutar en Lekeitio o donde tú elijas.
          </p>

          <div className="pt-2">
            <a
              href="https://wa.me/34600000000?text=Hola,%20quisiera%20consultar%20fechas%20y%20reservas%20para%20Catas%20y%20Experiencias"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Consultar Fechas & Reservas por WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Productos y Kits de Cata generados */}
      {experienceProducts.length > 0 && (
        <section className="space-y-6 pt-2">
          <div className="pb-3 border-b border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
              Kits y formatos para disfrutar
            </span>
            <h2 className="text-2xl font-black font-serif text-stone-900 dark:text-stone-100 uppercase">
              Packs & Catas en Tienda
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {experienceProducts.map((p) => (
              <ProductCard key={p.id} product={p} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Lista de Eventos y Catas Presenciales (Ordenados por fecha más cercana a más lejana) */}
      {parsedEvents.length > 0 && (
        <section className="space-y-6 pt-2">
          <div className="pb-3 border-b border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
              Calendario oficial en Lekeitio
            </span>
            <h2 className="text-2xl font-black font-serif text-stone-900 dark:text-stone-100 uppercase">
              Próximos Eventos & Catas Presenciales
            </h2>
          </div>

          <div className="space-y-4">
            {parsedEvents.map(({ product: p, dateStr, dateObj, timeStr, tastingDetails }) => {
              const remainingSeats = p.stock ?? 0;
              const isSoldOut = remainingSeats <= 0;

              return (
                <div
                  key={p.id}
                  className={`bg-white dark:bg-stone-900 rounded-3xl border-2 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all ${
                    isSoldOut
                      ? 'border-stone-200 dark:border-stone-800 opacity-70'
                      : 'border-stone-200 dark:border-stone-800 hover:border-[#FFE259]'
                  }`}
                >
                  <div className="flex items-start gap-4 sm:gap-6 min-w-0 flex-1">
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#FFE259] text-[#1D1D1B] flex flex-col items-center justify-center p-2 shrink-0 font-serif shadow-xs">
                      <Calendar className="w-5 h-5 mb-0.5" />
                      <span className="text-xs font-black uppercase leading-none">
                        {dateObj
                          ? dateObj.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '')
                          : 'CATA'}
                      </span>
                      <span className="text-base font-black leading-tight">
                        {dateObj ? dateObj.getDate() : '📅'}
                      </span>
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 bg-stone-100 dark:bg-stone-800 rounded-md text-[10px] font-bold text-stone-600 dark:text-stone-300 uppercase">
                          📍 Lekeitio (Gamarra Kalea 4)
                        </span>
                        <span className="px-2.5 py-0.5 bg-amber-50 dark:bg-amber-950/60 text-[#C68D07] dark:text-[#FFE259] rounded-md text-[10px] font-black uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {timeStr}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 dark:text-stone-100">
                        {p.name}
                      </h3>

                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium line-clamp-2">
                        {tastingDetails}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        Precio por Plaza
                      </span>
                      <span className="text-2xl font-black text-[#1D1D1B] dark:text-stone-100 font-serif">
                        {Number(p.price).toFixed(2)} €
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                        {isSoldOut ? 'Plazas agotadas' : `${remainingSeats} plazas disponibles`}
                      </span>
                    </div>

                    <Link
                      href={`/producto/${p.id}`}
                      className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider font-serif transition-all shadow-md ${
                        isSoldOut
                          ? 'bg-stone-200 dark:bg-stone-800 text-stone-500 pointer-events-none'
                          : 'bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] hover:scale-105'
                      }`}
                    >
                      {isSoldOut ? 'Agotado' : 'Reservar Plaza'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Grid de Experiencias Fijas */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
          <div className="relative h-64 overflow-hidden">
            <img
              src="/images/secciones/Catas.JPG"
              alt="Catas en Casa"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-xs font-black uppercase tracking-wider rounded-full shadow-md">
              A tu ritmo
            </div>
          </div>
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-[#C68D07] dark:text-[#FFE259]">
              <Wine className="w-6 h-6" />
              <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
                Catas en Casa
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              Conviértete en anfitrión con nuestros kits completos de cata: selección de 6 quesos afinados clasificados por intensidades, maridajes artesanos de acompañamiento, mantel de cata ilustrado y fichas explicativas.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/34600000000?text=Hola,%20quisiera%20reservar%20un%20Kit%20de%20Cata%20en%20Casa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all hover:scale-102"
              >
                <span>Solicitar Kit para Casa</span>
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
          <div className="relative h-64 overflow-hidden">
            <img
              src="/images/secciones/Tienda.JPG"
              alt="Catas en la Tienda Lekeitio"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-xs font-black uppercase tracking-wider rounded-full shadow-md">
              Presencial en Lekeitio
            </div>
          </div>
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-[#C68D07] dark:text-[#FFE259]">
              <Store className="w-6 h-6" />
              <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
                Catas en la Tienda
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              Experiencias presenciales exclusivas en nuestra quesería de Lekeitio (Gamarra Kalea 4). Guiadas por nuestros afinadores queseros en grupos reducidos, probando piezas de autor y maridajes singulares.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/34600000000?text=Hola,%20quisiera%20consultar%20el%20calendario%20de%20Catas%20en%20la%20Tienda%20de%20Lekeitio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all hover:scale-102"
              >
                <span>Ver Fechas & Reservar Plaza</span>
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
          <div className="relative h-64 overflow-hidden">
            <img
              src="/images/secciones/Mesas.JPG"
              alt="Mesa de Quesos para Bodas"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-xs font-black uppercase tracking-wider rounded-full shadow-md">
              Bodas & Eventos
            </div>
          </div>
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-[#C68D07] dark:text-[#FFE259]">
              <HeartHandshake className="w-6 h-6" />
              <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
                Mesa para Bodas
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              Creamos mesas de quesos espectaculares para cócteles de bodas y celebraciones con frutas frescas, panes artesanos, confituras y una selección afinada.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/34600000000?text=Hola,%20quisiera%20presupuesto%20para%20Mesa%20de%20Quesos%20para%20Boda/Evento"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all hover:scale-102"
              >
                <span>Pedir Presupuesto para Bodas</span>
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
          <div className="relative h-64 overflow-hidden">
            <img
              src="/images/secciones/Quesos.JPG"
              alt="Préstamo de Raclette"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-xs font-black uppercase tracking-wider rounded-full shadow-md">
              Alquiler & Pack
            </div>
          </div>
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-[#C68D07] dark:text-[#FFE259]">
              <Flame className="w-6 h-6" />
              <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
                Préstamo de Raclette
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              Te prestamos la máquina profesional de raclette tradicional suiza junto con el queso de raclette afinado, embutidos y acompañamientos para una velada inolvidable.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/34600000000?text=Hola,%20quisiera%20información%20sobre%20el%20Préstamo%20de%20Raclette%20y%20pack%20de%20queso"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all hover:scale-102"
              >
                <span>Consultar Disponibilidad de Raclette</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}