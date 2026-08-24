import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database';
import { NavbarNavLinks } from '@/components/NavbarNavLinks';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ThemeSelector } from '@/components/ThemeSelector';
import { CartNavButton } from '@/components/CartNavButton';

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
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 dark:bg-[#141312]/95 backdrop-blur-md border-b border-[#E8E5DF] dark:border-stone-800 shadow-xs transition-colors">
      {/* Barra Principal de Navegación */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        <NavbarNavLinks
          user={user}
          profile={profile}
          unreadMessagesCount={unreadMessagesCount}
          ordersCount={ordersCount}
        />

        {/* Acciones Derecha */}
        <div className="flex items-center gap-2.5">
          {(!profile || profile.role === 'comprador') && (
            <CartNavButton />
          )}

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-stone-200 dark:border-stone-800">
            <ThemeSelector />
            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* 3. Sub-barra móvil para selectores de idioma y tema */}
      <div className="sm:hidden border-t border-stone-200/60 dark:border-stone-800/80 bg-stone-50/90 dark:bg-stone-950/90 px-4 py-1.5 flex items-center justify-between text-xs">
        <span className="text-[11px] font-bold text-stone-500">EkhiTeka Gourmet Lekeitio</span>
        <div className="flex items-center gap-1.5">
          <ThemeSelector />
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
