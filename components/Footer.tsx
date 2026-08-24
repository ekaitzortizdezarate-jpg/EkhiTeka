'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Truck, Store, Sparkles, Heart, ShieldCheck } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-[#1D1D1B] text-stone-300 transition-colors pt-0 pb-8">
      {/* 1. Banner Destacado Amarillo La Manducateca: Novedades & WhatsApp */}
      <div className="bg-[#FFE259] text-[#1D1D1B] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[11px] font-black uppercase tracking-widest block text-stone-800">
              Club de Amigos del Buen Queso
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight font-serif sm:font-sans">
              ¿Quieres estar al día de las novedades de EkhiTeka?
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-stone-800 max-w-xl">
              Nuevas llegadas de quesos de temporada, catas exclusivas en Bilbao y lotes limitados antes que nadie.
            </p>
          </div>

          <a
            href="https://wa.me/34600000000?text=Hola,%20quisiera%20unirme%20a%20las%20novedades%20de%20EkhiTeka"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1D1D1B] text-white hover:bg-stone-800 font-black text-xs uppercase tracking-wider transition-all shadow-md shrink-0 hover:scale-105"
          >
            <span>Unirme por WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pt-12">
        {/* 2. Valores Gourmet & Garantías */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-stone-800 text-center md:text-left">
          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE259]/15 text-[#FFE259] flex items-center justify-center shrink-0 text-xl border border-[#FFE259]/30">
              🧀
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-white">{t.cat_queso} & Selección de Autor</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-medium">
                Quesos afinados, salazones del cantábrico y conservas artesanales seleccionadas una a una.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE259]/15 text-[#FFE259] flex items-center justify-center shrink-0 border border-[#FFE259]/30">
              <Truck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-white">{t.deliv_home}</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-medium">
                Cadena de frío garantizada 24/48 horas para que cada producto llegue en su punto óptimo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE259]/15 text-[#FFE259] flex items-center justify-center shrink-0 border border-[#FFE259]/30">
              <Store className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-white">{t.deliv_store_pickup}</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-medium">
                Haz tu pedido online y recógelo preparado sin esperas en nuestra quesería de Bilbao.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Enlaces & Categorías */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <h4 className="font-black text-white uppercase tracking-wider text-[11px]">Categorías</h4>
            <ul className="space-y-2 text-stone-400 font-semibold">
              <li><Link href="/categoria/queso" className="hover:text-[#FFE259] transition-colors">{t.cat_queso}</Link></li>
              <li><Link href="/categoria/salazon" className="hover:text-[#FFE259] transition-colors">{t.cat_salazon}</Link></li>
              <li><Link href="/categoria/atun" className="hover:text-[#FFE259] transition-colors">{t.cat_atun}</Link></li>
              <li><Link href="/categoria/jildas" className="hover:text-[#FFE259] transition-colors">{t.cat_jildas}</Link></li>
              <li><Link href="/categoria/txakoli" className="hover:text-[#FFE259] transition-colors">{t.cat_txakoli}</Link></li>
              <li><Link href="/categoria/cerveza" className="hover:text-[#FFE259] transition-colors">{t.cat_cerveza}</Link></li>
              <li><Link href="/categoria/sidra" className="hover:text-[#FFE259] transition-colors">{t.cat_sidra}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-white uppercase tracking-wider text-[11px]">Experiencias</h4>
            <ul className="space-y-2 text-stone-400 font-semibold">
              <li><Link href="/#experiencias" className="hover:text-[#FFE259] transition-colors">Catas Presenciales Bilbao</Link></li>
              <li><Link href="/#experiencias" className="hover:text-[#FFE259] transition-colors">Mesas de Queso para Bodas</Link></li>
              <li><Link href="/#experiencias" className="hover:text-[#FFE259] transition-colors">Cestas y Regalos Gourmet</Link></li>
              <li><Link href="/chat" className="hover:text-[#FFE259] transition-colors">Consultas con el Maestro Quesero</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-white uppercase tracking-wider text-[11px]">Información Legal</h4>
            <ul className="space-y-2 text-stone-400 font-semibold">
              <li><Link href="/terminos" className="hover:text-[#FFE259] transition-colors">{t.legal_terms}</Link></li>
              <li><Link href="/privacidad" className="hover:text-[#FFE259] transition-colors">{t.legal_privacy}</Link></li>
              <li><Link href="/cookies" className="hover:text-[#FFE259] transition-colors">{t.legal_cookies}</Link></li>
              <li><Link href="/aviso-legal" className="hover:text-[#FFE259] transition-colors">{t.legal_notice}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/Logo.jpg"
                alt="EkhiTeka"
                className="w-10 h-10 rounded-full object-cover border border-[#FFE259]"
              />
              <h4 className="font-black text-white uppercase tracking-wider text-[12px]">EkhiTeka Bilbao</h4>
            </div>
            <p className="text-stone-400 leading-relaxed font-medium">
              Gran Vía 14, Bilbao · Bizkaia
            </p>
            <div className="text-stone-400 font-medium space-y-0.5">
              <p className="font-bold text-stone-300">Horario de Tienda:</p>
              <p>Lunes a Viernes: 10:00 - 14:30 | 17:00 - 20:30</p>
              <p>Sábados: 10:30 - 15:00</p>
            </div>
            <p className="text-stone-400 font-bold">
              WhatsApp: +34 600 000 000
            </p>
          </div>
        </div>

        {/* 4. Copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-xs font-medium">
          <p>© {new Date().getFullYear()} EkhiTeka Gourmet S.L. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            <span>Inspiración artesana & afinado km0</span>
            <span>·</span>
            <span>Bilbao</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
