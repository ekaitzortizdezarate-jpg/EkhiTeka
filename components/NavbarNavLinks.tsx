'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { signout } from '@/app/actions/auth';
import type { Profile } from '@/types/database';
import {
  Store,
  ShoppingBag,
  Package,
  MessageCircle,
  ShieldCheck,
  PlusCircle,
  User,
  LogOut,
  LogIn,
} from 'lucide-react';

interface NavbarNavLinksProps {
  user: { id: string } | null;
  profile: Profile | null;
  unreadMessagesCount: number;
  ordersCount: number;
}

export function NavbarNavLinks({
  user,
  profile,
  unreadMessagesCount,
  ordersCount,
}: NavbarNavLinksProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isSeller = profile?.role === 'vendedor';
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="flex items-center gap-4 sm:gap-6 min-w-0">
      {/* Logotipo Editorial Gourmet */}
      <Link href="/" className="flex items-center gap-2 shrink-0 group">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/15 dark:bg-amber-500/25 border-2 border-amber-500/40 flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
          🧀
        </div>
        <div>
          <span className="font-black text-lg sm:text-2xl tracking-tight text-stone-900 dark:text-stone-100 block leading-tight">
            Ekhi<span className="text-amber-600 dark:text-amber-400">Teka</span>
          </span>
          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-stone-500 dark:text-stone-400 block -mt-0.5">
            Gourmet · Bilbao
          </span>
        </div>
      </Link>

      {/* Enlaces Principales */}
      <nav className="hidden lg:flex items-center gap-1 text-xs font-black">
        <Link
          href="/"
          className={`px-3 py-2 rounded-xl transition-all ${
            pathname === '/'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          {t.nav_shop}
        </Link>

        {user && (
          <>
            {/* Pedidos */}
            <Link
              href={isSeller ? '/vendedor/pedidos' : '/comprador/pedidos'}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                pathname.includes('/pedidos')
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>{t.nav_orders}</span>
              {ordersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black flex items-center justify-center animate-pulse">
                  {ordersCount}
                </span>
              )}
            </Link>

            {/* Mensajes / Chat */}
            <Link
              href="/chat"
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                pathname.startsWith('/chat')
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.nav_chats}</span>
              {unreadMessagesCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </Link>

            {/* Vendedor: Añadir Producto */}
            {isSeller && (
              <Link
                href="/vendedor/productos/nuevo"
                className="flex items-center gap-1 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl transition-all shadow-2xs font-bold"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.seller_new_product}</span>
              </Link>
            )}

            {/* Admin */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1 px-3 py-2 bg-purple-100 dark:bg-purple-950/70 text-purple-950 dark:text-purple-200 border border-purple-300 dark:border-purple-700 rounded-xl transition-all font-black"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.nav_admin}</span>
              </Link>
            )}
          </>
        )}
      </nav>

      {/* Menú Usuario */}
      <div className="flex items-center gap-2">
        {user ? (
          <div className="flex items-center gap-2">
            <Link
              href="/perfil"
              className="p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title={t.nav_profile}
            >
              <User className="w-4 h-4" />
            </Link>
            <form action={signout}>
              <button
                type="submit"
                className="p-2 rounded-xl text-stone-500 hover:text-red-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                title={t.nav_logout}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {t.nav_login}
            </Link>
            <Link
              href="/register"
              className="px-3 py-1.5 text-xs font-black bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl transition-all shadow-2xs"
            >
              {t.nav_register}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
