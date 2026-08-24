'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function checkSellerPermission(supabase: any, userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  return profile?.role === 'vendedor' || profile?.role === 'admin';
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

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('category_id') as string;
  const price = parseFloat(formData.get('price') as string);
  const format = (formData.get('format') as string) || 'unidad';
  const weightG = formData.get('weight_g') ? parseInt(formData.get('weight_g') as string) : null;
  const stock = formData.get('stock') ? parseInt(formData.get('stock') as string) : 10;
  const isUnlimitedStock = formData.get('is_unlimited_stock') === 'true';
  const originRegion = formData.get('origin_region') as string;
  const deliveryMethods = formData.getAll('delivery_methods') as string[];

  // Gestión de subida de imagen a Supabase Storage
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
  revalidatePath('/vendedor/productos');
  redirect('/');
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

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('category_id') as string;
  const price = parseFloat(formData.get('price') as string);
  const format = (formData.get('format') as string) || 'unidad';
  const weightG = formData.get('weight_g') ? parseInt(formData.get('weight_g') as string) : null;
  const stock = formData.get('stock') ? parseInt(formData.get('stock') as string) : 10;
  const isUnlimitedStock = formData.get('is_unlimited_stock') === 'true';
  const originRegion = formData.get('origin_region') as string;
  const deliveryMethods = formData.getAll('delivery_methods') as string[];

  let imageUrl = formData.get('existing_image_url') as string | null;
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
  revalidatePath(`/producto/${productId}`);
  redirect('/');
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
  revalidatePath(`/producto/${productId}`);
  return { success: true };
}

