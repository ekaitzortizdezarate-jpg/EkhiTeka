'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailAddToCart } from '@/components/ProductDetailAddToCart';
import { getProductImage, getProductDiscount, getCleanDescription, formatEventDescription } from '@/lib/productHelpers';
import type { ProductWithSeller } from '@/types/database';
import {
  ArrowLeft,
  MapPin,
  Truck,
  Store,
  ShieldCheck,
  MessageCircle,
  Ticket,
  UserCheck,
  Percent,
} from 'lucide-react';

interface ProductDetailViewProps {
  product: ProductWithSeller;
  relatedProducts: ProductWithSeller[];
  isSeller: boolean;
}

export function ProductDetailView({
  product,
  relatedProducts,
  isSeller,
}: ProductDetailViewProps) {
  const { t } = useLanguage();

  const isEvent =
    product.category_id === 'catas' ||
    product.category_id === 'cata_presencial' ||
    product.category_id === 'experiencia' ||
    (product.name && product.name.toLowerCase().includes('cata'));

  const imageUrl = getProductImage(product);
  const discountInfo = getProductDiscount(product);
  const cleanDescription = isEvent
    ? formatEventDescription(product.description, {
        date: t.event_field_date,
        time: t.event_field_time,
        seats: t.event_field_seats,
        itemsToTaste: t.event_field_items_to_taste,
      })
    : getCleanDescription(product.description);

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Botón Volver & Info Vendedor */}
      <div className="flex items-center justify-between">
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 text-xs font-bold font-serif uppercase tracking-wider text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-[#1F1E1C] dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.prod_back_to_selection}</span>
        </Link>

        {isSeller && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 text-xs font-bold font-sans">
            <UserCheck className="w-4 h-4" />
            <span>
              Última edición por: <strong className="font-black">{product.profiles?.full_name || 'Vendedor EkhiTeka'}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Grid Principal del Producto */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Imagen del Producto */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border-2 border-stone-200 dark:border-stone-800 bg-[#FAF7F2] dark:bg-[#1C1B19] shadow-lg">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
              }}
            />
            {product.origin_region && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/80 backdrop-blur-xs text-white text-xs font-black rounded-xl uppercase tracking-wider shadow-md font-sans">
                <MapPin className="w-3.5 h-3.5 text-[#FFE259]" />
                <span>{product.origin_region}</span>
              </span>
            )}
            {isEvent && (
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-black rounded-xl uppercase tracking-wider shadow-md font-sans">
                <Ticket className="w-3.5 h-3.5" />
                <span>{product.stock} {t.event_seats_available}</span>
              </span>
            )}
          </div>
        </div>

        {/* Información & Checkout */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2 border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] font-serif">
              EkhiTeka Gourmet · Lekeitio
            </span>
            <h1 className="text-2xl sm:text-4xl font-black font-serif text-stone-900 dark:text-stone-100 leading-tight">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold text-stone-500 dark:text-stone-400 font-sans">
              {product.format && (
                <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1F1E1C] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                  {t.prod_format_label}: {product.format}
                </span>
              )}
              {product.weight_g && (
                <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1F1E1C] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                  {t.prod_weight_label}: {product.weight_g}g
                </span>
              )}
            </div>
          </div>

          {/* Precio y Añadir a la Cesta */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black font-serif text-[#1D1D1B] dark:text-[#F5F5F0]">
                {Number(product.price).toFixed(2)} €
              </span>

              {discountInfo && discountInfo.originalPrice && discountInfo.originalPrice > Number(product.price) && (
                <span className="text-lg text-stone-400 line-through font-serif font-bold">
                  {discountInfo.originalPrice.toFixed(2)} €
                </span>
              )}

              {discountInfo && discountInfo.discountPercent > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-black text-xs uppercase tracking-wider font-sans">
                  <Percent className="w-3.5 h-3.5" />
                  <span>{discountInfo.discountPercent}% Descuento</span>
                </span>
              )}

              <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider font-sans ml-auto">
                {isEvent ? t.prod_price_per_seat : t.prod_vat_included}
              </span>
            </div>

            <ProductDetailAddToCart
              product={product}
              isSeller={isSeller}
            />
          </div>

          {/* Descripción & Notas de Cata */}
          {cleanDescription && (
            <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <h3 className="text-xs font-black uppercase tracking-wider font-serif text-stone-800 dark:text-stone-200">
                {isEvent ? t.event_details_title : t.prod_details}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans whitespace-pre-line">
                {cleanDescription}
              </p>
            </div>
          )}

          {/* Caja de Consultas por Chat */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-bold font-serif text-stone-900 dark:text-[#F5F5F0]">
                {t.prod_doubt_title}
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans">
                {t.prod_doubt_desc}
              </p>
            </div>
            <Link
              href={`/chat/${product.seller_id || ''}?product_id=${product.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] text-xs font-black uppercase tracking-wider transition-all font-serif shrink-0 shadow-xs hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.prod_ask_btn}</span>
            </Link>
          </div>

          {/* Garantías */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-bold text-stone-600 dark:text-stone-400 font-sans">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-800">
              <Truck className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
              <span>{t.prod_guarantee_cold}</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-800">
              <Store className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
              <span>{t.prod_guarantee_pickup}</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-800">
              <ShieldCheck className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
              <span>{t.prod_guarantee_km0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Productos Relacionados */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-stone-200 dark:border-stone-800 font-serif">
          <div className="pb-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259]">
              {t.prod_related_subtitle}
            </span>
            <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 uppercase">
              {t.prod_related_title}
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
