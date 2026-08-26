const fs = require('fs');
const path = require('path');

function saveFile(relativeFilePath, content) {
  const fullPath = path.join(process.cwd(), relativeFilePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content.trimStart(), 'utf8');
  console.log(`✓ Archivo actualizado: ${relativeFilePath}`);
}

// 1. components/SellerProductForm.tsx
saveFile('components/SellerProductForm.tsx', `
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { createProduct, updateProduct, deleteProduct } from '@/app/actions/products';
import type { Category, Product, StoreAddress, EventAddress, ProductWithSeller } from '@/types/database';
import { getProductImage } from '@/lib/productHelpers';
import {
  Package,
  ArrowLeft,
  Trash2,
  Check,
  Sparkles,
  Gift,
  Wine,
  CreditCard,
  Store,
  Calendar,
  Image as ImageIcon,
  Truck,
  AlertCircle,
  Search,
  CheckSquare,
  Square,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';

export type PublishingType =
  | 'producto_suelto'
  | 'cesta_gourmet'
  | 'cata_presencial'
  | 'cata_casa'
  | 'tarjeta_regalo';

export interface SellerProductFormProps {
  categories: Category[];
  initialProduct?: (Product & { profiles?: { full_name?: string | null } | null }) | null;
  availableSingleProducts?: Product[];
  pickupAddresses?: StoreAddress[];
  eventAddresses?: EventAddress[];
}

export function SellerProductForm({
  categories,
  initialProduct,
  availableSingleProducts = [],
  pickupAddresses = [],
  eventAddresses = [],
}: SellerProductFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initialProduct);

  // Determinar tipología inicial
  const inferInitialType = (): PublishingType => {
    if (!initialProduct) return 'producto_suelto';
    const cat = (initialProduct.category_id || '').toLowerCase();
    const name = (initialProduct.name || '').toLowerCase();
    if (cat === 'cata_presencial' || name.includes('cata presencial')) return 'cata_presencial';
    if (cat === 'cata_casa' || name.includes('cata en casa')) return 'cata_casa';
    if (cat === 'cesta_gourmet' || cat === 'cesta' || initialProduct.format === 'pack') return 'cesta_gourmet';
    if (cat === 'tarjeta_regalo' || name.includes('tarjeta')) return 'tarjeta_regalo';
    return 'producto_suelto';
  };

  const [publishingType, setPublishingType] = useState<PublishingType>(inferInitialType());
  const [imagePreview, setImagePreview] = useState<string | null>(initialProduct?.image_url || null);
  const [isUnlimited, setIsUnlimited] = useState<boolean>(initialProduct?.is_unlimited_stock || false);

  // Métodos de entrega
  const [deliveryMethods, setDeliveryMethods] = useState<string[]>(
    initialProduct?.delivery_methods || ['domicilio', 'recogida_tienda']
  );

  const hasDomicilio = deliveryMethods.includes('domicilio');
  const hasPickup = deliveryMethods.includes('recogida_tienda');

  const toggleDeliveryMethod = (method: string) => {
    if (deliveryMethods.includes(method)) {
      setDeliveryMethods(deliveryMethods.filter((m) => m !== method));
    } else {
      setDeliveryMethods([...deliveryMethods, method]);
    }
  };

  // Direcciones de recogida
  const activePickupList = pickupAddresses.filter((a) => a.is_active);
  const activeEventList = eventAddresses.filter((a) => a.is_active);

  const [selectedPickupIds, setSelectedPickupIds] = useState<string[]>(
    initialProduct?.pickup_address_ids && initialProduct.pickup_address_ids.length > 0
      ? initialProduct.pickup_address_ids
      : activePickupList.map((a) => a.id)
  );

  const [selectedEventId, setSelectedEventId] = useState<string>(
    initialProduct?.event_address_id || activeEventList[0]?.id || ''
  );

  // Selector de productos sueltos incluidos (Cestas y Catas)
  const [includedProductIds, setIncludedProductIds] = useState<string[]>([]);
  const [singleSearch, setSingleSearch] = useState('');

  const filteredSingleProducts = useMemo(() => {
    if (!singleSearch.trim()) return availableSingleProducts;
    const q = singleSearch.toLowerCase();
    return availableSingleProducts.filter((p) => p.name.toLowerCase().includes(q));
  }, [availableSingleProducts, singleSearch]);

  const toggleIncludedProduct = (id: string) => {
    if (includedProductIds.includes(id)) {
      setIncludedProductIds(includedProductIds.filter((pId) => pId !== id));
    } else {
      setIncludedProductIds([...includedProductIds, id]);
    }
  };

  const handleTogglePickup = (id: string) => {
    if (selectedPickupIds.includes(id)) {
      setSelectedPickupIds(selectedPickupIds.filter((pId) => pId !== id));
    } else {
      setSelectedPickupIds([...selectedPickupIds, id]);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Adjuntar métodos de entrega seleccionados
    formData.delete('delivery_methods');
    deliveryMethods.forEach((m) => formData.append('delivery_methods', m));

    // Adjuntar puntos de recogida seleccionados
    formData.delete('pickup_address_ids');
    if (hasPickup) {
      selectedPickupIds.forEach((id) => formData.append('pickup_address_ids', id));
    }

    // Ajustar categoría y tipología
    if (publishingType === 'cata_presencial') {
      formData.set('category_id', 'cata_presencial');
      formData.set('format', 'unidad');
      formData.set('event_address_id', selectedEventId);
      const eventLoc = activeEventList.find((ev) => ev.id === selectedEventId);
      if (eventLoc) {
        formData.set('origin_region', \`\${eventLoc.title} · \${eventLoc.town} (\${eventLoc.province})\`);
      }
    } else if (publishingType === 'cesta_gourmet') {
      formData.set('category_id', 'cesta_gourmet');
      formData.set('format', 'pack');
    } else if (publishingType === 'cata_casa') {
      formData.set('category_id', 'cata_casa');
      formData.set('format', 'pack');
    } else if (publishingType === 'tarjeta_regalo') {
      formData.set('category_id', 'tarjeta_regalo');
      formData.set('format', 'unidad');
      formData.set('is_unlimited_stock', 'true');
    }

    // Si se han seleccionado productos sueltos, adjuntar la lista en la descripción
    if (
      (publishingType === 'cesta_gourmet' ||
        publishingType === 'cata_presencial' ||
        publishingType === 'cata_casa') &&
      includedProductIds.length > 0
    ) {
      const rawDesc = (formData.get('description') as string) || '';
      const selectedNames = availableSingleProducts
        .filter((p) => includedProductIds.includes(p.id))
        .map((p) => \`• \${p.name}\`);

      if (selectedNames.length > 0 && !rawDesc.includes('Artículos incluidos')) {
        const fullDesc = \`\${rawDesc.trim()}\\n\\n📦 Artículos incluidos en esta selección:\\n\${selectedNames.join('\\n')}\`;
        formData.set('description', fullDesc);
      }
    }

    if (isEditing && initialProduct) {
      const res = await updateProduct(initialProduct.id, formData);
      setLoading(false);
      if (res?.error) setError(res.error);
    } else {
      const res = await createProduct(formData);
      setLoading(false);
      if (res?.error) setError(res.error);
    }
  };

  const handleDelete = async () => {
    if (!initialProduct || !confirm('¿Estás seguro de que deseas dar de baja este producto?')) return;
    setLoading(true);
    const res = await deleteProduct(initialProduct.id);
    setLoading(false);
    if (res?.error) alert(res.error);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-8 font-serif">
      {/* Cabecera */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <Link
            href="/tienda"
            className="p-2 rounded-xl bg-stone-100 dark:bg-[#1F1E1C] text-stone-600 dark:text-stone-300 hover:text-stone-900 transition-colors border border-stone-200 dark:border-stone-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
              {isEditing ? t.seller_edit_product : t.seller_new_product}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
              Catálogo compartido para todo el equipo de vendedores de EkhiTeka.
            </p>
          </div>
        </div>

        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            className="p-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-colors cursor-pointer border border-red-200 dark:border-red-900"
            title={t.seller_delete_product}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Banner de información de edición compartida para vendedores */}
      {isEditing && initialProduct && (
        <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200 font-sans">
          <UserCheck className="w-4 h-4 shrink-0 text-[#C68D07] dark:text-[#FFE259]" />
          <span>
            Última modificación realizada por:{' '}
            <strong className="font-bold">{initialProduct.profiles?.full_name || 'Vendedor EkhiTeka'}</strong>{' '}
            {initialProduct.updated_at && (
              <span className="text-[11px] opacity-80">
                ({new Date(initialProduct.updated_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })})
              </span>
            )}
          </span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 rounded-2xl text-xs font-bold text-red-800 dark:text-red-200 flex items-center gap-2 font-sans">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Selector Visual de Tipología */}
      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block font-serif">
          1. ¿Qué tipo de artículo deseas publicar?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 font-sans">
          <button
            type="button"
            onClick={() => setPublishingType('producto_suelto')}
            className={\`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 \${
              publishingType === 'producto_suelto'
                ? 'border-[#FFE259] bg-[#FFE259]/15 text-[#1D1D1B] dark:text-white font-bold shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] text-stone-600 dark:text-stone-400 hover:border-stone-400'
            }\`}
          >
            <Package className="w-5 h-5 text-amber-600 dark:text-[#FFE259]" />
            <span className="text-xs font-bold">Producto Suelto</span>
          </button>

          <button
            type="button"
            onClick={() => setPublishingType('cesta_gourmet')}
            className={\`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 \${
              publishingType === 'cesta_gourmet'
                ? 'border-[#FFE259] bg-[#FFE259]/15 text-[#1D1D1B] dark:text-white font-bold shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] text-stone-600 dark:text-stone-400 hover:border-stone-400'
            }\`}
          >
            <Gift className="w-5 h-5 text-amber-600 dark:text-[#FFE259]" />
            <span className="text-xs font-bold">Cesta / Lote</span>
          </button>

          <button
            type="button"
            onClick={() => setPublishingType('cata_presencial')}
            className={\`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 \${
              publishingType === 'cata_presencial'
                ? 'border-[#FFE259] bg-[#FFE259]/15 text-[#1D1D1B] dark:text-white font-bold shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] text-stone-600 dark:text-stone-400 hover:border-stone-400'
            }\`}
          >
            <Wine className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold">Cata Presencial</span>
          </button>

          <button
            type="button"
            onClick={() => setPublishingType('cata_casa')}
            className={\`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 \${
              publishingType === 'cata_casa'
                ? 'border-[#FFE259] bg-[#FFE259]/15 text-[#1D1D1B] dark:text-white font-bold shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] text-stone-600 dark:text-stone-400 hover:border-stone-400'
            }\`}
          >
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-[#FFE259]" />
            <span className="text-xs font-bold">Cata en Casa</span>
          </button>

          <button
            type="button"
            onClick={() => setPublishingType('tarjeta_regalo')}
            className={\`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 \${
              publishingType === 'tarjeta_regalo'
                ? 'border-[#FFE259] bg-[#FFE259]/15 text-[#1D1D1B] dark:text-white font-bold shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] text-stone-600 dark:text-stone-400 hover:border-stone-400'
            }\`}
          >
            <CreditCard className="w-5 h-5 text-amber-600 dark:text-[#FFE259]" />
            <span className="text-xs font-bold">Tarjeta Regalo</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-xs font-sans text-xs">
        {/* 2. Datos del Producto */}
        <div className="space-y-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block font-serif">
            2. Datos del Producto o Evento
          </span>

          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {publishingType === 'cata_presencial' ? 'Título de la Cata Presencial *' : 'Nombre del Producto *'}
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={initialProduct?.name || ''}
              placeholder={
                publishingType === 'cata_presencial'
                  ? 'Ej: Cata Magistral de 6 Quesos Afinados & Txakoli'
                  : publishingType === 'cesta_gourmet'
                  ? 'Ej: Cesta Selección Degustación Lekeitio'
                  : 'Ej: Queso Idiazabal Ahumado Pastor de Autor'
              }
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {publishingType === 'producto_suelto' && (
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Categoría del Catálogo *
                </label>
                <select
                  name="category_id"
                  required
                  defaultValue={initialProduct?.category_id || categories[0]?.id || 'queso'}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name_es} / {c.name_eu}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {publishingType === 'producto_suelto' && (
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Formato / Unidad de Venta
                </label>
                <select
                  name="format"
                  defaultValue={initialProduct?.format || 'unidad'}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
                >
                  <option value="unidad">Unidad / Pieza</option>
                  <option value="peso_kg">Peso (Kg / Cuña)</option>
                  <option value="tarro">Tarro / Bote</option>
                  <option value="lata">Lata Conserva</option>
                  <option value="botella">Botella</option>
                  <option value="pack">Pack Degustación</option>
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {publishingType === 'cata_presencial' ? 'Precio por Plaza (€) *' : 'Precio (€) *'}
              </label>
              <input
                type="number"
                step="0.01"
                min="0.10"
                name="price"
                required
                defaultValue={initialProduct?.price || ''}
                placeholder="25.00"
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-stone-700 dark:text-stone-300">
                  {publishingType === 'cata_presencial' ? 'Aforo / Plazas Disponibles *' : 'Stock Disponible'}
                </label>
                {publishingType !== 'cata_presencial' && (
                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_unlimited_stock"
                      value="true"
                      checked={isUnlimited}
                      onChange={(e) => setIsUnlimited(e.target.checked)}
                    />
                    <span>Ilimitado</span>
                  </label>
                )}
              </div>
              <input
                type="number"
                name="stock"
                min="0"
                disabled={isUnlimited}
                defaultValue={initialProduct?.stock ?? 10}
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100 disabled:opacity-40"
              />
            </div>
          </div>

          {publishingType !== 'cata_presencial' && (
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Denominación / Origen (Localidad / Valle)
              </label>
              <input
                type="text"
                name="origin_region"
                defaultValue={initialProduct?.origin_region || 'Lekeitio / Bizkaia'}
                placeholder="Ej: Lekeitio · Bizkaia / Idiazabal"
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
              />
            </div>
          )}

          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {publishingType === 'cata_presencial'
                ? 'Detalles, Fecha, Hora & Maridaje *'
                : 'Descripción, notas de cata y maridaje sugerido'}
            </label>
            <textarea
              name="description"
              rows={4}
              required={publishingType === 'cata_presencial'}
              defaultValue={initialProduct?.description || ''}
              placeholder={
                publishingType === 'cata_presencial'
                  ? 'Ej: Fecha: Sábado 20 de Septiembre · 19:30h\\nDuración: 90 minutos\\nIncluye 5 quesos artesanos de pastor y maridaje con 2 txakolis de Bizkaia.'
                  : 'Describe el perfil de sabor, curación, aromas e historia del productor...'
              }
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>

        {/* 3. Selección de Productos Sueltos Incluidos (Cestas, Cata Presencial y Cata en Casa) */}
        {(publishingType === 'cesta_gourmet' ||
          publishingType === 'cata_presencial' ||
          publishingType === 'cata_casa') && (
          <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-[#FFE259] block font-serif flex items-center gap-1.5">
                  <Gift className="w-4 h-4" />
                  <span>Añadir Productos Sueltos del Catálogo a esta Selección (Opcional)</span>
                </span>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Elige los quesos, conservas o botellas sueltas que componen este pack o experiencia.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold text-[11px]">
                {includedProductIds.length} seleccionados
              </span>
            </div>

            {availableSingleProducts.length > 0 ? (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={singleSearch}
                    onChange={(e) => setSingleSearch(e.target.value)}
                    placeholder="Filtrar productos individuales..."
                    className="w-full pl-8 pr-3 py-1.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-[11px]"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto rounded-2xl border border-stone-200 dark:border-stone-800 p-2 space-y-1 bg-stone-50/50 dark:bg-[#141312]/60 divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredSingleProducts.map((p) => {
                    const isSelected = includedProductIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleIncludedProduct(p.id)}
                        className={\`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer \${
                          isSelected
                            ? 'bg-[#FFE259]/20 text-stone-900 dark:text-stone-100 font-bold'
                            : 'hover:bg-stone-100 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300'
                        }\`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-amber-600 dark:text-[#FFE259] shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-stone-400 shrink-0" />
                          )}
                          <img
                            src={getProductImage(p)}
                            alt={p.name}
                            className="w-7 h-7 rounded-lg object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                          />
                          <span className="truncate text-xs">{p.name}</span>
                        </div>
                        <span className="text-[11px] font-black shrink-0 font-serif">
                          {Number(p.price).toFixed(2)} €
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-stone-400 italic">
                No hay productos individuales registrados todavía en el catálogo.
              </p>
            )}
          </div>
        )}

        {/* 4. Ubicación de Evento (Catas Presenciales) */}
        {publishingType === 'cata_presencial' && (
          <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 block font-serif flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>4. Punto de Evento (Ubicación única)</span>
            </span>

            {activeEventList.length > 0 ? (
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Espacio donde se celebrará la cata *
                </label>
                <select
                  name="event_address_id"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-purple-50/50 dark:bg-[#141312] border border-purple-300 dark:border-purple-800 rounded-xl font-bold text-stone-900 dark:text-stone-100"
                >
                  {activeEventList.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.title} — {addr.street} {addr.number || ''}, {addr.town} ({addr.province})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-900 dark:text-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>No hay ningún punto de evento activo. Ve a Perfil &gt; Tienda para activar una ubicación de eventos.</span>
              </div>
            )}
          </div>
        )}

        {/* 5. Métodos de Entrega & Puntos de Recogida (Modo Oscuro Corregido) */}
        {publishingType !== 'cata_presencial' && (
          <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#C68D07] dark:text-[#FFE259] block font-serif flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              <span>4. Métodos de Entrega & Puntos de Recogida en Tienda</span>
            </span>

            {/* Opciones con Modo Oscuro Nítido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => toggleDeliveryMethod('domicilio')}
                className={\`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer \${
                  hasDomicilio
                    ? 'border-[#FFE259] bg-[#FFE259]/15 text-stone-900 dark:text-[#F5F5F0]'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#141312] text-stone-600 dark:text-stone-400'
                }\`}
              >
                <input
                  type="checkbox"
                  checked={hasDomicilio}
                  onChange={() => {}} // Controlled by parent div
                  className="w-4 h-4 accent-[#FFE259] rounded cursor-pointer"
                />
                <span className="font-bold text-xs">Envio a Domicilio</span>
              </div>

              <div
                onClick={() => toggleDeliveryMethod('recogida_tienda')}
                className={\`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer \${
                  hasPickup
                    ? 'border-[#FFE259] bg-[#FFE259]/15 text-stone-900 dark:text-[#F5F5F0]'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#141312] text-stone-600 dark:text-stone-400'
                }\`}
              >
                <input
                  type="checkbox"
                  checked={hasPickup}
                  onChange={() => {}} // Controlled by parent div
                  className="w-4 h-4 accent-[#FFE259] rounded cursor-pointer"
                />
                <span className="font-bold text-xs">Recogida en tienda</span>
              </div>
            </div>

            {/* Puntos de Entrega (Se muestra SOLO si se selecciona Recogida en Tienda) */}
            {hasPickup && (
              <div className="space-y-2 pt-2 animate-fadeIn">
                <label className="font-bold text-stone-700 dark:text-stone-300 block">
                  Selecciona en qué puntos de entrega/tienda dar la opción de recogida:
                </label>
                {activePickupList.length > 0 ? (
                  <div className="space-y-1.5">
                    {activePickupList.map((addr) => (
                      <label
                        key={addr.id}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-[#141312] hover:bg-stone-100 dark:hover:bg-stone-850 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          name="pickup_address_ids"
                          value={addr.id}
                          checked={selectedPickupIds.includes(addr.id)}
                          onChange={() => handleTogglePickup(addr.id)}
                          className="w-4 h-4 accent-[#FFE259] rounded"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-stone-900 dark:text-stone-100 block">{addr.title}</span>
                          <span className="text-[10px] text-stone-500 dark:text-stone-400 block truncate">
                            {addr.street} {addr.number || ''}, {addr.town} ({addr.province})
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400">
                    No hay puntos de entrega activos. Puedes activarlos en la pestaña Tienda de tu perfil.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* 6. Fotografía del Producto */}
        <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800">
          <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block font-serif flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4" />
            <span>5. Fotografía del Producto / Evento</span>
          </span>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 dark:bg-[#141312] border-2 border-stone-200 dark:border-stone-700 shrink-0 flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">🧀</span>
              )}
            </div>

            <div className="space-y-2 flex-1 w-full">
              <input
                type="file"
                name="image_file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-stone-100 dark:file:bg-stone-800 file:text-stone-800 dark:file:text-stone-200 hover:file:bg-[#FFE259] cursor-pointer"
              />
              <input
                type="text"
                name="image_url_fallback"
                defaultValue={initialProduct?.image_url || ''}
                placeholder="O pega una URL de imagen directa (opcional)"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-[11px] text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3 font-serif">
          <Link
            href="/tienda"
            className="px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold text-xs uppercase tracking-wider hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
          >
            {t.common_cancel}
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{loading ? t.common_loading : isEditing ? 'Guardar Cambios' : 'Publicar en la Tienda'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
`);

