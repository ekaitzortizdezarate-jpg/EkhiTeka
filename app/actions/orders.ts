'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { OrderStatus } from '@/types/database';

export interface CreateOrderPayload {
  sellerId: string;
  deliveryType: 'domicilio' | 'recogida_tienda';
  shippingAddress?: string;
  shippingNotes?: string;
  pickupSchedule?: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  totalPrice: number;
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
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'vendedor') {
    return { error: 'Los vendedores de EkhiTeka no pueden realizar compras con la cuenta de vendedor. Utiliza una cuenta de comprador.' };
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      buyer_id: user.id,
      seller_id: payload.sellerId,
      status: 'pendiente',
      delivery_type: payload.deliveryType,
      shipping_address: payload.shippingAddress || null,
      shipping_notes: payload.shippingNotes || null,
      pickup_schedule: payload.pickupSchedule || null,
      total_price: payload.totalPrice,
    })
    .select()
    .single();

  if (orderError || !order) {
    return { error: orderError?.message || 'Error al crear el pedido' };
  }

  const orderItemsData = payload.items.map((it) => ({
    order_id: order.id,
    product_id: it.productId,
    quantity: it.quantity,
    unit_price: it.unitPrice,
    subtotal: it.subtotal,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData);

  if (itemsError) {
    return { error: itemsError.message };
  }

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
