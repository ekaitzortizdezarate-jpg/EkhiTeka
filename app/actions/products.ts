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

async function getSafeCategoryId(supabase: any, requestedCategoryId: string): Promise<string> {
  if (!requestedCategoryId) return 'queso';

  // 1. Check if category exists
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('id', requestedCategoryId)
    .maybeSingle();

  if (existing?.id) {
    return existing.id;
  }

  // 2. Try to insert it
  const specialCategories: Record<string, { es: string; eu: string; en: string; fr: string; icon: string }> = {
    producto_unico: { es: 'Producto único', eu: 'Produktu bakarra', en: 'Unique product', fr: 'Produit unique', icon: '✨' },
    cesta_gourmet: { es: 'Cesta Gourmet', eu: 'Gourmet Saskia', en: 'Gourmet Hamper', fr: 'Coffret Gourmet', icon: '🎁' },
    cata_casa: { es: 'Cata en Casa', eu: 'Etxeko Dastaketa', en: 'Home Tasting', fr: 'Dégustation à Domicile', icon: '🏠' },
    cata_presencial: { es: 'Cata Presencial', eu: 'Aurrez Aurreko Dastaketa', en: 'In-Person Tasting', fr: 'Dégustation Présentielle', icon: '🍷' },
    tarjeta_regalo: { es: 'Tarjeta Regalo', eu: 'Opari Txartela', en: 'Gift Card', fr: 'Carte Cadeau', icon: '💳' },
    queso: { es: 'Quesos', eu: 'Gaztak', en: 'Cheeses', fr: 'Fromages', icon: '🧀' },
    atun: { es: 'Atún y Bonito', eu: 'Hegaluzea', en: 'Tuna & White Tuna', fr: 'Thon blanc', icon: '🐟' },
    salazon: { es: 'Salazón y Anchoas', eu: 'Gatzadura', en: 'Salted Fish & Anchovies', fr: 'Salaisons & Anchois', icon: '🧂' },
    jildas: { es: 'Gildas y Encurtidos', eu: 'Gildak', en: 'Gildas & Pickles', fr: 'Gildas', icon: '🫒' },
    cerveza: { es: 'Cerveza artesanal', eu: 'Garagardo artisaua', en: 'Craft Beer', fr: 'Bière artisanale', icon: '🍺' },
    txakoli: { es: 'Txakoli', eu: 'Txakolina', en: 'Txakoli Wine', fr: 'Vin Txakoli', icon: '🍾' },
    sidra: { es: 'Sidra', eu: 'Sagardoa', en: 'Natural Cider', fr: 'Cidre naturel', icon: '🍏' },
  };

  const spec = specialCategories[requestedCategoryId] || {
    es: requestedCategoryId.replace(/_/g, ' '),
    eu: requestedCategoryId.replace(/_/g, ' '),
    en: requestedCategoryId.replace(/_/g, ' '),
    fr: requestedCategoryId.replace(/_/g, ' '),
    icon: '✨',
  };

  const { error: insertError } = await supabase.from('categories').insert({
    id: requestedCategoryId,
    name_es: spec.es,
    name_eu: spec.eu,
    name_en: spec.en,
    name_fr: spec.fr,
    icon: spec.icon,
    display_order: 99,
    is_active: true,
  });

  if (!insertError) {
    return requestedCategoryId;
  }

  // 3. If RLS blocked category creation, fetch any existing valid category
  const { data: firstValid } = await supabase
    .from('categories')
    .select('id')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  return firstValid?.id || 'queso';
}

