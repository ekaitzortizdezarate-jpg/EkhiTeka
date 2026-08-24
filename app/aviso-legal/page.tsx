import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LegalNoticePage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 text-stone-800 dark:text-stone-200">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-amber-600">
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a la Tienda</span>
      </Link>

      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-10 space-y-6 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
          Aviso Legal
        </h1>
        <p className="text-xs text-stone-500">Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI-CE)</p>

        <div className="space-y-4 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
          <h2 className="text-sm font-black text-stone-900 dark:text-stone-100">1. Datos Identificativos</h2>
          <p>
            En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, se informa que <strong>EkhiTeka Gourmet</strong> es una marca y plataforma operada por EkhiTeka Gourmet S.L., con NIF B-12345678, domicilio social en Gran Vía 14, 48001 Bilbao (Bizkaia), y correo electrónico <code>info@ekhiteka.com</code>.
          </p>

          <h2 className="text-sm font-black text-stone-900 dark:text-stone-100">2. Propiedad Intelectual e Industrial</h2>
          <p>
            Todos los contenidos de la plataforma (diseños, logotipos, textos, fotografías, código fuente) son titularidad de EkhiTeka o de sus legítimos autores y artesanos colaboradores, estando protegidos por la normativa de propiedad intelectual.
          </p>
        </div>
      </div>
    </div>
  );
}
