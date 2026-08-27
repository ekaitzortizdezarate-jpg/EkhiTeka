'use client';

import React from 'react';
import {
  Package,
  Calendar,
  Clock,
  Users,
  Wine,
  CreditCard,
  Sparkles,
  MapPin,
  Check,
} from 'lucide-react';
import { formatProductDescription } from '@/lib/productHelpers';

interface ProductDescriptionProps {
  description?: string | null;
  language?: string;
  className?: string;
  isCompact?: boolean;
}

export function ProductDescription({
  description,
  language = 'es',
  className = '',
  isCompact = false,
}: ProductDescriptionProps) {
  if (!description) return null;

  const formatted = formatProductDescription(description, language);
  const lines = formatted.split('\n').map((l) => l.trim()).filter(Boolean);

  if (lines.length === 0) return null;

  const getLineIcon = (line: string) => {
    const l = line.toLowerCase().trim();

    // 1. Pack / Cesta / Lote / Selección / Items included
    if (
      l.includes('incluidos en la cesta') ||
      l.includes('saskiak dakarrena') ||
      l.includes('lote gourmet') ||
      l.includes('gourmet loteak') ||
      l.includes('coffret gourmet') ||
      l.includes('gourmet set') ||
      l.includes('pack de cata') ||
      l.includes('dastaketa pack') ||
      l.includes('tasting pack') ||
      l.includes('productos incluidos') ||
      l.includes('sartutako produktuak') ||
      l.includes('contenido de la cesta') ||
      l.includes('contenido del lote') ||
      l.includes('cesta') ||
      l.includes('lote') ||
      l.includes('pack')
    ) {
      return <Package className="w-4 h-4 text-stone-700 dark:text-stone-300 stroke-[1.75] shrink-0 mt-0.5" />;
    }

    // 2. Fecha / Data / Date
    if (l.startsWith('data:') || l.startsWith('fecha:') || l.startsWith('date:')) {
      return <Calendar className="w-4 h-4 text-stone-700 dark:text-stone-300 stroke-[1.75] shrink-0 mt-0.5" />;
    }

    // 3. Horario / Ordutegia / Schedule
    if (
      l.startsWith('ordutegia:') ||
      l.startsWith('horario:') ||
      l.startsWith('horaires:') ||
      l.startsWith('schedule:') ||
      l.startsWith('ordua:') ||
      l.startsWith('hora:')
    ) {
      return <Clock className="w-4 h-4 text-stone-700 dark:text-stone-300 stroke-[1.75] shrink-0 mt-0.5" />;
    }

    // 4. Plazas / Aforo / Seats
    if (
      l.startsWith('leku') ||
      l.startsWith('plaza') ||
      l.startsWith('seat') ||
      l.startsWith('place') ||
      l.startsWith('aforo')
    ) {
      return <Users className="w-4 h-4 text-stone-700 dark:text-stone-300 stroke-[1.75] shrink-0 mt-0.5" />;
    }

    // 5. Tarjeta Regalo / Gift Card
    if (
      l.includes('tarjeta') ||
      l.includes('txartel') ||
      l.includes('carte cadeau') ||
      l.includes('gift card')
    ) {
      return <CreditCard className="w-4 h-4 text-stone-700 dark:text-stone-300 stroke-[1.75] shrink-0 mt-0.5" />;
    }

    // 6. Catas / Degustación
    if (
      l.includes('dastaketa') ||
      l.includes('cata') ||
      l.includes('dégustation') ||
      l.includes('tasting') ||
      l.includes('degustar') ||
      l.includes('maridaje')
    ) {
      return <Wine className="w-4 h-4 text-stone-700 dark:text-stone-300 stroke-[1.75] shrink-0 mt-0.5" />;
    }

    // 7. Lugar / Ubicación
    if (l.startsWith('lekua:') || l.startsWith('lugar:') || l.startsWith('lieu:') || l.startsWith('location:')) {
      return <MapPin className="w-4 h-4 text-stone-700 dark:text-stone-300 stroke-[1.75] shrink-0 mt-0.5" />;
    }

    // 8. Opciones / Canje
    if (
      l.startsWith('opciones') ||
      l.startsWith('aukera') ||
      l.startsWith('options') ||
      l.includes('canjeable') ||
      l.includes('validez') ||
      l.includes('baliozkotasuna')
    ) {
      return <Sparkles className="w-4 h-4 text-stone-700 dark:text-stone-300 stroke-[1.75] shrink-0 mt-0.5" />;
    }

    // 9. Items
    if (line.startsWith('•') || line.startsWith('-')) {
      return <Check className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 stroke-[1.75] shrink-0 mt-1" />;
    }

    return null;
  };

  if (isCompact) {
    return (
      <div className={`space-y-1 font-serif ${className}`}>
        {lines.slice(0, 3).map((line, idx) => {
          const icon = getLineIcon(line);
          const cleanLine = line.replace(/^[•\-]\s*/, '').trim();
          return (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-stone-600 dark:text-stone-300 truncate">
              {icon}
              <span className="truncate">{cleanLine}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`space-y-2.5 font-serif ${className}`}>
      {lines.map((line, idx) => {
        const icon = getLineIcon(line);
        const isHeader =
          line.endsWith(':') ||
          line.toUpperCase() === line ||
          line.includes('INCLUYE') ||
          line.includes('DAKARRENA') ||
          line.includes('COMPREND') ||
          line.includes('INCLUDES');

        const cleanLine = line.replace(/^[•\-]\s*/, '').trim();

        return (
          <div
            key={idx}
            className={`flex items-start gap-2.5 text-xs sm:text-[13px] leading-relaxed ${
              isHeader
                ? 'font-bold text-stone-900 dark:text-stone-100 pt-1 tracking-wide'
                : 'text-stone-700 dark:text-stone-300 font-normal pl-0.5'
            }`}
          >
            {icon}
            <span className="break-words">{cleanLine}</span>
          </div>
        );
      })}
    </div>
  );
}
