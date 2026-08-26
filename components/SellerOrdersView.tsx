'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LOCALE_MAP } from '@/lib/i18n/translations';
import { updateOrderStatus } from '@/app/actions/orders';
import Link from 'next/link';
import type { Order, OrderStatus } from '@/types/database';
import { Package, MessageCircle, User, MapPin, Store } from 'lucide-react';

export function SellerOrdersView({ orders }: { orders: Order[] }) {
  const { t, language } = useLanguage();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setLoadingId(orderId);
    await updateOrderStatus(orderId, newStatus);
    setLoadingId(null);
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
            const isStorePickup = order.delivery_type === 'recogida_tienda' || order.delivery_method === 'recogida_tienda' || order.delivery_method === 'tienda';

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-xs"
              >
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
                    <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-[#C68D07] dark:text-[#FFE259] font-black text-xs uppercase tracking-wider font-serif">
                      {getStatusText(order.status)}
                    </span>
                    <span className="text-base font-black font-serif text-stone-900 dark:text-stone-100">
                      {t.orders_total_to_charge} {total.toFixed(2)} €
                    </span>
                  </div>
                </div>

                {/* Datos del Cliente y Modo de Entrega (Modo oscuro 100% corregido) */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-800 text-xs space-y-2 font-sans">
                  <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
                    <User className="w-3.5 h-3.5 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
                    <span>{order.profiles?.full_name || t.orders_client_label}</span>
                    {order.profiles?.phone && (
                      <span className="text-stone-500 dark:text-stone-400 font-normal">· {order.profiles.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                    {isStorePickup ? (
                      <>
                        <Store className="w-3.5 h-3.5 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
                        <span>{t.deliv_store_pickup_tag}</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0" />
                        <span>{order.shipping_address || t.deliv_home_tag}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Productos a preparar */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider font-serif text-stone-700 dark:text-stone-300">
                      {t.orders_products_to_prepare}
                    </h4>
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-stone-100 dark:border-stone-800 last:border-0 font-sans">
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-[#C68D07] dark:text-[#FFE259]" />
                          <span className="font-bold text-stone-800 dark:text-stone-200">
                            {item.products?.name || 'Producto'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#FFE259] text-[#1D1D1B] font-black text-[10px]">
                            x{item.quantity}
                          </span>
                        </div>
                        <span className="font-serif font-black text-stone-900 dark:text-stone-100">
                          {Number(item.subtotal || item.unit_price * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Botones de Cambio de Estado en 1 clic */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 font-serif">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={loadingId === order.id || order.status === 'confirmado'}
                      onClick={() => handleStatusChange(order.id, 'confirmado')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        order.status === 'confirmado'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 hover:bg-blue-100 dark:hover:bg-blue-950 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {t.status_confirm}
                    </button>

                    <button
                      type="button"
                      disabled={loadingId === order.id || order.status === 'preparando'}
                      onClick={() => handleStatusChange(order.id, 'preparando')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        order.status === 'preparando'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {t.status_preparing}
                    </button>

                    <button
                      type="button"
                      disabled={loadingId === order.id || order.status === 'listo_entrega'}
                      onClick={() => handleStatusChange(order.id, 'listo_entrega')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        order.status === 'listo_entrega'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 hover:bg-purple-100 dark:hover:bg-purple-950 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {t.status_ready}
                    </button>

                    <button
                      type="button"
                      disabled={loadingId === order.id || order.status === 'entregado'}
                      onClick={() => handleStatusChange(order.id, 'entregado')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        order.status === 'entregado'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {t.status_delivered}
                    </button>
                  </div>

                  <Link
                    href={`/chat/${order.buyer_id}?order_id=${order.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-stone-800 dark:text-stone-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{t.orders_chat_with_buyer}</span>
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
            {t.orders_no_orders_seller}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
            {t.orders_no_orders_seller_sub}
          </p>
        </div>
      )}
    </div>
  );
}
