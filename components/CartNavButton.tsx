'use client';

import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { ShoppingBag } from 'lucide-react';

export function CartNavButton() {
  const { totalItems, setIsCartOpen } = useCart();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => setIsCartOpen(true)}
      className="relative flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 hover:bg-amber-500/20 dark:hover:bg-amber-500/30 border-2 border-amber-500/40 rounded-2xl font-black text-xs transition-all shadow-2xs cursor-pointer hover:scale-102"
      title={t.nav_cart}
    >
      <ShoppingBag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
      <span className="hidden sm:inline">{t.nav_cart}</span>
      {totalItems > 0 && (
        <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-black text-[11px] flex items-center justify-center shadow-xs ml-0.5 animate-bounce">
          {totalItems}
        </span>
      )}
    </button>
  );
}
