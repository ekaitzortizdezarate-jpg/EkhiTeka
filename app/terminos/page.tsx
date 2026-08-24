import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 text-stone-800 dark:text-stone-200">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-amber-600">
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a la Tienda</span>
      </Link>

      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-10 space-y-6 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
          Términos y Condiciones de Uso y Venta
        </h1>
        <p className="text-xs text-stone-500">Última actualización: Agosto 2026</p>

        <div className="space-y-4 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
          <h2 className="text-sm font-black text-stone-900 dark:text-stone-100">1. Objeto y Titularidad</h2>
          <p>
            El presente documento regula las condiciones de uso y compra en <strong>EkhiTeka</strong> (en adelante, la Plataforma), plataforma de comercio electrónico especializada en productos gastronómicos artesanos y de autor (quesos, conservas, embutidos, sidras, txakolis y cervezas artesanales).
          </p>

          <h2 className="text-sm font-black text-stone-900 dark:text-stone-100">2. Proceso de Compra y Precios</h2>
          <p>
            Todos los precios mostrados incluyen el Impuesto sobre el Valor Añadido (IVA) correspondiente. Los compradores pueden seleccionar entre dos modalidades: envío refrigerado a domicilio o recogida gratuita en el establecimiento físico colaborador.
          </p>

          <h2 className="text-sm font-black text-stone-900 dark:text-stone-100">3. Envíos y Conservación de Productos</h2>
          <p>
            Garantizamos la cadena de frío para productos perecederos (quesos artesanos, salazones y gildas) mediante packaging térmico y mensajería urgente 24/48 horas.
          </p>

          <h2 className="text-sm font-black text-stone-900 dark:text-stone-100">4. Derecho de Desistimiento y Devoluciones</h2>
          <p>
            De conformidad con el art. 103 del Real Decreto Legislativo 1/2007, el derecho de desistimiento no será aplicable al suministro de bienes que puedan deteriorarse o caducar con rapidez (alimentos frescos o refrigerados desprecintados). Para cualquier incidencia, se habilitará el canal de chat directo con el artesano o atención al cliente.
          </p>
        </div>
      </div>
    </div>
  );
}
