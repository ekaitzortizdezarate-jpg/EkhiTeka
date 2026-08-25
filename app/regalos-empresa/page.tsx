import { createClient } from '@/lib/supabase/server';
import {
  Briefcase,
  Building2,
  Sparkles,
  MessageCircle,
  Truck,
  CheckCircle2,
  Users,
  ShieldCheck,
} from 'lucide-react';

export const revalidate = 0;

export default async function RegalosEmpresaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isSeller = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role === 'vendedor' || profile?.role === 'admin') {
      isSeller = true;
    }
  }

  return (
    <div className="space-y-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 1. Hero Editorial Regalos de Empresa */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border-2 border-stone-800 shadow-2xl min-h-[380px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/secciones/Empresas.JPG"
            alt="Regalos de Empresa EkhiTeka"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/30 to-black/10 dark:from-black/90 dark:via-black/75 dark:to-black/50" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4 text-white">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-black rounded-full uppercase tracking-wider shadow-md">
            <Building2 className="w-3.5 h-3.5" /> Soluciones Corporativas & Lotes Navideños
          </span>

          <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight">
            Regalos de <span className="text-[#FFE259]">Empresa</span>
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
            Agradece la confianza de tu equipo y clientes con lotes gastronómicos artesanos, detalles corporativos personalizados y experiencias de cata exclusivas.
          </p>

          {!isSeller && (
            <div className="pt-2">
              <a
                href="https://wa.me/34600000000?text=Hola,%20quisiera%20solicitar%20un%20presupuesto%20para%20Regalos%20de%20Empresa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 font-serif"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pedir Presupuesto Corporativo por WhatsApp</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* 2. Pilares de Servicio a Empresas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
            Lotes y Cestas de Navidad
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
            Composiciones prémium sin intermediarios: quesos de afinador, embutidos ibéricos de bellota, salazones del Cantábrico y maridajes singulares con factura desglosada.
          </p>
        </div>

        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
            Catas Privadas & Team Building
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
            Organizamos eventos de empresa y actividades de equipo guiadas en nuestra quesería de Lekeitio o en la sede de tu empresa.
          </p>
        </div>

        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
            Personalización con tu Marca
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
            Incluimos fajas personalizadas, tarjetas con el logotipo de tu empresa y mensajes corporativos dedicados para cada destinatario.
          </p>
        </div>
      </section>

      {/* 3. Garantías de Logística */}
      <section className="rounded-3xl bg-[#FAF7F2] dark:bg-[#1C1B19] border border-stone-200/90 dark:border-stone-800 p-8 sm:p-12 shadow-sm space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
            Compromiso EkhiTeka
          </span>
          <h3 className="text-2xl sm:text-3xl font-black font-serif text-stone-900 dark:text-stone-100">
            Logística Impecable y Envíos Múltiples
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
            Nos encargamos de toda la gestión de envíos a múltiples domicilios de empleados o clientes en 24/48 horas con trazabilidad total.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
            <Truck className="w-5 h-5 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
              Envíos individuales a cada empleado
            </span>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
            <ShieldCheck className="w-5 h-5 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
              Transporte refrigerado homologado
            </span>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
            <CheckCircle2 className="w-5 h-5 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
              Facturación detallada con IVA desglosado
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}