import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ChatConversationView } from '@/components/ChatConversationView';
import { markChatAsRead } from '@/app/actions/chat';
import { getUnifiedStoreConfig } from '@/app/actions/auth';
import { type ChatMessage, type Profile, type Product, type Order, parseProfile } from '@/types/database';

export const revalidate = 0;

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

  // 1. Obtener mi perfil, todos los perfiles de vendedores y la configuración de la tienda
  const [myProfileRes, allSellersRes, storeConfig] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('profiles').select('*').in('role', ['vendedor', 'admin']),
    getUnifiedStoreConfig(supabase),
  ]);

  const currentProfile = parseProfile(myProfileRes?.data);
  const isSeller = currentProfile.role === 'vendedor' || currentProfile.role === 'admin';
  const allSellers = allSellersRes?.data || [];
  const mainSeller = allSellers[0] || { id: 'store', full_name: 'EkhiTeka', role: 'vendedor' };

  // Mapa de vendedores para mostrar nombres reales entre los propios vendedores
  const sellerMap: Record<string, { full_name: string; avatar_url?: string }> = {};
  allSellers.forEach((s) => {
    sellerMap[s.id] = {
      full_name: s.full_name || 'Vendedor EkhiTeka',
      avatar_url: s.avatar_url,
    };
  });

  let recipientProfile: Profile | null = null;
  let targetReceiverId = receiverId;
  let messagesData: ChatMessage[] = [];

  if (isSeller) {
    // EL VISOR ES UN VENDEDOR: Está chateando con un cliente (receiverId = buyerId)
    if (receiverId && receiverId !== 'store' && receiverId !== 'null') {
      const { data: recipientRaw } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', receiverId)
        .maybeSingle();

      if (recipientRaw) {
        recipientProfile = parseProfile(recipientRaw);
      }
    }

    if (!recipientProfile) {
      recipientProfile = {
        id: receiverId,
        full_name: 'Cliente EkhiTeka',
        role: 'comprador',
      } as Profile;
    }

    targetReceiverId = receiverId;

    // Ver todos los mensajes entre este cliente y CUALQUIER vendedor de la tienda
    if (receiverId) {
      const { data: rawMsgs } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`sender_id.eq.${receiverId},receiver_id.eq.${receiverId}`)
        .order('created_at', { ascending: true });

      messagesData = (rawMsgs || []) as ChatMessage[];
      await markChatAsRead(receiverId);
    }
  } else {
    // EL VISOR ES UN COMPRADOR: Siempre chatea con la entidad unificada "EkhiTeka"
    targetReceiverId = mainSeller.id || receiverId || 'store';

    recipientProfile = {
      ...parseProfile(mainSeller),
      id: targetReceiverId,
      full_name: 'EkhiTeka',
      role: 'vendedor',
      avatar_url: '/Logo.jpg',
      phone: storeConfig.whatsapp_phone || null,
      town: 'Lekeitio',
    } as Profile;

    // Ver todos los mensajes del comprador con la tienda
    const { data: rawMsgs } = await supabase
      .from('chat_messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: true });

    messagesData = (rawMsgs || []) as ChatMessage[];
    await markChatAsRead(targetReceiverId);
  }

  // Contexto opcional: Producto
  let contextProduct: Product | null = null;
  if (product_id) {
    const { data: p } = await supabase.from('products').select('*').eq('id', product_id).maybeSingle();
    if (p) contextProduct = p as Product;
  }

  // Contexto opcional: Pedido
  let contextOrder: Order | null = null;
  if (order_id) {
    const { data: o } = await supabase.from('orders').select('*').eq('id', order_id).maybeSingle();
    if (o) contextOrder = o as Order;
  }

  return (
    <ChatConversationView
      currentUserId={user.id}
      receiverId={targetReceiverId}
      recipient={recipientProfile}
      isSellerViewer={isSeller}
      sellerMap={sellerMap}
      initialMessages={messagesData}
      contextProduct={contextProduct}
      contextOrder={contextOrder}
    />
  );
}
