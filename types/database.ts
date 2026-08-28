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

export interface StoreScheduleDetails {
  days: string[];
  weekday_morning_enabled?: boolean;
  weekday_morning_start?: string;
  weekday_morning_end?: string;
  weekday_afternoon_enabled?: boolean;
  weekday_afternoon_start?: string;
  weekday_afternoon_end?: string;
  weekend_morning_enabled?: boolean;
  weekend_morning_start?: string;
  weekend_morning_end?: string;
  weekend_afternoon_enabled?: boolean;
  weekend_afternoon_start?: string;
  weekend_afternoon_end?: string;
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
  schedule_details?: StoreScheduleDetails;
  is_active: boolean;
  is_main?: boolean;
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

export interface DeliveryAddress {
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
  is_default?: boolean;
}

export interface SiteImageMeta {
  author_name?: string;
  author_id?: string;
  updated_at?: string;
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
  delivery_addresses?: DeliveryAddress[];
  cart_data?: any[];
  site_images?: Record<string, string>;
  site_images_meta?: Record<string, SiteImageMeta>;
  last_read_chats?: Record<string, string>;
  last_read_orders?: Record<string, string>;
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
      email: '',
      phone: '',
      province: '',
      town: '',
      postal_code: '',
      street: '',
      number: '',
      stair: '',
      floor: '',
      door: '',
      first_name: '',
      last_name_1: '',
      last_name_2: '',
      birth_date: '',
      dni: '',
      whatsapp_phone: null,
      whatsapp_contacts: [],
      pickup_addresses: [],
      event_addresses: [],
      delivery_addresses: [],
      cart_data: [],
      site_images: {},
      site_images_meta: {},
      last_read_chats: {},
      last_read_orders: {},
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
      // Ignorar error al parsear JSON
    }
  }

  return {
    id: raw.id || '',
    role: raw.role || 'comprador',
    full_name: raw.full_name || [raw.first_name || details.first_name, raw.last_name_1 || details.last_name_1, raw.last_name_2 || details.last_name_2].filter(Boolean).join(' ') || '',
    email: raw.email || '',
    avatar_url: raw.avatar_url || '',
    bio: raw.bio || '',
    created_at: raw.created_at || '',
    updated_at: raw.updated_at || '',
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
    whatsapp_phone: details.whatsapp_phone || raw.whatsapp_phone || raw.phone || null,
    whatsapp_contacts: (Array.isArray(raw.whatsapp_contacts) && raw.whatsapp_contacts.length > 0) ? raw.whatsapp_contacts : (details.whatsapp_contacts || []),
    pickup_addresses: (Array.isArray(raw.pickup_addresses) && raw.pickup_addresses.length > 0) ? raw.pickup_addresses : (details.pickup_addresses || []),
    event_addresses: (Array.isArray(raw.event_addresses) && raw.event_addresses.length > 0) ? raw.event_addresses : (details.event_addresses || []),
    delivery_addresses: (Array.isArray(raw.delivery_addresses) && raw.delivery_addresses.length > 0) ? raw.delivery_addresses : (details.delivery_addresses || []),
    cart_data: (Array.isArray(raw.cart_data) && raw.cart_data.length > 0) ? raw.cart_data : (details.cart_data || []),
    site_images: (raw.site_images && Object.keys(raw.site_images).length > 0) ? raw.site_images : (details.site_images || {}),
    site_images_meta: (raw.site_images_meta && Object.keys(raw.site_images_meta).length > 0) ? raw.site_images_meta : (details.site_images_meta || {}),
    last_read_chats: (raw.last_read_chats && Object.keys(raw.last_read_chats).length > 0) ? raw.last_read_chats : (details.last_read_chats || {}),
    last_read_orders: (raw.last_read_orders && Object.keys(raw.last_read_orders).length > 0) ? raw.last_read_orders : (details.last_read_orders || {}),
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

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  changed_by_name: string;
  changed_by_id?: string;
  timestamp: string;
  notes?: string;
}

export function getCleanShippingNotes(raw?: string | null): string {
  if (!raw) return '';
  return raw.replace(/<!--HISTORY:[\s\S]*?-->/g, '').trim();
}

export function getOrderStatusHistory(raw?: string | null): OrderStatusHistoryItem[] {
  if (!raw) return [];
  const match = raw.match(/<!--HISTORY:([\s\S]*?)-->/);
  if (!match || !match[1]) return [];
  try {
    const parsed = JSON.parse(match[1]);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function encodeOrderHistory(cleanNotes: string, history: OrderStatusHistoryItem[]): string {
  const clean = cleanNotes.replace(/<!--HISTORY:[\s\S]*?-->/g, '').trim();
  const historyTag = `<!--HISTORY:${JSON.stringify(history)}-->`;
  return clean ? `${clean}\n\n${historyTag}` : historyTag;
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
  status_history?: OrderStatusHistoryItem[];
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
