'use client';

import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export function CartDrawer() {
  const { items, isCartOpen, closeCart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { t } = useLanguage();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] overflow-hidden" style={{ zIndex: 999999 }}>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white dark:bg-stone-900 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-stone-200 dark:border-stone-800 animate-in slide-in-from-right duration-300">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C68D07] dark:text-[#FFE259]" />
              <h2 className="font-serif font-black text-lg text-stone-900 dark:text-stone-100">
                {t.cart_title} ({totalItems})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {items.length > 0 ? (
            <div className="space-y-4 divide-y divide-stone-100 dark:divide-stone-800">
              {items.map((item) => {
                const id = item.productId || item.product?.id || '';
                const name = item.name || item.product?.name || 'Producto';
                const price = Number(item.price || item.product?.price || 0);
                const img = item.imageUrl || item.product?.image_url || '/images/secciones/Quesos.JPG';

                return (
                  <div key={id} className="pt-4 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-stone-200 dark:border-stone-700">
                        <img
                          src={img}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif font-black text-xs text-stone-900 dark:text-stone-100 truncate">
                          {name}
                        </p>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 font-serif">
                          {price.toFixed(2)} €
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-serif shrink-0">
                      <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(id, Math.max(1, item.quantity - 1))}
                          className="w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-stone-200 dark:hover:bg-stone-700 rounded cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-xs font-black">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={!item.product?.is_unlimited_stock && item.quantity >= (item.product?.stock ?? 99)}
                          onClick={() => updateQuantity(id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-stone-200 dark:hover:bg-stone-700 rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(id)}
                        className="p-1 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                {t.cart_empty}
              </p>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="pt-6 border-t border-stone-200 dark:border-stone-800 space-y-4 font-serif">
            <div className="flex justify-between items-center text-base font-black text-stone-900 dark:text-stone-100">
              <span>{t.cart_total}</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>

            <Link
              href="/cesta"
              onClick={closeCart}
              className="w-full py-3.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-102"
            >
              <span>{t.cart_checkout}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
