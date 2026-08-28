'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { deleteChatConversation } from '@/app/actions/chat';
import type { Profile } from '@/types/database';
import { MessageCircle, Store, User, ArrowRight, Trash2, X, AlertTriangle } from 'lucide-react';

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
  const router = useRouter();

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    partnerId: string;
    partnerName: string;
    loading: boolean;
  }>({
    open: false,
    partnerId: '',
    partnerName: '',
    loading: false,
  });

  const handleDeleteConfirm = async () => {
    if (!deleteModal.partnerId || deleteModal.loading) return;
    setDeleteModal((prev) => ({ ...prev, loading: true }));
    const res = await deleteChatConversation(deleteModal.partnerId);
    setDeleteModal({ open: false, partnerId: '', partnerName: '', loading: false });

    if (res?.error) {
      alert(`${t.common_error}: ${res.error}`);
    } else {
      router.refresh();
    }
  };

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
                <div
                  key={otherUser.id}
                  className={`p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-stone-50 dark:hover:bg-stone-850 transition-colors ${
                    unreadCount > 0 ? 'bg-amber-50/60 dark:bg-amber-950/30' : ''
                  }`}
                >
                  <Link
                    href={`/chat/${otherUser.id}`}
                    className="flex items-center gap-3.5 min-w-0 flex-1"
                  >
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

                    <div className="min-w-0 space-y-0.5 flex-1">
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
                  </Link>

                  <div className="flex items-center gap-2 shrink-0 font-serif">
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-stone-400 block font-sans">
                        {lastMessageTime
                          ? new Date(lastMessageTime).toLocaleDateString([], {
                              day: '2-digit',
                              month: 'short',
                            })
                          : ''}
                      </span>
                    </div>

                    {isSellerViewer && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteModal({
                            open: true,
                            partnerId: otherUser.id,
                            partnerName: otherUser.full_name || 'este usuario',
                            loading: false,
                          });
                        }}
                        className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer border border-transparent hover:border-red-200 dark:hover:border-red-800 ml-1"
                        title={language === 'eu' ? 'Ezabatu elkarrizketa' : 'Eliminar conversación'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <Link
                      href={`/chat/${otherUser.id}`}
                      className="p-2 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
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

      {/* Modal de Confirmación para Eliminar Conversación */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-fadeIn">
          <div className="bg-white dark:bg-[#1C1B19] rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-stone-200 dark:border-stone-800 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-black font-serif text-stone-900 dark:text-stone-100">
                  {language === 'eu' ? 'Ezabatu txata' : 'Eliminar conversación'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDeleteModal({ open: false, partnerId: '', partnerName: '', loading: false })}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-sm text-stone-600 dark:text-stone-300">
              <p>
                {language === 'eu'
                  ? `Ziur zaude "${deleteModal.partnerName}" bezeroarekin elkarrizketa osoa ezabatu nahi duzula?`
                  : `¿Estás seguro de que deseas eliminar todo el historial de chat con "${deleteModal.partnerName}"?`}
              </p>
              <p className="text-xs text-stone-400">
                {language === 'eu'
                  ? 'Ekintza hau ezin da desegin eta mezu guztiak betiko ezabatuko dira.'
                  : 'Esta acción es irreversible y eliminará todos los mensajes de la conversación permanentemente.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100 dark:border-stone-800 font-serif">
              <button
                type="button"
                disabled={deleteModal.loading}
                onClick={() => setDeleteModal({ open: false, partnerId: '', partnerName: '', loading: false })}
                className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                {language === 'eu' ? 'Utzi' : 'Cancelar'}
              </button>
              <button
                type="button"
                disabled={deleteModal.loading}
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleteModal.loading ? (language === 'eu' ? 'Ezabatzen...' : 'Eliminando...') : (language === 'eu' ? 'Ezabatu Txata' : 'Eliminar Chat')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
