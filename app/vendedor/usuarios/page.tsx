import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SellerBuyersListView } from '@/components/SellerBuyersListView';
import type { Profile, Order } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function SellerUsersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [profileRes, allProfilesRes, allOrdersRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .order('created_at', { ascending: false }),
  ]);

  const profile = profileRes.data;

  if (profile?.role !== 'vendedor' && profile?.role !== 'admin') {
    redirect('/');
  }

  const allProfiles = (allProfilesRes.data || []) as Profile[];
  const allOrders = (allOrdersRes.data || []) as Order[];

  const buyers = allProfiles
    .filter((p) => p.role !== 'vendedor' && p.role !== 'admin')
    .map((b) => ({
      ...b,
      orders: allOrders.filter((o) => o.buyer_id === b.id),
    }));

  return (
    <main className="min-h-screen bg-[#FAF8F5] dark:bg-[#141312] py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 font-serif tracking-tight">
              Usuarios y Compradores
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-sans mt-1">
              Listado detallado de todos los compradores registrados en la tienda y su historial de pedidos.
            </p>
          </div>
        </div>

        <SellerBuyersListView buyers={buyers} />
      </div>
    </main>
  );
}
