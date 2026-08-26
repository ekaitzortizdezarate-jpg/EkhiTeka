const fs = require('fs');
const path = require('path');

function saveFile(relativeFilePath, content) {
  const fullPath = path.join(process.cwd(), relativeFilePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content.trimStart(), 'utf8');
  console.log(`✓ Archivo actualizado: ${relativeFilePath}`);
}

// 1. types/database.ts
saveFile('types/database.ts', `
export type Role = 'comprador' | 'vendedor' | 'admin';

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

export interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  seller_id?: string | null;
  is_active: boolean;
}

export interface StoreAddress {
  id: string;
  title: string;
  street: string;
  number?: string;
  stair?: string;
  floor?: string;
  door?: string;
  postal_code?: string;
  town: string;
  province: string;
  schedule?: string;
  is_active: boolean;
}

export interface EventAddress {
  id: string;
  title: string;
  street: string;
  number?: string;
  stair?: string;
  floor?: string;
  door?: string;
  postal_code?: string;
  town: string;
  province: string;
  notes?: string;
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
  whatsapp_contacts?: WhatsAppContact[];
  pickup_addresses?: StoreAddress[];
  event_addresses?: EventAddress[];
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
      whatsapp_contacts: [],
      pickup_addresses: [],
      event_addresses: [],
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
    province: details.province || raw.province || '',
    town: details.town || raw.town || '',
    postal_code: details.postal_code || raw.postal_code || '',
    street: details.street || raw.street || '',
    number: details.number || raw.number || '',
    stair: details.stair || raw.stair || '',
    floor: details.floor || raw.floor || '',
    door: details.door || raw.door || '',
    whatsapp_phone: details.whatsapp_phone || raw.phone || null,
    whatsapp_contacts: details.whatsapp_contacts || [],
    pickup_addresses: details.pickup_addresses || [],
    event_addresses: details.event_addresses || [],
  };
}

export function isProfileComplete(raw?: any): boolean {
  if (!raw) return false;
  const p = parseProfile(raw);
  const isSeller = p.role === 'vendedor' || p.role === 'admin';

  const userKeys: (keyof ProfileDetails)[] = [
    'first_name',
    'last_name_1',
    'birth_date',
    'dni',
    'phone',
  ];

  const addressKeys: (keyof ProfileDetails)[] = [
    'province',
    'town',
    'postal_code',
    'street',
    'number',
    'floor',
    'door',
  ];

  // La dirección NO es obligatoria para usuarios vendedores
  const requiredKeys = isSeller ? userKeys : [...userKeys, ...addressKeys];

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
  pickup_address_ids?: string[];
  event_address_id?: string | null;
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
`);

// 2. context/StoreConfigContext.tsx
saveFile('context/StoreConfigContext.tsx', `
'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { Profile, StoreAddress, EventAddress, WhatsAppContact } from '@/types/database';
import { parseProfile } from '@/types/database';

interface StoreConfigContextType {
  hasActiveWhatsApp: boolean;
  whatsappPhone: string | null;
  activeWhatsAppContact: WhatsAppContact | null;
  storeAddress: string;
  pickupAddresses: StoreAddress[];
  activePickupAddresses: StoreAddress[];
  eventAddresses: EventAddress[];
  activeEventAddresses: EventAddress[];
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

  const activeWhatsAppContact = useMemo(() => {
    const contacts = seller.whatsapp_contacts || [];
    return contacts.find((c) => c.is_active) || null;
  }, [seller]);

  const hasActiveWhatsApp = Boolean(activeWhatsAppContact && activeWhatsAppContact.phone && activeWhatsAppContact.phone.trim().length > 0);

  const whatsappPhone = useMemo(() => {
    if (!activeWhatsAppContact) return null;
    return activeWhatsAppContact.phone.replace(/[^0-9]/g, '');
  }, [activeWhatsAppContact]);

  const pickupAddresses = useMemo(() => seller.pickup_addresses || [], [seller]);
  const activePickupAddresses = useMemo(() => pickupAddresses.filter((a) => a.is_active), [pickupAddresses]);

  const eventAddresses = useMemo(() => seller.event_addresses || [], [seller]);
  const activeEventAddresses = useMemo(() => eventAddresses.filter((a) => a.is_active), [eventAddresses]);

  const storeAddress = useMemo(() => {
    const firstActive = activePickupAddresses[0];
    if (firstActive) {
      return \`\${firstActive.street}\${firstActive.number ? ' ' + firstActive.number : ''}, \${firstActive.town} · \${firstActive.province}\`;
    }
    return 'Gamarra Kalea 4, Lekeitio · Bizkaia';
  }, [activePickupAddresses]);

  const getWhatsAppUrl = useMemo(() => {
    return (message?: string) => {
      if (!hasActiveWhatsApp || !whatsappPhone) return '';
      const cleanNumber = whatsappPhone.startsWith('34') || whatsappPhone.length > 10 ? whatsappPhone : \`34\${whatsappPhone}\`;
      const encodedMsg = message ? encodeURIComponent(message) : '';
      return \`https://wa.me/\${cleanNumber}\${encodedMsg ? '?text=' + encodedMsg : ''}\`;
    };
  }, [hasActiveWhatsApp, whatsappPhone]);

  return (
    <StoreConfigContext.Provider
      value={{
        hasActiveWhatsApp,
        whatsappPhone,
        activeWhatsAppContact,
        storeAddress,
        pickupAddresses,
        activePickupAddresses,
        eventAddresses,
        activeEventAddresses,
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
      hasActiveWhatsApp: false,
      whatsappPhone: null,
      activeWhatsAppContact: null,
      storeAddress: 'Gamarra Kalea 4, Lekeitio · Bizkaia',
      pickupAddresses: [],
      activePickupAddresses: [],
      eventAddresses: [],
      activeEventAddresses: [],
      getWhatsAppUrl: () => '',
    };
  }
  return context;
}
`);

