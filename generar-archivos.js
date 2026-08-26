const fs = require('fs');
const path = require('path');

const files = {
  // =========================================================================
  // 1. NAVBAR (Reemplaza icono de chat por pedidos en la barra superior móvil)
  // =========================================================================
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
  LogIn,
  Menu,
  X,
  Store,
  Package,
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

  const ordersUrl = isSeller ? '/vendedor/pedidos' : '/comprador/pedidos';

  return (
    <div className="flex items-center justify-between w-full min-w-0 gap-3">
      {/* 1. LADO IZQUIERDO */}
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
          <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 border-stone-200 dark:border-stone-700 group-hover:border-[#FFE259] group-hover:scale-105 transition-all shadow-xs bg-[#FAF8F5] shrink-0">
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
            <span className="block text-center">{t.nav_gourmet_gifts_line1}</span>
            <span className="block text-center">{t.nav_gourmet_gifts_line2}</span>
          </Link>

          <Link
            href="/experiencias"
            className={\`flex flex-col items-center justify-center text-center px-3 xl:px-4 py-1 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[10.5px] xl:text-[11px] font-semibold transition-all leading-tight whitespace-nowrap min-h-[38px] \${
              pathname === '/experiencias'
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs border border-stone-800/10'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }\`}
          >
            <span className="block text-center">{t.nav_tastings_line1}</span>
            <span className="block text-center">{t.nav_tastings_line2}</span>
          </Link>

          <Link
            href="/regalos-empresa"
            className={\`flex flex-col items-center justify-center text-center px-3 xl:px-4 py-1 rounded-2xl tracking-[0.14em] xl:tracking-[0.18em] uppercase text-[10.5px] xl:text-[11px] font-semibold transition-all leading-tight whitespace-nowrap min-h-[38px] \${
              pathname === '/regalos-empresa'
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs border border-stone-800/10'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }\`}
          >
            <span className="block text-center">{t.nav_corporate_line1}</span>
            <span className="block text-center">{t.nav_corporate_line2}</span>
          </Link>

          {user && (
            <>
              <Link
                href={ordersUrl}
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
                  <span className="block text-center">{t.nav_add_product_line1}</span>
                  <span className="block text-center">{t.nav_add_product_line2}</span>
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

      {/* 2. LADO DERECHO */}
      <div className="flex items-center gap-2 shrink-0">
        {user ? (
          <div className="flex items-center gap-2">
            {(!profile || profile.role === 'comprador') && <CartNavButton />}

            {/* Icono de Pedidos en Barra Superior Móvil y Desktop */}
            <Link
              href={ordersUrl}
              className={\`relative p-2.5 rounded-2xl border transition-all shrink-0 \${
                pathname.includes('/pedidos')
                  ? 'bg-[#FFE259] text-[#1D1D1B] border-stone-800 shadow-xs'
                  : hasUnseenOrderUpdates
                  ? 'bg-[#FFE259]/30 text-stone-900 dark:text-stone-100 border-[#FFE259] ring-2 ring-[#FFE259]/50 animate-pulse'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }\`}
              title={t.nav_orders}
            >
              <Package className="w-4 h-4" />
              {hasUnseenOrderUpdates && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FFE259] border-2 border-stone-900 animate-ping" />
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
          <div className="flex items-center gap-2">
            <CartNavButton />

            <Link
              href="/login"
              className="flex sm:hidden p-2.5 rounded-2xl bg-stone-100 hover:bg-[#FFE259] dark:bg-stone-800 dark:hover:bg-[#FFE259] text-stone-800 dark:text-stone-200 hover:text-[#1D1D1B] dark:hover:text-[#1D1D1B] border border-stone-200 dark:border-stone-700 transition-all cursor-pointer shadow-2xs"
              title={t.nav_login}
              aria-label={t.nav_login}
            >
              <LogIn className="w-4 h-4" />
            </Link>

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
          </div>
        )}
      </div>

      {/* 3. MENÚ MÓVIL LATERAL */}
      {mounted && mobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[999999] lg:hidden" style={{ zIndex: 999999 }}>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed top-0 bottom-0 left-0 max-w-xs w-full bg-[#1D1D1B] text-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-[1000000] border-r border-stone-800 animate-in slide-in-from-left duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FFE259] p-0.5 bg-[#FAF8F5] group-hover:scale-105 transition-transform shrink-0">
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
                </Link>
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
                  {t.nav_explore_selection}
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
                  <span>{t.nav_gourmet_gifts}</span>
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
                  <span>{t.nav_tastings_experiences}</span>
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
                  <span>{t.nav_corporate_gifts}</span>
                </Link>
              </div>

              {/* SECCIÓN TU CUENTA */}
              <div className="space-y-2.5 pt-4 border-t border-stone-800 font-serif">
                <p className="text-[11px] font-sans font-black uppercase tracking-[0.2em] text-[#FFE259] text-center pb-1">
                  {t.nav_your_account}
                </p>
                {user ? (
                  <>
                    <Link
                      href={ordersUrl}
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
                        <span>{t.nav_add_product}</span>
                      </Link>
                    )}

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

  // =========================================================================
  // 2. PEDIDOS VENDEDOR (Modo oscuro corregido para la info de envío y cliente)
  // =========================================================================
  'components/SellerOrdersView.tsx': `'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LOCALE_MAP } from '@/lib/i18n/translations';
import { updateOrderStatus } from '@/app/actions/orders';
import Link from 'next/link';
import type { Order, OrderStatus } from '@/types/database';
import { Package, MessageCircle, User, MapPin, Store } from 'lucide-react';

export function SellerOrdersView({ orders }: { orders: Order[] }) {
  const { t, language } = useLanguage();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setLoadingId(orderId);
    await updateOrderStatus(orderId, newStatus);
    setLoadingId(null);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendiente': return t.orders_pending;
      case 'confirmado': return t.orders_confirmed;
      case 'preparando': return t.orders_preparing;
      case 'listo_entrega': return t.orders_ready_delivery;
      case 'entregado': return t.orders_delivered;
      case 'cancelado': return t.orders_cancelled;
      default: return status;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
        <h1 className="text-3xl font-black font-serif text-stone-900 dark:text-stone-100">
          {t.orders_title_seller}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
          {t.orders_subtitle_seller}
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const total = Number(order.total_price ?? order.total_amount ?? 0);
            const isStorePickup = order.delivery_type === 'recogida_tienda' || order.delivery_method === 'recogida_tienda' || order.delivery_method === 'tienda';

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-serif">
                      {t.orders_order_number} #{order.id.slice(0, 8)}
                    </span>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                      {new Date(order.created_at).toLocaleDateString(LOCALE_MAP[language] || 'eu', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-[#C68D07] dark:text-[#FFE259] font-black text-xs uppercase tracking-wider font-serif">
                      {getStatusText(order.status)}
                    </span>
                    <span className="text-base font-black font-serif text-stone-900 dark:text-stone-100">
                      {t.orders_total_to_charge} {total.toFixed(2)} €
                    </span>
                  </div>
                </div>

                {/* Datos del Cliente y Modo de Entrega (Modo oscuro 100% corregido) */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-800 text-xs space-y-2 font-sans">
                  <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
                    <User className="w-3.5 h-3.5 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
                    <span>{order.profiles?.full_name || t.orders_client_label}</span>
                    {order.profiles?.phone && (
                      <span className="text-stone-500 dark:text-stone-400 font-normal">· {order.profiles.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                    {isStorePickup ? (
                      <>
                        <Store className="w-3.5 h-3.5 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
                        <span>{t.deliv_store_pickup_tag}</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0" />
                        <span>{order.shipping_address || t.deliv_home_tag}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Productos a preparar */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider font-serif text-stone-700 dark:text-stone-300">
                      {t.orders_products_to_prepare}
                    </h4>
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-stone-100 dark:border-stone-800 last:border-0 font-sans">
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-[#C68D07] dark:text-[#FFE259]" />
                          <span className="font-bold text-stone-800 dark:text-stone-200">
                            {item.products?.name || 'Producto'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#FFE259] text-[#1D1D1B] font-black text-[10px]">
                            x{item.quantity}
                          </span>
                        </div>
                        <span className="font-serif font-black text-stone-900 dark:text-stone-100">
                          {Number(item.subtotal || item.unit_price * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Botones de Cambio de Estado en 1 clic */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 font-serif">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={loadingId === order.id || order.status === 'confirmado'}
                      onClick={() => handleStatusChange(order.id, 'confirmado')}
                      className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
                        order.status === 'confirmado'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 hover:bg-blue-100 dark:hover:bg-blue-950 text-stone-700 dark:text-stone-300'
                      }\`}
                    >
                      {t.status_confirm}
                    </button>

                    <button
                      type="button"
                      disabled={loadingId === order.id || order.status === 'preparando'}
                      onClick={() => handleStatusChange(order.id, 'preparando')}
                      className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
                        order.status === 'preparando'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-stone-700 dark:text-stone-300'
                      }\`}
                    >
                      {t.status_preparing}
                    </button>

                    <button
                      type="button"
                      disabled={loadingId === order.id || order.status === 'listo_entrega'}
                      onClick={() => handleStatusChange(order.id, 'listo_entrega')}
                      className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
                        order.status === 'listo_entrega'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 hover:bg-purple-100 dark:hover:bg-purple-950 text-stone-700 dark:text-stone-300'
                      }\`}
                    >
                      {t.status_ready}
                    </button>

                    <button
                      type="button"
                      disabled={loadingId === order.id || order.status === 'entregado'}
                      onClick={() => handleStatusChange(order.id, 'entregado')}
                      className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
                        order.status === 'entregado'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-stone-700 dark:text-stone-300'
                      }\`}
                    >
                      {t.status_delivered}
                    </button>
                  </div>

                  <Link
                    href={\`/chat/\${order.buyer_id}?order_id=\${order.id}\`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-stone-800 dark:text-stone-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{t.orders_chat_with_buyer}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center space-y-4 bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8">
          <Package className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
          <h3 className="text-lg font-black font-serif text-stone-800 dark:text-stone-200">
            {t.orders_no_orders_seller}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
            {t.orders_no_orders_seller_sub}
          </p>
        </div>
      )}
    </div>
  );
}
`,

  // =========================================================================
  // 3. PEDIDOS COMPRADOR (Indicación lumínica por tarjeta y botón "Visto")
  // =========================================================================
  'components/BuyerOrdersView.tsx': `'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LOCALE_MAP } from '@/lib/i18n/translations';
import Link from 'next/link';
import type { Order } from '@/types/database';
import { Package, MessageCircle, MapPin, Store, CheckCircle, Sparkles } from 'lucide-react';

export function BuyerOrdersView({ orders }: { orders: Order[] }) {
  const { t, language } = useLanguage();
  const [seenMap, setSeenMap] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ekhiteka_seen_orders_buyer');
      if (stored) {
        setSeenMap(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const handleMarkAsSeen = (orderId: string, currentStatus: string) => {
    const updated = { ...seenMap, [orderId]: currentStatus };
    setSeenMap(updated);
    try {
      localStorage.setItem('ekhiteka_seen_orders_buyer', JSON.stringify(updated));
      window.dispatchEvent(new Event('ekhiteka_orders_seen_updated'));
    } catch {}
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendiente': return t.orders_pending;
      case 'confirmado': return t.orders_confirmed;
      case 'preparando': return t.orders_preparing;
      case 'listo_entrega': return t.orders_ready_delivery;
      case 'entregado': return t.orders_delivered;
      case 'cancelado': return t.orders_cancelled;
      default: return status;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
        <h1 className="text-3xl font-black font-serif text-stone-900 dark:text-stone-100">
          {t.orders_title}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
          {t.orders_subtitle_buyer}
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const total = Number(order.total_price ?? order.total_amount ?? 0);
            const isStorePickup = order.delivery_type === 'recogida_tienda' || order.delivery_method === 'recogida_tienda' || order.delivery_method === 'tienda';
            
            // Comprobar si este pedido específico tiene un cambio de estado no visto
            const lastSeenStatus = seenMap[order.id];
            const hasUpdate = lastSeenStatus ? lastSeenStatus !== order.status : order.status !== 'pendiente';

            return (
              <div
                key={order.id}
                className={\`bg-white dark:bg-[#1C1B19] rounded-3xl border-2 p-6 space-y-5 shadow-xs transition-all \${
                  hasUpdate
                    ? 'border-[#FFE259] ring-2 ring-[#FFE259]/40 shadow-lg animate-pulse'
                    : 'border-stone-200 dark:border-stone-800'
                }\`}
              >
                {/* Banner de novedad si el pedido cambió de estado */}
                {hasUpdate && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-[#FFE259] rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
                    <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold">
                      <Sparkles className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
                      <span>{t.orders_new_status} <strong className="text-[#C68D07] dark:text-[#FFE259] uppercase">{getStatusText(order.status)}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMarkAsSeen(order.id, order.status)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-[11px] uppercase tracking-wider rounded-xl shadow-xs cursor-pointer transition-transform hover:scale-105"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{t.orders_mark_seen}</span>
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-serif">
                      {t.orders_order_number} #{order.id.slice(0, 8)}
                    </span>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                      {new Date(order.created_at).toLocaleDateString(LOCALE_MAP[language] || 'eu', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={\`px-3 py-1 rounded-xl font-black text-xs uppercase tracking-wider font-serif \${
                      hasUpdate
                        ? 'bg-[#FFE259] text-[#1D1D1B] shadow-md'
                        : 'bg-amber-100 dark:bg-amber-950/70 text-[#C68D07] dark:text-[#FFE259]'
                    }\`}>
                      {getStatusText(order.status)}
                    </span>
                    <span className="text-base font-black font-serif text-stone-900 dark:text-stone-100">
                      {total.toFixed(2)} €
                    </span>
                  </div>
                </div>

                {order.order_items && order.order_items.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider font-serif text-stone-700 dark:text-stone-300">
                      {t.orders_products_label}
                    </h4>
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-stone-100 dark:border-stone-800 last:border-0 font-sans">
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-[#C68D07] dark:text-[#FFE259]" />
                          <span className="font-bold text-stone-800 dark:text-stone-200">
                            {item.products?.name || 'Producto Gourmet'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#FFE259] text-[#1D1D1B] font-black text-[10px]">
                            x{item.quantity}
                          </span>
                        </div>
                        <span className="font-serif font-black text-stone-900 dark:text-stone-100">
                          {Number(item.subtotal || item.unit_price * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs font-serif">
                  <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300 font-sans">
                    {isStorePickup ? (
                      <>
                        <Store className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
                        <span>{t.deliv_store_pickup_tag}</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
                        <span>{order.shipping_address || t.deliv_home_tag}</span>
                      </>
                    )}
                  </div>

                  <Link
                    href={\`/chat/\${order.seller_id}?order_id=\${order.id}\`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-stone-800 dark:text-stone-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{t.orders_chat_with_seller}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center space-y-4 bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8">
          <Package className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
          <h3 className="text-lg font-black font-serif text-stone-800 dark:text-stone-200">
            {t.orders_no_orders}
          </h3>
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider font-serif shadow-xs hover:scale-105 transition-all"
          >
            <span>{t.cart_explore_btn}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
`,
};

// Generar todos los archivos en disco
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trimStart(), 'utf8');
  console.log(`✓ Actualizado correctamente: ${filePath}`);
});

console.log('\n🎉 ¡Móvil, modo oscuro en pedidos de vendedor y botón Visto en comprador actualizados con éxito!');