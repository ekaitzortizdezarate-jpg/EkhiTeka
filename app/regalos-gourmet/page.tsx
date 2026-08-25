import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/ProductCard';
import type { ProductWithSeller } from '@/types/database';
import {
  Gift,
  Sparkles,
  Package,
  CreditCard,
  MessageCircle,
  Truck,
  HeartHandshake,
} from 'lucide-react';

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

  // Filtrar productos relacionados con regalos, cestas, packs y tarjetas
  const giftProducts = allProducts.filter((p) => {
    const cat = (p.category_id || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();

    return (
      cat === 'cesta' ||
      cat === 'tarjeta_regalo' ||
      cat === 'regalos_gourmet' ||
      cat === 'pack' ||
      name.includes('regalo') ||
      name.includes('cesta') ||
      name.includes('pack') ||
      name.includes('lote') ||
      name.includes('tarjeta') ||
      desc.includes('regalo') ||
      desc.includes('cesta')
    );
  });

  return (
    <div className="space-y-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 1. Hero Editorial Regalos Gourmet */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border-2 border-stone-800 shadow-2xl min-h-[380px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/secciones/Regalos.JPG"
            alt="Regalos Gourmet EkhiTeka"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/30 to-black/10 dark:from-black/90 dark:via-black/75 dark:to-black/50" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4 text-white">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-black rounded-full uppercase tracking-wider shadow-md">
            <Sparkles className="w-3.5 h-3.5" /> Selección Exclusiva para Regalar
          </span>

          <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight">
            Regalos <span className="text-[#FFE259]">Gourmet</span>
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
            Sorprende con cestas artesanales a medida, estuches de quesos afinados, maridajes de autor y tarjetas regalo para ocasiones inolvidables.
          </p>

          {!isSeller && (
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="https://wa.me/34600000000?text=Hola,%20quisiera%20encargar%20un%20regalo%20gourmet%20personalizado"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 font-serif"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Encargo Personalizado por WhatsApp</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* 2. Tres Bloques de Experiencias de Regalo */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cestas a Medida */}
        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between hover:border-[#FFE259] transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
              <Package className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
              Cestas Gourmet a Medida
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              Diseñamos cestas artesanales combinando cuñas afinadas, conservas selectas del Cantábrico, txakoli y dulces vascos según tu presupuesto.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
            <span>Envío refrigerado con tarjeta dedicatoria</span>
          </div>
        </div>

        {/* Packs Degustación */}
        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between hover:border-[#FFE259] transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
              <Gift className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
              Packs Degustación & Maridaje
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              Estuches temáticos preparados para abrir y disfrutar: selecciones de quesos por intensidad con confituras artesanas, nueces y picos gourmet.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
            <span>Presentación en caja prémium de madera</span>
          </div>
        </div>

        {/* Tarjetas Regalo */}
        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between hover:border-[#FFE259] transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
              Tarjetas & Catas de Regalo
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              El obsequio perfecto para que elijan sus quesos preferidos o disfruten de una cata guiada presencial en nuestra quesería de Lekeitio.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
            <span>Válido online y en tienda física</span>
          </div>
        </div>
      </section>

      {/* 3. Catálogo de Packs y Regalos Disponibles */}
      {giftProducts.length > 0 && (
        <section className="space-y-6 pt-2">
          <div className="pb-3 border-b border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259]">
              Disponibles para envío o recogida
            </span>
            <h3 className="text-2xl font-black font-serif text-stone-900 dark:text-stone-100 uppercase">
              Cestas & Packs Listos para Regalar
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {giftProducts.map((product) => (
              <ProductCard key={product.id} product={product} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}