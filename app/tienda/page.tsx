import { createClient } from '@/lib/supabase/server';
import { CatalogView } from '@/components/CatalogView';
import type { Category, ProductWithSeller } from '@/types/database';

// Revalidación cada 60s con actualización inmediata bajo demanda tras añadir/editar productos
export const revalidate = 60;

export default async function TiendaPage() {
  const supabase = await createClient();

  const [categoriesRes, productsRes, authUserRes] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name_es, name_eu, name_fr, name_en, slug, image_url, icon, display_order, is_active')
      .eq('is_active', true)
      .not('id', 'in', '("cata_presencial","cata_casa","tarjeta_regalo","experiencia")')
      .order('display_order', { ascending: true }),
    supabase
      .from('products')
      .select('id, name, description, price, format, weight_g, stock, is_unlimited_stock, is_active, category_id, origin_region, delivery_methods, image_url, created_at, seller_id, profiles!products_seller_id_fkey(id, full_name, town, avatar_url, phone)')
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ]);

  const user = authUserRes.data?.user;
  let isSeller = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
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