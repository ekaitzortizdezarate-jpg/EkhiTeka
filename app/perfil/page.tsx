import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/ProfileForm';
import type { Profile } from '@/types/database';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 font-serif">
            Mi Perfil · Nire Profila
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Gestiona tus datos personales y los datos compartidos de la tienda.
          </p>
        </div>
      </div>

      <ProfileForm userProfile={userProfile} profile={userProfile} sellers={sellers} />
    </div>
  );
}
