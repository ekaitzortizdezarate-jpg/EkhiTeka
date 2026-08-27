import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ChatInboxView, type InboxConversation } from '@/components/ChatInboxView';
import { type Profile, parseProfile } from '@/types/database';

export default async function ChatInboxPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // 1. Obtener perfil del usuario actual y todos los vendedores
  const [myProfileRes, allSellersRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('profiles').select('*').in('role', ['vendedor', 'admin']),
  ]);

  const currentProfile = parseProfile(myProfileRes.data);
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
    const { data: allMessages } = await supabase
      .from('chat_messages')
      .select('*, sender:profiles!chat_messages_sender_id_fkey(*), receiver:profiles!chat_messages_receiver_id_fkey(*)')
      .order('created_at', { ascending: false });

    const conversationsMap = new Map<string, InboxConversation>();

    if (allMessages) {
      for (const msg of allMessages) {
        // Identificar el comprador en esta conversación
        const isSenderSeller = sellerIds.has(msg.sender_id);
        const buyer = isSenderSeller ? msg.receiver : msg.sender;
        const buyerId = isSenderSeller ? msg.receiver_id : msg.sender_id;

        if (!buyerId || !buyer) continue;
        // Si ambos son vendedores y no hay cliente, saltar o tratar como cliente
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
            otherUser: parseProfile(buyer),
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

  // 3. Si es COMPRADOR: Ver conversación unificada con "EkhiTeka"
  const { data: myMessages } = await supabase
    .from('chat_messages')
    .select('*, sender:profiles!chat_messages_sender_id_fkey(*), receiver:profiles!chat_messages_receiver_id_fkey(*)')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  // Tienda oficial como destinatario
  const mainSeller = allSellers[0] || { id: 'store', full_name: 'EkhiTeka', role: 'vendedor' };
  const storeProfile: Profile = {
    ...parseProfile(mainSeller),
    id: mainSeller.id,
    full_name: 'EkhiTeka',
    role: 'vendedor',
  };

  const myLastReadStore = lastReadMap[mainSeller.id] ? new Date(lastReadMap[mainSeller.id]).getTime() : 0;

  let unreadCountForBuyer = 0;
  let lastMsgText = '';
  let lastMsgTime = '';

  if (myMessages && myMessages.length > 0) {
    const latest = myMessages[0];
    lastMsgText = latest.message;
    lastMsgTime = latest.created_at;

    myMessages.forEach((msg) => {
      const isFromSeller = msg.sender_id !== user.id;
      const msgTime = new Date(msg.created_at).getTime();
      if (isFromSeller && msgTime > myLastReadStore) {
        unreadCountForBuyer += 1;
      }
    });
  }

  const buyerConversations: InboxConversation[] = [];
  if (myMessages && myMessages.length > 0) {
    buyerConversations.push({
      otherUser: storeProfile,
      lastMessage: lastMsgText,
      lastMessageTime: lastMsgTime,
      unreadCount: unreadCountForBuyer,
    });
  }

  return <ChatInboxView conversations={buyerConversations} isSellerViewer={false} />;
}
