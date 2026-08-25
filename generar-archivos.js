const fs = require('fs');
const path = require('path');

const files = {
  // 1. REGALOS GOURMET
  'app/regalos-gourmet/page.tsx': `import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/ProductCard';
import type { ProductWithSeller } from '@/types/database';
import {
  Gift,
  Sparkles,
  Package,
  CreditCard,
  MessageCircle,
  Truck,
  HeartHandshake,
} from 'lucide-react';

export const revalidate = 0;

export default async function RegalosGourmetPage() {
  const supabase = await createClient();

  const [{ data: { user } }, productsRes] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('products')
      .select('*, profiles!products_seller_id_fkey(id, full_name, town, avatar_url, phone)')
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
  ]);

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

  const allProducts = (productsRes.data || []) as unknown as ProductWithSeller[];

  // Filtrar productos relacionados con regalos, cestas, packs y tarjetas
  const giftProducts = allProducts.filter((p) => {
    const cat = (p.category_id || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();

    return (
      cat === 'cesta' ||
      cat === 'tarjeta_regalo' ||
      cat === 'regalos_gourmet' ||
      cat === 'pack' ||
      name.includes('regalo') ||
      name.includes('cesta') ||
      name.includes('pack') ||
      name.includes('lote') ||
      name.includes('tarjeta') ||
      desc.includes('regalo') ||
      desc.includes('cesta')
    );
  });

  return (
    <div className="space-y-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 1. Hero Editorial Regalos Gourmet */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border-2 border-stone-800 shadow-2xl min-h-[380px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/secciones/Regalos.JPG"
            alt="Regalos Gourmet EkhiTeka"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/30 to-black/10 dark:from-black/90 dark:via-black/75 dark:to-black/50" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4 text-white">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-black rounded-full uppercase tracking-wider shadow-md">
            <Sparkles className="w-3.5 h-3.5" /> Selección Exclusiva para Regalar
          </span>

          <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight">
            Regalos <span className="text-[#FFE259]">Gourmet</span>
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
            Sorprende con cestas artesanales a medida, estuches de quesos afinados, maridajes de autor y tarjetas regalo para ocasiones inolvidables.
          </p>

          {!isSeller && (
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="https://wa.me/34600000000?text=Hola,%20quisiera%20encargar%20un%20regalo%20gourmet%20personalizado"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 font-serif"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Encargo Personalizado por WhatsApp</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* 2. Tres Bloques de Experiencias de Regalo */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cestas a Medida */}
        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between hover:border-[#FFE259] transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
              <Package className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
              Cestas Gourmet a Medida
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              Diseñamos cestas artesanales combinando cuñas afinadas, conservas selectas del Cantábrico, txakoli y dulces vascos según tu presupuesto.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
            <span>Envío refrigerado con tarjeta dedicatoria</span>
          </div>
        </div>

        {/* Packs Degustación */}
        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between hover:border-[#FFE259] transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
              <Gift className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
              Packs Degustación & Maridaje
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              Estuches temáticos preparados para abrir y disfrutar: selecciones de quesos por intensidad con confituras artesanas, nueces y picos gourmet.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
            <span>Presentación en caja prémium de madera</span>
          </div>
        </div>

        {/* Tarjetas Regalo */}
        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between hover:border-[#FFE259] transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
              Tarjetas & Catas de Regalo
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              El obsequio perfecto para que elijan sus quesos preferidos o disfruten de una cata guiada presencial en nuestra quesería de Lekeitio.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
            <span>Válido online y en tienda física</span>
          </div>
        </div>
      </section>

      {/* 3. Catálogo de Packs y Regalos Disponibles */}
      {giftProducts.length > 0 && (
        <section className="space-y-6 pt-2">
          <div className="pb-3 border-b border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259]">
              Disponibles para envío o recogida
            </span>
            <h3 className="text-2xl font-black font-serif text-stone-900 dark:text-stone-100 uppercase">
              Cestas & Packs Listos para Regalar
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {giftProducts.map((product) => (
              <ProductCard key={product.id} product={product} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
`,

  // 2. REGALOS DE EMPRESA
  'app/regalos-empresa/page.tsx': `import { createClient } from '@/lib/supabase/server';
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
`,

  // 3. FICHA DETALLE DE PRODUCTO
  'app/producto/[id]/page.tsx': `import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailAddToCart } from '@/components/ProductDetailAddToCart';
import { getProductImage } from '@/lib/productHelpers';
import type { ProductWithSeller } from '@/types/database';
import {
  ArrowLeft,
  MapPin,
  Truck,
  Store,
  ShieldCheck,
  MessageCircle,
  Ticket,
} from 'lucide-react';

export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: { user } }, { data: product }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('products')
      .select('*, profiles!products_seller_id_fkey(id, full_name, town, avatar_url, phone, role)')
      .eq('id', id)
      .single(),
  ]);

  if (!product) notFound();

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

  // Obtener productos relacionados de la misma categoría
  const { data: relatedData } = await supabase
    .from('products')
    .select('*, profiles!products_seller_id_fkey(id, full_name, town, avatar_url, phone)')
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .eq('is_active', true)
    .limit(4);

  const relatedProducts = (relatedData || []) as unknown as ProductWithSeller[];

  const isEvent =
    product.category_id === 'catas' ||
    product.category_id === 'cata_presencial' ||
    product.category_id === 'experiencia' ||
    product.name.toLowerCase().includes('cata');

  const imageUrl = getProductImage(product);

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Botón Volver */}
      <div>
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 text-xs font-bold font-serif uppercase tracking-wider text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100 transition-colors p-2 rounded-xl bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la selección</span>
        </Link>
      </div>

      {/* Grid Principal del Producto */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Imagen Prémium */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 sm:aspect-square w-full rounded-3xl overflow-hidden border-2 border-stone-200 dark:border-stone-800 bg-[#FAF7F2] dark:bg-stone-850 shadow-lg">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.origin_region && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/80 backdrop-blur-xs text-white text-xs font-black rounded-xl uppercase tracking-wider shadow-md">
                <MapPin className="w-3.5 h-3.5 text-[#FFE259]" />
                <span>{product.origin_region}</span>
              </span>
            )}
            {isEvent && (
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-black rounded-xl uppercase tracking-wider shadow-md">
                <Ticket className="w-3.5 h-3.5" />
                <span>{product.stock} plazas disponibles</span>
              </span>
            )}
          </div>
        </div>

        {/* Información & Checkout */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2 border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259]">
              EkhiTeka Gourmet · Lekeitio
            </span>
            <h1 className="text-2xl sm:text-4xl font-black font-serif text-stone-900 dark:text-stone-100 leading-tight">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold text-stone-500 dark:text-stone-400">
              {product.format && (
                <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  Formato: {product.format}
                </span>
              )}
              {product.weight_g && (
                <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  Peso: {product.weight_g}g
                </span>
              )}
            </div>
          </div>

          {/* Precio y Componente de Compra/Reserva */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black font-serif text-[#1D1D1B] dark:text-stone-100">
                {Number(product.price).toFixed(2)} €
              </span>
              <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                {isEvent ? '/ plaza' : 'IVA incl.'}
              </span>
            </div>

            <ProductDetailAddToCart
              product={product as unknown as ProductWithSeller}
              isSeller={isSeller}
            />
          </div>

          {/* Descripción & Notas de Cata */}
          {product.description && (
            <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <h3 className="text-xs font-black uppercase tracking-wider font-serif text-stone-800 dark:text-stone-200">
                Descripción & Detalles
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Asesoramiento por Chat */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-stone-850 border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-bold font-serif text-stone-900 dark:text-stone-100">
                ¿Tienes alguna duda sobre este producto?
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Consulta directamente con nuestros afinadores y expertos.
              </p>
            </div>
            <Link
              href={\`/chat/\${product.seller_id}?product_id=\${product.id}\`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-white dark:text-stone-900 text-xs font-black uppercase tracking-wider transition-all font-serif shrink-0 shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Preguntar</span>
            </Link>
          </div>

          {/* Garantías de Entrega */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-bold text-stone-600 dark:text-stone-400">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <Truck className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
              <span>Frío garantizado 24/48h</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <Store className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
              <span>Recogida en Lekeitio</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <ShieldCheck className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
              <span>Calidad artesanal km0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-stone-200 dark:border-stone-800">
          <div className="pb-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259]">
              Recomendaciones del afinador
            </span>
            <h3 className="text-2xl font-black font-serif text-stone-900 dark:text-stone-100 uppercase">
              También te puede interesar
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
`,

  // 4. COMPONENTE AÑADIR A CESTA / RESERVA CON CONTROL DE AFORO
  'components/ProductDetailAddToCart.tsx': `'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import type { ProductWithSeller } from '@/types/database';
import { ShoppingBag, Check, Pencil, Ticket } from 'lucide-react';

interface ProductDetailAddToCartProps {
  product: ProductWithSeller;
  isSeller?: boolean;
}

export function ProductDetailAddToCart({
  product,
  isSeller = false,
}: ProductDetailAddToCartProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isSoldOut = !product.is_unlimited_stock && (product.stock ?? 0) <= 0;
  const maxStock = product.is_unlimited_stock ? 99 : Math.max(0, product.stock ?? 0);
  const isEvent =
    product.category_id === 'catas' ||
    product.category_id === 'cata_presencial' ||
    product.category_id === 'experiencia' ||
    product.name.toLowerCase().includes('cata');

  const handleAdd = () => {
    if (isSoldOut || quantity <= 0) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product, 'EkhiTeka Selección');
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isSeller) {
    return (
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3">
        <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
          Modo Vendedor: Estás previsualizando la ficha de este producto.
        </p>
        <Link
          href={\`/vendedor/productos/\${product.id}/editar\`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all shadow-xs font-serif"
        >
          <Pencil className="w-4 h-4" />
          <span>Editar variables del producto</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-serif">
      <div className="flex items-center gap-3">
        {/* Selector de cantidad */}
        {!isSoldOut && (
          <div className="flex items-center rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 p-1">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-700 dark:text-stone-200 font-bold hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-30 cursor-pointer"
            >
              -
            </button>
            <span className="w-10 text-center text-xs font-black text-stone-900 dark:text-stone-100">
              {quantity}
            </span>
            <button
              type="button"
              disabled={quantity >= maxStock}
              onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-700 dark:text-stone-200 font-bold hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-30 cursor-pointer"
            >
              +
            </button>
          </div>
        )}

        {/* Botón Principal */}
        <button
          type="button"
          disabled={isSoldOut}
          onClick={handleAdd}
          className={\`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer \${
            isSoldOut
              ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed shadow-none'
              : added
              ? 'bg-emerald-700 text-white'
              : 'bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] hover:scale-102 hover:shadow-lg'
          }\`}
        >
          {isSoldOut ? (
            <span>{isEvent ? t.event_capacity_full : t.prod_sold_out}</span>
          ) : added ? (
            <>
              <Check className="w-5 h-5" />
              <span>{isEvent ? t.event_seats_added : t.prod_added}</span>
            </>
          ) : (
            <>
              {isEvent ? <Ticket className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
              <span>{isEvent ? t.event_reserve_seat : t.prod_add_to_cart}</span>
            </>
          )}
        </button>
      </div>

      {/* Aviso de stock / plazas restantes */}
      {!isSoldOut && product.stock !== null && product.stock <= 5 && !product.is_unlimited_stock && (
        <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
          {isEvent ? \`¡Atención! Solo quedan \${product.stock} plazas disponibles.\` : \`¡Últimas \${product.stock} unidades en stock!\`}
        </p>
      )}
    </div>
  );
}
`
};

console.log('📦 Escribiendo archivos de la Fase 3 en EkhiTeka...');

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim(), 'utf8');
  console.log(`✅ Creado / Actualizado: ${filePath}`);
});

console.log('\n🎉 ¡Bloque 3 aplicado correctamente!');