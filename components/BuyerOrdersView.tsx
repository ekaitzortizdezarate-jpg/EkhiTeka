'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { cancelOrder } from '@/app/actions/orders';
import type { Order } from '@/types/database';
import { getProductImage } from '@/lib/productHelpers';
import {
  Package,
  Store,
  Truck,
  MessageCircle,
  Clock,
  MapPin,
  Trash2,
  CheckCircle2,
  Sparkles,
  Eye,
  AlertCircle,
} from 'lucide-react';

interface BuyerOrdersViewProps {
  orders: Order[];
}

const STORAGE_KEY = 'ekhiteka_seen_orders_buyer';

export function BuyerOrdersView({ orders }: BuyerOrdersViewProps) {
  const { t } = useLanguage();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [seenStatuses, setSeenStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSeenStatuses(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleMarkAsSeen = (orderId: string, currentStatus: string) => {
    const updated = { ...seenStatuses, [orderId]: currentStatus };
    setSeenStatuses(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('ekhiteka_orders_seen_updated'));
    } catch {
      // Ignore
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    const reason = window.prompt(t.orders_cancel_reason);
    if (!reason || !reason.trim()) return;
    setCancellingId(orderId);
    await cancelOrder(orderId, reason);
    setCancellingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-3 sm:px-6 space-y-6 w-full overflow-x-hidden">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-serif text-stone-900 dark:text-stone-100">
          {t.orders_title}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Seguimiento, detalles de productos y estado de tus compras gourmet.
        </p>
      </div>

      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order) => {
            const isDelivery = order.delivery_type === 'domicilio';
            const lastSeen = seenStatuses[order.id];
            // Se considera actualizado si el estado actual es diferente al último visto (o es nuevo)
            const isUpdated = lastSeen ? lastSeen !== order.status : order.status !== 'pendiente';

            return (
              <div
                key={order.id}
                className={`bg-white dark:bg-stone-900 rounded-3xl border-2 p-5 sm:p-7 shadow-xs space-y-5 transition-all ${
                  isUpdated
                    ? 'border-[#FFE259] ring-4 ring-[#FFE259]/30 shadow-xl'
                    : 'border-stone-200 dark:border-stone-800'
                }`}
              >
                {/* Banner de Actualización de Estado y Botón 'Visto' */}
                {isUpdated && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#FFE259]/20 border border-[#FFE259] rounded-2xl animate-pulse">
                    <div className="flex items-center gap-2 text-xs font-black text-stone-900 dark:text-stone-100 font-serif">
                      <Sparkles className="w-4 h-4 text-[#C68D07]" />
                      <span>
                        ¡Novedad! El estado de tu pedido ha cambiado a:{' '}
                        <span className="uppercase text-[#C68D07] font-sans">
                          {order.status}
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMarkAsSeen(order.id, order.status)}
                      className="px-4 py-1.5 bg-[#1D1D1B] hover:bg-stone-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer hover:scale-102 font-serif"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Marcar como Visto</span>
                    </button>
                  </div>
                )}

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-black text-base text-stone-900 dark:text-stone-100">
                          Pedido #{order.id.slice(0, 8)}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
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
                        Vendido por {order.profiles?.full_name || 'EkhiTeka Lekeitio'}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/chat/${order.seller_id}?order_id=${order.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold transition-colors font-serif"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{t.orders_chat_with_seller}</span>
                  </Link>
                </div>

                {/* Modalidad y Fecha */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 flex items-start gap-2.5">
                    {isDelivery ? (
                      <Truck className="w-4 h-4 text-[#C68D07] shrink-0 mt-0.5" />
                    ) : (
                      <Store className="w-4 h-4 text-[#C68D07] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold text-stone-900 dark:text-stone-100 block">
                        {isDelivery ? t.deliv_home : t.deliv_store_pickup}
                      </span>
                      {order.shipping_address && (
                        <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
                          {order.shipping_address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#C68D07] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-900 dark:text-stone-100 block">
                        Fecha de Compra
                      </span>
                      <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* LISTA DETALLADA DE PRODUCTOS CON IMAGEN, INFO Y PRECIOS */}
                <div className="space-y-3 pt-2">
                  <span className="font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider text-[11px] block font-serif">
                    Productos del Pedido ({order.order_items?.length || 0})
                  </span>

                  <div className="divide-y divide-stone-100 dark:divide-stone-800 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
                    {order.order_items?.map((it) => {
                      const prodImg = getProductImage({
                        name: it.products?.name || '',
                        category_id: it.products?.category_id || '',
                        image_url: it.products?.image_url,
                      });

                      return (
                        <div
                          key={it.id}
                          className="flex items-center justify-between gap-3.5 p-3.5 text-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <img
                              src={prodImg}
                              alt={it.products?.name || 'Producto'}
                              className="w-14 h-14 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shrink-0 bg-white"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <span className="font-bold text-stone-900 dark:text-stone-100 truncate block text-xs sm:text-sm">
                                {it.products?.name || 'Producto Gourmet'}
                              </span>
                              <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                                {it.products?.format && (
                                  <span className="capitalize">{it.products.format}</span>
                                )}
                                {it.products?.origin_region && (
                                  <span>· {it.products.origin_region}</span>
                                )}
                              </div>
                              <span className="text-[11px] font-bold text-[#C68D07] block mt-0.5">
                                {it.quantity} x {Number(it.unit_price).toFixed(2)} €
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-black text-sm text-stone-900 dark:text-stone-100 block font-serif">
                              {Number(it.subtotal).toFixed(2)} €
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total y Acciones */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-500">Total Pedido:</span>
                      <span className="text-xl sm:text-2xl font-black text-[#1D1D1B] dark:text-stone-100 font-serif">
                        {Number(order.total_price).toFixed(2)} €
                      </span>
                    </div>

                    {isUpdated && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsSeen(order.id, order.status)}
                        className="px-4 py-2 bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:scale-102 font-serif"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Visto</span>
                      </button>
                    )}
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
          <div className="py-16 text-center bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 space-y-4">
            <Package className="w-14 h-14 text-stone-300 dark:text-stone-700 mx-auto" />
            <h3 className="text-lg font-black font-serif text-stone-800 dark:text-stone-200">
              {t.orders_no_orders}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
              Aún no has realizado ninguna compra. Explora nuestra selección de quesos de autor y lotes gourmet.
            </p>
            <Link
              href="/tienda"
              className="inline-block px-6 py-3 bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-full shadow-xs transition-all font-serif hover:scale-105"
            >
              {t.cart_explore_btn}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