// 3. app/actions/auth.ts
saveFile('app/actions/auth.ts', `
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { ProfileDetails, WhatsAppContact, StoreAddress, EventAddress } from '@/types/database';
import { parseProfile } from '@/types/database';

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

  const { data: currentProfileRaw } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const currentParsed = parseProfile(currentProfileRaw);

  const firstName = (formData.get('first_name') as string)?.trim() || '';
  const lastName1 = (formData.get('last_name_1') as string)?.trim() || '';
  const lastName2 = (formData.get('last_name_2') as string)?.trim() || '';
  const birthDate = (formData.get('birth_date') as string)?.trim() || '';
  const dni = (formData.get('dni') as string)?.trim()?.toUpperCase() || '';
  const phone = (formData.get('phone') as string)?.trim() || '';
  const province = (formData.get('province') as string)?.trim() || '';
  const town = (formData.get('town') as string)?.trim() || '';
  const postalCode = (formData.get('postal_code') as string)?.trim() || '';
  const street = (formData.get('street') as string)?.trim() || '';
  const number = (formData.get('number') as string)?.trim() || '';
  const stair = (formData.get('stair') as string)?.trim() || '';
  const floor = (formData.get('floor') as string)?.trim() || '';
  const door = (formData.get('door') as string)?.trim() || '';

  const fullNameInput = (formData.get('full_name') as string)?.trim() || '';
  const fullName = [firstName, lastName1, lastName2].filter(Boolean).join(' ') || fullNameInput || currentParsed.full_name || 'Usuario EkhiTeka';

  const formattedAddress = [
    street,
    number ? \`Nº \${number}\` : '',
    stair ? \`Esc \${stair}\` : '',
    floor ? \`Piso \${floor}\` : '',
    door ? \`Pta \${door}\` : '',
    postalCode,
    town,
    province,
  ]
    .filter(Boolean)
    .join(', ');

  const profileData: ProfileDetails = {
    first_name: firstName,
    last_name_1: lastName1,
    last_name_2: lastName2,
    birth_date: birthDate,
    dni,
    phone,
    province,
    town,
    postal_code: postalCode,
    street,
    number,
    stair,
    floor,
    door,
    whatsapp_phone: currentParsed.whatsapp_phone,
    whatsapp_contacts: currentParsed.whatsapp_contacts,
    pickup_addresses: currentParsed.pickup_addresses,
    event_addresses: currentParsed.event_addresses,
  };

  const structuredBio = JSON.stringify(profileData);

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone,
      town,
      address: formattedAddress,
      bio: structuredBio,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/perfil');
  revalidatePath('/', 'layout');
  return {
    success: true,
    updatedProfile: {
      ...profileData,
      id: user.id,
      role: currentParsed.role,
      full_name: fullName,
      email: user.email,
      address: formattedAddress,
      bio: structuredBio,
    },
  };
}

export async function updateStoreConfig(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'No autenticado' };

  const { data: currentProf } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (currentProf?.role !== 'vendedor' && currentProf?.role !== 'admin') {
    return { error: 'Permisos insuficientes para editar los datos de la tienda.' };
  }

  const rawContacts = formData.get('whatsapp_contacts') as string;
  const rawPickup = formData.get('pickup_addresses') as string;
  const rawEvents = formData.get('event_addresses') as string;

  const whatsappContacts: WhatsAppContact[] = rawContacts ? JSON.parse(rawContacts) : [];
  const pickupAddresses: StoreAddress[] = rawPickup ? JSON.parse(rawPickup) : [];
  const eventAddresses: EventAddress[] = rawEvents ? JSON.parse(rawEvents) : [];

  const activeWA = whatsappContacts.find((c) => c.is_active);
  const whatsappPhone = activeWA ? activeWA.phone.replace(/[^0-9]/g, '') : null;

  // Obtener todos los perfiles de vendedores/admins para sincronizar los datos de tienda
  const { data: allSellers } = await supabase
    .from('profiles')
    .select('id, bio')
    .in('role', ['vendedor', 'admin']);

  if (allSellers) {
    for (const seller of allSellers) {
      const sellerParsed = parseProfile(seller);
      const updatedDetails: ProfileDetails = {
        first_name: sellerParsed.first_name,
        last_name_1: sellerParsed.last_name_1,
        last_name_2: sellerParsed.last_name_2,
        birth_date: sellerParsed.birth_date,
        dni: sellerParsed.dni,
        phone: sellerParsed.phone,
        province: sellerParsed.province,
        town: sellerParsed.town,
        postal_code: sellerParsed.postal_code,
        street: sellerParsed.street,
        number: sellerParsed.number,
        stair: sellerParsed.stair,
        floor: sellerParsed.floor,
        door: sellerParsed.door,
        whatsapp_phone: whatsappPhone,
        whatsapp_contacts: whatsappContacts,
        pickup_addresses: pickupAddresses,
        event_addresses: eventAddresses,
      };

      await supabase
        .from('profiles')
        .update({
          bio: JSON.stringify(updatedDetails),
          updated_at: new Date().toISOString(),
        })
        .eq('id', seller.id);
    }
  }

  revalidatePath('/', 'layout');
  revalidatePath('/perfil');
  revalidatePath('/tienda');
  revalidatePath('/experiencias');
  return { success: true };
}

export async function changeUserPassword(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { error: 'No autenticado. Por favor inicia sesión.' };
  }

  const currentPassword = (formData.get('current_password') as string) || '';
  const newPassword = (formData.get('new_password') as string) || '';
  const confirmPassword = (formData.get('confirm_password') as string) || '';

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'Por favor, completa todos los campos de contraseña.' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'La nueva contraseña y su confirmación no coinciden.' };
  }

  if (newPassword.length < 6) {
    return { error: 'La nueva contraseña debe tener al menos 6 caracteres.' };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    return { error: 'La contraseña actual no es correcta. Verifica e inténtalo de nuevo.' };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { error: \`Error al actualizar la contraseña: \${updateError.message}\` };
  }

  return { success: true };
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
`);

