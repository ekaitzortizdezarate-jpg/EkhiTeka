import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailAddToCart } from '@/components/ProductDetailAddToCart';
import { getProductImage } from '@/lib/productHelpers';
import type { ProductWithSeller } from '@/types/database';
import {
  ArrowLeft,
  MapPin,
  Truck,
  Store,
  ShieldCheck,
  MessageCircle,
  Ticket,
} from 'lucide-react';

export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: { user } }, { data: product }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('products')
      .select('*, profiles!products_seller_id_fkey(id, full_name, town, avatar_url, phone, role)')
      .eq('id', id)
      .single(),
  ]);

  if (!product) notFound();

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

  // Obtener productos relacionados de la misma categoría
  const { data: relatedData } = await supabase
    .from('products')
    .select('*, profiles!products_seller_id_fkey(id, full_name, town, avatar_url, phone)')
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .eq('is_active', true)
    .limit(4);

  const relatedProducts = (relatedData || []) as unknown as ProductWithSeller[];

  const isEvent =
    product.category_id === 'catas' ||
    product.category_id === 'cata_presencial' ||
    product.category_id === 'experiencia' ||
    product.name.toLowerCase().includes('cata');

  const imageUrl = getProductImage(product);

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Botón Volver */}
      <div>
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 text-xs font-bold font-serif uppercase tracking-wider text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100 transition-colors p-2 rounded-xl bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la selección</span>
        </Link>
      </div>

      {/* Grid Principal del Producto */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Imagen Prémium */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 sm:aspect-square w-full rounded-3xl overflow-hidden border-2 border-stone-200 dark:border-stone-800 bg-[#FAF7F2] dark:bg-stone-850 shadow-lg">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.origin_region && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/80 backdrop-blur-xs text-white text-xs font-black rounded-xl uppercase tracking-wider shadow-md">
                <MapPin className="w-3.5 h-3.5 text-[#FFE259]" />
                <span>{product.origin_region}</span>
              </span>
            )}
            {isEvent && (
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-black rounded-xl uppercase tracking-wider shadow-md">
                <Ticket className="w-3.5 h-3.5" />
                <span>{product.stock} plazas disponibles</span>
              </span>
            )}
          </div>
        </div>

        {/* Información & Checkout */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2 border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259]">
              EkhiTeka Gourmet · Lekeitio
            </span>
            <h1 className="text-2xl sm:text-4xl font-black font-serif text-stone-900 dark:text-stone-100 leading-tight">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold text-stone-500 dark:text-stone-400">
              {product.format && (
                <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  Formato: {product.format}
                </span>
              )}
              {product.weight_g && (
                <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  Peso: {product.weight_g}g
                </span>
              )}
            </div>
          </div>

          {/* Precio y Componente de Compra/Reserva */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black font-serif text-[#1D1D1B] dark:text-stone-100">
                {Number(product.price).toFixed(2)} €
              </span>
              <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                {isEvent ? '/ plaza' : 'IVA incl.'}
              </span>
            </div>

            <ProductDetailAddToCart
              product={product as unknown as ProductWithSeller}
              isSeller={isSeller}
            />
          </div>

          {/* Descripción & Notas de Cata */}
          {product.description && (
            <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <h3 className="text-xs font-black uppercase tracking-wider font-serif text-stone-800 dark:text-stone-200">
                Descripción & Detalles
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Asesoramiento por Chat */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-stone-850 border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-bold font-serif text-stone-900 dark:text-stone-100">
                ¿Tienes alguna duda sobre este producto?
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Consulta directamente con nuestros afinadores y expertos.
              </p>
            </div>
            <Link
              href={`/chat/${product.seller_id}?product_id=${product.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-white dark:text-stone-900 text-xs font-black uppercase tracking-wider transition-all font-serif shrink-0 shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Preguntar</span>
            </Link>
          </div>

          {/* Garantías de Entrega */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-bold text-stone-600 dark:text-stone-400">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <Truck className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
              <span>Frío garantizado 24/48h</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <Store className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
              <span>Recogida en Lekeitio</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <ShieldCheck className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
              <span>Calidad artesanal km0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-stone-200 dark:border-stone-800">
          <div className="pb-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259]">
              Recomendaciones del afinador
            </span>
            <h3 className="text-2xl font-black font-serif text-stone-900 dark:text-stone-100 uppercase">
              También te puede interesar
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}