// 2. components/ProductDetailView.tsx (Muestra info de último editor solo a vendedores)
saveFile('components/ProductDetailView.tsx', `
'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailAddToCart } from '@/components/ProductDetailAddToCart';
import { getProductImage } from '@/lib/productHelpers';
import type { ProductWithSeller } from '@/types/database';
import {
  ArrowLeft,
  MapPin,
  Truck,
  Store,
  ShieldCheck,
  MessageCircle,
  Ticket,
  UserCheck,
} from 'lucide-react';

interface ProductDetailViewProps {
  product: ProductWithSeller;
  relatedProducts: ProductWithSeller[];
  isSeller: boolean;
}

export function ProductDetailView({
  product,
  relatedProducts,
  isSeller,
}: ProductDetailViewProps) {
  const { t } = useLanguage();

  const isEvent =
    product.category_id === 'catas' ||
    product.category_id === 'cata_presencial' ||
    product.category_id === 'experiencia' ||
    (product.name && product.name.toLowerCase().includes('cata'));

  const imageUrl = getProductImage(product);

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Botón Volver */}
      <div className="flex items-center justify-between">
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 text-xs font-bold font-serif uppercase tracking-wider text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-[#1F1E1C] dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.prod_back_to_selection}</span>
        </Link>

        {isSeller && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 text-xs font-bold font-sans">
            <UserCheck className="w-4 h-4" />
            <span>
              Última edición por: <strong className="font-black">{product.profiles?.full_name || 'Vendedor EkhiTeka'}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Grid Principal del Producto */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Imagen del Producto */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border-2 border-stone-200 dark:border-stone-800 bg-[#FAF7F2] dark:bg-[#1C1B19] shadow-lg">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
              }}
            />
            {product.origin_region && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/80 backdrop-blur-xs text-white text-xs font-black rounded-xl uppercase tracking-wider shadow-md font-sans">
                <MapPin className="w-3.5 h-3.5 text-[#FFE259]" />
                <span>{product.origin_region}</span>
              </span>
            )}
            {isEvent && (
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-black rounded-xl uppercase tracking-wider shadow-md font-sans">
                <Ticket className="w-3.5 h-3.5" />
                <span>{product.stock} {t.event_seats_available}</span>
              </span>
            )}
          </div>
        </div>

        {/* Información & Checkout */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2 border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] font-serif">
              EkhiTeka Gourmet · Lekeitio
            </span>
            <h1 className="text-2xl sm:text-4xl font-black font-serif text-stone-900 dark:text-stone-100 leading-tight">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold text-stone-500 dark:text-stone-400 font-sans">
              {product.format && (
                <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1F1E1C] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                  {t.prod_format_label}: {product.format}
                </span>
              )}
              {product.weight_g && (
                <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1F1E1C] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                  {t.prod_weight_label}: {product.weight_g}g
                </span>
              )}
            </div>
          </div>

          {/* Precio y Añadir a la Cesta */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black font-serif text-[#1D1D1B] dark:text-[#F5F5F0]">
                {Number(product.price).toFixed(2)} €
              </span>
              <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider font-sans">
                {isEvent ? t.prod_price_per_seat : t.prod_vat_included}
              </span>
            </div>

            <ProductDetailAddToCart
              product={product}
              isSeller={isSeller}
            />
          </div>

          {/* Descripción & Notas de Cata */}
          {product.description && (
            <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <h3 className="text-xs font-black uppercase tracking-wider font-serif text-stone-800 dark:text-stone-200">
                {t.prod_details}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Caja de Consultas por Chat */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-bold font-serif text-stone-900 dark:text-[#F5F5F0]">
                {t.prod_doubt_title}
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans">
                {t.prod_doubt_desc}
              </p>
            </div>
            <Link
              href={\`/chat/\${product.seller_id || ''}?product_id=\${product.id}\`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] text-xs font-black uppercase tracking-wider transition-all font-serif shrink-0 shadow-xs hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.prod_ask_btn}</span>
            </Link>
          </div>

          {/* Garantías */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-bold text-stone-600 dark:text-stone-400 font-sans">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-800">
              <Truck className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
              <span>{t.prod_guarantee_cold}</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-800">
              <Store className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
              <span>{t.prod_guarantee_pickup}</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-800">
              <ShieldCheck className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
              <span>{t.prod_guarantee_km0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Productos Relacionados */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-stone-200 dark:border-stone-800 font-serif">
          <div className="pb-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259]">
              {t.prod_related_subtitle}
            </span>
            <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 uppercase">
              {t.prod_related_title}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
`);

