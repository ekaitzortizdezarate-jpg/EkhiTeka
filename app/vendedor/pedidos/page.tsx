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

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'vendedor' && profile?.role !== 'admin') {
    redirect('/');
  }

  // Todos los vendedores ven todos los pedidos de la tienda
  const { data: orders } = await supabase
    .from('orders')
    .select('*, profiles!orders_buyer_id_fkey(id, full_name, phone, town, email), order_items(*, products(*))')
    .order('created_at', { ascending: false });

  return <SellerOrdersView orders={(orders || []) as unknown as Order[]} />;
}
