import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/ProductCard';
import type { ProductWithSeller } from '@/types/database';
import { Gift, MessageCircle, ArrowRight, Package, Wine, CreditCard } from 'lucide-react';

export const revalidate = 0;

export default async function RegalosGourmetPage() {
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
  
  // Incluye tarjetas de regalo, cestas gourmet y packs de cata en casa generados por el vendedor
  const giftProducts = allProducts.filter((p) => {
    const cat = (p.category_id || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    return (
      cat === 'tarjeta_regalo' ||
      cat === 'cesta_gourmet' ||
      cat === 'cata_casa' ||
      cat === 'cesta' ||
      cat === 'cestas' ||
      name.includes('cesta') ||
      name.includes('regalo') ||
      name.includes('tarjeta') ||
      name.includes('lote') ||
      name.includes('pack')
    );
  });

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 1. Header Banner Regalos Gourmet */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border-2 border-stone-800 shadow-2xl min-h-[380px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/secciones/Cestas.JPG"
            alt="Regalos Gourmet EkhiTeka"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/25 to-black/10 dark:from-black/90 dark:via-black/75 dark:to-black/50" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4 text-white">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-black rounded-full uppercase tracking-wider shadow-md">
            <Gift className="w-3.5 h-3.5" /> Selección Especial de Regalos
          </span>

          <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight">
            Regalos <span className="text-[#FFE259]">Gourmet</span>
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
            El detalle perfecto con sabor auténtico de Lekeitio. Sorprende con nuestras cestas artesanales, catas guiadas para disfrutar en casa y tarjetas de regalo gourmet.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="https://wa.me/34600000000?text=Hola,%20quisiera%20encargar%20un%20regalo%20gourmet%20personalizado"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Encargo Personalizado por WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Productos generados por el vendedor */}
      {giftProducts.length > 0 && (
        <section className="space-y-6 pt-2">
          <div className="pb-3 border-b border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
              Disponibles para envío o recogida
            </span>
            <h3 className="text-2xl font-black font-serif text-stone-900 dark:text-stone-100 uppercase">
              Cestas & Packs en Tienda
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {giftProducts.map((p) => (
              <ProductCard key={p.id} product={p} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Bloques de Información y Opciones de Regalo */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cestas Gourmet */}
        <div className="group rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div className="relative h-56 overflow-hidden">
              <img
                src="/images/secciones/Cestas.JPG"
                alt="Cestas Gourmet"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                Artesanas
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#C68D07] dark:text-[#FFE259]">
                <Package className="w-5 h-5" />
                <h2 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                  Cestas Gourmet
                </h2>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Selecciones equilibradas de quesos artesanos afinados, bonito del Cantábrico, salazones y maridajes vascos en cajas de madera y estuches de regalo.
              </p>
            </div>
          </div>
          <div className="p-6 pt-0">
            <a
              href="https://wa.me/34600000000?text=Hola,%20quisiera%20información%20sobre%20las%20Cestas%20Gourmet"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-stone-900 dark:text-stone-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>Pedir Cesta a Medida</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Catas en Casa */}
        <div className="group rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div className="relative h-56 overflow-hidden">
              <img
                src="/images/secciones/Catas.JPG"
                alt="Catas en Casa"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                Experiencia
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#C68D07] dark:text-[#FFE259]">
                <Wine className="w-5 h-5" />
                <h2 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                  Catas en Casa
                </h2>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Todo lo necesario para organizar una cata inolvidable en tu salón: tabla de quesos de autor, fichas de cata explicativas y maridajes recomendados.
              </p>
            </div>
          </div>
          <div className="p-6 pt-0">
            <a
              href="https://wa.me/34600000000?text=Hola,%20quisiera%20reservar%20un%20Kit%20de%20Cata%20en%20Casa"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-stone-900 dark:text-stone-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>Reservar Kit de Cata</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Tarjetas Regalo Gourmet */}
        <div className="group rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div className="relative h-56 overflow-hidden">
              <img
                src="/images/secciones/Tienda.JPG"
                alt="Tarjetas Regalo Gourmet"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                100% Flexible
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#C68D07] dark:text-[#FFE259]">
                <CreditCard className="w-5 h-5" />
                <h2 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                  Tarjetas Regalo Gourmet
                </h2>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                El regalo con el que nunca fallas: tarjetas virtuales o físicas canjeables por productos EkhiTeka en tienda física o catálogo online.
              </p>
            </div>
          </div>
          <div className="p-6 pt-0">
            <a
              href="https://wa.me/34600000000?text=Hola,%20quisiera%20comprar%20una%20Tarjeta%20Regalo%20Gourmet"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-stone-900 dark:text-stone-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>Solicitar Tarjeta Regalo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}