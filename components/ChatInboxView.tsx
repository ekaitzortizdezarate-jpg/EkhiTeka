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
}

export function ChatInboxView({ conversations }: ChatInboxViewProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b-2 border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-2xl">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-stone-900 dark:text-stone-100">
                {t.chat_title}
              </h1>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Consultas directas sobre productos, pedidos y asesoramiento.
              </p>
            </div>
          </div>

          <span className="text-xs font-black bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-3 py-1 rounded-full border border-stone-200 dark:border-stone-700">
            {conversations.length}
          </span>
        </div>

        {/* Conversation List */}
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {conversations.length > 0 ? (
            conversations.map((conv) => {
              const { otherUser, lastMessage, lastMessageTime, unreadCount } = conv;
              const isSeller = otherUser.role === 'vendedor';

              return (
                <Link
                  key={otherUser.id}
                  href={`/chat/${otherUser.id}`}
                  className={`p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-stone-50 dark:hover:bg-stone-850 transition-colors ${
                    unreadCount > 0 ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
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
                        ) : (
                          otherUser.full_name?.charAt(0) || 'U'
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-sm font-black text-stone-900 dark:text-stone-100 truncate">
                          {otherUser.full_name}
                        </h2>
                        {isSeller ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-700">
                            <Store className="w-3 h-3" /> Artesano
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-md border border-stone-200 dark:border-stone-700">
                            <User className="w-3 h-3" /> Cliente
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-400 truncate max-w-md">
                        {lastMessage}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-bold text-stone-400 block">
                      {new Date(lastMessageTime).toLocaleDateString([], {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                    <ArrowRight className="w-4 h-4 text-stone-400 ml-auto mt-1" />
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="py-16 text-center text-stone-400 p-6 space-y-2">
              <MessageCircle className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto" />
              <p className="text-sm font-bold text-stone-600 dark:text-stone-400">
                {t.chat_no_messages}
              </p>
              <p className="text-xs text-stone-400">
                Cuando consultes a un artesano o hagas un pedido, tus mensajes aparecerán aquí.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
