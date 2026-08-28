'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ProfileDetails, SiteImageMeta } from '@/types/database';

export interface GlobalSiteImagesConfig {
  images: Record<string, string>;
  meta: Record<string, SiteImageMeta>;
}

const CONFIG_FILE_PATH = 'site_config/site_images_config.json';
const BUCKET_NAME = 'product-images';

async function checkSellerPermission(supabase: any, userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  return profile?.role === 'vendedor' || profile?.role === 'admin';
}

/**
 * Obtiene la configuración de imágenes de la web directamente desde Supabase Storage
 * con fallback inteligente a las imágenes registradas en la base de datos de perfiles.
 */
export async function getGlobalSiteImagesConfig(supabaseClient?: any): Promise<GlobalSiteImagesConfig> {
  const supabase = supabaseClient || (await createClient());

  let hasStorage = false;
  let images: Record<string, string> = {};
  let meta: Record<string, SiteImageMeta> = {};

  // 1. Intentar descargar site_images_config.json desde Supabase Storage
  try {
    const { data: fileData, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(CONFIG_FILE_PATH);

    if (!error && fileData) {
      const text = await fileData.text();
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') {
        hasStorage = true;
        if (parsed.images && typeof parsed.images === 'object') {
          images = { ...parsed.images };
        }
        if (parsed.meta && typeof parsed.meta === 'object') {
          meta = { ...parsed.meta };
        }
      }
    }
  } catch {
    // Si no existe aún en storage, continuará escaneando los perfiles de la BD
  }

  // 2. SOLO si no existía el archivo en Storage, escanear perfiles de la BD como fallback
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
            if (parsed?.site_images && typeof parsed.site_images === 'object') {
              images = { ...parsed.site_images, ...images };
            }
            if (parsed?.site_images_meta && typeof parsed.site_images_meta === 'object') {
              meta = { ...parsed.site_images_meta, ...meta };
            }
          } catch {}
        }
      }
    } catch {}
  }

  return { images, meta };
}

export async function updateSiteImage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'No autenticado' };
  }

  const isAllowed = await checkSellerPermission(supabase, user.id);
  if (!isAllowed) {
    return { error: 'Permisos insuficientes para editar imágenes de la web.' };
  }

  const imageKey = formData.get('image_key') as string;
  let imageUrl = (formData.get('image_url') as string)?.trim() || null;
  const imageFile = formData.get('image_file') as File | null;
  const resetToDefault = formData.get('reset_to_default') === 'true';

  if (!imageKey) {
    return { error: 'Clave de imagen no especificada.' };
  }

  // 1. Si se adjuntó un archivo, subirlo permanentemente a Supabase Storage
  if (imageFile && imageFile.size > 0 && typeof imageFile !== 'string') {
    const fileExt = imageFile.name.split('.').pop() || 'jpg';
    const fileName = `site_images/${imageKey}_${Date.now()}.${fileExt}`;

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, imageFile, {
          upsert: true,
          contentType: imageFile.type || 'image/jpeg',
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(uploadData.path);
        if (publicUrlData?.publicUrl) {
          imageUrl = publicUrlData.publicUrl;
        }
      }
    } catch {}

    if (!imageUrl) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const mimeType = imageFile.type || 'image/jpeg';
        imageUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
      } catch {}
    }
  }

  // 2. Obtener el nombre del vendedor que realiza la modificación
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const authorName = userProfile?.full_name || 'Vendedor EkhiTeka';
  const modifiedAt = new Date().toISOString();

  // 3. Obtener la configuración actual y actualizarla
  const currentConfig = await getGlobalSiteImagesConfig(supabase);
  const updatedImages = { ...currentConfig.images };
  const updatedMeta = { ...currentConfig.meta };

  if (resetToDefault) {
    delete updatedImages[imageKey];
    delete updatedMeta[imageKey];
  } else if (imageUrl) {
    updatedImages[imageKey] = imageUrl;
    updatedMeta[imageKey] = {
      author_name: authorName,
      author_id: user.id,
      updated_at: modifiedAt,
    };
  }

  const newConfig: GlobalSiteImagesConfig = {
    images: updatedImages,
    meta: updatedMeta,
  };

  // 4. Guardar la configuración en Supabase Storage de forma PERMANENTE
  try {
    const configBlob = new Blob([JSON.stringify(newConfig, null, 2)], {
      type: 'application/json',
    });
    await supabase.storage
      .from(BUCKET_NAME)
      .upload(CONFIG_FILE_PATH, configBlob, {
        upsert: true,
        contentType: 'application/json',
      });
  } catch (err) {
    console.error('Error guardando configuración en Supabase Storage:', err);
  }

  // 5. Guardar también en todos los perfiles de vendedores de la BD para redundancia
  try {
    const { data: allSellers } = await supabase
      .from('profiles')
      .select('id, bio')
      .in('role', ['vendedor', 'admin']);

    if (allSellers && allSellers.length > 0) {
      for (const seller of allSellers) {
        let details: Partial<ProfileDetails> = {};
        if (seller.bio) {
          try {
            const parsed = JSON.parse(seller.bio);
            if (typeof parsed === 'object' && parsed !== null) {
              details = parsed;
            }
          } catch {}
        }

        const updatedBio = JSON.stringify({
          ...details,
          site_images: updatedImages,
          site_images_meta: updatedMeta,
        });

        await supabase
          .from('profiles')
          .update({
            bio: updatedBio,
          })
          .eq('id', seller.id);
      }
    }
  } catch {}

  revalidatePath('/', 'layout');
  revalidatePath('/tienda');
  revalidatePath('/regalos-gourmet');
  revalidatePath('/experiencias');
  revalidatePath('/regalos-empresa');
  revalidatePath('/vendedor/productos');
  revalidatePath('/perfil');

  return { success: true, imageUrl: resetToDefault ? null : imageUrl };
}
