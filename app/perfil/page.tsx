import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/ProfileForm';
import type { Profile } from '@/types/database';

export const revalidate = 0;

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [{ data: profile }, { data: sellersData }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('profiles').select('id, full_name, phone').in('role', ['vendedor', 'admin']),
  ]);

  const userProfile = (profile || {}) as Profile;
  if (user.email && !userProfile.email) {
    userProfile.email = user.email;
  }

  const sellers = (sellersData || []).map((s) => ({
    id: s.id,
    full_name: s.full_name || 'Vendedor EkhiTeka',
    phone: s.phone || '',
  }));

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <ProfileForm userProfile={userProfile} profile={userProfile} sellers={sellers} />
    </div>
  );
}
