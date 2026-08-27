'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import type { Profile } from '@/types/database';
import { MessageCircle, Store, User, ArrowRight } from 'lucide-react';

export interface InboxConversation {
  otherUser: Profile;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface ChatInboxViewProps {
  conversations: InboxConversation[];
  isSellerViewer?: boolean;
}

export function ChatInboxView({ conversations, isSellerViewer = false }: ChatInboxViewProps) {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6 font-serif">
      <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b-2 border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-2xl">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
                {isSellerViewer
                  ? (language === 'eu' ? 'Bezeroen Kontsultak eta Mezuak' : 'Consultas y Mensajes de Clientes')
                  : (language === 'eu' ? 'EkhiTeka Dendarekin Txata' : 'Chat con EkhiTeka')}
              </h1>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                {isSellerViewer
                  ? (language === 'eu' ? 'Dendako mezu guztiak hemen zentralizatzen dira saltzaile guztientzat.' : 'Todos los mensajes de la tienda centralizados para el equipo de vendedores.')
                  : (language === 'eu' ? 'Arreta zuzena dendako artisau eta ekoizleekin.' : 'Atención y asesoramiento directo con los artesanos y productores de la tienda.')}
              </p>
            </div>
          </div>

          <span className="text-xs font-black bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-3 py-1 rounded-full border border-stone-200 dark:border-stone-700 font-sans">
            {conversations.length} {conversations.length === 1 ? (language === 'eu' ? 'elkarrizketa' : 'chat') : (language === 'eu' ? 'elkarrizketa' : 'chats')}
          </span>
        </div>

        {/* Conversation List */}
        <div className="divide-y divide-stone-100 dark:divide-stone-800 font-sans">
          {conversations.length > 0 ? (
            conversations.map((conv) => {
              const { otherUser, lastMessage, lastMessageTime, unreadCount } = conv;
              const isOtherUserSeller = otherUser.role === 'vendedor' || otherUser.role === 'admin';

              return (
                <Link
                  key={otherUser.id}
                  href={`/chat/${otherUser.id}`}
                  className={`p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-stone-50 dark:hover:bg-stone-850 transition-colors ${
                    unreadCount > 0 ? 'bg-amber-50/60 dark:bg-amber-950/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300 font-black text-base flex items-center justify-center border-2 border-amber-500/30">
                        {otherUser.avatar_url ? (
                          <img
                            src={otherUser.avatar_url}
                            alt={otherUser.full_name}
                            className="w-full h-full rounded-2xl object-cover"
                          />
                        ) : isOtherUserSeller ? (
                          <Store className="w-6 h-6 text-amber-600" />
                        ) : (
                          otherUser.full_name?.charAt(0) || 'C'
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 min-w-[20px] h-5 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse shadow-md font-sans">
                          {unreadCount}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-sm font-black text-stone-900 dark:text-stone-100 truncate">
                          {!isSellerViewer && isOtherUserSeller ? 'EkhiTeka' : otherUser.full_name}
                        </h2>
                        {isOtherUserSeller ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-700 font-serif">
                            <Store className="w-3 h-3" /> {language === 'eu' ? 'Denda / Artisaua' : 'Tienda / Artesano'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-md border border-stone-200 dark:border-stone-700 font-serif">
                            <User className="w-3 h-3" /> {language === 'eu' ? 'Bezeroa' : 'Cliente'} {otherUser.town ? `· ${otherUser.town}` : ''}
                          </span>
                        )}

                        {unreadCount > 0 && (
                          <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                            {language === 'eu' ? 'Mezu berria' : 'Nuevo mensaje'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-400 truncate max-w-md">
                        {lastMessage}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-serif">
                    <span className="text-[11px] font-bold text-stone-400 block font-sans">
                      {lastMessageTime
                        ? new Date(lastMessageTime).toLocaleDateString([], {
                            day: '2-digit',
                            month: 'short',
                          })
                        : ''}
                    </span>
                    <ArrowRight className="w-4 h-4 text-stone-400 ml-auto mt-1" />
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="py-16 text-center text-stone-400 p-6 space-y-2 font-sans">
              <MessageCircle className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto" />
              <p className="text-sm font-bold text-stone-600 dark:text-stone-400">
                {t.chat_no_messages}
              </p>
              <p className="text-xs text-stone-400">
                {isSellerViewer
                  ? (language === 'eu' ? 'Bezero batek mezu bat bidaltzen duenean, hemen agertuko da saltzaile guztientzat.' : 'Cuando un cliente escriba a la tienda, aparecerá aquí para todos los vendedores.')
                  : (language === 'eu' ? 'Produktuei edo eskaerei buruz galdetu eta zure mezuak hemen agertuko dira.' : 'Consulta sobre productos o pedidos y tus mensajes con la tienda aparecerán aquí.')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
