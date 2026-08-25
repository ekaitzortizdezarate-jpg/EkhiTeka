'use client';

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  MessageCircle,
  Package,
} from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  products: {
    id: string;
    name: string;
    image_url?: string | null;
  } | null;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  shipping_address?: string | null;
  delivery_method?: string | null;
  seller_id?: string | null;
  order_items: OrderItem[];
}

export function BuyerOrdersView({ orders }: { orders: Order[] }) {
  const { t } = useLanguage();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmado':
        return { label: t.orders_confirmed, bg: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300' };
      case 'preparando':
        return { label: t.orders_preparing, bg: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300' };
      case 'listo_entrega':
        return { label: t.orders_ready_delivery, bg: 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300' };
      case 'entregado':
        return { label: t.orders_delivered, bg: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300' };
      case 'cancelado':
        return { label: t.orders_cancelled, bg: 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300' };
      default:
        return { label: t.orders_pending, bg: 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
        <h1 className="text-3xl font-black font-serif text-stone-900 dark:text-stone-100">
          {t.orders_title}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {t.orders_subtitle_buyer}
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const badge = getStatusBadge(order.status);
            return (
              <div
                key={order.id}
                className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-serif">
                      {t.orders_order_number} #{order.id.slice(0, 8)}
                    </span>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {new Date(order.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider font-serif ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-base font-black font-serif text-stone-900 dark:text-stone-100">
                      {Number(order.total_amount).toFixed(2)} €
                    </span>
                  </div>
                </div>

                {/* Lista de productos */}
                <div className="space-y-2">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-[#C68D07] dark:text-[#FFE259]" />
                        <span className="font-bold text-stone-800 dark:text-stone-200">
                          {item.products?.name || 'Producto'}
                        </span>
                        <span className="text-stone-400">x{item.quantity}</span>
                      </div>
                      <span className="font-serif font-black text-stone-900 dark:text-stone-100">
                        {Number(item.subtotal || item.unit_price * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end">
                  <Link
                    href={`/chat/${order.seller_id || ''}?order_id=${order.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-stone-800 dark:text-stone-200 rounded-xl text-xs font-black uppercase tracking-wider font-serif transition-all"
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
          <ShoppingBag className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
          <h3 className="text-lg font-black font-serif text-stone-800 dark:text-stone-200">
            {t.orders_no_orders}
          </h3>
          <Link
            href="/tienda"
            className="inline-block px-6 py-3 bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-full shadow-xs transition-all font-serif hover:scale-105"
          >
            {t.cart_explore_btn}
          </Link>
        </div>
      )}
    </div>
  );
}