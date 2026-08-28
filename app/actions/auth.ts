'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { ProfileDetails, WhatsAppContact, StoreAddress, EventAddress, DeliveryAddress } from '@/types/database';
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
    let initialBio: string | null = null;
    if (role === 'vendedor' || role === 'admin') {
      const storeConfig = await getUnifiedStoreConfig(supabase);
      initialBio = JSON.stringify({
        whatsapp_contacts: storeConfig.whatsapp_contacts,
        whatsapp_phone: storeConfig.whatsapp_phone,
        pickup_addresses: storeConfig.pickup_addresses,
        event_addresses: storeConfig.event_addresses,
      });
    }

    await supabase.from('profiles').upsert({
      id: data.user.id,
      full_name: fullName,
      email,
      role: role as any,
      phone,
      town,
      bio: initialBio,
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

  let existingDetails: Partial<ProfileDetails> = {};
  if (currentProfileRaw?.bio) {
    try {
      const parsed = JSON.parse(currentProfileRaw.bio);
      if (typeof parsed === 'object' && parsed !== null) {
        existingDetails = parsed;
      }
    } catch {}
  }

  const globalStoreConfig = await getUnifiedStoreConfig(supabase);

  const profileData: ProfileDetails = {
    ...existingDetails,
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
    whatsapp_phone: globalStoreConfig.whatsapp_phone,
    whatsapp_contacts: globalStoreConfig.whatsapp_contacts,
    pickup_addresses: globalStoreConfig.pickup_addresses,
    event_addresses: globalStoreConfig.event_addresses,
    delivery_addresses: currentParsed.delivery_addresses || existingDetails.delivery_addresses || [],
    cart_data: currentParsed.cart_data || existingDetails.cart_data || [],
    site_images: currentParsed.site_images || (existingDetails as any).site_images || {},
    site_images_meta: currentParsed.site_images_meta || (existingDetails as any).site_images_meta || {},
    last_read_chats: currentParsed.last_read_chats || (existingDetails as any).last_read_chats || {},
    last_read_orders: currentParsed.last_read_orders || (existingDetails as any).last_read_orders || {},
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

const STORE_CONFIG_FILE = 'site_config/store_config.json';
const BUCKET_NAME = 'product-images';

export interface UnifiedStoreConfig {
  whatsapp_contacts: WhatsAppContact[];
  whatsapp_phone: string | null;
  pickup_addresses: StoreAddress[];
  event_addresses: EventAddress[];
}

export async function getUnifiedStoreConfig(supabaseClient?: any): Promise<UnifiedStoreConfig> {
  const supabase = supabaseClient || (await createClient());

  let hasStorage = false;
  let whatsapp_contacts: WhatsAppContact[] = [];
  let whatsapp_phone: string | null = null;
  let pickup_addresses: StoreAddress[] = [];
  let event_addresses: EventAddress[] = [];

  // 1. Intentar descargar store_config.json desde Supabase Storage (Fuente Maestra de la Verdad)
  try {
    const { data: fileData, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(STORE_CONFIG_FILE);

    if (!error && fileData) {
      const text = await fileData.text();
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') {
        hasStorage = true;
        whatsapp_contacts = Array.isArray(parsed.whatsapp_contacts) ? parsed.whatsapp_contacts : [];
        whatsapp_phone = parsed.whatsapp_phone || null;
        pickup_addresses = Array.isArray(parsed.pickup_addresses) ? parsed.pickup_addresses : [];
        event_addresses = Array.isArray(parsed.event_addresses) ? parsed.event_addresses : [];
      }
    }
  } catch {}

  // 2. SOLO si no existía store_config.json en Supabase Storage, escanear el vendedor más reciente como fallback
  if (!hasStorage) {
    try {
      const { data: sellers } = await supabase
        .from('profiles')
        .select('bio')
        .in('role', ['vendedor', 'admin'])
        .order('updated_at', { ascending: false });

      if (sellers && sellers.length > 0) {
        for (const s of sellers) {
          if (!s.bio) continue;
          try {
            const parsed = JSON.parse(s.bio);
            if (whatsapp_contacts.length === 0 && Array.isArray(parsed?.whatsapp_contacts) && parsed.whatsapp_contacts.length > 0) {
              whatsapp_contacts = parsed.whatsapp_contacts;
            }
            if (!whatsapp_phone && parsed?.whatsapp_phone) {
              whatsapp_phone = parsed.whatsapp_phone;
            }
            if (pickup_addresses.length === 0 && Array.isArray(parsed?.pickup_addresses) && parsed.pickup_addresses.length > 0) {
              pickup_addresses = parsed.pickup_addresses;
            }
            if (event_addresses.length === 0 && Array.isArray(parsed?.event_addresses) && parsed.event_addresses.length > 0) {
              event_addresses = parsed.event_addresses;
            }
          } catch {}
        }
      }
    } catch {}

    // 3. Si aún no hay datos en la BD, suministrar valores por defecto
    if (pickup_addresses.length === 0) {
      pickup_addresses = [
        {
          id: 'store_lekeitio_default',
          title: 'EkhiTeka Lekeitio',
          street: 'Gamarra Kalea',
          number: '4',
          town: 'Lekeitio',
          province: 'Bizkaia',
          postal_code: '48280',
          schedule_details: {
            days: ['lun', 'mar', 'mie', 'jue', 'vie', 'sab'],
            weekday_morning_enabled: true,
            weekday_morning_start: '10:00',
            weekday_morning_end: '14:00',
            weekday_afternoon_enabled: true,
            weekday_afternoon_start: '17:00',
            weekday_afternoon_end: '20:30',
            weekend_morning_enabled: true,
            weekend_morning_start: '10:30',
            weekend_morning_end: '14:30',
            weekend_afternoon_enabled: false,
            weekend_afternoon_start: '17:30',
            weekend_afternoon_end: '21:00',
          },
          schedule: 'Lun-Sáb: 10:00-14:00, 17:00-20:30 · Sáb-Dom: 10:30-14:30',
          is_main: true,
          is_active: true,
        },
      ];
    }

    if (whatsapp_contacts.length === 0) {
      whatsapp_contacts = [
        {
          id: 'wa_default',
          name: 'Atención EkhiTeka',
          phone: '+34 600 000 000',
          seller_id: null,
          is_active: true,
        },
      ];
    }

    // Guardar por primera vez en Storage
    const seedConfig: UnifiedStoreConfig = {
      whatsapp_contacts,
      whatsapp_phone,
      pickup_addresses,
      event_addresses,
    };
    try {
      const configBlob = new Blob([JSON.stringify(seedConfig, null, 2)], {
        type: 'application/json',
      });
      await supabase.storage
        .from(BUCKET_NAME)
        .upload(STORE_CONFIG_FILE, configBlob, {
          upsert: true,
          contentType: 'application/json',
        });
    } catch {}
  }

  return {
    whatsapp_contacts,
    whatsapp_phone,
    pickup_addresses,
    event_addresses,
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
    .maybeSingle();

  const userRole = currentProf?.role || user.user_metadata?.role || (user.app_metadata as any)?.role;
  if (userRole !== 'vendedor' && userRole !== 'admin') {
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

  const storeConfigData: UnifiedStoreConfig = {
    whatsapp_contacts: whatsappContacts,
    whatsapp_phone: whatsappPhone,
    pickup_addresses: pickupAddresses,
    event_addresses: eventAddresses,
  };

  // 1. Guardar de forma PERMANENTE en Supabase Storage
  try {
    const configBlob = new Blob([JSON.stringify(storeConfigData, null, 2)], {
      type: 'application/json',
    });
    await supabase.storage
      .from(BUCKET_NAME)
      .upload(STORE_CONFIG_FILE, configBlob, {
        upsert: true,
        contentType: 'application/json',
      });
  } catch (err) {
    console.error('Error guardando store_config en Supabase Storage:', err);
  }

  // 2. Sincronizar en el perfil del usuario actual (siempre permitido)
  let myExistingBio: Partial<ProfileDetails> = {};
  if (currentProf?.bio) {
    try {
      const parsed = JSON.parse(currentProf.bio);
      if (typeof parsed === 'object' && parsed !== null) {
        myExistingBio = parsed;
      }
    } catch {}
  }

  const myParsed = parseProfile(currentProf);
  const myUpdatedDetails: ProfileDetails = {
    ...myExistingBio,
    first_name: myParsed.first_name,
    last_name_1: myParsed.last_name_1,
    last_name_2: myParsed.last_name_2,
    birth_date: myParsed.birth_date,
    dni: myParsed.dni,
    phone: myParsed.phone,
    province: myParsed.province,
    town: myParsed.town,
    postal_code: myParsed.postal_code,
    street: myParsed.street,
    number: myParsed.number,
    stair: myParsed.stair,
    floor: myParsed.floor,
    door: myParsed.door,
    whatsapp_phone: whatsappPhone,
    whatsapp_contacts: whatsappContacts,
    pickup_addresses: pickupAddresses,
    event_addresses: eventAddresses,
    delivery_addresses: myParsed.delivery_addresses || myExistingBio.delivery_addresses || [],
    cart_data: myParsed.cart_data || myExistingBio.cart_data || [],
    site_images: myParsed.site_images || (myExistingBio as any).site_images || {},
    site_images_meta: myParsed.site_images_meta || (myExistingBio as any).site_images_meta || {},
    last_read_chats: myParsed.last_read_chats || (myExistingBio as any).last_read_chats || {},
    last_read_orders: myParsed.last_read_orders || (myExistingBio as any).last_read_orders || {},
  };

  await supabase
    .from('profiles')
    .update({
      bio: JSON.stringify(myUpdatedDetails),
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  // 3. Sincronizar en los demás vendedores si las políticas RLS lo permiten
  try {
    const { data: otherSellers } = await supabase
      .from('profiles')
      .select('id, bio')
      .in('role', ['vendedor', 'admin'])
      .neq('id', user.id);

    if (otherSellers && otherSellers.length > 0) {
      for (const seller of otherSellers) {
        let sellerBio: Partial<ProfileDetails> = {};
        if (seller.bio) {
          try {
            const parsed = JSON.parse(seller.bio);
            if (typeof parsed === 'object' && parsed !== null) {
              sellerBio = parsed;
            }
          } catch {}
        }

        const sellerParsed = parseProfile(seller);
        const updatedDetails: ProfileDetails = {
          ...sellerBio,
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
          delivery_addresses: sellerParsed.delivery_addresses || sellerBio.delivery_addresses || [],
          cart_data: sellerParsed.cart_data || sellerBio.cart_data || [],
          site_images: sellerParsed.site_images || (sellerBio as any).site_images || {},
          site_images_meta: sellerParsed.site_images_meta || (sellerBio as any).site_images_meta || {},
          last_read_chats: sellerParsed.last_read_chats || (sellerBio as any).last_read_chats || {},
          last_read_orders: sellerParsed.last_read_orders || (sellerBio as any).last_read_orders || {},
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
  } catch {}

  revalidatePath('/', 'layout');
  revalidatePath('/perfil');
  revalidatePath('/tienda');
  revalidatePath('/experiencias');
  revalidatePath('/vendedor/productos');
  revalidatePath('/vendedor/productos/nuevo');
  revalidatePath('/vendedor/eventos');
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

export async function updateDeliveryAddresses(deliveryAddresses: DeliveryAddress[]) {
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

  let existingDetails: Partial<ProfileDetails> = {};
  if (currentProfileRaw?.bio) {
    try {
      const parsed = JSON.parse(currentProfileRaw.bio);
      if (typeof parsed === 'object' && parsed !== null) {
        existingDetails = parsed;
      }
    } catch {}
  }

  const profileData: ProfileDetails = {
    ...existingDetails,
    first_name: currentParsed.first_name,
    last_name_1: currentParsed.last_name_1,
    last_name_2: currentParsed.last_name_2,
    birth_date: currentParsed.birth_date,
    dni: currentParsed.dni,
    phone: currentParsed.phone,
    province: currentParsed.province,
    town: currentParsed.town,
    postal_code: currentParsed.postal_code,
    street: currentParsed.street,
    number: currentParsed.number,
    stair: currentParsed.stair,
    floor: currentParsed.floor,
    door: currentParsed.door,
    whatsapp_phone: currentParsed.whatsapp_phone,
    whatsapp_contacts: currentParsed.whatsapp_contacts,
    pickup_addresses: currentParsed.pickup_addresses,
    event_addresses: currentParsed.event_addresses,
    delivery_addresses: deliveryAddresses,
    cart_data: currentParsed.cart_data || (existingDetails as any).cart_data || [],
    site_images: currentParsed.site_images || (existingDetails as any).site_images || {},
    site_images_meta: currentParsed.site_images_meta || (existingDetails as any).site_images_meta || {},
    last_read_chats: currentParsed.last_read_chats || (existingDetails as any).last_read_chats || {},
    last_read_orders: currentParsed.last_read_orders || (existingDetails as any).last_read_orders || {},
  };

  const structuredBio = JSON.stringify(profileData);

  const { error } = await supabase
    .from('profiles')
    .update({
      bio: structuredBio,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/perfil');
  revalidatePath('/cesta');
  return { success: true, delivery_addresses: deliveryAddresses };
}

export async function getUserDeliveryAddresses() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null, addresses: [] };

  const { data: currentProfileRaw } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const profile = parseProfile(currentProfileRaw);
  return {
    user,
    profile,
    addresses: profile.delivery_addresses || [],
  };
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
