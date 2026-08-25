'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { signout } from '@/app/actions/auth';
import type { Profile } from '@/types/database';
import { CartNavButton } from '@/components/CartNavButton';
import {
  User,
  LogOut,
  Menu,
  X,
  Store,
  MessageCircle,
} from 'lucide-react';

interface NavbarNavLinksProps {
  user: { id: string } | null;
  profile: Profile | null;
  unreadMessagesCount: number;
  ordersCount: number;
  activeOrders?: { id: string; status: string }[];
}

export function NavbarNavLinks({
  user,
  profile,
  unreadMessagesCount,
  ordersCount,
  activeOrders = [],
}: NavbarNavLinksProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasUnseenOrderUpdates, setHasUnseenOrderUpdates] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSeller = profile?.role === 'vendedor';
  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    function checkUnseenOrders() {
      if (!user || !activeOrders || activeOrders.length === 0) {
        setHasUnseenOrderUpdates(false);
        return;
      }
      const storageKey = isSeller ? 'ekhiteka_seen_orders_seller' : 'ekhiteka_seen_orders_buyer';
      let seenMap: Record<string, string> = {};
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) seenMap = JSON.parse(stored);
      } catch {}

      const unseen = activeOrders.some((order) => {
        const lastSeen = seenMap[order.id];
        if (lastSeen) {
          return lastSeen !== order.status;
        }
        return isSeller ? order.status === 'pendiente' : order.status !== 'pendiente';
      });

      setHasUnseenOrderUpdates(unseen);
    }

    checkUnseenOrders();
    window.addEventListener('ekhiteka_orders_seen_updated', checkUnseenOrders);
    window.addEventListener('storage', checkUnseenOrders);
    return () => {
      window.removeEventListener('ekhiteka_orders_seen_updated', checkUnseenOrders);
      window.removeEventListener('storage', checkUnseenOrders);
    };
  }, [user, activeOrders, isSeller]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <div className="flex items-center justify-between w-full min-w-0 gap-3">
      {/* 1. LADO IZQUIERDO: Logotipo y Enlaces Principales */}
      <div className="flex items-center gap-3 xl:gap-5 min-w-0">
        {/* Botón Menú Móvil */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 -ml-1 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-2xl transition-colors cursor-pointer"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logotipo Oficial EkhiTeka */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group min-w-0">
          <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 border-stone-200 dark:border-stone-700 group-hover:border-[#FFE259] group-hover:scale-105 transition-all shadow-xs bg-[#FAF7F2] shrink-0">
            <img
              src="/Logo.jpg"
              alt="EkhiTeka Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif font-black text-xl sm:text-2xl tracking-tight text-[#1D1D1B] dark:text-stone-100 block leading-tight">
              Ekhi<span className="text-[#C68D07] dark:text-[#FFE259]">Teka</span>
            </span>
            <span className="hidden xl:block text-[9.5px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 -mt-0.5 truncate">
              Quesería & Selección Gourmet
            </span>
          </div>
        </Link>

        {/* Enlaces Principales */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 font-serif">
          <Link
            href="/tienda"
            className={`flex items-center justify-center text-center px-3 xl:px-4 py-2 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[11px] xl:text-[12px] font-bold transition-all whitespace-nowrap min-h-[38px] ${
              pathname === '/tienda' || pathname.startsWith('/categoria') || pathname.startsWith('/producto')
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs border border-stone-800/10'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <span>{t.nav_shop}</span>
          </Link>

          <Link
            href="/regalos-gourmet"
            className={`flex flex-col items-center justify-center text-center px-3 xl:px-4 py-1 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[10.5px] xl:text-[11px] font-semibold transition-all leading-tight whitespace-nowrap min-h-[38px] ${
              pathname === '/regalos-gourmet'
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs border border-stone-800/10'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <span className="block text-center">Regalos</span>
            <span className="block text-center">Gourmet</span>
          </Link>

          <Link
            href="/experiencias"
            className={`flex flex-col items-center justify-center text-center px-3 xl:px-4 py-1 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[10.5px] xl:text-[11px] font-semibold transition-all leading-tight whitespace-nowrap min-h-[38px] ${
              pathname === '/experiencias'
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs border border-stone-800/10'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <span className="block text-center">Catas &</span>
            <span className="block text-center">Experiencias</span>
          </Link>

          <Link
            href="/regalos-empresa"
            className={`flex flex-col items-center justify-center text-center px-3 xl:px-4 py-1 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[10.5px] xl:text-[11px] font-semibold transition-all leading-tight whitespace-nowrap min-h-[38px] ${
              pathname === '/regalos-empresa'
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs border border-stone-800/10'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <span className="block text-center">Regalos de</span>
            <span className="block text-center">Empresa</span>
          </Link>

          {user && (
            <>
              {/* Pedidos */}
              <Link
                href={isSeller ? '/vendedor/pedidos' : '/comprador/pedidos'}
                className={`relative flex items-center justify-center text-center gap-1.5 px-3 xl:px-4 py-2 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[11px] xl:text-[12px] font-semibold transition-all whitespace-nowrap min-h-[38px] ${
                  pathname.includes('/pedidos')
                    ? 'bg-[#FFE259] text-[#1D1D1B] font-bold shadow-xs border border-stone-800/10'
                    : hasUnseenOrderUpdates
                    ? 'bg-[#FFE259]/30 text-stone-900 dark:text-stone-100 border border-[#FFE259] ring-2 ring-[#FFE259]/50 animate-pulse font-bold shadow-md'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <span>{t.nav_orders}</span>
                {hasUnseenOrderUpdates && (
                  <span className="w-2 h-2 rounded-full bg-[#FFE259] border border-stone-900 animate-ping" />
                )}
              </Link>

              {/* Eventos (Solo Vendedor) */}
              {isSeller && (
                <Link
                  href="/vendedor/eventos"
                  className={`flex items-center justify-center text-center px-3 xl:px-4 py-2 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[11px] xl:text-[12px] font-semibold transition-all whitespace-nowrap min-h-[38px] ${
                    pathname === '/vendedor/eventos'
                      ? 'bg-[#FFE259] text-[#1D1D1B] font-bold shadow-xs border border-stone-800/10'
                      : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <span>Eventos</span>
                </Link>
              )}

              {/* Vendedor: Añadir Producto */}
              {isSeller && (
                <Link
                  href="/vendedor/productos/nuevo"
                  className={`flex flex-col items-center justify-center text-center px-3.5 xl:px-4 py-1 rounded-2xl transition-all font-black uppercase tracking-[0.14em] xl:tracking-[0.16em] text-[10px] xl:text-[10.5px] leading-tight hover:scale-102 whitespace-nowrap min-h-[38px] ${
                    pathname === '/vendedor/productos/nuevo'
                      ? 'bg-[#FFE259] text-[#1D1D1B] shadow-xs border border-stone-800/10'
                      : 'border-2 border-[#FFE259] bg-transparent text-stone-900 dark:text-[#FFE259] hover:bg-[#FFE259] hover:text-[#1D1D1B]'
                  }`}
                >
                  <span className="block text-center">Añadir</span>
                  <span className="block text-center">Producto</span>
                </Link>
              )}

              {/* Admin */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center justify-center text-center px-3 py-2 bg-purple-100 dark:bg-purple-950/70 text-purple-950 dark:text-purple-200 border border-purple-300 dark:border-purple-700 rounded-2xl transition-all font-semibold uppercase tracking-[0.14em] text-[11px] whitespace-nowrap min-h-[38px]"
                >
                  <span>{t.nav_admin}</span>
                </Link>
              )}
            </>
          )}
        </nav>
      </div>

      {/* 2. LADO DERECHO: Cesta -> Mensajes -> Perfil -> Cerrar Sesión */}
      <div className="flex items-center gap-2 shrink-0">
        {user ? (
          <div className="flex items-center gap-2">
            {/* Cesta */}
            {(!profile || profile.role === 'comprador') && (
              <CartNavButton />
            )}

            {/* Mensajes */}
            <Link
              href="/chat"
              className={`relative p-2.5 rounded-2xl border transition-all shrink-0 ${
                pathname.startsWith('/chat')
                  ? 'bg-[#FFE259] text-[#1D1D1B] border-stone-800 shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
              title={t.nav_chats}
            >
              <MessageCircle className="w-4 h-4" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </Link>

            {/* Perfil */}
            <Link
              href="/perfil"
              className={`p-2.5 rounded-2xl border transition-colors shrink-0 ${
                pathname === '/perfil'
                  ? 'bg-[#FFE259] text-[#1D1D1B] border-stone-800 shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
              title={t.nav_profile}
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Cerrar Sesión */}
            <form action={signout} className="shrink-0">
              <button
                type="submit"
                className="p-2.5 rounded-2xl text-stone-500 hover:text-red-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
                title={t.nav_logout}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2.5 text-xs font-bold font-serif uppercase tracking-wider text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white rounded-2xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {t.nav_login}
            </Link>
            <Link
              href="/register"
              className="px-4 py-2.5 text-xs font-black font-serif uppercase tracking-wider bg-[#1D1D1B] dark:bg-stone-100 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-white dark:text-stone-900 rounded-2xl transition-all shadow-2xs"
            >
              {t.nav_register}
            </Link>
          </div>
        )}
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {mounted && mobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[999999] lg:hidden" style={{ zIndex: 999999 }}>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed top-0 bottom-0 left-0 max-w-xs w-full bg-[#1D1D1B] text-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-[1000000] border-r border-stone-800 animate-in slide-in-from-left duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FFE259] p-0.5 bg-[#FAF8F5]">
                    <img
                      src="/Logo.jpg"
                      alt="EkhiTeka"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif font-bold text-lg text-white tracking-wider">
                      Ekhi<span className="text-[#FFE259]">Teka</span>
                    </span>
                    <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-400">
                      Lekeitio · Bizkaia
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                  aria-label="Cerrar menú"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-2 font-serif">
                <p className="text-[11px] font-sans font-black uppercase tracking-[0.2em] text-[#FFE259] text-center pb-1">
                  Explorar Selección
                </p>
                <Link
                  href="/tienda"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-center text-center p-3.5 rounded-full font-bold text-xs tracking-[0.16em] uppercase transition-all shadow-md ${
                    pathname === '/tienda'
                      ? 'bg-[#FFE259] text-[#1D1D1B] scale-102 ring-2 ring-[#FFE259]'
                      : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700 hover:border-[#FFE259]'
                  }`}
                >
                  <span>{t.nav_shop}</span>
                </Link>
                <Link
                  href="/regalos-gourmet"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-center text-center p-3.5 rounded-full font-bold text-xs tracking-[0.16em] uppercase transition-all shadow-md ${
                    pathname === '/regalos-gourmet'
                      ? 'bg-[#FFE259] text-[#1D1D1B] scale-102 ring-2 ring-[#FFE259]'
                      : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700 hover:border-[#FFE259]'
                  }`}
                >
                  <span>Regalos Gourmet</span>
                </Link>
                <Link
                  href="/experiencias"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-center text-center p-3.5 rounded-full font-bold text-xs tracking-[0.16em] uppercase transition-all shadow-md ${
                    pathname === '/experiencias'
                      ? 'bg-[#FFE259] text-[#1D1D1B] scale-102 ring-2 ring-[#FFE259]'
                      : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700 hover:border-[#FFE259]'
                  }`}
                >
                  <span>Catas & Experiencias</span>
                </Link>
                <Link
                  href="/regalos-empresa"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-center text-center p-3.5 rounded-full font-bold text-xs tracking-[0.16em] uppercase transition-all shadow-md ${
                    pathname === '/regalos-empresa'
                      ? 'bg-[#FFE259] text-[#1D1D1B] scale-102 ring-2 ring-[#FFE259]'
                      : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700 hover:border-[#FFE259]'
                  }`}
                >
                  <span>Regalos de Empresa</span>
                </Link>
              </div>

              {/* Enlaces de Usuario Móvil (Orden estricto a partir de Tu Cuenta: Pedidos, Eventos, Añadir Producto, Mensajes, Perfil, Cerrar Sesión) */}
              <div className="space-y-2.5 pt-4 border-t border-stone-800 font-serif">
                <p className="text-[11px] font-sans font-black uppercase tracking-[0.2em] text-[#FFE259] text-center pb-1">
                  Tu Cuenta
                </p>
                {user ? (
                  <>
                    {/* 1. Pedidos */}
                    <Link
                      href={isSeller ? '/vendedor/pedidos' : '/comprador/pedidos'}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-full font-bold text-xs tracking-[0.14em] uppercase transition-all ${
                        pathname.includes('/pedidos')
                          ? 'bg-[#FFE259] text-[#1D1D1B]'
                          : hasUnseenOrderUpdates
                          ? 'bg-[#FFE259]/25 text-[#FFE259] border border-[#FFE259] ring-2 ring-[#FFE259]/50 animate-pulse font-bold'
                          : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700'
                      }`}
                    >
                      <span>{t.nav_orders}</span>
                      {hasUnseenOrderUpdates && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FFE259] text-[#1D1D1B] text-[9px] font-black uppercase">
                          Nuevo
                        </span>
                      )}
                    </Link>

                    {/* 2. Eventos (solo vendedor) */}
                    {isSeller && (
                      <Link
                        href="/vendedor/eventos"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-center p-3 rounded-full font-bold text-xs tracking-[0.14em] uppercase transition-all ${
                          pathname === '/vendedor/eventos'
                            ? 'bg-[#FFE259] text-[#1D1D1B]'
                            : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700'
                        }`}
                      >
                        <span>Eventos</span>
                      </Link>
                    )}

                    {/* 3. Añadir Producto (solo vendedor) */}
                    {isSeller && (
                      <Link
                        href="/vendedor/productos/nuevo"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-center p-3.5 rounded-full font-black text-xs tracking-[0.16em] uppercase shadow-lg hover:scale-102 transition-all ${
                          pathname === '/vendedor/productos/nuevo'
                            ? 'bg-[#FFE259] text-[#1D1D1B] ring-2 ring-[#FFE259]'
                            : 'border-2 border-[#FFE259] bg-transparent text-white hover:bg-[#FFE259] hover:text-[#1D1D1B]'
                        }`}
                      >
                        <span>Añadir Producto</span>
                      </Link>
                    )}

                    {/* 4. Mensajes */}
                    <Link
                      href="/chat"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-full font-bold text-xs tracking-[0.14em] uppercase transition-all ${
                        pathname.startsWith('/chat')
                          ? 'bg-[#FFE259] text-[#1D1D1B]'
                          : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700'
                      }`}
                    >
                      <span>{t.nav_chats}</span>
                      {unreadMessagesCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center">
                          {unreadMessagesCount}
                        </span>
                      )}
                    </Link>

                    {/* 5. Perfil */}
                    <Link
                      href="/perfil"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-center p-3 rounded-full font-bold text-xs tracking-[0.14em] uppercase transition-all ${
                        pathname === '/perfil'
                          ? 'bg-[#FFE259] text-[#1D1D1B]'
                          : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700'
                      }`}
                    >
                      <span>{t.nav_profile}</span>
                    </Link>

                    {/* 6. Cerrar Sesión */}
                    <form action={signout} className="pt-2">
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center p-2.5 rounded-full text-xs font-bold tracking-[0.14em] uppercase text-stone-400 hover:text-red-400 hover:bg-stone-850 transition-colors cursor-pointer"
                      >
                        <span>{t.nav_logout}</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1 font-serif">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center text-center py-3 px-3 rounded-full border-2 border-stone-700 font-bold text-xs tracking-[0.14em] uppercase text-white hover:border-[#FFE259] hover:text-[#FFE259] transition-all bg-stone-850"
                    >
                      {t.nav_login}
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center text-center py-3 px-3 rounded-full bg-[#FFE259] font-black text-xs tracking-[0.14em] uppercase text-[#1D1D1B] shadow-md hover:scale-102 transition-all"
                    >
                      {t.nav_register}
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-stone-800 text-[11px] text-stone-400 space-y-1 text-center font-sans">
              <div className="flex items-center justify-center gap-1.5 font-bold text-stone-200">
                <Store className="w-3.5 h-3.5 text-[#FFE259]" />
                <span>Quesería & Tienda en Lekeitio</span>
              </div>
              <p>Gamarra Kalea 4, Lekeitio · Bizkaia</p>
              <p className="font-semibold text-[#FFE259]">WhatsApp: +34 600 000 000</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}