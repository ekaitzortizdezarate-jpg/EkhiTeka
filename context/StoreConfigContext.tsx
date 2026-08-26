'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { Profile, PickupAddress } from '@/types/database';
import { parseProfile } from '@/types/database';

interface StoreConfigContextType {
  whatsappPhone: string;
  storeAddress: string;
  activePickupAddress: PickupAddress | null;
  pickupAddresses: PickupAddress[];
  getWhatsAppUrl: (message?: string) => string;
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

  const whatsappPhone = useMemo(() => {
    const raw = seller.whatsapp_phone || seller.phone || '34600000000';
    return raw.replace(/[^0-9]/g, '');
  }, [seller]);

  const activePickupAddress = useMemo(() => {
    const addresses = seller.pickup_addresses || [];
    return addresses.find((a) => a.is_active) || addresses[0] || null;
  }, [seller]);

  const storeAddress = useMemo(() => {
    if (activePickupAddress) {
      return `${activePickupAddress.street}${activePickupAddress.number ? ` ${activePickupAddress.number}` : ''}, ${activePickupAddress.town} · ${activePickupAddress.province}`;
    }
    return 'Gamarra Kalea 4, Lekeitio · Bizkaia';
  }, [activePickupAddress]);

  const getWhatsAppUrl = useMemo(() => {
    return (message?: string) => {
      const cleanNumber = whatsappPhone.startsWith('34') || whatsappPhone.length > 10 ? whatsappPhone : `34${whatsappPhone}`;
      const encodedMsg = message ? encodeURIComponent(message) : '';
      return `https://wa.me/${cleanNumber}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
    };
  }, [whatsappPhone]);

  return (
    <StoreConfigContext.Provider
      value={{
        whatsappPhone,
        storeAddress,
        activePickupAddress,
        pickupAddresses: seller.pickup_addresses || [],
        getWhatsAppUrl,
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
      whatsappPhone: '34600000000',
      storeAddress: 'Gamarra Kalea 4, Lekeitio · Bizkaia',
      activePickupAddress: null,
      pickupAddresses: [],
      getWhatsAppUrl: (message?: string) => `https://wa.me/34600000000${message ? `?text=${encodeURIComponent(message)}` : ''}`,
    };
  }
  return context;
}
