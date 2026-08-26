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
    return { error: `Error al actualizar la contraseña: ${updateError.message}` };
  }

  return { success: true, message: '¡Contraseña cambiada con éxito!' };
}
