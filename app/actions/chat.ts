'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ProfileDetails } from '@/types/database';

export async function sendMessage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'No autenticado' };
  }

  let receiverId = (formData.get('receiver_id') as string)?.trim();
  const message = (formData.get('message') as string)?.trim();
  const productId = (formData.get('product_id') as string) || null;
  const orderId = (formData.get('order_id') as string) || null;

  if (!message) {
    return { error: 'El mensaje no puede estar vacío' };
  }

  if (!receiverId || receiverId === 'store' || receiverId === 'null' || receiverId === 'undefined') {
    const { data: firstSeller } = await supabase
      .from('profiles')
      .select('id')
      .in('role', ['vendedor', 'admin'])
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    receiverId = firstSeller?.id || user.id;
  }

  const now = new Date().toISOString();

  // 1. Insertar mensaje en chat_messages
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      sender_id: user.id,
      receiver_id: receiverId,
      product_id: productId,
      order_id: orderId,
      message: message,
      is_read: false,
    })
    .select('*')
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  // 2. Actualizar marca de tiempo de lectura para el emisor (así no se le marca como no leído su propio mensaje)
  const { data: profileRaw } = await supabase
    .from('profiles')
    .select('bio')
    .eq('id', user.id)
    .single();

  let details: Partial<ProfileDetails> = {};
  if (profileRaw?.bio) {
    try {
      const parsed = JSON.parse(profileRaw.bio);
      if (typeof parsed === 'object' && parsed !== null) {
        details = parsed;
      }
    } catch {}
  }

  const lastReadChats = { ...(details.last_read_chats || {}), [receiverId]: now };
  await supabase
    .from('profiles')
    .update({
      bio: JSON.stringify({
        ...details,
        last_read_chats: lastReadChats,
      }),
      updated_at: now,
    })
    .eq('id', user.id);

  revalidatePath(`/chat/${receiverId}`);
  revalidatePath(`/chat/${user.id}`);
  revalidatePath('/chat');
  return { success: true, message: data };
}

export async function markChatAsRead(conversationUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false };

  if (!conversationUserId || conversationUserId === 'store' || conversationUserId === 'null' || conversationUserId === 'undefined') {
    return { success: true };
  }

  const now = new Date().toISOString();

  // 1. Actualizar last_read_chats del usuario actual en profiles.bio
  const { data: profileRaw } = await supabase
    .from('profiles')
    .select('bio')
    .eq('id', user.id)
    .maybeSingle();

  let details: Partial<ProfileDetails> = {};
  if (profileRaw?.bio) {
    try {
      const parsed = JSON.parse(profileRaw.bio);
      if (typeof parsed === 'object' && parsed !== null) {
        details = parsed;
      }
    } catch {}
  }

  const lastReadChats = { ...(details.last_read_chats || {}), [conversationUserId]: now };
  await supabase
    .from('profiles')
    .update({
      bio: JSON.stringify({
        ...details,
        last_read_chats: lastReadChats,
      }),
      updated_at: now,
    })
    .eq('id', user.id);

  // 2. Marcar en la BD los mensajes dirigidos a este usuario como leídos
  await supabase
    .from('chat_messages')
    .update({ is_read: true })
    .eq('sender_id', conversationUserId)
    .eq('receiver_id', user.id)
    .eq('is_read', false);

  revalidatePath('/chat');
  revalidatePath(`/chat/${conversationUserId}`);
  return { success: true };
}

export async function deleteChatConversation(conversationPartnerId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'No autenticado' };

  const { data: myProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const isSeller = myProfile?.role === 'vendedor' || myProfile?.role === 'admin';
  if (!isSeller) {
    return { error: 'Solo los vendedores pueden eliminar conversaciones de chat' };
  }

  if (!conversationPartnerId) {
    return { error: 'Identificador de chat no válido' };
  }

  // 1. Obtener IDs de todos los mensajes asociados a esta conversación
  const { data: msgs } = await supabase
    .from('chat_messages')
    .select('id')
    .or(`sender_id.eq.${conversationPartnerId},receiver_id.eq.${conversationPartnerId}`);

  if (msgs && msgs.length > 0) {
    const ids = msgs.map((m) => m.id);
    const { error: delIdsError } = await supabase
      .from('chat_messages')
      .delete()
      .in('id', ids);

    if (delIdsError) {
      console.error('Error deleting chat messages by IDs:', delIdsError);
    }
  }

  // 2. Eliminar de forma directa por sender_id y receiver_id
  await supabase
    .from('chat_messages')
    .delete()
    .eq('sender_id', conversationPartnerId);

  await supabase
    .from('chat_messages')
    .delete()
    .eq('receiver_id', conversationPartnerId);

  revalidatePath('/chat');
  revalidatePath(`/chat/${conversationPartnerId}`);
  return { success: true };
}
