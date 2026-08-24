import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminCategoriesSection } from '@/components/AdminCategoriesSection';
import type { Category, Profile } from '@/types/database';
import { ShieldCheck } from 'lucide-react';

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/');
  }

  const [categoriesRes, profilesRes, productsCountRes, ordersCountRes] = await Promise.all([
    supabase.from('categories').select('*').order('display_order', { ascending: true }),
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(20),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
  ]);

  const categories = (categoriesRes.data || []) as Category[];
  const profiles = (profilesRes.data || []) as Profile[];
  const productsCount = productsCountRes.count || 0;
  const ordersCount = ordersCountRes.count || 0;

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
            Panel de Administración · EkhiTeka
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Gestión de categorías dinámicas, usuarios y métricas generales.
          </p>
        </div>
      </div>

      {/* Métricas Resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-200 dark:border-stone-800 space-y-1">
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">Categorías</span>
          <p className="text-2xl font-black text-amber-600">{categories.length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-200 dark:border-stone-800 space-y-1">
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">Productos</span>
          <p className="text-2xl font-black text-amber-600">{productsCount}</p>
        </div>
        <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-200 dark:border-stone-800 space-y-1">
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">Pedidos</span>
          <p className="text-2xl font-black text-amber-600">{ordersCount}</p>
        </div>
        <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-200 dark:border-stone-800 space-y-1">
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">Usuarios</span>
          <p className="text-2xl font-black text-amber-600">{profiles.length}</p>
        </div>
      </div>

      {/* Gestión de Categorías */}
      <AdminCategoriesSection categories={categories} />
    </div>
  );
}
