'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { LOCALE_MAP } from '@/lib/i18n/translations';
import {
  updateOrderStatus,
  cancelOrder,
  deleteOrderPermanently,
  markOrderAsSeenBySeller,
  markAllOrdersAsSeenBySeller,
} from '@/app/actions/orders';
import { getProductImage, getPackItems, getOrderTypeBadge } from '@/lib/productHelpers';
import Link from 'next/link';
import type { Order, OrderStatus } from '@/types/database';
import { getOrderStatusHistory, getCleanShippingNotes } from '@/types/database';
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
  Phone,
  Truck,
  Trash2,
  X,
  Layers,
  Bell,
  Eye,
} from 'lucide-react';

const STATUS_STEPS: { key: OrderStatus; labelKey: string }[] = [
  { key: 'pendiente', labelKey: 'orders_step_pending' },
  { key: 'confirmado', labelKey: 'orders_step_confirmed' },
  { key: 'preparando', labelKey: 'orders_step_preparing' },
  { key: 'listo_entrega', labelKey: 'orders_step_ready' },
  { key: 'entregado', labelKey: 'orders_step_delivered' },
];

export function SellerOrdersView({
  orders,
  currentUserId = '',
  initialLastReadOrders = {},
}: {
  orders: Order[];
  currentUserId?: string;
  initialLastReadOrders?: Record<string, string>;
}) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);
  const [activeTab, setActiveTab] = useState<'actuales' | 'terminados'>('actuales');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Mapa de vistos aislado por vendedor
  const [seenMap, setSeenMap] = useState<Record<string, string>>(() => {
    let fromLocal: Record<string, string> = {};
    if (typeof window !== 'undefined' && currentUserId) {
      try {
        const stored =
          localStorage.getItem(`ekhiteka_seen_orders_${currentUserId}`) ||
          localStorage.getItem('ekhiteka_seen_orders_seller');
        if (stored) fromLocal = JSON.parse(stored);
      } catch {}
    }
    return { ...initialLastReadOrders, ...fromLocal };
  });

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  useEffect(() => {
    if (!currentUserId) return;
    try {
      const stored =
        localStorage.getItem(`ekhiteka_seen_orders_${currentUserId}`) ||
        localStorage.getItem('ekhiteka_seen_orders_seller');
      if (stored) {
        setSeenMap((prev) => ({ ...initialLastReadOrders, ...JSON.parse(stored), ...prev }));
      }
    } catch {}
  }, [currentUserId, initialLastReadOrders]);

  // Modal para cancelar pedido en curso (pasa a terminados)
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

  // Modal para borrado permanente definitivo del sistema
  const [permanentDeleteModal, setPermanentDeleteModal] = useState<{
    open: boolean;
    orderId: string;
    loading: boolean;
  }>({
    open: false,
    orderId: '',
    loading: false,
  });

  const handleMarkAsSeen = async (orderId: string) => {
    const nowIso = new Date().toISOString();
    const updated = { ...seenMap, [orderId]: nowIso };
    setSeenMap(updated);
    if (currentUserId) {
      try {
        localStorage.setItem(`ekhiteka_seen_orders_${currentUserId}`, JSON.stringify(updated));
        window.dispatchEvent(new Event('ekhiteka_orders_seen_updated'));
      } catch {}
    }
    await markOrderAsSeenBySeller(orderId, nowIso);
    router.refresh();
  };

  const handleMarkAllAsSeen = async () => {
    const nowIso = new Date().toISOString();
    const updated = { ...seenMap };
    const idsToMark: string[] = [];
    localOrders.forEach((o) => {
      updated[o.id] = nowIso;
      idsToMark.push(o.id);
    });
    setSeenMap(updated);
    if (currentUserId) {
      try {
        localStorage.setItem(`ekhiteka_seen_orders_${currentUserId}`, JSON.stringify(updated));
        window.dispatchEvent(new Event('ekhiteka_orders_seen_updated'));
      } catch {}
    }
    if (idsToMark.length > 0) {
      await markAllOrdersAsSeenBySeller(idsToMark);
    }
    router.refresh();
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const nowIso = new Date().toISOString();
    const updated = { ...seenMap, [orderId]: nowIso };
    setSeenMap(updated);
    if (currentUserId) {
      try {
        localStorage.setItem(`ekhiteka_seen_orders_${currentUserId}`, JSON.stringify(updated));
        window.dispatchEvent(new Event('ekhiteka_orders_seen_updated'));
      } catch {}
    }

    setLocalOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, updated_at: nowIso } : o))
    );
    setLoadingId(orderId);
    await updateOrderStatus(orderId, newStatus);
    setLoadingId(null);
    router.refresh();
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
    const nowIso = new Date().toISOString();

    const updated = { ...seenMap, [orderId]: nowIso };
    setSeenMap(updated);
    if (currentUserId) {
      try {
        localStorage.setItem(`ekhiteka_seen_orders_${currentUserId}`, JSON.stringify(updated));
        window.dispatchEvent(new Event('ekhiteka_orders_seen_updated'));
      } catch {}
    }

    setLocalOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelado', updated_at: nowIso } : o))
    );
    await cancelOrder(orderId, cancelModal.reason);
    setCancelModal({
      open: false,
      orderId: '',
      isPending: false,
      reason: '',
      loading: false,
    });
    router.refresh();
  };

  const handleConfirmPermanentDelete = async () => {
    if (!permanentDeleteModal.orderId) return;
    const orderIdToDelete = permanentDeleteModal.orderId;
    setPermanentDeleteModal((prev) => ({ ...prev, loading: true }));

    // Optimistic removal from UI
    setLocalOrders((prev) => prev.filter((o) => o.id !== orderIdToDelete));

    const res = await deleteOrderPermanently(orderIdToDelete);
    setPermanentDeleteModal({ open: false, orderId: '', loading: false });

    if (res?.error) {
      alert(`Error al eliminar: ${res.error}`);
    } else {
      router.refresh();
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
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
        return null;
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    return STATUS_STEPS.findIndex((s) => s.key === status);
  };

  const actualOrders = localOrders.filter((o) => o.status !== 'entregado' && o.status !== 'cancelado');
  const finishedOrders = localOrders.filter((o) => o.status === 'entregado' || o.status === 'cancelado');
  const currentOrders = activeTab === 'actuales' ? actualOrders : finishedOrders;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Modal de Cancelación / Rechazo (pasa a terminados) */}
      {cancelModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn font-sans">
          <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-serif font-black text-base text-stone-900 dark:text-stone-100">
                  {cancelModal.isPending
                    ? language === 'eu'
                      ? 'Baztertu Eskaera'
                      : 'Rechazar Pedido'
                    : t.orders_cancel_modal_title || 'Cancelar Pedido'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCancelModal((prev) => ({ ...prev, open: false }))}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              {cancelModal.isPending
                ? language === 'eu'
                  ? 'Eskaera hau baztertzean amaituetara igaroko da eta bezeroari jakinaraziko zaio.'
                  : 'Al rechazar este pedido pasará a terminados y se notificará al cliente.'
                : t.orders_cancel_chat_notice ||
                  'Al cancelar este pedido pasará a la sección de terminados y se notificará al cliente.'}
            </p>

            <form onSubmit={handleConfirmCancel} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t.orders_cancel_reason_label || 'Motivo'} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={cancelModal.reason}
                  onChange={(e) => setCancelModal((prev) => ({ ...prev, reason: e.target.value }))}
                  placeholder={
                    cancelModal.isPending
                      ? language === 'eu'
                        ? 'Adierazi eskaera baztertzeko arrazoia...'
                        : 'Indica el motivo del rechazo del pedido...'
                      : t.orders_cancel_reason_placeholder || 'Indica el motivo de cancelación...'
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 outline-hidden focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={cancelModal.loading}
                  onClick={() => setCancelModal((prev) => ({ ...prev, open: false }))}
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  {language === 'eu' ? 'Atzera' : 'Volver'}
                </button>
                <button
                  type="submit"
                  disabled={cancelModal.loading || !cancelModal.reason.trim()}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                >
                  {cancelModal.loading
                    ? language === 'eu'
                      ? 'Izapidetzen...'
                      : 'Procesando...'
                    : cancelModal.isPending
                    ? language === 'eu'
                      ? 'Baztertu'
                      : 'Rechazar'
                    : t.orders_confirm_cancel_btn || 'Confirmar Cancelación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Borrado Definitivo del Sistema */}
      {permanentDeleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn font-sans">
          <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-red-300 dark:border-red-900/80 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2 text-red-600">
                <Trash2 className="w-5 h-5" />
                <h3 className="font-serif font-black text-base text-stone-900 dark:text-stone-100">
                  {language === 'eu' ? 'Eskaera Betirako Ezabatu' : 'Eliminar Pedido del Sistema'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPermanentDeleteModal({ open: false, orderId: '', loading: false })}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              {language === 'eu'
                ? 'Eskaera hau eta bere informazio guztia betirako ezabatuko da sistematik. Ekintza hau ezin da desegin. Ziur zaude?'
                : 'Este pedido y toda su información se eliminarán por completo y de forma definitiva del sistema. Esta acción no se puede deshacer. ¿Deseas continuar?'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={permanentDeleteModal.loading}
                onClick={() => setPermanentDeleteModal({ open: false, orderId: '', loading: false })}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                {language === 'eu' ? 'Utzi' : 'Cancelar'}
              </button>
              <button
                type="button"
                disabled={permanentDeleteModal.loading}
                onClick={handleConfirmPermanentDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>
                  {permanentDeleteModal.loading
                    ? language === 'eu'
                      ? 'Ezabatzen...'
                      : 'Eliminando...'
                    : language === 'eu'
                    ? 'Bai, Betirako Ezabatu'
                    : 'Sí, Eliminar Definitivamente'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cabecera de la página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h1 className="text-3xl font-black font-serif text-stone-900 dark:text-stone-100">
            {t.orders_title_seller}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5">
            {t.orders_subtitle_seller}
          </p>
        </div>

        {/* Pestañas: Actuales (por defecto) y Terminados */}
        <div className="flex items-center p-1 bg-stone-100 dark:bg-[#141312] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs font-sans text-xs shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('actuales')}
            className={`py-2 px-4 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'actuales'
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{language === 'eu' ? 'Unekoak' : 'Actuales'}</span>
            <span className="px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/15 text-[10.5px]">
              {actualOrders.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('terminados')}
            className={`py-2 px-4 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'terminados'
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{language === 'eu' ? 'Amaituak' : 'Terminados'}</span>
            <span className="px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/15 text-[10.5px]">
              {finishedOrders.length}
            </span>
          </button>
        </div>
      </div>

      {/* Banner resumen de alertas de cambios de estado sin revisar */}
      {(() => {
        const unseenCount = currentOrders.filter((order) => {
          const history = getOrderStatusHistory(order.shipping_notes);
          const latestHistory = history.length > 0 ? history[history.length - 1] : null;
          const isUpdatedByOther = latestHistory?.changed_by_id
            ? latestHistory.changed_by_id !== currentUserId
            : true;
          const lastSeen = seenMap[order.id];
          if (!lastSeen) return true;
          if (lastSeen.includes('T') || lastSeen.includes('-')) {
            const lastSeenTime = new Date(lastSeen).getTime();
            const orderTime = new Date(order.updated_at || order.created_at).getTime();
            return isUpdatedByOther && orderTime > lastSeenTime;
          }
          return lastSeen !== order.status;
        }).length;

        if (unseenCount === 0) return null;

        return (
          <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-400 dark:border-amber-500 flex flex-wrap items-center justify-between gap-3 shadow-md animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#FFE259] text-[#1D1D1B] shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black font-serif text-stone-900 dark:text-stone-100">
                  {language === 'eu'
                    ? `${unseenCount} egoera aldaketa berri ikusi gabe dituzu`
                    : `Tienes ${unseenCount} alerta(s) de cambio de estado sin revisar`}
                </h3>
                <p className="text-[11px] text-stone-600 dark:text-stone-300">
                  {language === 'eu'
                    ? 'Beste saltzaileek egindako eguneraketak ikusi gisa markatu ditzakezu hemen.'
                    : 'Los cambios de estado realizados por otros vendedores mantendrán la alerta hasta que des a "visto".'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleMarkAllAsSeen}
              className="px-4 py-2 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] active:scale-95 text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer ml-auto flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{language === 'eu' ? 'Guztiak ikusi gisa markatu' : 'Marcar todas como vistas'}</span>
            </button>
          </div>
        );
      })()}

      {currentOrders.length > 0 ? (
        <div className="space-y-6">
          {currentOrders.map((order) => {
            const isStorePickup =
              order.delivery_type === 'recogida_tienda' ||
              order.delivery_method === 'recogida_tienda' ||
              order.delivery_method === 'tienda';

            const history = getOrderStatusHistory(order.shipping_notes);
            const latestHistory = history.length > 0 ? history[history.length - 1] : null;
            const isUpdatedByOther = latestHistory?.changed_by_id
              ? latestHistory.changed_by_id !== currentUserId
              : true;

            const lastSeen = seenMap[order.id];
            let hasUnseenAlert = false;
            if (!lastSeen) {
              hasUnseenAlert = true;
            } else if (lastSeen.includes('T') || lastSeen.includes('-')) {
              const lastSeenTime = new Date(lastSeen).getTime();
              const orderTime = new Date(order.updated_at || order.created_at).getTime();
              hasUnseenAlert = isUpdatedByOther && orderTime > lastSeenTime;
            } else {
              hasUnseenAlert = lastSeen !== order.status;
            }

            const currentStepIdx = getStepIndex(order.status);
            const isCancelled = order.status === 'cancelado';
            const isDelivered = order.status === 'entregado';

            return (
              <div
                key={order.id}
                className={`bg-white dark:bg-[#1C1B19] rounded-3xl border-2 p-6 space-y-6 shadow-xs transition-all ${
                  hasUnseenAlert && !isCancelled && !isDelivered
                    ? 'border-[#FFE259] ring-2 ring-[#FFE259]/50 shadow-lg bg-amber-50/20 dark:bg-amber-950/15'
                    : isCancelled
                    ? 'border-red-200 dark:border-red-950/60 opacity-95'
                    : 'border-stone-200 dark:border-stone-800'
                }`}
              >
                {/* 1. Cabecera del pedido: Texto "Pedido #..." arriba a la izquierda */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-black text-sm sm:text-base text-stone-900 dark:text-stone-100 tracking-tight">
                        {language === 'eu' ? 'Eskaera' : language === 'fr' ? 'Commande' : language === 'en' ? 'Order' : 'Pedido'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono font-black text-xs sm:text-[13px] tracking-wider border border-stone-300 dark:border-stone-700 shadow-2xs">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11.5px] font-sans font-medium text-stone-500 dark:text-stone-400">
                      {new Date(order.created_at).toLocaleDateString(LOCALE_MAP[language] || 'eu', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-black text-[11px] uppercase tracking-wider font-serif border border-stone-200 dark:border-stone-700 shadow-2xs">
                      {getOrderTypeBadge(order, language)}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* 2. Alerta de nuevo pedido o cambio de estado */}
                {hasUnseenAlert && !isCancelled && (
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border-2 border-[#FFE259] rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-sans animate-fadeIn shadow-xs">
                    <div className="flex items-center gap-2.5 text-stone-900 dark:text-stone-100">
                      <div className="p-1.5 rounded-lg bg-[#FFE259] text-[#1D1D1B]">
                        <Bell className="w-4 h-4 animate-bounce" />
                      </div>
                      <div>
                        <p className="font-serif font-black text-xs sm:text-[13px] text-[#1D1D1B] dark:text-[#FFE259]">
                          {latestHistory && history.length > 1
                            ? language === 'eu'
                              ? 'Egoera aldaketa berria!'
                              : '¡Alerta de cambio de estado!'
                            : t.orders_new_order_received}
                        </p>
                        <p className="text-[11px] text-stone-600 dark:text-stone-300 font-medium">
                          {latestHistory && history.length > 1 ? (
                            <>
                              <span>{language === 'eu' ? 'Aldatua:' : 'Cambiado por:'} </span>
                              <strong className="font-bold">{latestHistory.changed_by_name || 'Vendedor'}</strong>
                              <span> ({latestHistory.status})</span>
                              {latestHistory.timestamp && (
                                <span className="text-stone-400 ml-1">
                                  · {new Date(latestHistory.timestamp).toLocaleTimeString(LOCALE_MAP[language] || 'eu', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </>
                          ) : (
                            <span>{language === 'eu' ? 'Bezeroaren eskaera berria.' : 'Nuevo pedido recibido de cliente.'}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMarkAsSeen(order.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFE259] hover:bg-[#F5D742] active:scale-95 text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{language === 'eu' ? 'Ikusi gisa markatu' : 'Marcar como visto'}</span>
                    </button>
                  </div>
                )}

                {isCancelled && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-900/60 flex items-center gap-3 text-xs font-sans">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                    <div>
                      <span className="font-bold text-red-900 dark:text-red-200 block">
                        {language === 'eu' ? 'Eskaera hau ezeztatuta dago' : 'Este pedido ha sido cancelado'}
                      </span>
                      <span className="text-red-700 dark:text-red-300 text-[11px]">
                        {language === 'eu'
                          ? 'Produktuen stock-a berrezarri da eta bezeroari jakinarazi zaio.'
                          : 'El stock de los productos se ha restaurado y se ha notificado al comprador.'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. Progresión del Pedido */}
                {!isCancelled ? (
                  <div className="p-4 bg-stone-50 dark:bg-[#141312] rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3 font-sans">
                    <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      <span>Progresión del Pedido</span>
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
                ) : null}

                {/* Historial de Gestión de la Tienda (Visible solo para vendedores) */}
                {(() => {
                  const history = getOrderStatusHistory(order.shipping_notes);
                  if (history.length === 0) return null;

                  return (
                    <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-900/50 space-y-2 text-xs font-sans">
                      <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-200 font-serif">
                        <Clock className="w-3.5 h-3.5 text-[#C68D07] dark:text-[#FFE259]" />
                        <span>Historial de Estado (Equipo de Tienda):</span>
                      </div>
                      <div className="space-y-1.5 pl-1 border-l-2 border-amber-300 dark:border-amber-700 ml-1">
                        {history.map((h, hIdx) => {
                          const dateFormatted = new Date(h.timestamp).toLocaleDateString(LOCALE_MAP[language] || 'es', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          });
                          return (
                            <div key={hIdx} className="text-[11.5px] text-stone-700 dark:text-stone-300 pl-2">
                              <span className="font-bold capitalize text-stone-900 dark:text-stone-100">
                                {h.status === 'pendiente'
                                  ? 'Pedido creado'
                                  : h.status === 'confirmado'
                                  ? 'Confirmado'
                                  : h.status === 'preparando'
                                  ? 'En preparación'
                                  : h.status === 'listo_entrega'
                                  ? 'Listo para entrega / envío'
                                  : h.status === 'entregado'
                                  ? 'Entregado'
                                  : 'Cancelado'}
                              </span>{' '}
                              · <span className="font-semibold text-amber-800 dark:text-amber-300">{h.changed_by_name}</span>{' '}
                              · <span className="text-stone-500 dark:text-stone-400">{dateFormatted}</span>
                              {h.notes && (
                                <span className="block italic text-[10.5px] text-stone-500 dark:text-stone-400 mt-0.5">
                                  Motivo: "{h.notes}"
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* 4. Tipo de Envío / Datos de Entrega */}
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
                          {getCleanShippingNotes(order.shipping_notes) && (
                            <span className="block text-[11px] italic text-stone-500 dark:text-stone-400 mt-0.5">
                              Indicaciones: {getCleanShippingNotes(order.shipping_notes)}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 5. PRODUCTOS A PREPARAR (Colocado debajo de Tipo de Envío, cada sub-item a todo el ancho) */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider font-serif text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
                        <span>{t.orders_products_to_prepare}</span>
                      </h4>
                      <span className="text-xs text-stone-500 font-bold font-serif">
                        {order.order_items.length} {order.order_items.length === 1 ? 'artículo' : 'artículos'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {order.order_items.map((item) => {
                        const packItems = getPackItems(item.products);
                        const isPack = packItems.length > 0;

                        return (
                          <div
                            key={item.id}
                            className="p-4 rounded-2xl bg-stone-50/90 dark:bg-[#141312] border border-stone-200/80 dark:border-stone-800 font-sans space-y-3 shadow-2xs"
                          >
                            <div className="flex items-center justify-between text-xs gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-13 h-13 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200/70 dark:border-stone-700 shrink-0 relative">
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
                                  <span className="font-bold text-stone-900 dark:text-stone-100 block text-xs sm:text-sm truncate">
                                    {item.products?.name || 'Producto gourmet'}
                                  </span>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="px-2 py-0.5 rounded-md bg-[#FFE259] text-[#1D1D1B] font-black text-[10.5px]">
                                      x{item.quantity}
                                    </span>
                                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                                      {Number(item.unit_price).toFixed(2)} €/ud
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <span className="font-serif font-black text-stone-900 dark:text-stone-100 shrink-0 text-base">
                                {Number(item.subtotal || item.unit_price * item.quantity).toFixed(2)} €
                              </span>
                            </div>

                            {/* Desglose de sub-items si es pack/cata/cesta: cada uno ocupa todo el ancho de la tarjeta */}
                            {isPack && (
                              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2.5">
                                <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-[#C68D07] dark:text-[#FFE259] uppercase tracking-wider font-serif">
                                  <Package className="w-3.5 h-3.5 shrink-0" />
                                  <span>
                                    {language === 'eu'
                                      ? 'PACK-AK DAKARRENA:'
                                      : language === 'fr'
                                      ? 'LE PACK COMPREND :'
                                      : language === 'en'
                                      ? 'THE PACK INCLUDES:'
                                      : 'EL PACK INCLUYE:'}
                                  </span>
                                </div>

                                <div className="space-y-2 w-full">
                                  {packItems.map((subItem, sIdx) => (
                                    <div
                                      key={sIdx}
                                      className="p-3 rounded-2xl bg-white dark:bg-[#1C1B19] border border-stone-200 dark:border-stone-700/70 text-xs w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                                    >
                                      <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-stone-200/60 dark:border-stone-700">
                                          <img
                                            src={subItem.imageUrl || '/images/secciones/Quesos.JPG'}
                                            alt={subItem.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                                            }}
                                          />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <span className="font-bold text-stone-900 dark:text-stone-100 block text-xs sm:text-sm truncate">
                                            {subItem.name}
                                          </span>
                                          {subItem.description && (
                                            <p className="text-[10.5px] text-stone-500 dark:text-stone-400 italic truncate mt-0.5">
                                              {subItem.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto font-serif text-[11px]">
                                        {subItem.quantity && (
                                          <span className="px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 font-black text-stone-800 dark:text-stone-200">
                                            x{subItem.quantity}
                                          </span>
                                        )}
                                        {subItem.weight_display && (
                                          <span className="px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 font-bold text-stone-700 dark:text-stone-300">
                                            {subItem.weight_display}
                                          </span>
                                        )}
                                        {subItem.price && (
                                          <span className="font-black text-stone-900 dark:text-stone-100">
                                            {(Number(subItem.price) * (subItem.quantity || 1)).toFixed(2)} €
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 6. PARTE INFERIOR: Según si está en Actuales o en Terminados */}
                {activeTab === 'terminados' ? (
                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 font-sans">
                    {/* Botón Chat */}
                    <Link
                      href={`/chat/${order.buyer_id}?order_id=${order.id}`}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-xs hover:scale-102 cursor-pointer whitespace-nowrap min-h-[40px]"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>{t.orders_chat_with_buyer}</span>
                    </Link>

                    {/* Botón Borrar Definitivamente del Sistema */}
                    <button
                      type="button"
                      onClick={() => setPermanentDeleteModal({ open: true, orderId: order.id, loading: false })}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-xs hover:scale-102 cursor-pointer min-h-[40px] whitespace-nowrap"
                    >
                      <Trash2 className="w-4 h-4 shrink-0" />
                      <span>{language === 'eu' ? 'Betirako Ezabatu' : 'Borrar del Sistema'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 font-sans">
                    {/* Botón 1: Chat con el comprador */}
                    <Link
                      href={`/chat/${order.buyer_id}?order_id=${order.id}`}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-xs hover:scale-102 cursor-pointer whitespace-nowrap min-h-[40px]"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>{t.orders_chat_with_buyer}</span>
                    </Link>

                    {/* Botón 2: Borrar Pedido (Pasa a Terminados como Cancelado) */}
                    <button
                      type="button"
                      onClick={() => handleOpenCancelModal(order.id, order.status === 'pendiente')}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer min-h-[40px] whitespace-nowrap"
                      title="Cancelar y pasar a terminados"
                    >
                      <Trash2 className="w-4 h-4 shrink-0" />
                      <span>{language === 'eu' ? 'Ezabatu' : 'Borrar'}</span>
                    </button>

                    {/* Botón 3: Menú desplegable para cambiar a cualquier estado del pedido con iconos monocromáticos */}
                    <div className="w-full sm:w-auto flex-1 min-w-[200px]">
                      <select
                        value={order.status}
                        disabled={loadingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/70 dark:hover:bg-stone-750 text-stone-900 dark:text-stone-100 font-bold text-xs uppercase tracking-wider rounded-2xl border border-stone-200 dark:border-stone-700 transition-all cursor-pointer outline-none min-h-[40px]"
                      >
                        <option value="pendiente">• {t.orders_pending || 'Pendiente'}</option>
                        <option value="confirmado">✓ {t.orders_confirmed || 'Confirmado'}</option>
                        <option value="preparando">⋯ {t.orders_preparing || 'Preparando'}</option>
                        <option value="listo_entrega">▤ {t.orders_ready_delivery || 'Listo para entrega'}</option>
                        <option value="entregado">● {t.orders_delivered || 'Entregado (Terminar)'}</option>
                        <option value="cancelado">✕ {t.orders_cancelled || 'Cancelado (Terminar)'}</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center space-y-4 bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8">
          <Package className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
          <h3 className="text-lg font-black font-serif text-stone-800 dark:text-stone-200">
            {activeTab === 'actuales'
              ? language === 'eu'
                ? 'Ez dago uneko eskaerarik'
                : 'No hay pedidos actuales'
              : language === 'eu'
              ? 'Ez dago amaitutako eskaerarik'
              : 'No hay pedidos terminados'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto font-sans">
            {activeTab === 'actuales'
              ? t.orders_no_orders_seller_sub || 'Aquí aparecerán los pedidos en curso.'
              : language === 'eu'
              ? 'Amaitutako edo ezeztatutako eskaerak hemen ikusiko dituzu.'
              : 'Aquí verás el historial de pedidos entregados o cancelados.'}
          </p>
        </div>
      )}
    </div>
  );
}