async function processProductImage(
  supabase: any,
  userId: string,
  imageFile: File | null,
  fallbackUrl: string | null
): Promise<string | null> {
  if (imageFile && imageFile.size > 0 && typeof imageFile !== 'string') {
    const fileExt = imageFile.name.split('.').pop() || 'jpg';
    const fileName = `${userId}_${Date.now()}.${fileExt}`;

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile, { upsert: true });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(uploadData.path);
        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch {
      // Fall through to Base64 data URL
    }

    try {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = imageFile.type || 'image/jpeg';
      return `data:${mimeType};base64,${buffer.toString('base64')}`;
    } catch {
      // Fall through to fallback URL
    }
  }

  return fallbackUrl || null;
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
  const isUnlimitedStock = formData.get('is_unlimited_stock') === 'true';
  const stock = isUnlimitedStock ? 999 : (formData.get('stock') ? parseInt(formData.get('stock') as string) : 10);
  const originRegion = (formData.get('origin_region') as string)?.trim() || 'Lekeitio / Bizkaia';
  const deliveryMethods = formData.getAll('delivery_methods') as string[];
  const pickupAddressIds = formData.getAll('pickup_address_ids') as string[];
  const eventAddressId = (formData.get('event_address_id') as string) || null;

  if (!name || isNaN(price)) {
    return { error: 'Por favor, rellena los campos obligatorios (Nombre y Precio).' };
  }

  const safeCategoryId = await getSafeCategoryId(supabase, categoryId);

  const fallbackUrl = (formData.get('image_url_fallback') as string) || null;
  const imageFile = formData.get('image_file') as File | null;
  const imageUrl = await processProductImage(supabase, user.id, imageFile, fallbackUrl);

  const { data, error } = await supabase
    .from('products')
    .insert({
      seller_id: user.id,
      category_id: safeCategoryId,
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
  const returnTab = (formData.get('return_tab') as string) || (categoryId === 'cata_presencial' ? 'eventos' : 'productos');
  redirect(`/vendedor/productos?tab=${returnTab}`);
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
  const originRegion = (formData.get('origin_region') as string)?.trim() || 'Lekeitio / Bizkaia';
  const deliveryMethods = formData.getAll('delivery_methods') as string[];

  const safeCategoryId = await getSafeCategoryId(supabase, categoryId);

  const fallbackUrl =
    (formData.get('existing_image_url') as string) ||
    (formData.get('image_url_fallback') as string) ||
    null;
  const imageFile = formData.get('image_file') as File | null;
  const imageUrl = await processProductImage(supabase, user.id, imageFile, fallbackUrl);

  const updateData: Record<string, any> = {
    category_id: safeCategoryId,
    name,
    description,
    price,
    format: format as any,
    weight_g: weightG,
    origin_region: originRegion,
    delivery_methods: deliveryMethods.length > 0 ? deliveryMethods : ['domicilio', 'recogida_tienda'],
    image_url: imageUrl,
    updated_at: new Date().toISOString(),
  };

  // Si se envió stock explícitamente se actualiza, si no se mantiene el stock actual
  if (formData.has('stock')) {
    const isUnlimitedStock = formData.get('is_unlimited_stock') === 'true';
    updateData.is_unlimited_stock = isUnlimitedStock;
    updateData.stock = isUnlimitedStock ? 999 : (formData.get('stock') ? parseInt(formData.get('stock') as string) : 10);
  }

  const { error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/tienda');
  revalidatePath('/regalos-gourmet');
  revalidatePath('/experiencias');
  revalidatePath('/vendedor/productos');
  revalidatePath(`/producto/${productId}`);
  const returnTab = (formData.get('return_tab') as string) || (categoryId === 'cata_presencial' ? 'eventos' : 'productos');
  redirect(`/vendedor/productos?tab=${returnTab}`);
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

  // 1. Comprobar si hay pedidos en curso asociados a este producto
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('id, order_id, orders(id, status)')
    .eq('product_id', productId);

  if (orderItems && orderItems.length > 0) {
    const activeOrders = orderItems.filter((item: any) => {
      const status = item.orders?.status;
      return status && status !== 'entregado' && status !== 'cancelado';
    });

    if (activeOrders.length > 0) {
      return {
        error: `No se puede eliminar este producto porque está incluido en ${activeOrders.length} pedido(s) en curso. Debes completar o cancelar los pedidos antes de poder eliminarlo del sistema.`,
      };
    }
  }

  // 2. Proceder al borrado del producto para todos los usuarios
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (deleteError) {
    // Si hay items de pedidos históricos completados/cancelados con clave foránea
    if (deleteError.code === '23503' || deleteError.message?.includes('foreign key')) {
      await supabase.from('order_items').delete().eq('product_id', productId);
      const { error: retryError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (retryError) {
        // Fallback: desactivar para que no aparezca en ninguna vista
        await supabase.from('products').update({ is_active: false }).eq('id', productId);
      }
    } else {
      await supabase.from('products').update({ is_active: false }).eq('id', productId);
    }
  }

  revalidatePath('/');
  revalidatePath('/tienda');
  revalidatePath('/regalos-gourmet');
  revalidatePath('/experiencias');
  revalidatePath('/vendedor/productos');
  revalidatePath('/vendedor/eventos');
  revalidatePath(`/producto/${productId}`);
  return { success: true };
}
