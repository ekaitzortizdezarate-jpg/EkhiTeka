'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { type OrderStatus, isProfileComplete } from '@/types/database';

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
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'vendedor') {
    return { error: 'Los vendedores de EkhiTeka no pueden realizar compras con la cuenta de vendedor. Utiliza una cuenta de comprador.' };
  }

  if (!isProfileComplete(profile)) {
    return { error: 'Debes completar tu perfil con todos tus datos personales y de dirección antes de realizar un pedido.' };
  }

  // 1. Verificar disponibilidad de plazas y stock para cada producto/evento
  for (const it of payload.items) {
    const { data: prod, error: prodErr } = await supabase
      .from('products')
      .select('id, name, stock, is_unlimited_stock')
      .eq('id', it.productId)
      .single();

    if (prodErr || !prod) {
      return { error: `Uno de los productos seleccionados ya no está disponible.` };
    }

    if (!prod.is_unlimited_stock) {
      const currentStock = prod.stock ?? 0;
      if (currentStock < it.quantity) {
        return {
          error: currentStock <= 0
            ? `Lo sentimos, ya no quedan plazas o existencias disponibles para "${prod.name}".`
            : `Solo quedan ${currentStock} plaza(s) disponible(s) para "${prod.name}". Por favor, reduce la cantidad.`,
        };
      }
    }
  }

  // 2. Crear el registro del pedido
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

  // 3. Crear los items del pedido
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

  // 4. Descontar las plazas / stock adquirido en la base de datos
  for (const it of payload.items) {
    const { data: prod } = await supabase
      .from('products')
      .select('stock, is_unlimited_stock')
      .eq('id', it.productId)
      .single();

    if (prod && !prod.is_unlimited_stock) {
      const newStock = Math.max(0, (prod.stock ?? 0) - it.quantity);
      await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', it.productId);
    }
  }

  revalidatePath('/');
  revalidatePath('/tienda');
  revalidatePath('/experiencias');
  revalidatePath('/regalos-gourmet');
  revalidatePath('/comprador/pedidos');
  revalidatePath('/vendedor/pedidos');
  revalidatePath('/vendedor/eventos');
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
  revalidatePath('/vendedor/eventos');
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

  // 1. Restaurar stock al cancelar el pedido
  const { data: items } = await supabase
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', orderId);

  if (items) {
    for (const it of items) {
      const { data: prod } = await supabase
        .from('products')
        .select('stock, is_unlimited_stock')
        .eq('id', it.product_id)
        .single();

      if (prod && !prod.is_unlimited_stock) {
        await supabase
          .from('products')
          .update({ stock: (prod.stock ?? 0) + it.quantity })
          .eq('id', it.product_id);
      }
    }
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
  revalidatePath('/vendedor/eventos');
  revalidatePath('/tienda');
  revalidatePath('/');
  return { success: true };
}