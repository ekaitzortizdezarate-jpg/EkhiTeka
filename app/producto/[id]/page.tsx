import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { ProductWithSeller } from '@/types/database';
import { ShoppingBag, MessageCircle, MapPin, Store, Truck, ArrowLeft, Sparkles, ShieldCheck, Pencil, Trash2 } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailAddToCart } from '@/components/ProductDetailAddToCart';
import { deleteProduct } from '@/app/actions/products';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: { user } }, { data: productData, error }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('products')
      .select('*, profiles!products_seller_id_fkey(id, full_name, town, address, avatar_url, phone, bio)')
      .eq('id', id)
      .eq('is_active', true)
      .single(),
  ]);

  if (error || !productData) {
    notFound();
  }

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
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Botón Volver */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-black text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a la Quesería & Selección</span>
      </Link>

      {/* Ficha Principal de Producto (La Manducateca style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 p-6 sm:p-10 lg:p-12 shadow-sm">
        {/* Imagen */}
        <div className="relative aspect-4/3 sm:aspect-square w-full rounded-3xl bg-[#FAF7F2] dark:bg-stone-850 overflow-hidden border border-stone-200/80 dark:border-stone-800">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl bg-[#FFE259]/20 text-[#1D1D1B] dark:text-[#FFE259]">
              🧀
            </div>
          )}

          {product.origin_region && (
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1D1D1B]/80 backdrop-blur-xs text-white text-xs font-black rounded-xl uppercase tracking-wider shadow-md">
              <MapPin className="w-3.5 h-3.5 text-[#FFE259]" />
              {product.origin_region}
            </span>
          )}

          <span className="absolute top-4 right-4 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black rounded-xl uppercase tracking-tight shadow-md">
            Selección EkhiTeka
          </span>
        </div>

        {/* Detalles */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-xs font-black text-[#C68D07] dark:text-[#FFE259] uppercase tracking-widest block">
                {product.category_id.toUpperCase()} · {product.format}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 leading-tight font-serif sm:font-sans">
                {product.name}
              </h1>
            </div>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl sm:text-4xl font-black text-[#1D1D1B] dark:text-stone-100">
                {Number(product.price).toFixed(2)} €
              </span>
              <span className="text-xs font-bold text-stone-500">
                / {product.format} {product.weight_g ? `(${product.weight_g}g aprox.)` : ''}
              </span>
            </div>

            {product.description && (
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed pt-2 font-medium">
                {product.description}
              </p>
            )}

            {/* Ficha Artesano */}
            {seller && (
              <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">
                  Elaborado por:
                </span>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#FFE259] text-[#1D1D1B] font-black flex items-center justify-center border border-stone-900/10 shrink-0">
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
                        {seller.town || 'Lekeitio'}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/chat/${seller.id}?product_id=${product.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-black shadow-2xs transition-all shrink-0"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#FFE259]" />
                    <span>Preguntar al Maestro</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Botón interactivo de añadir a la cesta o Editar para Vendedor */}
            {isSeller ? (
              <div className="pt-2">
                <Link
                  href={`/vendedor/productos/${product.id}/editar`}
                  className="w-full py-3.5 px-5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 hover:scale-101"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Editar Producto</span>
                </Link>
              </div>
            ) : (
              <ProductDetailAddToCart product={product} />
            )}

            {/* Garantías de Envío */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-400">
                <Truck className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
                <span>Envío refrigerado 24/48h</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-400">
                <Store className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
                <span>Recogida en tienda Lekeitio</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos Relacionados */}
      {related.length > 0 && (
        <div className="space-y-6 pt-6">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
              Maridajes y sugerencias
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 uppercase">
              También te puede gustar
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((rel) => (
              <ProductCard key={rel.id} product={rel} isSeller={isSeller} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

