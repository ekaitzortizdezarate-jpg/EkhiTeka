'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { Profile, StoreAddress, EventAddress, WhatsAppContact, SiteImageMeta } from '@/types/database';
import { parseProfile } from '@/types/database';

interface StoreConfigContextType {
  hasActiveWhatsApp: boolean;
  whatsappPhone: string | null;
  activeWhatsAppContact: WhatsAppContact | null;
  storeAddress: string;
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
    return contacts.find((c) => c.is_active) || null;
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

  const storeAddress = useMemo(() => {
    const firstActive = activePickupAddresses[0];
    if (firstActive) {
      return `${firstActive.street}${firstActive.number ? ' ' + firstActive.number : ''}, ${firstActive.town} · ${firstActive.province}`;
    }
    return 'Gamarra Kalea 4, Lekeitio · Bizkaia';
  }, [activePickupAddresses]);

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
        storeAddress,
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
      storeAddress: 'Gamarra Kalea 4, Lekeitio · Bizkaia',
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
