import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SellerProductForm } from '@/components/SellerProductForm';
import { type Category, type Product, isProfileComplete } from '@/types/database';

export default async function NewProductPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'vendedor' && profile?.role !== 'admin') {
    redirect('/');
  }

  if (!isProfileComplete(profile)) {
    redirect('/perfil');
  }

  const [categoriesRes, singleProductsRes] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true }),
    supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .neq('format', 'pack')
      .order('name', { ascending: true }),
  ]);

  return (
    <SellerProductForm
      categories={(categoriesRes.data || []) as Category[]}
      availableSingleProducts={(singleProductsRes.data || []) as Product[]}
    />
  );
}