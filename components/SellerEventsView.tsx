'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { updateEventDetails, removeEventParticipant } from '@/app/actions/events';
import {
  Users,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  ArrowLeft,
  Ticket,
  Pencil,
  Trash2,
  X,
  Check,
  BellRing,
  Wine,
} from 'lucide-react';

export interface AttendeeReservation {
  id: string;
  quantity: number;
  subtotal: number;
  created_at: string;
  orders: {
    id: string;
    status: string;
    created_at: string;
    buyer_id: string;
    profiles: {
      id: string;
      full_name: string;
      phone?: string | null;
      email?: string | null;
      town?: string | null;
    } | null;
  } | null;
}

export interface EventProduct {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  origin_region?: string | null;
  order_items?: AttendeeReservation[];
}

interface SellerEventsViewProps {
  events: EventProduct[];
}

export function SellerEventsView({ events }: SellerEventsViewProps) {
  const { t, language } = useLanguage();
  const [editingEvent, setEditingEvent] = useState<EventProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEvent) return;

    setLoading(true);
    setMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateEventDetails(editingEvent.id, formData);
    setLoading(false);

    if (res?.error) {
      setMsg({ text: res.error, isError: true });
    } else {
      setMsg({
        text: t.seller_events_edit_success,
        isError: false,
      });
      setTimeout(() => {
        setEditingEvent(null);
        setMsg(null);
      }, 2000);
    }
  };

  const handleRemoveParticipant = async (
    orderItemId: string,
    eventId: string,
    buyerName: string
  ) => {
    const reason = window.prompt(
      `${buyerName ? `[${buyerName}] - ` : ''}${t.seller_events_remove_prompt}`
    );

    if (reason === null) return;

    setRemovingId(orderItemId);
    const res = await removeEventParticipant(orderItemId, eventId, reason);
    setRemovingId(null);

    if (res?.error) {
      alert(`${t.common_error}: ${res.error}`);
    }
  };

  const localeCode =
    language === 'eu' ? 'eu-ES' : language === 'en' ? 'en-GB' : language === 'fr' ? 'fr-FR' : 'es-ES';

  return (
    <div className="max-w-5xl mx-auto py-6 px-3 sm:px-6 space-y-8 font-serif">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif text-stone-900 dark:text-stone-100">
              {t.seller_events_title}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
              {t.seller_events_subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Catas Presenciales */}
      <div className="space-y-6">
        {events.length > 0 ? (
          events.map((event) => {
            const validReservations = (event.order_items || []).filter(
              (it) => it.orders && it.orders.status !== 'cancelado'
            );

            const totalPlazasVendidas = validReservations.reduce(
              (sum, it) => sum + it.quantity,
              0
            );
            const aforoActualRestante = event.stock ?? 0;
            const recaudacionTotal = validReservations.reduce(
              (sum, it) => sum + Number(it.subtotal || 0),
              0
            );

            return (
              <div
                key={event.id}
                className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-xs"
              >
                {/* Cabecera de la Cata Presencial */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-300/60 dark:border-amber-700/60 font-sans">
                        {t.seller_events_badge_store}
                      </span>
                      {event.origin_region && (
                        <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 font-sans">
                          <MapPin className="w-3 h-3 text-[#C68D07] dark:text-[#FFE259]" /> {event.origin_region}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black font-serif text-stone-900 dark:text-stone-100">
                      {event.name}
                    </h2>

                    {event.description && (
                      <p className="text-xs text-stone-600 dark:text-stone-300 whitespace-pre-line leading-relaxed max-w-2xl font-medium font-sans">
                        {event.description}
                      </p>
                    )}
                  </div>

                  {/* Acciones y Métricas */}
                  <div className="flex flex-col sm:items-end gap-3 font-serif shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingEvent(event)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-stone-800 dark:text-stone-200 rounded-xl text-xs font-black uppercase tracking-wider border border-stone-200 dark:border-stone-700 transition-all cursor-pointer shadow-2xs hover:scale-102"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>{t.seller_events_edit_btn}</span>
                    </button>

                    <div className="grid grid-cols-3 gap-2 text-center font-sans">
                      <div className="p-2.5 bg-stone-50 dark:bg-[#141312] rounded-xl border border-stone-200 dark:border-stone-800">
                        <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase block">
                          {t.seller_events_reserved}
                        </span>
                        <span className="text-base font-black text-amber-600 dark:text-[#FFE259] font-serif">
                          {totalPlazasVendidas}
                        </span>
                      </div>

                      <div className="p-2.5 bg-stone-50 dark:bg-[#141312] rounded-xl border border-stone-200 dark:border-stone-800">
                        <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase block">
                          {t.seller_events_available}
                        </span>
                        <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-serif">
                          {aforoActualRestante}
                        </span>
                      </div>

                      <div className="p-2.5 bg-stone-50 dark:bg-[#141312] rounded-xl border border-stone-200 dark:border-stone-800">
                        <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase block">
                          {t.seller_events_collected}
                        </span>
                        <span className="text-base font-black text-stone-900 dark:text-stone-100 font-serif">
                          {recaudacionTotal.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabla de Asistentes */}
                <div className="space-y-3 font-sans">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider font-serif text-stone-700 dark:text-stone-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
                      <span>{t.seller_events_attendees_title} ({validReservations.length})</span>
                    </h3>
                    <span className="text-[10px] text-stone-400 dark:text-stone-500 font-medium">
                      {t.seller_events_occupied_seats} {totalPlazasVendidas}
                    </span>
                  </div>

                  {validReservations.length > 0 ? (
                    <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-[#141312] shadow-inner">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-stone-200 dark:border-stone-800 font-serif uppercase tracking-wider text-[10px] text-stone-600 dark:text-stone-300 bg-stone-100/90 dark:bg-stone-800">
                            <th className="p-3 sm:p-4">{t.seller_events_col_buyer}</th>
                            <th className="p-3 sm:p-4">{t.seller_events_col_contact}</th>
                            <th className="p-3 sm:p-4 text-center">{t.seller_events_col_seats}</th>
                            <th className="p-3 sm:p-4">{t.seller_events_col_date}</th>
                            <th className="p-3 sm:p-4 text-right">{t.seller_events_col_total}</th>
                            <th className="p-3 sm:p-4 text-right">{t.seller_events_col_actions}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                          {validReservations.map((res) => {
                            const buyer = res.orders?.profiles;
                            const purchaseDate = res.orders?.created_at || res.created_at;
                            const isRemoving = removingId === res.id;

                            return (
                              <tr
                                key={res.id}
                                className="hover:bg-stone-100/70 dark:hover:bg-stone-800/40 transition-colors bg-white/40 dark:bg-[#1C1B19]/40"
                              >
                                <td className="p-3 sm:p-4 font-bold text-stone-900 dark:text-stone-100">
                                  {buyer?.full_name || 'Usuario EkhiTeka'}
                                  {buyer?.town && (
                                    <span className="block text-[10px] font-normal text-stone-500 dark:text-stone-400">
                                      {buyer.town}
                                    </span>
                                  )}
                                </td>

                                <td className="p-3 sm:p-4 text-stone-600 dark:text-stone-300 space-y-0.5">
                                  {buyer?.phone && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-3 h-3 text-stone-400 dark:text-stone-500" />
                                      <span>{buyer.phone}</span>
                                    </div>
                                  )}
                                  {buyer?.email && (
                                    <div className="flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400">
                                      <Mail className="w-3 h-3" />
                                      <span>{buyer.email}</span>
                                    </div>
                                  )}
                                </td>

                                <td className="p-3 sm:p-4 text-center">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFE259] text-[#1D1D1B] font-black text-xs rounded-xl shadow-2xs font-serif">
                                    <Ticket className="w-3 h-3" />
                                    <span>{res.quantity}</span>
                                  </span>
                                </td>

                                <td className="p-3 sm:p-4 text-stone-600 dark:text-stone-400 text-[11px]">
                                  {new Date(purchaseDate).toLocaleDateString(localeCode, {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })}{' '}
                                  {new Date(purchaseDate).toLocaleTimeString(localeCode, {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </td>

                                <td className="p-3 sm:p-4 text-right font-black text-stone-900 dark:text-stone-100 font-serif">
                                  {Number(res.subtotal).toFixed(2)} €
                                </td>

                                <td className="p-3 sm:p-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    {buyer?.id && (
                                      <Link
                                        href={`/chat/${buyer.id}?product_id=${event.id}`}
                                        className="inline-flex items-center gap-1 p-2 bg-stone-200 dark:bg-stone-800 hover:bg-[#FFE259] dark:hover:bg-[#FFE259] hover:text-[#1D1D1B] dark:hover:text-[#1D1D1B] text-stone-700 dark:text-stone-200 rounded-xl transition-all"
                                        title={t.seller_events_open_chat_title}
                                      >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                      </Link>
                                    )}

                                    <button
                                      type="button"
                                      disabled={isRemoving}
                                      onClick={() =>
                                        handleRemoveParticipant(
                                          res.id,
                                          event.id,
                                          buyer?.full_name || 'este participante'
                                        )
                                      }
                                      className="p-2 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 transition-colors disabled:opacity-40 cursor-pointer border border-red-200 dark:border-red-800"
                                      title={t.seller_events_remove_participant_title}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500 dark:text-stone-400 font-sans">
                      {t.seller_events_no_reservations}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 space-y-4">
            <Wine className="w-14 h-14 text-stone-300 dark:text-stone-700 mx-auto" />
            <h3 className="text-lg font-black font-serif text-stone-800 dark:text-stone-200">
              {t.seller_events_no_events}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto font-sans">
              {t.seller_events_no_events_desc}
            </p>
          </div>
        )}
      </div>

      {/* Modal para Editar Variables de la Cata */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#1C1B19] border-2 border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Wine className="w-5 h-5 text-[#C68D07] dark:text-[#FFE259]" />
                <h2 className="text-lg font-black font-serif text-stone-900 dark:text-stone-100">
                  {t.seller_events_modal_title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300 font-sans">
              <BellRing className="w-4 h-4 shrink-0 mt-0.5 text-[#C68D07] dark:text-[#FFE259]" />
              <p>
                {t.seller_events_modal_notice}
              </p>
            </div>

            {msg && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold text-center font-sans ${
                  msg.isError
                    ? 'bg-red-100 text-red-900 dark:bg-red-950/70 dark:text-red-200 border border-red-300 dark:border-red-800'
                    : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                }`}
              >
                {msg.text}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs font-serif">
              <div className="space-y-1">
                <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                  {t.seller_events_modal_name_label}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingEvent.name}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                    {t.seller_events_modal_price_label}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.10"
                    name="price"
                    required
                    defaultValue={editingEvent.price}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                    {t.seller_events_modal_stock_label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="stock"
                    required
                    defaultValue={editingEvent.stock}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                  {t.seller_events_modal_location_label}
                </label>
                <input
                  type="text"
                  name="origin_region"
                  defaultValue={editingEvent.origin_region || 'Gamarra Kalea 4, Lekeitio'}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                  {t.seller_events_modal_desc_label}
                </label>
                <textarea
                  name="description"
                  rows={5}
                  required
                  defaultValue={editingEvent.description || ''}
                  placeholder={t.seller_events_modal_desc_placeholder}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#141312] border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 rounded-xl cursor-pointer"
                >
                  {t.common_cancel}
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-102 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{loading ? t.seller_events_modal_saving_notify : t.seller_events_modal_save_notify}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerEventsView;