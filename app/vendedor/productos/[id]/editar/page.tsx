import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { SellerProductForm } from '@/components/SellerProductForm';
import type { Category, Product } from '@/types/database';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [categoriesRes, productRes] = await Promise.all([
    supabase.from('categories').select('*').eq('is_active', true).order('display_order', { ascending: true }),
    supabase.from('products').select('*').eq('id', id).eq('seller_id', user.id).single(),
  ]);

  if (productRes.error || !productRes.data) {
    notFound();
  }

  return (
    <SellerProductForm
      categories={(categoriesRes.data || []) as Category[]}
      initialProduct={productRes.data as Product}
    />
  );
}
