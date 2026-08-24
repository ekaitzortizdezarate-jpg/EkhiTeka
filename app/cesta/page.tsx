'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { createOrder } from '@/app/actions/orders';
import { createClient } from '@/lib/supabase/client';
import { type Profile, parseProfile } from '@/types/database';
import { getProductImage } from '@/lib/productHelpers';
import {
  Truck,
  Store,
  ShoppingBag,
  ArrowRight,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Check,
  User,
} from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, updateQuantity, removeFromCart } = useCart();
  const { t } = useLanguage();
  const router = useRouter();

  const [deliveryType, setDeliveryType] = useState<'domicilio' | 'recogida_tienda'>('domicilio');
  const [notes, setNotes] = useState('');
  const [pickupSchedule, setPickupSchedule] = useState('11:00 - 14:00');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  // Por defecto está marcada la opción de usar la dirección del perfil
  const [useProfileAddress, setUseProfileAddress] = useState(true);

  // Campos individuales de dirección si el usuario desmarca la opción de perfil
  const [customStreet, setCustomStreet] = useState('');
  const [customNumber, setCustomNumber] = useState('');
  const [customStair, setCustomStair] = useState('');
  const [customFloor, setCustomFloor] = useState('');
  const [customDoor, setCustomDoor] = useState('');
  const [customPostalCode, setCustomPostalCode] = useState('48280');
  const [customTown, setCustomTown] = useState('Lekeitio');
  const [customProvince, setCustomProvince] = useState('Bizkaia');

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (data) {
            const parsed = parseProfile(data);
            setProfile(parsed);
            if (parsed.street && parsed.number) {
              setUseProfileAddress(true);
            } else {
              setUseProfileAddress(false);
            }
          }
        } else {
          setUseProfileAddress(false);
        }
      } catch (err) {
        console.error('Error loading user profile in checkout:', err);
      }
    }

    loadUserProfile();
  }, []);

  if (success) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-3xl mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-stone-900 dark:text-stone-100">
            {t.deliv_order_success}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed font-medium">
            {t.deliv_order_success_desc}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 font-serif">
          <Link
            href="/comprador/pedidos"
            className="px-6 py-3 bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-105"
          >
            Ver mis Pedidos
          </Link>
          <Link
            href="/tienda"
            className="px-6 py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all"
          >
            Volver a la Tienda
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 mx-auto">
          <ShoppingBag className="w-8 h-8 text-[#C68D07]" />
        </div>
        <h1 className="text-xl font-black font-serif text-stone-900 dark:text-stone-100">
          {t.cart_empty}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {t.cart_empty_sub}
        </p>
        <Link
          href="/tienda"
          className="inline-block px-6 py-3 bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-full shadow-xs transition-all font-serif hover:scale-105"
        >
          {t.cart_explore_btn}
        </Link>
      </div>
    );
  }

  const sellerId = items[0]?.sellerId || 'seller';

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    let finalShippingAddress = '';

    if (deliveryType === 'domicilio') {
      if (useProfileAddress && profile && profile.street && profile.number) {
        finalShippingAddress = [
          profile.street,
          profile.number ? `Nº ${profile.number}` : '',
          profile.stair ? `Esc. ${profile.stair}` : '',
          profile.floor ? `Piso ${profile.floor}` : '',
          profile.door ? `Pta ${profile.door}` : '',
          profile.postal_code,
          profile.town,
          profile.province ? `(${profile.province})` : '',
        ]
          .filter(Boolean)
          .join(', ');
      } else {
        // Validar campos individuales
        if (
          !customStreet.trim() ||
          !customNumber.trim() ||
          !customFloor.trim() ||
          !customDoor.trim() ||
          !customPostalCode.trim() ||
          !customTown.trim() ||
          !customProvince.trim()
        ) {
          setErrorMsg('Por favor, completa todos los campos obligatorios (*) de la dirección de entrega.');
          return;
        }

        finalShippingAddress = [
          customStreet.trim(),
          `Nº ${customNumber.trim()}`,
          customStair.trim() ? `Esc. ${customStair.trim()}` : '',
          `Piso ${customFloor.trim()}`,
          `Pta ${customDoor.trim()}`,
          customPostalCode.trim(),
          customTown.trim(),
          `(${customProvince.trim()})`,
        ]
          .filter(Boolean)
          .join(', ');
      }
    } else {
      finalShippingAddress = 'Recogida en tienda física (Gamarra Kalea 4, Lekeitio · Bizkaia)';
    }

    setLoading(true);

    const payload = {
      sellerId,
      deliveryType,
      shippingAddress: finalShippingAddress,
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
    <div className="max-w-4xl mx-auto py-6 px-3 sm:px-6 space-y-6 sm:space-y-8 w-full overflow-x-hidden">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-serif text-stone-900 dark:text-stone-100">
          {t.cart_checkout}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Revisa tus productos gourmet y selecciona la modalidad de entrega.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 text-xs font-bold rounded-2xl shadow-xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* 1. Modalidad y Datos de Entrega */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selector de Modalidad */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-4 sm:p-6 space-y-4 shadow-xs">
            <h2 className="text-xs sm:text-sm font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider font-serif">
              {t.deliv_choose_mode}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Opción Domicilio */}
              <button
                type="button"
                onClick={() => setDeliveryType('domicilio')}
                className={`p-4 rounded-2xl border-2 text-left space-y-1 transition-all cursor-pointer ${
                  deliveryType === 'domicilio'
                    ? 'border-[#C68D07] bg-[#FFE259]/15 dark:bg-[#FFE259]/10 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-xs text-stone-900 dark:text-stone-100">
                  <Truck className="w-4 h-4 text-[#C68D07]" />
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
                    ? 'border-[#C68D07] bg-[#FFE259]/15 dark:bg-[#FFE259]/10 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-xs text-stone-900 dark:text-stone-100">
                  <Store className="w-4 h-4 text-[#C68D07]" />
                  <span>{t.deliv_store_pickup}</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                  {t.deliv_store_pickup_desc}
                </p>
              </button>
            </div>

            {/* Campos condicionales de Domicilio */}
            {deliveryType === 'domicilio' ? (
              <div className="space-y-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                {/* Opción de usar dirección del perfil (POR DEFECTO MARCADA) */}
                {profile && profile.street ? (
                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 space-y-2">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={useProfileAddress}
                        onChange={(e) => setUseProfileAddress(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer accent-[#C68D07]"
                      />
                      <span className="text-xs font-black text-stone-800 dark:text-stone-200 flex items-center gap-1.5 font-serif">
                        <MapPin className="w-3.5 h-3.5 text-[#C68D07]" />
                        <span>Usar la dirección habitual de mi perfil (Por defecto)</span>
                      </span>
                    </label>

                    {useProfileAddress && (
                      <div className="pl-6 pt-1 border-t border-stone-200/60 dark:border-stone-700/60">
                        <p className="text-[11px] font-bold text-stone-700 dark:text-stone-200 leading-relaxed">
                          {profile.street}, Nº {profile.number}
                          {profile.stair ? `, Esc. ${profile.stair}` : ''}
                          {profile.floor ? `, Piso ${profile.floor}` : ''}
                          {profile.door ? `, Pta ${profile.door}` : ''} · {profile.postal_code} {profile.town} ({profile.province})
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/50 flex items-center justify-between text-xs">
                    <span className="text-stone-600 dark:text-stone-400 font-medium">
                      No tienes dirección completa en tu perfil.
                    </span>
                    <Link
                      href="/perfil"
                      className="font-bold text-[#C68D07] hover:underline"
                    >
                      Editar Perfil
                    </Link>
                  </div>
                )}

                {/* Si el usuario desmarca la opción, aparecen los campos de dirección de uno en uno */}
                {!useProfileAddress && (
                  <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-4 animate-in fade-in duration-200">
                    <p className="text-[11px] font-sans font-black uppercase tracking-[0.16em] text-[#C68D07] dark:text-[#FFE259] pb-1">
                      Nueva Dirección de Entrega (Campos individuales)
                    </p>

                    {/* Fila 1: Calle y Número */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300">
                          Calle / Vía *
                        </label>
                        <input
                          type="text"
                          required={!useProfileAddress}
                          value={customStreet}
                          onChange={(e) => setCustomStreet(e.target.value)}
                          placeholder="Ej: Gamarra Kalea"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300">
                          Número *
                        </label>
                        <input
                          type="text"
                          required={!useProfileAddress}
                          value={customNumber}
                          onChange={(e) => setCustomNumber(e.target.value)}
                          placeholder="Ej: 4"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
                        />
                      </div>
                    </div>

                    {/* Fila 2: Escalera, Piso, Puerta */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300">
                          Escalera
                        </label>
                        <input
                          type="text"
                          value={customStair}
                          onChange={(e) => setCustomStair(e.target.value)}
                          placeholder="Opcional"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300">
                          Piso *
                        </label>
                        <input
                          type="text"
                          required={!useProfileAddress}
                          value={customFloor}
                          onChange={(e) => setCustomFloor(e.target.value)}
                          placeholder="Ej: 2º"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300">
                          Puerta *
                        </label>
                        <input
                          type="text"
                          required={!useProfileAddress}
                          value={customDoor}
                          onChange={(e) => setCustomDoor(e.target.value)}
                          placeholder="Ej: Dcha"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
                        />
                      </div>
                    </div>

                    {/* Fila 3: Código Postal, Pueblo, Provincia */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300">
                          Código Postal *
                        </label>
                        <input
                          type="text"
                          required={!useProfileAddress}
                          value={customPostalCode}
                          onChange={(e) => setCustomPostalCode(e.target.value)}
                          placeholder="48280"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300">
                          Pueblo / Municipio *
                        </label>
                        <input
                          type="text"
                          required={!useProfileAddress}
                          value={customTown}
                          onChange={(e) => setCustomTown(e.target.value)}
                          placeholder="Ej: Lekeitio"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300">
                          Provincia *
                        </label>
                        <input
                          type="text"
                          required={!useProfileAddress}
                          value={customProvince}
                          onChange={(e) => setCustomProvince(e.target.value)}
                          placeholder="Ej: Bizkaia"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-[11px] font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                    {t.deliv_shipping_notes}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej: Dejar en portería o entregar por la tarde"
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/50 text-xs text-stone-700 dark:text-stone-300">
                  <span className="font-black block text-amber-900 dark:text-amber-300">
                    📍 {t.deliv_pickup_address}
                  </span>
                  <span className="text-[11px] text-stone-600 dark:text-stone-400 block mt-0.5 font-medium">
                    Gamarra Kalea 4, Lekeitio · Bizkaia. Horario: Lun-Vie 10:00 a 20:30h.
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                    {t.deliv_pickup_time}
                  </label>
                  <select
                    value={pickupSchedule}
                    onChange={(e) => setPickupSchedule(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="10:00 - 13:00">Mañana (10:00 - 13:00)</option>
                    <option value="13:00 - 16:00">Mediodía (13:00 - 16:00)</option>
                    <option value="16:00 - 20:30">Tarde (16:00 - 20:30)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Lista de Productos en la Cesta */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-4 sm:p-6 space-y-4 shadow-xs">
            <h2 className="text-xs sm:text-sm font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider font-serif">
              Productos en tu pedido ({items.length})
            </h2>

            <div className="space-y-3">
              {items.map((item) => {
                const resolvedImg = getProductImage({
                  name: item.name,
                  category_id: item.category,
                  image_url: item.imageUrl,
                });

                return (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between gap-3 p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs min-w-0"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <img
                        src={resolvedImg}
                        alt={item.name}
                        className="w-13 h-13 sm:w-16 sm:h-16 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shrink-0 bg-white"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-stone-900 dark:text-stone-100 truncate block text-xs sm:text-sm">
                          {item.name}
                        </span>
                        <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 block">
                          {item.quantity} x {item.price.toFixed(2)} €
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-black text-xs sm:text-sm text-stone-900 dark:text-stone-100 block">
                        {(item.price * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Resumen y Confirmar Pedido */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-5 sm:p-6 space-y-5 shadow-xs sticky top-24">
            <h2 className="text-xs sm:text-sm font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider font-serif">
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
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between items-baseline text-base font-black text-stone-900 dark:text-stone-100 font-serif">
                <span>{t.cart_total}:</span>
                <span className="text-2xl text-amber-950 dark:text-amber-300 font-sans">
                  {totalPrice.toFixed(2)} €
                </span>
              </div>
            </div>

            {/* Botón Seguir Comprando */}
            <Link
              href="/tienda"
              className="w-full py-3 px-4 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 font-serif border border-stone-200 dark:border-stone-700 hover:scale-101 shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-[#C68D07]" />
              <span>Seguir Comprando</span>
            </Link>

            {/* Botón Confirmar Pedido */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#FFE259] hover:bg-[#F5D742] active:bg-[#E5C428] disabled:opacity-50 text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102 font-serif"
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
