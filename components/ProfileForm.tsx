'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { updateProfile } from '@/app/actions/auth';
import type { Profile } from '@/types/database';
import { User, Phone, MapPin, Check, AlertCircle } from 'lucide-react';

export function ProfileForm({ profile }: { profile: Profile }) {
  const { t } = useLanguage();
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
      setMsg({ text: t.common_success, isError: false });
      setTimeout(() => setMsg(null), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-serif">
      {msg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold text-center ${
            msg.isError
              ? 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
              : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
            {t.auth_full_name} *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="full_name"
              required
              defaultValue={profile.full_name || ''}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
              {t.auth_phone}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                defaultValue={profile.phone || ''}
                placeholder="600 000 000"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
              {t.auth_town}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="town"
                defaultValue={profile.town || ''}
                placeholder="Lekeitio / Bizkaia"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE259]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          <span>{loading ? 'Guardando...' : t.common_save}</span>
        </button>
      </div>
    </form>
  );
}