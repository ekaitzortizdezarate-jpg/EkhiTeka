'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import type { ProductWithSeller } from '@/types/database';
import { ShoppingBag, Check, Pencil, Ticket } from 'lucide-react';

interface ProductDetailAddToCartProps {
  product: ProductWithSeller;
  isSeller?: boolean;
}

export function ProductDetailAddToCart({
  product,
  isSeller = false,
}: ProductDetailAddToCartProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isUnlimited = Boolean(
    product.is_unlimited_stock ||
    product.stock === null ||
    product.stock === undefined ||
    (typeof product.stock === 'number' && product.stock >= 900)
  );

  const isSoldOut = !isUnlimited && (product.stock ?? 0) <= 0;
  const maxStock = isUnlimited ? 99 : Math.max(0, product.stock ?? 0);
  const isEvent =
    product.category_id === 'catas' ||
    product.category_id === 'cata_presencial' ||
    product.category_id === 'experiencia' ||
    product.name.toLowerCase().includes('cata');

  const handleAdd = () => {
    if (isSoldOut || quantity <= 0) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product, 'EkhiTeka Selección');
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isSeller) {
    return (
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3 font-serif">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
            Modo Vendedor: Estás previsualizando la ficha de este producto.
          </p>
          <span className="px-3 py-1 bg-white dark:bg-stone-900 border border-amber-300 dark:border-amber-700 rounded-xl text-xs font-black text-amber-950 dark:text-amber-300 font-sans">
            {isUnlimited ? t.prod_unlimited : `${t.prod_stock}: ${product.stock ?? 0} ${isEvent ? t.event_seats : 'uds'}`}
          </span>
        </div>
        <Link
          href={`/vendedor/productos/${product.id}/editar`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all shadow-xs font-serif cursor-pointer hover:scale-102"
        >
          <Pencil className="w-4 h-4" />
          <span>Editar variables del producto</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-serif">
      <div className="flex items-center gap-3">
        {/* Selector de cantidad con modo oscuro nítido */}
        {!isSoldOut && (
          <div className="flex items-center rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-[#1F1E1C] p-1 shadow-inner">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-700 dark:text-stone-200 font-bold hover:bg-stone-200 dark:hover:bg-stone-800 disabled:opacity-30 cursor-pointer transition-colors"
            >
              -
            </button>
            <span className="w-10 text-center text-xs font-black text-stone-900 dark:text-[#F5F5F0]">
              {quantity}
            </span>
            <button
              type="button"
              disabled={quantity >= maxStock}
              onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-700 dark:text-stone-200 font-bold hover:bg-stone-200 dark:hover:bg-stone-800 disabled:opacity-30 cursor-pointer transition-colors"
            >
              +
            </button>
          </div>
        )}

        {/* Botón Principal */}
        <button
          type="button"
          disabled={isSoldOut}
          onClick={handleAdd}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer ${
            isSoldOut
              ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed shadow-none'
              : added
              ? 'bg-emerald-700 text-white'
              : 'bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] hover:scale-102 hover:shadow-lg'
          }`}
        >
          {isSoldOut ? (
            <span>{isEvent ? t.event_capacity_full : t.prod_sold_out}</span>
          ) : added ? (
            <>
              <Check className="w-5 h-5" />
              <span>{isEvent ? t.event_seats_added : t.prod_added}</span>
            </>
          ) : (
            <>
              {isEvent ? <Ticket className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
              <span>{isEvent ? t.event_reserve_seat : t.prod_add_to_cart}</span>
            </>
          )}
        </button>
      </div>

      {/* Aviso de stock / plazas restantes */}
      {!isSoldOut && (
        <p className="text-xs font-bold text-stone-600 dark:text-stone-300 font-sans">
          {isUnlimited ? (
            <span className="text-emerald-700 dark:text-emerald-400">
              <strong className="uppercase">{t.prod_unlimited}</strong>
            </span>
          ) : product.stock !== null && product.stock <= 5 ? (
            <span className="text-amber-600 dark:text-amber-400">
              {isEvent ? `¡Atención! Solo quedan ${product.stock} plazas disponibles.` : `¡Últimas ${product.stock} unidades en stock!`}
            </span>
          ) : (
            <span>
              {t.prod_stock}: <strong>{product.stock}</strong> {isEvent ? t.event_seats : 'uds'}
            </span>
          )}
        </p>
      )}
    </div>
  );
}
