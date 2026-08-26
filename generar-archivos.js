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

// components/SellerProductForm.tsx
saveFile('components/SellerProductForm.tsx', `
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { createProduct, updateProduct, deleteProduct } from '@/app/actions/products';
import type { Category, Product, StoreAddress, EventAddress } from '@/types/database';
import {
  Package,
  ArrowLeft,
  Trash2,
  Check,
  Sparkles,
  Gift,
  Wine,
  CreditCard,
  Calendar,
  Image as ImageIcon,
  Truck,
  AlertCircle,
  Plus,
  X,
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

  // Puntos de entrega
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

  // 1. Productos seleccionados del catálogo (vía dropdown)
  const [catalogProductIds, setCatalogProductIds] = useState<string[]>([]);
  const [selectedCatalogIdToAdd, setSelectedCatalogIdToAdd] = useState<string>(
    availableSingleProducts[0]?.id || ''
  );

  const handleAddCatalogProduct = () => {
    if (!selectedCatalogIdToAdd) return;
    if (!catalogProductIds.includes(selectedCatalogIdToAdd)) {
      setCatalogProductIds([...catalogProductIds, selectedCatalogIdToAdd]);
    }
  };

  const handleRemoveCatalogProduct = (id: string) => {
    setCatalogProductIds(catalogProductIds.filter((pId) => pId !== id));
  };

  // 2. Productos sueltos creados manualmente sólo para este lote/evento
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [newCustomInput, setNewCustomInput] = useState('');

  const handleAddCustomItem = () => {
    const trimmed = newCustomInput.trim();
    if (!trimmed) return;
    if (!customItems.includes(trimmed)) {
      setCustomItems([...customItems, trimmed]);
      setNewCustomInput('');
    }
  };

  const handleRemoveCustomItem = (indexToRemove: number) => {
    setCustomItems(customItems.filter((_, idx) => idx !== indexToRemove));
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

    formData.delete('delivery_methods');
    deliveryMethods.forEach((m) => formData.append('delivery_methods', m));

    formData.delete('pickup_address_ids');
    if (hasPickup) {
      selectedPickupIds.forEach((id) => formData.append('pickup_address_ids', id));
    }

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

    // Componer descripción unificada si hay artículos incluidos (del catálogo o manuales)
    const catalogSelectedNames = availableSingleProducts
      .filter((p) => catalogProductIds.includes(p.id))
      .map((p) => \`• \${p.name}\`);

    const manualItemNames = customItems.map((it) => \`• \${it}\`);
    const allIncluded = [...catalogSelectedNames, ...manualItemNames];

    if (
      (publishingType === 'cesta_gourmet' ||
        publishingType === 'cata_presencial' ||
        publishingType === 'cata_casa') &&
      allIncluded.length > 0
    ) {
      const rawDesc = (formData.get('description') as string) || '';
      if (!rawDesc.includes('Artículos incluidos')) {
        const fullDesc = \`\${rawDesc.trim()}\\n\\n📦 Artículos incluidos en esta selección:\\n\${allIncluded.join('\\n')}\`;
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

  const isPackOrEvent =
    publishingType === 'cesta_gourmet' ||
    publishingType === 'cata_presencial' ||
    publishingType === 'cata_casa';

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

      {/* 1. Selector de Tipología */}
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
        <div className="space-y-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block font-serif">
            2. Datos del Producto o Evento
          </span>

          {/* 1. Nombre del Producto */}
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

          {/* 2. Añadir Productos Sueltos del Catálogo a esta Selección (Desplegable) */}
          {isPackOrEvent && (
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-[#141312] border border-amber-200 dark:border-stone-800 space-y-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#C68D07] dark:text-[#FFE259] block font-serif">
                  Añadir Productos Sueltos del Catálogo a esta Selección
                </span>
                <p className="text-[10.5px] text-stone-500 dark:text-stone-400">
                  Selecciona en la lista desplegable los artículos de la tienda que componen este pack o experiencia.
                </p>
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedCatalogIdToAdd}
                  onChange={(e) => setSelectedCatalogIdToAdd(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-white dark:bg-[#1F1E1C] border border-stone-300 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
                >
                  {availableSingleProducts.length > 0 ? (
                    availableSingleProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({Number(p.price).toFixed(2)} €)
                      </option>
                    ))
                  ) : (
                    <option value="">No hay productos individuales en catálogo</option>
                  )}
                </select>

                <button
                  type="button"
                  onClick={handleAddCatalogProduct}
                  disabled={!selectedCatalogIdToAdd}
                  className="px-4 py-2 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black uppercase text-xs rounded-xl shadow-xs cursor-pointer disabled:opacity-50 shrink-0 flex items-center gap-1 font-serif"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir</span>
                </button>
              </div>

              {/* Lista de productos del catálogo agregados */}
              {catalogProductIds.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {availableSingleProducts
                    .filter((p) => catalogProductIds.includes(p.id))
                    .map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-700"
                      >
                        <span className="font-bold text-stone-800 dark:text-stone-200 truncate">
                          • {p.name} ({Number(p.price).toFixed(2)} €)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCatalogProduct(p.id)}
                          className="p-1 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Meter productos sueltos, uno a uno, generados sólo para este producto/evento */}
          {isPackOrEvent && (
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-800 space-y-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 block font-serif">
                  Meter productos sueltos específicos (uno a uno)
                </span>
                <p className="text-[10.5px] text-stone-500 dark:text-stone-400">
                  Escribe artículos o complementos exclusivos que se generarán únicamente para esta selección.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCustomInput}
                  onChange={(e) => setNewCustomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomItem();
                    }
                  }}
                  placeholder="Ej: Cuña Queso Ahumado de Caserío 250g..."
                  className="flex-1 px-3.5 py-2 bg-white dark:bg-[#1F1E1C] border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-medium"
                />
                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  className="px-4 py-2 bg-stone-800 dark:bg-stone-200 hover:bg-stone-900 text-white dark:text-stone-900 font-black uppercase text-xs rounded-xl shadow-xs cursor-pointer shrink-0 flex items-center gap-1 font-serif"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Meter</span>
                </button>
              </div>

              {/* Lista de productos específicos agregados */}
              {customItems.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {customItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-700"
                    >
                      <span className="font-bold text-stone-800 dark:text-stone-200 truncate">
                        • {item}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomItem(idx)}
                        className="p-1 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. Precio y Campos siguientes */}
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

        {/* Ubicación de Evento (Catas Presenciales) */}
        {publishingType === 'cata_presencial' && (
          <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 block font-serif flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>3. Punto de Evento (Ubicación única)</span>
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

        {/* Métodos de Entrega & Puntos de Recogida (Estilo unificado) */}
        {publishingType !== 'cata_presencial' && (
          <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#C68D07] dark:text-[#FFE259] block font-serif flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              <span>3. Métodos de Entrega & Puntos de Recogida en Tienda</span>
            </span>

            {/* Opciones con diseño idéntico */}
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
                  onChange={() => {}}
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
                  onChange={() => {}}
                  className="w-4 h-4 accent-[#FFE259] rounded cursor-pointer"
                />
                <span className="font-bold text-xs">Recogida en tienda</span>
              </div>
            </div>

            {/* Puntos de Entrega con el MISMO ESTILO que las opciones de arriba */}
            {hasPickup && (
              <div className="space-y-2 pt-2 animate-fadeIn">
                <label className="font-bold text-stone-700 dark:text-stone-300 block">
                  Selecciona en qué puntos de entrega/tienda dar la opción de recogida:
                </label>
                {activePickupList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activePickupList.map((addr) => {
                      const isSelected = selectedPickupIds.includes(addr.id);
                      return (
                        <div
                          key={addr.id}
                          onClick={() => handleTogglePickup(addr.id)}
                          className={\`flex items-start gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer \${
                            isSelected
                              ? 'border-[#FFE259] bg-[#FFE259]/15 text-stone-900 dark:text-[#F5F5F0]'
                              : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#141312] text-stone-600 dark:text-stone-400'
                          }\`}
                        >
                          <input
                            type="checkbox"
                            name="pickup_address_ids"
                            value={addr.id}
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 accent-[#FFE259] rounded mt-0.5"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-xs block truncate">{addr.title}</span>
                            <span className="text-[10px] opacity-75 block truncate">
                              {addr.street} {addr.number || ''}, {addr.town} ({addr.province})
                            </span>
                          </div>
                        </div>
                      );
                    })}
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

        {/* 5. Fotografía del Producto */}
        <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800">
          <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block font-serif flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4" />
            <span>4. Fotografía del Producto / Evento</span>
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

console.log('\n✨ Formulario de productos reordenado y puntos de recogida sincronizados con éxito.');