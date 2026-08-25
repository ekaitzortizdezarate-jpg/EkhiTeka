'use client';

import Link from 'next/link';
import { Users, Wine, MapPin, Mail, Phone, MessageCircle, ArrowLeft, Ticket } from 'lucide-react';

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

export interface SellerEventsViewProps {
  events: EventProduct[];
}

export function SellerEventsView({ events }: SellerEventsViewProps) {
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
              Control de aforo, plazas vendidas y asistentes por evento.
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

            const totalPlazasVendidas = validReservations.reduce((sum, it) => sum + it.quantity, 0);
            const aforoActualRestante = event.stock ?? 0;
            const recaudacionTotal = validReservations.reduce((sum, it) => sum + Number(it.subtotal || 0), 0);

            return (
              <div
                key={event.id}
                className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-xs"
              >
                {/* Cabecera del Evento */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
                  <div className="space-y-1">
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
                      <p className="text-xs text-stone-600 dark:text-stone-300 whitespace-pre-line leading-relaxed max-w-2xl">
                        {event.description}
                      </p>
                    )}
                  </div>

                  {/* Resumen Métricas Plazas */}
                  <div className="grid grid-cols-3 sm:flex items-center gap-3 font-serif shrink-0">
                    <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 text-center">
                      <span className="text-[10px] font-bold text-stone-400 uppercase block">Reservadas</span>
                      <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                        {totalPlazasVendidas}
                      </span>
                    </div>

                    <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 text-center">
                      <span className="text-[10px] font-bold text-stone-400 uppercase block">Disponibles</span>
                      <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                        {aforoActualRestante}
                      </span>
                    </div>

                    <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 text-center">
                      <span className="text-[10px] font-bold text-stone-400 uppercase block">Recaudado</span>
                      <span className="text-lg font-black text-stone-900 dark:text-stone-100">
                        {recaudacionTotal.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tabla de Asistentes */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider font-serif text-stone-700 dark:text-stone-300 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#C68D07]" />
                    <span>Lista de Asistentes ({validReservations.length} reservas registradas)</span>
                  </h3>

                  {validReservations.length > 0 ? (
                    <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-stone-200 dark:border-stone-700 font-serif uppercase tracking-wider text-[10px] text-stone-500 dark:text-stone-400 bg-stone-100/70 dark:bg-stone-800/70">
                            <th className="p-3 sm:p-4">Comprador / Asistente</th>
                            <th className="p-3 sm:p-4">Contacto</th>
                            <th className="p-3 sm:p-4 text-center">Plazas Compradas</th>
                            <th className="p-3 sm:p-4">Fecha de Compra</th>
                            <th className="p-3 sm:p-4 text-right">Total</th>
                            <th className="p-3 sm:p-4 text-right">Chat</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200/60 dark:divide-stone-700/60">
                          {validReservations.map((res) => {
                            const buyer = res.orders?.profiles;
                            const purchaseDate = res.orders?.created_at || res.created_at;

                            return (
                              <tr key={res.id} className="hover:bg-stone-100/50 dark:hover:bg-stone-800/50 transition-colors">
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
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] font-black text-xs rounded-xl shadow-2xs">
                                    <Ticket className="w-3.5 h-3.5" />
                                    <span>{res.quantity} {res.quantity === 1 ? 'plaza' : 'plazas'}</span>
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
                                  {buyer?.id && (
                                    <Link
                                      href={`/chat/${buyer.id}?product_id=${event.id}`}
                                      className="inline-flex items-center gap-1 p-2 bg-stone-200 dark:bg-stone-700 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-stone-700 dark:text-stone-200 rounded-xl transition-all"
                                      title="Abrir chat con el comprador"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                    </Link>
                                  )}
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
    </div>
  );
}

export default SellerEventsView;