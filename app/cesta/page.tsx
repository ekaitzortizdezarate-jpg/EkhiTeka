'use client';

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
      shipping_notes: deliveryMethod === 'domicilio' ? shippingNotes : `Hora estimada recogida: ${pickupTime || 'Horario comercial'}`,
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
                className={`p-4 rounded-2xl border-2 text-left space-y-1 transition-all cursor-pointer ${
                  deliveryMethod === 'domicilio'
                    ? 'border-[#FFE259] bg-[#FFE259]/15 dark:bg-[#FFE259]/10'
                    : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850'
                }`}
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
                className={`p-4 rounded-2xl border-2 text-left space-y-1 transition-all cursor-pointer ${
                  deliveryMethod === 'tienda'
                    ? 'border-[#FFE259] bg-[#FFE259]/15 dark:bg-[#FFE259]/10'
                    : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850'
                }`}
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