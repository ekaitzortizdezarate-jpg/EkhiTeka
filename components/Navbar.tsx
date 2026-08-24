import { createClient } from '@/lib/supabase/server';
import { type Profile, parseProfile } from '@/types/database';
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

  // Consultar perfil del vendedor para la dirección dinámica en la sub-barra
  const { data: sellerRaw } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'vendedor')
    .limit(1)
    .maybeSingle();

  const sellerProfile = parseProfile(sellerRaw);
  const storeAddress = sellerProfile.street
    ? `${sellerProfile.street}${sellerProfile.number ? ` ${sellerProfile.number}` : ''}, ${sellerProfile.town || 'Lekeitio'}${sellerProfile.province ? ` · ${sellerProfile.province}` : ''}`
    : 'Gamarra Kalea 4, Lekeitio · Bizkaia';

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
        </div>
      </div>

      {/* Sub-barra de Utilidades con dirección dinámica del vendedor */}
      <div className="border-t border-[#E8E5DF]/70 dark:border-stone-800/80 bg-[#FAF8F5]/80 dark:bg-[#141312]/80 px-4 sm:px-6 lg:px-8 py-1.5 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs font-serif">
          <span className="text-[10px] sm:text-[11px] font-sans font-medium text-stone-500 dark:text-stone-400 tracking-wider">
            {storeAddress}
          </span>
          <div className="flex items-center gap-2">
            <ThemeSelector />
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
}
