import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SellerOrdersView } from '@/components/SellerOrdersView';
import { parseProfile, type Order } from '@/types/database';

export const revalidate = 0;

export default async function SellerOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: rawProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const userProfile = parseProfile(rawProfile);

  if (userProfile.role !== 'vendedor' && userProfile.role !== 'admin') {
    redirect('/');
  }

  // Todos los vendedores ven todos los pedidos de la tienda
  const { data: orders } = await supabase
    .from('orders')
    .select('*, profiles!orders_buyer_id_fkey(id, full_name, phone, town, email), order_items(*, products(*))')
    .order('created_at', { ascending: false });

  return (
    <SellerOrdersView
      orders={(orders || []) as unknown as Order[]}
      currentUserId={user.id}
      initialLastReadOrders={userProfile.last_read_orders || {}}
    />
  );
}
