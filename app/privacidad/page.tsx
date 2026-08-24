import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 text-stone-800 dark:text-stone-200">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-amber-600">
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a la Tienda</span>
      </Link>

      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-10 space-y-6 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
          Política de Privacidad (RGPD)
        </h1>
        <p className="text-xs text-stone-500">Conforme al Reglamento (UE) 2016/679 y la LOPD-GDD 3/2018</p>

        <div className="space-y-4 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
          <h2 className="text-sm font-black text-stone-900 dark:text-stone-100">1. Responsable del Tratamiento</h2>
          <p>
            <strong>EkhiTeka Gourmet S.L.</strong>, con domicilio en Gamarra Kalea 4, Lekeitio, y correo de contacto <code>info@ekhiteka.com</code>.
          </p>

          <h2 className="text-sm font-black text-stone-900 dark:text-stone-100">2. Finalidad del Tratamiento de Datos</h2>
          <p>
            Tratamos la información que nos facilita con las siguientes finalidades:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Gestión y tramitación de los pedidos solicitados por el comprador.</li>
            <li>Canal de mensajería y chat entre compradores y artesanos/vendedores.</li>
            <li>Gestión del registro de usuario y panel de control.</li>
            <li>Cumplimiento de obligaciones legales, fiscales y contables.</li>
          </ul>

          <h2 className="text-sm font-black text-stone-900 dark:text-stone-100">3. Derechos del Usuario</h2>
          <p>
            Tiene derecho a acceder a sus datos personales, rectificar datos inexactos o solicitar su supresión cuando los datos ya no sean necesarios enviando un correo a <code>info@ekhiteka.com</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
