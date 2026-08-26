const fs = require('fs');
const path = require('path');

const files = {
  // =========================================================================
  // 1. TIPOS DE BASE DE DATOS (Con total_amount y slug unificados)
  // =========================================================================
  'types/database.ts': `export type Role = 'comprador' | 'vendedor' | 'admin';

export type ProductFormat =
  | 'unidad'
  | 'peso_kg'
  | 'pack'
  | 'botella'
  | 'lata'
  | 'tarro';

export type DeliveryType = 'domicilio' | 'recogida_tienda';

export type OrderStatus =
  | 'pendiente'
  | 'confirmado'
  | 'preparando'
  | 'listo_entrega'
  | 'entregado'
  | 'cancelado';

export interface ProfileDetails {
  first_name?: string | null;
  last_name_1?: string | null;
  last_name_2?: string | null;
  birth_date?: string | null;
  dni?: string | null;
  phone?: string | null;
  province?: string | null;
  town?: string | null;
  postal_code?: string | null;
  street?: string | null;
  number?: string | null;
  stair?: string | null;
  floor?: string | null;
  door?: string | null;
}

export interface Profile extends ProfileDetails {
  id: string;
  role: Role;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  town?: string | null;
  address?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  created_at?: string;
  updated_at?: string;
}

export function parseProfile(raw?: any): Profile {
  if (!raw) {
    return {
      id: '',
      role: 'comprador',
      full_name: '',
      first_name: '',
      last_name_1: '',
      last_name_2: '',
      birth_date: '',
      dni: '',
      phone: '',
      province: '',
      town: '',
      postal_code: '',
      street: '',
      number: '',
      stair: '',
      floor: '',
      door: '',
    };
  }

  let details: Partial<ProfileDetails> = {};
  if (raw.bio) {
    try {
      const parsed = JSON.parse(raw.bio);
      if (typeof parsed === 'object' && parsed !== null) {
        details = parsed;
      }
    } catch {
      // bio text fallback
    }
  }

  return {
    ...raw,
    first_name: details.first_name || raw.first_name || raw.full_name?.split(' ')[0] || '',
    last_name_1: details.last_name_1 || raw.last_name_1 || raw.full_name?.split(' ')[1] || '',
    last_name_2: details.last_name_2 || raw.last_name_2 || raw.full_name?.split(' ').slice(2).join(' ') || '',
    birth_date: details.birth_date || raw.birth_date || '',
    dni: details.dni || raw.dni || '',
    phone: details.phone || raw.phone || '',
    province: details.province || raw.province || (raw.town?.toLowerCase().includes('lekeitio') ? 'Bizkaia' : ''),
    town: details.town || raw.town || '',
    postal_code: details.postal_code || raw.postal_code || '',
    street: details.street || raw.street || '',
    number: details.number || raw.number || '',
    stair: details.stair || raw.stair || '',
    floor: details.floor || raw.floor || '',
    door: details.door || raw.door || '',
  };
}

export function isProfileComplete(raw?: any): boolean {
  if (!raw) return false;
  const p = parseProfile(raw);

  const requiredKeys: (keyof ProfileDetails)[] = [
    'first_name',
    'last_name_1',
    'birth_date',
    'dni',
    'phone',
    'province',
    'town',
    'postal_code',
    'street',
    'number',
    'floor',
    'door',
  ];

  return requiredKeys.every((key) => {
    const val = p[key];
    return val !== undefined && val !== null && String(val).trim().length > 0;
  });
}

export interface Category {
  id: string;
  slug?: string;
  name_es: string;
  name_eu: string;
  name_en: string;
  name_fr: string;
  icon: string;
  image_url?: string;
  display_order?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface Product {
  id: string;
  seller_id: string;
  category_id: string;
  name: string;
  description?: string | null;
  price: number;
  format: ProductFormat;
  weight_g?: number | null;
  stock: number;
  is_unlimited_stock: boolean;
  is_active: boolean;
  image_url?: string | null;
  origin_region?: string | null;
  delivery_methods: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductWithSeller extends Product {
  profiles?: Profile | null;
  categories?: Category | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at?: string;
  products?: Product | null;
}

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  status: OrderStatus;
  delivery_type: DeliveryType;
  delivery_method?: string | null;
  shipping_address?: string | null;
  shipping_notes?: string | null;
  pickup_schedule?: string | null;
  total_price: number;
  total_amount?: number;
  cancel_reason?: string | null;
  created_at: string;
  updated_at?: string;
  profiles?: Profile | null;
  order_items?: OrderItem[];
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  product_id?: string | null;
  order_id?: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
  product?: Product;
  order?: Order;
}
`,

  // =========================================================================
  // 2. ACCIONES DE PEDIDOS (Flexible para camelCase y snake_case)
  // =========================================================================
  'app/actions/orders.ts': `'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { type OrderStatus, isProfileComplete } from '@/types/database';

export interface CreateOrderItemPayload {
  productId?: string;
  product_id?: string;
  sellerId?: string;
  seller_id?: string;
  quantity: number;
  unitPrice?: number;
  unit_price?: number;
  subtotal?: number;
}

export interface CreateOrderPayload {
  sellerId?: string;
  seller_id?: string;
  deliveryType?: 'domicilio' | 'recogida_tienda' | 'tienda';
  delivery_method?: 'domicilio' | 'recogida_tienda' | 'tienda' | string;
  shippingAddress?: string | null;
  shipping_address?: string | null;
  shippingNotes?: string | null;
  shipping_notes?: string | null;
  pickupSchedule?: string | null;
  pickup_schedule?: string | null;
  items: CreateOrderItemPayload[];
  totalPrice?: number;
  total_price?: number;
  total_amount?: number;
}

export async function createOrder(payload: CreateOrderPayload) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Debes iniciar sesión para realizar un pedido.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'vendedor') {
    return { error: 'Las cuentas de vendedor no pueden realizar compras.' };
  }

  if (!isProfileComplete(profile)) {
    return { error: 'Completa tu perfil con todos los datos obligatorios antes de comprar.' };
  }

  const sellerId =
    payload.sellerId ||
    payload.seller_id ||
    payload.items[0]?.sellerId ||
    payload.items[0]?.seller_id ||
    '';

  const rawDeliv = payload.deliveryType || payload.delivery_method || 'domicilio';
  const deliveryType: 'domicilio' | 'recogida_tienda' =
    rawDeliv === 'tienda' || rawDeliv === 'recogida_tienda' ? 'recogida_tienda' : 'domicilio';

  const shippingAddress = payload.shippingAddress || payload.shipping_address || null;
  const shippingNotes = payload.shippingNotes || payload.shipping_notes || null;
  const pickupSchedule = payload.pickupSchedule || payload.pickup_schedule || null;
  const totalPrice = Number(payload.totalPrice ?? payload.total_price ?? payload.total_amount ?? 0);

  // 1. Verificar stock
  for (const it of payload.items) {
    const pId = it.productId || it.product_id;
    if (!pId) continue;

    const { data: prod } = await supabase
      .from('products')
      .select('id, name, stock, is_unlimited_stock')
      .eq('id', pId)
      .single();

    if (prod && !prod.is_unlimited_stock) {
      const currentStock = prod.stock ?? 0;
      if (currentStock < it.quantity) {
        return {
          error: currentStock <= 0
            ? \`Lo sentimos, no queda stock disponible para "\${prod.name}".\`
            : \`Solo quedan \${currentStock} unidad(es) de "\${prod.name}".\`,
        };
      }
    }
  }

  // 2. Crear pedido
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      buyer_id: user.id,
      seller_id: sellerId,
      status: 'pendiente',
      delivery_type: deliveryType,
      shipping_address: shippingAddress,
      shipping_notes: shippingNotes,
      pickup_schedule: pickupSchedule,
      total_price: totalPrice,
    })
    .select()
    .single();

  if (orderError || !order) {
    return { error: orderError?.message || 'Error al crear el pedido' };
  }

  // 3. Crear items
  const orderItemsData = payload.items.map((it) => {
    const pId = it.productId || it.product_id || '';
    const unitPrice = Number(it.unitPrice ?? it.unit_price ?? 0);
    const subtotal = Number(it.subtotal ?? unitPrice * it.quantity);
    return {
      order_id: order.id,
      product_id: pId,
      quantity: it.quantity,
      unit_price: unitPrice,
      subtotal: subtotal,
    };
  });

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData);

  if (itemsError) {
    return { error: itemsError.message };
  }

  // 4. Descontar stock
  for (const it of payload.items) {
    const pId = it.productId || it.product_id;
    if (!pId) continue;

    const { data: prod } = await supabase
      .from('products')
      .select('stock, is_unlimited_stock')
      .eq('id', pId)
      .single();

    if (prod && !prod.is_unlimited_stock) {
      const newStock = Math.max(0, (prod.stock ?? 0) - it.quantity);
      await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', pId);
    }
  }

  revalidatePath('/');
  revalidatePath('/tienda');
  revalidatePath('/experiencias');
  revalidatePath('/regalos-gourmet');
  revalidatePath('/comprador/pedidos');
  revalidatePath('/vendedor/pedidos');
  return { success: true, orderId: order.id };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'No autenticado' };
  }

  const { error } = await supabase
    .from('orders')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/comprador/pedidos');
  revalidatePath('/vendedor/pedidos');
  return { success: true };
}

export async function cancelOrder(orderId: string, reason: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'No autenticado' };
  }

  const { error } = await supabase
    .from('orders')
    .update({
      status: 'cancelado',
      cancel_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/comprador/pedidos');
  revalidatePath('/vendedor/pedidos');
  return { success: true };
}
`,

  // =========================================================================
  // 3. PÁGINA DE CESTA (Sin fallos de tipado ni undefined)
  // =========================================================================
  'app/cesta/page.tsx': `'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { createOrder } from '@/app/actions/orders';
import { ShoppingBag, ArrowLeft, Trash2, Truck, Store, Check, AlertCircle } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const { t } = useLanguage();

  const [deliveryType, setDeliveryType] = useState<'domicilio' | 'recogida_tienda'>('domicilio');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingNotes, setShippingNotes] = useState('');
  const [pickupSchedule, setPickupSchedule] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    const firstItem = items[0];
    const sellerId = firstItem.sellerId || firstItem.product?.seller_id || '';

    const orderPayload = {
      sellerId,
      seller_id: sellerId,
      deliveryType,
      delivery_method: deliveryType,
      shippingAddress: deliveryType === 'domicilio' ? shippingAddress : undefined,
      shipping_address: deliveryType === 'domicilio' ? shippingAddress : undefined,
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
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105"
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
          className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 transition-colors"
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
        <div className="p-4 bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 rounded-2xl text-xs font-bold text-red-800 dark:text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lista de productos */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-xs">
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
                      className="w-14 h-14 rounded-2xl object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <h2 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 truncate">
                        {name}
                      </h2>
                      <span className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                        {price.toFixed(2)} € / ud
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-800 p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(id, Math.max(1, item.quantity - 1))}
                        className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-black">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg cursor-pointer"
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

        {/* Resumen y envío */}
        <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-xs">
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
              {t.deliv_choose_mode}
            </h2>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryType('domicilio')}
                className={\`p-3 rounded-2xl border-2 text-center text-xs font-bold transition-all cursor-pointer \${
                  deliveryType === 'domicilio'
                    ? 'border-[#FFE259] bg-amber-50 dark:bg-amber-950/40 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }\`}
              >
                <Truck className="w-4 h-4 mx-auto mb-1 text-[#C68D07] dark:text-[#FFE259]" />
                <span>{t.deliv_home}</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('recogida_tienda')}
                className={\`p-3 rounded-2xl border-2 text-center text-xs font-bold transition-all cursor-pointer \${
                  deliveryType === 'recogida_tienda'
                    ? 'border-[#FFE259] bg-amber-50 dark:bg-amber-950/40 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }\`}
              >
                <Store className="w-4 h-4 mx-auto mb-1 text-[#C68D07] dark:text-[#FFE259]" />
                <span>{t.deliv_store_pickup}</span>
              </button>
            </div>

            {deliveryType === 'domicilio' ? (
              <div className="space-y-3 font-sans text-xs">
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
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
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
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs space-y-2 font-sans">
                <p className="font-bold text-stone-800 dark:text-stone-200">
                  {t.deliv_pickup_address}
                </p>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    {t.deliv_pickup_time}
                  </label>
                  <input
                    type="text"
                    value={pickupSchedule}
                    onChange={(e) => setPickupSchedule(e.target.value)}
                    placeholder="Ej: Hoy a las 18:30h"
                    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl"
                  />
                </div>
              </div>
            )}

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
`,

  // =========================================================================
  // 4. FORMULARIO DE PRODUCTO VENDEDOR (Con initialProduct y singleProducts)
  // =========================================================================
  'components/SellerProductForm.tsx': `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { createProduct, updateProduct, deleteProduct } from '@/app/actions/products';
import type { Category, Product, ProductFormat } from '@/types/database';
import { Package, ArrowLeft, Trash2, Check } from 'lucide-react';
import Link from 'next/link';

export interface SellerProductFormProps {
  categories: Category[];
  initialProduct?: Product | null;
  availableSingleProducts?: Product[];
}

export function SellerProductForm({
  categories,
  initialProduct,
  availableSingleProducts = [],
}: SellerProductFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initialProduct);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    if (isEditing && initialProduct) {
      const res = await updateProduct(initialProduct.id, formData);
      setLoading(false);
      if (res?.error) setError(res.error);
      else router.push('/tienda');
    } else {
      const res = await createProduct(formData);
      setLoading(false);
      if (res?.error) setError(res.error);
      else router.push('/tienda');
    }
  };

  const handleDelete = async () => {
    if (!initialProduct || !confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    setLoading(true);
    const res = await deleteProduct(initialProduct.id);
    setLoading(false);
    if (res?.error) alert(res.error);
    else router.push('/tienda');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 space-y-6 font-serif">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/tienda"
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {isEditing ? t.seller_edit_product : t.seller_new_product}
          </h1>
        </div>

        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-colors cursor-pointer"
            title={t.seller_delete_product}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 rounded-2xl text-xs font-bold text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-xs font-sans text-xs">
        <div>
          <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
            {t.seller_product_name} *
          </label>
          <input
            type="text"
            name="name"
            required
            defaultValue={initialProduct?.name || ''}
            className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {t.seller_product_category} *
            </label>
            <select
              name="category_id"
              required
              defaultValue={initialProduct?.category_id || categories[0]?.id || 'queso'}
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_es} / {c.name_eu}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {t.seller_product_format}
            </label>
            <select
              name="format"
              defaultValue={initialProduct?.format || 'unidad'}
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
            >
              <option value="unidad">Unidad</option>
              <option value="peso_kg">Peso (Kg)</option>
              <option value="pack">Pack / Cesta</option>
              <option value="botella">Botella</option>
              <option value="lata">Lata</option>
              <option value="tarro">Tarro</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {t.seller_product_price} *
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              required
              defaultValue={initialProduct?.price || ''}
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {t.seller_product_stock}
            </label>
            <input
              type="number"
              name="stock"
              defaultValue={initialProduct?.stock ?? 10}
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
            {t.seller_product_origin}
          </label>
          <input
            type="text"
            name="origin_region"
            defaultValue={initialProduct?.origin_region || 'Lekeitio / Bizkaia'}
            className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
          />
        </div>

        <div>
          <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
            {t.seller_product_desc}
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={initialProduct?.description || ''}
            className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-102 cursor-pointer font-serif disabled:opacity-50"
          >
            {loading ? t.common_loading : t.seller_save_product}
          </button>
        </div>
      </form>
    </div>
  );
}
`,

  // =========================================================================
  // 5. CATEGORY CIRCLE GRID (Garantiza slug no undefined)
  // =========================================================================
  'components/CategoryCircleGrid.tsx': `'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { Category } from '@/types/database';

interface CategoryCircleGridProps {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export function CategoryCircleGrid({
  categories,
  selectedCategory = 'all',
  onSelectCategory,
}: CategoryCircleGridProps) {
  const { t, language } = useLanguage();

  const getCategoryName = (cat: Category) => {
    if (language === 'eu') return cat.name_eu;
    if (language === 'fr') return cat.name_fr;
    if (language === 'en') return cat.name_en;
    return cat.name_es;
  };

  const getCategorySubtitle = (slug: string) => {
    switch (slug) {
      case 'quesos': return t.sub_quesos;
      case 'atun': return t.sub_atun;
      case 'salazones': return t.sub_salazones;
      case 'gildas': return t.sub_gildas;
      case 'cerveza': return t.sub_cerveza;
      case 'txakoli': return t.sub_txakoli;
      case 'sidra': return t.sub_sidra;
      default: return 'Gourmet Selection';
    }
  };

  return (
    <section className="space-y-6 pt-2">
      <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
            {t.cat_explore}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 uppercase font-serif tracking-tight">
            {t.cat_section_title}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const catSlug = cat.slug || cat.id || '';

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory?.(cat.id)}
              className={\`group relative p-3 sm:p-4 rounded-3xl border-2 text-center transition-all flex flex-col items-center justify-between cursor-pointer hover:scale-103 shadow-xs \${
                isSelected
                  ? 'bg-[#FFE259] border-stone-900 dark:border-white shadow-md'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-[#FFE259] dark:hover:border-[#FFE259]'
              }\`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-stone-200 dark:border-stone-700 group-hover:border-[#FFE259] mb-2 p-0.5 bg-[#FAF8F5]">
                <img
                  src={cat.image_url || '/images/secciones/Quesos.JPG'}
                  alt={getCategoryName(cat)}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="space-y-0.5 min-w-0 w-full">
                <span className={\`block font-serif font-black text-xs sm:text-[13px] truncate leading-tight \${
                  isSelected ? 'text-[#1D1D1B]' : 'text-stone-900 dark:text-stone-100 group-hover:text-[#C68D07] dark:group-hover:text-[#FFE259]'
                }\`}>
                  {getCategoryName(cat)}
                </span>
                <span className={\`block text-[9.5px] font-sans font-bold uppercase tracking-wider truncate \${
                  isSelected ? 'text-stone-800' : 'text-stone-400 dark:text-stone-500'
                }\`}>
                  {getCategorySubtitle(catSlug)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
`,

  // =========================================================================
  // 6. VISTA PEDIDOS VENDEDOR (Tipos estrictos de OrderStatus)
  // =========================================================================
  'components/SellerOrdersView.tsx': `'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { updateOrderStatus } from '@/app/actions/orders';
import Link from 'next/link';
import type { Order, OrderStatus } from '@/types/database';
import { Package, MessageCircle, User, MapPin } from 'lucide-react';

export function SellerOrdersView({ orders }: { orders: Order[] }) {
  const { t } = useLanguage();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
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
          {orders.map((order) => {
            const total = Number(order.total_price ?? order.total_amount ?? 0);

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-serif">
                      {t.orders_order_number} #{order.id.slice(0, 8)}
                    </span>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                      {new Date(order.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <span className="text-base font-black font-serif text-stone-900 dark:text-stone-100">
                    {t.orders_total_to_charge} {total.toFixed(2)} €
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 text-xs space-y-1.5 font-sans">
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

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 font-serif">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={loadingId === order.id || order.status === 'confirmado'}
                      onClick={() => handleStatusChange(order.id, 'confirmado')}
                      className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
                        order.status === 'confirmado'
                          ? 'bg-blue-600 text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }\`}
                    >
                      {t.status_confirm}
                    </button>

                    <button
                      type="button"
                      disabled={loadingId === order.id || order.status === 'preparando'}
                      onClick={() => handleStatusChange(order.id, 'preparando')}
                      className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
                        order.status === 'preparando'
                          ? 'bg-amber-500 text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }\`}
                    >
                      {t.status_preparing}
                    </button>

                    <button
                      type="button"
                      disabled={loadingId === order.id || order.status === 'listo_entrega'}
                      onClick={() => handleStatusChange(order.id, 'listo_entrega')}
                      className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
                        order.status === 'listo_entrega'
                          ? 'bg-purple-600 text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }\`}
                    >
                      {t.status_ready}
                    </button>

                    <button
                      type="button"
                      disabled={loadingId === order.id || order.status === 'entregado'}
                      onClick={() => handleStatusChange(order.id, 'entregado')}
                      className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
                        order.status === 'entregado'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
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
`,

  // =========================================================================
  // 7. VISTA PEDIDOS COMPRADOR
  // =========================================================================
  'components/BuyerOrdersView.tsx': `'use client';

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import type { Order } from '@/types/database';
import { Package, MessageCircle, MapPin, Store } from 'lucide-react';

export function BuyerOrdersView({ orders }: { orders: Order[] }) {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
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
            const total = Number(order.total_price ?? order.total_amount ?? 0);

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 space-y-5 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-serif">
                      {t.orders_order_number} #{order.id.slice(0, 8)}
                    </span>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                      {new Date(order.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-[#C68D07] dark:text-[#FFE259] font-black text-xs uppercase tracking-wider font-serif">
                      {order.status}
                    </span>
                    <span className="text-base font-black font-serif text-stone-900 dark:text-stone-100">
                      {total.toFixed(2)} €
                    </span>
                  </div>
                </div>

                {order.order_items && order.order_items.length > 0 && (
                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-stone-100 dark:border-stone-800 last:border-0 font-sans">
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-[#C68D07] dark:text-[#FFE259]" />
                          <span className="font-bold text-stone-800 dark:text-stone-200">
                            {item.products?.name || 'Producto Gourmet'}
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

                <div className="pt-2 flex items-center justify-between text-xs font-serif">
                  <div className="flex items-center gap-1.5 text-stone-500 font-sans">
                    {order.delivery_type === 'recogida_tienda' ? (
                      <>
                        <Store className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
                        <span>Recogida en Tienda Lekeitio</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
                        <span>{order.shipping_address || 'Envío a domicilio'}</span>
                      </>
                    )}
                  </div>

                  <Link
                    href={\`/chat/\${order.seller_id}?order_id=\${order.id}\`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-stone-800 dark:text-stone-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
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
          <Package className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
          <h3 className="text-lg font-black font-serif text-stone-800 dark:text-stone-200">
            {t.orders_no_orders}
          </h3>
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider font-serif shadow-xs"
          >
            <span>{t.cart_explore_btn}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
`,
};

// Escritura en disco
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trimStart(), 'utf8');
  console.log(`✓ Archivo sincronizado: ${filePath}`);
});

console.log('\n🎉 ¡Todos los tipos y componentes se han corregido y sincronizado con éxito!');