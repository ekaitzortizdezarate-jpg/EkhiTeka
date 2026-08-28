import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SellerProductsListView } from '@/components/SellerProductsListView';
import { getUnifiedStoreConfig } from '@/app/actions/auth';
import { isProfileComplete } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function SellerProductsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [profileRes, productsRes, categoriesRes, storeConfig] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true }),
    getUnifiedStoreConfig(supabase),
  ]);

  const profile = profileRes.data;

  if (profile?.role !== 'vendedor' && profile?.role !== 'admin') {
    redirect('/');
  }

  const profileComplete = isProfileComplete(profile);
  const pickupAddresses = storeConfig.pickup_addresses || [];
  const eventAddresses = storeConfig.event_addresses || [];

  return (
    <main className="min-h-screen bg-[#FAF8F5] dark:bg-[#141312] py-4 sm:py-8">
      <SellerProductsListView
        products={productsRes.data || []}
        categories={categoriesRes.data || []}
        pickupAddresses={pickupAddresses}
        eventAddresses={eventAddresses}
        isProfileComplete={profileComplete}
      />
    </main>
  );
}
