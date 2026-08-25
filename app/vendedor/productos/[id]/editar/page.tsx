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

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'vendedor' && profile?.role !== 'admin') {
    redirect('/');
  }

  const [categoriesRes, productRes, singleProductsRes] = await Promise.all([
    supabase.from('categories').select('*').eq('is_active', true).order('display_order', { ascending: true }),
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('products').select('*').eq('is_active', true).neq('format', 'pack').order('name', { ascending: true }),
  ]);

  if (productRes.error || !productRes.data) {
    notFound();
  }

  return (
    <SellerProductForm
      categories={(categoriesRes.data || []) as Category[]}
      initialProduct={productRes.data as Product}
      availableSingleProducts={(singleProductsRes.data || []) as Product[]}
    />
  );
}