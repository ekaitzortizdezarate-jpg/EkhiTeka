import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { ProductWithSeller } from '@/types/database';
import { ShoppingBag, MessageCircle, MapPin, Store, Truck, ArrowLeft, ShieldCheck } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: productData, error } = await supabase
    .from('products')
    .select('*, profiles!products_seller_id_fkey(id, full_name, town, address, avatar_url, phone, bio)')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error || !productData) {
    notFound();
  }

  const product = productData as unknown as ProductWithSeller;

  // Productos relacionados de la misma categoría
  const { data: relatedData } = await supabase
    .from('products')
    .select('*, profiles!products_seller_id_fkey(id, full_name, town, avatar_url)')
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .eq('is_active', true)
    .limit(4);

  const related = (relatedData || []) as unknown as ProductWithSeller[];
  const seller = product.profiles;

  return (
    <div className="space-y-12">
      {/* Botón Volver */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Catálogo</span>
      </Link>

      {/* Ficha Principal de Producto (La Manducateca style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-10 shadow-sm">
        {/* Imagen */}
        <div className="relative aspect-4/3 sm:aspect-square w-full rounded-2xl bg-stone-100 dark:bg-stone-850 overflow-hidden border border-stone-200 dark:border-stone-800">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl bg-amber-500/10 text-amber-600">
              🧀
            </div>
          )}

          {product.origin_region && (
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/75 backdrop-blur-xs text-white text-xs font-black rounded-xl uppercase tracking-wider shadow-md">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {product.origin_region}
            </span>
          )}
        </div>

        {/* Detalles */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block">
                {product.category_id.toUpperCase()} · {product.format}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-amber-950 dark:text-amber-300">
                {Number(product.price).toFixed(2)} €
              </span>
              <span className="text-xs font-bold text-stone-500">
                / {product.format} {product.weight_g ? `(${product.weight_g}g aprox.)` : ''}
              </span>
            </div>

            {product.description && (
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed pt-2">
                {product.description}
              </p>
            )}

            {/* Ficha Artesano */}
            {seller && (
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">
                  Elaborado por:
                </span>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 font-black flex items-center justify-center border border-amber-500/30 shrink-0">
                      {seller.avatar_url ? (
                        <img src={seller.avatar_url} alt={seller.full_name} className="w-full h-full rounded-xl object-cover" />
                      ) : (
                        seller.full_name.charAt(0)
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="font-black text-xs text-stone-900 dark:text-stone-100 block truncate">
                        {seller.full_name}
                      </span>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 block truncate">
                        {seller.town || 'Bilbao'}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/chat/${seller.id}?product_id=${product.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-2xs transition-all shrink-0"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Preguntar al Artesano</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Garantías de Envío */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
                <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Envío refrigerado 24/48h</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
                <Store className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Recogida en tienda</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos Relacionados */}
      {related.length > 0 && (
        <div className="space-y-4 pt-6">
          <h2 className="text-lg font-black text-stone-900 dark:text-stone-100">
            También te puede gustar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
