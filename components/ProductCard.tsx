'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { getProductImage } from '@/lib/productHelpers';
import type { ProductWithSeller } from '@/types/database';
import { ShoppingBag, Ticket, MapPin, Eye } from 'lucide-react';

interface ProductCardProps {
  product: ProductWithSeller;
  isSeller?: boolean;
}

export function ProductCard({ product, isSeller = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const isSoldOut = !product.is_unlimited_stock && (product.stock ?? 0) <= 0;
  const isEvent =
    product.category_id === 'catas' ||
    product.category_id === 'cata_presencial' ||
    product.category_id === 'experiencia' ||
    product.name.toLowerCase().includes('cata');

  const imageUrl = getProductImage(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;
    addToCart(product, product.profiles?.full_name || 'EkhiTeka Selección');
  };

  return (
    <Link
      href={`/producto/${product.id}`}
      className="manduca-card group relative bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] dark:hover:border-[#FFE259] p-4 flex flex-col justify-between shadow-xs transition-all font-serif overflow-hidden"
    >
      <div className="space-y-3">
        {/* Imagen del Producto */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
            }}
          />

          {/* Badge de Evento o Stock */}
          {isSoldOut ? (
            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-md font-sans">
              {isEvent ? t.event_capacity_full : t.prod_sold_out}
            </span>
          ) : !product.is_unlimited_stock && (product.stock ?? 0) <= 5 ? (
            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-amber-500 text-stone-900 text-[10px] font-black uppercase tracking-wider rounded-full shadow-md font-sans">
              {isEvent ? t.event_last_seats : t.prod_last_units}
            </span>
          ) : null}
        </div>

        {/* Datos del Producto */}
        <div className="space-y-1">
          {product.origin_region && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 flex items-start gap-1 font-sans break-words">
              <MapPin className="w-3 h-3 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
              {product.origin_region}
            </span>
          )}

          <h3 className="font-serif font-black text-sm sm:text-base text-stone-900 dark:text-stone-100 break-words group-hover:text-[#C68D07] dark:group-hover:text-[#FFE259] transition-colors">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-xs text-stone-500 dark:text-stone-400 break-words whitespace-pre-line font-sans font-medium">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Precio y Botón */}
      <div className="pt-3 mt-2 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="font-serif font-black text-base sm:text-lg text-stone-900 dark:text-stone-100 block leading-none">
            {Number(product.price).toFixed(2)} €
          </span>
          <span className="text-[9.5px] font-sans font-semibold text-stone-400">
            {isEvent ? t.prod_price_per_seat : t.prod_vat_included}
          </span>
        </div>

        {!isSeller ? (
          <button
            type="button"
            disabled={isSoldOut}
            onClick={handleAddToCart}
            className={`p-2.5 rounded-xl font-bold transition-all flex items-center justify-center cursor-pointer ${
              isSoldOut
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                : 'bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] shadow-xs hover:scale-105'
            }`}
            title={isEvent ? t.event_reserve_seat : t.prod_add_to_cart}
          >
            {isEvent ? <Ticket className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        ) : (
          <span className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500">
            <Eye className="w-4 h-4" />
          </span>
        )}
      </div>
    </Link>
  );
}
