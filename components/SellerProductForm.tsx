'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { createProduct, updateProduct } from '@/app/actions/products';
import type { Category, Product } from '@/types/database';
import { Upload, Check, ArrowLeft, Trash2 } from 'lucide-react';
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

  const [publishingType, setPublishingType] = useState<
    'producto_suelto' | 'cesta_gourmet' | 'cata_casa' | 'tarjeta_regalo' | 'cata_presencial'
  >('producto_suelto');

  const [cestaItems, setCestaItems] = useState('1x Queso Idiazabal Ahumado (500g)\n1x Bonito del Norte de Lekeitio\n1x Txakoli de Bizkaia\n1x Picos artesanos');
  const [cataFecha, setCataFecha] = useState('Sábado 20 de Septiembre · 19:30h');
  const [cataAforo, setCataAforo] = useState('12 plazas');
  const [cataProductos, setCataProductos] = useState('5 quesos artesanos de afinador, 2 txakolis de Bizkaia, 1 sidra natural y pan de masa madre');
  const [tarjetaImportes, setTarjetaImportes] = useState('30€, 60€, 75€ o Canjeable por Cata Presencial');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleTypeSelect = (type: typeof publishingType) => {
    setPublishingType(type);
    if (!previewUrl) {
      if (type === 'cesta_gourmet') setPreviewUrl('/images/secciones/Cestas.JPG');
      else if (type === 'cata_presencial' || type === 'cata_casa') setPreviewUrl('/images/secciones/Catas.JPG');
      else if (type === 'tarjeta_regalo') setPreviewUrl('/images/secciones/Mesas.JPG');
      else setPreviewUrl('/images/secciones/Quesos.JPG');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);

    let customDesc = formData.get('description') as string;
    let fallbackImg = '/images/secciones/Quesos.JPG';

    if (publishingType === 'cesta_gourmet') {
      customDesc = `${customDesc}\n\n🎁 CONTENIDO DEL LOTE / CESTA:\n${cestaItems}`;
      fallbackImg = '/images/secciones/Cestas.JPG';
    } else if (publishingType === 'cata_presencial') {
      customDesc = `${customDesc}\n\n📅 FECHA & HORA: ${cataFecha}\n👥 AFORO: ${cataAforo}\n🍷 QUESOS & MARIDAJE A DEGUSTAR:\n${cataProductos}`;
      fallbackImg = '/images/secciones/Catas.JPG';
    } else if (publishingType === 'cata_casa') {
      customDesc = `${customDesc}\n\n🏠 INCLUYE PACK EN CASA:\n${cestaItems || 'Tabla de quesos afinados, fichas guiadas de cata y maridaje'}`;
      fallbackImg = '/images/secciones/Catas.JPG';
    } else if (publishingType === 'tarjeta_regalo') {
      customDesc = `${customDesc}\n\n💳 TARJETA REGALO VIRTUAL:\nOpciones canjeables: ${tarjetaImportes}`;
      fallbackImg = '/images/secciones/Mesas.JPG';
    }

    formData.set('description', customDesc.trim());
    if (!formData.get('image_file') || (formData.get('image_file') as File).size === 0) {
      formData.set('image_url_fallback', previewUrl || fallbackImg);
    }

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
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black font-serif text-stone-900 dark:text-stone-100">
            {isEdit ? t.seller_edit_product : t.seller_new_product}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Publica productos, cestas gourmet, catas o tarjetas regalo para EkhiTeka.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-700 text-red-900 dark:text-red-200 text-xs font-bold rounded-2xl">
          {errorMsg}
        </div>
      )}

      {/* Selector de Tipo de Publicación (Sin iconos emoji y con tipografía de títulos) */}
      {!isEdit && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-4 sm:p-6 space-y-3 shadow-xs">
          <label className="block text-xs font-black font-serif text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            ¿Qué tipo de publicación deseas crear?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 font-serif">
            {[
              { id: 'producto_suelto', label: 'Producto Suelto' },
              { id: 'cesta_gourmet', label: 'Cesta Gourmet' },
              { id: 'cata_casa', label: 'Cata en Casa' },
              { id: 'tarjeta_regalo', label: 'Tarjeta Regalo' },
              { id: 'cata_presencial', label: 'Cata Presencial' },
            ].map((tItem) => (
              <button
                key={tItem.id}
                type="button"
                onClick={() => handleTypeSelect(tItem.id as any)}
                className={`py-3.5 px-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  publishingType === tItem.id
                    ? 'bg-[#FFE259] text-[#1D1D1B] border-stone-800 font-black shadow-xs scale-102'
                    : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-[#FFE259]'
                }`}
              >
                <span className="text-xs uppercase tracking-[0.12em] font-bold leading-tight">
                  {tItem.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-5 sm:p-8 space-y-5 shadow-sm">
        {isEdit && initialProduct?.image_url && (
          <input type="hidden" name="existing_image_url" value={initialProduct.image_url} />
        )}

        {/* 1. Nombre */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black font-serif text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            {publishingType === 'cesta_gourmet'
              ? 'Nombre de la Cesta Gourmet *'
              : publishingType === 'cata_presencial'
              ? 'Título de la Cata Presencial *'
              : publishingType === 'tarjeta_regalo'
              ? 'Nombre de la Tarjeta Regalo *'
              : publishingType === 'cata_casa'
              ? 'Nombre del Pack de Cata *'
              : 'Nombre del Producto *'}
          </label>
          <input
            type="text"
            name="name"
            required
            defaultValue={
              initialProduct?.name ||
              (publishingType === 'cesta_gourmet'
                ? 'Cesta Degustación Gourmet Lekeitio'
                : publishingType === 'cata_presencial'
                ? 'Cata de Quesos & Maridaje Vasco en Lekeitio'
                : publishingType === 'tarjeta_regalo'
                ? 'Tarjeta Regalo Virtual EkhiTeka'
                : publishingType === 'cata_casa'
                ? 'Pack Experiencia Cata en Casa (2-4 personas)'
                : '')
            }
            placeholder="Ej: Queso Idiazabal Ahumado de Pastor"
            className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
          />
        </div>

        {/* 2. Categoría y Formato */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-black font-serif text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {t.seller_product_category} *
            </label>
            <select
              name="category_id"
              required
              defaultValue={
                initialProduct?.category_id ||
                (publishingType === 'cesta_gourmet'
                  ? 'queso'
                  : publishingType === 'cata_presencial' || publishingType === 'cata_casa'
                  ? 'queso'
                  : categories[0]?.id)
              }
              className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259] cursor-pointer font-serif"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {getCategoryName(cat)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black font-serif text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {t.seller_product_format} *
            </label>
            <select
              name="format"
              required
              defaultValue={
                initialProduct?.format ||
                (publishingType === 'cesta_gourmet' || publishingType === 'cata_casa'
                  ? 'pack'
                  : 'unidad')
              }
              className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259] cursor-pointer font-serif"
            >
              <option value="unidad">Unidad / Entrada</option>
              <option value="pack">Pack / Cesta / Lote</option>
              <option value="peso_kg">Por Kg</option>
              <option value="botella">Botella</option>
              <option value="lata">Lata</option>
              <option value="tarro">Tarro</option>
            </select>
          </div>
        </div>

        {/* 3. Campos dinámicos según el tipo */}
        {publishingType === 'cesta_gourmet' && (
          <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-stone-850 border border-stone-200 dark:border-stone-700 space-y-2">
            <label className="block text-xs font-black font-serif text-stone-800 dark:text-stone-200 uppercase tracking-wider">
              Productos incluidos en esta Cesta Gourmet:
            </label>
            <textarea
              rows={4}
              value={cestaItems}
              onChange={(e) => setCestaItems(e.target.value)}
              placeholder="1x Queso Idiazabal 500g&#10;1x Bonito del Norte de Lekeitio&#10;1x Txakoli..."
              className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100"
            />
          </div>
        )}

        {publishingType === 'cata_presencial' && (
          <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-stone-850 border border-stone-200 dark:border-stone-700 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-black font-serif text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                  Fecha y Hora del Evento:
                </label>
                <input
                  type="text"
                  value={cataFecha}
                  onChange={(e) => setCataFecha(e.target.value)}
                  placeholder="Ej: Sábado 20 de Septiembre · 19:30h"
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-black font-serif text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                  Aforo / Plazas máximas:
                </label>
                <input
                  type="text"
                  value={cataAforo}
                  onChange={(e) => setCataAforo(e.target.value)}
                  placeholder="Ej: 12 plazas"
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-black font-serif text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                Productos y quesos que se van a probar:
              </label>
              <textarea
                rows={3}
                value={cataProductos}
                onChange={(e) => setCataProductos(e.target.value)}
                placeholder="5 quesos de afinador, 2 txakolis de Bizkaia..."
                className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>
        )}

        {publishingType === 'tarjeta_regalo' && (
          <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-stone-850 border border-stone-200 dark:border-stone-700 space-y-2">
            <label className="block text-xs font-black font-serif text-stone-800 dark:text-stone-200 uppercase tracking-wider">
              Opciones de importes y canje:
            </label>
            <input
              type="text"
              value={tarjetaImportes}
              onChange={(e) => setTarjetaImportes(e.target.value)}
              placeholder="30€, 60€, 75€ o Canjeable por Cata Presencial"
              className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold"
            />
          </div>
        )}

        {/* 4. Precio y Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-black font-serif text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {publishingType === 'cata_presencial' ? 'Precio por persona / plaza *' : `${t.seller_product_price} *`}
            </label>
            <input
              type="number"
              step="0.01"
              min="0.10"
              name="price"
              required
              defaultValue={initialProduct?.price || (publishingType === 'tarjeta_regalo' ? 60 : '')}
              placeholder="0.00"
              className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black font-serif text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {publishingType === 'cata_presencial' ? 'Plazas disponibles (Stock)' : t.seller_product_stock}
            </label>
            <input
              type="number"
              name="stock"
              min="0"
              defaultValue={initialProduct?.stock ?? 12}
              className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
            />
          </div>
        </div>

        {/* 5. Origen */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black font-serif text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            {t.seller_product_origin}
          </label>
          <input
            type="text"
            name="origin_region"
            defaultValue={initialProduct?.origin_region || 'Lekeitio / Bizkaia'}
            placeholder="Ej: Lekeitio, Idiazabal, Bermeo, Getaria..."
            className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
          />
        </div>

        {/* 6. Descripción */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black font-serif text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            {t.seller_product_desc}
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={initialProduct?.description || ''}
            placeholder="Notas de cata, elaboración artesanal, maridaje sugerido..."
            className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
          />
        </div>

        {/* 7. Subida de Imagen */}
        <div className="space-y-2">
          <label className="block text-xs font-black font-serif text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            {t.seller_product_image}
          </label>
          <div className="flex items-center gap-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#FFE259] shadow-xs"
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
                className="text-xs text-stone-600 dark:text-stone-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-[#FFE259] file:text-[#1D1D1B] hover:file:bg-[#F5D742] cursor-pointer font-serif uppercase tracking-wider"
              />
              <p className="text-[10px] text-stone-400 mt-1">
                Formatos soportados: PNG, JPG, WebP. Si no subes foto, se asignará automáticamente la imagen temática correspondiente.
              </p>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 font-serif">
          {isEdit && initialProduct ? (
            <button
              type="button"
              onClick={async () => {
                if (confirm(`¿Estás seguro de que deseas eliminar "${initialProduct.name}" del catálogo de EkhiTeka?`)) {
                  setLoading(true);
                  const { deleteProduct } = await import('@/app/actions/products');
                  await deleteProduct(initialProduct.id);
                  window.location.href = '/';
                }
              }}
              className="px-4 py-2.5 bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar Producto</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 hover:text-stone-900 rounded-xl"
            >
              {t.common_cancel}
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] active:bg-[#E5C428] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-102"
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
        </div>
      </form>
    </div>
  );
}