import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProductDetailView } from '@/components/ProductDetailView';
import type { ProductWithSeller } from '@/types/database';

export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const supabase = await createClient();

  // 1. Verificación segura de usuario
  let user = null;
  try {
    const { data: authData } = await supabase.auth.getUser();
    user = authData?.user || null;
  } catch {
    user = null;
  }

  // 2. Carga segura del producto con fallback
  let product: ProductWithSeller | null = null;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, profiles(id, full_name, town, avatar_url, phone, role)')
      .eq('id', decodedId)
      .maybeSingle();

    if (!data || error) {
      const { data: fallbackData } = await supabase
        .from('products')
        .select('*')
        .eq('id', decodedId)
        .maybeSingle();
      product = fallbackData as ProductWithSeller;
    } else {
      product = data as unknown as ProductWithSeller;
    }
  } catch (e) {
    console.error('Error cargando producto:', e);
  }

  if (!product) {
    notFound();
  }

  // 3. Verificación de permisos de vendedor
  let isSeller = false;
  if (user) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      if (profile?.role === 'vendedor' || profile?.role === 'admin') {
        isSeller = true;
      }
    } catch {}
  }

  // 4. Carga segura de productos relacionados
  let relatedProducts: ProductWithSeller[] = [];
  if (product.category_id) {
    try {
      const { data: relatedData } = await supabase
        .from('products')
        .select('*, profiles(id, full_name, town, avatar_url, phone)')
        .eq('category_id', product.category_id)
        .neq('id', product.id)
        .eq('is_active', true)
        .limit(4);
      relatedProducts = (relatedData || []) as unknown as ProductWithSeller[];
    } catch {}
  }

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
      isSeller={isSeller}
    />
  );
}
