'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { sendMessage } from '@/app/actions/chat';
import type { ChatMessage, Profile, Product, Order } from '@/types/database';
import { Send, ArrowLeft, Store, Package, MapPin } from 'lucide-react';

interface ChatConversationViewProps {
  currentUserId: string;
  receiverId: string;
  recipient: Profile | null;
  initialMessages: ChatMessage[];
  contextProduct?: Product | null;
  contextOrder?: Order | null;
}

export function ChatConversationView({
  currentUserId,
  receiverId,
  recipient,
  initialMessages,
  contextProduct,
  contextOrder,
}: ChatConversationViewProps) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMsg, setInputMsg] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

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
    <div className="max-w-2xl mx-auto h-[80vh] flex flex-col bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
      {/* 1. Cabecera Chat */}
      <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300 font-black text-sm flex items-center justify-center border border-amber-500/30 shrink-0">
            {recipient?.avatar_url ? (
              <img
                src={recipient.avatar_url}
                alt={recipient.full_name}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              recipient?.full_name?.charAt(0) || 'U'
            )}
          </div>
          <div>
            <h2 className="font-black text-stone-900 dark:text-stone-100 text-sm">
              {recipient?.full_name || 'EkhiTeka Usuario'}
            </h2>
            <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              {recipient?.role === 'vendedor' ? 'Artesano / Productor' : 'Cliente'} · {recipient?.town || 'Lekeitio'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Tarjeta Contextual (Si se abrió desde un Producto o Pedido) */}
      {contextProduct && (
        <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800/50 flex items-center gap-3 text-xs">
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
        <div className="p-3 bg-stone-100 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-600" />
            <span className="font-black text-stone-900 dark:text-stone-100">
              {t.chat_about_order} #{contextOrder.id.slice(0, 8)}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-lg bg-stone-200 dark:bg-stone-700 font-extrabold text-[10px] uppercase text-stone-800 dark:text-stone-200">
            {contextOrder.status}
          </span>
        </div>
      )}

      {/* 3. Lista de Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                    isMe
                      ? 'bg-amber-600 text-white rounded-tr-none font-medium'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 rounded-tl-none font-medium'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                  <span
                    className={`text-[9px] font-bold block text-right mt-1 ${
                      isMe ? 'text-amber-200' : 'text-stone-400'
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400 space-y-2">
            <p className="text-xs font-semibold">{t.chat_no_messages}</p>
            <p className="text-[11px] text-stone-400">{t.chat_type_message}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Input de Envío */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/80 flex gap-2"
      >
        <input
          name="message"
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder={t.chat_type_message}
          className="flex-1 px-4 py-2.5 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
        />
        <button
          type="submit"
          disabled={sending || !inputMsg.trim()}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-all flex items-center justify-center gap-1 font-black text-xs shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{t.chat_send}</span>
        </button>
      </form>
    </div>
  );
}
