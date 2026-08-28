'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { sendMessage, markChatAsRead, deleteChatConversation } from '@/app/actions/chat';
import type { ChatMessage, Profile, Product, Order } from '@/types/database';
import { Send, ArrowLeft, Store, Package, User, Trash2, X, AlertTriangle } from 'lucide-react';

interface ChatConversationViewProps {
  currentUserId: string;
  receiverId: string;
  recipient: Profile | null;
  isSellerViewer?: boolean;
  sellerMap?: Record<string, { full_name: string; avatar_url?: string }>;
  initialMessages: ChatMessage[];
  contextProduct?: Product | null;
  contextOrder?: Order | null;
  lastReadTimestamp?: string | null;
}

export function ChatConversationView({
  currentUserId,
  receiverId,
  recipient,
  isSellerViewer = false,
  sellerMap = {},
  initialMessages,
  contextProduct,
  contextOrder,
  lastReadTimestamp = null,
}: ChatConversationViewProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMsg, setInputMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const chatCardRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isInitialMount = useRef(true);

  // Primer mensaje no leído más antiguo
  const firstUnreadMsg = initialMessages.find((m) => {
    if (m.sender_id === currentUserId) return false;
    if (lastReadTimestamp) {
      return new Date(m.created_at).getTime() > new Date(lastReadTimestamp).getTime();
    }
    return !m.is_read;
  });

  const scrollMessagesToTarget = (smooth = false) => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // 1. Si hay un mensaje nuevo no leído, scroll hasta él
    if (firstUnreadMsg) {
      const el = document.getElementById(`chat-msg-${firstUnreadMsg.id}`);
      if (el) {
        const unreadRect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const offset = unreadRect.top - containerRect.top;
        container.scrollTo({
          top: Math.max(0, container.scrollTop + offset - 16),
          behavior: smooth ? 'smooth' : 'auto',
        });
        return;
      }
    }

    // 2. Si no hay mensajes sin leer, scroll hasta el final del todo
    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  const alignPageHeader = () => {
    if (chatCardRef.current) {
      const navbar = document.querySelector('header');
      const navHeight = navbar ? navbar.getBoundingClientRect().height : 105;
      const cardRect = chatCardRef.current.getBoundingClientRect();
      const targetScrollY = window.scrollY + cardRect.top - navHeight - 12;
      window.scrollTo({
        top: Math.max(0, targetScrollY),
        behavior: 'auto',
      });
    }
  };

  useEffect(() => {
    // 1. Marcar como leído en BD / perfil
    markChatAsRead(receiverId).then(() => {
      window.dispatchEvent(new CustomEvent('ekhiteka_chat_read', { detail: { receiverId } }));
    });

    // 2. Ejecutar alineación inicial inmediata
    alignPageHeader();
    scrollMessagesToTarget(false);

    // 3. Re-ejecutar tras montaje de DOM y renderizado de imágenes para garantizar posición exacta
    const t1 = setTimeout(() => {
      alignPageHeader();
      scrollMessagesToTarget(true);
    }, 80);

    const t2 = setTimeout(() => {
      scrollMessagesToTarget(false);
    }, 250);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [receiverId]);

  // Scroll al final del chat cuando se envían nuevos mensajes durante la sesión
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages.length]);

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(isSellerViewer ? '/chat' : '/tienda');
    }
  };

  const handleDeleteConversation = async () => {
    if (deleting) return;
    setDeleting(true);
    const res = await deleteChatConversation(receiverId);
    setDeleting(false);
    setDeleteModalOpen(false);

    if (res?.error) {
      alert(`${t.common_error}: ${res.error}`);
    } else {
      router.push('/chat');
      router.refresh();
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputMsg.trim();
    if (!text || sending) return;

    const tempMsg: ChatMessage = {
      id: 'temp_' + Date.now(),
      sender_id: currentUserId,
      receiver_id: receiverId,
      product_id: contextProduct?.id || null,
      order_id: contextOrder?.id || null,
      message: text,
      created_at: new Date().toISOString(),
      is_read: false,
    };

    setMessages((prev) => [...prev, tempMsg]);
    setInputMsg('');
    setSending(true);

    const formData = new FormData();
    formData.append('receiver_id', receiverId);
    formData.append('message', text);
    if (contextProduct?.id) formData.append('product_id', contextProduct.id);
    if (contextOrder?.id) formData.append('order_id', contextOrder.id);

    const res = await sendMessage(formData);
    setSending(false);

    if (res?.error) {
      alert(`${t.common_error}: ` + res.error);
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
    }
  };

  return (
    <div
      ref={chatCardRef}
      className="max-w-3xl mx-auto h-[calc(100dvh-155px)] min-h-[480px] max-h-[820px] flex flex-col bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden font-serif"
    >
      {/* 1. Cabecera Chat */}
      <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-950/90 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
            aria-label={language === 'eu' ? 'Atzera' : 'Volver'}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300 font-black text-sm flex items-center justify-center border border-amber-500/30 shrink-0">
            {!isSellerViewer ? (
              <Store className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            ) : recipient?.avatar_url ? (
              <img
                src={recipient.avatar_url}
                alt={recipient.full_name}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              recipient?.full_name?.charAt(0) || 'C'
            )}
          </div>

          <div>
            <h2 className="font-black text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
              {!isSellerViewer ? (
                <span>EkhiTeka</span>
              ) : (
                <span>{recipient?.full_name || 'Cliente EkhiTeka'}</span>
              )}
            </h2>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 font-sans">
              {!isSellerViewer ? (
                <span>{language === 'eu' ? 'Denda Ofiziala · Lekeitio' : 'Tienda Oficial · Lekeitio'}</span>
              ) : (
                <span>{language === 'eu' ? 'Bezeroa' : 'Cliente'}{recipient?.town ? ` · ${recipient.town}` : ''}{recipient?.phone ? ` · Tel: ${recipient.phone}` : ''}</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSellerViewer && (
            <>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer border border-transparent hover:border-red-200 dark:hover:border-red-800"
                title={language === 'eu' ? 'Ezabatu elkarrizketa' : 'Eliminar conversación'}
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 rounded-full text-[11px] font-bold">
                <Store className="w-3.5 h-3.5" />
                <span>{language === 'eu' ? 'Dendako Txata' : 'Chat de la Tienda'}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Tarjeta Contextual (Si se abrió desde un Producto o Pedido) */}
      {contextProduct && (
        <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/50 flex items-center gap-3 text-xs shrink-0">
          {contextProduct.image_url ? (
            <img
              src={contextProduct.image_url}
              alt={contextProduct.name}
              className="w-10 h-10 rounded-xl object-cover border border-amber-300 dark:border-amber-700 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900 text-amber-700 flex items-center justify-center font-bold">
              🧀
            </div>
          )}
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
              {t.chat_about_product}:
            </span>
            <span className="font-black text-stone-900 dark:text-stone-100 truncate block">
              {contextProduct.name} ({Number(contextProduct.price).toFixed(2)} €)
            </span>
          </div>
        </div>
      )}

      {contextOrder && (
        <div className="p-3 bg-stone-100 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-600" />
            <span className="font-black text-stone-900 dark:text-stone-100">
              {t.chat_about_order} #{contextOrder.id.slice(0, 8)}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-lg bg-stone-200 dark:bg-stone-700 font-extrabold text-[10px] uppercase text-stone-800 dark:text-stone-200 font-sans">
            {contextOrder.status}
          </span>
        </div>
      )}

      {/* 3. Lista de Mensajes con Contenedor de Scroll Interno */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-sans">
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            // Para el vendedor: saber si el mensaje fue enviado por el comprador o por otro vendedor
            const isFromBuyer = isSellerViewer && msg.sender_id === receiverId;
            const isFromOtherSeller = isSellerViewer && !isMe && !isFromBuyer;
            const isFirstUnread = firstUnreadMsg && msg.id === firstUnreadMsg.id;

            return (
              <div key={msg.id} id={`chat-msg-${msg.id}`} className="space-y-1">
                {/* Separador visual si es el primer mensaje nuevo sin leer */}
                {isFirstUnread && (
                  <div className="w-full flex items-center justify-center my-3">
                    <div className="h-px bg-amber-400/40 flex-1" />
                    <span className="px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 font-bold text-[10px] uppercase tracking-wider font-serif">
                      {language === 'eu' ? 'Mezu berriak' : 'Nuevos mensajes'}
                    </span>
                    <div className="h-px bg-amber-400/40 flex-1" />
                  </div>
                )}

                <div
                  className={`flex flex-col ${isMe || (!isSellerViewer && isMe) ? 'items-end' : isFromOtherSeller ? 'items-end' : 'items-start'}`}
                >
                  {/* Nombre de autor visible para vendedores */}
                  {isSellerViewer ? (
                    <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 mb-1 px-1">
                      {isMe
                        ? (language === 'eu' ? 'Zuk' : 'Tú')
                        : isFromBuyer
                        ? (recipient?.full_name || 'Cliente')
                        : `${sellerMap[msg.sender_id]?.full_name || 'Vendedor'} (Vendedor)`}
                    </span>
                  ) : (
                    !isMe && (
                      <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 mb-1 px-1 flex items-center gap-1 font-serif">
                        <Store className="w-3 h-3" /> EkhiTeka
                      </span>
                    )
                  )}

                  <div
                    className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                      isMe
                        ? 'bg-amber-600 text-white rounded-tr-none font-medium'
                        : isFromOtherSeller
                        ? 'bg-amber-100 dark:bg-amber-950/70 border-2 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-100 rounded-tr-none font-medium'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 rounded-tl-none font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                    <span
                      className={`text-[9.5px] font-bold block text-right mt-1.5 ${
                        isMe
                          ? 'text-amber-200'
                          : isFromOtherSeller
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-stone-400'
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400 space-y-2">
            <Store className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto" />
            <p className="text-sm font-bold text-stone-600 dark:text-stone-400">
              {t.chat_no_messages}
            </p>
            <p className="text-xs text-stone-400">
              {isSellerViewer
                ? (language === 'eu' ? 'Idatzi mezu bat bezeroari erantzuteko.' : 'Escribe un mensaje para responder al cliente.')
                : (language === 'eu' ? 'Galdetu dendari zure zalantzak hemen.' : 'Envía tu consulta y el equipo de artesanos te responderá enseguida.')}
            </p>
          </div>
        )}
      </div>

      {/* 4. Input de Envío */}
      <form
        ref={formRef}
        onSubmit={handleSend}
        className="p-3 sm:p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-950/90 flex gap-2 font-sans shrink-0"
      >
        <input
          name="message"
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder={isSellerViewer ? (language === 'eu' ? 'Idatzi erantzuna bezeroari...' : 'Escribe una respuesta al cliente...') : t.chat_type_message}
          className="flex-1 px-4 py-2.5 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
        />
        <button
          type="submit"
          disabled={sending || !inputMsg.trim()}
          className="px-5 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] disabled:opacity-50 text-[#1D1D1B] rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 font-black text-xs shrink-0 cursor-pointer font-serif uppercase tracking-wider"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{language === 'eu' ? 'Bidali' : 'Enviar'}</span>
        </button>
      </form>

      {/* Modal de Confirmación para Eliminar Conversación */}
      {deleteModalOpen && (
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
                onClick={() => setDeleteModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-sm text-stone-600 dark:text-stone-300">
              <p>
                {language === 'eu'
                  ? `Ziur zaude "${recipient?.full_name || 'erabiltzaile honekin'}" elkarrizketa osoa ezabatu nahi duzula?`
                  : `¿Estás seguro de que deseas eliminar todo el historial de chat con "${recipient?.full_name || 'este usuario'}"?`}
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
                disabled={deleting}
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                {language === 'eu' ? 'Utzi' : 'Cancelar'}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConversation}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleting ? (language === 'eu' ? 'Ezabatzen...' : 'Eliminando...') : (language === 'eu' ? 'Ezabatu Txata' : 'Eliminar Chat')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
