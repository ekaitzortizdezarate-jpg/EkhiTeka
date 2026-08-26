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

  // Obtener todas las catas y eventos compartidos de la tienda
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
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  // Filtrar estrictamente solo las CATAS PRESENCIALES en tienda
  const events = (rawEvents || []).filter((p) => {
    const cat = (p.category_id || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();

    const isHomeOrGift =
      name.includes('casa') ||
      cat.includes('casa') ||
      cat === 'cesta' ||
      cat === 'tarjeta_regalo' ||
      name.includes('tarjeta') ||
      name.includes('cesta');

    if (isHomeOrGift) return false;

    return (
      cat === 'cata_presencial' ||
      name.includes('presencial') ||
      desc.includes('presencial') ||
      (desc.includes('fecha & hora') && desc.includes('aforo'))
    );
  });

  return <SellerEventsView events={events as any[]} />;
}
