import { createClient } from '@/lib/supabase/server';
import { CatalogView } from '@/components/CatalogView';
import type { Category, ProductWithSeller } from '@/types/database';

export const revalidate = 0;

export default async function TiendaPage() {
  const supabase = await createClient();

  const [{ data: { user } }, categoriesRes, productsRes] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true }),
    supabase
      .from('products')
      .select('*, profiles!products_seller_id_fkey(id, full_name, town, avatar_url, phone)')
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
  ]);

  let isSeller = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role === 'vendedor' || profile?.role === 'admin') {
      isSeller = true;
    }
  }

  const categories = (categoriesRes.data || []) as Category[];
  const products = (productsRes.data || []) as unknown as ProductWithSeller[];

  return (
    <CatalogView
      categories={categories}
      products={products}
      initialCategory="all"
      isSeller={isSeller}
    />
  );
}
