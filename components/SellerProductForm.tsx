'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { createProduct, updateProduct, deleteProduct } from '@/app/actions/products';
import type { Category, Product, StoreAddress, EventAddress } from '@/types/database';
import {
  getProductImage,
  getSellerDescription,
  getProductWeightOrVolume,
  getCleanDescription,
  getPackItems,
} from '@/lib/productHelpers';
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
  Clock,
  Ticket,
  MapPin,
  AlignLeft,
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
  weight_g?: number | null;
  weight_display?: string | null;
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
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initialProduct);

  const initialMeta = useMemo(() => {
    if (!initialProduct?.description) return null;
    const match = initialProduct.description.match(/<!-- META:({.*?}) -->/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch {}
    }
    return null;
  }, [initialProduct]);

  const allCategories = useMemo(() => {
    const list = [...categories];
    if (!list.some((c) => c.id === 'producto_unico')) {
      list.push({
        id: 'producto_unico',
        name_es: 'Producto único',
        name_eu: 'Produktu bakarra',
        name_en: 'Unique product',
        name_fr: 'Produit unique',
        icon: 'Sparkles',
      });
    }
    return list;
  }, [categories]);

  const [weightUnit, setWeightUnit] = useState<string>(() => {
    if (initialMeta?.unit) return initialMeta.unit;
    if (initialProduct?.weight_g && initialProduct.weight_g >= 1000 && initialProduct.weight_g % 1000 === 0) return 'kg';
    return 'g';
  });

  const [weightAmount, setWeightAmount] = useState<string>(() => {
    if (initialMeta?.amount !== undefined) return String(initialMeta.amount);
    if (initialProduct?.weight_g) {
      if (initialProduct.weight_g >= 1000 && initialProduct.weight_g % 1000 === 0) {
        return String(initialProduct.weight_g / 1000);
      }
      return String(initialProduct.weight_g);
    }
    return '';
  });

  const [minPeople, setMinPeople] = useState<number>(() => {
    if (initialMeta?.min_people !== undefined) return Number(initialMeta.min_people);
    return 2;
  });

  const [maxPeople, setMaxPeople] = useState<number>(() => {
    if (initialMeta?.max_people !== undefined) return Number(initialMeta.max_people);
    return 4;
  });

  const [eventDate, setEventDate] = useState<string>(() => initialMeta?.event_date || '');
  const [eventStartTime, setEventStartTime] = useState<string>(() => {
    if (initialMeta?.event_start_time) return initialMeta.event_start_time;
    if (initialMeta?.event_time) {
      const parts = initialMeta.event_time.split('-');
      if (parts[0]) return parts[0].trim();
    }
    return '19:00';
  });
  const [eventEndTime, setEventEndTime] = useState<string>(() => {
    if (initialMeta?.event_end_time) return initialMeta.event_end_time;
    if (initialMeta?.event_time) {
      const parts = initialMeta.event_time.split('-');
      if (parts[1]) return parts[1].trim();
    }
    return '21:00';
  });

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
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [isUnlimited, setIsUnlimited] = useState<boolean>(initialProduct?.is_unlimited_stock || false);

  const cleanSingleProducts = useMemo(() => {
    return availableSingleProducts.filter((p) => {
      const cat = (p.category_id || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      const format = (p.format || '').toLowerCase();

      const isExcludedCategory =
        cat === 'cesta' ||
        cat === 'cesta_gourmet' ||
        cat === 'cata' ||
        cat === 'cata_presencial' ||
        cat === 'cata_casa' ||
        cat === 'tarjeta_regalo' ||
        cat === 'experiencia';

      const isExcludedName =
        name.includes('cesta') ||
        name.includes('cata') ||
        name.includes('tarjeta') ||
        name.includes('dastaketa') ||
        name.includes('pack') ||
        name.includes('lote');

      const isExcludedFormat = format === 'pack';

      return !isExcludedCategory && !isExcludedName && !isExcludedFormat;
    });
  }, [availableSingleProducts]);

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

  const activePickupList = pickupAddresses.filter((a) => a.is_active);
  const activeEventList = eventAddresses.filter((a) => a.is_active);

  const availableVenues = useMemo(() => {
    const list: { id: string; title: string; street: string; number?: string; town: string; province: string }[] = [];

    // 1. Puntos de entrega / tiendas generados en la tienda
    activePickupList.forEach((addr) => {
      list.push({
        id: addr.id,
        title: addr.title
          ? `${addr.title} — ${addr.street} ${addr.number || ''}, ${addr.town} (${addr.province})`
          : `${addr.street} ${addr.number || ''}, ${addr.town} (${addr.province})`,
        street: addr.street,
        number: addr.number,
        town: addr.town,
        province: addr.province,
      });
    });

    // 2. Locales adicionales de eventos
    activeEventList.forEach((ev) => {
      if (!list.some((l) => l.id === ev.id)) {
        list.push({
          id: ev.id,
          title: `${ev.title} — ${ev.street} ${ev.number || ''}, ${ev.town} (${ev.province})`,
          street: ev.street,
          number: ev.number,
          town: ev.town,
          province: ev.province,
        });
      }
    });

    return list;
  }, [activePickupList, activeEventList]);

  const [selectedPickupIds, setSelectedPickupIds] = useState<string[]>(
    initialProduct?.pickup_address_ids && initialProduct.pickup_address_ids.length > 0
      ? initialProduct.pickup_address_ids
      : activePickupList.map((a) => a.id)
  );

  const [selectedEventId, setSelectedEventId] = useState<string>(() => {
    if (initialProduct?.event_address_id) return initialProduct.event_address_id;
    if (initialMeta?.event_address_id) return initialMeta.event_address_id;
    return activePickupList[0]?.id || activeEventList[0]?.id || '';
  });

  const initialPackList = useMemo<AddedListItem[]>(() => {
    if (!initialProduct) return [];

    // 1. From initialMeta.pack_items
    if (Array.isArray(initialMeta?.pack_items) && initialMeta.pack_items.length > 0) {
      return initialMeta.pack_items.map((it: any) => {
        const matched = availableSingleProducts.find(
          (p) => p.id === it.id || p.name.toLowerCase() === (it.name || '').toLowerCase()
        );
        return {
          id: it.id || matched?.id || Math.random().toString(),
          name: it.name || matched?.name || '',
          price: it.price !== undefined ? Number(it.price) : Number(matched?.price || 0),
          quantity: it.quantity || 1,
          imageUrl: it.imageUrl || (matched ? getProductImage(matched) : null),
          category: it.category || matched?.category_id,
          format: it.format || matched?.format,
          origin: it.origin || matched?.origin_region || undefined,
          description:
            it.description ||
            (matched
              ? getSellerDescription(matched.description) || getCleanDescription(matched.description)
              : undefined),
          weight_g: it.weight_g !== undefined ? it.weight_g : matched?.weight_g,
          weight_display:
            it.weight_display ||
            (it.weight_g
              ? it.weight_g >= 1000 && it.weight_g % 100 === 0
                ? `${(it.weight_g / 1000).toFixed(it.weight_g % 1000 === 0 ? 0 : 1)} kg`
                : `${it.weight_g}g`
              : matched?.weight_g
              ? matched.weight_g >= 1000 && matched.weight_g % 100 === 0
                ? `${(matched.weight_g / 1000).toFixed(matched.weight_g % 1000 === 0 ? 0 : 1)} kg`
                : `${matched.weight_g}g`
              : undefined),
          isCustom: !matched,
        };
      });
    }

    // 2. Fallback to getPackItems from description
    const packItems = getPackItems(initialProduct);
    if (packItems.length > 0) {
      return packItems.map((it) => {
        const matched = availableSingleProducts.find(
          (p) => (it.id && p.id === it.id) || p.name.toLowerCase() === it.name.toLowerCase()
        );
        return {
          id: it.id || matched?.id || Math.random().toString(),
          name: it.name || matched?.name || '',
          price: it.price !== undefined ? Number(it.price) : Number(matched?.price || 0),
          quantity: it.quantity || 1,
          imageUrl: it.imageUrl || (matched ? getProductImage(matched) : null),
          category: matched?.category_id,
          format: it.format || matched?.format,
          origin: it.origin || matched?.origin_region || undefined,
          description:
            it.description ||
            (matched
              ? getSellerDescription(matched.description) || getCleanDescription(matched.description)
              : undefined),
          weight_g: it.weight_g !== undefined ? it.weight_g : matched?.weight_g,
          weight_display:
            it.weight_display ||
            (matched?.weight_g
              ? matched.weight_g >= 1000 && matched.weight_g % 100 === 0
                ? `${(matched.weight_g / 1000).toFixed(matched.weight_g % 1000 === 0 ? 0 : 1)} kg`
                : `${matched.weight_g}g`
              : undefined),
          isCustom: !matched,
        };
      });
    }

    return [];
  }, [initialProduct, initialMeta, availableSingleProducts]);

  const [selectedListItems, setSelectedListItems] = useState<AddedListItem[]>(initialPackList);

  const [catalogSelectId, setCatalogSelectId] = useState<string>(
    cleanSingleProducts[0]?.id || ''
  );
  const [catalogQuantityStr, setCatalogQuantityStr] = useState<string>('1');

  useEffect(() => {
    if (!catalogSelectId && cleanSingleProducts.length > 0) {
      setCatalogSelectId(cleanSingleProducts[0].id);
    }
  }, [cleanSingleProducts, catalogSelectId]);

  const selectedCatalogProduct = useMemo(() => {
    return cleanSingleProducts.find((p) => p.id === catalogSelectId) || cleanSingleProducts[0];
  }, [cleanSingleProducts, catalogSelectId]);

  const handleAddCatalogProduct = () => {
    const qty = parseFloat(catalogQuantityStr);
    if (isNaN(qty) || qty <= 0) {
      alert('Por favor, introduce una cantidad mayor que 0.');
      return;
    }
    if (!selectedCatalogProduct) return;

    const existingIndex = selectedListItems.findIndex((it) => it.id === selectedCatalogProduct.id);

    if (existingIndex > -1) {
      const updated = [...selectedListItems];
      updated[existingIndex].quantity += Math.round(qty);
      setSelectedListItems(updated);
    } else {
      const newItem: AddedListItem = {
        id: selectedCatalogProduct.id,
        name: selectedCatalogProduct.name,
        price: Number(selectedCatalogProduct.price),
        quantity: Math.round(qty),
        imageUrl: getProductImage(selectedCatalogProduct),
        category: selectedCatalogProduct.category_id,
        format: selectedCatalogProduct.format,
        origin: selectedCatalogProduct.origin_region || undefined,
        description:
          getSellerDescription(selectedCatalogProduct.description) ||
          getCleanDescription(selectedCatalogProduct.description) ||
          undefined,
        weight_g: selectedCatalogProduct.weight_g || undefined,
        weight_display: getProductWeightOrVolume(selectedCatalogProduct) || undefined,
        isCustom: false,
      };
      setSelectedListItems([...selectedListItems, newItem]);
    }
    setCatalogQuantityStr('1');
  };

  // 2. Acordeón de Producto Específico / Manual
  const [isCustomAccordionOpen, setIsCustomAccordionOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [customImagePreview, setCustomImagePreview] = useState<string>('');
  const [customImageFileName, setCustomImageFileName] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState('queso');
  const [customFormat, setCustomFormat] = useState('unidad');
  const [customPrice, setCustomPrice] = useState('');
  const [customOrigin, setCustomOrigin] = useState('Lekeitio / Bizkaia');
  const [customDesc, setCustomDesc] = useState('');
  const [customQuantityStr, setCustomQuantityStr] = useState<string>('1');

  const handleCustomFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomImageFileName(file.name);
      const url = URL.createObjectURL(file);
      setCustomImagePreview(url);
    } else {
      setCustomImageFileName(null);
    }
  };

  const handleAddCustomProduct = (e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.preventDefault();

    const qty = parseFloat(customQuantityStr);
    if (isNaN(qty) || qty <= 0) {
      alert('La cantidad de este producto suelto debe ser un número mayor de 0 (> 0).');
      return;
    }

    if (!customName.trim()) {
      alert('Por favor, indica el nombre del producto suelto.');
      return;
    }

    const priceNum = parseFloat(customPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Por favor, indica un precio válido mayor de 0.');
      return;
    }

    const newItem: AddedListItem = {
      id: 'custom_' + Date.now(),
      name: customName.trim(),
      price: priceNum,
      quantity: Math.round(qty),
      imageUrl: customImagePreview || customImageUrl.trim() || '/images/secciones/Quesos.JPG',
      category: customCategory,
      format: customFormat,
      origin: customOrigin.trim() || undefined,
      description: customDesc.trim() || undefined,
      isCustom: true,
    };

    setSelectedListItems((prev) => [...prev, newItem]);

    setCustomName('');
    setCustomImageUrl('');
    setCustomImagePreview('');
    setCustomImageFileName(null);
    setCustomPrice('');
    setCustomDesc('');
    setCustomQuantityStr('1');
    setIsCustomAccordionOpen(false);
  };

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

  const sumOfLooseItems = useMemo(() => {
    return selectedListItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  }, [selectedListItems]);

  const [finalPriceInput, setFinalPriceInput] = useState<string>(
    initialProduct?.price ? String(initialProduct.price) : ''
  );
  const [discountInput, setDiscountInput] = useState<string>(() => {
    if (initialMeta?.discount_percent !== undefined) {
      return String(initialMeta.discount_percent);
    }
    return '0';
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (sumOfLooseItems > 0) {
      const disc = parseFloat(discountInput) || 0;
      const newPrice = sumOfLooseItems * (1 - disc / 100);
      setFinalPriceInput(Math.max(0, newPrice).toFixed(2));
    }
  }, [sumOfLooseItems]);

  const handlePriceChange = (val: string) => {
    setFinalPriceInput(val);
    const num = parseFloat(val);
    if (sumOfLooseItems > 0 && !isNaN(num)) {
      const calculatedDiscount = ((sumOfLooseItems - num) / sumOfLooseItems) * 100;
      setDiscountInput(
        calculatedDiscount % 1 === 0
          ? calculatedDiscount.toFixed(0)
          : calculatedDiscount.toFixed(1)
      );
    } else if (val === '') {
      setDiscountInput('');
    }
  };

  const handleDiscountChange = (val: string) => {
    setDiscountInput(val);
    const num = parseFloat(val);
    if (sumOfLooseItems > 0 && !isNaN(num)) {
      const calculatedPrice = sumOfLooseItems * (1 - num / 100);
      setFinalPriceInput(Math.max(0, calculatedPrice).toFixed(2));
    } else if (val === '') {
      setFinalPriceInput('');
    }
  };

  const numericDiscount = parseFloat(discountInput);

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
      setImageFileName(file.name);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImageFileName(null);
    }
  };

  const isPackOrEvent =
    publishingType === 'cesta_gourmet' ||
    publishingType === 'cata_presencial' ||
    publishingType === 'cata_casa';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set('publishing_type', publishingType);
    formData.set('items_count', String(selectedListItems.length));

    if (isPackOrEvent) {
      formData.set('pack_items', JSON.stringify(selectedListItems));
    }

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
      const matchedVenue = availableVenues.find((ev) => ev.id === selectedEventId);
      if (matchedVenue) {
        formData.set('origin_region', `${matchedVenue.title || matchedVenue.street} · ${matchedVenue.town} (${matchedVenue.province})`);
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

    if (isUnlimited || publishingType === 'tarjeta_regalo') {
      formData.set('is_unlimited_stock', 'true');
      formData.set('stock', '999');
    }

    if (publishingType === 'producto_suelto') {
      let computedWeightG: number | null = null;
      const numAmt = parseFloat(weightAmount);
      if (!isNaN(numAmt) && numAmt > 0) {
        if (weightUnit === 'g') computedWeightG = numAmt;
        else if (weightUnit === 'kg') computedWeightG = numAmt * 1000;
        else if (weightUnit === 'L') computedWeightG = numAmt * 1000;
        else if (weightUnit === 'cl') computedWeightG = numAmt * 10;
        else if (weightUnit === 'ml') computedWeightG = numAmt;
      }
      if (computedWeightG !== null) {
        formData.set('weight_g', String(Math.round(computedWeightG)));
      } else {
        formData.delete('weight_g');
      }
    }

    const rawDesc = (formData.get('description') as string) || '';
    const cleanSellerDesc = getSellerDescription(rawDesc) || rawDesc.replace(/<!--[\s\S]*?-->/g, '').trim();
    let composedDesc = cleanSellerDesc;

    const metaObj: Record<string, any> = {};

    if (numericDiscount > 0 && sumOfLooseItems > 0) {
      metaObj.discount_percent = numericDiscount;
      metaObj.original_price = sumOfLooseItems.toFixed(2);
    }

    if (publishingType === 'producto_suelto') {
      const selectedCategory = formData.get('category_id') as string;
      if (selectedCategory === 'producto_unico') {
        metaObj.category = 'producto_unico';
      }
      if (weightAmount && !isNaN(parseFloat(weightAmount))) {
        metaObj.unit = weightUnit;
        metaObj.amount = parseFloat(weightAmount);
      }
    }

    if (publishingType === 'cata_casa') {
      metaObj.min_people = minPeople;
      metaObj.max_people = maxPeople;
    }

    if (publishingType === 'cata_presencial') {
      if (eventDate) metaObj.event_date = eventDate;
      if (eventStartTime) metaObj.event_start_time = eventStartTime;
      if (eventEndTime) metaObj.event_end_time = eventEndTime;
      if (eventStartTime && eventEndTime) {
        metaObj.event_time = `${eventStartTime} - ${eventEndTime}`;
      } else if (eventStartTime) {
        metaObj.event_time = eventStartTime;
      }
      if (selectedEventId) metaObj.event_address_id = selectedEventId;
    }

    if (isPackOrEvent && selectedListItems.length > 0) {
      metaObj.pack_items = selectedListItems.map((it) => ({
        id: it.id,
        name: it.name,
        quantity: it.quantity,
        price: it.price,
        imageUrl: it.imageUrl || null,
        format: it.format || null,
        origin: it.origin || null,
        description: it.description || null,
        weight_g: it.weight_g || null,
        weight_display: it.weight_display || null,
      }));
    }

    if (Object.keys(metaObj).length > 0) {
      const metaTag = `\n\n<!-- META:${JSON.stringify(metaObj)} -->`;
      composedDesc = `${composedDesc}${metaTag}`;
    }

    formData.set('description', composedDesc);

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
    if (!initialProduct || !confirm(t.seller_confirm_delete_product)) return;
    setLoading(true);
    const res = await deleteProduct(initialProduct.id);
    setLoading(false);
    if (res?.error) alert(res.error);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-8 font-serif">
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
              {t.seller_shared_catalog_subtitle}
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
            {t.seller_last_modified_by}{' '}
            <strong className="font-bold">{initialProduct.profiles?.full_name || 'Vendedor EkhiTeka'}</strong>{' '}
            {initialProduct.updated_at && (
              <span className="text-[11px] opacity-80">
                ({new Date(initialProduct.updated_at).toLocaleDateString(language === 'eu' ? 'eu-ES' : language === 'en' ? 'en-GB' : language === 'fr' ? 'fr-FR' : 'es-ES', { day: '2-digit', month: 'short', year: 'numeric' })})
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

      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block font-serif">
          {t.seller_step1_label}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 font-sans">
          {/* 1. Producto Suelto */}
          <button
            type="button"
            onClick={() => setPublishingType('producto_suelto')}
            className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              publishingType === 'producto_suelto'
                ? 'border-[#FFE259] bg-[#FFE259]/15 text-[#1D1D1B] dark:text-white font-bold shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] text-stone-600 dark:text-stone-400 hover:border-stone-400'
            }`}
          >
            <Package className="w-5 h-5 text-stone-700 dark:text-stone-300 stroke-[1.75]" />
            <span className="text-xs font-bold">{t.seller_type_single}</span>
          </button>

          {/* 2. Cesta / Lote */}
          <button
            type="button"
            onClick={() => setPublishingType('cesta_gourmet')}
            className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              publishingType === 'cesta_gourmet'
                ? 'border-[#FFE259] bg-[#FFE259]/15 text-[#1D1D1B] dark:text-white font-bold shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] text-stone-600 dark:text-stone-400 hover:border-stone-400'
            }`}
          >
            <Gift className="w-5 h-5 text-stone-700 dark:text-stone-300 stroke-[1.75]" />
            <span className="text-xs font-bold">
              {language === 'eu' ? 'Saskia / Lotea' : language === 'fr' ? 'Panier / Lot' : language === 'en' ? 'Hamper / Pack' : 'Cesta / Lote'}
            </span>
          </button>

          {/* 3. Cata en Casa */}
          <button
            type="button"
            onClick={() => setPublishingType('cata_casa')}
            className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              publishingType === 'cata_casa'
                ? 'border-[#FFE259] bg-[#FFE259]/15 text-[#1D1D1B] dark:text-white font-bold shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] text-stone-600 dark:text-stone-400 hover:border-stone-400'
            }`}
          >
            <Sparkles className="w-5 h-5 text-stone-700 dark:text-stone-300 stroke-[1.75]" />
            <span className="text-xs font-bold">{t.seller_type_home_tasting}</span>
          </button>

          {/* 4. Tarjeta Regalo */}
          <button
            type="button"
            onClick={() => setPublishingType('tarjeta_regalo')}
            className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              publishingType === 'tarjeta_regalo'
                ? 'border-[#FFE259] bg-[#FFE259]/15 text-[#1D1D1B] dark:text-white font-bold shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] text-stone-600 dark:text-stone-400 hover:border-stone-400'
            }`}
          >
            <CreditCard className="w-5 h-5 text-stone-700 dark:text-stone-300 stroke-[1.75]" />
            <span className="text-xs font-bold">{t.seller_type_gift_card}</span>
          </button>

          {/* 5. Evento (Cata Presencial) */}
          <button
            type="button"
            onClick={() => setPublishingType('cata_presencial')}
            className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              publishingType === 'cata_presencial'
                ? 'border-[#FFE259] bg-[#FFE259]/15 text-[#1D1D1B] dark:text-white font-bold shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] text-stone-600 dark:text-stone-400 hover:border-stone-400'
            }`}
          >
            <Calendar className="w-5 h-5 text-stone-700 dark:text-stone-300 stroke-[1.75]" />
            <span className="text-xs font-bold">
              {language === 'eu' ? 'Ekitaldia' : language === 'fr' ? 'Événement' : language === 'en' ? 'Event' : 'Evento'}
            </span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-xs font-sans text-xs">
        <div className="space-y-5">
          <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block font-serif">
            {t.seller_step2_label}
          </span>

          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {publishingType === 'cata_presencial' ? t.seller_name_event_label : t.seller_name_product_label}
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={initialProduct?.name || ''}
              placeholder={
                publishingType === 'cata_presencial'
                  ? t.seller_name_placeholder_event
                  : publishingType === 'cesta_gourmet'
                  ? t.seller_name_placeholder_hamper
                  : t.seller_name_placeholder_single
              }
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
            />
          </div>

          {isPackOrEvent && (
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-[#141312] border border-amber-200 dark:border-stone-800 space-y-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#C68D07] dark:text-[#FFE259] block font-serif">
                  {t.seller_catalog_select_title}
                </span>
                <p className="text-[10.5px] text-stone-500 dark:text-stone-400">
                  {t.seller_catalog_select_desc}
                </p>
              </div>

              <div className="space-y-3">
                <select
                  value={catalogSelectId}
                  onChange={(e) => setCatalogSelectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1F1E1C] border border-stone-300 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
                >
                  {cleanSingleProducts.length > 0 ? (
                    cleanSingleProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({Number(p.price).toFixed(2)} €)
                      </option>
                    ))
                  ) : (
                    <option value="">{t.seller_catalog_no_singles}</option>
                  )}
                </select>

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
                          {t.seller_product_price}: <strong className="text-amber-600 dark:text-[#FFE259]">{Number(selectedCatalogProduct.price).toFixed(2)} €</strong> · {selectedCatalogProduct.format || 'unidad'} · {selectedCatalogProduct.origin_region || 'Lekeitio'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <div className="flex items-center gap-1.5">
                        <label className="text-[11px] font-bold text-stone-500">{t.seller_qty_label}</label>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={catalogQuantityStr}
                          onChange={(e) => setCatalogQuantityStr(e.target.value)}
                          placeholder="1"
                          className="w-14 px-2 py-1 bg-stone-50 dark:bg-[#141312] border border-stone-300 dark:border-stone-700 rounded-lg text-center font-bold text-stone-900 dark:text-stone-100"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleAddCatalogProduct}
                        className="px-4 py-1.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black uppercase text-xs rounded-xl shadow-xs cursor-pointer font-serif flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{t.seller_btn_add}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {isPackOrEvent && (
            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden bg-stone-50/50 dark:bg-[#141312]">
              <button
                type="button"
                onClick={() => setIsCustomAccordionOpen(!isCustomAccordionOpen)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-100 dark:hover:bg-[#1F1E1C] transition-colors cursor-pointer"
              >
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-900 dark:text-stone-100 block font-serif">
                    {t.seller_custom_product_accordion_title}
                  </span>
                  <p className="text-[10.5px] text-stone-500 dark:text-stone-400 font-sans">
                    {t.seller_custom_product_accordion_desc}
                  </p>
                </div>
                <div className="p-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  {isCustomAccordionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isCustomAccordionOpen && (
                <div className="p-4 border-t border-stone-200 dark:border-stone-800 space-y-3 bg-white dark:bg-[#1C1B19] animate-fadeIn font-sans">
                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.seller_product_name} *</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Ej: Cuña Queso Ahumado Artesano 250g"
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-[#141312] border border-stone-300 dark:border-stone-700 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.seller_custom_photo_label}</label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 dark:bg-[#141312] border border-stone-300 dark:border-stone-700 shrink-0 flex items-center justify-center">
                        {customImagePreview || customImageUrl ? (
                          <img src={customImagePreview || customImageUrl} alt="Custom Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-stone-400" />
                        )}
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <label className="flex items-center gap-2 cursor-pointer w-full">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCustomFileChange}
                            className="sr-only"
                          />
                          <span className="px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-800 hover:bg-[#FFE259] dark:hover:bg-[#FFE259] text-stone-800 dark:text-stone-200 hover:text-stone-900 dark:hover:text-stone-900 font-bold text-xs transition-colors shrink-0">
                            {t.seller_choose_file}
                          </span>
                          <span className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-[180px] sm:max-w-xs">
                            {customImageFileName || t.seller_no_file_chosen}
                          </span>
                        </label>
                        <input
                          type="text"
                          value={customImageUrl}
                          onChange={(e) => setCustomImageUrl(e.target.value)}
                          placeholder={t.seller_custom_url_fallback}
                          className="w-full px-2.5 py-1 bg-stone-50 dark:bg-[#141312] border border-stone-300 dark:border-stone-700 rounded-lg text-[10.5px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.seller_product_category}</label>
                      <select
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-[#141312] border border-stone-300 dark:border-stone-700 rounded-xl"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c[`name_${language}` as keyof Category] || c.name_es || c.name_eu}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.seller_product_format}</label>
                      <select
                        value={customFormat}
                        onChange={(e) => setCustomFormat(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-[#141312] border border-stone-300 dark:border-stone-700 rounded-xl"
                      >
                        <option value="unidad">{t.seller_format_unit}</option>
                        <option value="peso_kg">{t.seller_format_weight}</option>
                        <option value="tarro">{t.seller_format_jar}</option>
                        <option value="lata">{t.seller_format_can}</option>
                        <option value="botella">{t.seller_format_bottle}</option>
                        <option value="pack">{t.seller_format_pack}</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.seller_product_price} *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        placeholder="7.50"
                        className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-[#141312] border border-stone-300 dark:border-stone-700 rounded-xl font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.orders_qty_label} *</label>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={customQuantityStr}
                        onChange={(e) => setCustomQuantityStr(e.target.value)}
                        placeholder="1"
                        className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-[#141312] border border-stone-300 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.seller_product_origin}</label>
                    <input
                      type="text"
                      value={customOrigin}
                      onChange={(e) => setCustomOrigin(e.target.value)}
                      placeholder="Ej: Lekeitio · Bizkaia / Idiazabal"
                      className="w-full px-3 py-1.5 bg-stone-50 dark:bg-[#141312] border border-stone-300 dark:border-stone-700 rounded-xl text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.seller_product_desc}</label>
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
                      <span>{t.seller_btn_add_to_list}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {isPackOrEvent && (
            <div className="p-4 rounded-3xl bg-stone-50 dark:bg-[#141312] border-2 border-stone-200 dark:border-stone-800 space-y-3 font-sans">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200 dark:border-stone-800">
                <Tag className="w-4 h-4 text-amber-600 dark:text-[#FFE259]" />
                <h3 className="font-black text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100 font-serif">
                  {t.seller_list_items_title} ({selectedListItems.length})
                </h3>
              </div>

              {selectedListItems.length > 0 ? (
                <div className="space-y-3">
                  {selectedListItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-800 shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="w-16 h-16 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-stone-100 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 shrink-0">
                          <img
                            src={item.imageUrl || '/images/secciones/Quesos.JPG'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-[#141312] p-0.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-stone-200 dark:hover:bg-stone-700 rounded cursor-pointer text-stone-700 dark:text-stone-300"
                            >
                              -
                            </button>
                            <span className="w-7 text-center text-xs font-black text-stone-900 dark:text-stone-100">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-stone-200 dark:hover:bg-stone-700 rounded cursor-pointer text-stone-700 dark:text-stone-300"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-serif font-black text-xs sm:text-sm text-stone-900 dark:text-stone-100 min-w-[55px] text-right">
                              {(item.price * item.quantity).toFixed(2)} €
                            </span>

                            <button
                              type="button"
                              onClick={() => handleRemoveListItem(item.id)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                              title={t.cart_remove}
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-100 dark:border-stone-800/60 space-y-0.5 w-full">
                        <p className="font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm leading-snug break-words">
                          {item.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-stone-500 dark:text-stone-400">
                          <span>{item.price.toFixed(2)} €/ud</span>
                          {item.format && <span>· {t.seller_product_format}: {item.format}</span>}
                          {item.origin && <span>· {item.origin}</span>}
                          {item.isCustom && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                              {t.seller_badge_custom_item}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-[10.5px] text-stone-400 dark:text-stone-500 line-clamp-2 pt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="pt-3 mt-3 border-t-2 border-stone-200 dark:border-stone-800 flex items-center justify-between px-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 font-serif">
                      {t.seller_list_total_sum}
                    </span>
                    <span className="text-base font-black text-stone-900 dark:text-[#F5F5F0] font-serif">
                      {sumOfLooseItems.toFixed(2)} €
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white/60 dark:bg-[#1C1B19]/60 border border-dashed border-stone-300 dark:border-stone-700 text-center text-stone-400 text-xs">
                  {t.seller_list_empty_desc}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {publishingType === 'cata_presencial' ? t.seller_price_per_seat_label : t.seller_sale_price_label}
              </label>
              <input
                type="number"
                step="0.01"
                min="0.10"
                name="price"
                required
                value={finalPriceInput}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder={sumOfLooseItems > 0 ? sumOfLooseItems.toFixed(2) : '25.00'}
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
              />
              {sumOfLooseItems > 0 && (
                <span className="text-[10.5px] text-stone-400 block mt-1">
                  {t.seller_original_sum_helper} {sumOfLooseItems.toFixed(2)} €
                </span>
              )}
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {t.seller_discount_label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  disabled={sumOfLooseItems === 0}
                  value={discountInput}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                  placeholder="0"
                  className={`w-full pl-3.5 pr-8 py-2.5 rounded-xl font-black text-xs transition-colors disabled:opacity-40 ${
                    !isNaN(numericDiscount) && numericDiscount > 0
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : !isNaN(numericDiscount) && numericDiscount < 0
                      ? 'bg-red-50 dark:bg-red-950/40 border-2 border-red-500 text-red-700 dark:text-red-300'
                      : 'bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100'
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-stone-400 text-xs">
                  %
                </span>
              </div>
              <span className="text-[10.5px] block mt-1">
                {sumOfLooseItems === 0 ? (
                  <span className="text-stone-400">{t.seller_discount_need_items_notice}</span>
                ) : !isNaN(numericDiscount) && numericDiscount > 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t.seller_discount_applied_notice}</span>
                ) : !isNaN(numericDiscount) && numericDiscount < 0 ? (
                  <span className="text-red-600 dark:text-red-400 font-bold">{t.seller_discount_surcharge_notice}</span>
                ) : (
                  <span className="text-stone-400">{t.seller_discount_zero_notice}</span>
                )}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-stone-700 dark:text-stone-300">
                  {publishingType === 'cata_presencial' ? t.seller_seats_capacity_label : t.seller_stock_available_label}
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
                    <span>{t.seller_unlimited_checkbox}</span>
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

            {publishingType === 'producto_suelto' && (
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.seller_product_category} *
                </label>
                <select
                  name="category_id"
                  required
                  defaultValue={initialMeta?.category || initialProduct?.category_id || allCategories[0]?.id || 'queso'}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
                >
                  {allCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c[`name_${language}` as keyof Category] || c.name_es || c.name_eu}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {publishingType === 'producto_suelto' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.seller_product_format}
                </label>
                <select
                  name="format"
                  defaultValue={initialProduct?.format || 'unidad'}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
                >
                  <option value="unidad">{t.seller_format_unit}</option>
                  <option value="peso_kg">{t.seller_format_weight}</option>
                  <option value="tarro">{t.seller_format_jar}</option>
                  <option value="lata">{t.seller_format_can}</option>
                  <option value="botella">{t.seller_format_bottle}</option>
                  <option value="pack">{t.seller_format_pack}</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {language === 'eu' ? 'Pisua / Bolumena' : language === 'fr' ? 'Poids / Volume' : language === 'en' ? 'Weight / Volume' : 'Peso o Volumen'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="Ej: 250, 1.5, 75"
                    value={weightAmount}
                    onChange={(e) => setWeightAmount(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
                  />
                  <select
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value)}
                    className="w-28 px-2.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
                  >
                    <option value="g">Gramos (g)</option>
                    <option value="kg">Kilos (kg)</option>
                    <option value="L">Litros (L)</option>
                    <option value="cl">Centilitros (cl)</option>
                    <option value="ml">Mililitros (ml)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {publishingType === 'cata_casa' && (
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-800 space-y-2">
              <label className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100 block">
                {language === 'eu' ? 'Gomendatutako lagun kopurua (Gutx. eta Geh.)' : language === 'fr' ? 'Nombre de personnes recommandé (Min. et Max.)' : language === 'en' ? 'Recommended people (Min. & Max.)' : 'Número de personas recomendado (Mín. y Máx.)'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] font-bold text-stone-500 block mb-1">
                    {language === 'eu' ? 'Gutxieneko pertsonak' : language === 'fr' ? 'Min. personnes' : language === 'en' ? 'Min. people' : 'Mín. personas'}
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={minPeople}
                    onChange={(e) => setMinPeople(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-stone-500 block mb-1">
                    {language === 'eu' ? 'Gehienezko pertsonak' : language === 'fr' ? 'Max. personnes' : language === 'en' ? 'Max. people' : 'Máx. personas'}
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={maxPeople}
                    onChange={(e) => setMaxPeople(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>
            </div>
          )}

          {publishingType !== 'cata_presencial' && (
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {t.seller_product_origin}
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

          {publishingType !== 'cata_presencial' && (
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {t.seller_product_desc_label}
              </label>
              <textarea
                name="description"
                rows={4}
                defaultValue={getSellerDescription(initialProduct?.description) || ''}
                placeholder={t.seller_product_desc_placeholder}
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
              />
            </div>
          )}
        </div>

        {publishingType === 'cata_presencial' && (
          <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 block font-serif flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <span>{language === 'eu' ? 'Ekitaldiaren Datuak eta Lekua' : 'Datos del Evento y Ubicación'}</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. Fecha del Evento */}
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-stone-500" />
                  <span>{language === 'eu' ? 'Ekitaldiaren Data' : 'Fecha del Evento'}</span>
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
                />
              </div>

              {/* 2. Hora de Inicio */}
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-stone-500" />
                  <span>{language === 'eu' ? 'Hasiera Ordua' : 'Hora Inicio'}</span>
                </label>
                <input
                  type="time"
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
                />
              </div>

              {/* 3. Hora de Fin */}
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-stone-500" />
                  <span>{language === 'eu' ? 'Amaiera Ordua' : 'Hora Fin'}</span>
                </label>
                <input
                  type="time"
                  value={eventEndTime}
                  onChange={(e) => setEventEndTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            {/* 4. Espacio donde se celebrará la cata */}
            {availableVenues.length > 0 ? (
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-stone-500" />
                  <span>{language === 'eu' ? 'Dastaketa egingo den lekua / denda' : 'Espacio donde se celebrará la cata'}</span>
                </label>
                <select
                  name="event_address_id"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100"
                >
                  {availableVenues.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl flex items-center gap-2 text-amber-900 dark:text-amber-200 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  {language === 'eu'
                    ? 'Ez dago puntu / dendarik konfiguratuta. Zure profilean gehi ditzakezu.'
                    : 'No hay puntos de entrega o tiendas físicas activas. Puedes configurarlos en tu perfil o locales.'}
                </span>
              </div>
            )}

            {/* 5. Campo Descripción DESPUÉS del Espacio */}
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1 flex items-center gap-1.5">
                <AlignLeft className="w-4 h-4 text-stone-500" />
                <span>{language === 'eu' ? 'Deskribapena eta xehetasunak (aukerakoa)' : 'Descripción y detalles de la cata (opcional)'}</span>
              </label>
              <textarea
                name="description"
                rows={4}
                defaultValue={getSellerDescription(initialProduct?.description) || ''}
                placeholder={
                  language === 'eu'
                    ? 'Idatzi dastaketari buruzko xehetasun gehiago, maridaje oharrak edo informazio osagarria...'
                    : 'Introduce más detalles sobre la cata, maridaje, recomendaciones o notas especiales para los participantes...'
                }
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>
        )}

        {publishingType !== 'cata_presencial' && (
          <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#C68D07] dark:text-[#FFE259] block font-serif flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              <span>{t.seller_step3_delivery_label}</span>
            </span>

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
                <span className="font-bold text-xs">{t.seller_home_delivery_option}</span>
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
                <span className="font-bold text-xs">{t.seller_store_pickup_option}</span>
              </div>
            </div>

            {hasPickup && (
              <div className="space-y-2 pt-2 animate-fadeIn">
                <label className="font-bold text-stone-700 dark:text-stone-300 block">
                  {t.seller_select_pickup_points_label}
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
                    {t.seller_no_active_pickup_alert}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800">
          <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block font-serif flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4" />
            <span>{t.seller_step4_photo_label}</span>
          </span>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 dark:bg-[#141312] border-2 border-stone-200 dark:border-stone-700 shrink-0 flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <svg
                  className="w-10 h-10 text-stone-400 dark:text-stone-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 19h20L19 7 4 12v7z" />
                  <path d="M4 12l15-5" />
                  <circle cx="9" cy="16" r="1.5" />
                  <circle cx="15" cy="15" r="1" />
                  <circle cx="13" cy="11" r="1" />
                </svg>
              )}
            </div>

            <div className="space-y-2 flex-1 w-full min-w-0">
              <label className="flex items-center gap-3 cursor-pointer w-full p-2.5 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/70 dark:bg-[#141312] hover:border-[#FFE259] transition-colors">
                <input
                  type="file"
                  name="image_file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="sr-only"
                />
                <span className="px-3.5 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-[#FFE259] dark:hover:bg-[#FFE259] text-stone-800 dark:text-stone-200 hover:text-stone-900 dark:hover:text-stone-900 font-black text-xs uppercase tracking-wider transition-colors shrink-0">
                  {t.seller_choose_file}
                </span>
                <span className="text-xs text-stone-600 dark:text-stone-400 truncate flex-1 font-medium">
                  {imageFileName || t.seller_no_file_chosen}
                </span>
              </label>
              <input
                type="text"
                name="image_url_fallback"
                defaultValue={initialProduct?.image_url || ''}
                placeholder={t.seller_photo_url_placeholder}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-[11px] text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>
        </div>

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
            <span>{loading ? t.common_loading : isEditing ? t.seller_save_changes_btn : t.seller_publish_btn}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
