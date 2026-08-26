'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
import { createOrder } from '@/app/actions/orders';
import { ShoppingBag, ArrowLeft, Trash2, Truck, Store, AlertCircle, Clock, MapPin } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const { t } = useLanguage();
  const { activePickupAddresses, storeAddress } = useStoreConfig();

  const [deliveryType, setDeliveryType] = useState<'domicilio' | 'recogida_tienda'>('domicilio');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingNotes, setShippingNotes] = useState('');
  const [pickupSchedule, setPickupSchedule] = useState('');
  const [selectedPickupAddressId, setSelectedPickupAddressId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar con la primera dirección de recogida activa disponible
  useEffect(() => {
    if (activePickupAddresses && activePickupAddresses.length > 0 && !selectedPickupAddressId) {
      setSelectedPickupAddressId(activePickupAddresses[0].id);
    }
  }, [activePickupAddresses, selectedPickupAddressId]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    const firstItem = items[0];
    const sellerId = firstItem.sellerId || firstItem.product?.seller_id || '';

    // Obtener la dirección física de la tienda seleccionada
    const chosenPickupAddress = activePickupAddresses.find((a) => a.id === selectedPickupAddressId) || activePickupAddresses[0];
    const resolvedPickupAddressText = chosenPickupAddress
      ? `${chosenPickupAddress.title} — ${chosenPickupAddress.street} ${chosenPickupAddress.number ? 'Nº ' + chosenPickupAddress.number : ''}, ${chosenPickupAddress.town} (${chosenPickupAddress.province})`
      : storeAddress;

    const orderPayload = {
      sellerId,
      seller_id: sellerId,
      deliveryType,
      delivery_method: deliveryType,
      shippingAddress: deliveryType === 'domicilio' ? shippingAddress : resolvedPickupAddressText,
      shipping_address: deliveryType === 'domicilio' ? shippingAddress : resolvedPickupAddressText,
      shippingNotes: deliveryType === 'domicilio' ? shippingNotes : undefined,
      shipping_notes: deliveryType === 'domicilio' ? shippingNotes : undefined,
      pickupSchedule: deliveryType === 'recogida_tienda' ? pickupSchedule : undefined,
      pickup_schedule: deliveryType === 'recogida_tienda' ? pickupSchedule : undefined,
      totalPrice,
      total_amount: totalPrice,
      items: items.map((i) => {
        const pId = i.productId || i.product?.id || '';
        const price = Number(i.price || i.product?.price || 0);
        return {
          productId: pId,
          product_id: pId,
          sellerId: i.sellerId || i.product?.seller_id || sellerId,
          seller_id: i.sellerId || i.product?.seller_id || sellerId,
          quantity: i.quantity,
          unitPrice: price,
          unit_price: price,
          subtotal: price * i.quantity,
        };
      }),
    };

    const res = await createOrder(orderPayload);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      clearCart();
      router.push('/comprador/pedidos');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6 font-serif">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-[#C68D07] dark:text-[#FFE259] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
          {t.cart_empty}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto font-sans">
          {t.cart_empty_sub}
        </p>
        <div>
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105 cursor-pointer"
          >
            <span>{t.cart_explore_btn}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8 font-serif">
      <div className="flex items-center gap-3">
        <Link
          href="/tienda"
          className="p-2 rounded-xl bg-stone-100 dark:bg-[#1F1E1C] text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors border border-stone-200 dark:border-stone-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {t.cart_title} ({totalItems})
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 rounded-2xl text-xs font-bold text-red-800 dark:text-red-200 flex items-center gap-2 font-sans">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lista de productos */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-xs">
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {items.map((item) => {
              const id = item.productId || item.product?.id || '';
              const name = item.name || item.product?.name || 'Producto';
              const price = Number(item.price || item.product?.price || 0);
              const img = item.imageUrl || item.product?.image_url || '/images/secciones/Quesos.JPG';

              return (
                <div key={id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={img}
                      alt={name}
                      className="w-14 h-14 rounded-2xl object-cover border border-stone-200 dark:border-stone-700 shrink-0 bg-stone-100 dark:bg-[#141312]"
                    />
                    <div className="min-w-0">
                      <h2 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-[#F5F5F0] truncate">
                        {name}
                      </h2>
                      <span className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                        {price.toFixed(2)} € / ud
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-[#141312] p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(id, Math.max(1, item.quantity - 1))}
                        className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-lg cursor-pointer transition-colors"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-black text-stone-900 dark:text-[#F5F5F0]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-lg cursor-pointer transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(id)}
                      className="p-1.5 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumen y Envío */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-xs">
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
              {t.deliv_choose_mode}
            </h2>

            {/* Selector de modo de entrega */}
            <div className="grid grid-cols-2 gap-2 font-sans">
              <button
                type="button"
                onClick={() => setDeliveryType('domicilio')}
                className={`p-3.5 rounded-2xl border-2 text-center text-xs font-bold transition-all cursor-pointer ${
                  deliveryType === 'domicilio'
                    ? 'border-[#FFE259] bg-[#FFE259]/15 text-stone-900 dark:text-[#F5F5F0] shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#141312] text-stone-600 dark:text-stone-400 hover:border-stone-400'
                }`}
              >
                <Truck className="w-4 h-4 mx-auto mb-1 text-[#C68D07] dark:text-[#FFE259]" />
                <span>Envio a Domicilio</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('recogida_tienda')}
                className={`p-3.5 rounded-2xl border-2 text-center text-xs font-bold transition-all cursor-pointer ${
                  deliveryType === 'recogida_tienda'
                    ? 'border-[#FFE259] bg-[#FFE259]/15 text-stone-900 dark:text-[#F5F5F0] shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#141312] text-stone-600 dark:text-stone-400 hover:border-stone-400'
                }`}
              >
                <Store className="w-4 h-4 mx-auto mb-1 text-[#C68D07] dark:text-[#FFE259]" />
                <span>Recogida en tienda</span>
              </button>
            </div>

            {/* Formulario Envio a Domicilio */}
            {deliveryType === 'domicilio' ? (
              <div className="space-y-3 font-sans text-xs animate-fadeIn">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.deliv_shipping_address} *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Calle, número, piso, código postal y localidad"
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-[#F5F5F0] placeholder:text-stone-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.deliv_shipping_notes}
                  </label>
                  <input
                    type="text"
                    value={shippingNotes}
                    onChange={(e) => setShippingNotes(e.target.value)}
                    placeholder="Ej: Horario preferente de mañana, portería..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-[#F5F5F0] placeholder:text-stone-400"
                  />
                </div>
              </div>
            ) : (
              /* Formulario Recogida en Tienda con Selector de Puntos de Entrega Disponibles y Modo Oscuro Nítido */
              <div className="space-y-4 font-sans text-xs animate-fadeIn">
                {/* Selector de Puntos de Entrega / Tienda */}
                <div className="space-y-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300 block">
                    Selecciona el Punto de Entrega / Tienda donde recogerás:
                  </label>

                  {activePickupAddresses && activePickupAddresses.length > 0 ? (
                    <div className="space-y-2">
                      {activePickupAddresses.map((addr) => {
                        const isSelected = selectedPickupAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedPickupAddressId(addr.id)}
                            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                              isSelected
                                ? 'border-[#FFE259] bg-[#FFE259]/15 text-stone-900 dark:text-[#F5F5F0] shadow-xs'
                                : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#141312] text-stone-600 dark:text-stone-400 hover:border-stone-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="pickup_address_choice"
                              value={addr.id}
                              checked={isSelected}
                              onChange={() => setSelectedPickupAddressId(addr.id)}
                              className="w-4 h-4 accent-[#FFE259] mt-0.5 cursor-pointer"
                            />
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <span className="font-bold text-xs block text-stone-900 dark:text-[#F5F5F0]">
                                {addr.title}
                              </span>
                              <span className="text-[11px] block opacity-85 text-stone-600 dark:text-stone-300">
                                {addr.street} {addr.number ? 'Nº ' + addr.number : ''} {addr.stair ? 'Esc ' + addr.stair : ''} {addr.floor ? 'Piso ' + addr.floor : ''} {addr.door ? 'Pta ' + addr.door : ''}, {addr.postal_code || ''} {addr.town} ({addr.province})
                              </span>
                              {addr.schedule && (
                                <span className="text-[10.5px] font-bold text-[#C68D07] dark:text-[#FFE259] block pt-0.5">
                                  Horario: {addr.schedule}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Fallback si no hay puntos adicionales cargados */
                    <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#141312] text-stone-800 dark:text-[#F5F5F0] space-y-1">
                      <div className="flex items-center gap-2 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-[#C68D07] dark:text-[#FFE259]" />
                        <span>Quesería & Tienda Principal Lekeitio</span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">{storeAddress}</p>
                    </div>
                  )}
                </div>

                {/* Hora estimada de recogida */}
                <div className="p-3.5 bg-stone-50 dark:bg-[#141312] rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-stone-800 dark:text-[#F5F5F0] font-bold">
                    <Clock className="w-3.5 h-3.5 text-[#C68D07] dark:text-[#FFE259]" />
                    <label htmlFor="pickup_schedule_input">Hora aproximada de recogida:</label>
                  </div>
                  <input
                    id="pickup_schedule_input"
                    type="text"
                    value={pickupSchedule}
                    onChange={(e) => setPickupSchedule(e.target.value)}
                    placeholder="Ej: Hoy a las 18:30h o Mañana por la mañana"
                    className="w-full px-3.5 py-2 bg-white dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-[#F5F5F0] placeholder:text-stone-400"
                  />
                </div>
              </div>
            )}

            {/* Total */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <div className="flex justify-between text-base font-black text-stone-900 dark:text-stone-100">
                <span>{t.cart_total}</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
              <p className="text-[10px] text-stone-400 font-sans">{t.prod_vat_included}</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
            >
              {loading ? t.common_loading : t.deliv_confirm_order}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
