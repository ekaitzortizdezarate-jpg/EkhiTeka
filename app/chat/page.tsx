import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ChatInboxView, type InboxConversation } from '@/components/ChatInboxView';
import { type Profile, parseProfile } from '@/types/database';

export default async function ChatInboxPage({
  searchParams,
}: {
  searchParams?: Promise<{ product_id?: string; order_id?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const sp = searchParams ? await searchParams : {};
  const queryParams = new URLSearchParams();
  if (sp.product_id) queryParams.set('product_id', sp.product_id);
  if (sp.order_id) queryParams.set('order_id', sp.order_id);
  const qs = queryParams.toString() ? `?${queryParams.toString()}` : '';

  // 1. Obtener perfil del usuario actual y todos los vendedores
  const [myProfileRes, allSellersRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('profiles').select('*').in('role', ['vendedor', 'admin']),
  ]);

  const currentProfile = parseProfile(myProfileRes?.data);
  const isSeller = currentProfile.role === 'vendedor' || currentProfile.role === 'admin';
  const allSellers = allSellersRes.data || [];
  const sellerIds = new Set(allSellers.map((s) => s.id));

  // Mapa de nombres de vendedores para preview de respuestas
  const sellerNameMap = new Map<string, string>();
  allSellers.forEach((s) => {
    sellerNameMap.set(s.id, s.full_name || 'Vendedor');
  });

  const lastReadMap = currentProfile.last_read_chats || {};

  // 2. Si es VENDEDOR: ver todas las conversaciones de compradores con la tienda
  if (isSeller) {
    const [{ data: allMessages }, { data: allProfiles }] = await Promise.all([
      supabase.from('chat_messages').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*'),
    ]);

    const profilesMap = new Map<string, any>();
    (allProfiles || []).forEach((p) => {
      profilesMap.set(p.id, p);
    });

    const conversationsMap = new Map<string, InboxConversation>();

    if (allMessages) {
      for (const msg of allMessages) {
        // Identificar el comprador en esta conversación
        const isSenderSeller = sellerIds.has(msg.sender_id);
        const buyerId = isSenderSeller ? msg.receiver_id : msg.sender_id;
        const buyerRaw = buyerId ? profilesMap.get(buyerId) : null;

        if (!buyerId) continue;
        // Si ambos son vendedores y no hay cliente, saltar
        if (sellerIds.has(msg.sender_id) && sellerIds.has(msg.receiver_id) && msg.sender_id === msg.receiver_id) {
          continue;
        }

        const myLastRead = lastReadMap[buyerId] ? new Date(lastReadMap[buyerId]).getTime() : 0;
        const msgTime = new Date(msg.created_at).getTime();
        // Es no leído para este vendedor si el mensaje fue enviado por el comprador o por otro vendedor y es posterior a myLastRead
        const isUnreadForMe = msg.sender_id !== user.id && msgTime > myLastRead;

        let displayLastMessage = msg.message;
        if (isSenderSeller) {
          const sellerName = msg.sender_id === user.id ? 'Tú' : sellerNameMap.get(msg.sender_id) || 'Vendedor';
          displayLastMessage = `${sellerName}: ${msg.message}`;
        }

        if (!conversationsMap.has(buyerId)) {
          conversationsMap.set(buyerId, {
            otherUser: parseProfile(buyerRaw || { id: buyerId, full_name: 'Cliente EkhiTeka' }),
            lastMessage: displayLastMessage,
            lastMessageTime: msg.created_at,
            unreadCount: isUnreadForMe ? 1 : 0,
          });
        } else {
          const existing = conversationsMap.get(buyerId)!;
          if (isUnreadForMe) {
            existing.unreadCount += 1;
          }
        }
      }
    }

    const conversations = Array.from(conversationsMap.values());
    return <ChatInboxView conversations={conversations} isSellerViewer={true} />;
  }

  // 3. Si es COMPRADOR: Redirigir directamente a la sala de chat unificada con "EkhiTeka"
  const mainSeller = allSellers[0] || { id: 'store' };
  redirect(`/chat/${mainSeller.id}${qs}`);
}
