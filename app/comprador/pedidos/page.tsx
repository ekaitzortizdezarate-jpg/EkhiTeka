import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BuyerOrdersView } from '@/components/BuyerOrdersView';
import type { Order } from '@/types/database';

export default async function BuyerOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: orders } = await supabase
    .from('orders')
    .select('*, profiles!orders_seller_id_fkey(id, full_name, phone, town), order_items(*, products(*))')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false });

  return <BuyerOrdersView orders={(orders || []) as unknown as Order[]} />;
}
