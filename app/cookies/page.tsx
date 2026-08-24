import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 text-stone-800 dark:text-stone-200">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-amber-600">
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a la Tienda</span>
      </Link>

      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-10 space-y-6 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
          Política de Cookies
        </h1>
        <p className="text-xs text-stone-500">Información sobre el uso de cookies en EkhiTeka</p>

        <div className="space-y-4 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
          <h2 className="text-sm font-black text-stone-900 dark:text-stone-100">1. ¿Qué son las Cookies?</h2>
          <p>
            Una cookie es un pequeño fichero que se descarga en su dispositivo al acceder a determinadas páginas web para almacenar y recuperar información sobre la navegación.
          </p>

          <h2 className="text-sm font-black text-stone-900 dark:text-stone-100">2. Cookies que Utilizamos</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Cookies Técnicas / Estrictamente necesarias:</strong> Imprescindibles para la gestión de la sesión del usuario, la persistencia de la cesta de la compra y la autenticación segura en Supabase.</li>
            <li><strong>Cookies de Personalización:</strong> Permiten recordar su idioma preferido (Euskera, Español, Inglés, Francés) y la preferencia de modo oscuro/claro.</li>
          </ul>

          <h2 className="text-sm font-black text-stone-900 dark:text-stone-100">3. Configuración y Desactivación</h2>
          <p>
            Puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones de su navegador de Internet.
          </p>
        </div>
      </div>
    </div>
  );
}
