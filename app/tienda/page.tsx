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
      .not('id', 'in', '("cata_presencial","cata_casa","tarjeta_regalo","experiencia")')
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

  const rawCategories = (categoriesRes.data || []) as Category[];
  const rawProducts = (productsRes.data || []) as unknown as ProductWithSeller[];

  // La tienda muestra únicamente productos sueltos y cestas (excluyendo catas presenciales, catas en casa y tarjetas de regalo)
  const storeProducts = rawProducts.filter((p) => {
    const cat = (p.category_id || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const isExcluded =
      cat === 'cata_presencial' ||
      cat === 'cata_casa' ||
      cat === 'tarjeta_regalo' ||
      cat === 'experiencia' ||
      name.includes('cata presencial') ||
      name.includes('tarjeta regalo');
    return !isExcluded;
  });

  return (
    <CatalogView
      categories={rawCategories}
      products={storeProducts}
      initialCategory="all"
      isSeller={isSeller}
    />
  );
}