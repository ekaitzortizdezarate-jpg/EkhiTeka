const fs = require('fs');
const path = require('path');

const files = {
  // 1. PASARELA DE CHECKOUT (app/cesta/page.tsx)
  'app/cesta/page.tsx': `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { createOrder } from '@/app/actions/orders';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Truck,
  Store,
  MapPin,
  Clock,
  FileText,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function CestaPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { t } = useLanguage();
  const router = useRouter();

  const [deliveryMethod, setDeliveryMethod] = useState<'domicilio' | 'tienda'>('domicilio');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingNotes, setShippingNotes] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (deliveryMethod === 'domicilio' && !shippingAddress.trim()) {
      setError('Por favor, introduce una dirección completa para el envío refrigerado.');
      return;
    }

    setLoading(true);
    setError(null);

    const orderData = {
      items: cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price,
        seller_id: item.product.seller_id,
      })),
      delivery_method: deliveryMethod,
      shipping_address: deliveryMethod === 'domicilio' ? shippingAddress : 'Recogida en Tienda: Gamarra Kalea 4, Lekeitio',
      shipping_notes: deliveryMethod === 'domicilio' ? shippingNotes : \`Hora estimada recogida: \${pickupTime || 'Horario comercial'}\`,
      total_amount: totalPrice,
    };

    const res = await createOrder(orderData);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      clearCart();
      setSuccess(true);
      setTimeout(() => {
        router.push('/comprador/pedidos');
      }, 2500);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black font-serif text-stone-900 dark:text-stone-100">
          {t.deliv_order_success}
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300 font-medium">
          {t.deliv_order_success_desc}
        </p>
        <p className="text-xs text-stone-400">
          Redirigiendo a tus pedidos...
        </p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-850 flex items-center justify-center mx-auto text-stone-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-serif text-stone-900 dark:text-stone-100">
          {t.cart_empty}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
          {t.cart_empty_sub}
        </p>
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all font-serif hover:scale-105"
        >
          <span>{t.cart_explore_btn}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
        <h1 className="text-3xl sm:text-4xl font-black font-serif text-stone-900 dark:text-stone-100">
          {t.cart_title}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Revisa tus productos seleccionados y confirma los detalles de entrega.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lista de productos */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-xs divide-y divide-stone-200 dark:divide-stone-800">
            {cart.map((item) => (
              <div key={item.product.id} className="p-4 sm:p-6 flex gap-4 items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 dark:border-stone-700">
                    <img
                      src={item.product.image_url || '/images/secciones/Quesos.JPG'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <h3 className="font-serif font-black text-sm sm:text-base text-stone-900 dark:text-stone-100 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-serif">
                      {Number(item.product.price).toFixed(2)} € / ud
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-serif">
                  <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-850 p-0.5">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                      className="w-6 h-6 rounded-lg text-xs font-bold hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
                    >
                      -
                    </button>
                    <span className="w-7 text-center text-xs font-black text-stone-900 dark:text-stone-100">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg text-xs font-bold hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-sm sm:text-base font-black text-stone-900 dark:text-stone-100 w-16 text-right">
                    {(Number(item.product.price) * item.quantity).toFixed(2)} €
                  </span>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                    title={t.cart_remove}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center px-2 font-serif">
            <Link
              href="/tienda"
              className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 uppercase tracking-wider"
            >
              ← {t.cart_continue_shopping}
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-bold text-red-600 hover:underline uppercase tracking-wider cursor-pointer"
            >
              Vaciar cesta
            </button>
          </div>
        </div>

        {/* Formulario de Checkout */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSubmitOrder} className="rounded-3xl border-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 space-y-6 shadow-xs font-serif">
            <h2 className="text-lg font-black font-serif text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-200 dark:border-stone-800">
              {t.deliv_choose_mode}
            </h2>

            {/* Opciones de Entrega */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod('domicilio')}
                className={\`p-4 rounded-2xl border-2 text-left space-y-1 transition-all cursor-pointer \${
                  deliveryMethod === 'domicilio'
                    ? 'border-[#FFE259] bg-[#FFE259]/15 dark:bg-[#FFE259]/10'
                    : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850'
                }\`}
              >
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100">
                  <Truck className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
                  <span>{t.deliv_home}</span>
                </div>
                <p className="text-[10px] text-stone-500 dark:text-stone-400">
                  {t.deliv_home_desc}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('tienda')}
                className={\`p-4 rounded-2xl border-2 text-left space-y-1 transition-all cursor-pointer \${
                  deliveryMethod === 'tienda'
                    ? 'border-[#FFE259] bg-[#FFE259]/15 dark:bg-[#FFE259]/10'
                    : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850'
                }\`}
              >
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100">
                  <Store className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
                  <span>{t.deliv_store_pickup}</span>
                </div>
                <p className="text-[10px] text-stone-500 dark:text-stone-400">
                  {t.deliv_store_pickup_desc}
                </p>
              </button>
            </div>

            {/* Campos condicionales */}
            {deliveryMethod === 'domicilio' ? (
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                    {t.deliv_shipping_address} *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Calle, número, piso, código postal y localidad"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                    {t.deliv_shipping_notes}
                  </label>
                  <input
                    type="text"
                    value={shippingNotes}
                    onChange={(e) => setShippingNotes(e.target.value)}
                    placeholder="Ej: Dejar en portería o entregar por la tarde"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300">
                <p className="font-bold flex items-center gap-1.5 text-stone-900 dark:text-stone-100">
                  <MapPin className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
                  <span>{t.deliv_pickup_address}</span>
                </p>
                <div className="space-y-1 pt-1">
                  <label className="block text-[10.5px] font-black uppercase text-stone-700 dark:text-stone-300">
                    {t.deliv_pickup_time} (Opcional)
                  </label>
                  <input
                    type="text"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    placeholder="Ej: Hoy a las 18:30"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 rounded-xl text-xs font-bold text-red-800 dark:text-red-200 text-center">
                {error}
              </div>
            )}

            {/* Resumen Total */}
            <div className="space-y-2 pt-4 border-t border-stone-200 dark:border-stone-800">
              <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400">
                <span>{t.cart_subtotal} ({totalItems} productos)</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-base sm:text-lg font-black text-stone-900 dark:text-stone-100">
                <span>{t.cart_total}</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all font-serif hover:scale-102 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Procesando pedido...' : t.deliv_confirm_order}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
`,

  // 2. CART DRAWER (components/CartDrawer.tsx)
  'components/CartDrawer.tsx': `'use client';

import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { t } = useLanguage();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] overflow-hidden" style={{ zIndex: 999999 }}>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white dark:bg-stone-900 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-stone-200 dark:border-stone-800 animate-in slide-in-from-right duration-300">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C68D07] dark:text-[#FFE259]" />
              <h2 className="font-serif font-black text-lg text-stone-900 dark:text-stone-100">
                {t.cart_title} ({totalItems})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {cart.length > 0 ? (
            <div className="space-y-4 divide-y divide-stone-100 dark:divide-stone-800">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-4 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 dark:border-stone-700">
                      <img
                        src={item.product.image_url || '/images/secciones/Quesos.JPG'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-serif font-black text-xs text-stone-900 dark:text-stone-100 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 font-serif">
                        {Number(item.product.price).toFixed(2)} €
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-serif shrink-0">
                    <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="w-5 h-5 flex items-center justify-center text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-xs font-black">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-stone-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                {t.cart_empty}
              </p>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="pt-6 border-t border-stone-200 dark:border-stone-800 space-y-4 font-serif">
            <div className="flex justify-between items-center text-base font-black text-stone-900 dark:text-stone-100">
              <span>{t.cart_total}</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>

            <Link
              href="/cesta"
              onClick={closeCart}
              className="w-full py-3.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-102"
            >
              <span>{t.cart_checkout}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
`,

  // 3. BUYER ORDERS VIEW (components/BuyerOrdersView.tsx)
  'components/BuyerOrdersView.tsx': `'use client';

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
                    <span className={\`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider font-serif \${badge.bg}\`}>
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
                    href={\`/chat/\${order.seller_id || ''}?order_id=\${order.id}\`}
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
`,

  // 4. SELLER ORDERS VIEW (components/SellerOrdersView.tsx)
  'components/SellerOrdersView.tsx': `'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { updateOrderStatus } from '@/app/actions/orders';
import Link from 'next/link';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  MessageCircle,
  User,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  products: {
    id: string;
    name: string;
  } | null;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  shipping_address?: string | null;
  shipping_notes?: string | null;
  delivery_method?: string | null;
  buyer_id: string;
  profiles: {
    id: string;
    full_name: string;
    phone?: string | null;
    email?: string | null;
    town?: string | null;
  } | null;
  order_items: OrderItem[];
}

export function SellerOrdersView({ orders }: { orders: Order[] }) {
  const { t } = useLanguage();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setLoadingId(orderId);
    await updateOrderStatus(orderId, newStatus);
    setLoadingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
        <h1 className="text-3xl font-black font-serif text-stone-900 dark:text-stone-100">
          {t.orders_title_seller}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {t.orders_subtitle_seller}
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-xs"
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
                  <span className="text-base font-black font-serif text-stone-900 dark:text-stone-100">
                    {t.orders_total_to_charge} {Number(order.total_amount).toFixed(2)} €
                  </span>
                </div>
              </div>

              {/* Datos del Cliente */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
                  <User className="w-3.5 h-3.5 text-[#C68D07] dark:text-[#FFE259]" />
                  <span>{order.profiles?.full_name || 'Cliente'}</span>
                  {order.profiles?.phone && (
                    <span className="text-stone-500 font-normal">· {order.profiles.phone}</span>
                  )}
                </div>
                {order.shipping_address && (
                  <p className="text-stone-600 dark:text-stone-300 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span>{order.shipping_address}</span>
                  </p>
                )}
              </div>

              {/* Lista de productos del pedido */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider font-serif text-stone-700 dark:text-stone-300">
                  {t.orders_products_to_prepare}
                </h4>
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-stone-100 dark:border-stone-800 last:border-0">
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

              {/* Botones de Cambio de Estado en 1 clic */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 font-serif">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={loadingId === order.id || order.status === 'confirmado'}
                    onClick={() => handleStatusChange(order.id, 'confirmado')}
                    className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all \${
                      order.status === 'confirmado'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 hover:bg-blue-100 dark:hover:bg-blue-950 text-stone-700 dark:text-stone-300'
                    }\`}
                  >
                    {t.status_confirm}
                  </button>

                  <button
                    type="button"
                    disabled={loadingId === order.id || order.status === 'preparando'}
                    onClick={() => handleStatusChange(order.id, 'preparando')}
                    className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all \${
                      order.status === 'preparando'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-stone-700 dark:text-stone-300'
                    }\`}
                  >
                    {t.status_preparing}
                  </button>

                  <button
                    type="button"
                    disabled={loadingId === order.id || order.status === 'listo_entrega'}
                    onClick={() => handleStatusChange(order.id, 'listo_entrega')}
                    className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all \${
                      order.status === 'listo_entrega'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 hover:bg-purple-100 dark:hover:bg-purple-950 text-stone-700 dark:text-stone-300'
                    }\`}
                  >
                    {t.status_ready}
                  </button>

                  <button
                    type="button"
                    disabled={loadingId === order.id || order.status === 'entregado'}
                    onClick={() => handleStatusChange(order.id, 'entregado')}
                    className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all \${
                      order.status === 'entregado'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-stone-700 dark:text-stone-300'
                    }\`}
                  >
                    {t.status_delivered}
                  </button>
                </div>

                <Link
                  href={\`/chat/\${order.buyer_id}?order_id=\${order.id}\`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-stone-800 dark:text-stone-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{t.orders_chat_with_buyer}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-4 bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8">
          <Package className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
          <h3 className="text-lg font-black font-serif text-stone-800 dark:text-stone-200">
            {t.orders_no_orders_seller}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {t.orders_no_orders_seller_sub}
          </p>
        </div>
      )}
    </div>
  );
}
`
};

console.log('📦 Escribiendo archivos de la Fase 4 en EkhiTeka...');

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim(), 'utf8');
  console.log(`✅ Creado / Actualizado: ${filePath}`);
});

console.log('\n🎉 ¡Bloque 4 aplicado correctamente!');