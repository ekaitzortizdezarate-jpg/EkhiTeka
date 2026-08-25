'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { createProduct, updateProduct } from '@/app/actions/products';
import type { Category, Product } from '@/types/database';
import { Upload, Check, ArrowLeft, Trash2, Plus, X } from 'lucide-react';
import Link from 'next/link';

interface SellerProductFormProps {
  categories: Category[];
  initialProduct?: Product | null;
  storeProducts?: Product[];
}

export function SellerProductForm({
  categories,
  initialProduct,
  storeProducts = [],
}: SellerProductFormProps) {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialProduct?.image_url || null);

  const isEdit = !!initialProduct;

  const detectInitialType = () => {
    if (!initialProduct) return 'producto_suelto';
    const cat = initialProduct.category_id;
    if (cat === 'cesta_gourmet' || cat === 'cesta' || cat === 'cestas') return 'cesta_gourmet';
    if (cat === 'cata_presencial') return 'cata_presencial';
    if (cat === 'cata_casa') return 'cata_casa';
    if (cat === 'tarjeta_regalo') return 'tarjeta_regalo';
    return 'producto_suelto';
  };

  const [publishingType, setPublishingType] = useState<
    'producto_suelto' | 'cesta_gourmet' | 'cata_casa' | 'tarjeta_regalo' | 'cata_presencial'
  >(detectInitialType());

  // Productos seleccionados de la tienda
  const [selectedStoreProducts, setSelectedStoreProducts] = useState<string[]>([]);
  const [customItemsText, setCustomItemsText] = useState('');

  // Evento Cata Presencial (Campos separados)
  const [eventDate, setEventDate] = useState('');
  const [eventStartTime, setEventStartTime] = useState('19:30');
  const [eventEndTime, setEventEndTime] = useState('21:30');
  const [eventAttendees, setEventAttendees] = useState(12);

  // Tarjeta Regalo
  const [giftCardOption, setGiftCardOption] = useState('Canjeable por productos EkhiTeka');

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

  const toggleStoreProduct = (prodName: string) => {
    setSelectedStoreProducts((prev) =>
      prev.includes(prodName) ? prev.filter((p) => p !== prodName) : [...prev, prodName]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    let customDesc = (formData.get('description') as string) || '';
    let fallbackImg = '/images/secciones/Quesos.JPG';

    const includedList = [
      ...selectedStoreProducts.map((p) => `• ${p} (Tienda)`),
      ...(customItemsText.trim() ? customItemsText.split('\n').map((l) => `• ${l.trim()}`).filter(Boolean) : []),
    ].join('\n');

    if (publishingType === 'cesta_gourmet') {
      formData.set('category_id', 'cesta_gourmet');
      formData.set('format', 'pack');
      formData.set('stock', '999');
      formData.set('origin_region', 'Lekeitio / Bizkaia');
      if (includedList) {
        customDesc = `${customDesc}\n\n🎁 PRODUCTOS INCLUIDOS EN LA CESTA:\n${includedList}`;
      }
      fallbackImg = '/images/secciones/Cestas.JPG';
    } else if (publishingType === 'cata_casa') {
      formData.set('category_id', 'cata_casa');
      formData.set('format', 'pack');
      formData.set('stock', '999');
      formData.set('origin_region', 'Lekeitio / Bizkaia');
      if (includedList) {
        customDesc = `${customDesc}\n\n🏠 PACK DE CATA INCLUYE:\n${includedList}`;
      }
      fallbackImg = '/images/secciones/Catas.JPG';
    } else if (publishingType === 'cata_presencial') {
      formData.set('category_id', 'cata_presencial');
      formData.set('format', 'unidad');
      formData.set('stock', String(eventAttendees || 12));
      formData.set('origin_region', 'Lekeitio');
      customDesc = `📅 FECHA: ${eventDate}\n⏰ HORARIO: ${eventStartTime} - ${eventEndTime}\n👥 PLAZAS DISPONIBLES: ${eventAttendees}\n\n🍷 PRODUCTOS A DEGUSTAR:\n${includedList || 'Selección de autor afinada y maridaje'}\n\n${customDesc}`;
      fallbackImg = '/images/secciones/Catas.JPG';
    } else if (publishingType === 'tarjeta_regalo') {
      formData.set('category_id', 'tarjeta_regalo');
      formData.set('format', 'unidad');
      formData.set('stock', '999');
      formData.set('origin_region', 'Lekeitio / Bizkaia');
      customDesc = `💳 MODALIDAD: ${giftCardOption}\n\n${customDesc}`;
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

  const isLooseProduct = publishingType === 'producto_suelto';

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
            {isEdit ? t.seller_edit_product : 'Añadir Producto'}
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

      {/* Selector de Tipo de Publicación */}
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
              ? 'Título del Evento / Cata Presencial *'
              : publishingType === 'tarjeta_regalo'
              ? 'Nombre de la Tarjeta Regalo *'
              : publishingType === 'cata_casa'
              ? 'Nombre del Pack de Cata en Casa *'
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

        {/* 2. Categoría y Formato (SOLO VISIBLE PARA PRODUCTO SUELTO) */}
        {isLooseProduct && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-black font-serif text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                {t.seller_product_category} *
              </label>
              <select
                name="category_id"
                required
                defaultValue={initialProduct?.category_id || categories[0]?.id}
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
                defaultValue={initialProduct?.format || 'unidad'}
                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259] cursor-pointer font-serif"
              >
                <option value="unidad">Unidad / Pieza</option>
                <option value="pack">Pack / Lote</option>
                <option value="peso_kg">Por Kg</option>
                <option value="botella">Botella</option>
                <option value="lata">Lata</option>
                <option value="tarro">Tarro</option>
              </select>
            </div>
          </div>
        )}

        {/* 3. Configuración de Cesta Gourmet & Cata en Casa (Seleccionar tienda + Añadir nuevos) */}
        {(publishingType === 'cesta_gourmet' || publishingType === 'cata_casa') && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-stone-850 border border-stone-200 dark:border-stone-700 space-y-4">
            <div>
              <label className="block text-xs font-black font-serif text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                1. Seleccionar productos de la tienda para incluir:
              </label>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-2">
                Haz clic en los productos existentes que formarán parte de este lote
              </p>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                {storeProducts.length > 0 ? (
                  storeProducts.map((p) => {
                    const isSelected = selectedStoreProducts.includes(p.name);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleStoreProduct(p.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#FFE259] text-[#1D1D1B] border border-stone-800 font-black'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                        }`}
                      >
                        <span>{p.name}</span>
                        {isSelected ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3 text-stone-400" />}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs text-stone-400 p-2">No hay productos sueltos activos en la tienda.</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black font-serif text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                2. Añadir productos adicionales o específicos (uno por línea):
              </label>
              <textarea
                rows={3}
                value={customItemsText}
                onChange={(e) => setCustomItemsText(e.target.value)}
                placeholder="1x Tabla artesanal grabada&#10;1x Cuchillo especial para queso&#10;1x Confitura de higos..."
                className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>
        )}

        {/* 4. Configuración de Cata Presencial (Generación de Evento con Fecha, Horarios y Participantes) */}
        {publishingType === 'cata_presencial' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-stone-850 border border-stone-200 dark:border-stone-700 space-y-4">
            <span className="text-xs font-black font-serif text-[#C68D07] dark:text-[#FFE259] uppercase tracking-widest block">
              Configuración del Evento en Calendario
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-[11px] font-black font-serif text-stone-800 dark:text-stone-200 uppercase">
                  Fecha del Evento *
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-black font-serif text-stone-800 dark:text-stone-200 uppercase">
                  Hora Inicio *
                </label>
                <input
                  type="time"
                  required
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-black font-serif text-stone-800 dark:text-stone-200 uppercase">
                  Hora Fin *
                </label>
                <input
                  type="time"
                  required
                  value={eventEndTime}
                  onChange={(e) => setEventEndTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-black font-serif text-stone-800 dark:text-stone-200 uppercase">
                Cantidad de Participantes / Plazas Disponibles *
              </label>
              <input
                type="number"
                min="1"
                required
                value={eventAttendees}
                onChange={(e) => setEventAttendees(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-black font-serif text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                Productos y quesos a degustar (tienda + nuevos):
              </label>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                {storeProducts.map((p) => {
                  const isSelected = selectedStoreProducts.includes(p.name);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleStoreProduct(p.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#FFE259] text-[#1D1D1B] border border-stone-800 font-black'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      <span>{p.name}</span>
                      {isSelected ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3 text-stone-400" />}
                    </button>
                  );
                })}
              </div>

              <textarea
                rows={2}
                value={customItemsText}
                onChange={(e) => setCustomItemsText(e.target.value)}
                placeholder="Añadir otros vinos o quesos fuera de carta a degustar..."
                className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>
        )}

        {/* 5. Configuración de Tarjeta Regalo */}
        {publishingType === 'tarjeta_regalo' && (
          <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-stone-850 border border-stone-200 dark:border-stone-700 space-y-2">
            <label className="block text-xs font-black font-serif text-stone-800 dark:text-stone-200 uppercase tracking-wider">
              Opciones de Canje:
            </label>
            <input
              type="text"
              value={giftCardOption}
              onChange={(e) => setGiftCardOption(e.target.value)}
              className="w-full px-3 py-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100"
            />
          </div>
        )}

        {/* 6. Precio y Stock (Stock solo visible para Producto Suelto) */}
        <div className={`grid gap-4 ${isLooseProduct ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
          <div className="space-y-1.5">
            <label className="block text-xs font-black font-serif text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {publishingType === 'cata_presencial' ? 'Precio por Plaza / Asistente (€) *' : `${t.seller_product_price} *`}
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

          {isLooseProduct && (
            <div className="space-y-1.5">
              <label className="block text-xs font-black font-serif text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                {t.seller_product_stock}
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                defaultValue={initialProduct?.stock ?? 12}
                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          )}
        </div>

        {/* 7. Origen (SOLO PARA PRODUCTO SUELTO) */}
        {isLooseProduct && (
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
        )}

        {/* 8. Descripción */}
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

        {/* 9. Subida de Imagen */}
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
                Formatos soportados: PNG, JPG, WebP.
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
                if (confirm(`¿Estás seguro de que deseas eliminar "${initialProduct.name}" del catálogo?`)) {
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