// 4. app/perfil/page.tsx
saveFile('app/perfil/page.tsx', `
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/ProfileForm';
import type { Profile } from '@/types/database';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [{ data: profile }, { data: sellersData }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('profiles').select('id, full_name, phone').in('role', ['vendedor', 'admin']),
  ]);

  const userProfile = (profile || {}) as Profile;
  if (user.email && !userProfile.email) {
    userProfile.email = user.email;
  }

  const sellers = (sellersData || []).map((s) => ({
    id: s.id,
    full_name: s.full_name || 'Vendedor EkhiTeka',
    phone: s.phone || '',
  }));

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 font-serif">
            Mi Perfil · Nire Profila
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Gestiona tus datos personales y los datos compartidos de la tienda.
          </p>
        </div>
      </div>

      <ProfileForm userProfile={userProfile} profile={userProfile} sellers={sellers} />
    </div>
  );
}
`);

// 5. components/ProfileForm.tsx
saveFile('components/ProfileForm.tsx', `
'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { updateProfile, changeUserPassword, updateStoreConfig } from '@/app/actions/auth';
import type { Profile, WhatsAppContact, StoreAddress, EventAddress } from '@/types/database';
import { parseProfile, isProfileComplete } from '@/types/database';
import {
  User,
  Phone,
  Lock,
  Check,
  Home,
  Pencil,
  Plus,
  Trash2,
  ChevronDown,
  MessageCircle,
  Store,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Power,
  X,
} from 'lucide-react';

interface SellerOption {
  id: string;
  full_name: string;
  phone: string;
}

interface ProfileFormProps {
  profile?: Profile;
  userProfile?: Profile;
  sellers?: SellerOption[];
}

export function ProfileForm({ profile, userProfile, sellers = [] }: ProfileFormProps) {
  const raw = profile || userProfile || ({} as Profile);
  const { t } = useLanguage();

  const [currentProfile, setCurrentProfile] = useState<Profile>(parseProfile(raw));
  const isSeller = currentProfile.role === 'vendedor' || currentProfile.role === 'admin';

  // Pestañas
  const [activeTab, setActiveTab] = useState<'usuario' | 'tienda'>('usuario');

  // Sección Usuario
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [userMsg, setUserMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Sección Tienda
  const [whatsappContacts, setWhatsappContacts] = useState<WhatsAppContact[]>(currentProfile.whatsapp_contacts || []);
  const [pickupAddresses, setPickupAddresses] = useState<StoreAddress[]>(currentProfile.pickup_addresses || []);
  const [eventAddresses, setEventAddresses] = useState<EventAddress[]>(currentProfile.event_addresses || []);
  const [loadingStore, setLoadingStore] = useState(false);
  const [storeMsg, setStoreMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Modales
  const [modalWA, setModalWA] = useState<{ open: boolean; contact: WhatsAppContact | null }>({ open: false, contact: null });
  const [modalStoreAddr, setModalStoreAddr] = useState<{ open: boolean; addr: StoreAddress | null }>({ open: false, addr: null });
  const [modalEventAddr, setModalEventAddr] = useState<{ open: boolean; addr: EventAddress | null }>({ open: false, addr: null });

  // Formulario modal WhatsApp
  const [waSelectType, setWaSelectType] = useState<'seller' | 'manual'>('seller');
  const [selectedSellerId, setSelectedSellerId] = useState<string>('');
  const [waName, setWaName] = useState('');
  const [waPhone, setWaPhone] = useState('');

  const p = currentProfile;
  const isComplete = isProfileComplete(p);

  const hasActiveWA = whatsappContacts.some((c) => c.is_active);
  const hasActivePickup = pickupAddresses.some((a) => a.is_active);
  const hasActiveEvent = eventAddresses.some((a) => a.is_active);

  // --- Sincronizar Tienda con la BD ---
  const syncStoreConfig = async (
    contacts: WhatsAppContact[],
    pickups: StoreAddress[],
    events: EventAddress[]
  ) => {
    setLoadingStore(true);
    setStoreMsg(null);
    const fd = new FormData();
    fd.append('whatsapp_contacts', JSON.stringify(contacts));
    fd.append('pickup_addresses', JSON.stringify(pickups));
    fd.append('event_addresses', JSON.stringify(events));

    const res = await updateStoreConfig(fd);
    setLoadingStore(false);
    if (res?.error) {
      setStoreMsg({ text: res.error, isError: true });
    } else {
      setStoreMsg({ text: 'Configuración de tienda actualizada correctamente.', isError: false });
      setTimeout(() => setStoreMsg(null), 3000);
    }
  };

  // --- Handlers WhatsApp (Solo 1 activo a la vez) ---
  const handleToggleActiveWA = async (contactId: string) => {
    const updated = whatsappContacts.map((c) => ({
      ...c,
      is_active: c.id === contactId ? !c.is_active : false,
    }));
    setWhatsappContacts(updated);
    await syncStoreConfig(updated, pickupAddresses, eventAddresses);
  };

  const handleOpenAddWA = () => {
    setWaSelectType('seller');
    const firstSeller = sellers[0];
    if (firstSeller) {
      setSelectedSellerId(firstSeller.id);
      setWaName(firstSeller.full_name);
      setWaPhone(firstSeller.phone);
    } else {
      setWaSelectType('manual');
      setWaName('');
      setWaPhone('');
    }
    setModalWA({ open: true, contact: null });
  };

  const handleOpenEditWA = (c: WhatsAppContact) => {
    setWaSelectType(c.seller_id ? 'seller' : 'manual');
    setSelectedSellerId(c.seller_id || '');
    setWaName(c.name);
    setWaPhone(c.phone);
    setModalWA({ open: true, contact: c });
  };

  const handleSaveWA = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated: WhatsAppContact[];
    if (modalWA.contact) {
      updated = whatsappContacts.map((c) =>
        c.id === modalWA.contact!.id
          ? { ...c, name: waName, phone: waPhone, seller_id: waSelectType === 'seller' ? selectedSellerId : null }
          : c
      );
    } else {
      const newContact: WhatsAppContact = {
        id: 'wa_' + Date.now(),
        name: waName,
        phone: waPhone,
        seller_id: waSelectType === 'seller' ? selectedSellerId : null,
        is_active: whatsappContacts.length === 0,
      };
      updated = [...whatsappContacts, newContact];
    }
    setWhatsappContacts(updated);
    setModalWA({ open: false, contact: null });
    await syncStoreConfig(updated, pickupAddresses, eventAddresses);
  };

  const handleDeleteWA = async (contactId: string) => {
    if (!confirm('¿Eliminar este contacto de WhatsApp?')) return;
    const updated = whatsappContacts.filter((c) => c.id !== contactId);
    setWhatsappContacts(updated);
    await syncStoreConfig(updated, pickupAddresses, eventAddresses);
  };

  // --- Handlers Puntos de Entrega (Múltiples activos permitidos) ---
  const handleToggleActivePickup = async (addrId: string) => {
    const updated = pickupAddresses.map((a) =>
      a.id === addrId ? { ...a, is_active: !a.is_active } : a
    );
    setPickupAddresses(updated);
    await syncStoreConfig(whatsappContacts, updated, eventAddresses);
  };

  const handleSaveStoreAddr = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const addrData: StoreAddress = {
      id: modalStoreAddr.addr?.id || 'pickup_' + Date.now(),
      title: fd.get('title') as string,
      street: fd.get('street') as string,
      number: fd.get('number') as string,
      stair: fd.get('stair') as string,
      floor: fd.get('floor') as string,
      door: fd.get('door') as string,
      postal_code: fd.get('postal_code') as string,
      town: fd.get('town') as string,
      province: fd.get('province') as string,
      schedule: fd.get('schedule') as string,
      is_active: modalStoreAddr.addr ? modalStoreAddr.addr.is_active : true,
    };

    let updated: StoreAddress[];
    if (modalStoreAddr.addr) {
      updated = pickupAddresses.map((a) => (a.id === modalStoreAddr.addr!.id ? addrData : a));
    } else {
      updated = [...pickupAddresses, addrData];
    }
    setPickupAddresses(updated);
    setModalStoreAddr({ open: false, addr: null });
    await syncStoreConfig(whatsappContacts, updated, eventAddresses);
  };

  const handleDeletePickup = async (addrId: string) => {
    if (!confirm('¿Eliminar esta dirección de entrega/tienda?')) return;
    const updated = pickupAddresses.filter((a) => a.id !== addrId);
    setPickupAddresses(updated);
    await syncStoreConfig(whatsappContacts, updated, eventAddresses);
  };

  // --- Handlers Puntos de Evento (Múltiples activos permitidos) ---
  const handleToggleActiveEvent = async (addrId: string) => {
    const updated = eventAddresses.map((a) =>
      a.id === addrId ? { ...a, is_active: !a.is_active } : a
    );
    setEventAddresses(updated);
    await syncStoreConfig(whatsappContacts, pickupAddresses, updated);
  };

  const handleSaveEventAddr = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const eventData: EventAddress = {
      id: modalEventAddr.addr?.id || 'event_' + Date.now(),
      title: fd.get('title') as string,
      street: fd.get('street') as string,
      number: fd.get('number') as string,
      stair: fd.get('stair') as string,
      floor: fd.get('floor') as string,
      door: fd.get('door') as string,
      postal_code: fd.get('postal_code') as string,
      town: fd.get('town') as string,
      province: fd.get('province') as string,
      notes: fd.get('notes') as string,
      is_active: modalEventAddr.addr ? modalEventAddr.addr.is_active : true,
    };

    let updated: EventAddress[];
    if (modalEventAddr.addr) {
      updated = eventAddresses.map((a) => (a.id === modalEventAddr.addr!.id ? eventData : a));
    } else {
      updated = [...eventAddresses, eventData];
    }
    setEventAddresses(updated);
    setModalEventAddr({ open: false, addr: null });
    await syncStoreConfig(whatsappContacts, pickupAddresses, updated);
  };

  const handleDeleteEvent = async (addrId: string) => {
    if (!confirm('¿Eliminar este punto de evento?')) return;
    const updated = eventAddresses.filter((a) => a.id !== addrId);
    setEventAddresses(updated);
    await syncStoreConfig(whatsappContacts, pickupAddresses, updated);
  };

  // Submit Usuario
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingUser(true);
    setUserMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateProfile(formData);
    setLoadingUser(false);

    if (res?.error) {
      setUserMsg({ text: res.error, isError: true });
    } else {
      setUserMsg({ text: t.common_success, isError: false });
      if (res?.updatedProfile) {
        setCurrentProfile(parseProfile(res.updatedProfile));
      }
      setIsEditingUser(false);
      setTimeout(() => setUserMsg(null), 3000);
    }
  };

  // Submit Contraseña
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

  const formattedUserAddress = [
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
    <div className="space-y-6 font-serif">
      {/* Selector de Pestañas: Usuario y Tienda */}
      {isSeller && (
        <div className="flex items-center gap-3 p-1.5 bg-stone-100 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 max-w-md">
          <button
            type="button"
            onClick={() => setActiveTab('usuario')}
            className={\`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer \${
              activeTab === 'usuario'
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }\`}
          >
            <User className="w-4 h-4" />
            <span>Usuario</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tienda')}
            className={\`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer \${
              activeTab === 'tienda'
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }\`}
          >
            <Store className="w-4 h-4" />
            <span>Tienda</span>
          </button>
        </div>
      )}

      {/* ===================== PESTAÑA: USUARIO ===================== */}
      {(activeTab === 'usuario' || !isSeller) && (
        <div className="space-y-6 animate-fadeIn">
          {/* Tarjeta Datos de Vendedor */}
          <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-[#C68D07] dark:text-[#FFE259]">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100">
                      {isSeller ? 'Datos de Vendedor' : 'Datos del Usuario'}
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
                    {isSeller
                      ? 'Tus datos de acceso y contacto personales (los campos de dirección no son obligatorios).'
                      : t.profile_subtitle}
                  </p>
                </div>
              </div>

              {!isEditingUser && (
                <button
                  type="button"
                  onClick={() => setIsEditingUser(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer hover:scale-105 shrink-0"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>{t.profile_edit_btn}</span>
                </button>
              )}
            </div>

            {userMsg && (
              <div
                className={\`p-4 rounded-2xl text-xs font-bold text-center font-sans \${
                  userMsg.isError
                    ? 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
                    : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                }\`}
              >
                {userMsg.text}
              </div>
            )}

            {!isEditingUser ? (
              <div className="space-y-6 font-sans text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
                      Nombre y Apellidos
                    </span>
                    <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                      {[p.first_name, p.last_name_1, p.last_name_2].filter(Boolean).join(' ') || p.full_name || t.profile_not_specified}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
                      {t.profile_dni}
                    </span>
                    <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm uppercase">
                      {p.dni || t.profile_not_specified}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
                      {t.profile_birth_date}
                    </span>
                    <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                      {p.birth_date || t.profile_not_specified}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
                      {t.profile_phone}
                    </span>
                    <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                      {p.phone || t.profile_not_specified}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
                      {t.auth_email}
                    </span>
                    <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                      {p.email || t.profile_not_specified}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
                      Municipio / Provincia
                    </span>
                    <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                      {p.town ? \`\${p.town} (\${p.province || ''})\` : t.profile_not_specified}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#C68D07] dark:text-[#FFE259] flex items-center gap-1.5 font-serif">
                    <Home className="w-3.5 h-3.5" />
                    <span>Dirección Personal del Usuario {isSeller && '(Opcional)'}</span>
                  </span>
                  <p className="text-sm font-bold text-stone-800 dark:text-[#F5F5F0]">
                    {formattedUserAddress || (isSeller ? 'Sin dirección personal registrada (no obligatoria)' : t.profile_not_specified)}
                  </p>
                </div>
              </div>
            ) : (
              /* Modo Edición Exclusivo para Datos del Usuario */
              <form onSubmit={handleProfileSubmit} className="space-y-6 font-sans text-xs animate-fadeIn">
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
                      className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                    />
                  </div>
                </div>

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
                      className="w-full px-3.5 py-2.5 rounded-xl border uppercase bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block font-serif">
                    Dirección Personal {isSeller ? '(No obligatoria)' : '*'}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        Provincia {!isSeller && '*'}
                      </label>
                      <input
                        type="text"
                        name="province"
                        required={!isSeller}
                        defaultValue={p.province || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        Municipio {!isSeller && '*'}
                      </label>
                      <input
                        type="text"
                        name="town"
                        required={!isSeller}
                        defaultValue={p.town || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        Código Postal {!isSeller && '*'}
                      </label>
                      <input
                        type="text"
                        name="postal_code"
                        required={!isSeller}
                        defaultValue={p.postal_code || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                    <div className="col-span-2 sm:col-span-2">
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        Calle / Vía {!isSeller && '*'}
                      </label>
                      <input
                        type="text"
                        name="street"
                        required={!isSeller}
                        defaultValue={p.street || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        Nº {!isSeller && '*'}
                      </label>
                      <input
                        type="text"
                        name="number"
                        required={!isSeller}
                        defaultValue={p.number || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        Escalera
                      </label>
                      <input
                        type="text"
                        name="stair"
                        defaultValue={p.stair || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        Piso {!isSeller && '*'}
                      </label>
                      <input
                        type="text"
                        name="floor"
                        required={!isSeller}
                        defaultValue={p.floor || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        Puerta {!isSeller && '*'}
                      </label>
                      <input
                        type="text"
                        name="door"
                        required={!isSeller}
                        defaultValue={p.door || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-3 font-serif">
                  <button
                    type="button"
                    onClick={() => setIsEditingUser(false)}
                    className="px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold text-xs uppercase tracking-wider hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    {t.common_cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={loadingUser}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>{loadingUser ? t.common_loading : t.profile_save_changes_btn}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Tarjeta Cambio de Contraseña */}
          <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs">
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
                  <input
                    type="password"
                    name="current_password"
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_new_password} *
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_confirm_password} *
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
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
      )}

      {/* ===================== PESTAÑA: TIENDA ===================== */}
      {isSeller && activeTab === 'tienda' && (
        <div className="space-y-8 animate-fadeIn">
          {storeMsg && (
            <div
              className={\`p-4 rounded-2xl text-xs font-bold text-center font-sans \${
                storeMsg.isError
                  ? 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
                  : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
              }\`}
            >
              {storeMsg.text}
            </div>
          )}

          {/* 1. CONTACTO WHATSAPP */}
          <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">
                    Contacto whatsapp
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                    Canal oficial para las opciones de WhatsApp en toda la tienda web.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenAddWA}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer hover:scale-105 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir contacto</span>
              </button>
            </div>

            {/* Avisos estado WhatsApp */}
            {whatsappContacts.length === 0 ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200 font-sans">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                <span>No hay ningún contacto de WhatsApp registrado. Por favor, añade un contacto.</span>
              </div>
            ) : !hasActiveWA ? (
              <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-2xl flex items-center justify-between gap-3 text-xs text-red-900 dark:text-red-200 font-sans">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                  <span>Sin opciones whatsapp en la web. No hay ningún contacto habilitado. Por favor, activa uno.</span>
                </div>
              </div>
            ) : null}

            {/* Lista Contactos WhatsApp */}
            <div className="space-y-3 font-sans">
              {whatsappContacts.map((c) => (
                <div
                  key={c.id}
                  className={\`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all \${
                    c.is_active
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-xs'
                      : 'bg-stone-50 dark:bg-[#1F1E1C] border-stone-200 dark:border-stone-800'
                  }\`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-stone-900 dark:text-stone-100">{c.name}</span>
                      {c.is_active ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[9px] uppercase tracking-wider">
                          Habilitado (Activo en la web)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-bold text-[9px] uppercase tracking-wider">
                          Deshabilitado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 font-bold flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span>{c.phone}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-serif">
                    <button
                      type="button"
                      onClick={() => handleToggleActiveWA(c.id)}
                      className={\`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer \${
                        c.is_active
                          ? 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-red-100 hover:text-red-700'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }\`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{c.is_active ? 'Deshabilitar' : 'Habilitar'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditWA(c)}
                      className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                      title="Editar contacto"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteWA(c.id)}
                      className="p-2 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/60 text-red-700 dark:text-red-300 transition-colors cursor-pointer"
                      title="Borrar contacto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. PUNTO ENTREGA / TIENDA */}
          <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-[#C68D07] dark:text-[#FFE259]">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">
                    Punto entrega / tienda
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                    Direcciones para dar la opción de recogida a los compradores en sus pedidos.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalStoreAddr({ open: true, addr: null })}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer hover:scale-105 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Direccion</span>
              </button>
            </div>

            {/* Avisos Puntos de Entrega */}
            {pickupAddresses.length === 0 ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200 font-sans">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                <span>No hay ningún punto de entrega metido. Por favor, mete una dirección.</span>
              </div>
            ) : !hasActivePickup ? (
              <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-2xl flex items-center gap-3 text-xs text-red-900 dark:text-red-200 font-sans">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                <span>No hay ningún punto de entrega activo. Por favor, activa al menos una dirección.</span>
              </div>
            ) : null}

            {/* Lista Puntos de Entrega */}
            <div className="space-y-3 font-sans">
              {pickupAddresses.map((a) => (
                <div
                  key={a.id}
                  className={\`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all \${
                    a.is_active
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700 shadow-xs'
                      : 'bg-stone-50 dark:bg-[#1F1E1C] border-stone-200 dark:border-stone-800'
                  }\`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-stone-900 dark:text-stone-100">{a.title}</span>
                      {a.is_active ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#FFE259] text-[#1D1D1B] font-black text-[9px] uppercase tracking-wider">
                          Habilitada
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-bold text-[9px] uppercase tracking-wider">
                          Deshabilitada
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      {a.street} {a.number ? \`Nº \${a.number}\` : ''} {a.stair ? \`Esc \${a.stair}\` : ''} {a.floor ? \`Piso \${a.floor}\` : ''} {a.door ? \`Pta \${a.door}\` : ''}, {a.postal_code || ''} {a.town} ({a.province})
                    </p>
                    {a.schedule && (
                      <p className="text-[11px] font-bold text-[#C68D07] dark:text-[#FFE259]">
                        Horario: {a.schedule}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-serif">
                    <button
                      type="button"
                      onClick={() => handleToggleActivePickup(a.id)}
                      className={\`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer \${
                        a.is_active
                          ? 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-red-100 hover:text-red-700'
                          : 'bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] shadow-xs'
                      }\`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{a.is_active ? 'Deshabilitar' : 'Habilitar'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModalStoreAddr({ open: true, addr: a })}
                      className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                      title="Editar dirección"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePickup(a.id)}
                      className="p-2 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/60 text-red-700 dark:text-red-300 transition-colors cursor-pointer"
                      title="Borrar dirección"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. PUNTO EVENTO */}
          <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">
                    Punto evento
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                    Ubicaciones disponibles para la celebración de catas presenciales y eventos.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalEventAddr({ open: true, addr: null })}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer hover:scale-105 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Direccion</span>
              </button>
            </div>

            {/* Avisos Puntos de Evento */}
            {eventAddresses.length === 0 ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200 font-sans">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                <span>No hay ningún punto de evento metido. Por favor, mete una dirección.</span>
              </div>
            ) : !hasActiveEvent ? (
              <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-2xl flex items-center gap-3 text-xs text-red-900 dark:text-red-200 font-sans">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                <span>No hay ningún punto de evento activo. Por favor, activa al menos una ubicación.</span>
              </div>
            ) : null}

            {/* Lista Puntos de Evento */}
            <div className="space-y-3 font-sans">
              {eventAddresses.map((a) => (
                <div
                  key={a.id}
                  className={\`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all \${
                    a.is_active
                      ? 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800 shadow-xs'
                      : 'bg-stone-50 dark:bg-[#1F1E1C] border-stone-200 dark:border-stone-800'
                  }\`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-stone-900 dark:text-stone-100">{a.title}</span>
                      {a.is_active ? (
                        <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white font-black text-[9px] uppercase tracking-wider">
                          Habilitada
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-bold text-[9px] uppercase tracking-wider">
                          Deshabilitada
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      {a.street} {a.number ? \`Nº \${a.number}\` : ''} {a.stair ? \`Esc \${a.stair}\` : ''} {a.floor ? \`Piso \${a.floor}\` : ''} {a.door ? \`Pta \${a.door}\` : ''}, {a.postal_code || ''} {a.town} ({a.province})
                    </p>
                    {a.notes && (
                      <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                        Notas: {a.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-serif">
                    <button
                      type="button"
                      onClick={() => handleToggleActiveEvent(a.id)}
                      className={\`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer \${
                        a.is_active
                          ? 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-red-100 hover:text-red-700'
                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                      }\`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{a.is_active ? 'Deshabilitar' : 'Habilitar'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModalEventAddr({ open: true, addr: a })}
                      className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                      title="Editar dirección"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(a.id)}
                      className="p-2 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/60 text-red-700 dark:text-red-300 transition-colors cursor-pointer"
                      title="Borrar dirección"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODALES ===================== */}

      {/* Modal Contacto WhatsApp */}
      {modalWA.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn font-sans">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 font-serif">
              <h3 className="font-black text-lg text-stone-900 dark:text-stone-100">
                {modalWA.contact ? 'Editar Contacto WhatsApp' : 'Añadir Contacto WhatsApp'}
              </h3>
              <button
                type="button"
                onClick={() => setModalWA({ open: false, contact: null })}
                className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWA} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-bold text-stone-700 dark:text-stone-300 block">
                  Origen de los datos
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setWaSelectType('seller');
                      const s = sellers[0];
                      if (s) {
                        setSelectedSellerId(s.id);
                        setWaName(s.full_name);
                        setWaPhone(s.phone);
                      }
                    }}
                    className={\`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer transition-all \${
                      waSelectType === 'seller'
                        ? 'border-[#FFE259] bg-amber-50 dark:bg-amber-950/40 text-stone-900 dark:text-stone-100'
                        : 'border-stone-200 dark:border-stone-700 text-stone-500'
                    }\`}
                  >
                    Elegir Vendedor
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setWaSelectType('manual');
                      setSelectedSellerId('');
                    }}
                    className={\`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer transition-all \${
                      waSelectType === 'manual'
                        ? 'border-[#FFE259] bg-amber-50 dark:bg-amber-950/40 text-stone-900 dark:text-stone-100'
                        : 'border-stone-200 dark:border-stone-700 text-stone-500'
                    }\`}
                  >
                    Meter a mano
                  </button>
                </div>
              </div>

              {waSelectType === 'seller' && sellers.length > 0 && (
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Seleccionar Vendedor *
                  </label>
                  <select
                    value={selectedSellerId}
                    onChange={(e) => {
                      const selId = e.target.value;
                      setSelectedSellerId(selId);
                      const s = sellers.find((sel) => sel.id === selId);
                      if (s) {
                        setWaName(s.full_name);
                        setWaPhone(s.phone);
                      }
                    }}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold"
                  >
                    {sellers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.full_name} ({s.phone || 'Sin tlf'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Nombre del Contacto *
                </label>
                <input
                  type="text"
                  required
                  value={waName}
                  onChange={(e) => setWaName(e.target.value)}
                  placeholder="Ej: Mikel (Atención Tienda)"
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Número de Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  placeholder="34600000000"
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700 font-bold"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2 font-serif">
                <button
                  type="button"
                  onClick={() => setModalWA({ open: false, contact: null })}
                  className="px-4 py-2 rounded-xl text-stone-500 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingStore}
                  className="px-5 py-2 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black uppercase text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Guardar Contacto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Punto de Entrega / Tienda */}
      {modalStoreAddr.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn font-sans">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 font-serif">
              <h3 className="font-black text-lg text-stone-900 dark:text-stone-100">
                {modalStoreAddr.addr ? 'Editar Punto de Entrega' : 'Añadir Punto de Entrega / Tienda'}
              </h3>
              <button
                type="button"
                onClick={() => setModalStoreAddr({ open: false, addr: null })}
                className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStoreAddr} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Título del Punto de Entrega *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={modalStoreAddr.addr?.title || ''}
                  placeholder="Ej: Tienda Principal Lekeitio"
                  className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 font-bold border-stone-200 dark:border-stone-700"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Calle *</label>
                  <input
                    type="text"
                    name="street"
                    required
                    defaultValue={modalStoreAddr.addr?.street || ''}
                    placeholder="Gamarra Kalea"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Nº *</label>
                  <input
                    type="text"
                    name="number"
                    required
                    defaultValue={modalStoreAddr.addr?.number || ''}
                    placeholder="4"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Escalera</label>
                  <input
                    type="text"
                    name="stair"
                    defaultValue={modalStoreAddr.addr?.stair || ''}
                    placeholder="A"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Piso</label>
                  <input
                    type="text"
                    name="floor"
                    defaultValue={modalStoreAddr.addr?.floor || ''}
                    placeholder="Bajo"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Puerta</label>
                  <input
                    type="text"
                    name="door"
                    defaultValue={modalStoreAddr.addr?.door || ''}
                    placeholder="1"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">C.P. *</label>
                  <input
                    type="text"
                    name="postal_code"
                    required
                    defaultValue={modalStoreAddr.addr?.postal_code || '48280'}
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Municipio *</label>
                  <input
                    type="text"
                    name="town"
                    required
                    defaultValue={modalStoreAddr.addr?.town || 'Lekeitio'}
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Provincia *</label>
                  <input
                    type="text"
                    name="province"
                    required
                    defaultValue={modalStoreAddr.addr?.province || 'Bizkaia'}
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Horario de Atención / Recogida
                </label>
                <input
                  type="text"
                  name="schedule"
                  defaultValue={modalStoreAddr.addr?.schedule || ''}
                  placeholder="Ej: Lun-Vie: 10:00 - 14:30 | 17:00 - 20:30"
                  className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2 font-serif">
                <button
                  type="button"
                  onClick={() => setModalStoreAddr({ open: false, addr: null })}
                  className="px-4 py-2 rounded-xl text-stone-500 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingStore}
                  className="px-5 py-2 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black uppercase text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Guardar Dirección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Punto de Evento */}
      {modalEventAddr.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn font-sans">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 font-serif">
              <h3 className="font-black text-lg text-stone-900 dark:text-stone-100">
                {modalEventAddr.addr ? 'Editar Punto de Evento' : 'Añadir Punto de Evento'}
              </h3>
              <button
                type="button"
                onClick={() => setModalEventAddr({ open: false, addr: null })}
                className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEventAddr} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Título de la Ubicación del Evento *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={modalEventAddr.addr?.title || ''}
                  placeholder="Ej: Espacio de Catas & Maridaje"
                  className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 font-bold border-stone-200 dark:border-stone-700"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Calle *</label>
                  <input
                    type="text"
                    name="street"
                    required
                    defaultValue={modalEventAddr.addr?.street || ''}
                    placeholder="Gamarra Kalea"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Nº *</label>
                  <input
                    type="text"
                    name="number"
                    required
                    defaultValue={modalEventAddr.addr?.number || ''}
                    placeholder="4"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Escalera</label>
                  <input
                    type="text"
                    name="stair"
                    defaultValue={modalEventAddr.addr?.stair || ''}
                    placeholder="A"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Piso</label>
                  <input
                    type="text"
                    name="floor"
                    defaultValue={modalEventAddr.addr?.floor || ''}
                    placeholder="Bajo"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Puerta</label>
                  <input
                    type="text"
                    name="door"
                    defaultValue={modalEventAddr.addr?.door || ''}
                    placeholder="1"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">C.P. *</label>
                  <input
                    type="text"
                    name="postal_code"
                    required
                    defaultValue={modalEventAddr.addr?.postal_code || '48280'}
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Municipio *</label>
                  <input
                    type="text"
                    name="town"
                    required
                    defaultValue={modalEventAddr.addr?.town || 'Lekeitio'}
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Provincia *</label>
                  <input
                    type="text"
                    name="province"
                    required
                    defaultValue={modalEventAddr.addr?.province || 'Bizkaia'}
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Notas / Condiciones del Espacio
                </label>
                <input
                  type="text"
                  name="notes"
                  defaultValue={modalEventAddr.addr?.notes || ''}
                  placeholder="Ej: Sala climatizada, aforo máx. 18 personas"
                  className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2 font-serif">
                <button
                  type="button"
                  onClick={() => setModalEventAddr({ open: false, addr: null })}
                  className="px-4 py-2 rounded-xl text-stone-500 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingStore}
                  className="px-5 py-2 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black uppercase text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Guardar Ubicación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
`);

