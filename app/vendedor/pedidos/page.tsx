import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SellerOrdersView } from '@/components/SellerOrdersView';
import type { Order } from '@/types/database';

export default async function SellerOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: orders } = await supabase
    .from('orders')
    .select('*, profiles!orders_buyer_id_fkey(id, full_name, phone, town, email), order_items(*, products(*))')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false });

  return <SellerOrdersView orders={(orders || []) as unknown as Order[]} />;
}
