import Link from 'next/link';
import {
  Sparkles,
  ShoppingBag,
  Gift,
  Wine,
  Building2,
  ArrowRight,
  MessageCircle,
  Store,
  ChevronRight,
  ShieldCheck,
  Heart,
  Award,
} from 'lucide-react';

export const revalidate = 0;

export default function HomePage() {
  return (
    <div className="space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 1. Hero Principal de Bienvenida a EkhiTeka Lekeitio */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-14 lg:p-18 border-2 border-stone-800 shadow-2xl min-h-[460px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/secciones/Tienda.JPG"
            alt="EkhiTeka Quesería Gourmet Lekeitio"
            className="w-full h-full object-cover object-center scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/45 backdrop-brightness-90" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          <div className="lg:col-span-8 space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-black rounded-full uppercase tracking-wider shadow-md">
              <Sparkles className="w-3.5 h-3.5" /> Quesería Gourmet & Espacio Gastronómico
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] font-serif text-white drop-shadow-md">
              Ekhi<span className="text-[#FFE259]">Teka</span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-light text-stone-200 mt-2">
                Quesos de autor & Experiencias en Lekeitio
              </span>
            </h1>

            <p className="text-sm sm:text-base text-white/95 leading-relaxed max-w-xl font-medium drop-shadow-md">
              Afinado artesanal de quesos singulares, tesoros del Cantábrico y maridajes selectos. Descubre nuestra tienda online, cestas de regalo y experiencias a medida en el corazón de Bizkaia.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs sm:text-sm transition-all shadow-xl hover:scale-105 uppercase tracking-wider font-serif"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explorar Tienda Online</span>
              </Link>

              <Link
                href="/regalos-gourmet"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border-2 border-white/40 transition-all backdrop-blur-md shadow-lg hover:scale-105 uppercase tracking-wider font-serif"
              >
                <Gift className="w-4 h-4 text-[#FFE259]" />
                <span>Regalos Gourmet</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full overflow-hidden border-4 border-[#FFE259] shadow-2xl p-1 bg-[#FAF7F2] hover:scale-105 transition-transform duration-500">
              <img
                src="/Logo.jpg"
                alt="EkhiTeka Lekeitio"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Los 4 Pilares de EkhiTeka (Navegación Visual) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
            Nuestra Casa · El Universo EkhiTeka
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-serif text-stone-900 dark:text-stone-100 uppercase tracking-tight">
            Descubre Nuestras Secciones
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Selecciona la experiencia que buscas y déjate guiar por nuestro afinado artesanal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tarjeta 1: Tienda */}
          <Link
            href="/tienda"
            className="group relative rounded-3xl overflow-hidden bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src="/images/secciones/Quesos.JPG"
                alt="Tienda de Quesos EkhiTeka"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                Online & Envío
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE259] block">
                  Catálogo Completo
                </span>
                <h3 className="font-serif font-bold text-xl leading-tight">
                  Tienda Gourmet
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                Quesos afinados, bonito del Cantábrico, salazones, gildas artesanas, txakoli, sidra y cerveza de autor.
              </p>
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#C68D07] dark:text-[#FFE259] pt-2 font-serif uppercase tracking-wider">
                <span>Entrar a la Tienda</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Tarjeta 2: Regalos Gourmet */}
          <Link
            href="/regalos-gourmet"
            className="group relative rounded-3xl overflow-hidden bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src="/images/secciones/Cestas.JPG"
                alt="Regalos Gourmet"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                Para Regalar
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE259] block">
                  Detalles & Cestas
                </span>
                <h3 className="font-serif font-bold text-xl leading-tight">
                  Regalos Gourmet
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                Cestas gourmet personalizadas, kits de cata para casa y tarjetas regalo virtuales o físicas.
              </p>
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#C68D07] dark:text-[#FFE259] pt-2 font-serif uppercase tracking-wider">
                <span>Ver Opciones de Regalo</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Tarjeta 3: Catas & Experiencias */}
          <Link
            href="/experiencias"
            className="group relative rounded-3xl overflow-hidden bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src="/images/secciones/Catas.JPG"
                alt="Catas & Experiencias"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                Sensorial
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE259] block">
                  En Tienda & Eventos
                </span>
                <h3 className="font-serif font-bold text-xl leading-tight">
                  Catas & Experiencias
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                Catas en casa, catas presenciales en tienda de Lekeitio, mesas para bodas y préstamo de raclette.
              </p>
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#C68D07] dark:text-[#FFE259] pt-2 font-serif uppercase tracking-wider">
                <span>Descubrir Experiencias</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Tarjeta 4: Regalos de Empresa */}
          <Link
            href="/regalos-empresa"
            className="group relative rounded-3xl overflow-hidden bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src="/images/secciones/Mesas.JPG"
                alt="Regalos de Empresa"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                Corporativo
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE259] block">
                  Equipos & Clientes
                </span>
                <h3 className="font-serif font-bold text-xl leading-tight">
                  Regalos de Empresa
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                Teambuilding gastronómico, cestas de navidad de autor y detalles corporativos a medida.
              </p>
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#C68D07] dark:text-[#FFE259] pt-2 font-serif uppercase tracking-wider">
                <span>Ver Servicios de Empresa</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Nuestra Tienda Física en Lekeitio */}
      <section className="relative rounded-3xl bg-[#FAF7F2] dark:bg-[#1C1B19] border-2 border-stone-200/90 dark:border-stone-800 p-8 sm:p-12 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
              Visítanos en Lekeitio · Km0
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#1D1D1B] dark:text-stone-100 tracking-tight leading-tight font-serif">
              Nuestra Quesería & Espacio Gourmet
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              En nuestra tienda de Lekeitio lo tienes todo: más de 80 referencias de quesos artesanos afinados, conservas selectas del Cantábrico y el asesoramiento personalizado de nuestros maestros queseros.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-stone-700 dark:text-stone-300">
              <div className="flex items-center gap-2">
                <span className="text-base">📍</span>
                <span>Gamarra Kalea 4, Lekeitio · Bizkaia</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">🕒</span>
                <span>Lun-Vie: 10:00 - 20:30 | Sáb: 10:30 - 15:00</span>
              </div>
            </div>
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="https://wa.me/34600000000?text=Hola,%20quisiera%20consultar%20disponibilidad%20en%20tienda%20Lekeitio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1D1D1B] dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 text-[#FFE259] dark:text-[#1D1D1B]" />
                <span>Contactar con la Tienda</span>
              </a>
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Comprar Online</span>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200 dark:border-stone-700 h-64 sm:h-80 group">
              <img
                src="/images/secciones/Tienda.JPG"
                alt="Tienda EkhiTeka Lekeitio"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 px-3 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] font-black rounded-full uppercase tracking-wider shadow-md">
                Lekeitio Centro
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
