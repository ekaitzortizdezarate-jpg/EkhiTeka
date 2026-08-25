'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateEventDetails(
  eventId: string,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'No autenticado.' };
  }

  // Verificar rol de vendedor o admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'vendedor' && profile?.role !== 'admin') {
    return { error: 'Permisos insuficientes.' };
  }

  const name = (formData.get('name') as string)?.trim();
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string);
  const originRegion = (formData.get('origin_region') as string)?.trim() || 'Lekeitio / Bizkaia';
  const description = (formData.get('description') as string)?.trim();

  if (!name || isNaN(price) || isNaN(stock)) {
    return { error: 'Por favor, rellena todos los campos obligatorios del evento.' };
  }

  // 1. Actualizar el evento en la tabla products
  const { error: updateError } = await supabase
    .from('products')
    .update({
      name,
      price,
      stock,
      origin_region: originRegion,
      description,
      updated_at: new Date().toISOString(),
    })
    .eq('id', eventId)
    .eq('seller_id', user.id);

  if (updateError) {
    return { error: `Error al actualizar el evento: ${updateError.message}` };
  }

  // 2. Obtener la lista única de compradores activos para este evento
  const { data: orderItems } = await supabase
    .from('order_items')
    .select('order_id, orders!inner(id, buyer_id, status)')
    .eq('product_id', eventId);

  const activeBuyerIds = new Set<string>();
  if (orderItems) {
    for (const item of orderItems) {
      const order = item.orders as any;
      if (order && order.status !== 'cancelado' && order.buyer_id) {
        activeBuyerIds.add(order.buyer_id);
      }
    }
  }

  // 3. Notificar automáticamente a cada participante a través del chat
  const notificationMessage = `📢 AVISO DE MODIFICACIÓN EN TU EVENTO / CATA:\n\nSe han actualizado los datos del evento "${name}".\n\n📌 Nuevos detalles:\n${description || 'Consulta la ficha actualizada del evento.'}\n\nSi tienes cualquier duda con respecto a la fecha, aforo o plazas, puedes consultarnos directamente por este chat.`;

  const chatPromises = Array.from(activeBuyerIds).map((buyerId) =>
    supabase.from('chat_messages').insert({
      sender_id: user.id,
      receiver_id: buyerId,
      product_id: eventId,
      message: notificationMessage,
      is_read: false,
    })
  );

  await Promise.all(chatPromises);

  revalidatePath('/vendedor/eventos');
  revalidatePath('/tienda');
  revalidatePath('/experiencias');
  revalidatePath(`/producto/${eventId}`);
  revalidatePath('/');

  return { success: true, notifiedCount: activeBuyerIds.size };
}

export async function removeEventParticipant(
  orderItemId: string,
  eventId: string,
  reason?: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'No autenticado.' };
  }

  // 1. Obtener la reserva, comprador y cantidad de plazas
  const { data: itemData, error: itemError } = await supabase
    .from('order_items')
    .select(`
      id,
      quantity,
      order_id,
      orders (
        id,
        buyer_id,
        status
      ),
      products (
        id,
        name,
        stock
      )
    `)
    .eq('id', orderItemId)
    .single();

  if (itemError || !itemData) {
    return { error: 'No se ha encontrado la reserva a eliminar.' };
  }

  const order = itemData.orders as any;
  const product = itemData.products as any;
  const buyerId = order?.buyer_id;
  const quantity = itemData.quantity || 1;

  // 2. Marcar el pedido como cancelado
  if (order?.id) {
    await supabase
      .from('orders')
      .update({
        status: 'cancelado',
        cancel_reason: reason || 'Cancelado y eliminado del evento por el organizador.',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);
  }

  // 3. Restaurar las plazas al stock disponible del evento
  if (product?.id) {
    const newStock = (product.stock ?? 0) + quantity;
    await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', product.id);
  }

  // 4. Notificar automáticamente al comprador por chat
  if (buyerId) {
    const cancellationMsg = `⚠️ CANCELACIÓN DE PLAZAS:\n\nTu reserva de ${quantity} plaza(s) para el evento "${product?.name || 'Cata / Evento'}" ha sido dada de baja por el organizador.${
      reason ? `\n\nMotivo: ${reason}` : ''
    }\n\nSi necesitas más información o deseas cambiar de fecha, escríbenos directamente por aquí.`;

    await supabase.from('chat_messages').insert({
      sender_id: user.id,
      receiver_id: buyerId,
      product_id: eventId,
      order_id: order?.id || null,
      message: cancellationMsg,
      is_read: false,
    });
  }

  revalidatePath('/vendedor/eventos');
  revalidatePath('/vendedor/pedidos');
  revalidatePath('/comprador/pedidos');
  revalidatePath('/tienda');
  revalidatePath('/');

  return { success: true };
}