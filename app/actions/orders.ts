'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  type OrderStatus,
  isProfileComplete,
  encodeOrderHistory,
  getOrderStatusHistory,
  getCleanShippingNotes,
  type OrderStatusHistoryItem,
} from '@/types/database';

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

  // 2. Crear pedido con historial de creación
  const initialHistory: OrderStatusHistoryItem[] = [
    {
      status: 'pendiente',
      changed_by_name: 'Cliente',
      timestamp: new Date().toISOString(),
    },
  ];
  const encodedShippingNotes = encodeOrderHistory(shippingNotes || '', initialHistory);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      buyer_id: user.id,
      seller_id: sellerId,
      status: 'pendiente',
      delivery_type: deliveryType,
      shipping_address: shippingAddress,
      shipping_notes: encodedShippingNotes,
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

  // 5. Enviar mensaje de confirmación automático en el chat con la tienda
  if (order.buyer_id) {
    const shortId = order.id.slice(0, 8).toUpperCase();
    const text = `🎉 ¡Gracias por tu pedido #${shortId}! Hemos recibido tu solicitud por un total de ${totalPrice.toFixed(2)} € y la estamos procesando.`;

    try {
      await supabase.from('chat_messages').insert({
        sender_id: sellerId || user.id,
        receiver_id: user.id,
        order_id: order.id,
        message: text,
        is_read: false,
      });
    } catch {}
  }

  revalidatePath('/');
  revalidatePath('/tienda');
  revalidatePath('/experiencias');
  revalidatePath('/regalos-gourmet');
  revalidatePath('/comprador/pedidos');
  revalidatePath('/vendedor/pedidos');
  revalidatePath('/chat');
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

  // Verificar rol de vendedor y perfil obligatorio completado
  const { data: profileRaw } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileRaw?.role !== 'vendedor' && profileRaw?.role !== 'admin') {
    return { error: 'Permisos insuficientes. Solo los vendedores pueden gestionar pedidos.' };
  }

  if (!isProfileComplete(profileRaw)) {
    return { error: 'Debes completar tus datos obligatorios en Perfil / Usuario antes de gestionar pedidos de la tienda.' };
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

  // Obtener info del pedido e historial previo
  const { data: order } = await supabase
    .from('orders')
    .select('id, buyer_id, seller_id, status, shipping_notes')
    .eq('id', orderId)
    .single();

  const existingHistory = getOrderStatusHistory(order?.shipping_notes);
  const cleanNotes = getCleanShippingNotes(order?.shipping_notes);
  const sellerName = profileRaw.full_name || 'Vendedor EkhiTeka';

  const nowIso = new Date().toISOString();

  const updatedHistory: OrderStatusHistoryItem[] = [
    ...existingHistory,
    {
      status,
      changed_by_name: sellerName,
      changed_by_id: user.id,
      timestamp: nowIso,
    },
  ];
  const updatedShippingNotes = encodeOrderHistory(cleanNotes, updatedHistory);

  const { error } = await supabase
    .from('orders')
    .update({
      status,
      shipping_notes: updatedShippingNotes,
      updated_at: nowIso,
    })
    .eq('id', orderId);

  if (error) {
    return { error: error.message };
  }

  // Marcar automáticamente como visto para el vendedor que realizó el cambio
  try {
    let actingBio: any = {};
    if (profileRaw?.bio) {
      try {
        const parsed = JSON.parse(profileRaw.bio);
        if (typeof parsed === 'object' && parsed !== null) actingBio = parsed;
      } catch {}
    }
    const myLastReadOrders = { ...(actingBio.last_read_orders || {}) };
    myLastReadOrders[orderId] = nowIso;
    actingBio.last_read_orders = myLastReadOrders;
    await supabase
      .from('profiles')
      .update({ bio: JSON.stringify(actingBio), updated_at: nowIso })
      .eq('id', user.id);
  } catch {}

  // Notificar al comprador mediante mensaje de chat del sistema
  if (order?.buyer_id) {
    const statusLabels: Record<string, string> = {
      pendiente: 'Pendiente',
      confirmado: 'Confirmado',
      preparando: 'En preparación',
      listo_entrega: 'Listo para entrega / recogida',
      entregado: 'Entregado / Completado',
      cancelado: 'Cancelado',
    };
    const statusName = statusLabels[status] || status;
    const shortId = order.id.slice(0, 8).toUpperCase();
    const text = `📦 Actualización de tu pedido #${shortId}: El estado ha cambiado a "${statusName}".`;

    try {
      await supabase.from('chat_messages').insert({
        sender_id: user.id,
        receiver_id: order.buyer_id,
        order_id: order.id,
        message: text,
        is_read: false,
      });
    } catch {}
  }

  revalidatePath('/comprador/pedidos');
  revalidatePath('/vendedor/pedidos');
  revalidatePath('/chat');
  if (order?.buyer_id) {
    revalidatePath(`/chat/${order.buyer_id}`);
  }
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

  // Verificar rol de vendedor y perfil obligatorio completado
  const { data: profileRaw } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileRaw?.role !== 'vendedor' && profileRaw?.role !== 'admin') {
    return { error: 'Permisos insuficientes. Solo los vendedores pueden cancelar pedidos.' };
  }

  if (!isProfileComplete(profileRaw)) {
    return { error: 'Debes completar tus datos obligatorios en Perfil / Usuario antes de gestionar pedidos de la tienda.' };
  }

  // 1. Obtener detalles del pedido para saber el comprador y actualizar historial
  const { data: order } = await supabase
    .from('orders')
    .select('id, buyer_id, seller_id, status, shipping_notes')
    .eq('id', orderId)
    .single();

  if (!order) {
    return { error: 'Pedido no encontrado' };
  }

  const existingHistory = getOrderStatusHistory(order.shipping_notes);
  const cleanNotes = getCleanShippingNotes(order.shipping_notes);
  const sellerName = profileRaw.full_name || 'Vendedor EkhiTeka';
  const nowIso = new Date().toISOString();

  const updatedHistory: OrderStatusHistoryItem[] = [
    ...existingHistory,
    {
      status: 'cancelado',
      changed_by_name: sellerName,
      changed_by_id: user.id,
      timestamp: nowIso,
      notes: reason.trim(),
    },
  ];
  const updatedShippingNotes = encodeOrderHistory(cleanNotes, updatedHistory);

  // 2. Actualizar estado del pedido a cancelado con historial
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'cancelado',
      cancel_reason: reason.trim(),
      shipping_notes: updatedShippingNotes,
      updated_at: nowIso,
    })
    .eq('id', orderId);

  if (error) {
    return { error: error.message };
  }

  // Marcar automáticamente como visto para el vendedor que cancela
  try {
    let actingBio: any = {};
    if (profileRaw?.bio) {
      try {
        const parsed = JSON.parse(profileRaw.bio);
        if (typeof parsed === 'object' && parsed !== null) actingBio = parsed;
      } catch {}
    }
    const myLastReadOrders = { ...(actingBio.last_read_orders || {}) };
    myLastReadOrders[orderId] = nowIso;
    actingBio.last_read_orders = myLastReadOrders;
    await supabase
      .from('profiles')
      .update({ bio: JSON.stringify(actingBio), updated_at: nowIso })
      .eq('id', user.id);
  } catch {}

  // 3. Enviar mensaje de chat automático al comprador con el motivo
  if (order.buyer_id) {
    const isPending = order.status === 'pendiente';
    const actionLabel = isPending ? 'rechazado' : 'cancelado';
    const shortId = order.id.slice(0, 8).toUpperCase();
    const text = `⚠️ Tu pedido #${shortId} ha sido ${actionLabel} por la tienda.\n\nMotivo:\n${reason.trim()}`;

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

export async function deleteOrderPermanently(orderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'No autenticado' };
  }

  const { data: order } = await supabase
    .from('orders')
    .select('id, seller_id, buyer_id, status')
    .eq('id', orderId)
    .single();

  if (!order) {
    return { error: 'Pedido no encontrado' };
  }

  // Restaurar stock si estaba en curso
  if (order.status !== 'cancelado' && order.status !== 'entregado') {
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

  // 1. Desvincular o borrar mensajes de chat vinculados a este pedido
  try {
    await supabase.from('chat_messages').update({ order_id: null }).eq('order_id', orderId);
    await supabase.from('chat_messages').delete().eq('order_id', orderId);
  } catch (err) {
    console.error('Chat messages cleanup error:', err);
  }

  // 2. Borrar items del pedido
  try {
    await supabase.from('order_items').delete().eq('order_id', orderId);
  } catch (err) {
    console.error('Order items deletion error:', err);
  }

  // 3. Borrar el pedido
  const { error } = await supabase.from('orders').delete().eq('id', orderId);

  if (error) {
    console.error('Orders delete error:', error);
    return { error: error.message };
  }

  revalidatePath('/vendedor/pedidos');
  revalidatePath('/comprador/pedidos');
  revalidatePath('/chat');
  return { success: true };
}

