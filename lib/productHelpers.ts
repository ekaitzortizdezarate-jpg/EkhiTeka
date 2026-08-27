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

  // Clean all unicode emojis anywhere in the text for clean Maisons du Monde aesthetic
  let normalized = clean.replace(/[\p{Extended_Pictographic}\uFE0F\u200D\u20E3]/gu, ' ').trim();

  // Split concatenated tokens onto separate lines for clean rendering
  normalized = normalized.replace(/\s+(HORARIO|Horario|ORDUTEGIA|Ordutegia|HORA|Hora|TIME|Time|HEURE|Heure|SCHEDULE|Schedule)\s*:\s*/gi, '\nHorario: ');
  normalized = normalized.replace(/\s+(PLAZAS DISPONIBLES|Plazas disponibles|PLAZAS|Plazas|AFORO|Aforo|LEKU LIBREAK|Leku libreak|AVAILABLE SEATS|Available seats|PLACES DISPONIBLES|Places disponibles)\s*:\s*/gi, '\nPlazas disponibles: ');
  normalized = normalized.replace(/\s+(OPCIONES CANJEABLES|Opciones canjeables|AUKERA ERABILGARRIAK|Aukera erabilgarriak|OPTIONS ÉCHANGEABLES|Options échangeables|REDEEMABLE OPTIONS|Redeemable options)\s*:\s*/gi, '\nOpciones canjeables: ');

  const rawLines = normalized.split('\n');
  const formattedLines = rawLines.map((line) => {
    let l = line.trim();
    if (!l) return '';

    // 1. Cestas Gourmet - Header translations
    if (/^(PRODUCTOS INCLUIDOS EN LA CESTA|PRODUCTOS INCLUIDOS EN ESTA CESTA|LA CESTA INCLUYE|ESTA CESTA INCLUYE|CESTA GOURMET INCLUYE|CONTENIDO DE LA CESTA|SASKIAK DAKARRENA|PRODUCTS INCLUDED IN THE HAMPER|PRODUITS INCLUS DANS LE PANIER)\s*:?/i.test(l)) {
      if (language === 'eu') return 'SASKIAK DAKARRENA:';
      if (language === 'fr') return 'PRODUITS INCLUS DANS LE PANIER :';
      if (language === 'en') return 'PRODUCTS INCLUDED IN THE HAMPER:';
      return 'PRODUCTOS INCLUIDOS EN LA CESTA:';
    }

    // 2. Lote Gourmet - Header translations
    if (/^(LOTE GOURMET (INCLUYE)?|EL LOTE GOURMET INCLUYE|LOTE DE PRODUCTOS INCLUYE|ESTE LOTE INCLUYE|CONTENIDO DEL LOTE|CONTENIDO DEL LOTE GOURMET|PRODUCTOS INCLUIDOS EN ESTE LOTE|GOURMET LOTEAK DAKARRENA|LE COFFRET GOURMET COMPREND|GOURMET SET INCLUDES)\s*:?/i.test(l)) {
      if (language === 'eu') return 'GOURMET LOTEAK DAKARRENA:';
      if (language === 'fr') return 'LE COFFRET GOURMET COMPREND :';
      if (language === 'en') return 'GOURMET SET INCLUDES:';
      return 'EL LOTE GOURMET INCLUYE:';
    }

    // 3. Pack de Cata & Selección General - Header translations
    if (/^(PACK DE CATA (EN CASA )?INCLUYE|EL PACK DE CATA INCLUYE|PACK DE CATA|EL PACK INCLUYE|ESTE PACK INCLUYE|DASTAKETA PACK-AK DAKARRENA|TASTING PACK INCLUDES|LE PACK DE DÉGUSTATION COMPREND|PRODUCTOS INCLUIDOS EN ESTA SELECCI[OÓ]N|PRODUCTOS INCLUIDOS|HAUTAKETA HONETAN SARTUTAKO PRODUKTUAK|PRODUCTS INCLUDED IN THIS SELECTION|PRODUITS INCLUS DANS CETTE SÉLECTION)\s*:?/i.test(l)) {
      if (language === 'eu') return 'DASTAKETA PACK-AK DAKARRENA:';
      if (language === 'fr') return 'LE PACK DE DÉGUSTATION COMPREND :';
      if (language === 'en') return 'TASTING PACK INCLUDES:';
      return 'EL PACK DE CATA INCLUYE:';
    }

    // 2. Catas en Casa - Sections
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

    // 3. Tarjeta Regalo - Header & Options
    if (/^(TARJETA REGALO VIRTUAL|Tarjeta Regalo Virtual|TARJETA REGALO|Tarjeta Regalo|OPARI TXARTEL BIRTUALA|Opari Txartel Birtuala|VIRTUAL GIFT CARD|Virtual Gift Card|CARTE CADEAU VIRTUELLE|Carte Cadeau Virtuelle)\s*:\s*/i.test(l)) {
      const rest = l.replace(/^(TARJETA REGALO VIRTUAL|Tarjeta Regalo Virtual|TARJETA REGALO|Tarjeta Regalo|OPARI TXARTEL BIRTUALA|Opari Txartel Birtuala|VIRTUAL GIFT CARD|Virtual Gift Card|CARTE CADEAU VIRTUELLE|Carte Cadeau Virtuelle)\s*:\s*/i, '');
      let header = 'TARJETA REGALO VIRTUAL:';
      if (language === 'eu') header = 'OPARI TXARTEL BIRTUALA:';
      if (language === 'fr') header = 'CARTE CADEAU VIRTUELLE :';
      if (language === 'en') header = 'VIRTUAL GIFT CARD:';
      l = rest ? `${header} ${rest}` : header;
    }

    // Replace Tarjeta Regalo Options inline
    l = l.replace(/(Opciones canjeables|Aukera erabilgarriak|Options échangeables|Redeemable options)\s*:\s*/gi, () => {
      if (language === 'eu') return 'Aukera erabilgarriak: ';
      if (language === 'fr') return 'Options échangeables : ';
      if (language === 'en') return 'Redeemable options: ';
      return 'Opciones canjeables: ';
    });

    l = l.replace(/(o Canjeable por Cata Presencial|edo Dastaketa Presentzialagatik trukagarria|edo Dastaketa Presentzialarengatik trukatu daiteke|ou Échangeable contre une Dégustation en Boutique|ou Échangeable contre une Dégustation Présentielle|or Redeemable for In-Person Tasting)/gi, () => {
      if (language === 'eu') return 'edo Dastaketa Presentzialagatik trukagarria';
      if (language === 'fr') return 'ou Échangeable contre une Dégustation en Boutique';
      if (language === 'en') return 'or Redeemable for In-Person Tasting';
      return 'o Canjeable por Cata Presencial';
    });

    l = l.replace(/(o Canjeable por Cata en Casa|edo Etxeko Dastaketagatik trukagarria|ou Échangeable contre une Dégustation à Domicile|or Redeemable for Home Tasting)/gi, () => {
      if (language === 'eu') return 'edo Etxeko Dastaketagatik trukagarria';
      if (language === 'fr') return 'ou Échangeable contre une Dégustation à Domicile';
      if (language === 'en') return 'or Redeemable for Home Tasting';
      return 'o Canjeable por Cata en Casa';
    });

    l = l.replace(/(Canjeable en tienda física y pedidos online|Canjeable en tienda y online|Dendan eta online erabilgarria|Redeemable in-store and online|Utilisable en boutique et en ligne)/gi, () => {
      if (language === 'eu') return 'Dendan eta online erabilgarria';
      if (language === 'fr') return 'Utilisable en boutique et en ligne';
      if (language === 'en') return 'Redeemable in-store and online';
      return 'Canjeable en tienda física y online';
    });

    // Replace "MODALIDAD: Canjeable por productos EkhiTeka..."
    l = l.replace(/(MODALIDAD|Modalidad)\s*:\s*Canjeable por productos(\s+EkhiTeka(\s+Gourmet)?)?(\.\.\.|\.)?/gi, () => {
      if (language === 'eu') return 'Produktuekin trukagarria';
      if (language === 'fr') return 'Échangeable contre des produits';
      if (language === 'en') return 'Redeemable for products';
      return 'Canjeable por productos';
    });

    l = l.replace(/^Canjeable por productos(\s+EkhiTeka(\s+Gourmet)?)?(\.\.\.|\.)?/gi, () => {
      if (language === 'eu') return 'Produktuekin trukagarria';
      if (language === 'fr') return 'Échangeable contre des produits';
      if (language === 'en') return 'Redeemable for products';
      return 'Canjeable por productos';
    });

    // 4. Catas Presenciales / Events - Inline Tokens
    l = l.replace(/\b(FECHA|Fecha|DATA|Data|DATE|Date)\s*:\s*/g, () => {
      if (language === 'eu') return 'Data: ';
      if (language === 'fr') return 'Date : ';
      if (language === 'en') return 'Date: ';
      return 'Fecha: ';
    });

    l = l.replace(/\b(HORARIO|Horario|HORA|Hora|ORDUTEGIA|Ordutegia|ORDUA|Ordua|TIME|Time|HEURE|Heure|SCHEDULE|Schedule)\s*:\s*/g, () => {
      if (language === 'eu') return 'Ordutegia: ';
      if (language === 'fr') return 'Horaires : ';
      if (language === 'en') return 'Schedule: ';
      return 'Horario: ';
    });

    l = l.replace(/\b(PLAZAS DISPONIBLES|Plazas disponibles|PLAZAS|Plazas|AFORO|Aforo|LEKU LIBREAK|Leku libreak|LEKUAK|Lekuak|AVAILABLE SEATS|Available seats|SEATS|Seats|PLACES DISPONIBLES|Places disponibles)\s*:\s*/g, () => {
      if (language === 'eu') return 'Leku libreak: ';
      if (language === 'fr') return 'Places disponibles : ';
      if (language === 'en') return 'Available seats: ';
      return 'Plazas disponibles: ';
    });

    l = l.replace(/\b(PRODUCTOS A DEGUSTAR|Productos a degustar|PRODUCTOS A PROBAR|Productos a probar|QUESOS A PROBAR|Quesos a probar|DASTATUKO DIREN PRODUKTUAK|Dastatuko diren produktuak|DASTATZEKO PRODUKTUAK|Dastatzeko produktuak|PRODUCTS TO TASTE|Products to taste|PRODUITS À DÉGUSTER|Produits à déguster)\s*:\s*/g, () => {
      if (language === 'eu') return 'Dastatuko diren produktuak: ';
      if (language === 'fr') return 'Produits à déguster : ';
      if (language === 'en') return 'Products to taste: ';
      return 'Productos a degustar: ';
    });

    l = l.replace(/\b(LUGAR|Lugar|UBICACIÓN|Ubicación|TOKIA|Tokia|LEKUA|Lekua|LIEU|Lieu|LOCATION|Location)\s*:\s*/g, () => {
      if (language === 'eu') return 'Lekua: ';
      if (language === 'fr') return 'Lieu : ';
      if (language === 'en') return 'Location: ';
      return 'Lugar: ';
    });

    l = l.replace(/\b(DURACIÓN|Duración|IRAUPENA|Iraupena|DURATION|Duration|DURÉE|Durée)\s*:\s*/g, () => {
      if (language === 'eu') return 'Iraupena: ';
      if (language === 'fr') return 'Durée : ';
      if (language === 'en') return 'Duration: ';
      return 'Duración: ';
    });

    // 5. Item list modifier tags
    l = l.replace(/\((Tienda|Denda|Dendan|Boutique|En boutique|Store|In store)\)/gi, () => {
      if (language === 'eu') return '(Dendan)';
      if (language === 'fr') return '(En boutique)';
      if (language === 'en') return '(In store)';
      return '(Tienda)';
    });

    l = l.replace(/\((Para casa|En casa|Casa|Etxerako|À domicile|Domicile|For home|Home)\)/gi, () => {
      if (language === 'eu') return '(Etxerako)';
      if (language === 'fr') return '(À domicile)';
      if (language === 'en') return '(For home)';
      return '(Para casa)';
    });

    // Item name translations
    l = l.replace(/Cesta Degustaci[oó]n Gourmet Lekeitio/gi, () => {
      if (language === 'eu') return 'Lekeitioko Gourmet Dastaketa Saskia';
      if (language === 'fr') return 'Panier Dégustation Gourmet Lekeitio';
      if (language === 'en') return 'Lekeitio Gourmet Tasting Hamper';
      return 'Cesta Degustación Gourmet Lekeitio';
    });

    l = l.replace(/Lote Degustaci[oó]n Gourmet Lekeitio/gi, () => {
      if (language === 'eu') return 'Lekeitioko Gourmet Dastaketa Lotea';
      if (language === 'fr') return 'Coffret Dégustation Gourmet Lekeitio';
      if (language === 'en') return 'Lekeitio Gourmet Tasting Set';
      return 'Lote Degustación Gourmet Lekeitio';
    });

    return l;
  });

  return formattedLines.filter(Boolean).join('\n');
}

export function getGiftCardDescription(
  description?: string | null,
  language: string = 'es'
): string {
  if (!description) return '';
  const formatted = formatProductDescription(description, language);
  const cleaned = formatted
    .replace(/^(OPARI TXARTEL BIRTUALA:|TARJETA REGALO VIRTUAL:|CARTE CADEAU VIRTUELLE :|VIRTUAL GIFT CARD:)\s*/i, '')
    .trim();
  return cleaned;
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
