'use server';

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
            ? `Lo sentimos, no queda stock disponible para "${prod.name}".`
            : `Solo quedan ${currentStock} unidad(es) de "${prod.name}".`,
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

  // Si pasa a cancelado, restaurar stock de los productos
  if (status === 'cancelado') {
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_id, quantity')
      .eq('order_id', orderId);

    if (orderItems && orderItems.length > 0) {
      for (const it of orderItems) {
        if (!it.product_id) continue;
        const { data: prod } = await supabase
          .from('products')
          .select('id, stock, is_unlimited_stock')
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
  revalidatePath('/');
  revalidatePath('/tienda');
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

  // 1. Obtener detalles del pedido para saber el comprador
  const { data: order } = await supabase
    .from('orders')
    .select('id, buyer_id, seller_id, status')
    .eq('id', orderId)
    .single();

  if (!order) {
    return { error: 'Pedido no encontrado' };
  }

  // 2. Actualizar estado del pedido a cancelado
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'cancelado',
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) {
    return { error: error.message };
  }

  // 3. Enviar mensaje de chat automático al comprador con el motivo
  if (order.buyer_id) {
    const isPending = order.status === 'pendiente';
    const actionLabel = isPending ? 'rechazado' : 'cancelado';
    const shortId = order.id.slice(0, 8);
    const text = `⚠️ Tu pedido #${shortId} ha sido ${actionLabel} por el artesano.\n\nMotivo:\n${reason.trim()}`;

    await supabase.from('chat_messages').insert({
      sender_id: user.id,
      receiver_id: order.buyer_id,
      order_id: order.id,
      message: text,
      is_read: false,
    });
  }

  // 4. Restaurar el stock de los productos del pedido
  const { data: orderItems } = await supabase
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', orderId);

  if (orderItems && orderItems.length > 0) {
    for (const it of orderItems) {
      if (!it.product_id) continue;
      const { data: prod } = await supabase
        .from('products')
        .select('id, stock, is_unlimited_stock')
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

  revalidatePath('/comprador/pedidos');
  revalidatePath('/vendedor/pedidos');
  revalidatePath('/chat');
  if (order.buyer_id) {
    revalidatePath(`/chat/${order.buyer_id}`);
  }
  return { success: true };
}

export async function buyerCancelOrder(orderId: string, reason?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'No autenticado' };
  }

  const { data: order } = await supabase
    .from('orders')
    .select('id, buyer_id, seller_id, status')
    .eq('id', orderId)
    .single();

  if (!order) {
    return { error: 'Pedido no encontrado' };
  }

  if (order.buyer_id !== user.id) {
    return { error: 'No autorizado' };
  }

  if (order.status === 'entregado' || order.status === 'cancelado') {
    return { error: 'Este pedido ya no se puede cancelar.' };
  }

  const { error } = await supabase
    .from('orders')
    .update({
      status: 'cancelado',
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) {
    return { error: error.message };
  }

  if (order.seller_id) {
    const shortId = order.id.slice(0, 8);
    const cancelReason = reason?.trim() || 'Cancelado a petición del comprador.';
    const text = `ℹ️ El comprador ha cancelado el pedido #${shortId}.\n\nMotivo:\n${cancelReason}`;

    await supabase.from('chat_messages').insert({
      sender_id: user.id,
      receiver_id: order.seller_id,
      order_id: order.id,
      message: text,
      is_read: false,
    });
  }

  const { data: orderItems } = await supabase
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', orderId);

  if (orderItems && orderItems.length > 0) {
    for (const it of orderItems) {
      if (!it.product_id) continue;
      const { data: prod } = await supabase
        .from('products')
        .select('id, stock, is_unlimited_stock')
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

  revalidatePath('/comprador/pedidos');
  revalidatePath('/vendedor/pedidos');
  revalidatePath('/chat');
  if (order.seller_id) {
    revalidatePath(`/chat/${order.seller_id}`);
  }
  return { success: true };
}
