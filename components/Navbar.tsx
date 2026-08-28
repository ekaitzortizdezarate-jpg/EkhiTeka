import { createClient } from '@/lib/supabase/server';
import { type Profile, parseProfile, isProfileComplete, getOrderStatusHistory } from '@/types/database';
import { getUnifiedStoreConfig } from '@/app/actions/auth';
import { NavbarNavLinks } from '@/components/NavbarNavLinks';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ThemeSelector } from '@/components/ThemeSelector';

export default async function Navbar() {
  const supabase = await createClient();
  const [storeConfig, { data: userRes }] = await Promise.all([
    getUnifiedStoreConfig(supabase),
    supabase.auth.getUser(),
  ]);
  const user = userRes?.user;

  let profile: Profile | null = null;
  let unreadMessagesCount = 0;
  let ordersCount = 0;
  let activeOrders: { id: string; status: string; updated_at?: string; created_at?: string; seller_id?: string; buyer_id?: string }[] = [];

  const mainStoreAddr =
    storeConfig.pickup_addresses?.find((a) => a.is_main) ||
    storeConfig.pickup_addresses?.find((a) => a.is_active) ||
    storeConfig.pickup_addresses?.[0];

  const storeAddress = mainStoreAddr
    ? `${mainStoreAddr.street}${mainStoreAddr.number ? ` ${mainStoreAddr.number}` : ''}, ${mainStoreAddr.town}`
    : 'Gamarra Kalea 4, Lekeitio';

  if (user) {
    const { data: profileRaw } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    profile = profileRaw;
    const parsedProfile = parseProfile(profileRaw);
    const isSeller = parsedProfile.role === 'vendedor' || parsedProfile.role === 'admin';
    const profileComplete = isProfileComplete(profileRaw);
    const lastReadMap = parsedProfile.last_read_chats || {};

    const lastReadOrdersMap = parsedProfile.last_read_orders || {};

    if (isSeller) {
      if (profileComplete) {
        // 1. Para vendedores activos: todos los pedidos y consultas de la tienda
        const [ordersRes, allSellersRes, allMsgsRes] = await Promise.all([
          supabase
            .from('orders')
            .select('id, status, seller_id, buyer_id, created_at, updated_at, shipping_notes')
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
        
        // Contar pedidos que tienen alertas no vistas por este vendedor específico
        const unreadOrders = activeOrders.filter((o) => {
          const history = getOrderStatusHistory((o as any).shipping_notes);
          const latestHistory = history.length > 0 ? history[history.length - 1] : null;
          const isUpdatedByOther = latestHistory?.changed_by_id
            ? latestHistory.changed_by_id !== user.id
            : true;

          const lastSeen = lastReadOrdersMap[o.id] ? new Date(lastReadOrdersMap[o.id]).getTime() : 0;
          const orderTime = new Date(o.updated_at || o.created_at || 0).getTime();
          if (lastSeen) {
            return isUpdatedByOther && orderTime > lastSeen;
          }
          return isUpdatedByOther;
        });

        ordersCount = unreadOrders.length;

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
      }
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
      const unreadBuyerOrders = activeOrders.filter((o) => {
        const lastSeen = lastReadOrdersMap[o.id] ? new Date(lastReadOrdersMap[o.id]).getTime() : 0;
        const orderTime = new Date(o.updated_at || o.created_at || 0).getTime();
        if (lastSeen) {
          return orderTime > lastSeen;
        }
        return o.status !== 'pendiente';
      });

      ordersCount = unreadBuyerOrders.length;

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
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/25 dark:bg-[#141312]/30 backdrop-blur-md border-b border-[#E8E5DF]/30 dark:border-stone-800/30 shadow-xs transition-colors">
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
      <div className="border-t border-[#E8E5DF]/25 dark:border-stone-800/30 px-4 sm:px-6 lg:px-8 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs font-serif">
          <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[10px] sm:text-[11px] font-sans font-medium text-stone-700 dark:text-stone-300 tracking-wider shadow-2xs">
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
