'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function sendMessage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'No autenticado' };
  }

  const receiverId = formData.get('receiver_id') as string;
  const message = formData.get('message') as string;
  const productId = (formData.get('product_id') as string) || null;
  const orderId = (formData.get('order_id') as string) || null;

  if (!message || !message.trim()) {
    return { error: 'El mensaje no puede estar vacío' };
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      sender_id: user.id,
      receiver_id: receiverId,
      product_id: productId,
      order_id: orderId,
      message: message.trim(),
      is_read: false,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/chat/${receiverId}`);
  revalidatePath('/chat');
  return { success: true, message: data };
}

export async function markChatAsRead(senderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false };

  await supabase
    .from('chat_messages')
    .update({ is_read: true })
    .eq('sender_id', senderId)
    .eq('receiver_id', user.id)
    .eq('is_read', false);

  revalidatePath('/chat');
  return { success: true };
}
