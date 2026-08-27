'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
import { createOrder } from '@/app/actions/orders';
import { getUserDeliveryAddresses, updateDeliveryAddresses } from '@/app/actions/auth';
import type { DeliveryAddress, Profile } from '@/types/database';
import { ShoppingBag, ArrowLeft, Trash2, Truck, Store, AlertCircle, Clock, MapPin, Check, Plus, Home } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const { t } = useLanguage();
  const { activePickupAddresses, storeAddress } = useStoreConfig();

  const [deliveryType, setDeliveryType] = useState<'domicilio' | 'recogida_tienda'>('domicilio');
  const [addressMode, setAddressMode] = useState<'saved' | 'manual'>('saved');

  // Direcciones guardadas del perfil
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('main');

  // Campos manuales de uno en uno
  const [manualStreet, setManualStreet] = useState('');
  const [manualNumber, setManualNumber] = useState('');
  const [manualStair, setManualStair] = useState('');
  const [manualFloor, setManualFloor] = useState('');
  const [manualDoor, setManualDoor] = useState('');
  const [manualPostalCode, setManualPostalCode] = useState('');
  const [manualTown, setManualTown] = useState('');
  const [manualProvince, setManualProvince] = useState('');
  const [manualNotes, setManualNotes] = useState('');
  const [saveManualToProfile, setSaveManualToProfile] = useState(false);
  const [manualAlias, setManualAlias] = useState('');

  // Notas de entrega para dirección guardada
  const [savedAddressNotes, setSavedAddressNotes] = useState('');

  const [pickupSchedule, setPickupSchedule] = useState('');
  const [selectedPickupAddressId, setSelectedPickupAddressId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar direcciones del perfil del usuario
  useEffect(() => {
    getUserDeliveryAddresses().then((res) => {
      if (res.profile) {
        setUserProfile(res.profile);
        const addrs = res.addresses || [];
        setSavedAddresses(addrs);

        const hasMain = Boolean(res.profile.street && res.profile.town);
        if (hasMain) {
          setSelectedAddressId('main');
          setAddressMode('saved');
        } else if (addrs.length > 0) {
          const def = addrs.find((a) => a.is_default) || addrs[0];
          setSelectedAddressId(def.id);
          setAddressMode('saved');
        } else {
          setAddressMode('manual');
        }
      }
    });
  }, []);

  // Inicializar con la primera dirección de recogida activa disponible
  useEffect(() => {
    if (activePickupAddresses && activePickupAddresses.length > 0 && !selectedPickupAddressId) {
      setSelectedPickupAddressId(activePickupAddresses[0].id);
    }
  }, [activePickupAddresses, selectedPickupAddressId]);

  const getFormattedMainAddress = (p: Profile) => {
    return [
      p.street,
      p.number ? `Nº ${p.number}` : '',
      p.stair ? `Esc ${p.stair}` : '',
      p.floor ? `Piso ${p.floor}` : '',
      p.door ? `Pta ${p.door}` : '',
      p.postal_code,
      p.town,
      p.province ? `(${p.province})` : '',
    ]
      .filter(Boolean)
      .join(', ');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    const firstItem = items[0];
    const sellerId = firstItem.sellerId || firstItem.product?.seller_id || '';

    // Resolver dirección de envío a domicilio
    let resolvedShippingAddress = '';
    let resolvedShippingNotes = '';

    if (deliveryType === 'domicilio') {
      if (addressMode === 'manual') {
        resolvedShippingAddress = [
          manualStreet,
          manualNumber ? `Nº ${manualNumber}` : '',
          manualStair ? `Esc ${manualStair}` : '',
          manualFloor ? `Piso ${manualFloor}` : '',
          manualDoor ? `Pta ${manualDoor}` : '',
          manualPostalCode,
          manualTown,
          manualProvince ? `(${manualProvince})` : '',
        ]
          .filter(Boolean)
          .join(', ');

        resolvedShippingNotes = manualNotes;

        // Si marcó guardar en perfil, guardarlo en background
        if (saveManualToProfile && manualStreet && manualTown) {
          const newAddr: DeliveryAddress = {
            id: 'addr_' + Date.now(),
            title: manualAlias.trim() || 'Dirección de Entrega',
            street: manualStreet.trim(),
            number: manualNumber.trim(),
            stair: manualStair.trim(),
            floor: manualFloor.trim(),
            door: manualDoor.trim(),
            postal_code: manualPostalCode.trim(),
            town: manualTown.trim(),
            province: manualProvince.trim(),
            notes: manualNotes.trim(),
            is_default: savedAddresses.length === 0,
          };
          updateDeliveryAddresses([...savedAddresses, newAddr]);
        }
      } else {
        // Modo guardado
        if (selectedAddressId === 'main' && userProfile) {
          resolvedShippingAddress = getFormattedMainAddress(userProfile);
          resolvedShippingNotes = savedAddressNotes;
        } else {
          const chosenAddr = savedAddresses.find((a) => a.id === selectedAddressId);
          if (chosenAddr) {
            resolvedShippingAddress = [
              chosenAddr.street,
              chosenAddr.number ? `Nº ${chosenAddr.number}` : '',
              chosenAddr.stair ? `Esc ${chosenAddr.stair}` : '',
              chosenAddr.floor ? `Piso ${chosenAddr.floor}` : '',
              chosenAddr.door ? `Pta ${chosenAddr.door}` : '',
              chosenAddr.postal_code,
              chosenAddr.town,
              chosenAddr.province ? `(${chosenAddr.province})` : '',
            ]
              .filter(Boolean)
              .join(', ');

            resolvedShippingNotes = chosenAddr.notes || savedAddressNotes;
          }
        }
      }
    }

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
      shippingAddress: deliveryType === 'domicilio' ? resolvedShippingAddress : resolvedPickupAddressText,
      shipping_address: deliveryType === 'domicilio' ? resolvedShippingAddress : resolvedPickupAddressText,
      shippingNotes: deliveryType === 'domicilio' ? resolvedShippingNotes : undefined,
      shipping_notes: deliveryType === 'domicilio' ? resolvedShippingNotes : undefined,
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
                        disabled={!item.product?.is_unlimited_stock && item.quantity >= (item.product?.stock ?? 99)}
                        onClick={() => updateQuantity(id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-lg cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
              <div className="space-y-4 font-sans text-xs animate-fadeIn">
                {/* Selector de modo de dirección guardada vs manual */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAddressMode('saved')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      addressMode === 'saved'
                        ? 'border-[#FFE259] bg-[#FFE259]/15 text-stone-900 dark:text-[#F5F5F0] shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#141312] text-stone-500 hover:border-stone-400'
                    }`}
                  >
                    {t.deliv_use_saved_address}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddressMode('manual')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      addressMode === 'manual'
                        ? 'border-[#FFE259] bg-[#FFE259]/15 text-stone-900 dark:text-[#F5F5F0] shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#141312] text-stone-500 hover:border-stone-400'
                    }`}
                  >
                    {t.deliv_enter_manual_address}
                  </button>
                </div>

                {addressMode === 'saved' ? (
                  <div className="space-y-3">
                    <label className="font-bold text-stone-700 dark:text-stone-300 block">
                      Selecciona la dirección de entrega:
                    </label>

                    {/* Dirección principal del perfil */}
                    {userProfile && userProfile.street && (
                      <div
                        onClick={() => setSelectedAddressId('main')}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                          selectedAddressId === 'main'
                            ? 'border-[#FFE259] bg-[#FFE259]/15 text-stone-900 dark:text-[#F5F5F0] shadow-xs'
                            : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#141312] text-stone-600 dark:text-stone-400 hover:border-stone-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="saved_address_choice"
                          value="main"
                          checked={selectedAddressId === 'main'}
                          onChange={() => setSelectedAddressId('main')}
                          className="w-4 h-4 accent-[#FFE259] mt-0.5 cursor-pointer"
                        />
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs block text-stone-900 dark:text-[#F5F5F0]">
                              {t.deliv_main_profile_address}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-[9px] font-bold uppercase text-stone-700 dark:text-stone-300">
                              Perfil
                            </span>
                          </div>
                          <p className="text-[11px] opacity-85 text-stone-600 dark:text-stone-300 leading-relaxed">
                            {getFormattedMainAddress(userProfile)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Direcciones guardadas adicionales */}
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? 'border-[#FFE259] bg-[#FFE259]/15 text-stone-900 dark:text-[#F5F5F0] shadow-xs'
                              : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#141312] text-stone-600 dark:text-stone-400 hover:border-stone-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="saved_address_choice"
                            value={addr.id}
                            checked={isSelected}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="w-4 h-4 accent-[#FFE259] mt-0.5 cursor-pointer"
                          />
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs block text-stone-900 dark:text-[#F5F5F0]">
                                {addr.title}
                              </span>
                              {addr.is_default && (
                                <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-[#C68D07] dark:text-[#FFE259] text-[9px] font-black uppercase">
                                  {t.deliv_default_badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] opacity-85 text-stone-600 dark:text-stone-300 leading-relaxed">
                              {addr.street} {addr.number ? `Nº ${addr.number}` : ''} {addr.stair ? `Esc ${addr.stair}` : ''} {addr.floor ? `Piso ${addr.floor}` : ''} {addr.door ? `Pta ${addr.door}` : ''}, {addr.postal_code || ''} {addr.town} ({addr.province})
                            </p>
                            {addr.notes && (
                              <p className="text-[10.5px] italic text-stone-500 dark:text-stone-400">
                                Notas: {addr.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {(!userProfile || !userProfile.street) && savedAddresses.length === 0 && (
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-[#FFE259] rounded-2xl text-stone-800 dark:text-stone-200 text-xs">
                        No tienes una dirección guardada en tu perfil todavía. Puedes introducirla abajo campo a campo.
                      </div>
                    )}

                    {/* Notas de entrega adicionales */}
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        {t.deliv_shipping_notes}
                      </label>
                      <input
                        type="text"
                        value={savedAddressNotes}
                        onChange={(e) => setSavedAddressNotes(e.target.value)}
                        placeholder="Ej: Horario preferente de mañana, portería..."
                        className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-[#F5F5F0] placeholder:text-stone-400"
                      />
                    </div>
                  </div>
                ) : (
                  /* Modo Manual Campo a Campo */
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                          {t.profile_street} *
                        </label>
                        <input
                          type="text"
                          required
                          value={manualStreet}
                          onChange={(e) => setManualStreet(e.target.value)}
                          placeholder="Calle, avenida o plaza"
                          className="w-full px-3 py-2 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-[#F5F5F0]"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                          {t.profile_number} *
                        </label>
                        <input
                          type="text"
                          required
                          value={manualNumber}
                          onChange={(e) => setManualNumber(e.target.value)}
                          placeholder="Nº"
                          className="w-full px-3 py-2 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-[#F5F5F0]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                          {t.profile_stair}
                        </label>
                        <input
                          type="text"
                          value={manualStair}
                          onChange={(e) => setManualStair(e.target.value)}
                          placeholder="A"
                          className="w-full px-3 py-2 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-[#F5F5F0]"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                          {t.profile_floor}
                        </label>
                        <input
                          type="text"
                          value={manualFloor}
                          onChange={(e) => setManualFloor(e.target.value)}
                          placeholder="2º"
                          className="w-full px-3 py-2 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-[#F5F5F0]"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                          {t.profile_door}
                        </label>
                        <input
                          type="text"
                          value={manualDoor}
                          onChange={(e) => setManualDoor(e.target.value)}
                          placeholder="B"
                          className="w-full px-3 py-2 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-[#F5F5F0]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                          {t.profile_postal_code} *
                        </label>
                        <input
                          type="text"
                          required
                          value={manualPostalCode}
                          onChange={(e) => setManualPostalCode(e.target.value)}
                          placeholder="48280"
                          className="w-full px-3 py-2 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-[#F5F5F0]"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                          {t.profile_town} *
                        </label>
                        <input
                          type="text"
                          required
                          value={manualTown}
                          onChange={(e) => setManualTown(e.target.value)}
                          placeholder="Lekeitio"
                          className="w-full px-3 py-2 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-[#F5F5F0]"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                          {t.profile_province} *
                        </label>
                        <input
                          type="text"
                          required
                          value={manualProvince}
                          onChange={(e) => setManualProvince(e.target.value)}
                          placeholder="Bizkaia"
                          className="w-full px-3 py-2 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-[#F5F5F0]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        {t.deliv_shipping_notes}
                      </label>
                      <input
                        type="text"
                        value={manualNotes}
                        onChange={(e) => setManualNotes(e.target.value)}
                        placeholder="Ej: Dejar en portería si no estoy..."
                        className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-[#F5F5F0] placeholder:text-stone-400"
                      />
                    </div>

                    {/* Checkbox para guardar en perfil */}
                    <div className="pt-2 p-3 bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-800 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="save_manual_to_profile"
                          checked={saveManualToProfile}
                          onChange={(e) => setSaveManualToProfile(e.target.checked)}
                          className="w-4 h-4 accent-[#FFE259] rounded cursor-pointer"
                        />
                        <label htmlFor="save_manual_to_profile" className="font-bold text-stone-700 dark:text-stone-300 cursor-pointer">
                          {t.deliv_save_to_profile}
                        </label>
                      </div>
                      {saveManualToProfile && (
                        <div>
                          <input
                            type="text"
                            value={manualAlias}
                            onChange={(e) => setManualAlias(e.target.value)}
                            placeholder={t.deliv_address_alias_placeholder}
                            className="w-full px-3 py-1.5 bg-white dark:bg-[#1F1E1C] border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-[#F5F5F0]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
