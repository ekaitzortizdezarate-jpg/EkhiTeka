'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { deleteProduct } from '@/app/actions/products';
import { getProductImage } from '@/lib/productHelpers';
import type { ProductWithSeller } from '@/types/database';
import { ShoppingBag, MessageCircle, MapPin, Sparkles, Check, Pencil, Trash2 } from 'lucide-react';

interface ProductCardProps {
  product: ProductWithSeller;
  isSeller?: boolean;
}

export function ProductCard({ product, isSeller = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [added, setAdded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    <article aria-label={product.name} className={`manduca-card group relative bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] dark:hover:border-[#FFE259] shadow-xs flex flex-col overflow-hidden ${isDeleting ? 'opacity-40 pointer-events-none' : ''}`}>
      {/* 1. Imagen y Badges */}
      <div className="relative aspect-4/3 w-full bg-[#FAF7F2] dark:bg-stone-850 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
          }}
        />

        {/* Badge de Origen */}
        {product.origin_region && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1D1D1B]/80 backdrop-blur-xs text-white text-[10px] font-black rounded-xl uppercase tracking-wider shadow-xs">
            <MapPin className="w-3 h-3 text-[#FFE259]" />
            {product.origin_region}
          </span>
        )}

        {/* Badge de Selección Artesana */}
        <span className="absolute top-3 right-3 px-2 py-0.5 bg-[#FFE259] text-[#1D1D1B] text-[9px] font-black rounded-lg uppercase tracking-tight shadow-xs">
          Artisau
        </span>

        {/* Badge de Formato */}
        <span className="absolute bottom-3 left-3 px-2.5 py-0.5 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs text-stone-900 dark:text-stone-100 text-[10px] font-bold rounded-lg uppercase tracking-tight shadow-xs border border-stone-200/60 dark:border-stone-700/60">
          {product.format} {product.weight_g ? `· ${product.weight_g}g` : ''}
        </span>
      </div>

      {/* 2. Información del Producto */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <p className="text-[11px] font-black text-[#C68D07] dark:text-[#FFE259] uppercase tracking-wider truncate">
            {sellerName}
          </p>
          <Link href={`/producto/${product.id}`} className="block group-hover:text-[#C68D07] dark:group-hover:text-[#FFE259] transition-colors">
            <h2 className="font-black text-stone-900 dark:text-stone-100 text-sm sm:text-base leading-snug line-clamp-2">
              {product.name}
            </h2>
          </Link>
          {product.description && (
            <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed pt-0.5 font-medium">
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
            <span className="text-base sm:text-lg font-black text-[#1D1D1B] dark:text-stone-100">
              {Number(product.price).toFixed(2)} €
            </span>
          </div>

          {isSeller ? (
            /* Botones de gestión para el Vendedor de EkhiTeka */
            <div className="flex items-center gap-1.5">
              <Link
                href={`/vendedor/productos/${product.id}/editar`}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs transition-all shadow-2xs hover:scale-102"
                title="Editar Producto"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Editar</span>
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                className="p-2 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 transition-colors cursor-pointer"
                title="Eliminar Producto"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Botones normales para Compradores */
            <div className="flex items-center gap-1.5">
              <Link
                href={`/chat/${sellerId}?product_id=${product.id}`}
                className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259]/30 text-stone-700 dark:text-stone-300 transition-colors border border-stone-200 dark:border-stone-700"
                title={t.prod_ask_artisan}
              >
                <MessageCircle className="w-4 h-4 text-stone-700 dark:text-stone-200" />
              </Link>

              <button
                type="button"
                onClick={handleQuickAdd}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl font-black text-xs transition-all shadow-xs active:scale-95 cursor-pointer ${
                  added
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] hover:shadow-md hover:scale-102'
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
                    <span className="hidden sm:inline font-bold">{t.prod_add_to_cart}</span>
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
