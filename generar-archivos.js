const fs = require('fs');
const path = require('path');

const files = {
  // =========================================================================
  // 1. HELPER DE IMÁGENES CENTRALIZADO (Mapeo exacto a public/images/secciones/)
  // =========================================================================
  'lib/productHelpers.ts': `export type PublishingType = 
  | 'producto_suelto'
  | 'cesta_gourmet'
  | 'cata_casa'
  | 'tarjeta_regalo'
  | 'cata_presencial';

export interface ExtraProductMeta {
  publishingType?: PublishingType;
  includedItems?: string[];
  experienceDate?: string;
  experienceTime?: string;
  maxAttendees?: number;
  tastingItems?: string[];
  giftCardAmount?: number | string;
  boxPresentation?: string;
}

export function getCategoryImage(category?: { id?: string; slug?: string; name_es?: string } | string): string {
  if (!category) return '/images/secciones/Quesos.JPG';
  const key = (typeof category === 'string' ? category : (category.slug || category.id || category.name_es || '')).toLowerCase();

  if (key.includes('cesta') || key.includes('regalo') || key.includes('lote') || key.includes('pack')) {
    return '/images/secciones/Cestas.JPG';
  }
  if (key.includes('cata') || key.includes('experiencia') || key.includes('degustacion')) {
    return '/images/secciones/Catas.JPG';
  }
  if (key.includes('mesa') || key.includes('boda') || key.includes('evento')) {
    return '/images/secciones/Mesas.JPG';
  }
  if (key.includes('atun') || key.includes('bonito') || key.includes('hegaluze')) {
    return '/images/secciones/Bonito.JPG';
  }
  if (key.includes('salazon') || key.includes('anchoa') || key.includes('antxoa')) {
    return '/images/secciones/Salazones.JPG';
  }
  if (key.includes('gilda') || key.includes('jilda') || key.includes('encurtido') || key.includes('ozpinetako')) {
    return '/images/secciones/Gildas.JPG';
  }
  if (key.includes('txakoli') || key.includes('vino') || key.includes('ardo')) {
    return '/images/secciones/Txakoli.JPG';
  }
  if (key.includes('cerveza') || key.includes('garagardo')) {
    return '/images/secciones/Cerveza.JPG';
  }
  if (key.includes('sidra') || key.includes('sagardo')) {
    return '/images/secciones/Sidra.JPG';
  }

  return '/images/secciones/Quesos.JPG';
}

export function getProductImage(product?: {
  image_url?: string | null;
  category_id?: string;
  name?: string;
  format?: string;
}): string {
  if (!product) return '/images/secciones/Quesos.JPG';

  if (product.image_url && product.image_url.trim()) {
    return product.image_url;
  }

  const cat = (product.category_id || '').toLowerCase();
  const name = (product.name || '').toLowerCase();

  if (cat.includes('cesta') || name.includes('cesta') || name.includes('lote') || name.includes('pack') || name.includes('opari') || name.includes('regalo')) {
    return '/images/secciones/Cestas.JPG';
  }
  if (
    cat.includes('cata') ||
    cat.includes('experiencia') ||
    name.includes('cata') ||
    name.includes('dastaketa') ||
    name.includes('taller') ||
    name.includes('degustación')
  ) {
    return '/images/secciones/Catas.JPG';
  }
  if (cat.includes('tarjeta') || name.includes('tarjeta') || name.includes('mesa') || name.includes('txartel')) {
    return '/images/secciones/Mesas.JPG';
  }
  if (cat.includes('atun') || name.includes('atun') || name.includes('atún') || name.includes('bonito') || name.includes('hegaluze')) {
    return '/images/secciones/Bonito.JPG';
  }
  if (
    cat.includes('salazon') ||
    name.includes('anchoa') ||
    name.includes('antxoa') ||
    name.includes('salazón') ||
    name.includes('salazon') ||
    name.includes('gatzadura')
  ) {
    return '/images/secciones/Salazones.JPG';
  }
  if (
    cat.includes('gilda') ||
    cat.includes('jilda') ||
    name.includes('gilda') ||
    name.includes('jilda') ||
    name.includes('piparra') ||
    name.includes('encurtido')
  ) {
    return '/images/secciones/Gildas.JPG';
  }
  if (cat.includes('txakoli') || name.includes('txakoli') || name.includes('vino') || name.includes('ardo')) {
    return '/images/secciones/Txakoli.JPG';
  }
  if (cat.includes('cerveza') || name.includes('cerveza') || name.includes('garagardo')) {
    return '/images/secciones/Cerveza.JPG';
  }
  if (cat.includes('sidra') || name.includes('sidra') || name.includes('sagardo')) {
    return '/images/secciones/Sidra.JPG';
  }

  return '/images/secciones/Quesos.JPG';
}
`,

  // =========================================================================
  // 2. VENTANA OPARI GOURMETAK / REGALOS GOURMET (100% Traducida y reactiva)
  // =========================================================================
  'app/regalos-gourmet/page.tsx': `'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
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

export default function RegalosGourmetPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<ProductWithSeller[]>([]);
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role === 'vendedor' || profile?.role === 'admin') {
          setIsSeller(true);
        }
      }
      const { data } = await supabase
        .from('products')
        .select('*, profiles!products_seller_id_fkey(id, full_name, town, avatar_url, phone)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (data) {
        const filtered = (data as unknown as ProductWithSeller[]).filter((p) => {
          const cat = (p.category_id || '').toLowerCase();
          const name = (p.name || '').toLowerCase();
          const desc = (p.description || '').toLowerCase();
          return (
            cat === 'cesta' ||
            cat === 'tarjeta_regalo' ||
            cat === 'regalos_gourmet' ||
            cat === 'pack' ||
            name.includes('regalo') ||
            name.includes('opari') ||
            name.includes('cesta') ||
            name.includes('saski') ||
            name.includes('pack') ||
            name.includes('lote') ||
            name.includes('tarjeta') ||
            name.includes('txartel') ||
            desc.includes('regalo') ||
            desc.includes('cesta') ||
            desc.includes('opari')
          );
        });
        setProducts(filtered);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 1. Hero Editorial */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border-2 border-stone-800 shadow-2xl min-h-[380px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/secciones/Cestas.JPG"
            alt={t.gifts_hero_title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/40 to-black/20 dark:from-black/90 dark:via-black/75 dark:to-black/50" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4 text-white">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-black rounded-full uppercase tracking-wider shadow-md font-serif">
            <Sparkles className="w-3.5 h-3.5" /> {t.gifts_hero_badge}
          </span>

          <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight">
            {t.gifts_hero_title} <span className="text-[#FFE259]">{t.gifts_hero_title_highlight}</span>
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
            {t.gifts_hero_desc}
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
                <span>{t.gifts_whatsapp_btn}</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* 2. Tres Bloques de Experiencias de Regalo */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 font-serif">
        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between hover:border-[#FFE259] transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
              <Package className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {t.gifts_card1_title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
              {t.gifts_card1_desc}
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2 font-sans">
            <Truck className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
            <span>{t.gifts_card1_feature}</span>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between hover:border-[#FFE259] transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
              <Gift className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {t.gifts_card2_title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
              {t.gifts_card2_desc}
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2 font-sans">
            <Sparkles className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
            <span>{t.gifts_card2_feature}</span>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between hover:border-[#FFE259] transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-[#C68D07] dark:text-[#FFE259]">
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {t.gifts_card3_title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium font-sans">
              {t.gifts_card3_desc}
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2 font-sans">
            <HeartHandshake className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
            <span>{t.gifts_card3_feature}</span>
          </div>
        </div>
      </section>

      {/* 3. Catálogo de Packs y Regalos */}
      {products.length > 0 && (
        <section className="space-y-6 pt-2 font-serif">
          <div className="pb-3 border-b border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259]">
              {t.gifts_catalog_badge}
            </span>
            <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 uppercase">
              {t.gifts_catalog_title}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
`,

  // =========================================================================
  // 3. CATEGORY CIRCLE GRID (Vinculación garantizada con imágenes de secciones)
  // =========================================================================
  'components/CategoryCircleGrid.tsx': `'use client';

import { useLanguage } from '@/context/LanguageContext';
import { getCategoryImage } from '@/lib/productHelpers';
import type { Category } from '@/types/database';

interface CategoryCircleGridProps {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export function CategoryCircleGrid({
  categories,
  selectedCategory = 'all',
  onSelectCategory,
}: CategoryCircleGridProps) {
  const { t, language } = useLanguage();

  const getCategoryName = (cat: Category) => {
    if (language === 'eu') return cat.name_eu || cat.name_es;
    if (language === 'fr') return cat.name_fr || cat.name_es;
    if (language === 'en') return cat.name_en || cat.name_es;
    return cat.name_es;
  };

  const getCategorySubtitle = (cat: Category) => {
    const slug = (cat.slug || cat.id || '').toLowerCase();
    if (slug.includes('queso')) return t.sub_quesos;
    if (slug.includes('atun') || slug.includes('bonito')) return t.sub_atun;
    if (slug.includes('salazon') || slug.includes('anchoa') || slug.includes('antxoa')) return t.sub_salazones;
    if (slug.includes('gilda') || slug.includes('jilda')) return t.sub_gildas;
    if (slug.includes('cerveza') || slug.includes('garagardo')) return t.sub_cerveza;
    if (slug.includes('txakoli')) return t.sub_txakoli;
    if (slug.includes('sidra') || slug.includes('sagardo')) return t.sub_sidra;
    if (slug.includes('cesta')) return t.sub_cesta;
    if (slug.includes('cata') || slug.includes('experiencia')) return t.sub_catas;
    return t.sub_default;
  };

  return (
    <section className="space-y-6 pt-2">
      <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] block">
            {t.cat_explore}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 uppercase font-serif tracking-tight">
            {t.cat_section_title}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const imageSrc = cat.image_url && cat.image_url.trim() ? cat.image_url : getCategoryImage(cat);

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory?.(cat.id)}
              className={\`group relative p-3 sm:p-4 rounded-3xl border-2 text-center transition-all flex flex-col items-center justify-between cursor-pointer hover:scale-103 shadow-xs \${
                isSelected
                  ? 'bg-[#FFE259] border-stone-900 dark:border-white shadow-md'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-[#FFE259] dark:hover:border-[#FFE259]'
              }\`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-stone-200 dark:border-stone-700 group-hover:border-[#FFE259] mb-2 p-0.5 bg-[#FAF8F5]">
                <img
                  src={imageSrc}
                  alt={getCategoryName(cat)}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="space-y-0.5 min-w-0 w-full">
                <span className={\`block font-serif font-black text-xs sm:text-[13px] truncate leading-tight \${
                  isSelected ? 'text-[#1D1D1B]' : 'text-stone-900 dark:text-stone-100 group-hover:text-[#C68D07] dark:group-hover:text-[#FFE259]'
                }\`}>
                  {getCategoryName(cat)}
                </span>
                <span className={\`block text-[9.5px] font-sans font-bold uppercase tracking-wider truncate \${
                  isSelected ? 'text-stone-800' : 'text-stone-400 dark:text-stone-500'
                }\`}>
                  {getCategorySubtitle(cat)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
`,

  // =========================================================================
  // 4. PRODUCT CARD (Con fallback de imagen garantizado)
  // =========================================================================
  'components/ProductCard.tsx': `'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { getProductImage } from '@/lib/productHelpers';
import type { ProductWithSeller } from '@/types/database';
import { ShoppingBag, Ticket, MapPin, Eye } from 'lucide-react';

interface ProductCardProps {
  product: ProductWithSeller;
  isSeller?: boolean;
}

export function ProductCard({ product, isSeller = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const isSoldOut = !product.is_unlimited_stock && (product.stock ?? 0) <= 0;
  const isEvent =
    product.category_id === 'catas' ||
    product.category_id === 'cata_presencial' ||
    product.category_id === 'experiencia' ||
    product.name.toLowerCase().includes('cata');

  const imageUrl = getProductImage(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;
    addToCart(product, product.profiles?.full_name || 'EkhiTeka Selección');
  };

  return (
    <Link
      href={\`/producto/\${product.id}\`}
      className="manduca-card group relative bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] dark:hover:border-[#FFE259] p-4 flex flex-col justify-between shadow-xs transition-all font-serif overflow-hidden"
    >
      <div className="space-y-3">
        {/* Imagen del Producto */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          />

          {/* Badge de Evento o Stock */}
          {isSoldOut ? (
            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-md font-sans">
              {isEvent ? t.event_capacity_full : t.prod_sold_out}
            </span>
          ) : !product.is_unlimited_stock && (product.stock ?? 0) <= 5 ? (
            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-amber-500 text-stone-900 text-[10px] font-black uppercase tracking-wider rounded-full shadow-md font-sans">
              {isEvent ? t.event_last_seats : t.prod_last_units}
            </span>
          ) : null}
        </div>

        {/* Datos del Producto */}
        <div className="space-y-1">
          {product.origin_region && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 flex items-center gap-1 font-sans truncate">
              <MapPin className="w-3 h-3 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
              {product.origin_region}
            </span>
          )}

          <h3 className="font-serif font-black text-sm sm:text-base text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-[#C68D07] dark:group-hover:text-[#FFE259] transition-colors">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 font-sans font-medium">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Precio y Botón */}
      <div className="pt-3 mt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
        <div>
          <span className="font-serif font-black text-base sm:text-lg text-stone-900 dark:text-stone-100 block leading-none">
            {Number(product.price).toFixed(2)} €
          </span>
          <span className="text-[9.5px] font-sans font-semibold text-stone-400">
            {isEvent ? t.prod_price_per_seat : t.prod_vat_included}
          </span>
        </div>

        {!isSeller ? (
          <button
            type="button"
            disabled={isSoldOut}
            onClick={handleAddToCart}
            className={\`p-2.5 rounded-xl font-bold transition-all flex items-center justify-center cursor-pointer \${
              isSoldOut
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                : 'bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] shadow-xs hover:scale-105'
            }\`}
            title={isEvent ? t.event_reserve_seat : t.prod_add_to_cart}
          >
            {isEvent ? <Ticket className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        ) : (
          <span className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500">
            <Eye className="w-4 h-4" />
          </span>
        )}
      </div>
    </Link>
  );
}
`,
};

// Generación en disco
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trimStart(), 'utf8');
  console.log(`✓ Actualizado: ${filePath}`);
});

console.log('\n🎉 ¡Imágenes conectadas e internacionalización de Opari Gourmetak completada!');