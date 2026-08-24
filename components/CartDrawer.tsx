'use client';

import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { t } = useLanguage();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-stone-900 border-l-2 border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-950/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-base font-black text-stone-900 dark:text-stone-100">
                {t.cart_title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center gap-3 shadow-2xs"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-black text-xl flex items-center justify-center border border-amber-300 dark:border-amber-700 shrink-0">
                      🧀
                    </div>
                  )}

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-xs sm:text-sm truncate">
                      {item.name}
                    </h3>
                    <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                      {item.price.toFixed(2)} € / {item.format}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-lg overflow-hidden bg-white dark:bg-stone-900">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-black text-xs text-stone-900 dark:text-stone-100">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                        title={t.cart_remove}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-sm text-stone-900 dark:text-stone-100 block">
                      {(item.price * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8 text-amber-600/60" />
                </div>
                <h3 className="font-black text-stone-800 dark:text-stone-200 text-base">
                  {t.cart_empty}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs leading-relaxed">
                  {t.cart_empty_sub}
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  {t.cart_explore_btn}
                </button>
              </div>
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  {t.cart_total}:
                </span>
                <span className="text-xl font-black text-amber-950 dark:text-amber-300">
                  {totalPrice.toFixed(2)} €
                </span>
              </div>

              <Link
                href="/cesta"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-black text-sm rounded-2xl shadow-md transition-all hover:scale-101"
              >
                <span>{t.cart_checkout}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
