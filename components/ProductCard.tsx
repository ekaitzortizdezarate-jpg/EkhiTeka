'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { deleteProduct } from '@/app/actions/products';
import { getProductImage } from '@/lib/productHelpers';
import type { ProductWithSeller } from '@/types/database';
import { ShoppingBag, MessageCircle, MapPin, Check, Pencil, Trash2, Calendar, Ticket } from 'lucide-react';

interface ProductCardProps {
  product: ProductWithSeller;
  isSeller?: boolean;
}

export function ProductCard({ product, isSeller = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [added, setAdded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isSoldOut = !product.is_unlimited_stock && (product.stock ?? 0) <= 0;
  const isLowStock = !product.is_unlimited_stock && (product.stock ?? 0) > 0 && (product.stock ?? 0) <= 5;
  const isEvent =
    product.category_id === 'catas' ||
    product.category_id === 'cata_presencial' ||
    product.category_id === 'experiencia' ||
    product.name.toLowerCase().includes('cata');

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;
    addToCart(product, 'EkhiTeka Selección');
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
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

  const sellerName = 'EkhiTeka Gourmet Lekeitio';
  const sellerId = product.seller_id;
  const imageUrl = getProductImage(product);

  return (
    <article
      aria-label={product.name}
      className={`manduca-card group relative bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] dark:hover:border-[#FFE259] shadow-xs flex flex-col justify-between overflow-hidden transition-all duration-300 ${
        isDeleting ? 'opacity-40 pointer-events-none' : ''
      }`}
    >
      {/* 1. Imagen y Badges Superpuestos */}
      <div className="relative aspect-4/3 w-full bg-[#FAF7F2] dark:bg-stone-850 overflow-hidden shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
          }}
        />

        {/* Badge Superior Izquierdo: Origen */}
        {product.origin_region && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-1 bg-[#1D1D1B]/85 dark:bg-black/85 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-black rounded-xl uppercase tracking-wider shadow-xs max-w-[55%] truncate">
            <MapPin className="w-3 h-3 text-[#FFE259] shrink-0" />
            <span className="truncate">{product.origin_region}</span>
          </span>
        )}

        {/* Badge Superior Derecho: Estado de Plazas / Stock / Artesanal */}
        <div className="absolute top-2.5 right-2.5 flex items-center">
          {isSoldOut ? (
            <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] sm:text-[11px] font-black rounded-xl uppercase tracking-wider shadow-md animate-pulse">
              {isEvent ? 'Sin Plazas' : 'Agotado'}
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] sm:text-[11px] font-black rounded-xl uppercase tracking-tight shadow-md">
              {isEvent ? `¡${product.stock} plazas!` : `¡${product.stock} uds!`}
            </span>
          ) : isEvent ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] sm:text-[11px] font-black rounded-xl uppercase tracking-tight shadow-md">
              <Ticket className="w-3 h-3" />
              <span>{product.stock} plazas</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] sm:text-[11px] font-black rounded-xl uppercase tracking-tight shadow-xs">
              Artisau
            </span>
          )}
        </div>

        {/* Badge Inferior Izquierdo: Formato & Peso */}
        <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs text-stone-900 dark:text-stone-100 text-[10px] sm:text-[11px] font-bold rounded-xl uppercase tracking-tight shadow-xs border border-stone-200/80 dark:border-stone-700/80">
          {product.format} {product.weight_g ? `· ${product.weight_g}g` : ''}
        </span>
      </div>

      {/* 2. Cuerpo de Información */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <p className="text-[10px] sm:text-[11px] font-black text-[#C68D07] dark:text-[#FFE259] uppercase tracking-wider truncate">
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

          {/* Descripción completa y legible en todas las resoluciones */}
          {product.description && (
            <p className="text-xs sm:text-[13px] text-stone-600 dark:text-stone-300 leading-relaxed pt-0.5 font-medium whitespace-pre-line line-clamp-4">
              {product.description}
            </p>
          )}
        </div>

        {/* 3. Precio y Botones de Acción */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
          <div className="shrink-0">
            <span className="text-[9px] sm:text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider block">
              {isEvent ? 'Precio / Plaza' : t.prod_price}
            </span>
            <span className="text-base sm:text-xl font-black text-[#1D1D1B] dark:text-stone-100 font-serif">
              {Number(product.price).toFixed(2)} €
            </span>
          </div>

          {isSeller ? (
            /* Botones para Vendedor */
            <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
              <Link
                href={`/vendedor/productos/${product.id}/editar`}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs transition-all shadow-2xs hover:scale-102 font-serif uppercase tracking-wider cursor-pointer"
                title="Editar Producto"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Editar</span>
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                className="p-2 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 transition-colors cursor-pointer border border-red-200 dark:border-red-800"
                title="Eliminar Producto"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Botones para Comprador */
            <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
              <Link
                href={`/chat/${sellerId}?product_id=${product.id}`}
                className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259]/30 text-stone-700 dark:text-stone-300 transition-colors border border-stone-200 dark:border-stone-700 shrink-0"
                title={t.prod_ask_artisan}
              >
                <MessageCircle className="w-4 h-4 text-stone-700 dark:text-stone-200" />
              </Link>

              <button
                type="button"
                disabled={isSoldOut}
                onClick={handleQuickAdd}
                className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95 font-serif cursor-pointer shrink-0 ${
                  isSoldOut
                    ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed shadow-none'
                    : added
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] hover:shadow-md hover:scale-102'
                }`}
              >
                {isSoldOut ? (
                  <span>{isEvent ? 'Sin plazas' : 'Agotado'}</span>
                ) : added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Añadido</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isEvent ? 'Reservar' : t.prod_add_to_cart}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}