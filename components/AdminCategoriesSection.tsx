'use client';

import { useState } from 'react';
import { createCategory } from '@/app/actions/admin';
import type { Category } from '@/types/database';
import { Layers } from 'lucide-react';

interface AdminCategoriesSectionProps {
  categories: Category[];
}

export function AdminCategoriesSection({ categories }: AdminCategoriesSectionProps) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await createCategory(formData);
    setLoading(false);

    if (res?.error) {
      setMsg({ text: res.error, isError: true });
    } else {
      setMsg({ text: 'Categoría creada con éxito', isError: false });
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Formulario Añadir Nueva Categoría */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-600" />
          <h2 className="text-sm font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider">
            Añadir Categoría
          </h2>
        </div>

        {msg && (
          <div
            className={`p-3 rounded-xl text-xs font-bold text-center ${
              msg.isError
                ? 'bg-red-100 text-red-900 border border-red-300'
                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              ID (slug único) *
            </label>
            <input
              type="text"
              name="id"
              required
              placeholder="ej: dulces_artesanos"
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Icono (Emoji)</label>
              <input
                type="text"
                name="icon"
                defaultValue="✨"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Orden</label>
              <input
                type="number"
                name="display_order"
                defaultValue="10"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Nombre Español *</label>
            <input
              type="text"
              name="name_es"
              required
              placeholder="Dulces y Chocolates"
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Nombre Euskera *</label>
            <input
              type="text"
              name="name_eu"
              required
              placeholder="Goxokiak eta Txokolatea"
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Nombre Inglés *</label>
            <input
              type="text"
              name="name_en"
              required
              placeholder="Sweets & Chocolates"
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Nombre Francés *</label>
            <input
              type="text"
              name="name_fr"
              required
              placeholder="Douceurs & Chocolats"
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-black rounded-xl shadow-xs transition-all cursor-pointer mt-2"
          >
            {loading ? 'Creando...' : 'Crear Categoría'}
          </button>
        </form>
      </div>

      {/* Lista de Categorías Existentes */}
      <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-5 sm:p-6 space-y-4 shadow-xs">
        <h2 className="text-sm font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider">
          Categorías Activas ({categories.length})
        </h2>

        <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
          {categories.map((cat) => (
            <div key={cat.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <span className="font-black text-stone-900 dark:text-stone-100 block">
                    {cat.name_es} / {cat.name_eu}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    ID: {cat.id} · EN: {cat.name_en} · FR: {cat.name_fr}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-bold text-[10px]">
                Orden: {cat.display_order}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
