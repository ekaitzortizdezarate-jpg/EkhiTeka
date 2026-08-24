import { Building2, Users2, Gift, TreePine, Sparkles, MessageCircle, ArrowRight, Award } from 'lucide-react';

export const revalidate = 0;

export default function RegalosEmpresaPage() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header Banner Regalos de Empresa */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border-2 border-stone-800 shadow-2xl min-h-[380px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/secciones/Mesas.JPG"
            alt="Regalos de Empresa EkhiTeka"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4 text-white">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-black rounded-full uppercase tracking-wider shadow-md">
            <Building2 className="w-3.5 h-3.5" /> Servicios Corporativos
          </span>

          <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight">
            Regalos de <span className="text-[#FFE259]">Empresa</span>
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
            Distingue a tu empresa con experiencias y regalos gastronómicos de autor. Catas de teambuilding, cestas de navidad exclusivas y detalles corporativos a medida para clientes y equipos.
          </p>

          <div className="pt-2">
            <a
              href="https://wa.me/34600000000?text=Hola,%20quisiera%20solicitar%20un%20presupuesto%20para%20Regalos/Eventos%20de%20Empresa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Solicitar Presupuesto Corporativo por WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3 Servicios Corporativos Principales */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Teambuilding */}
        <div className="group rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div className="relative h-56 overflow-hidden">
              <img
                src="/images/secciones/Catas.JPG"
                alt="Teambuilding gastronómico"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                Dinámicas de Equipo
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#C68D07] dark:text-[#FFE259]">
                <Users2 className="w-5 h-5" />
                <h2 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                  Teambuilding
                </h2>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                Catas guiadas a ciegas, retos de maridaje y talleres sensoriales en torno a la cultura del queso artesano. Diseñado para reforzar la cohesión de equipos tanto en nuestra tienda de Lekeitio como en las instalaciones de tu empresa.
              </p>
            </div>
          </div>
          <div className="p-6 pt-0">
            <a
              href="https://wa.me/34600000000?text=Hola,%20quisiera%20información%20sobre%20actividades%20de%20Teambuilding"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-stone-900 dark:text-stone-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>Organizar Teambuilding</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 2. Cesta de Navidad */}
        <div className="group rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div className="relative h-56 overflow-hidden">
              <img
                src="/images/secciones/Cestas.JPG"
                alt="Cesta de Navidad"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                Campaña Navideña
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#C68D07] dark:text-[#FFE259]">
                <TreePine className="w-5 h-5" />
                <h2 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                  Cesta de Navidad
                </h2>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                Lotes navideños de autor lejos de los catálogos convencionales: quesos premiados de afinador, bonito del Cantábrico embotado a mano, salazones selectas, turrones artesanos y txakolis de guarda.
              </p>
            </div>
          </div>
          <div className="p-6 pt-0">
            <a
              href="https://wa.me/34600000000?text=Hola,%20quisiera%20el%20catálogo%20de%20Cestas%20de%20Navidad%20para%20Empresas"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-stone-900 dark:text-stone-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>Catálogo Cestas de Navidad</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 3. Cestas para Empresas */}
        <div className="group rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div className="relative h-56 overflow-hidden">
              <img
                src="/images/secciones/Mesas.JPG"
                alt="Cestas para Empresas"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                Todo el año
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#C68D07] dark:text-[#FFE259]">
                <Gift className="w-5 h-5" />
                <h2 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                  Cestas para Empresas
                </h2>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                Regalos corporativos para clientes VIP, agradecimiento a colaboradores y bienvenidas de nuevos empleados. Personalizamos el packaging con tu identidad corporativa y notas personalizadas.
              </p>
            </div>
          </div>
          <div className="p-6 pt-0">
            <a
              href="https://wa.me/34600000000?text=Hola,%20quisiera%20información%20sobre%20Cestas%20Personalizadas%20para%20Empresas"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-stone-900 dark:text-stone-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>Pedir Cestas Corporativas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
