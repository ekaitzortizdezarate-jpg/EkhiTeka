'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { ProfileDetails, WhatsAppContact, StoreAddress, EventAddress } from '@/types/database';
import { parseProfile } from '@/types/database';

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

  const { data: currentProfileRaw } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const currentParsed = parseProfile(currentProfileRaw);

  const firstName = (formData.get('first_name') as string)?.trim() || '';
  const lastName1 = (formData.get('last_name_1') as string)?.trim() || '';
  const lastName2 = (formData.get('last_name_2') as string)?.trim() || '';
  const birthDate = (formData.get('birth_date') as string)?.trim() || '';
  const dni = (formData.get('dni') as string)?.trim()?.toUpperCase() || '';
  const phone = (formData.get('phone') as string)?.trim() || '';
  const province = (formData.get('province') as string)?.trim() || '';
  const town = (formData.get('town') as string)?.trim() || '';
  const postalCode = (formData.get('postal_code') as string)?.trim() || '';
  const street = (formData.get('street') as string)?.trim() || '';
  const number = (formData.get('number') as string)?.trim() || '';
  const stair = (formData.get('stair') as string)?.trim() || '';
  const floor = (formData.get('floor') as string)?.trim() || '';
  const door = (formData.get('door') as string)?.trim() || '';

  const fullNameInput = (formData.get('full_name') as string)?.trim() || '';
  const fullName = [firstName, lastName1, lastName2].filter(Boolean).join(' ') || fullNameInput || currentParsed.full_name || 'Usuario EkhiTeka';

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

  const profileData: ProfileDetails = {
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
    whatsapp_phone: currentParsed.whatsapp_phone,
    whatsapp_contacts: currentParsed.whatsapp_contacts,
    pickup_addresses: currentParsed.pickup_addresses,
    event_addresses: currentParsed.event_addresses,
  };

  const structuredBio = JSON.stringify(profileData);

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone,
      town,
      address: formattedAddress,
      bio: structuredBio,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/perfil');
  revalidatePath('/', 'layout');
  return {
    success: true,
    updatedProfile: {
      ...profileData,
      id: user.id,
      role: currentParsed.role,
      full_name: fullName,
      email: user.email,
      address: formattedAddress,
      bio: structuredBio,
    },
  };
}

export async function updateStoreConfig(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'No autenticado' };

  const { data: currentProf } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (currentProf?.role !== 'vendedor' && currentProf?.role !== 'admin') {
    return { error: 'Permisos insuficientes para editar los datos de la tienda.' };
  }

  const rawContacts = formData.get('whatsapp_contacts') as string;
  const rawPickup = formData.get('pickup_addresses') as string;
  const rawEvents = formData.get('event_addresses') as string;

  const whatsappContacts: WhatsAppContact[] = rawContacts ? JSON.parse(rawContacts) : [];
  const pickupAddresses: StoreAddress[] = rawPickup ? JSON.parse(rawPickup) : [];
  const eventAddresses: EventAddress[] = rawEvents ? JSON.parse(rawEvents) : [];

  const activeWA = whatsappContacts.find((c) => c.is_active);
  const whatsappPhone = activeWA ? activeWA.phone.replace(/[^0-9]/g, '') : null;

  // Obtener todos los perfiles de vendedores/admins para sincronizar los datos de tienda
  const { data: allSellers } = await supabase
    .from('profiles')
    .select('id, bio')
    .in('role', ['vendedor', 'admin']);

  if (allSellers) {
    for (const seller of allSellers) {
      const sellerParsed = parseProfile(seller);
      const updatedDetails: ProfileDetails = {
        first_name: sellerParsed.first_name,
        last_name_1: sellerParsed.last_name_1,
        last_name_2: sellerParsed.last_name_2,
        birth_date: sellerParsed.birth_date,
        dni: sellerParsed.dni,
        phone: sellerParsed.phone,
        province: sellerParsed.province,
        town: sellerParsed.town,
        postal_code: sellerParsed.postal_code,
        street: sellerParsed.street,
        number: sellerParsed.number,
        stair: sellerParsed.stair,
        floor: sellerParsed.floor,
        door: sellerParsed.door,
        whatsapp_phone: whatsappPhone,
        whatsapp_contacts: whatsappContacts,
        pickup_addresses: pickupAddresses,
        event_addresses: eventAddresses,
      };

      await supabase
        .from('profiles')
        .update({
          bio: JSON.stringify(updatedDetails),
          updated_at: new Date().toISOString(),
        })
        .eq('id', seller.id);
    }
  }

  revalidatePath('/', 'layout');
  revalidatePath('/perfil');
  revalidatePath('/tienda');
  revalidatePath('/experiencias');
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

  return { success: true };
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
