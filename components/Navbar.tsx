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
  const mainStoreAddr =
    sellerProfile.pickup_addresses?.find((a) => a.is_main) ||
    sellerProfile.pickup_addresses?.find((a) => a.is_active) ||
    sellerProfile.pickup_addresses?.[0];

  const storeAddress = mainStoreAddr
    ? `${mainStoreAddr.street}${mainStoreAddr.number ? ` ${mainStoreAddr.number}` : ''}, ${mainStoreAddr.town} · ${mainStoreAddr.province}`
    : 'Gamarra Kalea 4, Lekeitio · Bizkaia';

  if (user) {
    const { data: profileRaw } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    profile = profileRaw;
    const parsedProfile = parseProfile(profileRaw);
    const isSeller = parsedProfile.role === 'vendedor' || parsedProfile.role === 'admin';
    const lastReadMap = parsedProfile.last_read_chats || {};

    if (isSeller) {
      // 1. Para vendedores: todos los pedidos y consultas de la tienda
      const [ordersRes, allSellersRes, allMsgsRes] = await Promise.all([
        supabase
          .from('orders')
          .select('id, status, seller_id, buyer_id, created_at, updated_at')
          .order('updated_at', { ascending: false })
          .limit(50),
        supabase
          .from('profiles')
          .select('id')
          .in('role', ['vendedor', 'admin']),
        supabase
          .from('chat_messages')
          .select('id, sender_id, receiver_id, created_at')
          .neq('sender_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100),
      ]);

      activeOrders = (ordersRes.data || []) as any;
      ordersCount = activeOrders.filter((o) =>
        ['pendiente', 'confirmado', 'preparando', 'listo_entrega'].includes(o.status)
      ).length;

      const sellerIds = new Set((allSellersRes.data || []).map((s) => s.id));
      const unreadConvs = new Set<string>();

      (allMsgsRes.data || []).forEach((msg) => {
        const isSenderSeller = sellerIds.has(msg.sender_id);
        const buyerId = isSenderSeller ? msg.receiver_id : msg.sender_id;
        if (!buyerId) return;

        const myLastRead = lastReadMap[buyerId] ? new Date(lastReadMap[buyerId]).getTime() : 0;
        const msgTime = new Date(msg.created_at).getTime();
        if (msgTime > myLastRead) {
          unreadConvs.add(buyerId);
        }
      });

      unreadMessagesCount = unreadConvs.size;
    } else {
      // 2. Para compradores: solo sus pedidos y mensajes de la tienda
      const [ordersRes, myMsgsRes] = await Promise.all([
        supabase
          .from('orders')
          .select('id, status, seller_id, buyer_id, created_at, updated_at')
          .eq('buyer_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(50),
        supabase
          .from('chat_messages')
          .select('id, sender_id, receiver_id, created_at')
          .eq('receiver_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50),
      ]);

      activeOrders = (ordersRes.data || []) as any;
      ordersCount = activeOrders.filter((o) =>
        ['pendiente', 'confirmado', 'preparando', 'listo_entrega'].includes(o.status)
      ).length;

      const myLastRead = Object.values(lastReadMap)[0];
      const lastReadTime = myLastRead ? new Date(myLastRead).getTime() : 0;

      let unreadCount = 0;
      (myMsgsRes.data || []).forEach((msg) => {
        if (new Date(msg.created_at).getTime() > lastReadTime) {
          unreadCount += 1;
        }
      });

      unreadMessagesCount = unreadCount;
    }
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
          storeAddress={storeAddress}
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
