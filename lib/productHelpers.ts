export type PublishingType = 
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

export function getProductImage(product?: {
  image_url?: string | null;
  category_id?: string;
  name?: string;
  format?: string;
}): string {
  if (!product) return '/images/secciones/Quesos.JPG';

  // If a valid uploaded or local image exists
  if (product.image_url && product.image_url.trim()) {
    return product.image_url;
  }

  const cat = (product.category_id || '').toLowerCase();
  const name = (product.name || '').toLowerCase();

  if (cat === 'cesta' || name.includes('cesta') || name.includes('lote') || name.includes('pack')) {
    return '/images/secciones/Cestas.JPG';
  }
  if (
    cat === 'experiencia' ||
    cat === 'cata_presencial' ||
    cat === 'cata_casa' ||
    name.includes('cata') ||
    name.includes('taller') ||
    name.includes('degustación')
  ) {
    return '/images/secciones/Catas.JPG';
  }
  if (cat === 'tarjeta_regalo' || name.includes('tarjeta') || name.includes('regalo')) {
    return '/images/secciones/Mesas.JPG';
  }
  if (cat === 'atun' || name.includes('atun') || name.includes('atún') || name.includes('bonito')) {
    return '/images/secciones/Bonito.JPG';
  }
  if (
    cat === 'salazon' ||
    name.includes('anchoa') ||
    name.includes('antxoa') ||
    name.includes('salazón') ||
    name.includes('salazon')
  ) {
    return '/images/secciones/Salazones.JPG';
  }
  if (
    cat === 'jildas' ||
    name.includes('gilda') ||
    name.includes('jilda') ||
    name.includes('piparra') ||
    name.includes('encurtido')
  ) {
    return '/images/secciones/Gildas.JPG';
  }
  if (cat === 'txakoli' || name.includes('txakoli') || name.includes('vino')) {
    return '/images/secciones/Txakoli.JPG';
  }
  if (cat === 'cerveza' || name.includes('cerveza') || name.includes('garagardo')) {
    return '/images/secciones/Cerveza.JPG';
  }
  if (cat === 'sidra' || name.includes('sidra') || name.includes('sagardo')) {
    return '/images/secciones/Sidra.JPG';
  }

  return '/images/secciones/Quesos.JPG';
}
