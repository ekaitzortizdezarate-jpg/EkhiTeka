'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { createOrder } from '@/app/actions/orders';
import { Truck, Store, ShoppingBag, ArrowRight, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, updateQuantity, removeFromCart } = useCart();
  const { t } = useLanguage();
  const router = useRouter();

  const [deliveryType, setDeliveryType] = useState<'domicilio' | 'recogida_tienda'>('domicilio');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [pickupSchedule, setPickupSchedule] = useState('11:00 - 14:00');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (success) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-3xl mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {t.deliv_order_success}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            {t.deliv_order_success_desc}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-4">
          <Link
            href="/comprador/pedidos"
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-2xl shadow-md transition-all"
          >
            Ver mis Pedidos
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-bold text-xs rounded-2xl transition-all"
          >
            Volver a la Tienda
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 mx-auto">
          <ShoppingBag className="w-8 h-8 text-amber-600/60" />
        </div>
        <h1 className="text-lg font-black text-stone-800 dark:text-stone-200">
          {t.cart_empty}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {t.cart_empty_sub}
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
        >
          {t.cart_explore_btn}
        </Link>
      </div>
    );
  }

  // Agrupar items por vendedor
  const sellerId = items[0]?.sellerId || 'seller';

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryType === 'domicilio' && !address.trim()) {
      setErrorMsg('Por favor, introduce la dirección de entrega.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const payload = {
      sellerId,
      deliveryType,
      shippingAddress: deliveryType === 'domicilio' ? address : 'Recogida en tienda (Gran Vía 14, Bilbao)',
      shippingNotes: notes,
      pickupSchedule: deliveryType === 'recogida_tienda' ? pickupSchedule : undefined,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.price,
        subtotal: i.price * i.quantity,
      })),
      totalPrice,
    };

    const res = await createOrder(payload);
    setLoading(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      clearCart();
      setSuccess(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
          {t.cart_checkout}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Revisa tus productos y elige la modalidad de recepción.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-700 text-red-900 dark:text-red-200 text-xs font-bold rounded-2xl">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 1. Modalidad y Datos de Entrega */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selector de Modalidad */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-5 sm:p-6 space-y-4 shadow-xs">
            <h2 className="text-sm font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              {t.deliv_choose_mode}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Opción Domicilio */}
              <button
                type="button"
                onClick={() => setDeliveryType('domicilio')}
                className={`p-4 rounded-2xl border-2 text-left space-y-1 transition-all cursor-pointer ${
                  deliveryType === 'domicilio'
                    ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-xs text-stone-900 dark:text-stone-100">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>{t.deliv_home}</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                  {t.deliv_home_desc}
                </p>
              </button>

              {/* Opción Recogida en Tienda */}
              <button
                type="button"
                onClick={() => setDeliveryType('recogida_tienda')}
                className={`p-4 rounded-2xl border-2 text-left space-y-1 transition-all cursor-pointer ${
                  deliveryType === 'recogida_tienda'
                    ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-xs text-stone-900 dark:text-stone-100">
                  <Store className="w-4 h-4 text-amber-600" />
                  <span>{t.deliv_store_pickup}</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                  {t.deliv_store_pickup_desc}
                </p>
              </button>
            </div>

            {/* Campos condicionales */}
            {deliveryType === 'domicilio' ? (
              <div className="space-y-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                <div className="space-y-1">
                  <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                    {t.deliv_shipping_address} *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Calle, número, piso, código postal y ciudad"
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                    {t.deliv_shipping_notes}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej: Dejar al portero o entregar por la tarde"
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                <div className="p-3 bg-amber-50/50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/50 text-xs text-stone-700 dark:text-stone-300">
                  <span className="font-black block text-amber-900 dark:text-amber-300">
                    📍 {t.deliv_pickup_address}
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-0.5">
                    Horario de tienda: Lunes a Sábado de 10:00 a 20:30h.
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                    {t.deliv_pickup_time}
                  </label>
                  <select
                    value={pickupSchedule}
                    onChange={(e) => setPickupSchedule(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="10:00 - 13:00">Mañana (10:00 - 13:00)</option>
                    <option value="13:00 - 16:00">Mediodía (13:00 - 16:00)</option>
                    <option value="16:00 - 20:00">Tarde (16:00 - 20:00)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Lista de Productos en la Cesta */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-5 sm:p-6 space-y-4 shadow-xs">
            <h2 className="text-sm font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              Productos en tu pedido ({items.length})
            </h2>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-3 p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900 text-amber-700 flex items-center justify-center font-bold text-base shrink-0">
                        🧀
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="font-extrabold text-stone-900 dark:text-stone-100 truncate block">
                        {item.name}
                      </span>
                      <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400">
                        {item.quantity} x {item.price.toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-sm text-stone-900 dark:text-stone-100 block">
                      {(item.price * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Resumen y Confirmar Pedido */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-5 sm:p-6 space-y-5 shadow-xs sticky top-24">
            <h2 className="text-sm font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              Resumen del Pedido
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-600 dark:text-stone-400 font-semibold">
                <span>{t.cart_subtotal}:</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-400 font-semibold">
                <span>Modalidad:</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {deliveryType === 'domicilio' ? t.deliv_home : t.deliv_store_pickup}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between items-baseline text-base font-black text-stone-900 dark:text-stone-100">
                <span>{t.cart_total}:</span>
                <span className="text-2xl text-amber-950 dark:text-amber-300">
                  {totalPrice.toFixed(2)} €
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-101"
            >
              {loading ? (
                <span>{t.common_loading}</span>
              ) : (
                <>
                  <span>{t.deliv_confirm_order}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center gap-2 text-[10px] text-stone-400 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Compra segura & garantía gourmet EkhiTeka</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
