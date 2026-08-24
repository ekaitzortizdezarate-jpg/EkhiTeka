'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Truck, Store, Sparkles, Heart, ShieldCheck } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t-2 border-stone-200 dark:border-stone-800 bg-stone-900 text-stone-300 transition-colors pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 1. Valores Gourmet (La Manducateca style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-stone-800 text-center md:text-left">
          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 text-xl border border-amber-500/30">
              🧀
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white">{t.cat_queso} & Selección de Autor</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Quesos afinados, salazones del cantábrico y conservas artesanales seleccionadas una a una.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Truck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white">{t.deliv_home}</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Cadena de frío garantizada 24/48 horas para que cada producto llegue en su punto óptimo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Store className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white">{t.deliv_store_pickup}</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Haz tu pedido online y recógelo preparado sin esperas en nuestro local de Bilbao.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Enlaces & Categorías */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <h4 className="font-black text-white uppercase tracking-wider text-[11px]">Categorías</h4>
            <ul className="space-y-2 text-stone-400 font-semibold">
              <li><Link href="/categoria/queso" className="hover:text-amber-400 transition-colors">{t.cat_queso}</Link></li>
              <li><Link href="/categoria/atun" className="hover:text-amber-400 transition-colors">{t.cat_atun}</Link></li>
              <li><Link href="/categoria/salazon" className="hover:text-amber-400 transition-colors">{t.cat_salazon}</Link></li>
              <li><Link href="/categoria/jildas" className="hover:text-amber-400 transition-colors">{t.cat_jildas}</Link></li>
              <li><Link href="/categoria/cerveza" className="hover:text-amber-400 transition-colors">{t.cat_cerveza}</Link></li>
              <li><Link href="/categoria/txakoli" className="hover:text-amber-400 transition-colors">{t.cat_txakoli}</Link></li>
              <li><Link href="/categoria/sidra" className="hover:text-amber-400 transition-colors">{t.cat_sidra}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-white uppercase tracking-wider text-[11px]">Atención & Pedidos</h4>
            <ul className="space-y-2 text-stone-400 font-semibold">
              <li><Link href="/cesta" className="hover:text-amber-400 transition-colors">{t.nav_cart}</Link></li>
              <li><Link href="/chat" className="hover:text-amber-400 transition-colors">{t.nav_chats}</Link></li>
              <li><Link href="/login" className="hover:text-amber-400 transition-colors">{t.nav_login}</Link></li>
              <li><Link href="/register" className="hover:text-amber-400 transition-colors">{t.nav_register}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-white uppercase tracking-wider text-[11px]">Información Legal</h4>
            <ul className="space-y-2 text-stone-400 font-semibold">
              <li><Link href="/terminos" className="hover:text-amber-400 transition-colors">{t.legal_terms}</Link></li>
              <li><Link href="/privacidad" className="hover:text-amber-400 transition-colors">{t.legal_privacy}</Link></li>
              <li><Link href="/cookies" className="hover:text-amber-400 transition-colors">{t.legal_cookies}</Link></li>
              <li><Link href="/aviso-legal" className="hover:text-amber-400 transition-colors">{t.legal_notice}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-white uppercase tracking-wider text-[11px]">EkhiTeka Gourmet</h4>
            <p className="text-stone-400 leading-relaxed">
              Gran Vía 14, Bilbao · Bizkaia
            </p>
            <p className="text-stone-400">
              Tel: +34 944 000 123
            </p>
            <p className="text-stone-400">
              info@ekhiteka.com
            </p>
          </div>
        </div>

        {/* 3. Copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-xs">
          <p>© {new Date().getFullYear()} EkhiTeka Gourmet S.L. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            <span>Inspiración artesana & calidad km0</span>
            <span>·</span>
            <span>Bilbao</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
