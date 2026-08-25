'use client';

import { useState } from 'react';
import Link from 'next/link';
import { updateEventDetails, removeEventParticipant } from '@/app/actions/events';
import {
  Users,
  Wine,
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
  AlertCircle,
  BellRing,
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
  const [editingEvent, setEditingEvent] = useState<EventProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Manejar guardado de edición de evento
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
        text: `¡Evento modificado con éxito! Se ha notificado a ${res.notifiedCount} participante(s) por el chat.`,
        isError: false,
      });
      setTimeout(() => {
        setEditingEvent(null);
        setMsg(null);
      }, 2000);
    }
  };

  // Manejar eliminación / baja de participante
  const handleRemoveParticipant = async (
    orderItemId: string,
    eventId: string,
    buyerName: string
  ) => {
    const reason = window.prompt(
      `¿Deseas dar de baja a "${buyerName}" de este evento? Se cancelará la reserva, se restablecerán las plazas y se le enviará un mensaje automático al chat.\n\nIntroduce el motivo (opcional):`
    );

    if (reason === null) return; // Usuario pulsó cancelar en el prompt

    setRemovingId(orderItemId);
    const res = await removeEventParticipant(orderItemId, eventId, reason);
    setRemovingId(null);

    if (res?.error) {
      alert(`Error al eliminar participante: ${res.error}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-3 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif text-stone-900 dark:text-stone-100">
              Próximos Eventos & Catas en Tienda
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Control de aforo, edición de variables y gestión de asistentes con aviso automático.
            </p>
          </div>
        </div>

        <Link
          href="/vendedor/productos/nuevo"
          className="px-4 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-xs transition-all flex items-center gap-1.5 font-serif hover:scale-102"
        >
          <Wine className="w-4 h-4" />
          <span>+ Nueva Cata</span>
        </Link>
      </div>

      {/* Lista de Eventos */}
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
                className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-xs"
              >
                {/* Cabecera del Evento con Botón de Editar */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider">
                        Evento Presencial
                      </span>
                      {event.origin_region && (
                        <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#C68D07]" /> {event.origin_region}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black font-serif text-stone-900 dark:text-stone-100">
                      {event.name}
                    </h2>

                    {event.description && (
                      <p className="text-xs text-stone-600 dark:text-stone-300 whitespace-pre-line leading-relaxed max-w-2xl font-medium">
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
                      <span>Editar Evento</span>
                    </button>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2.5 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                        <span className="text-[9px] font-bold text-stone-400 uppercase block">Reservadas</span>
                        <span className="text-base font-black text-amber-600 dark:text-amber-400">
                          {totalPlazasVendidas}
                        </span>
                      </div>

                      <div className="p-2.5 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                        <span className="text-[9px] font-bold text-stone-400 uppercase block">Disponibles</span>
                        <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                          {aforoActualRestante}
                        </span>
                      </div>

                      <div className="p-2.5 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                        <span className="text-[9px] font-bold text-stone-400 uppercase block">Total</span>
                        <span className="text-base font-black text-stone-900 dark:text-stone-100">
                          {recaudacionTotal.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabla de Asistentes / Participantes */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider font-serif text-stone-700 dark:text-stone-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#C68D07]" />
                      <span>Participantes Registrados ({validReservations.length})</span>
                    </h3>
                    <span className="text-[10px] text-stone-400 font-medium">
                      Total plazas ocupadas: {totalPlazasVendidas}
                    </span>
                  </div>

                  {validReservations.length > 0 ? (
                    <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-stone-200 dark:border-stone-700 font-serif uppercase tracking-wider text-[10px] text-stone-500 dark:text-stone-400 bg-stone-100/70 dark:bg-stone-800/70">
                            <th className="p-3 sm:p-4">Comprador</th>
                            <th className="p-3 sm:p-4">Contacto</th>
                            <th className="p-3 sm:p-4 text-center">Plazas</th>
                            <th className="p-3 sm:p-4">Fecha Compra</th>
                            <th className="p-3 sm:p-4 text-right">Total</th>
                            <th className="p-3 sm:p-4 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200/60 dark:divide-stone-700/60">
                          {validReservations.map((res) => {
                            const buyer = res.orders?.profiles;
                            const purchaseDate = res.orders?.created_at || res.created_at;
                            const isRemoving = removingId === res.id;

                            return (
                              <tr
                                key={res.id}
                                className="hover:bg-stone-100/50 dark:hover:bg-stone-800/50 transition-colors"
                              >
                                <td className="p-3 sm:p-4 font-bold text-stone-900 dark:text-stone-100">
                                  {buyer?.full_name || 'Usuario EkhiTeka'}
                                  {buyer?.town && (
                                    <span className="block text-[10px] font-normal text-stone-400">
                                      {buyer.town}
                                    </span>
                                  )}
                                </td>

                                <td className="p-3 sm:p-4 text-stone-600 dark:text-stone-300 space-y-0.5">
                                  {buyer?.phone && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-3 h-3 text-stone-400" />
                                      <span>{buyer.phone}</span>
                                    </div>
                                  )}
                                  {buyer?.email && (
                                    <div className="flex items-center gap-1 text-[11px] text-stone-400">
                                      <Mail className="w-3 h-3" />
                                      <span>{buyer.email}</span>
                                    </div>
                                  )}
                                </td>

                                <td className="p-3 sm:p-4 text-center">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFE259] text-[#1D1D1B] font-black text-xs rounded-xl shadow-2xs">
                                    <Ticket className="w-3 h-3" />
                                    <span>{res.quantity}</span>
                                  </span>
                                </td>

                                <td className="p-3 sm:p-4 text-stone-600 dark:text-stone-400 text-[11px]">
                                  {new Date(purchaseDate).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })}{' '}
                                  {new Date(purchaseDate).toLocaleTimeString('es-ES', {
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
                                        className="inline-flex items-center gap-1 p-2 bg-stone-200 dark:bg-stone-700 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-stone-700 dark:text-stone-200 rounded-xl transition-all"
                                        title="Abrir chat con el comprador"
                                      >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                      </Link>
                                    )}

                                    {/* Botón Borrar Participante */}
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
                                      className="p-2 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 transition-colors disabled:opacity-40 cursor-pointer"
                                      title="Dar de baja participante y notificar por chat"
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
                    <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 text-center text-xs text-stone-400">
                      Aún no hay reservas registradas para este evento.
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 space-y-4">
            <Wine className="w-14 h-14 text-stone-300 dark:text-stone-700 mx-auto" />
            <h3 className="text-lg font-black font-serif text-stone-800 dark:text-stone-200">
              No tienes eventos creados todavía
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
              Publica una cata presencial o taller gourmet para gestionar plazas y reservas desde este panel.
            </p>
            <Link
              href="/vendedor/productos/nuevo"
              className="inline-block px-6 py-3 bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-full shadow-xs transition-all font-serif hover:scale-105"
            >
              Publicar Nueva Cata
            </Link>
          </div>
        )}
      </div>

      {/* Modal para Editar Todas las Variables del Evento */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Wine className="w-5 h-5 text-[#C68D07]" />
                <h2 className="text-lg font-black font-serif text-stone-900 dark:text-stone-100">
                  Editar Variables del Evento
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aviso de notificación automática */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300">
              <BellRing className="w-4 h-4 shrink-0 mt-0.5 text-[#C68D07]" />
              <p>
                Cualquier cambio en la fecha, hora o condiciones se notificará de forma automática por chat a todos los participantes con plaza reservada.
              </p>
            </div>

            {msg && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold text-center ${
                  msg.isError
                    ? 'bg-red-100 text-red-900 dark:bg-red-950/70 dark:text-red-200 border border-red-300'
                    : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200 border border-emerald-300'
                }`}
              >
                {msg.text}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs font-serif">
              {/* Título */}
              <div className="space-y-1">
                <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                  Título del Evento *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingEvent.name}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
                />
              </div>

              {/* Precio y Plazas Restantes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                    Precio por Plaza (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.10"
                    name="price"
                    required
                    defaultValue={editingEvent.price}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                    Plazas Disponibles Restantes *
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="stock"
                    required
                    defaultValue={editingEvent.stock}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
                  />
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-1">
                <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                  Lugar / Ubicación *
                </label>
                <input
                  type="text"
                  name="origin_region"
                  defaultValue={editingEvent.origin_region || 'Gamarra Kalea 4, Lekeitio'}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
                />
              </div>

              {/* Descripción, Fecha & Maridaje */}
              <div className="space-y-1">
                <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                  Descripción, Fecha/Hora & Contenido *
                </label>
                <textarea
                  name="description"
                  rows={5}
                  required
                  defaultValue={editingEvent.description || ''}
                  placeholder="Ej: Fecha: Sábado 20 de Septiembre · 19:30h&#10;Quesos a probar: 5 quesos de afinador y maridaje vasco..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900 rounded-xl"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-102"
                >
                  <Check className="w-4 h-4" />
                  <span>{loading ? 'Guardando & Notificando...' : 'Guardar y Notificar'}</span>
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