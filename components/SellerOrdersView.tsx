'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LOCALE_MAP } from '@/lib/i18n/translations';
import { updateOrderStatus, cancelOrder } from '@/app/actions/orders';
import { getProductImage } from '@/lib/productHelpers';
import Link from 'next/link';
import type { Order, OrderStatus } from '@/types/database';
import {
  Package,
  MessageCircle,
  User,
  MapPin,
  Store,
  CheckCircle,
  Sparkles,
  XCircle,
  AlertTriangle,
  Clock,
  Check,
  ChevronRight,
  X,
  Phone,
  Truck,
  FileText,
} from 'lucide-react';

const STATUS_STEPS: { key: OrderStatus; labelKey: string }[] = [
  { key: 'pendiente', labelKey: 'orders_step_pending' },
  { key: 'confirmado', labelKey: 'orders_step_confirmed' },
  { key: 'preparando', labelKey: 'orders_step_preparing' },
  { key: 'listo_entrega', labelKey: 'orders_step_ready' },
  { key: 'entregado', labelKey: 'orders_step_delivered' },
];

export function SellerOrdersView({ orders }: { orders: Order[] }) {
  const { t, language } = useLanguage();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [seenMap, setSeenMap] = useState<Record<string, string>>({});

  // Modal para rechazar / cancelar pedido
  const [cancelModal, setCancelModal] = useState<{
    open: boolean;
    orderId: string;
    isPending: boolean;
    reason: string;
    loading: boolean;
  }>({
    open: false,
    orderId: '',
    isPending: false,
    reason: '',
    loading: false,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ekhiteka_seen_orders_seller');
      if (stored) {
        setSeenMap(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const handleMarkAsSeen = (orderId: string, currentStatus?: string) => {
    const updated = { ...seenMap, [orderId]: currentStatus || 'pendiente' };
    setSeenMap(updated);
    try {
      localStorage.setItem('ekhiteka_seen_orders_seller', JSON.stringify(updated));
      window.dispatchEvent(new Event('ekhiteka_orders_seen_updated'));
    } catch {}
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const updated = { ...seenMap, [orderId]: newStatus };
    setSeenMap(updated);
    try {
      localStorage.setItem('ekhiteka_seen_orders_seller', JSON.stringify(updated));
      window.dispatchEvent(new Event('ekhiteka_orders_seen_updated'));
    } catch {}

    setLoadingId(orderId);
    await updateOrderStatus(orderId, newStatus);
    setLoadingId(null);
  };

  const handleOpenCancelModal = (orderId: string, isPending: boolean) => {
    setCancelModal({
      open: true,
      orderId,
      isPending,
      reason: '',
      loading: false,
    });
  };

  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModal.reason.trim()) return;

    setCancelModal((prev) => ({ ...prev, loading: true }));
    const orderId = cancelModal.orderId;

    // Actualizar seenMap
    const updated = { ...seenMap, [orderId]: 'cancelado' };
    setSeenMap(updated);
    try {
      localStorage.setItem('ekhiteka_seen_orders_seller', JSON.stringify(updated));
      window.dispatchEvent(new Event('ekhiteka_orders_seen_updated'));
    } catch {}

    await cancelOrder(orderId, cancelModal.reason);
    setCancelModal({
      open: false,
      orderId: '',
      isPending: false,
      reason: '',
      loading: false,
    });
  };

  const getStatusBadge = (status: string) => {
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

  const getStepIndex = (status: string) => {
    return STATUS_STEPS.findIndex((s) => s.key === status);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
        <h1 className="text-3xl font-black font-serif text-stone-900 dark:text-stone-100">
          {t.orders_title_seller}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
          {t.orders_subtitle_seller}
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
            const isNew = !seenMap[order.id] && (order.status === 'pendiente' || !order.status);
            const currentStepIdx = getStepIndex(order.status);
            const isCancelled = order.status === 'cancelado';

            return (
              <div
                key={order.id}
                className={`bg-white dark:bg-[#1C1B19] rounded-3xl border-2 p-6 space-y-6 shadow-xs transition-all ${
                  isNew
                    ? 'border-[#FFE259] ring-2 ring-[#FFE259]/50 shadow-lg bg-amber-50/20 dark:bg-amber-950/15'
                    : isCancelled
                    ? 'border-red-200 dark:border-red-950/60 opacity-90'
                    : 'border-stone-200 dark:border-stone-800'
                }`}
              >
                {/* 1. Alerta (si la hay) */}
                {isNew && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-[#FFE259] rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-sans animate-fadeIn">
                    <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold">
                      <Sparkles className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
                      <span>{t.orders_new_order_received}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMarkAsSeen(order.id, order.status)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs hover:scale-105"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{t.orders_mark_seen}</span>
                    </button>
                  </div>
                )}

                {isCancelled && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-900/60 flex items-center gap-3 text-xs font-sans">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                    <div>
                      <span className="font-bold text-red-900 dark:text-red-200 block">
                        Este pedido ha sido cancelado
                      </span>
                      <span className="text-red-700 dark:text-red-300 text-[11px]">
                        El stock de los productos se ha restaurado y se ha notificado al comprador.
                      </span>
                    </div>
                  </div>
                )}

                {/* 2. Estado de tu pedido */}
                {!isCancelled ? (
                  <div className="p-4 bg-stone-50 dark:bg-[#141312] rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3 font-sans">
                    <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <span>Progresión del Pedido</span>
                        {getStatusBadge(order.status)}
                      </div>
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
                  <div className="flex items-center justify-between pb-1 font-sans">
                    <span className="text-xs font-bold text-stone-500">Estado del pedido:</span>
                    {getStatusBadge(order.status)}
                  </div>
                )}

                {/* 3. Productos del Pedido */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider font-serif text-stone-700 dark:text-stone-300">
                      {t.orders_products_to_prepare}
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
                                {item.products?.name || 'Producto gourmet'}
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

                {/* 4. Tipo de envio */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-800 text-xs space-y-2.5 font-sans">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-200/80 dark:border-stone-800">
                    <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
                      <User className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
                      <span>{order.profiles?.full_name || t.orders_client_label}</span>
                      {order.profiles?.phone && (
                        <span className="inline-flex items-center gap-1 text-stone-500 dark:text-stone-400 font-normal">
                          <Phone className="w-3 h-3" /> {order.profiles.phone}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-serif">
                      Tipo de Envío
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                    {isStorePickup ? (
                      <>
                        <Store className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block text-stone-900 dark:text-stone-100">{t.deliv_store_pickup_tag}</span>
                          <span className="text-[11px] text-stone-500 dark:text-stone-400">
                            {order.shipping_address || 'Punto de recogida en tienda'}
                          </span>
                          {order.pickup_schedule && (
                            <span className="block text-[11px] text-[#C68D07] dark:text-[#FFE259] font-bold mt-0.5">
                              Horario acordado: {order.pickup_schedule}
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <Truck className="w-4 h-4 text-stone-400 dark:text-stone-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block text-stone-900 dark:text-stone-100">{t.deliv_home_tag}</span>
                          <span className="text-[11px] text-stone-600 dark:text-stone-300">
                            {order.shipping_address || t.profile_not_specified || 'Dirección de entrega a domicilio'}
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
                </div>

                {/* 5. Fecha y Numero de pedido y boton de chat */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-3 font-serif">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-serif">
                        {t.orders_order_number} #{order.id.slice(0, 8)} · <span className="font-black text-stone-900 dark:text-stone-100">{t.orders_total_to_charge} {total.toFixed(2)} €</span>
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

                    <Link
                      href={`/chat/${order.buyer_id}?order_id=${order.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-xs hover:scale-102 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{t.orders_chat_with_buyer}</span>
                    </Link>
                  </div>

                  {/* Acciones de Estado (si no está cancelado) */}
                  {!isCancelled && (
                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        {order.status === 'pendiente' && (
                          <button
                            type="button"
                            disabled={loadingId === order.id}
                            onClick={() => handleStatusChange(order.id, 'confirmado')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer hover:scale-102"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{t.status_confirm}</span>
                          </button>
                        )}

                        {order.status === 'confirmado' && (
                          <button
                            type="button"
                            disabled={loadingId === order.id}
                            onClick={() => handleStatusChange(order.id, 'preparando')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer hover:scale-102"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>{t.status_preparing}</span>
                          </button>
                        )}

                        {order.status === 'preparando' && (
                          <button
                            type="button"
                            disabled={loadingId === order.id}
                            onClick={() => handleStatusChange(order.id, 'listo_entrega')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer hover:scale-102"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{t.status_ready}</span>
                          </button>
                        )}

                        {order.status === 'listo_entrega' && (
                          <button
                            type="button"
                            disabled={loadingId === order.id}
                            onClick={() => handleStatusChange(order.id, 'entregado')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer hover:scale-102"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{t.status_delivered}</span>
                          </button>
                        )}

                        {/* Botones secundarios */}
                        <div className="flex items-center gap-1">
                          {order.status !== 'confirmado' && order.status !== 'pendiente' && (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(order.id, 'confirmado')}
                              className="px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-[11px]"
                            >
                              {t.orders_step_confirmed}
                            </button>
                          )}
                          {order.status !== 'preparando' && (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(order.id, 'preparando')}
                              className="px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-[11px]"
                            >
                              {t.orders_step_preparing}
                            </button>
                          )}
                          {order.status !== 'listo_entrega' && (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(order.id, 'listo_entrega')}
                              className="px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-[11px]"
                            >
                              {t.orders_step_ready}
                            </button>
                          )}
                        </div>
                      </div>

                      {order.status !== 'entregado' && (
                        <button
                          type="button"
                          onClick={() => handleOpenCancelModal(order.id, order.status === 'pendiente')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-xs font-bold transition-colors cursor-pointer ml-auto"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{order.status === 'pendiente' ? t.orders_reject : t.orders_cancel_order}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center space-y-4 bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8">
          <Package className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
          <h3 className="text-lg font-black font-serif text-stone-800 dark:text-stone-200">
            {t.orders_no_orders_seller}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
            {t.orders_no_orders_seller_sub}
          </p>
        </div>
      )}

      {/* Modal de Cancelación / Rechazo con Motivo por Chat */}
      {cancelModal.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn font-sans">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 font-serif">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-black text-lg text-stone-900 dark:text-stone-100">
                  {cancelModal.isPending ? t.orders_reject : t.orders_cancel_order}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCancelModal({ open: false, orderId: '', isPending: false, reason: '', loading: false })}
                className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmCancel} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl text-stone-800 dark:text-stone-200 space-y-1">
                <span className="font-bold block flex items-center gap-1.5 text-[#C68D07] dark:text-[#FFE259]">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Notificación automática por chat</span>
                </span>
                <p className="text-[11px] text-stone-600 dark:text-stone-300">
                  {t.orders_cancel_chat_notice}
                </p>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.orders_cancel_reason_label}
                </label>
                <textarea
                  required
                  rows={4}
                  value={cancelModal.reason}
                  onChange={(e) => setCancelModal((prev) => ({ ...prev, reason: e.target.value }))}
                  placeholder={t.orders_cancel_reason_placeholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Sugerencias rápidas de motivo */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Motivos sugeridos (clic para rellenar):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Falta de stock disponible para este producto',
                    'Imposibilidad de entrega en la fecha u horario solicitado',
                    'Dirección de entrega fuera de la zona de cobertura',
                    'Cancelación acordada directamente con el cliente',
                  ].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setCancelModal((prev) => ({ ...prev, reason: sug }))}
                      className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg text-[10.5px] text-left transition-colors cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2 font-serif">
                <button
                  type="button"
                  onClick={() => setCancelModal({ open: false, orderId: '', isPending: false, reason: '', loading: false })}
                  className="px-4 py-2 rounded-xl text-stone-500 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  {t.common_cancel}
                </button>
                <button
                  type="submit"
                  disabled={cancelModal.loading || !cancelModal.reason.trim()}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 hover:scale-102"
                >
                  {cancelModal.loading ? t.common_loading : t.orders_confirm_cancel_btn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
