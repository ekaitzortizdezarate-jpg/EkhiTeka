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
      className="group relative flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2 bg-[#FFE259] sm:bg-stone-100 sm:hover:bg-[#FFE259] text-[#1D1D1B] sm:text-stone-900 sm:dark:text-stone-100 sm:dark:bg-stone-800 sm:dark:hover:bg-[#FFE259] sm:hover:text-stone-950 sm:dark:hover:text-[#1D1D1B] border border-[#FFE259] sm:border-stone-300 sm:dark:border-stone-700 sm:hover:border-[#FFE259] sm:dark:hover:border-[#FFE259] rounded-2xl font-black text-xs transition-all shadow-[0_0_10px_rgba(255,226,89,0.45)] ring-2 ring-[#FFE259]/50 sm:ring-0 sm:shadow-2xs cursor-pointer hover:scale-102"
      title={t.nav_cart}
    >
      <ShoppingBag className="w-4 h-4 text-[#1D1D1B] sm:text-stone-800 sm:dark:text-stone-200 group-hover:text-stone-950 dark:group-hover:text-[#1D1D1B] transition-colors" />
      <span className="hidden sm:inline font-bold font-serif uppercase tracking-wider">{t.nav_cart}</span>
      <span className="hidden sm:flex min-w-5 h-5 px-1.5 rounded-full bg-[#FFE259] text-[#1D1D1B] font-black text-[11px] items-center justify-center shadow-xs border border-stone-800">
        {totalItems}
      </span>
    </button>
  );
}
