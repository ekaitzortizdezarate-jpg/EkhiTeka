'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import type { ProductWithSeller } from '@/types/database';
import { ShoppingBag, Check, Plus, Minus, AlertCircle } from 'lucide-react';

interface ProductDetailAddToCartProps {
  product: ProductWithSeller;
}

export function ProductDetailAddToCart({ product }: ProductDetailAddToCartProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const { t } = useLanguage();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const availableStock = product.is_unlimited_stock ? 99 : (product.stock ?? 0);
  const isSoldOut = availableStock <= 0;
  const isEvent = product.category_id === 'catas' || product.category_id === 'experiencia' || product.name.toLowerCase().includes('cata');

  const handleAdd = () => {
    if (isSoldOut) return;
    for (let i = 0; i < qty; i++) {
      addToCart(product, product.profiles?.full_name);
    }
    setAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800">
      {/* Aviso de Aforo o Disponibilidad */}
      <div className="flex items-center justify-between text-xs font-bold font-serif">
        <span className="text-stone-500 dark:text-stone-400 uppercase tracking-wider">
          {isEvent ? 'Aforo & Plazas:' : 'Disponibilidad:'}
        </span>
        {isSoldOut ? (
          <span className="text-red-600 dark:text-red-400 font-black uppercase flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {isEvent ? 'Plazas Agotadas' : 'Producto Agotado'}
          </span>
        ) : (
          <span className="text-[#C68D07] dark:text-[#FFE259] font-black">
            {product.is_unlimited_stock ? 'Disponible' : `${availableStock} ${isEvent ? 'plazas disponibles' : 'uds disponibles'}`}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Selector de Cantidad (topeado al stock restante) */}
        <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-2xl bg-stone-50 dark:bg-stone-850 p-1">
          <button
            type="button"
            disabled={isSoldOut || qty <= 1}
            onClick={() => setQty((prev) => Math.max(1, prev - 1))}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-30 transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-black text-sm text-stone-900 dark:text-stone-100">
            {qty}
          </span>
          <button
            type="button"
            disabled={isSoldOut || qty >= availableStock}
            onClick={() => setQty((prev) => Math.min(availableStock, prev + 1))}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-30 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Botón Añadir */}
        <button
          type="button"
          disabled={isSoldOut}
          onClick={handleAdd}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md active:scale-95 font-serif cursor-pointer ${
            isSoldOut
              ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed shadow-none'
              : added
              ? 'bg-emerald-700 text-white'
              : 'bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] hover:scale-102 hover:shadow-lg'
          }`}
        >
          {isSoldOut ? (
            <span>{isEvent ? 'Aforo Completo (Sin Plazas)' : 'Agotado'}</span>
          ) : added ? (
            <>
              <Check className="w-4 h-4" />
              <span>{isEvent ? 'Plaza(s) Añadida(s)' : 'Añadido a la Cesta'}</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>
                {isEvent ? 'Reservar Plaza(s)' : t.prod_add_to_cart} · {(Number(product.price) * qty).toFixed(2)} €
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}