'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'No autenticado' };

  const id = (formData.get('id') as string).toLowerCase().trim().replace(/\s+/g, '_');
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

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'No autenticado' };

  const fullName = formData.get('full_name') as string;
  const phone = formData.get('phone') as string;
  const town = formData.get('town') as string;
  const address = formData.get('address') as string;
  const bio = formData.get('bio') as string;

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone,
      town,
      address,
      bio,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/perfil');
  revalidatePath('/');
  return { success: true };
}
