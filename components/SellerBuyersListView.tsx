'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { LOCALE_MAP } from '@/lib/i18n/translations';
import { getProductImage, getOrderTypeBadge } from '@/lib/productHelpers';
import type { Profile, Order } from '@/types/database';
import {
  Users,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Package,
  Calendar,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Store,
  Truck,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  User as UserIcon,
  Tag,
} from 'lucide-react';

export interface BuyerWithOrders extends Profile {
  orders: Order[];
}

interface SellerBuyersListViewProps {
  buyers: BuyerWithOrders[];
}

export function SellerBuyersListView({ buyers }: SellerBuyersListViewProps) {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'town' | 'orders'>('newest');
  const [expandedBuyerId, setExpandedBuyerId] = useState<string | null>(null);

  // Filtrado y ordenación de compradores
  const filteredAndSortedBuyers = useMemo(() => {
    const list = buyers.filter((b) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const name = (b.full_name || '').toLowerCase();
      const email = (b.email || '').toLowerCase();
      const phone = (b.phone || '').toLowerCase();
      const town = (b.town || '').toLowerCase();
      const province = (b.province || '').toLowerCase();
      const dni = (b.dni || '').toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        town.includes(q) ||
        province.includes(q) ||
        dni.includes(q)
      );
    });

    list.sort((a, b) => {
      if (sortBy === 'newest') {
        const timeA = new Date(a.created_at || 0).getTime();
        const timeB = new Date(b.created_at || 0).getTime();
        return timeB - timeA; // Más nuevos a más viejos
      }
      if (sortBy === 'oldest') {
        const timeA = new Date(a.created_at || 0).getTime();
        const timeB = new Date(b.created_at || 0).getTime();
        return timeA - timeB; // Más viejos a más nuevos
      }
      if (sortBy === 'name') {
        const nameA = (a.full_name || '').toLowerCase();
        const nameB = (b.full_name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if (sortBy === 'town') {
        const townA = (a.town || 'zzz').toLowerCase();
        const townB = (b.town || 'zzz').toLowerCase();
        return townA.localeCompare(townB);
      }
      if (sortBy === 'orders') {
        return (b.orders?.length || 0) - (a.orders?.length || 0);
      }
      return 0;
    });

    return list;
  }, [buyers, searchQuery, sortBy]);

  const toggleExpand = (buyerId: string) => {
    setExpandedBuyerId((prev) => (prev === buyerId ? null : buyerId));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendiente':
        return (
          <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/70 text-[#C68D07] dark:text-[#FFE259] font-black text-[10.5px] uppercase tracking-wider font-serif border border-amber-300 dark:border-amber-700">
            {t.orders_pending}
          </span>
        );
      case 'confirmado':
        return (
          <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-200 font-black text-[10.5px] uppercase tracking-wider font-serif border border-blue-300 dark:border-blue-700">
            {t.orders_confirmed}
          </span>
        );
      case 'preparando':
        return (
          <span className="px-2.5 py-0.5 rounded-lg bg-orange-100 dark:bg-orange-950/70 text-orange-800 dark:text-orange-200 font-black text-[10.5px] uppercase tracking-wider font-serif border border-orange-300 dark:border-orange-700">
            {t.orders_preparing}
          </span>
        );
      case 'listo_entrega':
        return (
          <span className="px-2.5 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-200 font-black text-[10.5px] uppercase tracking-wider font-serif border border-purple-300 dark:border-purple-700">
            {t.orders_ready_delivery}
          </span>
        );
      case 'entregado':
        return (
          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 font-black text-[10.5px] uppercase tracking-wider font-serif border border-emerald-300 dark:border-emerald-700">
            {t.orders_delivered}
          </span>
        );
      case 'cancelado':
        return (
          <span className="px-2.5 py-0.5 rounded-lg bg-red-100 dark:bg-red-950/70 text-red-800 dark:text-red-200 font-black text-[10.5px] uppercase tracking-wider font-serif border border-red-300 dark:border-red-700">
            {t.orders_cancelled}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-black text-[10.5px] uppercase tracking-wider font-serif border border-stone-200 dark:border-stone-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-serif">
      {/* 1. Barra de Búsqueda y Filtros */}
      <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 font-sans">
        {/* Input Buscador */}
        <div className="relative w-full sm:w-80 md:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'eu'
                ? 'Bilatu izena, emaila, telefonoa, herria...'
                : language === 'fr'
                ? 'Rechercher par nom, email, téléphone, ville...'
                : language === 'en'
                ? 'Search by name, email, phone, city...'
                : 'Buscar por nombre, email, teléfono, localidad...'
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500 placeholder:text-stone-400"
          />
        </div>

        {/* Selector de Ordenación */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <SlidersHorizontal className="w-4 h-4 text-stone-400 shrink-0" />
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 shrink-0 font-serif hidden md:inline">
            {language === 'eu' ? 'Ordenatu:' : language === 'fr' ? 'Trier:' : language === 'en' ? 'Sort:' : 'Ordenar por:'}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer font-serif"
          >
            <option value="newest">
              {language === 'eu' ? '↓ Berrienak lehenik' : language === 'fr' ? '↓ Plus récents' : language === 'en' ? '↓ Newest first' : '↓ Más nuevos a más viejos'}
            </option>
            <option value="oldest">
              {language === 'eu' ? '↑ Zaharrenak lehenik' : language === 'fr' ? '↑ Plus anciens' : language === 'en' ? '↑ Oldest first' : '↑ Más viejos a más nuevos'}
            </option>
            <option value="name">
              {language === 'eu' ? 'A-Z Izena' : language === 'fr' ? 'A-Z Nom' : language === 'en' ? 'A-Z Name' : 'A-Z Nombre'}
            </option>
            <option value="town">
              {language === 'eu' ? 'A-Z Herria' : language === 'fr' ? 'A-Z Ville' : language === 'en' ? 'A-Z City' : 'A-Z Localidad'}
            </option>
            <option value="orders">
              {language === 'eu' ? '№ Eskaera gehien' : language === 'fr' ? '№ Plus de commandes' : language === 'en' ? '№ Most orders' : '№ Más pedidos'}
            </option>
          </select>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="flex items-center justify-between px-2 text-xs font-bold text-stone-500 dark:text-stone-400">
        <span>
          {language === 'eu'
            ? `${filteredAndSortedBuyers.length} bezero erregistratu`
            : language === 'fr'
            ? `${filteredAndSortedBuyers.length} acheteurs enregistrés`
            : language === 'en'
            ? `${filteredAndSortedBuyers.length} registered buyers`
            : `${filteredAndSortedBuyers.length} compradores registrados`}
        </span>
      </div>

      {/* 2. Lista de Compradores */}
      {filteredAndSortedBuyers.length > 0 ? (
        <div className="space-y-4">
          {filteredAndSortedBuyers.map((buyer) => {
            const isExpanded = expandedBuyerId === buyer.id;
            const buyerOrders = buyer.orders || [];
            const totalSpent = buyerOrders
              .filter((o) => o.status !== 'cancelado')
              .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

            const addressLine = [
              buyer.street ? `${buyer.street}${buyer.number ? ` ${buyer.number}` : ''}` : null,
              buyer.postal_code,
              buyer.town,
              buyer.province,
            ]
              .filter(Boolean)
              .join(', ');

            return (
              <div
                key={buyer.id}
                className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 shadow-xs transition-all overflow-hidden"
              >
                {/* Cabecera / Tarjeta del Comprador */}
                <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                    {/* Avatar */}
                    <div className="w-13 h-13 rounded-2xl bg-amber-500/15 text-amber-800 dark:text-amber-300 font-black text-lg flex items-center justify-center border-2 border-amber-500/30 shrink-0">
                      {buyer.avatar_url ? (
                        <img
                          src={buyer.avatar_url}
                          alt={buyer.full_name || 'Comprador'}
                          className="w-full h-full rounded-2xl object-cover"
                        />
                      ) : (
                        buyer.full_name?.charAt(0) || 'C'
                      )}
                    </div>

                    {/* Información Principal del Comprador */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => toggleExpand(buyer.id)}
                          className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 hover:text-[#C68D07] dark:hover:text-[#FFE259] transition-colors cursor-pointer text-left leading-tight font-serif"
                        >
                          {buyer.full_name || (language === 'eu' ? 'Bezeroa (izenik gabe)' : 'Comprador sin nombre')}
                        </button>
                        <span className="px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold text-[10px] uppercase font-sans">
                          {language === 'eu' ? 'Bezeroa' : 'Comprador'}
                        </span>
                      </div>

                      {/* Detalles secundarios en badges y texto */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-stone-400 font-sans">
                        {buyer.email && (
                          <span className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <a href={`mailto:${buyer.email}`} className="hover:underline">
                              {buyer.email}
                            </a>
                          </span>
                        )}
                        {buyer.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <a href={`tel:${buyer.phone}`} className="hover:underline font-medium text-stone-700 dark:text-stone-300">
                              {buyer.phone}
                            </a>
                          </span>
                        )}
                        {buyer.town && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span>{buyer.town}{buyer.province ? ` (${buyer.province})` : ''}</span>
                          </span>
                        )}
                      </div>

                      {/* Fecha de Registro y DNI si existe */}
                      <div className="flex flex-wrap items-center gap-3 pt-0.5 text-[11px] text-stone-400 font-sans">
                        <span>
                          {language === 'eu' ? 'Erregistratua:' : 'Registrado el:'}{' '}
                          <strong className="text-stone-600 dark:text-stone-300">
                            {new Date(buyer.created_at || new Date().toISOString()).toLocaleDateString(LOCALE_MAP[language] || 'es', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </strong>
                        </span>
                        {buyer.dni && (
                          <span>
                            DNI: <strong className="text-stone-600 dark:text-stone-300">{buyer.dni}</strong>
                          </span>
                        )}
                        {addressLine && (
                          <span className="truncate max-w-sm" title={addressLine}>
                            📍 {addressLine}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Acciones y Resumen de Pedidos */}
                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800">
                    <div className="text-left md:text-right font-sans">
                      <div className="flex items-center gap-1.5 md:justify-end">
                        <Package className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
                        <span className="font-black text-stone-900 dark:text-stone-100 text-sm font-mono">
                          {buyerOrders.length} {buyerOrders.length === 1 ? (language === 'eu' ? 'eskaera' : 'pedido') : (language === 'eu' ? 'eskaera' : 'pedidos')}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-stone-400 block font-serif">
                        {totalSpent > 0 ? `${totalSpent.toFixed(2)} € invertidos` : 'Sin compras finalizadas'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/chat/${buyer.id}`}
                        className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
                        title={language === 'eu' ? 'Txateatu bezeroarekin' : 'Chatear con el comprador'}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => toggleExpand(buyer.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-serif ${
                          isExpanded
                            ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs'
                            : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        <span>
                          {isExpanded
                            ? (language === 'eu' ? 'Itxi' : 'Ocultar')
                            : (language === 'eu' ? `Eskaerak (${buyerOrders.length})` : `Ver Pedidos (${buyerOrders.length})`)}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Desglose de Pedidos del Comprador (Expandible) */}
                {isExpanded && (
                  <div className="bg-stone-50 dark:bg-[#141312] p-5 sm:p-6 border-t-2 border-stone-200 dark:border-stone-800 space-y-4 font-sans animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                      <h4 className="font-serif font-black text-sm uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
                        <span>
                          {language === 'eu'
                            ? `"${buyer.full_name || 'Bezeroa'}"-(r)en eskaeren historia kronologikoa:`
                            : `Historial cronológico de pedidos de "${buyer.full_name || 'Comprador'}":`}
                        </span>
                      </h4>
                      <span className="text-xs font-bold text-stone-400 font-mono">
                        {buyerOrders.length} {buyerOrders.length === 1 ? 'pedido' : 'pedidos'}
                      </span>
                    </div>

                    {buyerOrders.length > 0 ? (
                      <div className="space-y-4">
                        {buyerOrders.map((order) => {
                          const isPickup =
                            order.delivery_type === 'recogida_tienda' ||
                            order.delivery_method === 'recogida_tienda' ||
                            order.delivery_method === 'tienda';

                          const items = (order as any).order_items || [];

                          return (
                            <div
                              key={order.id}
                              className="bg-white dark:bg-[#1C1B19] rounded-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 space-y-4 shadow-2xs"
                            >
                              {/* Fila Cabecera del Pedido */}
                              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-serif font-black text-sm text-stone-900 dark:text-stone-100">
                                      {language === 'eu' ? 'Eskaera' : 'Pedido'}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 font-mono font-black text-xs text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
                                      #{order.id.slice(0, 8).toUpperCase()}
                                    </span>
                                    <span className="text-xs font-semibold text-stone-400 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {new Date(order.created_at).toLocaleDateString(LOCALE_MAP[language] || 'es', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-[10px] uppercase font-serif border border-stone-200 dark:border-stone-700">
                                    {getOrderTypeBadge(order, language)}
                                  </span>
                                  {getStatusBadge(order.status)}
                                </div>
                              </div>

                              {/* Artículos del Pedido */}
                              {items.length > 0 && (
                                <div className="space-y-2">
                                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-stone-400 font-serif block">
                                    {language === 'eu' ? 'Produktuak:' : 'Productos:'}
                                  </span>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {items.map((it: any) => {
                                      const prod = it.products || {};
                                      const img = getProductImage(prod);
                                      return (
                                        <div
                                          key={it.id}
                                          className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-50/80 dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800"
                                        >
                                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-stone-200 dark:border-stone-700">
                                            <img
                                              src={img}
                                              alt={prod.name || 'Producto'}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <span className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate block">
                                              {prod.name || 'Producto'}
                                            </span>
                                            <span className="text-[11px] text-stone-500 dark:text-stone-400 block font-mono">
                                              {it.quantity} x {Number(it.unit_price).toFixed(2)} € = {(it.quantity * Number(it.unit_price)).toFixed(2)} €
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Envío y Total */}
                              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                                  {isPickup ? (
                                    <span className="inline-flex items-center gap-1 font-medium">
                                      <Store className="w-3.5 h-3.5 text-[#C68D07] dark:text-[#FFE259]" />
                                      {t.deliv_store_pickup_tag}: {order.shipping_address || 'Tienda EkhiTeka'}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 font-medium">
                                      <Truck className="w-3.5 h-3.5 text-stone-400" />
                                      Envío refrigerado: {order.shipping_address || 'Dirección de entrega'}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-3 font-serif">
                                  <Link
                                    href={`/chat/${buyer.id}?order_id=${order.id}`}
                                    className="text-xs text-[#C68D07] dark:text-[#FFE259] font-bold hover:underline inline-flex items-center gap-1 font-sans"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>{language === 'eu' ? 'Txateatu' : 'Chat pedido'}</span>
                                  </Link>

                                  <div className="text-right">
                                    <span className="text-xs font-bold text-stone-400 mr-2 uppercase">Total:</span>
                                    <span className="text-base font-black text-stone-900 dark:text-stone-100 font-mono">
                                      {Number(order.total_amount).toFixed(2)} €
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-stone-400 space-y-1 font-sans">
                        <Package className="w-8 h-8 text-stone-300 dark:text-stone-700 mx-auto" />
                        <p className="text-xs font-bold text-stone-600 dark:text-stone-400">
                          {language === 'eu' ? 'Bezero honek oraindik ez du eskaerarik egin.' : 'Este comprador aún no ha realizado ningún pedido.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-12 text-center text-stone-400 space-y-3 font-sans">
          <Users className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
          <p className="text-base font-bold text-stone-700 dark:text-stone-300 font-serif">
            {language === 'eu' ? 'Ez da erabiltzailerik aurkitu' : 'No se encontraron compradores'}
          </p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            {searchQuery
              ? (language === 'eu' ? 'Ez da emaitzarik aurkitu bilaketa honekin.' : 'Prueba a buscar con otro término de búsqueda.')
              : (language === 'eu' ? 'Bezeroek kontua sortzean hemen agertuko dira euren informazioarekin.' : 'Cuando los compradores se registren en la tienda aparecerán listados aquí.')}
          </p>
        </div>
      )}
    </div>
  );
}
