'use server';

import { createClient } from '@/lib/supabase/server';
import { parseProfile, type ProfileDetails } from '@/types/database';
import type { CartItem } from '@/context/CartContext';

export async function getUserCart(): Promise<{ items: CartItem[]; isAuthenticated: boolean; userId?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { items: [], isAuthenticated: false };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('bio')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile) {
      return { items: [], isAuthenticated: true, userId: user.id };
    }

    const parsed = parseProfile(profile);
    const cartItems = Array.isArray(parsed.cart_data) ? parsed.cart_data : [];

    return { items: cartItems, isAuthenticated: true, userId: user.id };
  } catch (err) {
    console.error('Error fetching user cart:', err);
    return { items: [], isAuthenticated: false };
  }
}

export async function syncUserCart(items: CartItem[]): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'No autenticado' };
    }

    const { data: currentProf } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    let details: Partial<ProfileDetails> = {};
    if (currentProf?.bio) {
      try {
        const parsed = JSON.parse(currentProf.bio);
        if (typeof parsed === 'object' && parsed !== null) {
          details = parsed;
        }
      } catch {}
    }

    const updatedDetails = {
      ...details,
      cart_data: items,
    };

    const structuredBio = JSON.stringify(updatedDetails);

    const { error } = await supabase
      .from('profiles')
      .update({
        bio: structuredBio,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al sincronizar cesta' };
  }
}
