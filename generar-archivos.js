const fs = require('fs');
const path = require('path');

const files = {
  // =========================================================================
  // 1. ACCIONES DE AUTENTICACIÓN (100% compatibles con Turbopack)
  // =========================================================================
  'app/actions/auth.ts': `'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function register(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = (formData.get('full_name') as string) || '';
  const role = (formData.get('role') as string) || 'comprador';
  const phone = (formData.get('phone') as string) || '';
  const town = (formData.get('town') as string) || '';

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
        phone,
        town,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      full_name: fullName,
      email,
      role: role as any,
      phone,
      town,
    });
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(formData: FormData) {
  return register(formData);
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'No autenticado' };

  const fullName = (formData.get('full_name') as string)?.trim() || '';
  const phone = (formData.get('phone') as string)?.trim() || '';
  const town = (formData.get('town') as string)?.trim() || '';

  if (!fullName) {
    return { error: 'Por favor, introduce tu nombre completo.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone,
      town,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/perfil');
  revalidatePath('/');
  return { success: true };
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
`,

  // =========================================================================
  // 2. PÁGINA DE REGISTRO
  // =========================================================================
  'app/register/page.tsx': `'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { signup } from '@/app/actions/auth';
import { UserPlus, Mail, Lock, User, Phone, MapPin, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await signup(formData);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 sm:p-10 space-y-8 shadow-xl font-serif">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#FFE259] text-[#1D1D1B] flex items-center justify-center mx-auto shadow-xs">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {t.nav_register}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Crea tu cuenta para disfrutar de nuestros quesos y experiencias.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 rounded-2xl text-xs font-bold text-red-800 dark:text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
              {t.auth_full_name} *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="full_name"
                required
                placeholder="Nombre y Apellidos"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
              {t.auth_email} *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                placeholder="tu@email.com"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
              {t.auth_password} *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                required
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                {t.auth_phone}
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="600 000 000"
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                {t.auth_town}
              </label>
              <input
                type="text"
                name="town"
                placeholder="Lekeitio / Bilbao"
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : t.nav_register}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100 dark:border-stone-800">
          <Link
            href="/login"
            className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          >
            {t.auth_have_account}
          </Link>
        </div>
      </div>
    </div>
  );
}
`,

  // =========================================================================
  // 3. COMPONENTE DE FORMULARIO DE PERFIL
  // =========================================================================
  'components/ProfileForm.tsx': `'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { updateProfile } from '@/app/actions/auth';
import type { Profile } from '@/types/database';
import { User, Phone, MapPin, Check } from 'lucide-react';

interface ProfileFormProps {
  profile?: Profile;
  userProfile?: Profile;
}

export function ProfileForm({ profile, userProfile }: ProfileFormProps) {
  const currentProfile = profile || userProfile || ({} as Profile);
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateProfile(formData);
    setLoading(false);

    if (res?.error) {
      setMsg({ text: res.error, isError: true });
    } else {
      setMsg({ text: t.common_success, isError: false });
      setTimeout(() => setMsg(null), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-serif">
      {msg && (
        <div
          className={\`p-4 rounded-2xl text-xs font-bold text-center \${
            msg.isError
              ? 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
              : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
          }\`}
        >
          {msg.text}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
            {t.auth_full_name} *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="full_name"
              required
              defaultValue={currentProfile.full_name || ''}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
              {t.auth_phone}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                defaultValue={currentProfile.phone || ''}
                placeholder="600 000 000"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
              {t.auth_town}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="town"
                defaultValue={currentProfile.town || ''}
                placeholder="Lekeitio / Bizkaia"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          <span>{loading ? 'Guardando...' : t.common_save}</span>
        </button>
      </div>
    </form>
  );
}
`,

  // =========================================================================
  // 4. PÁGINA DE PERFIL
  // =========================================================================
  'app/perfil/page.tsx': `import { createClient } from '@/lib/supabase/server';
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
`,

  // =========================================================================
  // 5. ACCIONES DE ADMINISTRACIÓN
  // =========================================================================
  'app/actions/admin.ts': `'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'No autenticado' };

  const id = (formData.get('id') as string).toLowerCase().trim().replace(/\\s+/g, '_');
  const nameEs = formData.get('name_es') as string;
  const nameEu = formData.get('name_eu') as string;
  const nameEn = formData.get('name_en') as string;
  const nameFr = formData.get('name_fr') as string;
  const icon = (formData.get('icon') as string) || '✨';
  const displayOrder = parseInt((formData.get('display_order') as string) || '0');

  const { error } = await supabase
    .from('categories')
    .insert({
      id,
      name_es: nameEs,
      name_eu: nameEu,
      name_en: nameEn,
      name_fr: nameFr,
      icon,
      display_order: displayOrder,
      is_active: true,
    });

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function changeUserPassword(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { error: 'No autenticado. Por favor inicia sesión.' };
  }

  const currentPassword = (formData.get('current_password') as string) || '';
  const newPassword = (formData.get('new_password') as string) || '';
  const confirmPassword = (formData.get('confirm_password') as string) || '';

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'Por favor, completa todos los campos de contraseña.' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'La nueva contraseña y su confirmación no coinciden.' };
  }

  if (newPassword.length < 6) {
    return { error: 'La nueva contraseña debe tener al menos 6 caracteres.' };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    return { error: 'La contraseña actual no es correcta. Verifica e inténtalo de nuevo.' };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { error: \`Error al actualizar la contraseña: \${updateError.message}\` };
  }

  return { success: true, message: '¡Contraseña cambiada con éxito!' };
}
`,
};

// Escritura en disco
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trimStart(), 'utf8');
  console.log(`✓ Actualizado correctamente: ${filePath}`);
});

console.log('\n🎉 ¡Archivos regenerados con éxito!');