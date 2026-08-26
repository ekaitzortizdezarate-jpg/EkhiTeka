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

export interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  enabled: boolean;
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
  whatsapp_enabled?: boolean;
  whatsapp_contacts?: WhatsAppContact[];
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
      whatsapp_enabled: true,
      whatsapp_contacts: [],
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

  const legacyWhatsApp = details.whatsapp_phone ?? raw.whatsapp_phone ?? raw.phone ?? '';
  const whatsappContacts: WhatsAppContact[] = Array.isArray(details.whatsapp_contacts)
    ? details.whatsapp_contacts
    : legacyWhatsApp
      ? [{
          id: 'whatsapp_legacy',
          name: 'WhatsApp de la tienda',
          phone: legacyWhatsApp,
          enabled: details.whatsapp_enabled ?? raw.whatsapp_enabled ?? true,
        }]
      : [];

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
    whatsapp_phone:
      raw.whatsapp_enabled === false
        ? details.whatsapp_phone ?? raw.whatsapp_phone ?? null
        : details.whatsapp_phone ?? raw.whatsapp_phone ?? raw.phone ?? '34600000000',
    whatsapp_enabled: details.whatsapp_enabled ?? raw.whatsapp_enabled ?? true,
    whatsapp_contacts: whatsappContacts,
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