export async function markOrderAsSeenBySeller(orderId: string, timestamp?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'No autenticado' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('bio')
    .eq('id', user.id)
    .single();

  let details: any = {};
  if (profile?.bio) {
    try {
      const parsed = JSON.parse(profile.bio);
      if (typeof parsed === 'object' && parsed !== null) details = parsed;
    } catch {}
  }

  const lastReadOrders = { ...(details.last_read_orders || {}) };
  lastReadOrders[orderId] = timestamp || new Date().toISOString();

  details.last_read_orders = lastReadOrders;

  await supabase
    .from('profiles')
    .update({
      bio: JSON.stringify(details),
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  revalidatePath('/vendedor/pedidos');
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function markAllOrdersAsSeenBySeller(orderIds: string[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'No autenticado' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('bio')
    .eq('id', user.id)
    .single();

  let details: any = {};
  if (profile?.bio) {
    try {
      const parsed = JSON.parse(profile.bio);
      if (typeof parsed === 'object' && parsed !== null) details = parsed;
    } catch {}
  }

  const lastReadOrders = { ...(details.last_read_orders || {}) };
  const now = new Date().toISOString();
  orderIds.forEach((id) => {
    lastReadOrders[id] = now;
  });

  details.last_read_orders = lastReadOrders;

  await supabase
    .from('profiles')
    .update({
      bio: JSON.stringify(details),
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  revalidatePath('/vendedor/pedidos');
  revalidatePath('/', 'layout');
  return { success: true };
}
