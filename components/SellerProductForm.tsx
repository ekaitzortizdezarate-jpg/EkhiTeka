'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { createProduct, updateProduct, deleteProduct } from '@/app/actions/products';
import type { Category, Product, ProductFormat } from '@/types/database';
import { Package, ArrowLeft, Trash2, Check } from 'lucide-react';
import Link from 'next/link';

export interface SellerProductFormProps {
  categories: Category[];
  initialProduct?: Product | null;
  availableSingleProducts?: Product[];
}

export function SellerProductForm({
  categories,
  initialProduct,
  availableSingleProducts = [],
}: SellerProductFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initialProduct);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    if (isEditing && initialProduct) {
      const res = await updateProduct(initialProduct.id, formData);
      setLoading(false);
      if (res?.error) setError(res.error);
      else router.push('/tienda');
    } else {
      const res = await createProduct(formData);
      setLoading(false);
      if (res?.error) setError(res.error);
      else router.push('/tienda');
    }
  };

  const handleDelete = async () => {
    if (!initialProduct || !confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    setLoading(true);
    const res = await deleteProduct(initialProduct.id);
    setLoading(false);
    if (res?.error) alert(res.error);
    else router.push('/tienda');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 space-y-6 font-serif">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/tienda"
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {isEditing ? t.seller_edit_product : t.seller_new_product}
          </h1>
        </div>

        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-colors cursor-pointer"
            title={t.seller_delete_product}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 rounded-2xl text-xs font-bold text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-xs font-sans text-xs">
        <div>
          <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
            {t.seller_product_name} *
          </label>
          <input
            type="text"
            name="name"
            required
            defaultValue={initialProduct?.name || ''}
            className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {t.seller_product_category} *
            </label>
            <select
              name="category_id"
              required
              defaultValue={initialProduct?.category_id || categories[0]?.id || 'queso'}
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_es} / {c.name_eu}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {t.seller_product_format}
            </label>
            <select
              name="format"
              defaultValue={initialProduct?.format || 'unidad'}
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
            >
              <option value="unidad">Unidad</option>
              <option value="peso_kg">Peso (Kg)</option>
              <option value="pack">Pack / Cesta</option>
              <option value="botella">Botella</option>
              <option value="lata">Lata</option>
              <option value="tarro">Tarro</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {t.seller_product_price} *
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              required
              defaultValue={initialProduct?.price || ''}
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {t.seller_product_stock}
            </label>
            <input
              type="number"
              name="stock"
              defaultValue={initialProduct?.stock ?? 10}
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
            {t.seller_product_origin}
          </label>
          <input
            type="text"
            name="origin_region"
            defaultValue={initialProduct?.origin_region || 'Lekeitio / Bizkaia'}
            className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
          />
        </div>

        <div>
          <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
            {t.seller_product_desc}
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={initialProduct?.description || ''}
            className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-102 cursor-pointer font-serif disabled:opacity-50"
          >
            {loading ? t.common_loading : t.seller_save_product}
          </button>
        </div>
      </form>
    </div>
  );
}
