import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BuyerOrdersView } from '@/components/BuyerOrdersView';
import { parseProfile, type Order } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function BuyerOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [profileRes, ordersRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase
      .from('orders')
      .select('*, profiles!orders_seller_id_fkey(id, full_name, phone, town), order_items(*, products(*))')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false }),
  ]);

  const profile = parseProfile(profileRes?.data);
  const initialLastReadOrders = profile.last_read_orders || {};

  return (
    <BuyerOrdersView
      orders={(ordersRes.data || []) as unknown as Order[]}
      currentUserId={user.id}
      initialLastReadOrders={initialLastReadOrders}
    />
  );
}
