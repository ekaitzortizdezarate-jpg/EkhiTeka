import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SellerEventsView } from '@/components/SellerEventsView';

export default async function SellerEventsPage() {
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

  const { data: rawEvents } = await supabase
    .from('products')
    .select(`
      *,
      order_items (
        id,
        quantity,
        unit_price,
        subtotal,
        created_at,
        orders (
          id,
          status,
          created_at,
          buyer_id,
          profiles!orders_buyer_id_fkey (
            id,
            full_name,
            phone,
            email,
            town
          )
        )
      )
    `)
    .eq('seller_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  const events = (rawEvents || []).filter((p) => {
    const cat = (p.category_id || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    return (
      cat === 'catas' ||
      cat === 'experiencia' ||
      name.includes('cata') ||
      name.includes('taller') ||
      name.includes('evento') ||
      desc.includes('aforo') ||
      desc.includes('fecha & hora')
    );
  });

  return <SellerEventsView events={events as any[]} />;
}