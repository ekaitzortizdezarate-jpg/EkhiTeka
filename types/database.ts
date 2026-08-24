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

export interface Profile {
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

export interface Category {
  id: string;
  name_es: string;
  name_eu: string;
  name_en: string;
  name_fr: string;
  icon: string;
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
  shipping_address?: string | null;
  shipping_notes?: string | null;
  pickup_schedule?: string | null;
  total_price: number;
  cancel_reason?: string | null;
  created_at: string;
  updated_at: string;
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
