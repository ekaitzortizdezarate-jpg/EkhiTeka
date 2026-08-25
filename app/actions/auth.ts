'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { isProfileComplete } from '@/types/database';

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

// Alias para compatibilidad con componentes que importan 'signup'
export const signup = register;

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