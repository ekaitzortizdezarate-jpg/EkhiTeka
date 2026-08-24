'use client';

import { useState } from 'react';
import { updateProfile } from '@/app/actions/admin';
import type { Profile } from '@/types/database';
import { Check } from 'lucide-react';

interface ProfileFormProps {
  userProfile: Profile;
}

export function ProfileForm({ userProfile }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateProfile(formData);
    setLoading(false);

    if (res?.error) {
      setMsg({ text: res.error, isError: true });
    } else {
      setMsg({ text: 'Perfil actualizado con éxito', isError: false });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-sm">
      {msg && (
        <div
          className={`p-3 rounded-2xl text-xs font-bold text-center ${
            msg.isError
              ? 'bg-red-100 text-red-900 dark:bg-red-950/60 dark:text-red-200 border border-red-300'
              : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-300'
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
          Rol
        </label>
        <div className="px-4 py-2.5 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-black text-amber-700 dark:text-amber-400 uppercase">
          {userProfile?.role}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
          Nombre Completo
        </label>
        <input
          type="text"
          name="full_name"
          defaultValue={userProfile?.full_name || ''}
          required
          className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
          Teléfono
        </label>
        <input
          type="tel"
          name="phone"
          defaultValue={userProfile?.phone || ''}
          className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
          Ciudad / Municipio
        </label>
        <input
          type="text"
          name="town"
          defaultValue={userProfile?.town || 'Bilbao'}
          className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
          Dirección Habitual
        </label>
        <input
          type="text"
          name="address"
          defaultValue={userProfile?.address || ''}
          placeholder="Calle, número, piso..."
          className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
          Biografía / Presentación
        </label>
        <textarea
          name="bio"
          rows={2}
          defaultValue={userProfile?.bio || ''}
          className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
        />
      </div>

      <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
        </button>
      </div>
    </form>
  );
}
