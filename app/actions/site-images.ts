'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { parseProfile, type ProfileDetails } from '@/types/database';

async function checkSellerPermission(supabase: any, userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  return profile?.role === 'vendedor' || profile?.role === 'admin';
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

  if (imageFile && imageFile.size > 0 && typeof imageFile !== 'string') {
    const fileExt = imageFile.name.split('.').pop() || 'jpg';
    const fileName = `site_${imageKey}_${Date.now()}.${fileExt}`;

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile, {
          upsert: true,
          contentType: imageFile.type || 'image/jpeg',
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(uploadData.path);
        if (publicUrlData?.publicUrl) {
          imageUrl = publicUrlData.publicUrl;
        }
      }
    } catch {
      // Fall through to Base64
    }

    if (!imageUrl) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const mimeType = imageFile.type || 'image/jpeg';
        imageUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
      } catch {
        // Ignore
      }
    }
  }

  // Obtener nombre del usuario que realiza la modificación
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const authorName = userProfile?.full_name || 'Vendedor EkhiTeka';
  const modifiedAt = new Date().toISOString();

  // Actualizar site_images y site_images_meta en todos los vendedores/admins para coherencia global
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

      const currentImages = details.site_images || {};
      const currentMeta = details.site_images_meta || {};
      const updatedImages = { ...currentImages };
      const updatedMeta = { ...currentMeta };

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

      const updatedBio = JSON.stringify({
        ...details,
        site_images: updatedImages,
        site_images_meta: updatedMeta,
      });

      await supabase
        .from('profiles')
        .update({
          bio: updatedBio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', seller.id);
    }
  }

  revalidatePath('/', 'layout');
  revalidatePath('/tienda');
  revalidatePath('/regalos-gourmet');
  revalidatePath('/experiencias');
  revalidatePath('/regalos-empresa');
  revalidatePath('/vendedor/productos');

  return { success: true, imageUrl: resetToDefault ? null : imageUrl };
}
