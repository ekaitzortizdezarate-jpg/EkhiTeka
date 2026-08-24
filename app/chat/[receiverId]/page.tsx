import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { ChatConversationView } from '@/components/ChatConversationView';
import type { ChatMessage, Profile, Product, Order } from '@/types/database';

interface ChatRoomPageProps {
  params: Promise<{ receiverId: string }>;
  searchParams: Promise<{ product_id?: string; order_id?: string }>;
}

export default async function ChatRoomPage({ params, searchParams }: ChatRoomPageProps) {
  const { receiverId } = await params;
  const { product_id, order_id } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Obtener perfil del destinatario
  const { data: recipientProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', receiverId)
    .single();

  if (!recipientProfile) {
    notFound();
  }

  // Marcar como leídos los mensajes de esta conversación
  await supabase
    .from('chat_messages')
    .update({ is_read: true })
    .eq('sender_id', receiverId)
    .eq('receiver_id', user.id)
    .eq('is_read', false);

  // Obtener mensajes de la conversación
  const { data: messagesData } = await supabase
    .from('chat_messages')
    .select('*')
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`
    )
    .order('created_at', { ascending: true });

  // Contexto opcional: Producto
  let contextProduct: Product | null = null;
  if (product_id) {
    const { data: p } = await supabase.from('products').select('*').eq('id', product_id).single();
    contextProduct = p as Product;
  }

  // Contexto opcional: Pedido
  let contextOrder: Order | null = null;
  if (order_id) {
    const { data: o } = await supabase.from('orders').select('*').eq('id', order_id).single();
    contextOrder = o as Order;
  }

  return (
    <ChatConversationView
      currentUserId={user.id}
      receiverId={receiverId}
      recipient={recipientProfile as Profile}
      initialMessages={(messagesData || []) as ChatMessage[]}
      contextProduct={contextProduct}
      contextOrder={contextOrder}
    />
  );
}
