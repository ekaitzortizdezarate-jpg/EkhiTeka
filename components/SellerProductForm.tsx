'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { createProduct, updateProduct } from '@/app/actions/products';
import type { Category, Product } from '@/types/database';
import { Package, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface SellerProductFormProps {
  categories: Category[];
  product?: Product;
}

export function SellerProductForm({ categories, product }: SellerProductFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = product
      ? await updateProduct(product.id, formData)
      : await createProduct(formData);

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push('/tienda');
      router.refresh();
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6 font-serif">
      <Link
        href="/tienda"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.common_back}</span>
      </Link>

      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="pb-3 border-b border-stone-200 dark:border-stone-800">
          <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100">
            {product ? t.seller_edit_product : t.seller_new_product}
          </h1>
        </div>

        {error && (
          <div className="p-3.5 bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 rounded-2xl text-xs font-bold text-red-800 dark:text-red-200 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
              {t.seller_product_name} *
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={product?.name || ''}
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                {t.seller_product_price} *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.10"
                name="price"
                required
                defaultValue={product?.price || ''}
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                {t.seller_product_stock} *
              </label>
              <input
                type="number"
                min="0"
                name="stock"
                required
                defaultValue={product?.stock ?? 10}
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                {t.seller_product_category} *
              </label>
              <select
                name="category_id"
                required
                defaultValue={product?.category_id || categories[0]?.id || ''}
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_es}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                {t.seller_product_origin}
              </label>
              <input
                type="text"
                name="origin_region"
                defaultValue={product?.origin_region || 'Lekeitio / Bizkaia'}
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
              {t.seller_product_desc}
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={product?.description || ''}
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
            />
          </div>

          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Guardando...' : t.seller_save_product}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}