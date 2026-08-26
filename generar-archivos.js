const fs = require('fs');
const path = require('path');

const files = {
  // 1. ACCIONES DE AUTENTICACIÓN (Declaraciones async explícitas compatibles con Turbopack)
  'app/actions/auth.ts': `'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function register(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = (formData.get('full_name') as string) || '';
  const role = (formData.get('role') as string) || 'comprador';
  const phone = (formData.get('phone') as string) || '';
  const town = (formData.get('town') as string) || '';

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
        phone,
        town,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      full_name: fullName,
      email,
      role: role as any,
      phone,
      town,
    });
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(formData: FormData) {
  return register(formData);
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'No autenticado' };

  const fullName = (formData.get('full_name') as string)?.trim() || '';
  const phone = (formData.get('phone') as string)?.trim() || '';
  const town = (formData.get('town') as string)?.trim() || '';

  if (!fullName) {
    return { error: 'Por favor, introduce tu nombre completo.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone,
      town,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/perfil');
  revalidatePath('/');
  return { success: true };
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
`,

  // 2. PÁGINA DE REGISTRO (Usa la acción de registro directa)
  'app/register/page.tsx': `'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { register } from '@/app/actions/auth';
import { UserPlus, Mail, Lock, User, Phone, MapPin, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await register(formData);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 sm:p-10 space-y-8 shadow-xl font-serif">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#FFE259] text-[#1D1D1B] flex items-center justify-center mx-auto shadow-xs">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {t.nav_register}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Crea tu cuenta para disfrutar de nuestros quesos y experiencias.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 rounded-2xl text-xs font-bold text-red-800 dark:text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
              {t.auth_full_name} *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="full_name"
                required
                placeholder="Nombre y Apellidos"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
              {t.auth_email} *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                placeholder="tu@email.com"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
              {t.auth_password} *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                required
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                {t.auth_phone}
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="600 000 000"
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                {t.auth_town}
              </label>
              <input
                type="text"
                name="town"
                placeholder="Lekeitio / Bilbao"
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : t.nav_register}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100 dark:border-stone-800">
          <Link
            href="/login"
            className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          >
            {t.auth_have_account}
          </Link>
        </div>
      </div>
    </div>
  );
}
`,

  // 3. COMPONENTE DE FORMULARIO DE PERFIL
  'components/ProfileForm.tsx': `'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { updateProfile } from '@/app/actions/auth';
import type { Profile } from '@/types/database';
import { User, Phone, MapPin, Check } from 'lucide-react';

interface ProfileFormProps {
  profile?: Profile;
  userProfile?: Profile;
}

export function ProfileForm({ profile, userProfile }: ProfileFormProps) {
  const currentProfile = profile || userProfile || ({} as Profile);
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateProfile(formData);
    setLoading(false);

    if (res?.error) {
      setMsg({ text: res.error, isError: true });
    } else {
      setMsg({ text: t.common_success, isError: false });
      setTimeout(() => setMsg(null), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-serif">
      {msg && (
        <div
          className={\`p-4 rounded-2xl text-xs font-bold text-center \${
            msg.isError
              ? 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
              : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
          }\`}
        >
          {msg.text}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
            {t.auth_full_name} *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="full_name"
              required
              defaultValue={currentProfile.full_name || ''}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
              {t.auth_phone}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                defaultValue={currentProfile.phone || ''}
                placeholder="600 000 000"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
              {t.auth_town}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="town"
                defaultValue={currentProfile.town || ''}
                placeholder="Lekeitio / Bizkaia"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          <span>{loading ? 'Guardando...' : t.common_save}</span>
        </button>
      </div>
    </form>
  );
}
`,

  // 4. PÁGINA DE PERFIL
  'app/perfil/page.tsx': `import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/ProfileForm';
import type { Profile } from '@/types/database';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const userProfile = profile as Profile;

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
            Mi Perfil
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Gestiona tus datos de contacto y preferencias.
          </p>
        </div>
      </div>

      <ProfileForm userProfile={userProfile} profile={userProfile} />
    </div>
  );
}
`,

  // 5. CONTEXTO DEL CARRITO
  'context/CartContext.tsx': `'use client';

import React, { createContext, useContext, useSyncExternalStore, useMemo, useState, useCallback } from 'react';
import type { Product } from '@/types/database';
import { getProductImage } from '@/lib/productHelpers';

export interface CartItem {
  productId: string;
  sellerId: string;
  sellerName?: string;
  name: string;
  category?: string;
  format?: string;
  price: number;
  imageUrl?: string | null;
  originRegion?: string | null;
  quantity: number;
  product?: Product;
}

interface CartContextType {
  items: CartItem[];
  cart: CartItem[];
  addToCart: (product: Product, sellerName?: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ekhiteka_cart';

let cachedItems: CartItem[] = [];
let cachedString = '';

function subscribe(callback: () => void) {
  window.addEventListener('ekhiteka_cart_updated', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('ekhiteka_cart_updated', callback);
    window.removeEventListener('storage', callback);
  };
}

function getSnapshot(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY) || '[]';
    if (raw !== cachedString) {
      cachedString = raw;
      cachedItems = JSON.parse(raw);
    }
    return cachedItems;
  } catch {
    return cachedItems;
  }
}

const EMPTY_CART: CartItem[] = [];
function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const saveItems = (newItems: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      window.dispatchEvent(new Event('ekhiteka_cart_updated'));
    } catch {
      // Ignore
    }
  };

  const addToCart = useCallback((product: Product, sellerName?: string, quantity = 1) => {
    const existingIdx = items.findIndex((i) => (i.productId || i.product?.id) === product.id);
    if (existingIdx > -1) {
      const updated = [...items];
      updated[existingIdx].quantity += quantity;
      saveItems(updated);
    } else {
      const newItem: CartItem = {
        productId: product.id,
        sellerId: product.seller_id,
        sellerName: sellerName || 'EkhiTeka Selección',
        name: product.name,
        category: product.category_id,
        format: product.format,
        price: Number(product.price),
        imageUrl: getProductImage(product),
        originRegion: product.origin_region,
        quantity,
        product,
      };
      saveItems([...items, newItem]);
    }
    setIsCartOpen(true);
  }, [items]);

  const removeFromCart = useCallback((productId: string) => {
    saveItems(items.filter((i) => (i.productId || i.product?.id) !== productId));
  }, [items]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = items.map((i) =>
      (i.productId || i.product?.id) === productId ? { ...i, quantity } : i
    );
    saveItems(updated);
  }, [items, removeFromCart]);

  const clearCart = useCallback(() => {
    saveItems([]);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, i) => sum + Number(i.price || i.product?.price || 0) * i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        cart: items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
`,

  // 6. DRAWER DEL CARRITO
  'components/CartDrawer.tsx': `'use client';

import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export function CartDrawer() {
  const { items, isCartOpen, closeCart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
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
              className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {items.length > 0 ? (
            <div className="space-y-4 divide-y divide-stone-100 dark:divide-stone-800">
              {items.map((item) => {
                const id = item.productId || item.product?.id || '';
                const name = item.name || item.product?.name || 'Producto';
                const price = Number(item.price || item.product?.price || 0);
                const img = item.imageUrl || item.product?.image_url || '/images/secciones/Quesos.JPG';

                return (
                  <div key={id} className="pt-4 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-stone-200 dark:border-stone-700">
                        <img
                          src={img}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif font-black text-xs text-stone-900 dark:text-stone-100 truncate">
                          {name}
                        </p>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 font-serif">
                          {price.toFixed(2)} €
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-serif shrink-0">
                      <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(id, Math.max(1, item.quantity - 1))}
                          className="w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-stone-200 dark:hover:bg-stone-700 rounded cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-xs font-black">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-stone-200 dark:hover:bg-stone-700 rounded cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(id)}
                        className="p-1 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
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

        {items.length > 0 && (
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
};

// Generar todos los archivos en disco
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trimStart(), 'utf8');
  console.log(`✓ Actualizado: ${filePath}`);
});

console.log('\n🎉 ¡Todos los componentes, acciones y páginas se han generado y corregido con éxito!');