// 3. app/vendedor/eventos/page.tsx (Todos los vendedores gestionan todos los eventos)
saveFile('app/vendedor/eventos/page.tsx', `
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SellerEventsView } from '@/components/SellerEventsView';

export default async function SellerEventsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'vendedor' && profile?.role !== 'admin') {
    redirect('/');
  }

  // Obtener todas las catas y eventos compartidos de la tienda
  const { data: rawEvents } = await supabase
    .from('products')
    .select(\`
      *,
      order_items (
        id,
        quantity,
        unit_price,
        subtotal,
        created_at,
        orders (
          id,
          status,
          created_at,
          buyer_id,
          profiles!orders_buyer_id_fkey (
            id,
            full_name,
            phone,
            email,
            town
          )
        )
      )
    \`)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  // Filtrar estrictamente solo las CATAS PRESENCIALES en tienda
  const events = (rawEvents || []).filter((p) => {
    const cat = (p.category_id || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();

    const isHomeOrGift =
      name.includes('casa') ||
      cat.includes('casa') ||
      cat === 'cesta' ||
      cat === 'tarjeta_regalo' ||
      name.includes('tarjeta') ||
      name.includes('cesta');

    if (isHomeOrGift) return false;

    return (
      cat === 'cata_presencial' ||
      name.includes('presencial') ||
      desc.includes('presencial') ||
      (desc.includes('fecha & hora') && desc.includes('aforo'))
    );
  });

  return <SellerEventsView events={events as any[]} />;
}
`);

