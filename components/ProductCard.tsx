'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import type { ProductWithSeller } from '@/types/database';
import { ShoppingBag, MessageCircle, MapPin, Sparkles, Check } from 'lucide-react';

interface ProductCardProps {
  product: ProductWithSeller;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.profiles?.full_name);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const sellerName = product.profiles?.full_name || 'EkhiTeka Selección';
  const sellerId = product.seller_id;

  return (
    <article aria-label={product.name} className="group relative bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
      {/* 1. Imagen y Badges */}
      <div className="relative aspect-4/3 w-full bg-stone-100 dark:bg-stone-850 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600">
            🧀
          </div>
        )}

        {/* Badge de Origen */}
        {product.origin_region && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 bg-black/70 backdrop-blur-xs text-white text-[10px] font-black rounded-xl uppercase tracking-wider shadow-xs">
            <MapPin className="w-3 h-3 text-amber-400" />
            {product.origin_region}
          </span>
        )}

        {/* Badge de Formato */}
        <span className="absolute bottom-3 left-3 px-2.5 py-0.5 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xs text-stone-900 dark:text-stone-100 text-[10px] font-bold rounded-lg uppercase tracking-tight shadow-xs border border-stone-200/50 dark:border-stone-700/50">
          {product.format} {product.weight_g ? `· ${product.weight_g}g` : ''}
        </span>
      </div>

      {/* 2. Información del Producto */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 truncate">
            {sellerName}
          </p>
          <Link href={`/producto/${product.id}`} className="block group-hover:text-amber-600 transition-colors">
            <h2 className="font-black text-stone-900 dark:text-stone-100 text-sm sm:text-base leading-snug line-clamp-2">
              {product.name}
            </h2>
          </Link>
          {product.description && (
            <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed pt-0.5">
              {product.description}
            </p>
          )}
        </div>

        {/* 3. Precio y Botones de Acción */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              {t.prod_price}
            </span>
            <span className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100">
              {Number(product.price).toFixed(2)} €
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Botón de Consulta por Chat */}
            <Link
              href={`/chat/${sellerId}?product_id=${product.id}`}
              className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors border border-stone-200 dark:border-stone-700"
              title={t.prod_ask_artisan}
            >
              <MessageCircle className="w-4 h-4" />
            </Link>

            {/* Botón de Añadir a Cesta */}
            <button
              type="button"
              onClick={handleQuickAdd}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl font-black text-xs transition-all shadow-xs active:scale-95 cursor-pointer ${
                added
                  ? 'bg-emerald-700 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white hover:scale-102'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Añadido</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.prod_add_to_cart}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
