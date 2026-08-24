import { createClient } from '@/lib/supabase/server';
import { CatalogView } from '@/components/CatalogView';
import type { Category, ProductWithSeller } from '@/types/database';

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [categoriesRes, productsRes] = await Promise.all([
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

  const categories = (categoriesRes.data || []) as Category[];
  const products = (productsRes.data || []) as unknown as ProductWithSeller[];

  return (
    <CatalogView
      categories={categories}
      products={products}
      initialCategory={id}
    />
  );
}
