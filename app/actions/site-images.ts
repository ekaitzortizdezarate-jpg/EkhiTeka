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
        .upload(fileName, imageFile, { upsert: true });

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

  // Actualizar site_images en todos los vendedores/admins para coherencia global
  const { data: allSellers } = await supabase
    .from('profiles')
    .select('id, bio')
    .in('role', ['vendedor', 'admin']);

  if (allSellers && allSellers.length > 0) {
    for (const seller of allSellers) {
      const parsed = parseProfile(seller);
      const currentImages = (parsed as any).site_images || {};
      const updatedImages = { ...currentImages };

      if (resetToDefault) {
        delete updatedImages[imageKey];
      } else if (imageUrl) {
        updatedImages[imageKey] = imageUrl;
      }

      let details: Partial<ProfileDetails> = {};
      if (seller.bio) {
        try {
          details = JSON.parse(seller.bio);
        } catch {}
      }

      const updatedBio = JSON.stringify({
        ...details,
        site_images: updatedImages,
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