// 4. app/actions/events.ts (Cualquier vendedor puede actualizar detalles de evento compartido)
saveFile('app/actions/events.ts', `
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateEventDetails(
  eventId: string,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'No autenticado.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'vendedor' && profile?.role !== 'admin') {
    return { error: 'Permisos insuficientes.' };
  }

  const name = (formData.get('name') as string)?.trim();
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string);
  const originRegion = (formData.get('origin_region') as string)?.trim() || 'Lekeitio / Bizkaia';
  const description = (formData.get('description') as string)?.trim();

  if (!name || isNaN(price) || isNaN(stock)) {
    return { error: 'Por favor, rellena todos los campos obligatorios del evento.' };
  }

  // Actualizar evento (compartido por cualquier vendedor) y registrar quién lo editó
  const { error: updateError } = await supabase
    .from('products')
    .update({
      seller_id: user.id,
      name,
      price,
      stock,
      origin_region: originRegion,
      description,
      updated_at: new Date().toISOString(),
    })
    .eq('id', eventId);

  if (updateError) {
    return { error: \`Error al actualizar el evento: \${updateError.message}\` };
  }

  // Notificar a los participantes activos
  const { data: orderItems } = await supabase
    .from('order_items')
    .select('order_id, orders!inner(id, buyer_id, status)')
    .eq('product_id', eventId);

  const activeBuyerIds = new Set<string>();
  if (orderItems) {
    for (const item of orderItems) {
      const order = item.orders as any;
      if (order && order.status !== 'cancelado' && order.buyer_id) {
        activeBuyerIds.add(order.buyer_id);
      }
    }
  }

  const notificationMessage = \`📢 AVISO DE MODIFICACIÓN EN TU EVENTO / CATA:\\n\\nSe han actualizado los datos del evento "\${name}".\\n\\n📌 Nuevos detalles:\\n\${description || 'Consulta la ficha actualizada del evento.'}\\n\\nSi tienes cualquier duda con respecto a la fecha, aforo o plazas, puedes consultarnos directamente por este chat.\`;

  const chatPromises = Array.from(activeBuyerIds).map((buyerId) =>
    supabase.from('chat_messages').insert({
      sender_id: user.id,
      receiver_id: buyerId,
      product_id: eventId,
      message: notificationMessage,
      is_read: false,
    })
  );

  await Promise.all(chatPromises);

  revalidatePath('/vendedor/eventos');
  revalidatePath('/tienda');
  revalidatePath('/experiencias');
  revalidatePath(\`/producto/\${eventId}\`);
  revalidatePath('/');

  return { success: true, notifiedCount: activeBuyerIds.size };
}

export async function removeEventParticipant(
  orderItemId: string,
  eventId: string,
  reason?: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'No autenticado.' };
  }

  const { data: itemData, error: itemError } = await supabase
    .from('order_items')
    .select(\`
      id,
      quantity,
      order_id,
      orders (
        id,
        buyer_id,
        status
      ),
      products (
        id,
        name,
        stock
      )
    \`)
    .eq('id', orderItemId)
    .single();

  if (itemError || !itemData) {
    return { error: 'No se ha encontrado la reserva a eliminar.' };
  }

  const order = itemData.orders as any;
  const product = itemData.products as any;
  const buyerId = order?.buyer_id;
  const quantity = itemData.quantity || 1;

  if (order?.id) {
    await supabase
      .from('orders')
      .update({
        status: 'cancelado',
        cancel_reason: reason || 'Cancelado y eliminado del evento por el organizador.',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);
  }

  if (product?.id) {
    const newStock = (product.stock ?? 0) + quantity;
    await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', product.id);
  }

  if (buyerId) {
    const cancellationMsg = \`⚠️ CANCELACIÓN DE PLAZAS:\\n\\nTu reserva de \${quantity} plaza(s) para el evento "\${product?.name || 'Cata / Evento'}" ha sido dada de baja por el organizador.\${
      reason ? \`\\n\\nMotivo: \${reason}\` : ''
    }\\n\\nSi necesitas más información o deseas cambiar de fecha, escríbenos directamente por aquí.\`;

    await supabase.from('chat_messages').insert({
      sender_id: user.id,
      receiver_id: buyerId,
      product_id: eventId,
      order_id: order?.id || null,
      message: cancellationMsg,
      is_read: false,
    });
  }

  revalidatePath('/vendedor/eventos');
  revalidatePath('/vendedor/pedidos');
  revalidatePath('/comprador/pedidos');
  revalidatePath('/tienda');
  revalidatePath('/');

  return { success: true };
}
`);

console.log('\\n✨ Formulario de productos y eventos compartido actualizado con éxito.');