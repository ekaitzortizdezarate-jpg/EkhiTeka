'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LOCALE_MAP } from '@/lib/i18n/translations';
import Link from 'next/link';
import { getProductImage } from '@/lib/productHelpers';
import type { Order } from '@/types/database';
import {
  Package,
  MessageCircle,
  MapPin,
  Store,
  CheckCircle,
  Sparkles,
  AlertTriangle,
  Truck,
} from 'lucide-react';

const STATUS_STEPS = [
  { key: 'pendiente', labelKey: 'orders_step_pending' },
  { key: 'confirmado', labelKey: 'orders_step_confirmed' },
  { key: 'preparando', labelKey: 'orders_step_preparing' },
  { key: 'listo_entrega', labelKey: 'orders_step_ready' },
  { key: 'entregado', labelKey: 'orders_step_delivered' },
];

export function BuyerOrdersView({ orders }: { orders: Order[] }) {
  const { t, language } = useLanguage();
  const [seenMap, setSeenMap] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ekhiteka_seen_orders_buyer');
      if (stored) {
        setSeenMap(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const handleMarkAsSeen = (orderId: string, currentStatus: string) => {
    const updated = { ...seenMap, [orderId]: currentStatus };
    setSeenMap(updated);
    try {
      localStorage.setItem('ekhiteka_seen_orders_buyer', JSON.stringify(updated));
      window.dispatchEvent(new Event('ekhiteka_orders_seen_updated'));
    } catch {}
  };

  const getStatusBadge = (status: string, hasUpdate: boolean) => {
    if (hasUpdate) {
      return (
        <span className="px-3 py-1 rounded-xl bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider font-serif shadow-md animate-pulse">
          {getStatusText(status)}
        </span>
      );
    }
    switch (status) {
      case 'pendiente':
        return (
          <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-[#C68D07] dark:text-[#FFE259] font-black text-xs uppercase tracking-wider font-serif border border-amber-300 dark:border-amber-700">
            {t.orders_pending}
          </span>
        );
      case 'confirmado':
        return (
          <span className="px-3 py-1 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-200 font-black text-xs uppercase tracking-wider font-serif border border-blue-300 dark:border-blue-700">
            {t.orders_confirmed}
          </span>
        );
      case 'preparando':
        return (
          <span className="px-3 py-1 rounded-xl bg-orange-100 dark:bg-orange-950/70 text-orange-800 dark:text-orange-200 font-black text-xs uppercase tracking-wider font-serif border border-orange-300 dark:border-orange-700">
            {t.orders_preparing}
          </span>
        );
      case 'listo_entrega':
        return (
          <span className="px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-200 font-black text-xs uppercase tracking-wider font-serif border border-purple-300 dark:border-purple-700">
            {t.orders_ready_delivery}
          </span>
        );
      case 'entregado':
        return (
          <span className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 font-black text-xs uppercase tracking-wider font-serif border border-emerald-300 dark:border-emerald-700">
            {t.orders_delivered}
          </span>
        );
      case 'cancelado':
        return (
          <span className="px-3 py-1 rounded-xl bg-red-100 dark:bg-red-950/70 text-red-800 dark:text-red-200 font-black text-xs uppercase tracking-wider font-serif border border-red-300 dark:border-red-700">
            {t.orders_cancelled}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-black text-xs uppercase tracking-wider font-serif">
            {status}
          </span>
        );
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendiente': return t.orders_pending;
      case 'confirmado': return t.orders_confirmed;
      case 'preparando': return t.orders_preparing;
      case 'listo_entrega': return t.orders_ready_delivery;
      case 'entregado': return t.orders_delivered;
      case 'cancelado': return t.orders_cancelled;
      default: return status;
    }
  };

  const getStepIndex = (status: string) => {
    return STATUS_STEPS.findIndex((s) => s.key === status);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
        <h1 className="text-3xl font-black font-serif text-stone-900 dark:text-stone-100">
          {t.orders_title}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
          {t.orders_subtitle_buyer}
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const total = Number(order.total_price ?? order.total_amount ?? 0);
            const isStorePickup =
              order.delivery_type === 'recogida_tienda' ||
              order.delivery_method === 'recogida_tienda' ||
              order.delivery_method === 'tienda';

            const lastSeenStatus = seenMap[order.id];
            const hasUpdate = lastSeenStatus ? lastSeenStatus !== order.status : order.status !== 'pendiente';
            const currentStepIdx = getStepIndex(order.status);
            const isCancelled = order.status === 'cancelado';

            return (
              <div
                key={order.id}
                className={`bg-white dark:bg-[#1C1B19] rounded-3xl border-2 p-6 space-y-5 shadow-xs transition-all ${
                  hasUpdate
                    ? 'border-[#FFE259] ring-2 ring-[#FFE259]/40 shadow-lg'
                    : isCancelled
                    ? 'border-red-200 dark:border-red-950/60 opacity-90'
                    : 'border-stone-200 dark:border-stone-800'
                }`}
              >
                {/* Banner de novedad si el pedido cambió de estado */}
                {hasUpdate && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-[#FFE259] rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs font-sans animate-fadeIn">
                    <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold">
                      <Sparkles className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
                      <span>
                        {t.orders_new_status}{' '}
                        <strong className="text-[#C68D07] dark:text-[#FFE259] uppercase">
                          {getStatusText(order.status)}
                        </strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMarkAsSeen(order.id, order.status)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-[11px] uppercase tracking-wider rounded-xl shadow-xs cursor-pointer transition-transform hover:scale-105"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{t.orders_mark_seen}</span>
                    </button>
                  </div>
                )}

                {/* Cabecera del pedido */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-serif">
                      {t.orders_order_number} #{order.id.slice(0, 8)}
                    </span>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                      {new Date(order.created_at).toLocaleDateString(LOCALE_MAP[language] || 'eu', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status, hasUpdate)}
                    <span className="text-base font-black font-serif text-stone-900 dark:text-stone-100">
                      {total.toFixed(2)} €
                    </span>
                  </div>
                </div>

                {/* Stepper visual de progresión del pedido */}
                {!isCancelled ? (
                  <div className="p-4 bg-stone-50 dark:bg-[#141312] rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3 font-sans">
                    <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      <span>Estado de tu pedido</span>
                      <span className="text-stone-600 dark:text-stone-300 font-semibold lowercase">
                        Paso {Math.max(1, currentStepIdx + 1)} de 5
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 items-center">
                      {STATUS_STEPS.map((step, idx) => {
                        const isPassed = currentStepIdx >= idx;
                        const isCurrent = currentStepIdx === idx;
                        return (
                          <div key={step.key} className="space-y-1.5 text-center">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                isCurrent
                                  ? 'bg-[#FFE259] shadow-xs'
                                  : isPassed
                                  ? 'bg-emerald-500'
                                  : 'bg-stone-200 dark:bg-stone-800'
                              }`}
                            />
                            <span
                              className={`text-[9.5px] sm:text-[10.5px] block font-bold leading-tight truncate ${
                                isCurrent
                                  ? 'text-stone-950 dark:text-[#FFE259] font-black'
                                  : isPassed
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : 'text-stone-400 dark:text-stone-600'
                              }`}
                            >
                              {(t as any)[step.labelKey] || step.key}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-900/60 flex items-center gap-3 text-xs font-sans">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                    <div>
                      <span className="font-bold text-red-900 dark:text-red-200 block">
                        Pedido cancelado
                      </span>
                      <span className="text-red-700 dark:text-red-300 text-[11px]">
                        Revisa tu chat con el artesano para consultar el motivo de la cancelación.
                      </span>
                    </div>
                  </div>
                )}

                {/* Productos del pedido con miniaturas con foto real */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider font-serif text-stone-700 dark:text-stone-300">
                      {t.orders_products_label}
                    </h4>
                    <div className="space-y-2">
                      {order.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-xs py-2.5 px-3.5 rounded-2xl bg-stone-50/80 dark:bg-[#141312]/80 border border-stone-200/80 dark:border-stone-800 font-sans gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200/70 dark:border-stone-700 shrink-0 relative">
                              <img
                                src={getProductImage(item.products)}
                                alt={item.products?.name || 'Producto'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-stone-900 dark:text-stone-100 block text-xs truncate">
                                {item.products?.name || 'Producto Gourmet'}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="px-2 py-0.5 rounded-md bg-[#FFE259] text-[#1D1D1B] font-black text-[10px]">
                                  x{item.quantity}
                                </span>
                                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                                  {Number(item.unit_price).toFixed(2)} €/ud
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="font-serif font-black text-stone-900 dark:text-stone-100 shrink-0 text-sm">
                            {Number(item.subtotal || item.unit_price * item.quantity).toFixed(2)} €
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Entrega y Contacto */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs font-serif">
                  <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300 font-sans">
                    {isStorePickup ? (
                      <>
                        <Store className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
                        <div>
                          <span className="font-bold block">{t.deliv_store_pickup_tag}</span>
                          <span className="text-[11px] text-stone-500 dark:text-stone-400">
                            {order.shipping_address || 'Punto de recogida en tienda'}
                          </span>
                          {order.pickup_schedule && (
                            <span className="block text-[11px] text-[#C68D07] dark:text-[#FFE259] font-bold mt-0.5">
                              Horario: {order.pickup_schedule}
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <Truck className="w-4 h-4 text-stone-400 dark:text-stone-500 shrink-0" />
                        <div>
                          <span className="font-bold block">{t.deliv_home_tag}</span>
                          <span className="text-[11px] text-stone-600 dark:text-stone-300">
                            {order.shipping_address || t.deliv_home_tag}
                          </span>
                          {order.shipping_notes && (
                            <span className="block text-[11px] italic text-stone-500 dark:text-stone-400 mt-0.5">
                              Indicaciones: {order.shipping_notes}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <Link
                    href={`/chat/${order.seller_id || ''}?order_id=${order.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-stone-800 dark:text-stone-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-2xs hover:scale-102"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{t.orders_chat_with_seller}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center space-y-4 bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8">
          <Package className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
          <h3 className="text-lg font-black font-serif text-stone-800 dark:text-stone-200">
            {t.orders_no_orders}
          </h3>
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider font-serif shadow-xs hover:scale-105 transition-all"
          >
            <span>{t.cart_explore_btn}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