// 6. components/Footer.tsx
saveFile('components/Footer.tsx', `
'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
import { Truck, Store } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();
  const { storeAddress, whatsappPhone, getWhatsAppUrl, hasActiveWhatsApp } = useStoreConfig();

  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-[#1D1D1B] text-stone-300 transition-colors pt-0 pb-8">
      {/* 1. Banner Destacado Amarillo (Solo si WhatsApp está habilitado) */}
      {hasActiveWhatsApp && (
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
      )}

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
            {hasActiveWhatsApp && whatsappPhone && (
              <p className="text-stone-300 font-bold text-[11px]">
                WhatsApp: +{whatsappPhone}
              </p>
            )}
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
`);

// 7. components/ExperienceBanners.tsx
saveFile('components/ExperienceBanners.tsx', `
'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
import { MessageCircle, Sparkles, Gift } from 'lucide-react';

export function ExperienceBanners() {
  const { t } = useLanguage();
  const { getWhatsAppUrl, hasActiveWhatsApp } = useStoreConfig();

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
        {/* Banner 1: Catas Presenciales */}
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

          {hasActiveWhatsApp ? (
            <a
              href={getWhatsAppUrl('Hola, quisiera información sobre las catas presenciales de EkhiTeka')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.exp_b1_btn}</span>
            </a>
          ) : (
            <Link
              href="/experiencias"
              className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259] text-stone-900 dark:text-stone-100 hover:text-[#1D1D1B] font-black text-xs transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.exp_b1_btn}</span>
            </Link>
          )}
        </div>

        {/* Banner 2: Mesas de Quesos */}
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

          {hasActiveWhatsApp ? (
            <a
              href={getWhatsAppUrl('Hola, quisiera presupuesto para un evento o boda con mesa de quesos')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.exp_b2_btn}</span>
            </a>
          ) : (
            <Link
              href="/regalos-empresa"
              className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259] text-stone-900 dark:text-stone-100 hover:text-[#1D1D1B] font-black text-xs transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.exp_b2_btn}</span>
            </Link>
          )}
        </div>

        {/* Banner 3: Cestas y Regalos */}
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
`);

console.log('\n✨ Todos los componentes y páginas clave han sido generados exitosamente.');