import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database';
import { NavbarNavLinks } from '@/components/NavbarNavLinks';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ThemeSelector } from '@/components/ThemeSelector';
import { CartNavButton } from '@/components/CartNavButton';
import { Truck, Store, Sparkles } from 'lucide-react';

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  let unreadMessagesCount = 0;
  let ordersCount = 0;

  if (user) {
    const [profileRes, unreadRes, ordersRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false),
      supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .or(`seller_id.eq.${user.id},buyer_id.eq.${user.id}`)
        .in('status', ['pendiente', 'confirmado', 'preparando', 'listo_entrega']),
    ]);

    profile = profileRes.data;
    unreadMessagesCount = unreadRes.count || 0;
    ordersCount = ordersRes.count || 0;
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b-2 border-stone-200 dark:border-stone-800 shadow-xs transition-colors">
      {/* 1. Top Banner Avisos Gourmet (La Manducateca style) */}
      <div className="bg-amber-600 dark:bg-amber-700 text-white text-[11px] font-extrabold py-1.5 px-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0">
            <Truck className="w-3.5 h-3.5" />
            <span>Envío refrigerado 24/48h · Bidalpen hoztua</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            <Store className="w-3.5 h-3.5" />
            <span>Recogida gratuita en tienda · Dendan jasotzea</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Selección de autor · Artisau produktuak</span>
          </div>
        </div>
      </div>

      {/* 2. Barra Principal de Navegación */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        <NavbarNavLinks
          user={user}
          profile={profile}
          unreadMessagesCount={unreadMessagesCount}
          ordersCount={ordersCount}
        />

        {/* Acciones Derecha */}
        <div className="flex items-center gap-2">
          <CartNavButton />
          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-stone-200 dark:border-stone-700">
            <ThemeSelector />
            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* 3. Sub-barra móvil para selectores de idioma y tema */}
      <div className="sm:hidden border-t border-stone-100 dark:border-stone-800/80 bg-stone-50/80 dark:bg-stone-950/80 px-3 py-1 flex items-center justify-end gap-1.5">
        <ThemeSelector />
        <LanguageSelector />
      </div>
    </header>
  );
}
