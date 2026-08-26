import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/ProfileForm';
import type { Profile } from '@/types/database';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
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

  const userProfile = profile as Profile;

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
            Mi Perfil
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Gestiona tus datos de contacto y preferencias.
          </p>
        </div>
      </div>

      <ProfileForm userProfile={userProfile} profile={userProfile} />
    </div>
  );
}
