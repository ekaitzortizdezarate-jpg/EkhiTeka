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

export function getProductDiscount(product?: { description?: string | null }): { discountPercent: number; originalPrice?: number } | null {
  if (!product?.description) return null;
  const match = product.description.match(/<!-- META:({.*?}) -->/);
  if (match && match[1]) {
    try {
      const meta = JSON.parse(match[1]);
      if (meta.discount_percent && Number(meta.discount_percent) > 0) {
        return {
          discountPercent: Math.round(Number(meta.discount_percent)),
          originalPrice: meta.original_price ? Number(meta.original_price) : undefined,
        };
      }
    } catch {
      // Ignore
    }
  }
  return null;
}

export function getCleanDescription(description?: string | null): string {
  if (!description) return '';
  return description.replace(/<!-- META:{.*?} -->/g, '').trim();
}

export function formatEventDescription(
  description?: string | null,
  labels?: {
    date?: string;
    time?: string;
    seats?: string;
    itemsToTaste?: string;
  }
): string {
  if (!description) return '';
  const clean = description.replace(/<!-- META:{.*?} -->/g, '').trim();
  if (!labels) return clean;

  const lines = clean.split('\n');
  const formattedLines = lines.map((line) => {
    // Match date prefix
    if (labels.date && /^\s*(Fecha|Data|Date)\s*:\s*/i.test(line)) {
      return line.replace(/^\s*(Fecha|Data|Date)\s*:\s*/i, `${labels.date} `);
    }
    // Match time prefix
    if (labels.time && /^\s*(Hora|Ordua|Time|Heure)\s*:\s*/i.test(line)) {
      return line.replace(/^\s*(Hora|Ordua|Time|Heure)\s*:\s*/i, `${labels.time} `);
    }
    // Match seats prefix
    if (
      labels.seats &&
      /^\s*(Plazas disponibles|Plazas|Aforo|Leku libreak|Lekuak|Available seats|Seats|Places disponibles|Places)\s*:\s*/i.test(
        line
      )
    ) {
      return line.replace(
        /^\s*(Plazas disponibles|Plazas|Aforo|Leku libreak|Lekuak|Available seats|Seats|Places disponibles|Places)\s*:\s*/i,
        `${labels.seats} `
      );
    }
    // Match items to taste prefix
    if (
      labels.itemsToTaste &&
      /^\s*(Productos a degustar|Productos a probar|Quesos a probar|Dastatzeko produktuak|Dastatuko diren gaztak|Products to taste|Cheeses to taste|Produits à déguster|Fromages à déguster)\s*:\s*/i.test(
        line
      )
    ) {
      return line.replace(
        /^\s*(Productos a degustar|Productos a probar|Quesos a probar|Dastatzeko produktuak|Dastatuko diren gaztak|Products to taste|Cheeses to taste|Produits à déguster|Fromages à déguster)\s*:\s*/i,
        `${labels.itemsToTaste} `
      );
    }
    return line;
  });

  return formattedLines.join('\n');
}

export function getCategoryImage(category?: { id?: string; slug?: string; name_es?: string } | string): string {
  if (!category) return '/images/secciones/Quesos.JPG';
  const key = (typeof category === 'string' ? category : (category.slug || category.id || category.name_es || '')).toLowerCase();

  if (key.includes('cesta') || key.includes('regalo') || key.includes('lote') || key.includes('pack') || key.includes('saski')) {
    return '/images/secciones/Cestas.JPG';
  }
  if (key.includes('cata') || key.includes('experiencia') || key.includes('dastaketa') || key.includes('degustacion')) {
    return '/images/secciones/Catas.JPG';
  }
  if (key.includes('mesa') || key.includes('boda') || key.includes('ezkontza') || key.includes('evento')) {
    return '/images/secciones/Mesas.JPG';
  }
  if (key.includes('atun') || key.includes('bonito') || key.includes('hegaluze')) {
    return '/images/secciones/Bonito.JPG';
  }
  if (key.includes('salazon') || key.includes('anchoa') || key.includes('antxoa') || key.includes('gatzadura')) {
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
} | null): string {
  if (!product) return '/images/secciones/Quesos.JPG';

  if (product.image_url && product.image_url.trim()) {
    return product.image_url;
  }

  const cat = (product.category_id || '').toLowerCase();
  const name = (product.name || '').toLowerCase();

  if (cat.includes('cesta') || name.includes('cesta') || name.includes('lote') || name.includes('pack') || name.includes('opari') || name.includes('saski') || name.includes('regalo')) {
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
