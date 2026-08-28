import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SellerProductForm } from '@/components/SellerProductForm';
import { type Category, type Product, isProfileComplete, parseProfile } from '@/types/database';

interface NewProductPageProps {
  searchParams: Promise<{ duplicate_from?: string }>;
}

export default async function NewProductPage({ searchParams }: NewProductPageProps) {
  const { duplicate_from } = (await searchParams) || {};
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

  const parsed = parseProfile(profile);

  const [categoriesRes, singleProductsRes, duplicateProductRes] = await Promise.all([
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
    duplicate_from
      ? supabase.from('products').select('*').eq('id', duplicate_from).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return (
    <SellerProductForm
      categories={(categoriesRes.data || []) as Category[]}
      initialProduct={(duplicateProductRes.data as Product) || null}
      isDuplicateMode={Boolean(duplicateProductRes.data)}
      availableSingleProducts={(singleProductsRes.data || []) as Product[]}
      pickupAddresses={parsed.pickup_addresses || []}
      eventAddresses={parsed.event_addresses || []}
    />
  );
}
