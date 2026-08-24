'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { createProduct, updateProduct } from '@/app/actions/products';
import type { Category, Product } from '@/types/database';
import { Upload, Sparkles, Check, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface SellerProductFormProps {
  categories: Category[];
  initialProduct?: Product | null;
}

export function SellerProductForm({ categories, initialProduct }: SellerProductFormProps) {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialProduct?.image_url || null);

  const isEdit = !!initialProduct;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);

    if (isEdit && initialProduct) {
      const res = await updateProduct(initialProduct.id, formData);
      if (res?.error) {
        setErrorMsg(res.error);
        setLoading(false);
      }
    } else {
      const res = await createProduct(formData);
      if (res?.error) {
        setErrorMsg(res.error);
        setLoading(false);
      }
    }
  };

  const getCategoryName = (cat: Category) => {
    if (language === 'eu') return cat.name_eu;
    if (language === 'fr') return cat.name_fr;
    if (language === 'en') return cat.name_en;
    return cat.name_es;
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
            {isEdit ? t.seller_edit_product : t.seller_new_product}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Publica tus productos gourmet directamente en el catálogo de EkhiTeka.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-700 text-red-900 dark:text-red-200 text-xs font-bold rounded-2xl">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-5 sm:p-8 space-y-5 shadow-sm">
        {isEdit && initialProduct?.image_url && (
          <input type="hidden" name="existing_image_url" value={initialProduct.image_url} />
        )}

        {/* 1. Nombre del Producto */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            {t.seller_product_name} *
          </label>
          <input
            type="text"
            name="name"
            required
            defaultValue={initialProduct?.name || ''}
            placeholder="Ej: Queso Idiazabal Ahumado de Pastor"
            className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* 2. Categoría y Formato */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {t.seller_product_category} *
            </label>
            <select
              name="category_id"
              required
              defaultValue={initialProduct?.category_id || categories[0]?.id}
              className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {getCategoryName(cat)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {t.seller_product_format} *
            </label>
            <select
              name="format"
              required
              defaultValue={initialProduct?.format || 'unidad'}
              className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="unidad">Unidad / Pieza</option>
              <option value="peso_kg">Por Kg</option>
              <option value="pack">Pack / Lote Gourmet</option>
              <option value="botella">Botella (Txakoli/Sidra/Cerveza)</option>
              <option value="lata">Lata (Bonito/Anchoas)</option>
              <option value="tarro">Tarro (Gildas/Encurtidos)</option>
            </select>
          </div>
        </div>

        {/* 3. Precio y Peso */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {t.seller_product_price} *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.10"
              name="price"
              required
              defaultValue={initialProduct?.price || ''}
              placeholder="0.00"
              className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              Peso en gramos (opcional)
            </label>
            <input
              type="number"
              name="weight_g"
              defaultValue={initialProduct?.weight_g || ''}
              placeholder="Ej: 500"
              className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* 4. Origen y Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {t.seller_product_origin}
            </label>
            <input
              type="text"
              name="origin_region"
              defaultValue={initialProduct?.origin_region || 'Idiazabal / Bizkaia'}
              placeholder="Ej: Idiazabal, Bermeo, Getaria..."
              className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {t.seller_product_stock}
            </label>
            <input
              type="number"
              name="stock"
              min="0"
              defaultValue={initialProduct?.stock ?? 10}
              className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* 5. Descripción */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            {t.seller_product_desc}
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={initialProduct?.description || ''}
            placeholder="Elaboración tradicional, notas de cata, maridaje sugerido..."
            className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* 6. Subida de Imagen */}
        <div className="space-y-2">
          <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            {t.seller_product_image}
          </label>
          <div className="flex items-center gap-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/50 shadow-xs"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-stone-100 dark:bg-stone-800 border-2 border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-center text-stone-400">
                <Upload className="w-6 h-6" />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                name="image_file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-xs text-stone-600 dark:text-stone-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-amber-600 file:text-white hover:file:bg-amber-700 cursor-pointer"
              />
              <p className="text-[10px] text-stone-400 mt-1">
                Formatos recomendados: PNG, JPG, WebP. Tamaño óptimo 800x600 px.
              </p>
            </div>
          </div>
        </div>

        {/* 7. Botón Guardar */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
          <Link
            href="/"
            className="px-4 py-2.5 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 rounded-xl"
          >
            {t.common_cancel}
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {loading ? (
              <span>{t.common_loading}</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{isEdit ? t.common_save : t.seller_save_product}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
