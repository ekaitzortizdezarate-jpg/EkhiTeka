import { createClient } from '@/lib/supabase/server';
import { type Profile, parseProfile } from '@/types/database';
import { NavbarNavLinks } from '@/components/NavbarNavLinks';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ThemeSelector } from '@/components/ThemeSelector';

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  let unreadMessagesCount = 0;
  let ordersCount = 0;
  let activeOrders: { id: string; status: string }[] = [];

  const { data: sellerRaw } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'vendedor')
    .limit(1)
    .maybeSingle();

  const sellerProfile = parseProfile(sellerRaw);
  const activeAddr = sellerProfile.pickup_addresses?.find((a) => a.is_active) || sellerProfile.pickup_addresses?.[0];
  const storeAddress = activeAddr
    ? `${activeAddr.street}${activeAddr.number ? ` ${activeAddr.number}` : ''}, ${activeAddr.town} · ${activeAddr.province}`
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
        .select('id, status, seller_id, buyer_id')
        .or(`seller_id.eq.${user.id},buyer_id.eq.${user.id}`)
        .order('updated_at', { ascending: false })
        .limit(50),
    ]);

    profile = profileRes.data;
    unreadMessagesCount = unreadRes.count || 0;
    activeOrders = ordersRes.data || [];
    ordersCount = activeOrders.filter((o) =>
      ['pendiente', 'confirmado', 'preparando', 'listo_entrega'].includes(o.status)
    ).length;
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
          activeOrders={activeOrders}
        />
      </div>

      {/* Sub-barra de Utilidades */}
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
