'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isProfileComplete } from '@/types/database';

async function checkSellerPermission(supabase: any, userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  return profile?.role === 'vendedor' || profile?.role === 'admin';
}

async function ensureCategoryExists(supabase: any, categoryId: string) {
  const specialCategories: Record<string, { es: string; eu: string; en: string; fr: string; icon: string }> = {
    cesta_gourmet: { es: 'Cesta Gourmet', eu: 'Gourmet Saskia', en: 'Gourmet Hamper', fr: 'Coffret Gourmet', icon: '🎁' },
    cata_casa: { es: 'Cata en Casa', eu: 'Etxeko Dastaketa', en: 'Home Tasting', fr: 'Dégustation à Domicile', icon: '🏠' },
    cata_presencial: { es: 'Cata Presencial', eu: 'Aurrez Aurreko Dastaketa', en: 'In-Person Tasting', fr: 'Dégustation Présentielle', icon: '🍷' },
    tarjeta_regalo: { es: 'Tarjeta Regalo', eu: 'Opari Txartela', en: 'Gift Card', fr: 'Carte Cadeau', icon: '💳' },
  };

  if (specialCategories[categoryId]) {
    const spec = specialCategories[categoryId];
    await supabase.from('categories').upsert(
      {
        id: categoryId,
        name_es: spec.es,
        name_eu: spec.eu,
        name_en: spec.en,
        name_fr: spec.fr,
        icon: spec.icon,
        display_order: 99,
        is_active: true,
      },
      { onConflict: 'id' }
    );
  }
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'No autenticado' };
  }

  const isAllowed = await checkSellerPermission(supabase, user.id);
  if (!isAllowed) {
    return { error: 'Permisos insuficientes. Solo los vendedores de EkhiTeka pueden añadir productos.' };
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!isProfileComplete(profile)) {
    return { error: 'Debes completar tu perfil con todos los campos obligatorios antes de publicar productos.' };
  }

  const name = (formData.get('name') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const categoryId = (formData.get('category_id') as string) || 'queso';
  const price = parseFloat(formData.get('price') as string);
  const format = (formData.get('format') as string) || 'unidad';
  const weightG = formData.get('weight_g') ? parseInt(formData.get('weight_g') as string) : null;
  const stock = formData.get('stock') ? parseInt(formData.get('stock') as string) : 10;
  const isUnlimitedStock = formData.get('is_unlimited_stock') === 'true';
  const originRegion = (formData.get('origin_region') as string)?.trim() || 'Lekeitio / Bizkaia';
  const deliveryMethods = formData.getAll('delivery_methods') as string[];
  const pickupAddressIds = formData.getAll('pickup_address_ids') as string[];
  const eventAddressId = (formData.get('event_address_id') as string) || null;

  if (!name || isNaN(price)) {
    return { error: 'Por favor, rellena los campos obligatorios (Nombre y Precio).' };
  }

  await ensureCategoryExists(supabase, categoryId);

  let imageUrl = (formData.get('image_url_fallback') as string) || null;
  const imageFile = formData.get('image_file') as File | null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageFile, { upsert: true });

    if (!uploadError && uploadData) {
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(uploadData.path);
      imageUrl = publicUrlData.publicUrl;
    }
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      seller_id: user.id,
      category_id: categoryId,
      name,
      description,
      price,
      format: format as any,
      weight_g: weightG,
      stock,
      is_unlimited_stock: isUnlimitedStock,
      origin_region: originRegion,
      delivery_methods: deliveryMethods.length > 0 ? deliveryMethods : ['domicilio', 'recogida_tienda'],
      image_url: imageUrl,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/tienda');
  revalidatePath('/regalos-gourmet');
  revalidatePath('/experiencias');
  revalidatePath('/vendedor/productos');
  revalidatePath('/vendedor/eventos');
  redirect('/tienda');
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'No autenticado' };
  }

  const isAllowed = await checkSellerPermission(supabase, user.id);
  if (!isAllowed) {
    return { error: 'Permisos insuficientes. Solo los vendedores de EkhiTeka pueden editar productos.' };
  }

  const name = (formData.get('name') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const categoryId = formData.get('category_id') as string;
  const price = parseFloat(formData.get('price') as string);
  const format = (formData.get('format') as string) || 'unidad';
  const weightG = formData.get('weight_g') ? parseInt(formData.get('weight_g') as string) : null;
  const stock = formData.get('stock') ? parseInt(formData.get('stock') as string) : 10;
  const isUnlimitedStock = formData.get('is_unlimited_stock') === 'true';
  const originRegion = (formData.get('origin_region') as string)?.trim() || 'Lekeitio / Bizkaia';
  const deliveryMethods = formData.getAll('delivery_methods') as string[];

  await ensureCategoryExists(supabase, categoryId);

  let imageUrl = (formData.get('existing_image_url') as string) || (formData.get('image_url_fallback') as string) || null;
  const imageFile = formData.get('image_file') as File | null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageFile, { upsert: true });

    if (!uploadError && uploadData) {
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(uploadData.path);
      imageUrl = publicUrlData.publicUrl;
    }
  }

  const { error } = await supabase
    .from('products')
    .update({
      category_id: categoryId,
      name,
      description,
      price,
      format: format as any,
      weight_g: weightG,
      stock,
      is_unlimited_stock: isUnlimitedStock,
      origin_region: originRegion,
      delivery_methods: deliveryMethods.length > 0 ? deliveryMethods : ['domicilio', 'recogida_tienda'],
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/tienda');
  revalidatePath('/regalos-gourmet');
  revalidatePath('/experiencias');
  revalidatePath(`/producto/${productId}`);
  redirect('/tienda');
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'No autenticado' };
  }

  const isAllowed = await checkSellerPermission(supabase, user.id);
  if (!isAllowed) {
    return { error: 'Permisos insuficientes. Solo los vendedores de EkhiTeka pueden eliminar productos.' };
  }

  const { error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/tienda');
  revalidatePath('/regalos-gourmet');
  revalidatePath('/experiencias');
  revalidatePath(`/producto/${productId}`);
  return { success: true };
}
