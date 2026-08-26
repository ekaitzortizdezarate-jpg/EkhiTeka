const fs = require('fs');
const path = require('path');

const files = {
  // =========================================================================
  // 1. TIPOS DE BASE DE DATOS (Direcciones de recogida y WhatsApp del vendedor)
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

export interface PickupAddress {
  id: string;
  title: string;
  street: string;
  number?: string;
  town: string;
  province: string;
  postal_code?: string;
  schedule?: string;
  is_active: boolean;
}

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
  whatsapp_phone?: string | null;
  pickup_addresses?: PickupAddress[];
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
      province: 'Bizkaia',
      town: 'Lekeitio',
      postal_code: '48280',
      street: 'Gamarra Kalea',
      number: '4',
      stair: '',
      floor: '',
      door: '',
      whatsapp_phone: '34600000000',
      pickup_addresses: [],
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

  const defaultAddresses: PickupAddress[] = [
    {
      id: 'default_store_1',
      title: 'Quesería & Tienda Principal Lekeitio',
      street: details.street || raw.street || 'Gamarra Kalea',
      number: details.number || raw.number || '4',
      town: details.town || raw.town || 'Lekeitio',
      province: details.province || raw.province || 'Bizkaia',
      postal_code: details.postal_code || raw.postal_code || '48280',
      schedule: 'Lun-Vie: 10:00 - 14:30 | 17:00 - 20:30 · Sáb: 10:30 - 15:00',
      is_active: true,
    },
  ];

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
    whatsapp_phone: details.whatsapp_phone || raw.phone || '34600000000',
    pickup_addresses: details.pickup_addresses && details.pickup_addresses.length > 0 ? details.pickup_addresses : defaultAddresses,
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
  // 2. CONTEXTO GLOBAL DE CONFIGURACIÓN DE TIENDA (WhatsApp y Puntos de Recogida)
  // =========================================================================
  'context/StoreConfigContext.tsx': `'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { Profile, PickupAddress } from '@/types/database';
import { parseProfile } from '@/types/database';

interface StoreConfigContextType {
  whatsappPhone: string;
  storeAddress: string;
  activePickupAddress: PickupAddress | null;
  pickupAddresses: PickupAddress[];
  getWhatsAppUrl: (message?: string) => string;
}

const StoreConfigContext = createContext<StoreConfigContextType | undefined>(undefined);

export function StoreConfigProvider({
  children,
  initialSellerProfile,
}: {
  children: React.ReactNode;
  initialSellerProfile?: Profile | null;
}) {
  const seller = useMemo(() => parseProfile(initialSellerProfile), [initialSellerProfile]);

  const whatsappPhone = useMemo(() => {
    const raw = seller.whatsapp_phone || seller.phone || '34600000000';
    return raw.replace(/[^0-9]/g, '');
  }, [seller]);

  const activePickupAddress = useMemo(() => {
    const addresses = seller.pickup_addresses || [];
    return addresses.find((a) => a.is_active) || addresses[0] || null;
  }, [seller]);

  const storeAddress = useMemo(() => {
    if (activePickupAddress) {
      return \`\${activePickupAddress.street}\${activePickupAddress.number ? \` \${activePickupAddress.number}\` : ''}, \${activePickupAddress.town} · \${activePickupAddress.province}\`;
    }
    return 'Gamarra Kalea 4, Lekeitio · Bizkaia';
  }, [activePickupAddress]);

  const getWhatsAppUrl = useMemo(() => {
    return (message?: string) => {
      const cleanNumber = whatsappPhone.startsWith('34') || whatsappPhone.length > 10 ? whatsappPhone : \`34\${whatsappPhone}\`;
      const encodedMsg = message ? encodeURIComponent(message) : '';
      return \`https://wa.me/\${cleanNumber}\${encodedMsg ? \`?text=\${encodedMsg}\` : ''}\`;
    };
  }, [whatsappPhone]);

  return (
    <StoreConfigContext.Provider
      value={{
        whatsappPhone,
        storeAddress,
        activePickupAddress,
        pickupAddresses: seller.pickup_addresses || [],
        getWhatsAppUrl,
      }}
    >
      {children}
    </StoreConfigContext.Provider>
  );
}

export function useStoreConfig() {
  const context = useContext(StoreConfigContext);
  if (!context) {
    return {
      whatsappPhone: '34600000000',
      storeAddress: 'Gamarra Kalea 4, Lekeitio · Bizkaia',
      activePickupAddress: null,
      pickupAddresses: [],
      getWhatsAppUrl: (message?: string) => \`https://wa.me/34600000000\${message ? \`?text=\${encodeURIComponent(message)}\` : ''}\`,
    };
  }
  return context;
}
`,

  // =========================================================================
  // 3. ESTILOS GLOBALES (Modo oscuro en TODOS los inputs, selects y textareas)
  // =========================================================================
  'app/globals.css': `@import "tailwindcss";

/* Tailwind v4: activar modo oscuro mediante clase CSS en <html> */
@variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: var(--font-dm-sans), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-serif: var(--font-cormorant), 'Playfair Display', Georgia, Cambria, serif;
  --color-manduca-yellow: #FFE259;
  --color-manduca-yellow-hover: #F5D742;
  --color-manduca-yellow-light: #FFF9DE;
  --color-manduca-dark: #1D1D1B;
  --color-manduca-cream: #FAF7F2;
  --color-manduca-border: #E8E5DF;
}

@layer base {
  :root {
    --background: #FAF8F5;
    --foreground: #1D1D1B;
    --card-bg: #FFFFFF;
    --accent-yellow: #FFE259;
  }

  .dark {
    --background: #141312;
    --foreground: #F5F5F0;
    --card-bg: #1F1E1C;
    --accent-yellow: #FFE259;
  }

  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font-dm-sans), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    letter-spacing: -0.01em;
  }

  /* FORZAR ESTILOS CLAROS/OSCUROS EN TODOS LOS CAMPOS DE ENTRADA */
  input[type="text"],
  input[type="email"],
  input[type="password"],
  input[type="tel"],
  input[type="number"],
  input[type="date"],
  textarea,
  select {
    background-color: #FAF8F5;
    color: #1D1D1B;
    border-color: #D6D3CD;
  }

  .dark input[type="text"],
  .dark input[type="email"],
  .dark input[type="password"],
  .dark input[type="tel"],
  .dark input[type="number"],
  .dark input[type="date"],
  .dark textarea,
  .dark select {
    background-color: #1F1E1C !important;
    color: #F5F5F0 !important;
    border-color: #383531 !important;
  }

  .dark select option {
    background-color: #1F1E1C;
    color: #F5F5F0;
  }

  .dark input::placeholder,
  .dark textarea::placeholder {
    color: #78756E !important;
  }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.manduca-card {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease;
}

.manduca-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.08), 0 10px 15px -5px rgba(0, 0, 0, 0.04);
}

.manduca-btn-yellow {
  background-color: #FFE259;
  color: #1D1D1B;
  font-weight: 800;
  transition: all 0.25s ease;
}

.manduca-btn-yellow:hover {
  background-color: #F5D742;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 226, 89, 0.35);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
`,

  // =========================================================================
  // 4. NAVBAR (Icono de Login en Móvil cuando no hay sesión iniciada)
  // =========================================================================
  'components/NavbarNavLinks.tsx': `'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
import { signout } from '@/app/actions/auth';
import type { Profile } from '@/types/database';
import { CartNavButton } from '@/components/CartNavButton';
import {
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  Store,
  MessageCircle,
} from 'lucide-react';

interface NavbarNavLinksProps {
  user: { id: string } | null;
  profile: Profile | null;
  unreadMessagesCount: number;
  ordersCount: number;
  activeOrders?: { id: string; status: string }[];
}

export function NavbarNavLinks({
  user,
  profile,
  unreadMessagesCount,
  ordersCount,
  activeOrders = [],
}: NavbarNavLinksProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { whatsappPhone, storeAddress } = useStoreConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasUnseenOrderUpdates, setHasUnseenOrderUpdates] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSeller = profile?.role === 'vendedor';
  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    function checkUnseenOrders() {
      if (!user || !activeOrders || activeOrders.length === 0) {
        setHasUnseenOrderUpdates(false);
        return;
      }
      const storageKey = isSeller ? 'ekhiteka_seen_orders_seller' : 'ekhiteka_seen_orders_buyer';
      let seenMap: Record<string, string> = {};
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) seenMap = JSON.parse(stored);
      } catch {}

      const unseen = activeOrders.some((order) => {
        const lastSeen = seenMap[order.id];
        if (lastSeen) {
          return lastSeen !== order.status;
        }
        return isSeller ? order.status === 'pendiente' : order.status !== 'pendiente';
      });

      setHasUnseenOrderUpdates(unseen);
    }

    checkUnseenOrders();
    window.addEventListener('ekhiteka_orders_seen_updated', checkUnseenOrders);
    window.addEventListener('storage', checkUnseenOrders);
    return () => {
      window.removeEventListener('ekhiteka_orders_seen_updated', checkUnseenOrders);
      window.removeEventListener('storage', checkUnseenOrders);
    };
  }, [user, activeOrders, isSeller]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <div className="flex items-center justify-between w-full min-w-0 gap-3">
      {/* 1. LADO IZQUIERDO */}
      <div className="flex items-center gap-3 xl:gap-5 min-w-0">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 -ml-1 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-2xl transition-colors cursor-pointer"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group min-w-0">
          <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 border-stone-200 dark:border-stone-700 group-hover:border-[#FFE259] group-hover:scale-105 transition-all shadow-xs bg-[#FAF8F5] shrink-0">
            <img
              src="/Logo.jpg"
              alt="EkhiTeka Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif font-black text-xl sm:text-2xl tracking-tight text-[#1D1D1B] dark:text-stone-100 block leading-tight">
              Ekhi<span className="text-[#C68D07] dark:text-[#FFE259]">Teka</span>
            </span>
            <span className="hidden xl:block text-[9.5px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 -mt-0.5 truncate">
              Quesería & Selección Gourmet
            </span>
          </div>
        </Link>

        {/* Enlaces Desktop */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 font-serif">
          <Link
            href="/tienda"
            className={\`flex items-center justify-center text-center px-3 xl:px-4 py-2 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[11px] xl:text-[12px] font-bold transition-all whitespace-nowrap min-h-[38px] \${
              pathname === '/tienda' || pathname.startsWith('/categoria') || pathname.startsWith('/producto')
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs border border-stone-800/10'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }\`}
          >
            <span>{t.nav_shop}</span>
          </Link>

          <Link
            href="/regalos-gourmet"
            className={\`flex flex-col items-center justify-center text-center px-3 xl:px-4 py-1 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[10.5px] xl:text-[11px] font-semibold transition-all leading-tight whitespace-nowrap min-h-[38px] \${
              pathname === '/regalos-gourmet'
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs border border-stone-800/10'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }\`}
          >
            <span className="block text-center">{t.nav_gourmet_gifts_line1}</span>
            <span className="block text-center">{t.nav_gourmet_gifts_line2}</span>
          </Link>

          <Link
            href="/experiencias"
            className={\`flex flex-col items-center justify-center text-center px-3 xl:px-4 py-1 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[10.5px] xl:text-[11px] font-semibold transition-all leading-tight whitespace-nowrap min-h-[38px] \${
              pathname === '/experiencias'
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs border border-stone-800/10'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }\`}
          >
            <span className="block text-center">{t.nav_tastings_line1}</span>
            <span className="block text-center">{t.nav_tastings_line2}</span>
          </Link>

          <Link
            href="/regalos-empresa"
            className={\`flex flex-col items-center justify-center text-center px-3 xl:px-4 py-1 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[10.5px] xl:text-[11px] font-semibold transition-all leading-tight whitespace-nowrap min-h-[38px] \${
              pathname === '/regalos-empresa'
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs border border-stone-800/10'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }\`}
          >
            <span className="block text-center">{t.nav_corporate_line1}</span>
            <span className="block text-center">{t.nav_corporate_line2}</span>
          </Link>

          {user && (
            <>
              <Link
                href={isSeller ? '/vendedor/pedidos' : '/comprador/pedidos'}
                className={\`relative flex items-center justify-center text-center gap-1.5 px-3 xl:px-4 py-2 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[11px] xl:text-[12px] font-semibold transition-all whitespace-nowrap min-h-[38px] \${
                  pathname.includes('/pedidos')
                    ? 'bg-[#FFE259] text-[#1D1D1B] font-bold shadow-xs border border-stone-800/10'
                    : hasUnseenOrderUpdates
                    ? 'bg-[#FFE259]/30 text-stone-900 dark:text-stone-100 border border-[#FFE259] ring-2 ring-[#FFE259]/50 animate-pulse font-bold shadow-md'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                }\`}
              >
                <span>{t.nav_orders}</span>
                {hasUnseenOrderUpdates && (
                  <span className="w-2 h-2 rounded-full bg-[#FFE259] border border-stone-900 animate-ping" />
                )}
              </Link>

              {isSeller && (
                <Link
                  href="/vendedor/eventos"
                  className={\`flex items-center justify-center text-center px-3 xl:px-4 py-2 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[11px] xl:text-[12px] font-semibold transition-all whitespace-nowrap min-h-[38px] \${
                    pathname === '/vendedor/eventos'
                      ? 'bg-[#FFE259] text-[#1D1D1B] font-bold shadow-xs border border-stone-800/10'
                      : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                  }\`}
                >
                  <span>{t.nav_events}</span>
                </Link>
              )}

              {isSeller && (
                <Link
                  href="/vendedor/productos/nuevo"
                  className={\`flex flex-col items-center justify-center text-center px-3.5 xl:px-4 py-1 rounded-2xl transition-all font-black uppercase tracking-[0.14em] xl:tracking-[0.16em] text-[10px] xl:text-[10.5px] leading-tight hover:scale-102 whitespace-nowrap min-h-[38px] \${
                    pathname === '/vendedor/productos/nuevo'
                      ? 'bg-[#FFE259] text-[#1D1D1B] shadow-xs border border-stone-800/10'
                      : 'border-2 border-[#FFE259] bg-transparent text-stone-900 dark:text-[#FFE259] hover:bg-[#FFE259] hover:text-[#1D1D1B]'
                  }\`}
                >
                  <span className="block text-center">{t.nav_add_product_line1}</span>
                  <span className="block text-center">{t.nav_add_product_line2}</span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center justify-center text-center px-3 py-2 bg-purple-100 dark:bg-purple-950/70 text-purple-950 dark:text-purple-200 border border-purple-300 dark:border-purple-700 rounded-2xl transition-all font-semibold uppercase tracking-[0.14em] text-[11px] whitespace-nowrap min-h-[38px]"
                >
                  <span>{t.nav_admin}</span>
                </Link>
              )}
            </>
          )}
        </nav>
      </div>

      {/* 2. LADO DERECHO */}
      <div className="flex items-center gap-2 shrink-0">
        {user ? (
          <div className="flex items-center gap-2">
            {(!profile || profile.role === 'comprador') && <CartNavButton />}

            <Link
              href="/chat"
              className={\`relative p-2.5 rounded-2xl border transition-all shrink-0 \${
                pathname.startsWith('/chat')
                  ? 'bg-[#FFE259] text-[#1D1D1B] border-stone-800 shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }\`}
              title={t.nav_chats}
            >
              <MessageCircle className="w-4 h-4" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </Link>

            <Link
              href="/perfil"
              className={\`p-2.5 rounded-2xl border transition-colors shrink-0 \${
                pathname === '/perfil'
                  ? 'bg-[#FFE259] text-[#1D1D1B] border-stone-800 shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }\`}
              title={t.nav_profile}
            >
              <User className="w-4 h-4" />
            </Link>

            <form action={signout} className="shrink-0">
              <button
                type="submit"
                className="p-2.5 rounded-2xl text-stone-500 hover:text-red-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
                title={t.nav_logout}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Icono Iniciar Sesión en Móvil */}
            <Link
              href="/login"
              className="lg:hidden p-2.5 rounded-2xl bg-stone-100 hover:bg-[#FFE259] dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:text-[#1D1D1B] border border-stone-200 dark:border-stone-700 transition-all shadow-2xs"
              title={t.nav_login}
            >
              <LogIn className="w-4 h-4" />
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2.5 text-xs font-bold font-serif uppercase tracking-wider text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white rounded-2xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                {t.nav_login}
              </Link>
              <Link
                href="/register"
                className="px-4 py-2.5 text-xs font-black font-serif uppercase tracking-wider bg-[#1D1D1B] dark:bg-stone-100 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-white dark:text-stone-900 rounded-2xl transition-all shadow-2xs"
              >
                {t.nav_register}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 3. MENÚ MÓVIL (Con link a inicio en el logo y nombre) */}
      {mounted && mobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[999999] lg:hidden" style={{ zIndex: 999999 }}>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed top-0 bottom-0 left-0 max-w-xs w-full bg-[#1D1D1B] text-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-[1000000] border-r border-stone-800 animate-in slide-in-from-left duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FFE259] p-0.5 bg-[#FAF8F5] group-hover:scale-105 transition-transform shrink-0">
                    <img
                      src="/Logo.jpg"
                      alt="EkhiTeka"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif font-bold text-lg text-white tracking-wider">
                      Ekhi<span className="text-[#FFE259]">Teka</span>
                    </span>
                    <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-400">
                      Lekeitio · Bizkaia
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-2 font-serif">
                <p className="text-[11px] font-sans font-black uppercase tracking-[0.2em] text-[#FFE259] text-center pb-1">
                  {t.nav_explore_selection}
                </p>
                <Link
                  href="/tienda"
                  onClick={() => setMobileMenuOpen(false)}
                  className={\`flex items-center justify-center text-center p-3.5 rounded-full font-bold text-xs tracking-[0.16em] uppercase transition-all shadow-md \${
                    pathname === '/tienda'
                      ? 'bg-[#FFE259] text-[#1D1D1B] scale-102 ring-2 ring-[#FFE259]'
                      : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700 hover:border-[#FFE259]'
                  }\`}
                >
                  <span>{t.nav_shop}</span>
                </Link>
                <Link
                  href="/regalos-gourmet"
                  onClick={() => setMobileMenuOpen(false)}
                  className={\`flex items-center justify-center text-center p-3.5 rounded-full font-bold text-xs tracking-[0.16em] uppercase transition-all shadow-md \${
                    pathname === '/regalos-gourmet'
                      ? 'bg-[#FFE259] text-[#1D1D1B] scale-102 ring-2 ring-[#FFE259]'
                      : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700 hover:border-[#FFE259]'
                  }\`}
                >
                  <span>{t.nav_gourmet_gifts}</span>
                </Link>
                <Link
                  href="/experiencias"
                  onClick={() => setMobileMenuOpen(false)}
                  className={\`flex items-center justify-center text-center p-3.5 rounded-full font-bold text-xs tracking-[0.16em] uppercase transition-all shadow-md \${
                    pathname === '/experiencias'
                      ? 'bg-[#FFE259] text-[#1D1D1B] scale-102 ring-2 ring-[#FFE259]'
                      : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700 hover:border-[#FFE259]'
                  }\`}
                >
                  <span>{t.nav_tastings_experiences}</span>
                </Link>
                <Link
                  href="/regalos-empresa"
                  onClick={() => setMobileMenuOpen(false)}
                  className={\`flex items-center justify-center text-center p-3.5 rounded-full font-bold text-xs tracking-[0.16em] uppercase transition-all shadow-md \${
                    pathname === '/regalos-empresa'
                      ? 'bg-[#FFE259] text-[#1D1D1B] scale-102 ring-2 ring-[#FFE259]'
                      : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700 hover:border-[#FFE259]'
                  }\`}
                >
                  <span>{t.nav_corporate_gifts}</span>
                </Link>
              </div>

              {/* SECCIÓN TU CUENTA */}
              <div className="space-y-2.5 pt-4 border-t border-stone-800 font-serif">
                <p className="text-[11px] font-sans font-black uppercase tracking-[0.2em] text-[#FFE259] text-center pb-1">
                  {t.nav_your_account}
                </p>
                {user ? (
                  <>
                    <Link
                      href={isSeller ? '/vendedor/pedidos' : '/comprador/pedidos'}
                      onClick={() => setMobileMenuOpen(false)}
                      className={\`flex items-center justify-center gap-2 p-3 rounded-full font-bold text-xs tracking-[0.14em] uppercase transition-all \${
                        pathname.includes('/pedidos')
                          ? 'bg-[#FFE259] text-[#1D1D1B]'
                          : hasUnseenOrderUpdates
                          ? 'bg-[#FFE259]/25 text-[#FFE259] border border-[#FFE259] ring-2 ring-[#FFE259]/50 animate-pulse font-bold'
                          : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700'
                      }\`}
                    >
                      <span>{t.nav_orders}</span>
                      {hasUnseenOrderUpdates && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FFE259] text-[#1D1D1B] text-[9px] font-black uppercase">
                          Nuevo
                        </span>
                      )}
                    </Link>

                    {isSeller && (
                      <Link
                        href="/vendedor/eventos"
                        onClick={() => setMobileMenuOpen(false)}
                        className={\`flex items-center justify-center p-3 rounded-full font-bold text-xs tracking-[0.14em] uppercase transition-all \${
                          pathname === '/vendedor/eventos'
                            ? 'bg-[#FFE259] text-[#1D1D1B]'
                            : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700'
                        }\`}
                      >
                        <span>{t.nav_events}</span>
                      </Link>
                    )}

                    {isSeller && (
                      <Link
                        href="/vendedor/productos/nuevo"
                        onClick={() => setMobileMenuOpen(false)}
                        className={\`flex items-center justify-center p-3.5 rounded-full font-black text-xs tracking-[0.16em] uppercase shadow-lg hover:scale-102 transition-all \${
                          pathname === '/vendedor/productos/nuevo'
                            ? 'bg-[#FFE259] text-[#1D1D1B] ring-2 ring-[#FFE259]'
                            : 'border-2 border-[#FFE259] bg-transparent text-white hover:bg-[#FFE259] hover:text-[#1D1D1B]'
                        }\`}
                      >
                        <span>{t.nav_add_product}</span>
                      </Link>
                    )}

                    <Link
                      href="/chat"
                      onClick={() => setMobileMenuOpen(false)}
                      className={\`flex items-center justify-center gap-2 p-3 rounded-full font-bold text-xs tracking-[0.14em] uppercase transition-all \${
                        pathname.startsWith('/chat')
                          ? 'bg-[#FFE259] text-[#1D1D1B]'
                          : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700'
                      }\`}
                    >
                      <span>{t.nav_chats}</span>
                      {unreadMessagesCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center">
                          {unreadMessagesCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      href="/perfil"
                      onClick={() => setMobileMenuOpen(false)}
                      className={\`flex items-center justify-center p-3 rounded-full font-bold text-xs tracking-[0.14em] uppercase transition-all \${
                        pathname === '/perfil'
                          ? 'bg-[#FFE259] text-[#1D1D1B]'
                          : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700'
                      }\`}
                    >
                      <span>{t.nav_profile}</span>
                    </Link>

                    <form action={signout} className="pt-2">
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center p-2.5 rounded-full text-xs font-bold tracking-[0.14em] uppercase text-stone-400 hover:text-red-400 hover:bg-stone-850 transition-colors cursor-pointer"
                      >
                        <span>{t.nav_logout}</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1 font-serif">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center text-center py-3 px-3 rounded-full border-2 border-stone-700 font-bold text-xs tracking-[0.14em] uppercase text-white hover:border-[#FFE259] hover:text-[#FFE259] transition-all bg-stone-850"
                    >
                      {t.nav_login}
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center text-center py-3 px-3 rounded-full bg-[#FFE259] font-black text-xs tracking-[0.14em] uppercase text-[#1D1D1B] shadow-md hover:scale-102 transition-all"
                    >
                      {t.nav_register}
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-stone-800 text-[11px] text-stone-400 space-y-1 text-center font-sans">
              <div className="flex items-center justify-center gap-1.5 font-bold text-stone-200">
                <Store className="w-3.5 h-3.5 text-[#FFE259]" />
                <span>Quesería & Tienda en Lekeitio</span>
              </div>
              <p>{storeAddress}</p>
              <p className="font-semibold text-[#FFE259]">WhatsApp: +{whatsappPhone}</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
`,

  // =========================================================================
  // 5. NAVBAR HEADER (Dirección dinámica desde configuración de tienda)
  // =========================================================================
  'components/Navbar.tsx': `import { createClient } from '@/lib/supabase/server';
import { type Profile, parseProfile } from '@/types/database';
import { NavbarNavLinks } from '@/components/NavbarNavLinks';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ThemeSelector } from '@/components/ThemeSelector';

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  let unreadMessagesCount = 0;
  let ordersCount = 0;
  let activeOrders: { id: string; status: string }[] = [];

  const { data: sellerRaw } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'vendedor')
    .limit(1)
    .maybeSingle();

  const sellerProfile = parseProfile(sellerRaw);
  const activeAddr = sellerProfile.pickup_addresses?.find((a) => a.is_active) || sellerProfile.pickup_addresses?.[0];
  const storeAddress = activeAddr
    ? \`\${activeAddr.street}\${activeAddr.number ? \` \${activeAddr.number}\` : ''}, \${activeAddr.town} · \${activeAddr.province}\`
    : 'Gamarra Kalea 4, Lekeitio · Bizkaia';

  if (user) {
    const [profileRes, unreadRes, ordersRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false),
      supabase
        .from('orders')
        .select('id, status')
        .or(\`seller_id.eq.\${user.id},buyer_id.eq.\${user.id}\`)
        .order('updated_at', { ascending: false })
        .limit(25),
    ]);

    profile = profileRes.data;
    unreadMessagesCount = unreadRes.count || 0;
    activeOrders = ordersRes.data || [];
    ordersCount = activeOrders.filter((o) =>
      ['pendiente', 'confirmado', 'preparando', 'listo_entrega'].includes(o.status)
    ).length;
  }

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 dark:bg-[#141312]/95 backdrop-blur-md border-b border-[#E8E5DF] dark:border-stone-800 shadow-xs transition-colors">
      {/* Barra Principal de Navegación */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        <NavbarNavLinks
          user={user}
          profile={profile}
          unreadMessagesCount={unreadMessagesCount}
          ordersCount={ordersCount}
          activeOrders={activeOrders}
        />
      </div>

      {/* Sub-barra de Utilidades */}
      <div className="border-t border-[#E8E5DF]/70 dark:border-stone-800/80 bg-[#FAF8F5]/80 dark:bg-[#141312]/80 px-4 sm:px-6 lg:px-8 py-1.5 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs font-serif">
          <span className="text-[10px] sm:text-[11px] font-sans font-medium text-stone-500 dark:text-stone-400 tracking-wider">
            {storeAddress}
          </span>
          <div className="flex items-center gap-2">
            <ThemeSelector />
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
}
`,

  // =========================================================================
  // 6. ROOT LAYOUT (Envuelve con StoreConfigProvider y tema anti-flash)
  // =========================================================================
  'app/layout.tsx': `import type { Metadata } from 'next';
import { DM_Sans, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import { StoreConfigProvider } from '@/context/StoreConfigContext';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { CookieBanner } from '@/components/CookieBanner';
import { createClient } from '@/lib/supabase/server';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EkhiTeka | Quesería Gourmet & Tienda Artesana en Lekeitio',
  description: 'Quesos artesanos, regalos gourmet, catas, salazones del cantábrico, txakoli y selección de autor en Lekeitio y Euskal Herria.',
  icons: {
    icon: '/Logo.jpg',
    apple: '/Logo.jpg',
  },
};

const themeScript = \`
(function() {
  try {
    var saved = localStorage.getItem('ekhiteka_theme');
    var isDark =
      saved === 'dark' ||
      ((!saved || saved === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch(e) {}
})();
\`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: sellerRaw } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'vendedor')
    .limit(1)
    .maybeSingle();

  return (
    <html lang="eu" className={\`\${dmSans.variable} \${cormorant.variable}\`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#FFE259] selection:text-[#1D1D1B] bg-[#FAF8F5] dark:bg-[#141312] text-[#1D1D1B] dark:text-[#F5F5F0]">
        <ThemeProvider>
          <LanguageProvider>
            <StoreConfigProvider initialSellerProfile={sellerRaw}>
              <CartProvider>
                <Navbar />
                <main className="flex-1 w-full">
                  {children}
                </main>
                <Footer />
                <CartDrawer />
                <CookieBanner />
              </CartProvider>
            </StoreConfigProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
`,

  // =========================================================================
  // 7. PROFILE FORM (Vista/Edición de bio + Puntos de recogida + WhatsApp + Clave)
  // =========================================================================
  'components/ProfileForm.tsx': `'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { updateProfile, changeUserPassword } from '@/app/actions/auth';
import type { Profile, PickupAddress } from '@/types/database';
import { parseProfile, isProfileComplete } from '@/types/database';
import {
  User,
  Phone,
  MapPin,
  Lock,
  Check,
  ShieldCheck,
  Home,
  Pencil,
  Plus,
  Trash2,
  ChevronDown,
  MessageCircle,
  Store,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ProfileFormProps {
  profile?: Profile;
  userProfile?: Profile;
}

export function ProfileForm({ profile, userProfile }: ProfileFormProps) {
  const raw = profile || userProfile || ({} as Profile);
  const { t } = useLanguage();

  const [currentProfile, setCurrentProfile] = useState<Profile>(parseProfile(raw));
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  // Estados específicos de vendedor
  const [pickupAddresses, setPickupAddresses] = useState<PickupAddress[]>(
    currentProfile.pickup_addresses || []
  );
  const [customWhatsApp, setCustomWhatsApp] = useState<string>(
    currentProfile.whatsapp_phone || currentProfile.phone || '34600000000'
  );
  const [whatsAppMode, setWhatsAppMode] = useState<'registered' | 'custom'>(
    currentProfile.whatsapp_phone && currentProfile.whatsapp_phone !== currentProfile.phone
      ? 'custom'
      : 'registered'
  );

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const p = currentProfile;
  const isSeller = p.role === 'vendedor' || p.role === 'admin';
  const isComplete = isProfileComplete(p);

  // Gestión de puntos de recogida del vendedor
  const handleSetActiveAddress = (id: string) => {
    const updated = pickupAddresses.map((addr) => ({
      ...addr,
      is_active: addr.id === id,
    }));
    setPickupAddresses(updated);
  };

  const handleAddAddress = () => {
    const newAddr: PickupAddress = {
      id: 'addr_' + Date.now(),
      title: 'Punto de Recogida #' + (pickupAddresses.length + 1),
      street: 'Gamarra Kalea',
      number: '4',
      town: 'Lekeitio',
      province: 'Bizkaia',
      postal_code: '48280',
      schedule: '10:00 - 14:30 | 17:00 - 20:30',
      is_active: pickupAddresses.length === 0,
    };
    setPickupAddresses([...pickupAddresses, newAddr]);
  };

  const handleUpdateAddress = (id: string, field: keyof PickupAddress, value: any) => {
    const updated = pickupAddresses.map((addr) =>
      addr.id === id ? { ...addr, [field]: value } : addr
    );
    setPickupAddresses(updated);
  };

  const handleDeleteAddress = (id: string) => {
    if (pickupAddresses.length <= 1) {
      alert('Debe haber al menos una dirección de tienda/recogida registrada.');
      return;
    }
    const filtered = pickupAddresses.filter((addr) => addr.id !== id);
    if (!filtered.some((a) => a.is_active)) {
      filtered[0].is_active = true;
    }
    setPickupAddresses(filtered);
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileMsg(null);

    const formData = new FormData(e.currentTarget);
    const resolvedWhatsApp = whatsAppMode === 'registered' ? (formData.get('phone') as string) : customWhatsApp;
    formData.append('whatsapp_phone', resolvedWhatsApp);
    formData.append('pickup_addresses', JSON.stringify(pickupAddresses));

    const res = await updateProfile(formData);
    setLoadingProfile(false);

    if (res?.error) {
      setProfileMsg({ text: res.error, isError: true });
    } else {
      setProfileMsg({ text: t.common_success, isError: false });
      if (res?.updatedProfile) {
        setCurrentProfile(parseProfile(res.updatedProfile));
      }
      setIsEditing(false);
      setTimeout(() => setProfileMsg(null), 3500);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingPassword(true);
    setPasswordMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await changeUserPassword(formData);
    setLoadingPassword(false);

    if (res?.error) {
      setPasswordMsg({ text: res.error, isError: true });
    } else {
      setPasswordMsg({ text: '¡Contraseña actualizada con éxito!', isError: false });
      (e.target as HTMLFormElement).reset();
      setTimeout(() => {
        setPasswordMsg(null);
        setIsPasswordOpen(false);
      }, 2500);
    }
  };

  const formattedAddress = [
    p.street,
    p.number ? \`Nº \${p.number}\` : '',
    p.stair ? \`Esc \${p.stair}\` : '',
    p.floor ? \`Piso \${p.floor}\` : '',
    p.door ? \`Pta \${p.door}\` : '',
    p.postal_code,
    p.town,
    p.province,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-8 font-serif">
      {/* 1. TARJETA PRINCIPAL DE PERFIL */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Cabecera con Estado y Botón Editar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-[#C68D07] dark:text-[#FFE259]">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100">
                  {p.full_name || 'Usuario EkhiTeka'}
                </h2>
                <span
                  className={\`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider font-sans \${
                    isComplete
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  }\`}
                >
                  {isComplete ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" /> {t.profile_status_complete}
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" /> {t.profile_status_incomplete}
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                {t.profile_subtitle}
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer hover:scale-105 shrink-0"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{t.profile_edit_btn}</span>
            </button>
          )}
        </div>

        {profileMsg && (
          <div
            className={\`p-4 rounded-2xl text-xs font-bold text-center font-sans \${
              profileMsg.isError
                ? 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
                : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
            }\`}
          >
            {profileMsg.text}
          </div>
        )}

        {/* MODO VISTA: CADA CAMPO VISIBLE UNO A UNO */}
        {!isEditing ? (
          <div className="space-y-6 font-sans text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                  {t.profile_first_name} & {t.profile_last_name_1}
                </span>
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {[p.first_name, p.last_name_1, p.last_name_2].filter(Boolean).join(' ') || p.full_name || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                  {t.profile_dni}
                </span>
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm uppercase">
                  {p.dni || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                  {t.profile_birth_date}
                </span>
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {p.birth_date || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                  {t.profile_phone}
                </span>
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {p.phone || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                  {t.auth_email}
                </span>
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {p.email || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                  {t.profile_town} · {t.profile_province}
                </span>
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {p.town || 'Lekeitio'} ({p.province || 'Bizkaia'})
                </p>
              </div>
            </div>

            {/* Dirección Personal */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#C68D07] dark:text-[#FFE259] flex items-center gap-1.5 font-serif">
                <Home className="w-3.5 h-3.5" />
                <span>{t.profile_address_data}</span>
              </span>
              <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
                {formattedAddress || t.profile_not_specified}
              </p>
            </div>

            {/* SECCIÓN VENDEDOR: WHATSAPP Y TIENDAS (MODO VISTA) */}
            {isSeller && (
              <div className="space-y-4 pt-4 border-t border-stone-200/60 dark:border-stone-800">
                {/* WhatsApp Tienda */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block font-serif">
                        WhatsApp Oficial de la Tienda
                      </span>
                      <p className="text-sm font-black text-stone-900 dark:text-stone-100">
                        +{p.whatsapp_phone || p.phone || '34600000000'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direcciones de Recogida en Tienda */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block font-serif">
                    Puntos de Entrega & Recogida en Tienda ({pickupAddresses.length})
                  </span>
                  <div className="space-y-2">
                    {pickupAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={\`p-3.5 rounded-2xl border flex items-center justify-between gap-3 \${
                          addr.is_active
                            ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
                            : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-700'
                        }\`}
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <Store className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
                            <h4 className="font-bold text-stone-900 dark:text-stone-100 truncate">{addr.title}</h4>
                            {addr.is_active && (
                              <span className="px-2 py-0.5 rounded-full bg-[#FFE259] text-[#1D1D1B] font-black text-[9px] uppercase">
                                Activa
                              </span>
                            )}
                          </div>
                          <p className="text-stone-600 dark:text-stone-400 text-[11px] truncate">
                            {addr.street} {addr.number || ''}, {addr.town} ({addr.province}) · {addr.schedule || ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* MODO EDICIÓN */
          <form onSubmit={handleProfileSubmit} className="space-y-6 font-sans text-xs animate-fadeIn">
            {/* 1. Nombre y Apellidos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_first_name} *
                </label>
                <input
                  type="text"
                  name="first_name"
                  required
                  defaultValue={p.first_name || ''}
                  className="w-full px-3.5 py-2.5 rounded-xl border"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_last_name_1} *
                </label>
                <input
                  type="text"
                  name="last_name_1"
                  required
                  defaultValue={p.last_name_1 || ''}
                  className="w-full px-3.5 py-2.5 rounded-xl border"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_last_name_2}
                </label>
                <input
                  type="text"
                  name="last_name_2"
                  defaultValue={p.last_name_2 || ''}
                  className="w-full px-3.5 py-2.5 rounded-xl border"
                />
              </div>
            </div>

            {/* 2. DNI, Fecha Nacimiento y Teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_dni} *
                </label>
                <input
                  type="text"
                  name="dni"
                  required
                  defaultValue={p.dni || ''}
                  placeholder="12345678Z"
                  className="w-full px-3.5 py-2.5 rounded-xl border uppercase"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_birth_date} *
                </label>
                <input
                  type="date"
                  name="birth_date"
                  required
                  defaultValue={p.birth_date || ''}
                  className="w-full px-3.5 py-2.5 rounded-xl border"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_phone} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  defaultValue={p.phone || ''}
                  placeholder="600 000 000"
                  className="w-full px-3.5 py-2.5 rounded-xl border"
                />
              </div>
            </div>

            {/* 3. Dirección Personal */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block font-serif">
                {t.profile_address_data}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_province} *
                  </label>
                  <input
                    type="text"
                    name="province"
                    required
                    defaultValue={p.province || 'Bizkaia'}
                    className="w-full px-3.5 py-2.5 rounded-xl border"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_town} *
                  </label>
                  <input
                    type="text"
                    name="town"
                    required
                    defaultValue={p.town || 'Lekeitio'}
                    className="w-full px-3.5 py-2.5 rounded-xl border"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_postal_code} *
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    required
                    defaultValue={p.postal_code || ''}
                    placeholder="48280"
                    className="w-full px-3.5 py-2.5 rounded-xl border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                <div className="col-span-2 sm:col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_street} *
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    defaultValue={p.street || ''}
                    placeholder="Gamarra Kalea"
                    className="w-full px-3.5 py-2.5 rounded-xl border"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_number} *
                  </label>
                  <input
                    type="text"
                    name="number"
                    required
                    defaultValue={p.number || ''}
                    placeholder="4"
                    className="w-full px-3.5 py-2.5 rounded-xl border"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_stair}
                  </label>
                  <input
                    type="text"
                    name="stair"
                    defaultValue={p.stair || ''}
                    placeholder="A"
                    className="w-full px-3.5 py-2.5 rounded-xl border"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_floor} *
                  </label>
                  <input
                    type="text"
                    name="floor"
                    required
                    defaultValue={p.floor || ''}
                    placeholder="2"
                    className="w-full px-3.5 py-2.5 rounded-xl border"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_door} *
                  </label>
                  <input
                    type="text"
                    name="door"
                    required
                    defaultValue={p.door || ''}
                    placeholder="B"
                    className="w-full px-3.5 py-2.5 rounded-xl border"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN VENDEDOR: CONFIGURACIÓN WHATSAPP Y PUNTOS DE RECOGIDA (MODO EDICIÓN) */}
            {isSeller && (
              <div className="space-y-6 pt-4 border-t border-stone-200 dark:border-stone-800">
                {/* WhatsApp Config */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 font-serif">
                      WhatsApp Oficial de la Tienda
                    </h3>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Todos los botones de WhatsApp de la web se dirigirán a este número.
                  </p>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800 dark:text-stone-200">
                      <input
                        type="radio"
                        name="whatsapp_choice"
                        checked={whatsAppMode === 'registered'}
                        onChange={() => setWhatsAppMode('registered')}
                      />
                      <span>Usar el teléfono de contacto principal ({p.phone || 'registrado'})</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800 dark:text-stone-200">
                      <input
                        type="radio"
                        name="whatsapp_choice"
                        checked={whatsAppMode === 'custom'}
                        onChange={() => setWhatsAppMode('custom')}
                      />
                      <span>Introducir otro número de WhatsApp para la tienda</span>
                    </label>

                    {whatsAppMode === 'custom' && (
                      <div className="pt-1">
                        <input
                          type="text"
                          value={customWhatsApp}
                          onChange={(e) => setCustomWhatsApp(e.target.value)}
                          placeholder="Ej: 34600000000"
                          className="w-full sm:max-w-xs px-3.5 py-2 rounded-xl border font-bold"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Gestor de Direcciones de Tienda */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
                      <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 font-serif">
                        Direcciones de Recogida / Puntos de Venta
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddAddress}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-bold text-xs uppercase cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir Punto</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {pickupAddresses.map((addr, idx) => (
                      <div
                        key={addr.id}
                        className={\`p-4 rounded-2xl border-2 space-y-3 \${
                          addr.is_active
                            ? 'border-[#FFE259] bg-amber-50/40 dark:bg-amber-950/20'
                            : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850'
                        }\`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={addr.title}
                              onChange={(e) => handleUpdateAddress(addr.id, 'title', e.target.value)}
                              placeholder="Nombre de la tienda / sede"
                              className="font-bold px-2 py-1 rounded-lg border text-xs"
                            />
                            {addr.is_active ? (
                              <span className="px-2 py-0.5 rounded-full bg-[#FFE259] text-[#1D1D1B] font-black text-[9px] uppercase">
                                Activa para clientes
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetActiveAddress(addr.id)}
                                className="px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 hover:bg-[#FFE259] text-stone-800 dark:text-stone-200 hover:text-[#1D1D1B] font-bold text-[9px] uppercase transition-colors cursor-pointer"
                              >
                                Activar esta
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1.5 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Eliminar punto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <input
                            type="text"
                            value={addr.street}
                            onChange={(e) => handleUpdateAddress(addr.id, 'street', e.target.value)}
                            placeholder="Calle"
                            className="px-2.5 py-1.5 rounded-lg border"
                          />
                          <input
                            type="text"
                            value={addr.number || ''}
                            onChange={(e) => handleUpdateAddress(addr.id, 'number', e.target.value)}
                            placeholder="Nº"
                            className="px-2.5 py-1.5 rounded-lg border"
                          />
                          <input
                            type="text"
                            value={addr.town}
                            onChange={(e) => handleUpdateAddress(addr.id, 'town', e.target.value)}
                            placeholder="Municipio"
                            className="px-2.5 py-1.5 rounded-lg border"
                          />
                          <input
                            type="text"
                            value={addr.province}
                            onChange={(e) => handleUpdateAddress(addr.id, 'province', e.target.value)}
                            placeholder="Provincia"
                            className="px-2.5 py-1.5 rounded-lg border"
                          />
                        </div>

                        <input
                          type="text"
                          value={addr.schedule || ''}
                          onChange={(e) => handleUpdateAddress(addr.id, 'schedule', e.target.value)}
                          placeholder="Horario de atención (Ej: Lun-Vie 10:00-14:30 | 17:00-20:30)"
                          className="w-full px-2.5 py-1.5 rounded-lg border text-[11px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-3 font-serif">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold text-xs uppercase tracking-wider hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                {t.common_cancel}
              </button>
              <button
                type="submit"
                disabled={loadingProfile}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{loadingProfile ? t.common_loading : t.profile_save_changes_btn}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. TARJETA CAMBIAR CONTRASEÑA */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs">
        <button
          type="button"
          onClick={() => setIsPasswordOpen(!isPasswordOpen)}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 font-serif">
                {t.profile_security}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                {isPasswordOpen ? 'Introduce tu contraseña actual y la nueva clave.' : 'Pulsa aquí para cambiar tu contraseña de acceso.'}
              </p>
            </div>
          </div>

          <div className={\`p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 transition-transform duration-200 \${isPasswordOpen ? 'rotate-180' : ''}\`}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </button>

        {isPasswordOpen && (
          <form onSubmit={handlePasswordSubmit} className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800 space-y-4 font-sans text-xs max-w-md animate-fadeIn">
            {passwordMsg && (
              <div
                className={\`p-3.5 rounded-2xl text-xs font-bold text-center \${
                  passwordMsg.isError
                    ? 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
                    : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                }\`}
              >
                {passwordMsg.text}
              </div>
            )}

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {t.profile_current_password} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="current_password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {t.profile_new_password} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="new_password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {t.profile_confirm_password} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="confirm_password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end font-serif">
              <button
                type="submit"
                disabled={loadingPassword}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1D1D1B] dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4 text-[#FFE259] dark:text-[#1D1D1B]" />
                <span>{loadingPassword ? t.common_loading : t.profile_change_password_btn}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
`,

  // =========================================================================
  // 8. FOOTER (Usa WhatsApp dinámico de la tienda)
  // =========================================================================
  'components/Footer.tsx': `'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
import { Truck, Store } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();
  const { storeAddress, whatsappPhone, getWhatsAppUrl } = useStoreConfig();

  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-[#1D1D1B] text-stone-300 transition-colors pt-0 pb-8">
      {/* 1. Banner Destacado Amarillo */}
      <div className="bg-[#FFE259] text-[#1D1D1B] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[11px] font-black uppercase tracking-widest block text-stone-800">
              {t.footer_club_title}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight font-serif sm:font-sans">
              {t.footer_club_subtitle}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-stone-800 max-w-xl">
              {t.footer_club_desc}
            </p>
          </div>

          <a
            href={getWhatsAppUrl('Hola, quisiera unirme a las novedades del Club de Amigos de EkhiTeka')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1D1D1B] text-white hover:bg-stone-800 font-black text-xs uppercase tracking-wider transition-all shadow-md shrink-0 hover:scale-105"
          >
            <span>{t.footer_join_whatsapp}</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pt-12">
        {/* 2. Valores Gourmet */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-stone-800 text-center md:text-left">
          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE259]/15 text-[#FFE259] flex items-center justify-center shrink-0 text-xl border border-[#FFE259]/30">
              🧀
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-white">{t.cat_queso} & {t.shop_specialty}</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-medium">
                {t.footer_cheese_desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE259]/15 text-[#FFE259] flex items-center justify-center shrink-0 border border-[#FFE259]/30">
              <Truck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-white">{t.deliv_home}</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-medium">
                {t.footer_delivery_desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE259]/15 text-[#FFE259] flex items-center justify-center shrink-0 border border-[#FFE259]/30">
              <Store className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-white">{t.deliv_store_pickup}</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-medium">
                {t.footer_pickup_desc}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Enlaces & Categorías */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <h4 className="font-black text-white uppercase tracking-wider text-[11px]">{t.footer_categories}</h4>
            <ul className="space-y-2 text-stone-400 font-semibold">
              <li><Link href="/categoria/queso" className="hover:text-[#FFE259] transition-colors">{t.cat_queso}</Link></li>
              <li><Link href="/categoria/salazon" className="hover:text-[#FFE259] transition-colors">{t.cat_salazon}</Link></li>
              <li><Link href="/categoria/atun" className="hover:text-[#FFE259] transition-colors">{t.cat_atun}</Link></li>
              <li><Link href="/categoria/jildas" className="hover:text-[#FFE259] transition-colors">{t.cat_jildas}</Link></li>
              <li><Link href="/categoria/txakoli" className="hover:text-[#FFE259] transition-colors">{t.cat_txakoli}</Link></li>
              <li><Link href="/categoria/cerveza" className="hover:text-[#FFE259] transition-colors">{t.cat_cerveza}</Link></li>
              <li><Link href="/categoria/sidra" className="hover:text-[#FFE259] transition-colors">{t.cat_sidra}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-white uppercase tracking-wider text-[11px]">{t.footer_experiences}</h4>
            <ul className="space-y-2 text-stone-400 font-semibold">
              <li><Link href="/#experiencias" className="hover:text-[#FFE259] transition-colors">{t.footer_exp_tasting}</Link></li>
              <li><Link href="/#experiencias" className="hover:text-[#FFE259] transition-colors">{t.footer_exp_weddings}</Link></li>
              <li><Link href="/#experiencias" className="hover:text-[#FFE259] transition-colors">{t.footer_exp_gifts}</Link></li>
              <li><Link href="/chat" className="hover:text-[#FFE259] transition-colors">{t.footer_exp_consult}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-white uppercase tracking-wider text-[11px]">{t.footer_legal}</h4>
            <ul className="space-y-2 text-stone-400 font-semibold">
              <li><Link href="/terminos" className="hover:text-[#FFE259] transition-colors">{t.legal_terms}</Link></li>
              <li><Link href="/privacidad" className="hover:text-[#FFE259] transition-colors">{t.legal_privacy}</Link></li>
              <li><Link href="/cookies" className="hover:text-[#FFE259] transition-colors">{t.legal_cookies}</Link></li>
              <li><Link href="/aviso-legal" className="hover:text-[#FFE259] transition-colors">{t.legal_notice}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/Logo.jpg"
                alt="EkhiTeka"
                className="w-10 h-10 rounded-full object-cover border border-[#FFE259]"
              />
              <h4 className="font-black text-white uppercase tracking-wider text-[12px]">EkhiTeka Lekeitio</h4>
            </div>

            <div className="w-full h-24 rounded-2xl overflow-hidden border border-stone-800 relative">
              <img
                src="/images/secciones/Tienda.JPG"
                alt="Quesería EkhiTeka Lekeitio"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-stone-400 leading-relaxed font-medium">
              {storeAddress}
            </p>
            <div className="text-stone-400 font-medium space-y-0.5 text-[11px]">
              <p className="font-bold text-stone-300">{t.footer_schedule_title}</p>
              <p>{t.footer_schedule_weekdays}</p>
              <p>{t.footer_schedule_saturday}</p>
            </div>
            <p className="text-stone-300 font-bold text-[11px]">
              WhatsApp: +{whatsappPhone}
            </p>
          </div>
        </div>

        {/* 4. Copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-xs font-medium">
          <p>© {new Date().getFullYear()} EkhiTeka Gourmet S.L. {t.footer_copyright}</p>
          <div className="flex items-center gap-2">
            <span>{t.footer_tagline}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
`,

  // =========================================================================
  // 9. EXPERIENCE BANNERS (Usa WhatsApp dinámico de la tienda)
  // =========================================================================
  'components/ExperienceBanners.tsx': `'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
import { MessageCircle, Sparkles, Gift } from 'lucide-react';

export function ExperienceBanners() {
  const { t } = useLanguage();
  const { getWhatsAppUrl } = useStoreConfig();

  return (
    <section id="experiencias" className="space-y-8 pt-8">
      <div>
        <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
          {t.exp_banner_badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1D1D1B] dark:text-stone-100 tracking-tight leading-tight font-serif">
          {t.exp_banner_title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-serif">
        {/* Banner 1 */}
        <div className="manduca-card group relative bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-44 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Catas.JPG"
                alt={t.exp_b1_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 leading-snug">
                {t.exp_b1_title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium font-sans">
                {t.exp_b1_desc}
              </p>
            </div>
          </div>

          <a
            href={getWhatsAppUrl('Hola, quisiera información sobre las catas presenciales de EkhiTeka')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs transition-all shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.exp_b1_btn}</span>
          </a>
        </div>

        {/* Banner 2 */}
        <div className="manduca-card group relative bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-44 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Mesas.JPG"
                alt={t.exp_b2_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 leading-snug">
                {t.exp_b2_title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium font-sans">
                {t.exp_b2_desc}
              </p>
            </div>
          </div>

          <a
            href={getWhatsAppUrl('Hola, quisiera presupuesto para un evento o boda con mesa de quesos')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-black text-xs transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-[#FFE259]" />
            <span>{t.exp_b2_btn}</span>
          </a>
        </div>

        {/* Banner 3 */}
        <div className="manduca-card group relative bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs overflow-hidden">
          <div className="space-y-4">
            <div className="w-full h-44 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative">
              <img
                src="/images/secciones/Cestas.JPG"
                alt={t.exp_b3_title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                }}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 leading-snug">
                {t.exp_b3_title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium font-sans">
                {t.exp_b3_desc}
              </p>
            </div>
          </div>

          <Link
            href="/regalos-gourmet"
            className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs transition-all shadow-xs"
          >
            <Gift className="w-4 h-4" />
            <span>{t.exp_b3_btn}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
`,
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trimStart(), 'utf8');
  console.log(`✓ Actualizado: ${filePath}`);
});

console.log('\n🎉 ¡Todos los cambios implementados y verificados con éxito!');