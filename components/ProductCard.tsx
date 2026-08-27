'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { deleteProduct } from '@/app/actions/products';
import { getProductImage, getProductDiscount, getCleanDescription, formatEventDescription } from '@/lib/productHelpers';
import type { ProductWithSeller } from '@/types/database';
import { ShoppingBag, Ticket, MapPin, Pencil, Trash2, Check, MessageCircle } from 'lucide-react';

interface ProductCardProps {
  product: ProductWithSeller;
  isSeller?: boolean;
}

export function ProductCard({ product, isSeller = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isUnlimited = Boolean(
    product.is_unlimited_stock ||
    product.stock === null ||
    product.stock === undefined ||
    (typeof product.stock === 'number' && product.stock >= 900)
  );

  const isSoldOut = !isUnlimited && (product.stock ?? 0) <= 0;
  const isLowStock = !isUnlimited && (product.stock ?? 0) <= 5 && (product.stock ?? 0) > 0;
  const maxStock = isUnlimited ? 99 : Math.max(1, product.stock ?? 1);
  const isEvent =
    product.category_id === 'catas' ||
    product.category_id === 'cata_presencial' ||
    product.category_id === 'experiencia' ||
    product.name.toLowerCase().includes('cata');

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

  const sellerName = product.profiles?.full_name || 'EkhiTeka Gourmet Lekeitio';
  const sellerId = product.seller_id;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut || quantity <= 0) return;
    addToCart(product, sellerName, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuantity(1);
    }, 1500);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`¿Eliminar "${product.name}" del catálogo de EkhiTeka?`)) {
      setIsDeleting(true);
      await deleteProduct(product.id);
      window.location.reload();
    }
  };

  return (
    <article
      aria-label={product.name}
      className={`manduca-card group relative bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] dark:hover:border-[#FFE259] shadow-xs flex flex-col justify-between overflow-hidden transition-all duration-300 font-serif ${
        isDeleting ? 'opacity-40 pointer-events-none' : ''
      }`}
    >
      {/* 1. Imagen del Producto con Aspect Ratio 4:3 */}
      <div className="relative aspect-4/3 w-full bg-[#FAF7F2] dark:bg-stone-850 overflow-hidden shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
          }}
        />

        {/* Origen (Top Left) */}
        {product.origin_region && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-1 bg-[#1D1D1B]/85 dark:bg-black/85 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-black rounded-xl uppercase tracking-wider shadow-xs max-w-[55%] truncate font-sans">
            <MapPin className="w-3 h-3 text-[#FFE259] shrink-0" />
            <span className="truncate">{product.origin_region}</span>
          </span>
        )}

        {/* Stock Badge (Top Right) */}
        <div className="absolute top-2.5 right-2.5 flex items-center font-sans">
          {isSoldOut ? (
            <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] sm:text-[11px] font-black rounded-xl uppercase tracking-wider shadow-md animate-pulse">
              {isEvent ? (t.event_capacity_full || 'Sin Plazas') : t.prod_sold_out}
            </span>
          ) : isUnlimited ? (
            <span className="px-2.5 py-1 bg-[#1D1D1B]/85 dark:bg-black/85 backdrop-blur-xs text-amber-300 border border-amber-400/30 text-[10px] sm:text-[11px] font-black rounded-xl uppercase tracking-tight shadow-md">
              Stock: {t.prod_unlimited}
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] sm:text-[11px] font-black rounded-xl uppercase tracking-tight shadow-md">
              {isEvent ? `¡${product.stock} plazas!` : `¡${product.stock} uds!`}
            </span>
          ) : isEvent ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] sm:text-[11px] font-black rounded-xl uppercase tracking-tight shadow-md">
              <Ticket className="w-3 h-3" />
              <span>{product.stock} {t.event_seats}</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] sm:text-[11px] font-black rounded-xl uppercase tracking-tight shadow-xs">
              {product.stock} uds
            </span>
          )}
        </div>

        {/* Formato y Peso (Bottom Left) */}
        {(product.format || product.weight_g) && (
          <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs text-stone-900 dark:text-stone-100 text-[10px] sm:text-[11px] font-bold rounded-xl uppercase tracking-tight shadow-xs border border-stone-200/80 dark:border-stone-700/80 font-sans">
            {product.format} {product.weight_g ? `· ${product.weight_g}g` : ''}
          </span>
        )}

        {/* Badge de Descuento (Bottom Right) */}
        {discountInfo && discountInfo.discountPercent > 0 && !isSoldOut && (
          <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-emerald-600 text-white text-[10.5px] font-black rounded-xl shadow-md font-sans">
            -{discountInfo.discountPercent}%
          </span>
        )}
      </div>

      {/* 2. Cuerpo con Datos del Producto */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <p className="text-[10px] sm:text-[11px] font-black text-[#C68D07] dark:text-[#FFE259] uppercase tracking-wider truncate font-sans">
            {sellerName}
          </p>

          <Link
            href={`/producto/${product.id}`}
            className="block group-hover:text-[#C68D07] dark:group-hover:text-[#FFE259] transition-colors"
          >
            <h2 className="font-serif font-black text-stone-900 dark:text-stone-100 text-base sm:text-lg leading-snug break-words">
              {product.name}
            </h2>
          </Link>

          {cleanDescription && (
            <p className="text-xs sm:text-[13px] text-stone-600 dark:text-stone-300 leading-relaxed pt-0.5 font-medium whitespace-pre-line line-clamp-3 font-sans">
              {cleanDescription}
            </p>
          )}
        </div>

        {/* 3. Footer con Precio, Selector y Botón Principal Abajo */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 space-y-3">
          {/* Fila 1: Precio y Selector de Cantidad / Chat */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="shrink-0">
              <span className="text-[9px] sm:text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider block font-sans">
                {isEvent ? (t.prod_price_per_seat || 'Precio / Plaza') : t.prod_price}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-xl font-black text-[#1D1D1B] dark:text-stone-100 font-serif">
                  {Number(product.price).toFixed(2)} €
                </span>
                {discountInfo && discountInfo.originalPrice && discountInfo.originalPrice > Number(product.price) && (
                  <span className="text-[11px] text-stone-400 line-through font-serif font-semibold">
                    {discountInfo.originalPrice.toFixed(2)} €
                  </span>
                )}
              </div>
            </div>

            {isSeller ? (
              <span className="px-2.5 py-1.5 rounded-xl text-xs font-black bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 font-sans">
                Stock: {isUnlimited ? t.prod_unlimited : `${product.stock ?? 0} uds`}
              </span>
            ) : (
              <div className="flex items-center gap-1.5">
                {/* Selector de Cantidad */}
                {!isSoldOut && (
                  <div className="flex items-center rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-0.5 shadow-2xs font-serif">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuantity((q) => Math.max(1, q - 1));
                      }}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-30 cursor-pointer text-xs"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-xs font-black text-stone-900 dark:text-stone-100">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= maxStock}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuantity((q) => Math.min(maxStock, q + 1));
                      }}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-30 cursor-pointer text-xs"
                    >
                      +
                    </button>
                  </div>
                )}

                <Link
                  href={`/chat/${sellerId || ''}?product_id=${product.id}`}
                  className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259]/30 text-stone-700 dark:text-stone-300 transition-colors border border-stone-200 dark:border-stone-700 shrink-0"
                  title={t.prod_ask_artisan}
                >
                  <MessageCircle className="w-4 h-4 text-stone-700 dark:text-stone-200" />
                </Link>
              </div>
            )}
          </div>

          {/* Fila 2: Botón Principal Abajo a Ancho Completo */}
          {isSeller ? (
            <div className="w-full flex items-center gap-2">
              <Link
                href={`/vendedor/productos/${product.id}/editar`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs transition-all shadow-2xs hover:scale-[1.01] font-serif uppercase tracking-wider cursor-pointer text-center"
                title="Editar Producto"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Editar variables</span>
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                className="p-2.5 rounded-2xl bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 transition-colors cursor-pointer border border-red-200 dark:border-red-800 shrink-0"
                title="Eliminar Producto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isSoldOut}
              onClick={handleAddToCart}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-xs active:scale-98 font-serif cursor-pointer ${
                isSoldOut
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed shadow-none'
                  : added
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] hover:shadow-md hover:scale-[1.01]'
              }`}
              title={isEvent ? t.event_reserve_seat : t.prod_add_to_cart}
            >
              {isSoldOut ? (
                <span>{isEvent ? (t.event_capacity_full || 'Sin plazas') : t.prod_sold_out}</span>
              ) : added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.prod_added}</span>
                </>
              ) : (
                <>
                  {isEvent ? <Ticket className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  <span>{isEvent ? t.event_reserve_seat : t.prod_add_to_cart}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
