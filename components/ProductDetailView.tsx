'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailAddToCart } from '@/components/ProductDetailAddToCart';
import { ProductDescription } from '@/components/ProductDescription';
import {
  getProductImage,
  getProductDiscount,
  getCleanDescription,
  formatProductDescription,
  getTranslatedFormat,
  getTranslatedOrigin,
  getProductWeightOrVolume,
} from '@/lib/productHelpers';
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
  const { t, language } = useLanguage();

  const isEvent =
    product.category_id === 'catas' ||
    product.category_id === 'cata_presencial' ||
    product.category_id === 'experiencia' ||
    (product.name && product.name.toLowerCase().includes('cata'));

  const imageUrl = getProductImage(product);
  const discountInfo = getProductDiscount(product);
  const translatedOrigin = getTranslatedOrigin(product.origin_region, language);
  const translatedFormat = getTranslatedFormat(product.format, language);
  const weightOrVolume = getProductWeightOrVolume(product, language);
  const cleanDescription = formatProductDescription(product.description, language);

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Botón Volver & Info Vendedor */}
      <div className="flex items-center justify-between">
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 text-xs font-bold font-serif uppercase tracking-[0.14em] text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors p-2.5 rounded-2xl bg-[#FAF8F5] hover:bg-stone-100 dark:bg-[#1C1B19] dark:hover:bg-stone-800 border border-[#E8E5DF] dark:border-[#2D2B27] shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 stroke-[1.75]" />
          <span>{t.prod_back_to_selection}</span>
        </Link>

        {isSeller && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] text-stone-700 dark:text-stone-300 text-xs font-bold font-serif uppercase tracking-[0.14em]">
            <UserCheck className="w-4 h-4 stroke-[1.75]" />
            <span>
              {t.seller_last_modified_by}{' '}
              <strong className="font-bold">{product.profiles?.full_name || 'EkhiTeka'}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Grid Principal del Producto */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Imagen del Producto */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-[#E8E5DF] dark:border-[#2D2B27] bg-[#FAF7F2] dark:bg-[#1C1B19] shadow-sm">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
              }}
            />
            {translatedOrigin && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1D1D1B]/90 backdrop-blur-xs text-white text-xs font-bold rounded-xl uppercase tracking-[0.14em] shadow-md font-serif">
                <MapPin className="w-3.5 h-3.5 text-stone-300 stroke-[1.75]" />
                <span>{translatedOrigin}</span>
              </span>
            )}
            {isEvent && (
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-bold rounded-xl uppercase tracking-[0.14em] shadow-md font-serif">
                <Ticket className="w-3.5 h-3.5 stroke-[1.75]" />
                <span>{product.stock} {t.event_seats_available}</span>
              </span>
            )}
          </div>
        </div>

        {/* Información & Checkout */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2 border-b border-[#E8E5DF] dark:border-[#2D2B27] pb-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 font-serif">
              EkhiTeka Gourmet · Lekeitio
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-stone-900 dark:text-stone-100 leading-tight">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold text-stone-500 dark:text-stone-400 font-serif">
              {translatedFormat && (
                <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1F1E1C] text-stone-700 dark:text-stone-300 border border-[#E8E5DF] dark:border-[#2D2B27] uppercase tracking-[0.12em]">
                  {t.prod_format_label}: {translatedFormat}
                </span>
              )}
              {weightOrVolume && (
                <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1F1E1C] text-stone-700 dark:text-stone-300 border border-[#E8E5DF] dark:border-[#2D2B27] uppercase tracking-[0.12em]">
                  {t.prod_weight_label}: {weightOrVolume}
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
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white font-black text-sm uppercase tracking-[0.14em] font-serif shadow-md border border-emerald-700 dark:border-emerald-400">
                  <Percent className="w-4 h-4 stroke-[2.2]" />
                  <span>-{discountInfo.discountPercent}% {language === 'eu' ? 'Deskontua' : language === 'fr' ? 'Remise' : language === 'en' ? 'Discount' : 'Descuento'}</span>
                </span>
              )}

              <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-[0.14em] font-serif ml-auto">
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
            <div className="space-y-3 pt-3 border-t border-[#E8E5DF] dark:border-[#2D2B27]">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] font-serif text-stone-900 dark:text-stone-100">
                {isEvent ? t.event_details_title : t.prod_details}
              </h3>
              <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27]">
                <ProductDescription description={product.description} language={language} />
              </div>
            </div>
          )}

          {/* Caja de Consultas por Chat */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27] flex items-center justify-between gap-4 font-serif">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-stone-900 dark:text-[#F5F5F0]">
                {t.prod_doubt_title}
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {t.prod_doubt_desc}
              </p>
            </div>
            <Link
              href={`/chat/${product.seller_id || ''}?product_id=${product.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] text-xs font-bold uppercase tracking-[0.14em] transition-all font-serif shrink-0 shadow-2xs hover:scale-[1.01]"
            >
              <MessageCircle className="w-4 h-4 stroke-[1.75]" />
              <span>{t.prod_ask_btn}</span>
            </Link>
          </div>

          {/* Garantías */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-bold text-stone-700 dark:text-stone-300 font-serif">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27]">
              <Truck className="w-4 h-4 text-stone-700 dark:text-stone-300 stroke-[1.75] shrink-0" />
              <span>{t.prod_guarantee_cold}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27]">
              <Store className="w-4 h-4 text-stone-700 dark:text-stone-300 stroke-[1.75] shrink-0" />
              <span>{t.prod_guarantee_pickup}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B19] border border-[#E8E5DF] dark:border-[#2D2B27]">
              <ShieldCheck className="w-4 h-4 text-stone-700 dark:text-stone-300 stroke-[1.75] shrink-0" />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
