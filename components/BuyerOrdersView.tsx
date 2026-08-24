'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { cancelOrder } from '@/app/actions/orders';
import type { Order } from '@/types/database';
import {
  Package,
  Store,
  Truck,
  MessageCircle,
  Clock,
  MapPin,
  Trash2,
} from 'lucide-react';

interface BuyerOrdersViewProps {
  orders: Order[];
}

export function BuyerOrdersView({ orders }: BuyerOrdersViewProps) {
  const { t } = useLanguage();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancelOrder = async (orderId: string) => {
    const reason = window.prompt(t.orders_cancel_reason);
    if (!reason || !reason.trim()) return;
    setCancellingId(orderId);
    await cancelOrder(orderId, reason);
    setCancellingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
          {t.orders_title}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Seguimiento y estado de tus compras gourmet.
        </p>
      </div>

      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => {
            const isDelivery = order.delivery_type === 'domicilio';

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-xs space-y-4"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-stone-900 dark:text-stone-100">
                          Pedido #{order.id.slice(0, 8)}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            order.status === 'confirmado'
                              ? 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200'
                              : order.status === 'preparando'
                              ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200'
                              : order.status === 'listo_entrega'
                              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                              : order.status === 'entregado'
                              ? 'bg-stone-200 text-stone-900 dark:bg-stone-800 dark:text-stone-100'
                              : order.status === 'cancelado'
                              ? 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200'
                              : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                        {order.profiles?.full_name || 'EkhiTeka Artesano'}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/chat/${order.seller_id}?order_id=${order.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{t.orders_chat_with_seller}</span>
                  </Link>
                </div>

                {/* Modalidad */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 flex items-start gap-2.5">
                    {isDelivery ? (
                      <Truck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <Store className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold text-stone-900 dark:text-stone-100 block">
                        {isDelivery ? t.deliv_home : t.deliv_store_pickup}
                      </span>
                      {order.shipping_address && (
                        <p className="text-stone-500 dark:text-stone-400 text-[11px]">
                          {order.shipping_address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-900 dark:text-stone-100 block">
                        Fecha
                      </span>
                      <p className="text-stone-500 dark:text-stone-400 text-[11px]">
                        {new Date(order.created_at).toLocaleDateString([], {
                          dateStyle: 'medium',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Productos */}
                <div className="space-y-1.5 p-3.5 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs">
                  <span className="font-black text-stone-600 dark:text-stone-400 uppercase tracking-wider text-[10px] block">
                    Productos del Pedido:
                  </span>
                  {order.order_items?.map((it) => (
                    <div key={it.id} className="flex items-center justify-between text-xs py-0.5">
                      <span className="font-bold text-stone-800 dark:text-stone-200">
                        {it.quantity}x {it.products?.name || 'Producto'}
                      </span>
                      <span className="font-black text-stone-900 dark:text-stone-100">
                        {Number(it.subtotal).toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total y Cancelar */}
                <div className="pt-3 border-t-2 border-stone-100 dark:border-stone-800 space-y-2.5">
                  <div className="flex items-end justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-black text-stone-600 dark:text-stone-400 block">
                        {t.orders_status}:
                      </span>
                      <span className="inline-block px-3 py-1 text-xs font-black rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                        {order.status}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">
                        {t.cart_total}
                      </span>
                      <span className="text-xl font-black text-amber-950 dark:text-amber-300">
                        {Number(order.total_price).toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  {order.status === 'pendiente' && (
                    <button
                      type="button"
                      disabled={cancellingId === order.id}
                      onClick={() => handleCancelOrder(order.id)}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 py-2.5 px-3 rounded-xl border border-red-200 dark:border-red-800 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.orders_cancel_order}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 space-y-3">
            <Package className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
            <h3 className="text-base font-black text-stone-800 dark:text-stone-200">
              {t.orders_no_orders}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {t.cart_empty_sub}
            </p>
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              {t.cart_explore_btn}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
