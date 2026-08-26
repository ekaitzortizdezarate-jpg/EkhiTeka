'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { createProduct, updateProduct, deleteProduct } from '@/app/actions/products';
import type { Category, Product, StoreAddress, EventAddress } from '@/types/database';
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
  Calendar,
  Image as ImageIcon,
  Truck,
  AlertCircle,
  Plus,
  Trash,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Tag,
  Percent,
} from 'lucide-react';
import Link from 'next/link';

export type PublishingType =
  | 'producto_suelto'
  | 'cesta_gourmet'
  | 'cata_presencial'
  | 'cata_casa'
  | 'tarjeta_regalo';

export interface AddedListItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category?: string;
  format?: string;
  origin?: string;
  description?: string;
  isCustom?: boolean;
}

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

  // Precio final y cálculo de descuento
  const [finalPriceInput, setFinalPriceInput] = useState<string>(
    initialProduct?.price ? String(initialProduct.price) : ''
  );

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

  // Puntos de entrega y eventos
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

  // ==========================================
  // ESTADOS DE "PRODUCTOS DE LA LISTA"
  // ==========================================
  const [selectedListItems, setSelectedListItems] = useState<AddedListItem[]>([]);

  // 1. Selector de Catálogo
  const [catalogSelectId, setCatalogSelectId] = useState<string>(
    availableSingleProducts[0]?.id || ''
  );
  const [catalogQuantity, setCatalogQuantity] = useState<number>(1);

  const selectedCatalogProduct = useMemo(() => {
    return availableSingleProducts.find((p) => p.id === catalogSelectId) || availableSingleProducts[0];
  }, [availableSingleProducts, catalogSelectId]);

  const handleAddCatalogProduct = () => {
    if (!selectedCatalogProduct) return;
    const existingIndex = selectedListItems.findIndex((it) => it.id === selectedCatalogProduct.id);

    if (existingIndex > -1) {
      const updated = [...selectedListItems];
      updated[existingIndex].quantity += catalogQuantity;
      setSelectedListItems(updated);
    } else {
      const newItem: AddedListItem = {
        id: selectedCatalogProduct.id,
        name: selectedCatalogProduct.name,
        price: Number(selectedCatalogProduct.price),
        quantity: catalogQuantity,
        imageUrl: getProductImage(selectedCatalogProduct),
        category: selectedCatalogProduct.category_id,
        format: selectedCatalogProduct.format,
        origin: selectedCatalogProduct.origin_region || undefined,
        description: selectedCatalogProduct.description || undefined,
        isCustom: false,
      };
      setSelectedListItems([...selectedListItems, newItem]);
    }
    setCatalogQuantity(1);
  };

  // 2. Acordeón de Producto Específico / Manual
  const [isCustomAccordionOpen, setIsCustomAccordionOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customImage, setCustomImage] = useState('');
  const [customCategory, setCustomCategory] = useState('queso');
  const [customFormat, setCustomFormat] = useState('unidad');
  const [customPrice, setCustomPrice] = useState('');
  const [customOrigin, setCustomOrigin] = useState('Lekeitio / Bizkaia');
  const [customDesc, setCustomDesc] = useState('');
  const [customQuantity, setCustomQuantity] = useState(1);

  const handleAddCustomProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customPrice) {
      alert('Por favor, indica al menos el nombre y el precio del producto suelto.');
      return;
    }

    const newItem: AddedListItem = {
      id: 'custom_' + Date.now(),
      name: customName.trim(),
      price: parseFloat(customPrice) || 0,
      quantity: Math.max(1, customQuantity),
      imageUrl: customImage.trim() || '/images/secciones/Quesos.JPG',
      category: customCategory,
      format: customFormat,
      origin: customOrigin.trim() || undefined,
      description: customDesc.trim() || undefined,
      isCustom: true,
    };

    setSelectedListItems([...selectedListItems, newItem]);

    // Limpiar campos del formulario manual
    setCustomName('');
    setCustomImage('');
    setCustomPrice('');
    setCustomDesc('');
    setCustomQuantity(1);
    setIsCustomAccordionOpen(false);
  };

  // Modificar cantidades o eliminar de "Productos de la lista"
  const handleUpdateItemQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      setSelectedListItems(selectedListItems.filter((it) => it.id !== id));
      return;
    }
    setSelectedListItems(
      selectedListItems.map((it) => (it.id === id ? { ...it, quantity: newQty } : it))
    );
  };

  const handleRemoveListItem = (id: string) => {
    setSelectedListItems(selectedListItems.filter((it) => it.id !== id));
  };

  // Suma total calculada de los productos sueltos
  const sumOfLooseItems = useMemo(() => {
    return selectedListItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  }, [selectedListItems]);

  // Cálculo del porcentaje de descuento
  const discountPercentage = useMemo(() => {
    const entered = parseFloat(finalPriceInput);
    if (sumOfLooseItems > 0 && !isNaN(entered) && entered > 0) {
      const diff = sumOfLooseItems - entered;
      return Math.round((diff / sumOfLooseItems) * 100);
    }
    return null;
  }, [sumOfLooseItems, finalPriceInput]);

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
        formData.set('origin_region', `${eventLoc.title} · ${eventLoc.town} (${eventLoc.province})`);
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

    // Auto-generar lista de artículos en la descripción si se crearon en "Productos de la lista"
    if (isPackOrEvent && selectedListItems.length > 0) {
      const rawDesc = (formData.get('description') as string) || '';
      const itemsFormatted = selectedListItems.map(
        (it) => `• ${it.name} (x${it.quantity}) — ${(it.price * it.quantity).toFixed(2)} €`
      );

      if (!rawDesc.includes('Productos incluidos')) {
        const fullDesc = `${rawDesc.trim()}\n\n📦 Productos incluidos en esta selección:\n${itemsFormatted.join('\n')}\n\nValor suma productos: ${sumOfLooseItems.toFixed(2)} €`;
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
            className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              publishingType === 'producto_suelto'
                ? 'border-[#FFE259] bg-[#FFE259]/15 text-[#1D1D1B] dark:text-white font-bold shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] text-stone-600 dark:text-stone-400 hover:border-stone-400'
            }`}
          >
            <Package className="w-5 h-5 text-amber-600 dark:text-[#FFE259]" />
            <span className="text-xs font-bold">Producto Suelto</span>
          </button>

          <button
            type="button"
            onClick={() => setPublishingType('cesta_gourmet')}
            className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              publishingType === 'cesta_gourmet'
                ? 'border-[#FFE259] bg-[#FFE259]/15 text-[#1D1D1B] dark:text-white font-bold shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] text-stone-600 dark:text-stone-400 hover:border-stone-400'
            }`}
          >
            <Gift className="w-5 h-5 text-amber-600 dark:text-[#FFE259]" />
            <span className="text-xs font-bold">Cesta / Lote</span>
          </button>

          <button
            type="button"
            onClick={() => setPublishingType('cata_presencial')}
            className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              publishingType === 'cata_presencial'
                ? 'border-[#FFE259] bg-[#FFE259]/15 text-[#1D1D1B] dark:text-white font-bold shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] text-stone-600 dark:text-stone-400 hover:border-stone-400'
            }`}
          >
            <Wine className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold">Cata Presencial</span>
          </button>

          <button
            type="button"
            onClick={() => setPublishingType('cata_casa')}
            className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              publishingType === 'cata_casa'
                ? 'border-[#FFE259] bg-[#FFE259]/15 text-[#1D1D1B] dark:text-white font-bold shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] text-stone-600 dark:text-stone-400 hover:border-stone-400'
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-[#FFE259]" />
            <span className="text-xs font-bold">Cata en Casa</span>
          </button>

          <button
            type="button"
            onClick={() => setPublishingType('tarjeta_regalo')}
            className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              publishingType === 'tarjeta_regalo'
                ? 'border-[#FFE259] bg-[#FFE259]/15 text-[#1D1D1B] dark:text-white font-bold shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] text-stone-600 dark:text-stone-400 hover:border-stone-400'
            }`}
          >
            <CreditCard className="w-5 h-5 text-amber-600 dark:text-[#FFE259]" />
            <span className="text-xs font-bold">Tarjeta Regalo</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-xs font-sans text-xs">
        <div className="space-y-5">
          <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block font-serif">
            2. Datos del Producto o Evento
          </span>

          {/* 1. Nombre del Producto */}
          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {publishingType === 'cata_presencial' ? 'Nombre del Evento / Cata *' : 'Nombre del Producto *'}
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

          {/* 2. Añadir Productos Sueltos del Catálogo a esta Selección */}
          {isPackOrEvent && (
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-[#141312] border border-amber-200 dark:border-stone-800 space-y-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#C68D07] dark:text-[#FFE259] block font-serif">
                  Añadir Productos Sueltos del Catálogo a esta Selección
                </span>
                <p className="text-[10.5px] text-stone-500 dark:text-stone-400">
                  Selecciona en la lista desplegable un producto existente para ver su ficha, indicar cantidad y añadirlo.
                </p>
              </div>

              {/* Selector desplegable con vista previa */}
              <div className="space-y-3">
                <select
                  value={catalogSelectId}
                  onChange={(e) => setCatalogSelectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1F1E1C] border border-stone-300 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
                >
                  {availableSingleProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({Number(p.price).toFixed(2)} €)
                    </option>
                  ))}
                </select>

                {/* Tarjeta de visualización previa del producto seleccionado */}
                {selectedCatalogProduct && (
                  <div className="p-3 bg-white dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-700 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 w-full">
                      <img
                        src={getProductImage(selectedCatalogProduct)}
                        alt={selectedCatalogProduct.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                      />
                      <div className="min-w-0 space-y-0.5">
                        <p className="font-bold text-stone-900 dark:text-stone-100 text-xs truncate">
                          {selectedCatalogProduct.name}
                        </p>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          Precio: <strong className="text-amber-600 dark:text-[#FFE259]">{Number(selectedCatalogProduct.price).toFixed(2)} €</strong> · {selectedCatalogProduct.format || 'unidad'} · {selectedCatalogProduct.origin_region || 'Lekeitio'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <div className="flex items-center gap-1.5">
                        <label className="text-[11px] font-bold text-stone-500">Cantidad:</label>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={catalogQuantity}
                          onChange={(e) => setCatalogQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-14 px-2 py-1 bg-stone-50 dark:bg-[#141312] border border-stone-300 dark:border-stone-700 rounded-lg text-center font-bold"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleAddCatalogProduct}
                        className="px-4 py-1.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black uppercase text-xs rounded-xl shadow-xs cursor-pointer font-serif flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Meter productos sueltos específicos (uno a uno) - Acordeón Recogido */}
          {isPackOrEvent && (
            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden bg-stone-50/50 dark:bg-[#141312]">
              {/* Título clickeable del acordeón */}
              <button
                type="button"
                onClick={() => setIsCustomAccordionOpen(!isCustomAccordionOpen)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-100 dark:hover:bg-[#1F1E1C] transition-colors cursor-pointer"
              >
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-900 dark:text-stone-100 block font-serif">
                    Meter productos sueltos específicos (uno a uno)
                  </span>
                  <p className="text-[10.5px] text-stone-500 dark:text-stone-400 font-sans">
                    Pulsa aquí para desplegar el formulario y crear un artículo nuevo exclusivo para esta selección.
                  </p>
                </div>
                <div className="p-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  {isCustomAccordionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Formulario desplegable */}
              {isCustomAccordionOpen && (
                <div className="p-4 border-t border-stone-200 dark:border-stone-800 space-y-3 bg-white dark:bg-[#1C1B19] animate-fadeIn font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Nombre *</label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="Ej: Cuña Queso Ahumado Artesano 250g"
                        className="w-full px-3 py-2 bg-stone-50 dark:bg-[#141312] border border-stone-300 dark:border-stone-700 rounded-xl font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Imagen (URL directa)</label>
                      <input
                        type="text"
                        value={customImage}
                        onChange={(e) => setCustomImage(e.target.value)}
                        placeholder="https://... o /images/secciones/Quesos.JPG"
                        className="w-full px-3 py-2 bg-stone-50 dark:bg-[#141312] border border-stone-300 dark:border-stone-700 rounded-xl text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Categoría</label>
                      <select
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-[#141312] border border-stone-300 dark:border-stone-700 rounded-xl"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name_es}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Formato</label>
                      <select
                        value={customFormat}
                        onChange={(e) => setCustomFormat(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-[#141312] border border-stone-300 dark:border-stone-700 rounded-xl"
                      >
                        <option value="unidad">Unidad</option>
                        <option value="peso_kg">Kg / Cuña</option>
                        <option value="tarro">Tarro</option>
                        <option value="lata">Lata</option>
                        <option value="botella">Botella</option>
                        <option value="pack">Pack</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Precio (€) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.10"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        placeholder="7.50"
                        className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-[#141312] border border-stone-300 dark:border-stone-700 rounded-xl font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={customQuantity}
                        onChange={(e) => setCustomQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-[#141312] border border-stone-300 dark:border-stone-700 rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Denominación / Origen</label>
                    <input
                      type="text"
                      value={customOrigin}
                      onChange={(e) => setCustomOrigin(e.target.value)}
                      placeholder="Ej: Lekeitio · Bizkaia / Idiazabal"
                      className="w-full px-3 py-1.5 bg-stone-50 dark:bg-[#141312] border border-stone-300 dark:border-stone-700 rounded-xl text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Descripción</label>
                    <textarea
                      rows={2}
                      value={customDesc}
                      onChange={(e) => setCustomDesc(e.target.value)}
                      placeholder="Características, curación o notas de este producto..."
                      className="w-full px-3 py-1.5 bg-stone-50 dark:bg-[#141312] border border-stone-300 dark:border-stone-700 rounded-xl text-[11px]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end font-serif">
                    <button
                      type="button"
                      onClick={handleAddCustomProduct}
                      className="px-5 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-black uppercase text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#FFE259] dark:text-[#1D1D1B]" />
                      <span>Añadir a la lista</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. PRODUCTOS DE LA LISTA */}
          {isPackOrEvent && (
            <div className="p-4 rounded-3xl bg-stone-50 dark:bg-[#141312] border-2 border-stone-200 dark:border-stone-800 space-y-4 font-sans">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-600 dark:text-[#FFE259]" />
                  <h3 className="font-black text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100 font-serif">
                    Productos de la lista ({selectedListItems.length})
                  </h3>
                </div>
                <span className="text-xs font-black text-stone-900 dark:text-[#F5F5F0]">
                  Suma total: <strong className="text-amber-600 dark:text-[#FFE259] font-serif text-sm">{sumOfLooseItems.toFixed(2)} €</strong>
                </span>
              </div>

              {selectedListItems.length > 0 ? (
                <div className="space-y-2">
                  {selectedListItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.imageUrl || '/images/secciones/Quesos.JPG'}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-stone-900 dark:text-stone-100 truncate text-xs">
                            {item.name}
                          </p>
                          <p className="text-[10.5px] text-stone-500 dark:text-stone-400">
                            {item.price.toFixed(2)} € / ud {item.origin ? `· ${item.origin}` : ''} {item.isCustom ? '(Específico)' : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Control de cantidad */}
                        <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-[#141312] p-0.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateItemQuantity(item.id, item.quantity - 1)}
                            className="w-5 h-5 flex items-center justify-center font-bold text-xs hover:bg-stone-200 dark:hover:bg-stone-700 rounded cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-black">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateItemQuantity(item.id, item.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center font-bold text-xs hover:bg-stone-200 dark:hover:bg-stone-700 rounded cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-serif font-black text-xs text-stone-900 dark:text-stone-100 min-w-[55px] text-right">
                          {(item.price * item.quantity).toFixed(2)} €
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveListItem(item.id)}
                          className="p-1 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white/60 dark:bg-[#1C1B19]/60 border border-dashed border-stone-300 dark:border-stone-700 text-center text-stone-400 text-xs">
                  Aún no has añadido productos sueltos a esta lista.
                </div>
              )}
            </div>
          )}

          {/* 5. Precio con sugerencia de fondo y Porcentaje de Descuento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-stone-700 dark:text-stone-300">
                  {publishingType === 'cata_presencial' ? 'Precio por Plaza (€) *' : 'Precio de Venta (€) *'}
                </label>
                {discountPercentage !== null && (
                  <span
                    className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md font-black text-[10.5px] ${
                      discountPercentage > 0
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                        : discountPercentage === 0
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                        : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300'
                    }`}
                  >
                    <Percent className="w-3 h-3" />
                    <span>
                      {discountPercentage > 0 ? `${discountPercentage}% Dto. vs suma` : `+${Math.abs(discountPercentage)}% vs suma`}
                    </span>
                  </span>
                )}
              </div>
              <input
                type="number"
                step="0.01"
                min="0.10"
                name="price"
                required
                value={finalPriceInput}
                onChange={(e) => setFinalPriceInput(e.target.value)}
                placeholder={sumOfLooseItems > 0 ? sumOfLooseItems.toFixed(2) : '25.00'}
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
              />
              {sumOfLooseItems > 0 && !finalPriceInput && (
                <span className="text-[10px] text-stone-400 block mt-1">
                  Sugerencia calculada de productos sueltos: {sumOfLooseItems.toFixed(2)} €
                </span>
              )}
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
                : 'Descripción, notas de cata y presentación'}
            </label>
            <textarea
              name="description"
              rows={4}
              required={publishingType === 'cata_presencial'}
              defaultValue={initialProduct?.description || ''}
              placeholder={
                publishingType === 'cata_presencial'
                  ? 'Ej: Fecha: Sábado 20 de Septiembre · 19:30h\nDuración: 90 minutos\nIncluye 5 quesos artesanos de pastor y maridaje con 2 txakolis de Bizkaia.'
                  : 'Describe el perfil de sabor, curación, aromas e historia del productor...'
              }
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>

        {/* 6. Ubicación de Evento (Catas Presenciales) */}
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

        {/* 7. Métodos de Entrega & Puntos de Recogida */}
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
                className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  hasDomicilio
                    ? 'border-[#FFE259] bg-[#FFE259]/15 text-stone-900 dark:text-[#F5F5F0]'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#141312] text-stone-600 dark:text-stone-400'
                }`}
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
                className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  hasPickup
                    ? 'border-[#FFE259] bg-[#FFE259]/15 text-stone-900 dark:text-[#F5F5F0]'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#141312] text-stone-600 dark:text-stone-400'
                }`}
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

            {/* Puntos de Entrega (Se muestra SOLO si se selecciona Recogida en Tienda) */}
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
                          className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#FFE259] bg-[#FFE259]/15 text-stone-900 dark:text-[#F5F5F0]'
                              : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#141312] text-stone-600 dark:text-stone-400'
                          }`}
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

        {/* 8. Fotografía del Producto */}
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
