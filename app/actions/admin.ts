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

  const firstName = (formData.get('first_name') as string)?.trim() || '';
  const lastName1 = (formData.get('last_name_1') as string)?.trim() || '';
  const lastName2 = (formData.get('last_name_2') as string)?.trim() || null;
  const birthDate = (formData.get('birth_date') as string)?.trim() || '';
  const dni = (formData.get('dni') as string)?.trim()?.toUpperCase() || '';
  const phone = (formData.get('phone') as string)?.trim() || '';
  const province = (formData.get('province') as string)?.trim() || '';
  const town = (formData.get('town') as string)?.trim() || '';
  const postalCode = (formData.get('postal_code') as string)?.trim() || '';
  const street = (formData.get('street') as string)?.trim() || '';
  const number = (formData.get('number') as string)?.trim() || '';
  const stair = (formData.get('stair') as string)?.trim() || null;
  const floor = (formData.get('floor') as string)?.trim() || '';
  const door = (formData.get('door') as string)?.trim() || '';

  if (
    !firstName ||
    !lastName1 ||
    !birthDate ||
    !dni ||
    !phone ||
    !province ||
    !town ||
    !postalCode ||
    !street ||
    !number ||
    !floor ||
    !door
  ) {
    return { error: 'Por favor, completa todos los campos obligatorios marcados con *.' };
  }

  const fullName = [firstName, lastName1, lastName2].filter(Boolean).join(' ');
  const formattedAddress = [
    street,
    number ? `Nº ${number}` : '',
    stair ? `Esc ${stair}` : '',
    floor ? `Piso ${floor}` : '',
    door ? `Pta ${door}` : '',
    postalCode,
    town,
    province,
  ]
    .filter(Boolean)
    .join(', ');

  const structuredBio = JSON.stringify({
    first_name: firstName,
    last_name_1: lastName1,
    last_name_2: lastName2,
    birth_date: birthDate,
    dni,
    phone,
    province,
    town,
    postal_code: postalCode,
    street,
    number,
    stair,
    floor,
    door,
  });

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone,
      town,
      address: formattedAddress,
      bio: structuredBio,
      first_name: firstName,
      last_name_1: lastName1,
      last_name_2: lastName2,
      birth_date: birthDate || null,
      dni,
      province,
      postal_code: postalCode,
      street,
      number,
      stair,
      floor,
      door,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/perfil');
  revalidatePath('/');
  revalidatePath('/cesta');
  revalidatePath('/vendedor/productos/nuevo');
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

  // 1. Verificar contraseña actual intentando iniciar sesión
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    return { error: 'La contraseña actual no es correcta. Verifica e inténtalo de nuevo.' };
  }

  // 2. Actualizar contraseña
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { error: `Error al actualizar la contraseña: ${updateError.message}` };
  }

  return { success: true, message: '¡Contraseña cambiada con éxito!' };
}
