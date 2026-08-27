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

export function getTranslatedFormat(format?: string | null, language: string = 'es'): string {
  if (!format) return '';
  const f = format.toLowerCase().trim();

  if (f === 'unidad' || f === 'unit' || f === 'pieza' || f === 'unitatea' || f === 'piece' || f === 'ud') {
    if (language === 'eu') return 'Unitatea';
    if (language === 'fr') return 'Unité';
    if (language === 'en') return 'Unit';
    return 'Unidad';
  }
  if (f === 'peso_kg' || f === 'peso' || f === 'kg' || f === 'cuña' || f === 'por peso' || f === 'al corte') {
    if (language === 'eu') return 'Pisuan (kg)';
    if (language === 'fr') return 'Au poids (kg)';
    if (language === 'en') return 'By weight (kg)';
    return 'Al corte (kg)';
  }
  if (f === 'pack' || f === 'lote' || f === 'cesta' || f === 'saski' || f === 'pack / cesta' || f === 'pack / saskia') {
    if (language === 'eu') return 'Pack';
    if (language === 'fr') return 'Pack';
    if (language === 'en') return 'Pack';
    return 'Pack';
  }
  if (f === 'botella' || f === 'bottle' || f === 'bouteille' || f === 'botila') {
    if (language === 'eu') return 'Botila';
    if (language === 'fr') return 'Bouteille';
    if (language === 'en') return 'Bottle';
    return 'Botella';
  }
  if (f === 'lata' || f === 'can' || f === 'boîte' || f === 'boite') {
    if (language === 'eu') return 'Lata';
    if (language === 'fr') return 'Boîte';
    if (language === 'en') return 'Can';
    return 'Lata';
  }
  if (f === 'tarro' || f === 'jar' || f === 'bocal' || f === 'potoa' || f === 'frasco' || f === 'bote') {
    if (language === 'eu') return 'Potoa';
    if (language === 'fr') return 'Bocal';
    if (language === 'en') return 'Jar';
    return 'Tarro';
  }

  return format;
}

export function getTranslatedOrigin(origin?: string | null, language: string = 'es'): string {
  if (!origin) return '';
  const o = origin.toLowerCase().trim();

  if (o.includes('país vasco') || o.includes('pais vasco') || o.includes('euskal herria') || o.includes('basque country') || o.includes('pays basque')) {
    if (language === 'eu') return 'Euskal Herria';
    if (language === 'fr') return 'Pays Basque';
    if (language === 'en') return 'Basque Country';
    return 'País Vasco';
  }
  if (o.includes('navarra') || o.includes('nafarroa') || o.includes('navarre')) {
    if (language === 'eu') return 'Nafarroa';
    if (language === 'fr' || language === 'en') return 'Navarre';
    return 'Navarra';
  }
  if (o.includes('bizkaia') || o.includes('vizcaya') || o.includes('biscay')) {
    if (language === 'eu' || language === 'es') return 'Bizkaia';
    if (language === 'fr') return 'Biscaye';
    if (language === 'en') return 'Biscay';
    return 'Bizkaia';
  }
  if (o.includes('gipuzkoa') || o.includes('guipúzcoa') || o.includes('guipuzcoa')) {
    if (language === 'eu' || language === 'es') return 'Gipuzkoa';
    if (language === 'fr') return 'Guipuscoa';
    if (language === 'en') return 'Gipuzkoa';
    return 'Gipuzkoa';
  }
  if (o.includes('araba') || o.includes('álava') || o.includes('alava')) {
    if (language === 'eu') return 'Araba';
    if (language === 'es') return 'Álava';
    return 'Alava';
  }

  return origin;
}

export function getUnitsSuffix(language: string = 'es', isPlural: boolean = true): string {
  if (language === 'eu') return isPlural ? 'unitate' : 'unitate';
  if (language === 'fr') return isPlural ? 'unités' : 'unité';
  if (language === 'en') return isPlural ? 'units' : 'unit';
  return isPlural ? 'uds' : 'ud';
}

export function getSeatsSuffix(language: string = 'es', isPlural: boolean = true): string {
  if (language === 'eu') return 'leku';
  if (language === 'fr') return isPlural ? 'places' : 'place';
  if (language === 'en') return isPlural ? 'seats' : 'seat';
  return isPlural ? 'plazas' : 'plaza';
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
