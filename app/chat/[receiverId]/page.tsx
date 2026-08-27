import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { ChatConversationView } from '@/components/ChatConversationView';
import { markChatAsRead } from '@/app/actions/chat';
import { type ChatMessage, type Profile, type Product, type Order, parseProfile } from '@/types/database';

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

  // 1. Obtener mi perfil y todos los perfiles de vendedores
  const [myProfileRes, allSellersRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('profiles').select('*').in('role', ['vendedor', 'admin']),
  ]);

  const currentProfile = parseProfile(myProfileRes.data);
  const isSeller = currentProfile.role === 'vendedor' || currentProfile.role === 'admin';
  const allSellers = allSellersRes.data || [];
  const sellerIds = new Set(allSellers.map((s) => s.id));

  // Mapa de vendedores para mostrar nombres a otros vendedores
  const sellerMap: Record<string, { full_name: string; avatar_url?: string }> = {};
  allSellers.forEach((s) => {
    sellerMap[s.id] = {
      full_name: s.full_name || 'Vendedor EkhiTeka',
      avatar_url: s.avatar_url,
    };
  });

  // 2. Obtener perfil del destinatario
  let recipientProfile: Profile | null = null;
  const { data: recipientRaw } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', receiverId)
    .single();

  if (recipientRaw) {
    recipientProfile = parseProfile(recipientRaw);
  }

  // 3. Marcar como leído en la BD y en profile.bio
  await markChatAsRead(receiverId);

  // 4. Obtener mensajes según el rol
  let messagesData: ChatMessage[] = [];

  if (isSeller) {
    // Si soy vendedor, ver todos los mensajes entre este cliente (receiverId) y CUALQUIER vendedor de la tienda
    const { data: rawMsgs } = await supabase
      .from('chat_messages')
      .select('*, sender:profiles!chat_messages_sender_id_fkey(*)')
      .or(`sender_id.eq.${receiverId},receiver_id.eq.${receiverId}`)
      .order('created_at', { ascending: true });

    messagesData = (rawMsgs || []) as ChatMessage[];
  } else {
    // Si soy comprador, ver todos los mensajes de mi conversación con la tienda
    const { data: rawMsgs } = await supabase
      .from('chat_messages')
      .select('*, sender:profiles!chat_messages_sender_id_fkey(*)')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: true });

    messagesData = (rawMsgs || []) as ChatMessage[];
  }

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
      recipient={recipientProfile}
      isSellerViewer={isSeller}
      sellerMap={sellerMap}
      initialMessages={messagesData}
      contextProduct={contextProduct}
      contextOrder={contextOrder}
    />
  );
}
