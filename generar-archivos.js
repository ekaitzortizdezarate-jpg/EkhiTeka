const fs = require('fs');
const path = require('path');

const files = {
  // 1. NAVBAR NAV LINKS (4 idiomas + orden estricto móvil + reborde añadir producto)
  'components/NavbarNavLinks.tsx': `'use client';

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
      {/* LADO IZQUIERDO */}
      <div className="flex items-center gap-3 xl:gap-5 min-w-0">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 -ml-1 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-2xl transition-colors cursor-pointer"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

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

        {/* Enlaces Desktop */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 font-serif">
          <Link
            href="/tienda"
            className={\`flex items-center justify-center text-center px-3 xl:px-4 py-2 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[11px] xl:text-[12px] font-bold transition-all whitespace-nowrap min-h-[38px] \${
              pathname === '/tienda' || pathname.startsWith('/categoria') || pathname.startsWith('/producto')
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs border border-stone-800/10'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }\`}
          >
            <span>{t.nav_shop}</span>
          </Link>

          <Link
            href="/regalos-gourmet"
            className={\`flex flex-col items-center justify-center text-center px-3 xl:px-4 py-1 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[10.5px] xl:text-[11px] font-semibold transition-all leading-tight whitespace-nowrap min-h-[38px] \${
              pathname === '/regalos-gourmet'
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs border border-stone-800/10'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }\`}
          >
            <span className="block text-center">Regalos</span>
            <span className="block text-center">Gourmet</span>
          </Link>

          <Link
            href="/experiencias"
            className={\`flex flex-col items-center justify-center text-center px-3 xl:px-4 py-1 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[10.5px] xl:text-[11px] font-semibold transition-all leading-tight whitespace-nowrap min-h-[38px] \${
              pathname === '/experiencias'
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs border border-stone-800/10'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }\`}
          >
            <span className="block text-center">Catas &</span>
            <span className="block text-center">Experiencias</span>
          </Link>

          <Link
            href="/regalos-empresa"
            className={\`flex flex-col items-center justify-center text-center px-3 xl:px-4 py-1 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[10.5px] xl:text-[11px] font-semibold transition-all leading-tight whitespace-nowrap min-h-[38px] \${
              pathname === '/regalos-empresa'
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs border border-stone-800/10'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }\`}
          >
            <span className="block text-center">Regalos de</span>
            <span className="block text-center">Empresa</span>
          </Link>

          {user && (
            <>
              <Link
                href={isSeller ? '/vendedor/pedidos' : '/comprador/pedidos'}
                className={\`relative flex items-center justify-center text-center gap-1.5 px-3 xl:px-4 py-2 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[11px] xl:text-[12px] font-semibold transition-all whitespace-nowrap min-h-[38px] \${
                  pathname.includes('/pedidos')
                    ? 'bg-[#FFE259] text-[#1D1D1B] font-bold shadow-xs border border-stone-800/10'
                    : hasUnseenOrderUpdates
                    ? 'bg-[#FFE259]/30 text-stone-900 dark:text-stone-100 border border-[#FFE259] ring-2 ring-[#FFE259]/50 animate-pulse font-bold shadow-md'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                }\`}
              >
                <span>{t.nav_orders}</span>
                {hasUnseenOrderUpdates && (
                  <span className="w-2 h-2 rounded-full bg-[#FFE259] border border-stone-900 animate-ping" />
                )}
              </Link>

              {isSeller && (
                <Link
                  href="/vendedor/eventos"
                  className={\`flex items-center justify-center text-center px-3 xl:px-4 py-2 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[11px] xl:text-[12px] font-semibold transition-all whitespace-nowrap min-h-[38px] \${
                    pathname === '/vendedor/eventos'
                      ? 'bg-[#FFE259] text-[#1D1D1B] font-bold shadow-xs border border-stone-800/10'
                      : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                  }\`}
                >
                  <span>{t.nav_events}</span>
                </Link>
              )}

              {isSeller && (
                <Link
                  href="/vendedor/productos/nuevo"
                  className={\`flex flex-col items-center justify-center text-center px-3.5 xl:px-4 py-1 rounded-2xl transition-all font-black uppercase tracking-[0.14em] xl:tracking-[0.16em] text-[10px] xl:text-[10.5px] leading-tight hover:scale-102 whitespace-nowrap min-h-[38px] \${
                    pathname === '/vendedor/productos/nuevo'
                      ? 'bg-[#FFE259] text-[#1D1D1B] shadow-xs border border-stone-800/10'
                      : 'border-2 border-[#FFE259] bg-transparent text-stone-900 dark:text-[#FFE259] hover:bg-[#FFE259] hover:text-[#1D1D1B]'
                  }\`}
                >
                  <span className="block text-center">Añadir</span>
                  <span className="block text-center">Producto</span>
                </Link>
              )}

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

      {/* LADO DERECHO */}
      <div className="flex items-center gap-2 shrink-0">
        {user ? (
          <div className="flex items-center gap-2">
            {(!profile || profile.role === 'comprador') && <CartNavButton />}

            <Link
              href="/chat"
              className={\`relative p-2.5 rounded-2xl border transition-all shrink-0 \${
                pathname.startsWith('/chat')
                  ? 'bg-[#FFE259] text-[#1D1D1B] border-stone-800 shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }\`}
              title={t.nav_chats}
            >
              <MessageCircle className="w-4 h-4" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </Link>

            <Link
              href="/perfil"
              className={\`p-2.5 rounded-2xl border transition-colors shrink-0 \${
                pathname === '/perfil'
                  ? 'bg-[#FFE259] text-[#1D1D1B] border-stone-800 shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }\`}
              title={t.nav_profile}
            >
              <User className="w-4 h-4" />
            </Link>

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

      {/* DRAWER MÓVIL (Orden estricto a partir de Tu Cuenta: Pedidos, Eventos, Añadir Producto, Mensajes, Perfil, Cerrar Sesión) */}
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
                  aria-label="Close"
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
                  className={\`flex items-center justify-center text-center p-3.5 rounded-full font-bold text-xs tracking-[0.16em] uppercase transition-all shadow-md \${
                    pathname === '/tienda'
                      ? 'bg-[#FFE259] text-[#1D1D1B] scale-102 ring-2 ring-[#FFE259]'
                      : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700 hover:border-[#FFE259]'
                  }\`}
                >
                  <span>{t.nav_shop}</span>
                </Link>
                <Link
                  href="/regalos-gourmet"
                  onClick={() => setMobileMenuOpen(false)}
                  className={\`flex items-center justify-center text-center p-3.5 rounded-full font-bold text-xs tracking-[0.16em] uppercase transition-all shadow-md \${
                    pathname === '/regalos-gourmet'
                      ? 'bg-[#FFE259] text-[#1D1D1B] scale-102 ring-2 ring-[#FFE259]'
                      : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700 hover:border-[#FFE259]'
                  }\`}
                >
                  <span>Regalos Gourmet</span>
                </Link>
                <Link
                  href="/experiencias"
                  onClick={() => setMobileMenuOpen(false)}
                  className={\`flex items-center justify-center text-center p-3.5 rounded-full font-bold text-xs tracking-[0.16em] uppercase transition-all shadow-md \${
                    pathname === '/experiencias'
                      ? 'bg-[#FFE259] text-[#1D1D1B] scale-102 ring-2 ring-[#FFE259]'
                      : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700 hover:border-[#FFE259]'
                  }\`}
                >
                  <span>Catas & Experiencias</span>
                </Link>
                <Link
                  href="/regalos-empresa"
                  onClick={() => setMobileMenuOpen(false)}
                  className={\`flex items-center justify-center text-center p-3.5 rounded-full font-bold text-xs tracking-[0.16em] uppercase transition-all shadow-md \${
                    pathname === '/regalos-empresa'
                      ? 'bg-[#FFE259] text-[#1D1D1B] scale-102 ring-2 ring-[#FFE259]'
                      : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700 hover:border-[#FFE259]'
                  }\`}
                >
                  <span>Regalos de Empresa</span>
                </Link>
              </div>

              {/* SECCIÓN TU CUENTA */}
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
                      className={\`flex items-center justify-center gap-2 p-3 rounded-full font-bold text-xs tracking-[0.14em] uppercase transition-all \${
                        pathname.includes('/pedidos')
                          ? 'bg-[#FFE259] text-[#1D1D1B]'
                          : hasUnseenOrderUpdates
                          ? 'bg-[#FFE259]/25 text-[#FFE259] border border-[#FFE259] ring-2 ring-[#FFE259]/50 animate-pulse font-bold'
                          : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700'
                      }\`}
                    >
                      <span>{t.nav_orders}</span>
                      {hasUnseenOrderUpdates && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FFE259] text-[#1D1D1B] text-[9px] font-black uppercase">
                          Nuevo
                        </span>
                      )}
                    </Link>

                    {/* 2. Eventos */}
                    {isSeller && (
                      <Link
                        href="/vendedor/eventos"
                        onClick={() => setMobileMenuOpen(false)}
                        className={\`flex items-center justify-center p-3 rounded-full font-bold text-xs tracking-[0.14em] uppercase transition-all \${
                          pathname === '/vendedor/eventos'
                            ? 'bg-[#FFE259] text-[#1D1D1B]'
                            : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700'
                        }\`}
                      >
                        <span>{t.nav_events}</span>
                      </Link>
                    )}

                    {/* 3. Añadir Producto */}
                    {isSeller && (
                      <Link
                        href="/vendedor/productos/nuevo"
                        onClick={() => setMobileMenuOpen(false)}
                        className={\`flex items-center justify-center p-3.5 rounded-full font-black text-xs tracking-[0.16em] uppercase shadow-lg hover:scale-102 transition-all \${
                          pathname === '/vendedor/productos/nuevo'
                            ? 'bg-[#FFE259] text-[#1D1D1B] ring-2 ring-[#FFE259]'
                            : 'border-2 border-[#FFE259] bg-transparent text-white hover:bg-[#FFE259] hover:text-[#1D1D1B]'
                        }\`}
                      >
                        <span>Añadir Producto</span>
                      </Link>
                    )}

                    {/* 4. Mensajes */}
                    <Link
                      href="/chat"
                      onClick={() => setMobileMenuOpen(false)}
                      className={\`flex items-center justify-center gap-2 p-3 rounded-full font-bold text-xs tracking-[0.14em] uppercase transition-all \${
                        pathname.startsWith('/chat')
                          ? 'bg-[#FFE259] text-[#1D1D1B]'
                          : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700'
                      }\`}
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
                      className={\`flex items-center justify-center p-3 rounded-full font-bold text-xs tracking-[0.14em] uppercase transition-all \${
                        pathname === '/perfil'
                          ? 'bg-[#FFE259] text-[#1D1D1B]'
                          : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-700'
                      }\`}
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
`,

  // 2. GRID DE CATEGORÍAS MULTI-IDIOMA
  'components/CategoryCircleGrid.tsx': `'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { Category } from '@/types/database';

interface CategoryCircleGridProps {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export function CategoryCircleGrid({
  categories,
  selectedCategory = 'all',
  onSelectCategory,
}: CategoryCircleGridProps) {
  const { t, language } = useLanguage();

  const getCategoryName = (cat: Category) => {
    if (language === 'eu') return cat.name_eu;
    if (language === 'fr') return cat.name_fr;
    if (language === 'en') return cat.name_en;
    return cat.name_es;
  };

  const getCategorySubtitle = (slug: string) => {
    switch (slug) {
      case 'quesos':
        return language === 'eu' ? 'Artisau & Afinatuak' : 'Artesanos & Afinados';
      case 'atun':
        return language === 'eu' ? 'Kantauri itsasoa' : 'Cantábrico Costera';
      case 'salazones':
        return language === 'eu' ? 'Antxoak & Gatzadurak' : 'Anchoas & Salazón';
      case 'gildas':
        return language === 'eu' ? 'Gilda & Ozpinetakoak' : 'Gildas & Encurtidos';
      case 'cerveza':
        return language === 'eu' ? 'Garagardo Bereziak' : 'Craft & Especiales';
      case 'txakoli':
        return language === 'eu' ? 'Bizkaiko Txakolina' : 'Bizkaiko Txakolina';
      case 'sidra':
        return language === 'eu' ? 'Euskal Sagardoa' : 'Euskal Sagardoa';
      default:
        return 'Gourmet Selection';
    }
  };

  return (
    <section className="space-y-6 pt-2">
      <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
            {t.cat_explore}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 uppercase font-serif tracking-tight">
            Categorías Selección EkhiTeka
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory?.(cat.id)}
              className={\`group relative p-3 sm:p-4 rounded-3xl border-2 text-center transition-all flex flex-col items-center justify-between cursor-pointer hover:scale-103 shadow-xs \${
                isSelected
                  ? 'bg-[#FFE259] border-stone-900 dark:border-white shadow-md'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-[#FFE259] dark:hover:border-[#FFE259]'
              }\`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-stone-200 dark:border-stone-700 group-hover:border-[#FFE259] mb-2 p-0.5 bg-[#FAF8F5]">
                <img
                  src={cat.image_url || '/images/secciones/Quesos.JPG'}
                  alt={getCategoryName(cat)}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="space-y-0.5 min-w-0 w-full">
                <span className={\`block font-serif font-black text-xs sm:text-[13px] truncate leading-tight \${
                  isSelected ? 'text-[#1D1D1B]' : 'text-stone-900 dark:text-stone-100 group-hover:text-[#C68D07] dark:group-hover:text-[#FFE259]'
                }\`}>
                  {getCategoryName(cat)}
                </span>
                <span className={\`block text-[9.5px] font-sans font-bold uppercase tracking-wider truncate \${
                  isSelected ? 'text-stone-800' : 'text-stone-400 dark:text-stone-500'
                }\`}>
                  {getCategorySubtitle(cat.slug)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
`,

  // 3. CATALOG VIEW (Sin botón redundante, con búsqueda limpia y multi-idioma)
  'components/CatalogView.tsx': `'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ProductCard } from '@/components/ProductCard';
import { CategoryCircleGrid } from '@/components/CategoryCircleGrid';
import { ExperienceBanners } from '@/components/ExperienceBanners';
import { CustomerReviews } from '@/components/CustomerReviews';
import type { Category, ProductWithSeller } from '@/types/database';
import { Search, SlidersHorizontal, Sparkles, ArrowDown, MessageCircle } from 'lucide-react';

interface CatalogViewProps {
  products: ProductWithSeller[];
  categories: Category[];
  initialCategory?: string;
  isSeller?: boolean;
}

export function CatalogView({
  products,
  categories,
  initialCategory = 'all',
  isSeller = false,
}: CatalogViewProps) {
  const { t, language } = useLanguage();
  const [selectedCat, setSelectedCat] = useState<string>(initialCategory);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'price_asc' | 'price_desc'>('name_asc');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCat !== 'all' && p.category_id !== selectedCat) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = (p.description || '').toLowerCase().includes(q);
          const matchOrigin = (p.origin_region || '').toLowerCase().includes(q);
          const matchSeller = (p.profiles?.full_name || '').toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchOrigin && !matchSeller) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
        if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
        if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
        return 0;
      });
  }, [products, selectedCat, search, sortBy]);

  const getCategoryName = (cat: Category) => {
    if (language === 'eu') return cat.name_eu;
    if (language === 'fr') return cat.name_fr;
    if (language === 'en') return cat.name_en;
    return cat.name_es;
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalogo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 1. Hero Editorial Gourmet */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-14 lg:p-16 border-2 border-stone-800 shadow-2xl min-h-[420px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/secciones/Tienda.JPG"
            alt="Tienda EkhiTeka Lekeitio"
            className="w-full h-full object-cover object-center scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/25 to-black/10 dark:from-black/85 dark:via-black/65 dark:to-black/40" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          <div className="lg:col-span-8 space-y-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-black rounded-full uppercase tracking-wider shadow-md">
              <Sparkles className="w-3.5 h-3.5" /> {t.shop_specialty} · Lekeitio
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] font-serif sm:font-sans text-white drop-shadow-md">
              {t.shop_hero_title}
            </h1>

            <p className="text-sm sm:text-base text-white/95 leading-relaxed max-w-xl font-medium drop-shadow-md">
              {t.shop_hero_desc}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={scrollToCatalog}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs sm:text-sm transition-all shadow-xl hover:scale-105 cursor-pointer uppercase tracking-wider font-serif"
              >
                <span>{t.shop_see_cheeses}</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/34600000000?text=Hola,%20quisiera%20hacer%20un%20encargo%20a%20medida"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-black/60 hover:bg-black/80 text-white font-black text-xs sm:text-sm border-2 border-white/40 transition-all backdrop-blur-md shadow-lg hover:scale-105 font-serif"
              >
                <MessageCircle className="w-4 h-4 text-[#FFE259]" />
                <span>{t.shop_whatsapp_orders}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full overflow-hidden border-4 border-[#FFE259] shadow-2xl p-1 bg-[#FAF7F2] hover:scale-105 transition-transform duration-500">
              <img
                src="/Logo.jpg"
                alt="EkhiTeka Lekeitio"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categorías */}
      <CategoryCircleGrid
        categories={categories}
        selectedCategory={selectedCat}
        onSelectCategory={(id) => {
          setSelectedCat(id);
          scrollToCatalog();
        }}
      />

      {/* 3. Catálogo Principal */}
      <section id="catalogo" className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
              {t.shop_specialty}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1D1D1B] dark:text-stone-100 tracking-tight leading-tight uppercase font-serif">
              {t.cat_queso} & {t.brand_tagline}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
              {t.prod_showing ? \`\${filteredProducts.length} \${t.prod_showing}\` : \`\${filteredProducts.length}\`}
            </span>
          </div>
        </div>

        {/* Pestañas de Categorías */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar font-serif">
          <button
            type="button"
            onClick={() => setSelectedCat('all')}
            className={\`flex items-center justify-center text-center gap-2 px-5 py-2.5 rounded-full tracking-[0.16em] uppercase text-[11px] font-semibold whitespace-nowrap transition-all shadow-2xs cursor-pointer \${
              selectedCat === 'all'
                ? 'bg-[#FFE259] text-[#1D1D1B] scale-102 shadow-xs border border-stone-800 font-bold'
                : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
            }\`}
          >
            <span>{t.cat_all}</span>
            <span className="text-[10px] opacity-70 font-sans">({products.length})</span>
          </button>

          {categories.map((cat) => {
            const count = products.filter((p) => p.category_id === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={\`flex items-center justify-center text-center gap-2 px-5 py-2.5 rounded-full tracking-[0.16em] uppercase text-[11px] font-semibold whitespace-nowrap transition-all shadow-2xs cursor-pointer \${
                  selectedCat === cat.id
                    ? 'bg-[#FFE259] text-[#1D1D1B] scale-102 shadow-xs border border-stone-800 font-bold'
                    : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                }\`}
              >
                <span>{getCategoryName(cat)}</span>
                <span className="text-[10px] opacity-70 font-sans">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Buscador y Orden */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.prod_search_placeholder}
              className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFE259] text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end font-serif">
            <SlidersHorizontal className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2 bg-[#FAF8F5] dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#FFE259] cursor-pointer shadow-2xs"
            >
              <option value="name_asc">{t.prod_sort_name_asc}</option>
              <option value="name_desc">{t.prod_sort_name_desc}</option>
              <option value="price_asc">{t.prod_sort_price_asc}</option>
              <option value="price_desc">{t.prod_sort_price_desc}</option>
            </select>
          </div>
        </div>

        {/* Grid de Productos */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} isSeller={isSeller} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 mx-auto">
              <Search className="w-6 h-6 text-stone-400" />
            </div>
            <h3 className="text-base font-black font-serif text-stone-800 dark:text-stone-200">
              {t.prod_no_results}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {t.prod_search_placeholder}
            </p>
          </div>
        )}
      </section>

      {/* 4. Experiencias */}
      <ExperienceBanners />

      {/* 5. Tienda Física */}
      <section className="relative rounded-3xl bg-[#FAF7F2] dark:bg-[#1C1B19] border border-stone-200/90 dark:border-stone-800 p-8 sm:p-12 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
              {t.shop_visit_subtitle}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#1D1D1B] dark:text-stone-100 tracking-tight leading-tight font-serif sm:font-sans">
              {t.shop_visit_title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              {t.shop_visit_desc}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-stone-700 dark:text-stone-300">
              <div className="flex items-center gap-2">
                <span className="text-base">📍</span>
                <span>Gamarra Kalea 4, Lekeitio · Bizkaia</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">🕒</span>
                <span>{t.footer_schedule_weekdays}</span>
              </div>
            </div>
            <div className="pt-2">
              <a
                href="https://wa.me/34600000000?text=Hola,%20quisiera%20consultar%20disponibilidad%20en%20tienda%20Lekeitio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1D1D1B] dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105 font-serif"
              >
                <MessageCircle className="w-4 h-4 text-[#FFE259] dark:text-[#1D1D1B]" />
                <span>{t.shop_visit_contact}</span>
              </a>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200 dark:border-stone-700 h-64 sm:h-80 group">
              <img
                src="/images/secciones/Tienda.JPG"
                alt="Tienda EkhiTeka Lekeitio"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black rounded-full uppercase tracking-wider shadow-md">
                Lekeitio Centro
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Opiniones */}
      <CustomerReviews />
    </div>
  );
}
`
};

console.log('📦 Escribiendo archivos de la Fase 2 en EkhiTeka...');

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim(), 'utf8');
  console.log(`✅ Creado / Actualizado: ${filePath}`);
});

console.log('\n🎉 ¡Bloque 2 aplicado correctamente!');