'use client';

import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { ShoppingBag } from 'lucide-react';

export function CartNavButton() {
  const { totalItems, setIsCartOpen } = useCart();
  const { t } = useLanguage();

  if (totalItems === 0) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => setIsCartOpen(true)}
      className="group relative flex items-center gap-2 px-3.5 py-2 bg-stone-100 hover:bg-[#FFE259] dark:bg-stone-800 dark:hover:bg-[#FFE259] text-stone-900 dark:text-stone-100 hover:text-stone-950 dark:hover:text-[#1D1D1B] border border-stone-300 dark:border-stone-700 hover:border-[#FFE259] dark:hover:border-[#FFE259] rounded-2xl font-black text-xs transition-all shadow-2xs cursor-pointer hover:scale-102"
      title={t.nav_cart}
    >
      <ShoppingBag className="w-4 h-4 text-stone-800 dark:text-stone-200 group-hover:text-stone-950 dark:group-hover:text-[#1D1D1B] transition-colors" />
      <span className="hidden sm:inline font-bold font-serif uppercase tracking-wider">{t.nav_cart}</span>
      <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#FFE259] text-[#1D1D1B] font-black text-[11px] flex items-center justify-center shadow-xs border border-stone-800 animate-bounce">
        {totalItems}
      </span>
    </button>
  );
}
