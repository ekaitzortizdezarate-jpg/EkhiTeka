'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { deleteProduct } from '@/app/actions/products';
import { SiteImagesManager } from '@/components/SiteImagesManager';
import type { Category, Product, StoreAddress, EventAddress } from '@/types/database';
import {
  getProductImage,
  getProductCategoryId,
  getTranslatedFormat,
  getTranslatedOrigin,
  getProductWeightOrVolume,
  getSellerDescription,
  getPackItems,
  getProductDiscount,
} from '@/lib/productHelpers';
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Search,
  SlidersHorizontal,
  Sparkles,
  Wine,
  Gift,
  CreditCard,
  Layers,
  MapPin,
  Truck,
  Store,
  Users,
  Check,
  AlertCircle,
  Tag,
  Eye,
  Calendar,
  Clock,
  Ticket,
  Image as ImageIcon,
  Building,
} from 'lucide-react';

interface SellerProductsListViewProps {
  products: Product[];
  categories: Category[];
  pickupAddresses: StoreAddress[];
  eventAddresses?: EventAddress[];
}

export function SellerProductsListView({
  products,
  categories,
  pickupAddresses,
  eventAddresses = [],
}: SellerProductsListViewProps) {
  const { t, language } = useLanguage();
  const router = useRouter();

  // Selector central: 'productos' | 'eventos' | 'imagenes'
  const [activeMainTab, setActiveMainTab] = useState<'productos' | 'eventos' | 'imagenes'>('productos');

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Helper para clasificar tipo de artículo
  const getItemTypeKey = (p: Product): string => {
    const cat = getProductCategoryId(p).toLowerCase();
    const name = (p.name || '').toLowerCase();
    const format = (p.format || '').toLowerCase();

    if (cat === 'cata_casa' || name.includes('cata en casa') || name.includes('etxeko dastaketa')) {
      return 'cata_casa';
    }
    if (
      cat === 'cata_presencial' ||
      cat === 'cata' ||
      cat === 'catas' ||
      name.includes('cata presencial') ||
      name.includes('aurrez aurreko dastaketa') ||
      name.includes('evento')
    ) {
      return 'cata_presencial';
    }
    if (cat === 'cesta_gourmet' || cat === 'cesta' || name.includes('cesta') || name.includes('saski')) {
      return 'cesta_gourmet';
    }
    if (cat === 'pack' || cat === 'lote' || format === 'pack' || name.includes('lote') || name.includes('pack')) {
      return 'lote_gourmet';
    }
    if (cat === 'tarjeta_regalo' || name.includes('tarjeta') || name.includes('txartel') || name.includes('virtual')) {
      return 'tarjeta_regalo';
    }
    return 'producto_suelto';
  };

  const getEventMeta = (p: Product) => {
    const match = (p.description || '').match(/<!--\s*META:([\s\S]*?)\s*-->/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch {}
    }
    return null;
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const type = getItemTypeKey(p);
      if (typeFilter !== 'all' && type !== typeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (p.name || '').toLowerCase();
        const cat = getProductCategoryId(p).toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const origin = (p.origin_region || '').toLowerCase();
        return name.includes(q) || cat.includes(q) || desc.includes(q) || origin.includes(q);
      }
      return true;
    });
  }, [products, typeFilter, searchQuery]);

  // Agrupaciones principales
  const catasCasa = useMemo(() => filteredProducts.filter((p) => getItemTypeKey(p) === 'cata_casa'), [filteredProducts]);
  const catasPresenciales = useMemo(() => products.filter((p) => getItemTypeKey(p) === 'cata_presencial'), [products]);
  const cestasGourmet = useMemo(() => filteredProducts.filter((p) => getItemTypeKey(p) === 'cesta_gourmet'), [filteredProducts]);
  const lotesGourmet = useMemo(() => filteredProducts.filter((p) => getItemTypeKey(p) === 'lote_gourmet'), [filteredProducts]);
  const tarjetasRegalo = useMemo(() => filteredProducts.filter((p) => getItemTypeKey(p) === 'tarjeta_regalo'), [filteredProducts]);
  const productosSueltos = useMemo(() => filteredProducts.filter((p) => getItemTypeKey(p) === 'producto_suelto'), [filteredProducts]);

  // Agrupar productos sueltos por su categoría
  const looseByCategory = useMemo(() => {
    const map = new Map<string, { categoryName: string; items: Product[] }>();

    productosSueltos.forEach((p) => {
      const catId = getProductCategoryId(p);
      const catObj = categories.find((c) => c.id === catId);
      const catName =
        catId === 'producto_unico'
          ? (language === 'eu' ? 'Produktu Bakarra' : 'Producto Único')
          : catObj?.name_es || catId || (language === 'eu' ? 'Beste batzuk' : 'Otros');

      if (!map.has(catId)) {
        map.set(catId, { categoryName: catName, items: [] });
      }
      map.get(catId)!.items.push(p);
    });

    return Array.from(map.entries()).map(([catId, val]) => ({
      catId,
      categoryName: val.categoryName,
      items: val.items,
    }));
  }, [productosSueltos, categories, language]);

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente "${productName}"?`)) {
      return;
    }
    setDeletingId(productId);
    const res = await deleteProduct(productId);
    setDeletingId(null);
    if (res?.error) {
      alert(`Error al eliminar: ${res.error}`);
    } else {
      window.location.reload();
    }
  };

  // Render para productos generales
  const renderProductRow = (product: Product) => {
    const isDeleting = deletingId === product.id;
    const imageUrl = getProductImage(product);
    const origin = getTranslatedOrigin(product.origin_region, language);
    const format = getTranslatedFormat(product.format, language);
    const weightOrVolume = getProductWeightOrVolume(product, language);
    const sellerDesc = getSellerDescription(product.description);
    const discountInfo = getProductDiscount(product);
    const packItems = getPackItems(product);
    const itemType = getItemTypeKey(product);
    const isPack = ['cata_casa', 'cata_presencial', 'cesta_gourmet', 'lote_gourmet'].includes(itemType);

    let minPeople: string | null = null;
    let maxPeople: string | null = null;
    if (itemType === 'cata_casa') {
      const meta = getEventMeta(product);
      if (meta?.min_people) minPeople = String(meta.min_people);
      if (meta?.max_people) maxPeople = String(meta.max_people);
    }

    return (
      <div
        key={product.id}
        className={`manduca-card bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 p-5 sm:p-6 transition-all duration-200 flex flex-col lg:flex-row lg:items-start justify-between gap-6 shadow-xs ${
          isDeleting ? 'opacity-40 pointer-events-none' : ''
        }`}
      >
        {/* Lado Izquierdo: Imagen y Datos */}
        <div className="flex flex-col sm:flex-row gap-5 flex-1 min-w-0">
          <div className="relative aspect-4/3 sm:w-44 sm:h-36 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-850 border border-stone-200/60 dark:border-stone-700 shrink-0">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
              }}
            />
            {discountInfo && discountInfo.discountPercent > 0 && (
              <span className="absolute bottom-2 right-2 px-2.5 py-1 bg-emerald-600 dark:bg-emerald-500 text-white text-xs sm:text-sm font-black rounded-xl shadow-lg font-serif border border-emerald-700 dark:border-emerald-400">
                -{discountInfo.discountPercent}%
              </span>
            )}
          </div>

          <div className="space-y-3 flex-1 min-w-0 font-serif">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 leading-snug">
                  {product.name}
                </h3>
                {origin && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10.5px] font-bold uppercase tracking-wider">
                    <MapPin className="w-3 h-3 text-stone-500" />
                    <span>{origin}</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-serif pt-0.5">
                {(format || weightOrVolume) && (
                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-stone-850 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 font-bold uppercase tracking-wider text-[11px]">
                    {format} {weightOrVolume ? `· ${weightOrVolume}` : ''}
                  </span>
                )}

                {minPeople && maxPeople && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-[11px] font-bold">
                    <Users className="w-3.5 h-3.5 text-stone-500" />
                    <span>
                      {language === 'eu' ? `${minPeople} - ${maxPeople} lagunentzat` : `Para ${minPeople} a ${maxPeople} personas`}
                    </span>
                  </span>
                )}

                <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] font-bold">
                  {product.is_unlimited_stock
                    ? 'Stock: Ilimitado'
                    : `Stock: ${product.stock ?? 0} uds`}
                </span>
              </div>
            </div>

            {/* Si es Pack / Cata / Cesta: Lista Detallada de Productos */}
            {isPack && packItems.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#C68D07] dark:text-[#FFE259] block">
                  {language === 'eu' ? 'Barneko produktuak:' : 'Productos incluidos:'} ({packItems.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {packItems.map((sub, idx) => (
                    <div
                      key={sub.id || idx}
                      className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200/60 dark:border-stone-700/60 text-xs"
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-white dark:bg-stone-800 shrink-0 border border-stone-200 dark:border-stone-700">
                        <img
                          src={sub.imageUrl || '/images/secciones/Quesos.JPG'}
                          alt={sub.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-stone-900 dark:text-stone-100 truncate">
                          {sub.name}
                        </p>
                        <p className="text-[10.5px] text-stone-500 dark:text-stone-400 font-sans">
                          x{sub.quantity || 1} {sub.price ? `· ${(sub.price * (sub.quantity || 1)).toFixed(2)} €` : ''} {sub.weight_display ? `· ${sub.weight_display}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sellerDesc && (
              <div className="pt-2">
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-sans line-clamp-2 italic">
                  "{sellerDesc}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Lado Derecho: Precios y Acciones */}
        <div className="flex flex-row lg:flex-col lg:items-end justify-between items-center gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-stone-100 dark:border-stone-800 font-serif">
          <div className="text-left lg:text-right space-y-0.5">
            <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest block">
              {t.prod_price}
            </span>
            <div className="flex items-baseline gap-2 lg:justify-end">
              <span className="text-2xl font-black text-stone-900 dark:text-stone-100">
                {Number(product.price).toFixed(2)} €
              </span>
              {discountInfo && discountInfo.originalPrice && discountInfo.originalPrice > Number(product.price) && (
                <span className="text-sm text-stone-400 line-through font-bold">
                  {discountInfo.originalPrice.toFixed(2)} €
                </span>
              )}
            </div>
            {discountInfo && discountInfo.discountPercent > 0 && (
              <span className="inline-block text-xs font-black text-emerald-600 dark:text-emerald-400 font-sans">
                Ahorro del {discountInfo.discountPercent}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/vendedor/productos/${product.id}/editar`}
              className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{language === 'eu' ? 'Editatu' : 'Editar'}</span>
            </Link>

            <button
              type="button"
              onClick={() => handleDelete(product.id, product.name)}
              className="p-2.5 rounded-xl bg-stone-100 hover:bg-red-50 dark:bg-stone-800 dark:hover:bg-red-950/50 text-stone-600 hover:text-red-600 dark:text-stone-300 dark:hover:text-red-400 transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
              title="Eliminar producto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render individual para Eventos con todos sus campos individuales editables y desglosados
  const renderEventRow = (eventProduct: Product) => {
    const isDeleting = deletingId === eventProduct.id;
    const imageUrl = getProductImage(eventProduct);
    const meta = getEventMeta(eventProduct);
    const eventDate = meta?.event_date || meta?.experienceDate || null;
    const eventTime = meta?.event_time || meta?.experienceTime || null;
    const eventAddrId = meta?.event_address_id || eventProduct.event_address_id;
    const matchedVenue = eventAddresses.find((a) => a.id === eventAddrId) || null;
    const venueText = matchedVenue
      ? `${matchedVenue.title} — ${matchedVenue.street} ${matchedVenue.number || ''}, ${matchedVenue.town} (${matchedVenue.province})`
      : eventProduct.origin_region || 'Local EkhiTeka Lekeitio';

    const packItems = getPackItems(eventProduct);
    const sellerDesc = getSellerDescription(eventProduct.description);
    const discountInfo = getProductDiscount(eventProduct);

    return (
      <div
        key={eventProduct.id}
        className={`manduca-card bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 p-6 transition-all duration-200 space-y-6 shadow-xs ${
          isDeleting ? 'opacity-40 pointer-events-none' : ''
        }`}
      >
        {/* Cabecera del Evento */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex gap-4 flex-1 min-w-0">
            <div className="relative aspect-4/3 w-36 h-28 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-850 border border-stone-200 dark:border-stone-700 shrink-0">
              <img
                src={imageUrl}
                alt={eventProduct.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Catas.JPG';
                }}
              />
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                  <span>{language === 'eu' ? 'Ekitaldia' : 'Evento / Cata'}</span>
                </span>
              </div>

              <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 leading-snug">
                {eventProduct.name}
              </h3>

              {sellerDesc && (
                <p className="text-xs text-stone-600 dark:text-stone-300 font-sans line-clamp-2">
                  {sellerDesc}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-row md:flex-col md:items-end justify-between items-center gap-3 shrink-0">
            <div className="text-left md:text-right">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                Precio por plaza
              </span>
              <span className="text-2xl font-black text-stone-900 dark:text-stone-100">
                {Number(eventProduct.price).toFixed(2)} €
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/vendedor/productos/${eventProduct.id}/editar`}
                className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>{language === 'eu' ? 'Editatu Ekitaldia' : 'Editar Evento'}</span>
              </Link>

              <button
                type="button"
                onClick={() => handleDelete(eventProduct.id, eventProduct.name)}
                className="p-2.5 rounded-xl bg-stone-100 hover:bg-red-50 dark:bg-stone-800 dark:hover:bg-red-950/50 text-stone-600 hover:text-red-600 dark:text-stone-300 dark:hover:text-red-400 transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
                title="Eliminar evento"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Campos Editables Individuales con Iconos Monocromáticos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1 font-serif">
          {/* 1. FECHA */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#141312] border border-stone-200/80 dark:border-stone-800 space-y-1">
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <span>{language === 'eu' ? 'Data' : 'Fecha'}</span>
            </span>
            <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {eventDate ? new Date(eventDate).toLocaleDateString(language === 'eu' ? 'eu-ES' : 'es-ES', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' }) : 'Fecha a convenir / Flexible'}
            </p>
          </div>

          {/* 2. HORARIO */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#141312] border border-stone-200/80 dark:border-stone-800 space-y-1">
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <span>{language === 'eu' ? 'Ordutegia' : 'Horario'}</span>
            </span>
            <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {eventTime || '19:00 - 21:00'}
            </p>
          </div>

          {/* 3. PLAZAS DISPONIBLES */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#141312] border border-stone-200/80 dark:border-stone-800 space-y-1">
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <span>{language === 'eu' ? 'Leku Libreak' : 'Plazas Disponibles'}</span>
            </span>
            <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {eventProduct.stock && eventProduct.stock > 0 ? `${eventProduct.stock} plazas disponibles` : 'Aforo completo'}
            </p>
          </div>

          {/* 4. LOCAL / UBICACIÓN */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#141312] border border-stone-200/80 dark:border-stone-800 space-y-1">
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <span>{language === 'eu' ? 'Lekua' : 'Ubicación'}</span>
            </span>
            <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate" title={venueText}>
              {venueText}
            </p>
          </div>
        </div>

        {/* 5. LISTA DE PRODUCTOS A DEGUSTAR (con sus imágenes, nombres, peso, info...) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#C68D07] dark:text-[#FFE259] flex items-center gap-1.5">
              <Package className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <span>{language === 'eu' ? 'Dastatuko diren produktuak:' : 'Productos a degustar en la sesión:'}</span>
            </span>
            <span className="text-xs text-stone-400 font-bold">
              ({packItems.length} {packItems.length === 1 ? 'producto' : 'productos'})
            </span>
          </div>

          {packItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {packItems.map((sub, idx) => (
                <div
                  key={sub.id || idx}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/70 dark:border-stone-700/70"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-stone-800 shrink-0 border border-stone-200 dark:border-stone-700">
                    <img
                      src={sub.imageUrl || '/images/secciones/Quesos.JPG'}
                      alt={sub.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 truncate">
                      {sub.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400 font-sans">
                      <span className="font-bold text-stone-700 dark:text-stone-300">x{sub.quantity || 1}</span>
                      {sub.weight_display && <span>· {sub.weight_display}</span>}
                      {sub.price && <span>· {(sub.price * (sub.quantity || 1)).toFixed(2)} €</span>}
                    </div>
                    {sub.description && (
                      <p className="text-[10.5px] text-stone-500 dark:text-stone-400 font-sans line-clamp-1 italic">
                        {sub.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 text-xs text-stone-500 font-sans">
              No se han asignado productos específicos sueltos a este evento aún. Puedes editarlos en el formulario.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-serif">
      {/* 1. Cabecera Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-[#FFE259] text-[#1D1D1B]">
              <Layers className="w-6 h-6" />
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1D1D1B] dark:text-stone-100 tracking-tight">
              {language === 'eu'
                ? 'Nire Denda eta Kudeaketa'
                : language === 'fr'
                ? 'Mon Magasin et Gestion'
                : language === 'en'
                ? 'My Store & Management'
                : 'Mis Productos, Eventos e Imágenes'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans">
            {language === 'eu'
              ? 'Kudeatu zure produktuak, ekitaldiak eta webguneko banner guztiak leku bakarretik.'
              : 'Gestiona todos tus productos de la tienda, catas presenciales (eventos) y las imágenes de la web.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/vendedor/productos/nuevo"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-widest shadow-md hover:scale-102 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'eu' ? 'Gehitu Produktua' : 'Añadir Producto'}</span>
          </Link>

          <Link
            href="/vendedor/eventos"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-bold text-xs uppercase tracking-widest transition-all border border-stone-200 dark:border-stone-700"
          >
            <Building className="w-4 h-4" />
            <span>{language === 'eu' ? 'Lokalak / Lekuak' : 'Locales y Espacios'}</span>
          </Link>
        </div>
      </div>

      {/* 2. SELECTOR CENTRAL DESTACADO (Mis Productos / Mis Eventos / Mis Imágenes) */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-3xl bg-white dark:bg-[#1C1B19] border-2 border-stone-200 dark:border-stone-800 shadow-sm gap-1.5 font-serif max-w-full overflow-x-auto">
          {/* Botón 1: Mis Productos */}
          <button
            type="button"
            onClick={() => setActiveMainTab('productos')}
            className={`flex items-center gap-2 px-5 sm:px-7 py-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeMainTab === 'productos'
                ? 'bg-[#FFE259] text-[#1D1D1B] shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Package className="w-4 h-4 text-stone-800 dark:text-stone-200 stroke-[1.75]" />
            <span>{language === 'eu' ? 'Nire Produktuak' : language === 'fr' ? 'Mes Produits' : language === 'en' ? 'My Products' : 'Mis Productos'}</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-stone-900/10 dark:bg-white/10 text-[10.5px]">
              {products.length}
            </span>
          </button>

          {/* Botón 2: Mis Eventos */}
          <button
            type="button"
            onClick={() => setActiveMainTab('eventos')}
            className={`flex items-center gap-2 px-5 sm:px-7 py-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeMainTab === 'eventos'
                ? 'bg-[#FFE259] text-[#1D1D1B] shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Calendar className="w-4 h-4 text-stone-800 dark:text-stone-200 stroke-[1.75]" />
            <span>{language === 'eu' ? 'Nire Ekitaldiak' : language === 'fr' ? 'Mes Événements' : language === 'en' ? 'My Events' : 'Mis Eventos'}</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-stone-900/10 dark:bg-white/10 text-[10.5px]">
              {catasPresenciales.length}
            </span>
          </button>

          {/* Botón 3: Mis Imágenes */}
          <button
            type="button"
            onClick={() => setActiveMainTab('imagenes')}
            className={`flex items-center gap-2 px-5 sm:px-7 py-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeMainTab === 'imagenes'
                ? 'bg-[#FFE259] text-[#1D1D1B] shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-stone-800 dark:text-stone-200 stroke-[1.75]" />
            <span>{language === 'eu' ? 'Nire Irudiak' : language === 'fr' ? 'Mes Images' : language === 'en' ? 'My Images' : 'Mis Imágenes'}</span>
          </button>
        </div>
      </div>

      {/* 3. VISTA 1: MIS PRODUCTOS */}
      {activeMainTab === 'productos' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Buscador y Filtros */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder={language === 'eu' ? 'Bilatu izena, kategoria, jatorria...' : 'Buscar por nombre, categoría, notas o procedencia...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#1C1B19] border border-stone-200 dark:border-stone-800 rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#FFE259] outline-hidden shadow-2xs font-sans"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-serif">
                {[
                  { id: 'all', label: language === 'eu' ? 'Guztiak' : 'Todos' },
                  { id: 'cata_casa', label: language === 'eu' ? 'Etxeko Dastaketak' : 'Catas en Casa' },
                  { id: 'cesta_gourmet', label: language === 'eu' ? 'Saski Gourmetak' : 'Cestas Gourmet' },
                  { id: 'lote_gourmet', label: language === 'eu' ? 'Loteak & Packak' : 'Lotes Gourmet' },
                  { id: 'tarjeta_regalo', label: language === 'eu' ? 'Opari Txartelak' : 'Tarjetas Regalo' },
                  { id: 'producto_suelto', label: language === 'eu' ? 'Produktu Solteak' : 'Productos Sueltos' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setTypeFilter(f.id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      typeFilter === f.id
                        ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs'
                        : 'bg-white dark:bg-[#1C1B19] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Listas Agrupadas */}
          <div className="space-y-12">
            {/* SECCIÓN: Catas en Casa */}
            {(typeFilter === 'all' || typeFilter === 'cata_casa') && catasCasa.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                      <Sparkles className="w-5 h-5" />
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
                      {language === 'eu' ? 'Etxeko Dastaketak' : 'Catas en Casa'}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-bold">
                      {catasCasa.length}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">{catasCasa.map((p) => renderProductRow(p))}</div>
              </section>
            )}

            {/* SECCIÓN: Cestas Gourmet */}
            {(typeFilter === 'all' || typeFilter === 'cesta_gourmet') && cestasGourmet.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                      <Gift className="w-5 h-5" />
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
                      {language === 'eu' ? 'Saski Gourmetak' : 'Cestas Gourmet'}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-bold">
                      {cestasGourmet.length}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">{cestasGourmet.map((p) => renderProductRow(p))}</div>
              </section>
            )}

            {/* SECCIÓN: Lotes Gourmet */}
            {(typeFilter === 'all' || typeFilter === 'lote_gourmet') && lotesGourmet.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                      <Package className="w-5 h-5" />
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
                      {language === 'eu' ? 'Loteak eta Pack Degustazioak' : 'Lotes Gourmet y Packs'}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-bold">
                      {lotesGourmet.length}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">{lotesGourmet.map((p) => renderProductRow(p))}</div>
              </section>
            )}

            {/* SECCIÓN: Tarjetas Regalo */}
            {(typeFilter === 'all' || typeFilter === 'tarjeta_regalo') && tarjetasRegalo.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                      <CreditCard className="w-5 h-5" />
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
                      {language === 'eu' ? 'Opari Txartel Birtualak' : 'Tarjetas Regalo Virtuales'}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-bold">
                      {tarjetasRegalo.length}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">{tarjetasRegalo.map((p) => renderProductRow(p))}</div>
              </section>
            )}

            {/* SECCIÓN: Productos Sueltos por Categoría */}
            {(typeFilter === 'all' || typeFilter === 'producto_suelto') && looseByCategory.length > 0 && (
              <section className="space-y-8 pt-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                      <Layers className="w-5 h-5" />
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
                      {language === 'eu' ? 'Produktu Solteak (Kategoriaka)' : 'Productos Sueltos (Ordenados por Categoría)'}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-bold">
                      {productosSueltos.length}
                    </span>
                  </div>
                </div>

                {looseByCategory.map((group) => (
                  <div key={group.catId} className="space-y-4 pl-0 sm:pl-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259]">
                        {group.categoryName}
                      </span>
                      <div className="h-px flex-1 bg-stone-200 dark:border-stone-800" />
                      <span className="text-xs text-stone-400 font-bold">
                        {group.items.length} {group.items.length === 1 ? 'producto' : 'productos'}
                      </span>
                    </div>
                    <div className="space-y-4">{group.items.map((p) => renderProductRow(p))}</div>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      )}

      {/* 4. VISTA 2: MIS EVENTOS (CATAS PRESENCIALES CON CAMPOS EDITABLES) */}
      {activeMainTab === 'eventos' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#1C1B19] border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
                {language === 'eu' ? 'Dastaketa Presentzialen eta Ekitaldien Kudeaketa' : 'Catas Presenciales y Eventos Programados'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans">
                {language === 'eu'
                  ? 'Ikusi data, ordutegia, leku libreak, lokala eta dastatuko diren produktu guztiak.'
                  : 'Gestiona la fecha, horario, aforo/plazas disponibles, ubicación y todos los productos que se degustarán.'}
              </p>
            </div>

            <Link
              href="/vendedor/productos/nuevo"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-widest shadow-xs cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'eu' ? 'Sortu Ekitaldi Berria' : 'Crear Nuevo Evento'}</span>
            </Link>
          </div>

          {catasPresenciales.length > 0 ? (
            <div className="space-y-6">
              {catasPresenciales.map((evProd) => renderEventRow(evProd))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
              <Calendar className="w-12 h-12 text-stone-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200">
                  {language === 'eu' ? 'Ez dago ekitaldirik erregistratuta' : 'No tienes eventos registrados todavía'}
                </h3>
                <p className="text-xs text-stone-500 font-sans max-w-md mx-auto">
                  {language === 'eu'
                    ? 'Sortu dastaketa presentzial berri bat data, ordutegia eta dastatzeko produktuekin.'
                    : 'Crea tu primera cata presencial configurando la fecha, horario, aforo y los productos que se probarán.'}
                </p>
              </div>
              <Link
                href="/vendedor/productos/nuevo"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FFE259] text-[#1D1D1B] font-bold text-xs uppercase tracking-wider shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'eu' ? 'Sortu Ekitaldia Orain' : 'Crear Evento Ahora'}</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 5. VISTA 3: MIS IMÁGENES (GESTOR DE BANNERS Y SECCIONES DE LA WEB) */}
      {activeMainTab === 'imagenes' && (
        <div className="animate-in fade-in duration-200">
          <SiteImagesManager />
        </div>
      )}
    </div>
  );
}
