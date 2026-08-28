'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { Profile, StoreAddress, EventAddress, WhatsAppContact, SiteImageMeta } from '@/types/database';
import { parseProfile } from '@/types/database';

interface StoreConfigContextType {
  hasActiveWhatsApp: boolean;
  whatsappPhone: string | null;
  activeWhatsAppContact: WhatsAppContact | null;
  mainStoreAddress: StoreAddress | null;
  storeAddress: string;
  storeSchedule: string;
  pickupAddresses: StoreAddress[];
  activePickupAddresses: StoreAddress[];
  eventAddresses: EventAddress[];
  activeEventAddresses: EventAddress[];
  getWhatsAppUrl: (message?: string) => string;
  siteImages: Record<string, string>;
  siteImagesMeta: Record<string, SiteImageMeta>;
  getSiteImage: (key: string, defaultPath: string) => string;
  getSiteImageMeta: (key: string) => SiteImageMeta | null;
}

const StoreConfigContext = createContext<StoreConfigContextType | undefined>(undefined);

export function StoreConfigProvider({
  children,
  initialSellerProfile,
}: {
  children: React.ReactNode;
  initialSellerProfile?: Profile | null;
}) {
  const seller = useMemo(() => parseProfile(initialSellerProfile), [initialSellerProfile]);

  const siteImages = useMemo(() => (seller as any).site_images || {}, [seller]);
  const siteImagesMeta = useMemo(() => (seller as any).site_images_meta || {}, [seller]);

  const getSiteImage = useMemo(() => {
    return (key: string, defaultPath: string) => {
      return siteImages[key] || defaultPath;
    };
  }, [siteImages]);

  const getSiteImageMeta = useMemo(() => {
    return (key: string) => {
      return siteImagesMeta[key] || null;
    };
  }, [siteImagesMeta]);

  const activeWhatsAppContact = useMemo(() => {
    const contacts = seller.whatsapp_contacts || [];
    const active = contacts.find((c) => c.is_active && c.phone && c.phone.trim().length > 0);
    if (active) return active;
    if (seller.whatsapp_phone && seller.whatsapp_phone.trim().length > 0) {
      return {
        id: 'default',
        name: seller.full_name || 'EkhiTeka',
        phone: seller.whatsapp_phone,
        is_active: true,
      };
    }
    return null;
  }, [seller]);

  const hasActiveWhatsApp = Boolean(activeWhatsAppContact && activeWhatsAppContact.phone && activeWhatsAppContact.phone.trim().length > 0);

  const whatsappPhone = useMemo(() => {
    if (!activeWhatsAppContact) return null;
    return activeWhatsAppContact.phone.replace(/[^0-9]/g, '');
  }, [activeWhatsAppContact]);

  const pickupAddresses = useMemo(() => seller.pickup_addresses || [], [seller]);
  const activePickupAddresses = useMemo(() => pickupAddresses.filter((a) => a.is_active), [pickupAddresses]);

  const eventAddresses = useMemo(() => seller.event_addresses || [], [seller]);
  const activeEventAddresses = useMemo(() => eventAddresses.filter((a) => a.is_active), [eventAddresses]);

  // Tienda Principal: La que tenga is_main === true y esté activa, o la primera activa
  const mainStoreAddress = useMemo(() => {
    const main = pickupAddresses.find((a) => a.is_main && a.is_active);
    if (main) return main;
    const firstActive = activePickupAddresses[0];
    if (firstActive) return firstActive;
    return pickupAddresses[0] || null;
  }, [pickupAddresses, activePickupAddresses]);

  const storeAddress = useMemo(() => {
    if (mainStoreAddress) {
      return `${mainStoreAddress.street}${mainStoreAddress.number ? ' ' + mainStoreAddress.number : ''}, ${mainStoreAddress.town}${mainStoreAddress.province ? ' · ' + mainStoreAddress.province : ''}`;
    }
    return 'Gamarra Kalea 4, Lekeitio · Bizkaia';
  }, [mainStoreAddress]);

  const storeSchedule = useMemo(() => {
    if (mainStoreAddress?.schedule && mainStoreAddress.schedule.trim().length > 0) {
      return mainStoreAddress.schedule;
    }
    if (mainStoreAddress?.schedule_details) {
      const d = mainStoreAddress.schedule_details;
      const parts: string[] = [];
      if (d.weekday_morning_enabled && d.weekday_morning_start && d.weekday_morning_end) {
        parts.push(`${d.weekday_morning_start} - ${d.weekday_morning_end}`);
      }
      if (d.weekday_afternoon_enabled && d.weekday_afternoon_start && d.weekday_afternoon_end) {
        parts.push(`${d.weekday_afternoon_start} - ${d.weekday_afternoon_end}`);
      }
      if (parts.length > 0) {
        return parts.join(' / ');
      }
    }
    return 'Lunes a Sábado: 10:00 - 14:00 / 17:30 - 20:30';
  }, [mainStoreAddress]);

  const getWhatsAppUrl = useMemo(() => {
    return (message?: string) => {
      if (!hasActiveWhatsApp || !whatsappPhone) return '';
      const cleanNumber = whatsappPhone.startsWith('34') || whatsappPhone.length > 10 ? whatsappPhone : `34${whatsappPhone}`;
      const encodedMsg = message ? encodeURIComponent(message) : '';
      return `https://wa.me/${cleanNumber}${encodedMsg ? '?text=' + encodedMsg : ''}`;
    };
  }, [hasActiveWhatsApp, whatsappPhone]);

  return (
    <StoreConfigContext.Provider
      value={{
        hasActiveWhatsApp,
        whatsappPhone,
        activeWhatsAppContact,
        mainStoreAddress,
        storeAddress,
        storeSchedule,
        pickupAddresses,
        activePickupAddresses,
        eventAddresses,
        activeEventAddresses,
        getWhatsAppUrl,
        siteImages,
        siteImagesMeta,
        getSiteImage,
        getSiteImageMeta,
      }}
    >
      {children}
    </StoreConfigContext.Provider>
  );
}

export function useStoreConfig() {
  const context = useContext(StoreConfigContext);
  if (!context) {
    return {
      hasActiveWhatsApp: false,
      whatsappPhone: null,
      activeWhatsAppContact: null,
      mainStoreAddress: null,
      storeAddress: 'Gamarra Kalea 4, Lekeitio · Bizkaia',
      storeSchedule: 'Lunes a Sábado: 10:00 - 14:00 / 17:30 - 20:30',
      pickupAddresses: [],
      activePickupAddresses: [],
      eventAddresses: [],
      activeEventAddresses: [],
      getWhatsAppUrl: () => '',
      siteImages: {},
      siteImagesMeta: {},
      getSiteImage: (_key: string, defaultPath: string) => defaultPath,
      getSiteImageMeta: (_key: string) => null,
    };
  }
  return context;
}
