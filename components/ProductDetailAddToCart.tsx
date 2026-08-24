'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import type { ProductWithSeller } from '@/types/database';
import { ShoppingBag, Check, Plus, Minus } from 'lucide-react';

interface ProductDetailAddToCartProps {
  product: ProductWithSeller;
}

export function ProductDetailAddToCart({ product }: ProductDetailAddToCartProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const { t } = useLanguage();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product, product.profiles?.full_name);
    }
    setAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800">
      <div className="flex items-center gap-3">
        {/* Quantity Selector */}
        <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-2xl bg-stone-50 dark:bg-stone-850 p-1">
          <button
            type="button"
            onClick={() => setQty((prev) => Math.max(1, prev - 1))}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-black text-sm text-stone-900 dark:text-stone-100">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((prev) => prev + 1)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={handleAdd}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer ${
            added
              ? 'bg-emerald-700 text-white'
              : 'bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] hover:scale-102 hover:shadow-lg'
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              <span>Añadido a la Cesta</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>{t.prod_add_to_cart} · {(Number(product.price) * qty).toFixed(2)} €</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
