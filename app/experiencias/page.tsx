import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/ProductCard';
import type { ProductWithSeller } from '@/types/database';
import {
  Wine,
  Store,
  HeartHandshake,
  Sparkles,
  Flame,
  Calendar,
} from 'lucide-react';

export const revalidate = 0;

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

  // 1. Productos de tipo Cata en Casa
  const cataCasaProducts = allProducts.filter((p) => {
    const cat = (p.category_id || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();

    if (cat === 'tarjeta_regalo' || (name.includes('tarjeta') && name.includes('regalo'))) {
      return false;
    }

    return (
      cat === 'cata_casa' ||
      name.includes('en casa') ||
      name.includes('pack de cata') ||
      name.includes('pack experiencia') ||
      desc.includes('pack en casa') ||
      desc.includes('en casa') ||
      desc.includes('incluye pack en casa')
    );
  });

  // 2. Productos de tipo Cata en Tienda / Presencial
  const cataTiendaProducts = allProducts.filter((p) => {
    const cat = (p.category_id || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();

    if (
      cat === 'tarjeta_regalo' ||
      (name.includes('tarjeta') && name.includes('regalo')) ||
      name.includes('casa') ||
      cat.includes('casa') ||
      desc.includes('en casa')
    ) {
      return false;
    }

    return (
      cat === 'cata_presencial' ||
      cat === 'catas' ||
      cat === 'experiencia' ||
      name.includes('presencial') ||
      name.includes('tienda') ||
      desc.includes('presencial') ||
      name.includes('cata')
    );
  });

  // 3. Próximos Eventos de Catas Presenciales
  const presencialEvents = allProducts.filter((p) => {
    const cat = (p.category_id || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();

    if (
      name.includes('casa') ||
      cat.includes('casa') ||
      cat === 'cesta' ||
      cat === 'tarjeta_regalo' ||
      name.includes('tarjeta') ||
      name.includes('cesta')
    ) {
      return false;
    }

    return (
      cat === 'cata_presencial' ||
      name.includes('presencial') ||
      desc.includes('presencial') ||
      (desc.includes('fecha & hora') && desc.includes('aforo'))
    );
  });

  return (
    <div className="space-y-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 1. Tarjeta de presentación de la ventana (Hero Banner) */}
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
        </div>
      </section>

      {/* 2. Tarjeta info Catas en Casa */}
      <section className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs flex flex-col md:flex-row">
        <div className="relative md:w-1/2 h-64 md:h-auto min-h-[260px] overflow-hidden">
          <img
            src="/images/secciones/Catas.JPG"
            alt="Catas en Casa"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 px-3.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-xs font-black uppercase tracking-wider rounded-full shadow-md">
            A tu ritmo
          </div>
        </div>
        <div className="p-6 sm:p-8 md:w-1/2 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#C68D07] dark:text-[#FFE259]">
              <Wine className="w-6 h-6" />
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
                Catas en Casa
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              Conviértete en anfitrión con nuestros kits completos de cata: selección de 6 quesos afinados clasificados por intensidades, maridajes artesanos de acompañamiento, mantel de cata ilustrado y fichas explicativas con notas de cata y maridajes.
            </p>
          </div>
          {!isSeller && (
            <div className="pt-2">
              <a
                href="https://wa.me/34600000000?text=Hola,%20quisiera%20reservar%20un%20Kit%20de%20Cata%20en%20Casa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all hover:scale-102 font-serif"
              >
                <span>Solicitar Kit para Casa</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* 3. Productos de Cata en Casa (si los hay) */}
      {cataCasaProducts.length > 0 && (
        <section className="space-y-6 pt-2">
          <div className="pb-3 border-b border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259]">
              Kits & Packs para llevar
            </span>
            <h3 className="text-2xl font-black font-serif text-stone-900 dark:text-stone-100 uppercase">
              Kits de Catas en Casa Disponibles
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {cataCasaProducts.map((product) => (
              <ProductCard key={product.id} product={product} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Tarjeta info Catas en la Tienda */}
      <section className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs flex flex-col md:flex-row">
        <div className="relative md:w-1/2 h-64 md:h-auto min-h-[260px] overflow-hidden">
          <img
            src="/images/secciones/Tienda.JPG"
            alt="Catas en la Tienda Lekeitio"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 px-3.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-xs font-black uppercase tracking-wider rounded-full shadow-md">
            Presencial en Lekeitio
          </div>
        </div>
        <div className="p-6 sm:p-8 md:w-1/2 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#C68D07] dark:text-[#FFE259]">
              <Store className="w-6 h-6" />
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
                Catas en la Tienda
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              Experiencias presenciales exclusivas en nuestra quesería de Lekeitio (Gamarra Kalea 4). Guiadas por nuestros afinadores queseros en grupos reducidos, probando piezas de autor, txakoli de Bizkaia y maridajes singulares.
            </p>
          </div>
          {!isSeller && (
            <div className="pt-2">
              <a
                href="https://wa.me/34600000000?text=Hola,%20quisiera%20consultar%20el%20calendario%20de%20Catas%20en%20la%20Tienda%20de%20Lekeitio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all hover:scale-102 font-serif"
              >
                <span>Ver Fechas & Reservar Plaza</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* 5. Productos de Cata en Tienda (si los hay) */}
      {cataTiendaProducts.length > 0 && (
        <section className="space-y-6 pt-2">
          <div className="pb-3 border-b border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259]">
              Presencial en Lekeitio
            </span>
            <h3 className="text-2xl font-black font-serif text-stone-900 dark:text-stone-100 uppercase">
              Catas en Tienda Disponibles
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {cataTiendaProducts.map((product) => (
              <ProductCard key={product.id} product={product} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Próximos Eventos de Catas Presenciales */}
      {presencialEvents.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="pb-3 border-b border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Plazas limitadas · Lekeitio Centro</span>
            </span>
            <h3 className="text-2xl font-black font-serif text-stone-900 dark:text-stone-100 uppercase">
              Próximos Eventos de Catas Presenciales
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {presencialEvents.map((event) => (
              <ProductCard key={event.id} product={event} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Información de Mesa para Bodas e Información de Préstamo de Raclette */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* Mesa para Bodas */}
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
              Creamos mesas de quesos espectaculares para cócteles de bodas y celebraciones. Diseños monumentales con frutas frescas, frutos secos, panes artesanos, confituras y una selección afinada que dejará impresionados a todos los invitados.
            </p>
            {!isSeller && (
              <div className="pt-2">
                <a
                  href="https://wa.me/34600000000?text=Hola,%20quisiera%20presupuesto%20para%20Mesa%20de%20Quesos%20para%20Boda/Evento"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all hover:scale-102 font-serif"
                >
                  <span>Pedir Presupuesto para Bodas</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Préstamo de Raclette */}
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
              Te prestamos la máquina profesional de raclette tradicional suiza junto con el queso de raclette afinado cortado a la perfección, embutidos artesanos y patatas para que disfrutes de una velada única sin preocuparte por el equipamiento.
            </p>
            {!isSeller && (
              <div className="pt-2">
                <a
                  href="https://wa.me/34600000000?text=Hola,%20quisiera%20información%20sobre%20el%20Préstamo%20de%20Raclette%20y%20pack%20de%20queso"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all hover:scale-102 font-serif"
                >
                  <span>Consultar Disponibilidad de Raclette</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}