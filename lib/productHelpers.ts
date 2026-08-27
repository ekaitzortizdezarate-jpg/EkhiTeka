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

export function formatProductDescription(
  description?: string | null,
  language: string = 'es'
): string {
  if (!description) return '';
  const clean = description.replace(/<!-- META:{.*?} -->/g, '').trim();
  if (!clean) return '';

  const lines = clean.split('\n');
  const formattedLines = lines.map((line) => {
    let l = line.trim();

    // Clean emojis for clean Maisons du Monde aesthetic
    l = l.replace(/^[📦🧀📅🕒📍👥💳🏠✨🎉🍷⭐👉✔]\s*/u, '');

    // 1. Cestas & Packs - Included items header
    if (/^(Productos incluidos en esta selección|Productos incluidos|Contenido de la cesta|Contenido del lote|Hautaketa honetan sartutako produktuak|Products included in this selection|Produits inclus dans cette sélection)\s*:?/i.test(l)) {
      if (language === 'eu') return 'Hautaketa honetan sartutako produktuak:';
      if (language === 'fr') return 'Produits inclus dans cette sélection :';
      if (language === 'en') return 'Products included in this selection:';
      return 'Productos incluidos en esta selección:';
    }

    // 2. Catas en Casa
    if (/^(Kit de cata en casa|Kit de cata para disfrutar en casa|Etxeko dastaketa kit-a|Home tasting kit|Kit de dégustation à domicile)\s*:?/i.test(l)) {
      if (language === 'eu') return 'Etxeko dastaketa kit-a:';
      if (language === 'fr') return 'Kit de dégustation à domicile :';
      if (language === 'en') return 'Home tasting kit:';
      return 'Kit de cata en casa:';
    }
    if (/^(Incluye guía de cata y maridaje|Guía de cata y maridaje|Dastaketa eta uztarketa gida barne|Includes tasting and pairing guide|Guide de dégustation et accords inclus)\s*:?/i.test(l)) {
      if (language === 'eu') return 'Dastaketa eta uztarketa gida barne';
      if (language === 'fr') return 'Guide de dégustation et accords inclus';
      if (language === 'en') return 'Includes tasting and pairing guide';
      return 'Incluye guía de cata y maridaje';
    }
    if (/^(Personas recomendadas|Comensales recomendados|Gomendatutako lagun kopurua|Recommended people|Nombre de personnes recommandé)\s*:\s*/i.test(l)) {
      const rest = l.replace(/^(Personas recomendadas|Comensales recomendados|Gomendatutako lagun kopurua|Recommended people|Nombre de personnes recommandé)\s*:\s*/i, '');
      if (language === 'eu') return `Gomendatutako pertsonak: ${rest}`;
      if (language === 'fr') return `Nombre de personnes recommandé : ${rest}`;
      if (language === 'en') return `Recommended people: ${rest}`;
      return `Personas recomendadas: ${rest}`;
    }

    // 3. Catas Presenciales / en Tienda
    if (/^(Fecha|Data|Date)\s*:\s*/i.test(l)) {
      const rest = l.replace(/^(Fecha|Data|Date)\s*:\s*/i, '');
      if (language === 'eu') return `Data: ${rest}`;
      if (language === 'fr') return `Date : ${rest}`;
      if (language === 'en') return `Date: ${rest}`;
      return `Fecha: ${rest}`;
    }
    if (/^(Hora|Ordua|Time|Heure)\s*:\s*/i.test(l)) {
      const rest = l.replace(/^(Hora|Ordua|Time|Heure)\s*:\s*/i, '');
      if (language === 'eu') return `Ordua: ${rest}`;
      if (language === 'fr') return `Heure : ${rest}`;
      if (language === 'en') return `Time: ${rest}`;
      return `Hora: ${rest}`;
    }
    if (/^(Plazas disponibles|Plazas|Aforo|Leku libreak|Lekuak|Available seats|Seats|Places disponibles|Places)\s*:\s*/i.test(l)) {
      const rest = l.replace(/^(Plazas disponibles|Plazas|Aforo|Leku libreak|Lekuak|Available seats|Seats|Places disponibles|Places)\s*:\s*/i, '');
      if (language === 'eu') return `Leku libreak: ${rest}`;
      if (language === 'fr') return `Places disponibles : ${rest}`;
      if (language === 'en') return `Available seats: ${rest}`;
      return `Plazas disponibles: ${rest}`;
    }
    if (/^(Productos a degustar|Productos a probar|Quesos a probar|Dastatzeko produktuak|Dastatuko diren gaztak|Dastatuko diren produktuak|Products to taste|Cheeses to taste|Produits à déguster|Fromages à déguster)\s*:\s*/i.test(l)) {
      const rest = l.replace(/^(Productos a degustar|Productos a probar|Quesos a probar|Dastatzeko produktuak|Dastatuko diren gaztak|Dastatuko diren produktuak|Products to taste|Cheeses to taste|Produits à déguster|Fromages à déguster)\s*:\s*/i, '');
      if (language === 'eu') return `Dastatuko diren produktuak: ${rest}`;
      if (language === 'fr') return `Produits à déguster : ${rest}`;
      if (language === 'en') return `Products to taste: ${rest}`;
      return `Productos a degustar: ${rest}`;
    }
    if (/^(Lugar|Ubicación|Tokia|Lekua|Lieu|Location)\s*:\s*/i.test(l)) {
      const rest = l.replace(/^(Lugar|Ubicación|Tokia|Lekua|Lieu|Location)\s*:\s*/i, '');
      if (language === 'eu') return `Lekua: ${rest}`;
      if (language === 'fr') return `Lieu : ${rest}`;
      if (language === 'en') return `Location: ${rest}`;
      return `Lugar: ${rest}`;
    }
    if (/^(Duración|Iraupena|Duration|Durée)\s*:\s*/i.test(l)) {
      const rest = l.replace(/^(Duración|Iraupena|Duration|Durée)\s*:\s*/i, '');
      if (language === 'eu') return `Iraupena: ${rest}`;
      if (language === 'fr') return `Durée : ${rest}`;
      if (language === 'en') return `Duration: ${rest}`;
      return `Duración: ${rest}`;
    }

    // 4. Tarjeta Regalo
    if (/^(Saldo|Importe|Importe de la tarjeta|Saldo \/ Importe tarjeta|Txartelaren saldoa|Card balance|Gift card amount|Solde de la carte|Montant)\s*:\s*/i.test(l)) {
      const rest = l.replace(/^(Saldo|Importe|Importe de la tarjeta|Saldo \/ Importe tarjeta|Txartelaren saldoa|Card balance|Gift card amount|Solde de la carte|Montant)\s*:\s*/i, '');
      if (language === 'eu') return `Txartelaren saldoa: ${rest}`;
      if (language === 'fr') return `Solde de la carte : ${rest}`;
      if (language === 'en') return `Gift card amount: ${rest}`;
      return `Saldo de la tarjeta: ${rest}`;
    }
    if (/^(Validez|Caducidad|Iraungipena|Validity|Validité)\s*:\s*/i.test(l)) {
      const rest = l.replace(/^(Validez|Caducidad|Iraungipena|Validity|Validité)\s*:\s*/i, '');
      if (language === 'eu') return `Baliozkotasuna: ${rest}`;
      if (language === 'fr') return `Validité : ${rest}`;
      if (language === 'en') return `Validity: ${rest}`;
      return `Validez: ${rest}`;
    }
    if (/^(Canjeable en tienda física y pedidos online|Canjeable en tienda y online|Dendan eta online erabilgarria|Redeemable in-store and online|Utilisable en boutique et en ligne)/i.test(l)) {
      if (language === 'eu') return 'Dendan eta online erabilgarria';
      if (language === 'fr') return 'Utilisable en boutique et en ligne';
      if (language === 'en') return 'Redeemable in-store and online';
      return 'Canjeable en tienda física y online';
    }

    return line;
  });

  return formattedLines.join('\n');
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
  return formatProductDescription(description, 'es');
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
