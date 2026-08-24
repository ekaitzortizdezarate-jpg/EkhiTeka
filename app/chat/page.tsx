import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ChatInboxView, InboxConversation } from '@/components/ChatInboxView';
import type { Profile } from '@/types/database';

export default async function ChatInboxPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Obtener todos los mensajes donde el usuario es remitente o receptor
  const { data: rawMessages } = await supabase
    .from('chat_messages')
    .select('*, sender:profiles!chat_messages_sender_id_fkey(*), receiver:profiles!chat_messages_receiver_id_fkey(*)')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  // Agrupar por el otro usuario
  const conversationsMap = new Map<string, InboxConversation>();

  if (rawMessages) {
    for (const msg of rawMessages) {
      const otherUser = msg.sender_id === user.id ? msg.receiver : msg.sender;
      if (!otherUser) continue;

      if (!conversationsMap.has(otherUser.id)) {
        conversationsMap.set(otherUser.id, {
          otherUser: otherUser as Profile,
          lastMessage: msg.message,
          lastMessageTime: msg.created_at,
          unreadCount: msg.receiver_id === user.id && !msg.is_read ? 1 : 0,
        });
      } else {
        const existing = conversationsMap.get(otherUser.id)!;
        if (msg.receiver_id === user.id && !msg.is_read) {
          existing.unreadCount += 1;
        }
      }
    }
  }

  const conversations = Array.from(conversationsMap.values());

  return <ChatInboxView conversations={conversations} />;
}
