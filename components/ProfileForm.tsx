'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { updateProfile, changeUserPassword, updateStoreConfig, updateDeliveryAddresses } from '@/app/actions/auth';
import { SiteImagesManager } from '@/components/SiteImagesManager';
import type { Profile, WhatsAppContact, StoreAddress, StoreScheduleDetails, EventAddress, DeliveryAddress } from '@/types/database';
import { parseProfile, isProfileComplete } from '@/types/database';
import {
  User,
  Phone,
  Lock,
  Check,
  Home,
  Pencil,
  Plus,
  Trash2,
  ChevronDown,
  MessageCircle,
  Store,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Power,
  X,
  ArrowLeft,
  Truck,
  Star,
  Clock,
} from 'lucide-react';

interface SellerOption {
  id: string;
  full_name: string;
  phone: string;
}

interface ProfileFormProps {
  profile?: Profile;
  userProfile?: Profile;
  storeProfile?: Profile;
  sellers?: SellerOption[];
}

export function ProfileForm({ profile, userProfile, storeProfile, sellers = [] }: ProfileFormProps) {
  const rawUser = userProfile || profile || ({} as Profile);
  const rawStore = storeProfile || profile || userProfile || ({} as Profile);
  const { t, language } = useLanguage();

  const [currentProfile, setCurrentProfile] = useState<Profile>(parseProfile(rawUser));
  const parsedStore = parseProfile(rawStore);
  const isSeller = currentProfile.role === 'vendedor' || currentProfile.role === 'admin';

  // Pestañas
  const [activeTab, setActiveTab] = useState<'usuario' | 'tienda'>('usuario');

  // Sección Usuario
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [userMsg, setUserMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Direcciones de Entrega Comprador
  const [deliveryAddresses, setDeliveryAddresses] = useState<DeliveryAddress[]>(currentProfile.delivery_addresses || []);
  const [modalDeliveryAddr, setModalDeliveryAddr] = useState<{ open: boolean; addr: DeliveryAddress | null }>({ open: false, addr: null });
  const [loadingDeliveryAddr, setLoadingDeliveryAddr] = useState(false);

  // Helper to ensure exactly one main store address if pickupAddresses is not empty
  const ensureOneMainPickup = (list: StoreAddress[]): StoreAddress[] => {
    if (list.length === 0) return list;
    if (list.length === 1) {
      return [{ ...list[0], is_main: true }];
    }
    const hasMain = list.some((a) => a.is_main);
    if (!hasMain) {
      const activeIdx = list.findIndex((a) => a.is_active);
      const targetIdx = activeIdx >= 0 ? activeIdx : 0;
      return list.map((a, idx) => ({ ...a, is_main: idx === targetIdx }));
    }
    let foundMain = false;
    return list.map((a) => {
      if (a.is_main && !foundMain) {
        foundMain = true;
        return a;
      }
      return { ...a, is_main: false };
    });
  };

  // Helper para construir la cadena legible de horario a partir de parámetros individuales
  const buildScheduleString = (
    days: string[],
    wmEn: boolean,
    wmStart: string,
    wmEnd: string,
    waEn: boolean,
    waStart: string,
    waEnd: string,
    weMEn: boolean,
    weMStart: string,
    weMEnd: string,
    weAEn: boolean,
    weAStart: string,
    weAEnd: string,
    lang: string
  ): string => {
    const dayLabelsMap: Record<string, { es: string; eu: string; en: string; fr: string }> = {
      lun: { es: 'Lun', eu: 'Al', en: 'Mon', fr: 'Lun' },
      mar: { es: 'Mar', eu: 'Ar', en: 'Tue', fr: 'Mar' },
      mie: { es: 'Mié', eu: 'Az', en: 'Wed', fr: 'Mer' },
      jue: { es: 'Jue', eu: 'Og', en: 'Thu', fr: 'Jeu' },
      vie: { es: 'Vie', eu: 'Or', en: 'Fri', fr: 'Ven' },
      sab: { es: 'Sáb', eu: 'Lr', en: 'Sat', fr: 'Sam' },
      dom: { es: 'Dom', eu: 'Ig', en: 'Sun', fr: 'Dim' },
    };

    const weekdaysList = ['lun', 'mar', 'mie', 'jue', 'vie'];
    const weekendList = ['sab', 'dom'];

    const selectedWeekdays = days.filter((d) => weekdaysList.includes(d));
    const selectedWeekend = days.filter((d) => weekendList.includes(d));

    const formatShifts = (mEn: boolean, mStart: string, mEnd: string, aEn: boolean, aStart: string, aEnd: string) => {
      const parts: string[] = [];
      if (mEn && mStart && mEnd) parts.push(`${mStart} - ${mEnd}`);
      if (aEn && aStart && aEnd) parts.push(`${aStart} - ${aEnd}`);
      return parts.join(' | ');
    };

    const weekdayShifts = formatShifts(wmEn, wmStart, wmEnd, waEn, waStart, waEnd);
    const weekendShifts = formatShifts(weMEn, weMStart, weMEnd, weAEn, weAStart, weAEnd);

    const getDaysLabel = (list: string[]) => {
      if (list.length === 0) return '';
      if (list.length === 5 && weekdaysList.every((d) => list.includes(d))) {
        return lang === 'eu' ? 'Al-Or' : lang === 'en' ? 'Mon-Fri' : lang === 'fr' ? 'Lun-Ven' : 'Lun-Vie';
      }
      if (list.length === 7) {
        return lang === 'eu' ? 'Al-Ig' : lang === 'en' ? 'Mon-Sun' : lang === 'fr' ? 'Lun-Dim' : 'Lun-Dom';
      }
      if (list.length === 2 && list.includes('sab') && list.includes('dom')) {
        return lang === 'eu' ? 'Lr-Ig' : lang === 'en' ? 'Sat-Sun' : lang === 'fr' ? 'Sam-Dim' : 'Sáb-Dom';
      }
      return list.map((d) => dayLabelsMap[d]?.[lang as 'es'] || d).join(', ');
    };

    if (
      selectedWeekdays.length > 0 &&
      selectedWeekend.length > 0 &&
      weekdayShifts === weekendShifts &&
      weekdayShifts.length > 0
    ) {
      if (days.length === 6 && !days.includes('dom')) {
        const daysStr = lang === 'eu' ? 'Al-Lr' : lang === 'en' ? 'Mon-Sat' : lang === 'fr' ? 'Lun-Sam' : 'Lun-Sáb';
        return `${daysStr}: ${weekdayShifts}`;
      }
      if (days.length === 7) {
        const daysStr = lang === 'eu' ? 'Al-Ig' : lang === 'en' ? 'Mon-Sun' : lang === 'fr' ? 'Lun-Dim' : 'Lun-Dom';
        return `${daysStr}: ${weekdayShifts}`;
      }
    }

    const sections: string[] = [];
    if (selectedWeekdays.length > 0 && weekdayShifts) {
      sections.push(`${getDaysLabel(selectedWeekdays)}: ${weekdayShifts}`);
    }
    if (selectedWeekend.length > 0 && weekendShifts) {
      sections.push(`${getDaysLabel(selectedWeekend)}: ${weekendShifts}`);
    }

    if (sections.length === 0) {
      return weekdayShifts || weekendShifts || (lang === 'eu' ? 'Itxita' : 'Cerrado');
    }

    return sections.join(' · ');
  };

  // Sección Tienda (Global compartida entre todos los vendedores)
  const [whatsappContacts, setWhatsappContacts] = useState<WhatsAppContact[]>(
    storeProfile?.whatsapp_contacts || parsedStore.whatsapp_contacts || []
  );
  const [pickupAddresses, setPickupAddresses] = useState<StoreAddress[]>(() =>
    ensureOneMainPickup(storeProfile?.pickup_addresses || parsedStore.pickup_addresses || [])
  );
  const [eventAddresses, setEventAddresses] = useState<EventAddress[]>(
    storeProfile?.event_addresses || parsedStore.event_addresses || []
  );
  const [loadingStore, setLoadingStore] = useState(false);
  const [storeMsg, setStoreMsg] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    const contacts = storeProfile?.whatsapp_contacts || parsedStore.whatsapp_contacts;
    if (contacts && contacts.length > 0) {
      setWhatsappContacts(contacts);
    }
    const pickups = storeProfile?.pickup_addresses || parsedStore.pickup_addresses;
    if (pickups && pickups.length > 0) {
      setPickupAddresses(ensureOneMainPickup(pickups));
    }
    const events = storeProfile?.event_addresses || parsedStore.event_addresses;
    if (events && events.length > 0) {
      setEventAddresses(events);
    }
  }, [storeProfile, parsedStore.whatsapp_contacts, parsedStore.pickup_addresses, parsedStore.event_addresses]);

  // Modales
  const [modalWA, setModalWA] = useState<{ open: boolean; contact: WhatsAppContact | null }>({ open: false, contact: null });
  const [modalStoreAddr, setModalStoreAddr] = useState<{ open: boolean; addr: StoreAddress | null }>({ open: false, addr: null });
  const [modalEventAddr, setModalEventAddr] = useState<{ open: boolean; addr: EventAddress | null }>({ open: false, addr: null });

  // Estados para el Horario estructurado del Punto de Entrega
  const [storeScheduleDays, setStoreScheduleDays] = useState<string[]>(['lun', 'mar', 'mie', 'jue', 'vie', 'sab']);
  const [weekdayMorningEnabled, setWeekdayMorningEnabled] = useState(true);
  const [weekdayMorningStart, setWeekdayMorningStart] = useState('10:00');
  const [weekdayMorningEnd, setWeekdayMorningEnd] = useState('14:00');

  const [weekdayAfternoonEnabled, setWeekdayAfternoonEnabled] = useState(true);
  const [weekdayAfternoonStart, setWeekdayAfternoonStart] = useState('17:00');
  const [weekdayAfternoonEnd, setWeekdayAfternoonEnd] = useState('20:30');

  const [weekendMorningEnabled, setWeekendMorningEnabled] = useState(true);
  const [weekendMorningStart, setWeekendMorningStart] = useState('10:30');
  const [weekendMorningEnd, setWeekendMorningEnd] = useState('14:30');

  const [weekendAfternoonEnabled, setWeekendAfternoonEnabled] = useState(false);
  const [weekendAfternoonStart, setWeekendAfternoonStart] = useState('17:30');
  const [weekendAfternoonEnd, setWeekendAfternoonEnd] = useState('21:00');

  useEffect(() => {
    if (!modalStoreAddr.open) return;
    const addr = modalStoreAddr.addr;
    if (addr?.schedule_details) {
      const d = addr.schedule_details;
      setStoreScheduleDays(d.days && d.days.length > 0 ? d.days : ['lun', 'mar', 'mie', 'jue', 'vie', 'sab']);
      setWeekdayMorningEnabled(d.weekday_morning_enabled ?? true);
      setWeekdayMorningStart(d.weekday_morning_start || '10:00');
      setWeekdayMorningEnd(d.weekday_morning_end || '14:00');

      setWeekdayAfternoonEnabled(d.weekday_afternoon_enabled ?? true);
      setWeekdayAfternoonStart(d.weekday_afternoon_start || '17:00');
      setWeekdayAfternoonEnd(d.weekday_afternoon_end || '20:30');

      setWeekendMorningEnabled(d.weekend_morning_enabled ?? true);
      setWeekendMorningStart(d.weekend_morning_start || '10:30');
      setWeekendMorningEnd(d.weekend_morning_end || '14:30');

      setWeekendAfternoonEnabled(d.weekend_afternoon_enabled ?? false);
      setWeekendAfternoonStart(d.weekend_afternoon_start || '17:30');
      setWeekendAfternoonEnd(d.weekend_afternoon_end || '21:00');
    } else {
      setStoreScheduleDays(['lun', 'mar', 'mie', 'jue', 'vie', 'sab']);
      setWeekdayMorningEnabled(true);
      setWeekdayMorningStart('10:00');
      setWeekdayMorningEnd('14:00');
      setWeekdayAfternoonEnabled(true);
      setWeekdayAfternoonStart('17:00');
      setWeekdayAfternoonEnd('20:30');
      setWeekendMorningEnabled(true);
      setWeekendMorningStart('10:30');
      setWeekendMorningEnd('14:30');
      setWeekendAfternoonEnabled(false);
      setWeekendAfternoonStart('17:30');
      setWeekendAfternoonEnd('21:00');
    }
  }, [modalStoreAddr]);

  // Formulario modal WhatsApp
  const [waSelectType, setWaSelectType] = useState<'seller' | 'manual'>('seller');
  const [selectedSellerId, setSelectedSellerId] = useState<string>('');
  const [waName, setWaName] = useState('');
  const [waPhone, setWaPhone] = useState('');

  const p = currentProfile;
  const isComplete = isProfileComplete(p);

  const hasActiveWA = whatsappContacts.some((c) => c.is_active);
  const hasActivePickup = pickupAddresses.some((a) => a.is_active);
  const hasActiveEvent = eventAddresses.some((a) => a.is_active);

  // --- Sincronizar Tienda con la BD ---
  const syncStoreConfig = async (
    contacts: WhatsAppContact[],
    pickups: StoreAddress[],
    events: EventAddress[]
  ) => {
    setLoadingStore(true);
    setStoreMsg(null);
    const fd = new FormData();
    fd.append('whatsapp_contacts', JSON.stringify(contacts));
    fd.append('pickup_addresses', JSON.stringify(pickups));
    fd.append('event_addresses', JSON.stringify(events));

    const res = await updateStoreConfig(fd);
    setLoadingStore(false);
    if (res?.error) {
      setStoreMsg({ text: res.error, isError: true });
    } else {
      setStoreMsg({ text: t.store_config_updated_success, isError: false });
      setTimeout(() => setStoreMsg(null), 3000);
    }
  };

  // --- Handlers WhatsApp (Solo 1 activo a la vez) ---
  const handleToggleActiveWA = async (contactId: string) => {
    const updated = whatsappContacts.map((c) => ({
      ...c,
      is_active: c.id === contactId ? !c.is_active : false,
    }));
    setWhatsappContacts(updated);
    await syncStoreConfig(updated, pickupAddresses, eventAddresses);
  };

  const handleOpenAddWA = () => {
    setWaSelectType('seller');
    const firstSeller = sellers[0];
    if (firstSeller) {
      setSelectedSellerId(firstSeller.id);
      setWaName(firstSeller.full_name);
      setWaPhone(firstSeller.phone);
    } else {
      setWaSelectType('manual');
      setWaName('');
      setWaPhone('');
    }
    setModalWA({ open: true, contact: null });
  };

  const handleOpenEditWA = (c: WhatsAppContact) => {
    setWaSelectType(c.seller_id ? 'seller' : 'manual');
    setSelectedSellerId(c.seller_id || '');
    setWaName(c.name);
    setWaPhone(c.phone);
    setModalWA({ open: true, contact: c });
  };

  const handleSaveWA = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated: WhatsAppContact[];
    if (modalWA.contact) {
      updated = whatsappContacts.map((c) =>
        c.id === modalWA.contact!.id
          ? { ...c, name: waName, phone: waPhone, seller_id: waSelectType === 'seller' ? selectedSellerId : null }
          : c
      );
    } else {
      const newContact: WhatsAppContact = {
        id: 'wa_' + Date.now(),
        name: waName,
        phone: waPhone,
        seller_id: waSelectType === 'seller' ? selectedSellerId : null,
        is_active: whatsappContacts.length === 0,
      };
      updated = [...whatsappContacts, newContact];
    }
    setWhatsappContacts(updated);
    setModalWA({ open: false, contact: null });
    await syncStoreConfig(updated, pickupAddresses, eventAddresses);
  };

  const handleDeleteWA = async (contactId: string) => {
    if (!confirm(t.store_wa_confirm_delete)) return;
    const updated = whatsappContacts.filter((c) => c.id !== contactId);
    setWhatsappContacts(updated);
    await syncStoreConfig(updated, pickupAddresses, eventAddresses);
  };

  // --- Handlers Puntos de Entrega (Tienda Principal + Múltiples activos) ---
  const handleSetMainPickup = async (addrId: string) => {
    const updated = pickupAddresses.map((a) => ({
      ...a,
      is_main: a.id === addrId,
      is_active: a.id === addrId ? true : a.is_active, // asegurarse de que la tienda principal esté activa
    }));
    setPickupAddresses(updated);
    await syncStoreConfig(whatsappContacts, updated, eventAddresses);
  };

  const handleToggleActivePickup = async (addrId: string) => {
    let updated = pickupAddresses.map((a) =>
      a.id === addrId ? { ...a, is_active: !a.is_active } : a
    );
    updated = ensureOneMainPickup(updated);
    setPickupAddresses(updated);
    await syncStoreConfig(whatsappContacts, updated, eventAddresses);
  };

  const handleSaveStoreAddr = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const isMainChecked = fd.get('is_main') === 'on';

    if (storeScheduleDays.length === 0) {
      alert(t.store_schedule_days_min_error);
      return;
    }

    const scheduleDetails: StoreScheduleDetails = {
      days: storeScheduleDays,
      weekday_morning_enabled: weekdayMorningEnabled,
      weekday_morning_start: weekdayMorningStart,
      weekday_morning_end: weekdayMorningEnd,
      weekday_afternoon_enabled: weekdayAfternoonEnabled,
      weekday_afternoon_start: weekdayAfternoonStart,
      weekday_afternoon_end: weekdayAfternoonEnd,
      weekend_morning_enabled: weekendMorningEnabled,
      weekend_morning_start: weekendMorningStart,
      weekend_morning_end: weekendMorningEnd,
      weekend_afternoon_enabled: weekendAfternoonEnabled,
      weekend_afternoon_start: weekendAfternoonStart,
      weekend_afternoon_end: weekendAfternoonEnd,
    };

    const formattedSchedule = buildScheduleString(
      storeScheduleDays,
      weekdayMorningEnabled,
      weekdayMorningStart,
      weekdayMorningEnd,
      weekdayAfternoonEnabled,
      weekdayAfternoonStart,
      weekdayAfternoonEnd,
      weekendMorningEnabled,
      weekendMorningStart,
      weekendMorningEnd,
      weekendAfternoonEnabled,
      weekendAfternoonStart,
      weekendAfternoonEnd,
      language
    );

    const addrData: StoreAddress = {
      id: modalStoreAddr.addr?.id || 'pickup_' + Date.now(),
      title: fd.get('title') as string,
      street: fd.get('street') as string,
      number: fd.get('number') as string,
      stair: fd.get('stair') as string,
      floor: fd.get('floor') as string,
      door: fd.get('door') as string,
      postal_code: fd.get('postal_code') as string,
      town: fd.get('town') as string,
      province: fd.get('province') as string,
      schedule: formattedSchedule,
      schedule_details: scheduleDetails,
      is_active: modalStoreAddr.addr ? modalStoreAddr.addr.is_active : true,
      is_main: isMainChecked || (modalStoreAddr.addr ? !!modalStoreAddr.addr.is_main : pickupAddresses.length === 0),
    };

    let updated: StoreAddress[];
    if (modalStoreAddr.addr) {
      updated = pickupAddresses.map((a) => (a.id === modalStoreAddr.addr!.id ? addrData : a));
    } else {
      updated = [...pickupAddresses, addrData];
    }

    if (isMainChecked) {
      updated = updated.map((a) => ({
        ...a,
        is_main: a.id === addrData.id,
      }));
    }

    updated = ensureOneMainPickup(updated);
    setPickupAddresses(updated);
    setModalStoreAddr({ open: false, addr: null });
    await syncStoreConfig(whatsappContacts, updated, eventAddresses);
  };

  const handleDeletePickup = async (addrId: string) => {
    if (!confirm(t.store_pickup_confirm_delete)) return;
    let updated = pickupAddresses.filter((a) => a.id !== addrId);
    updated = ensureOneMainPickup(updated);
    setPickupAddresses(updated);
    await syncStoreConfig(whatsappContacts, updated, eventAddresses);
  };

  // --- Handlers Puntos de Evento (Múltiples activos permitidos) ---
  const handleToggleActiveEvent = async (addrId: string) => {
    const updated = eventAddresses.map((a) =>
      a.id === addrId ? { ...a, is_active: !a.is_active } : a
    );
    setEventAddresses(updated);
    await syncStoreConfig(whatsappContacts, pickupAddresses, updated);
  };

  const handleSaveEventAddr = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const eventData: EventAddress = {
      id: modalEventAddr.addr?.id || 'event_' + Date.now(),
      title: fd.get('title') as string,
      street: fd.get('street') as string,
      number: fd.get('number') as string,
      stair: fd.get('stair') as string,
      floor: fd.get('floor') as string,
      door: fd.get('door') as string,
      postal_code: fd.get('postal_code') as string,
      town: fd.get('town') as string,
      province: fd.get('province') as string,
      notes: fd.get('notes') as string,
      is_active: modalEventAddr.addr ? modalEventAddr.addr.is_active : true,
    };

    let updated: EventAddress[];
    if (modalEventAddr.addr) {
      updated = eventAddresses.map((a) => (a.id === modalEventAddr.addr!.id ? eventData : a));
    } else {
      updated = [...eventAddresses, eventData];
    }
    setEventAddresses(updated);
    setModalEventAddr({ open: false, addr: null });
    await syncStoreConfig(whatsappContacts, pickupAddresses, updated);
  };

  const handleDeleteEvent = async (addrId: string) => {
    if (!confirm(t.store_event_confirm_delete)) return;
    const updated = eventAddresses.filter((a) => a.id !== addrId);
    setEventAddresses(updated);
    await syncStoreConfig(whatsappContacts, pickupAddresses, updated);
  };

  // --- Handlers Direcciones de Entrega (Comprador) ---
  const handleSaveDeliveryAddr = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = (fd.get('title') as string)?.trim() || 'Dirección de Entrega';
    const street = (fd.get('street') as string)?.trim() || '';
    const number = (fd.get('number') as string)?.trim() || '';
    const stair = (fd.get('stair') as string)?.trim() || '';
    const floor = (fd.get('floor') as string)?.trim() || '';
    const door = (fd.get('door') as string)?.trim() || '';
    const postal_code = (fd.get('postal_code') as string)?.trim() || '';
    const town = (fd.get('town') as string)?.trim() || '';
    const province = (fd.get('province') as string)?.trim() || '';
    const notes = (fd.get('notes') as string)?.trim() || '';
    const is_default = fd.get('is_default') === 'on' || deliveryAddresses.length === 0;

    let nextList: DeliveryAddress[];
    if (modalDeliveryAddr.addr) {
      nextList = deliveryAddresses.map((a) => {
        if (a.id === modalDeliveryAddr.addr!.id) {
          return {
            ...a,
            title,
            street,
            number,
            stair,
            floor,
            door,
            postal_code,
            town,
            province,
            notes,
            is_default: is_default ? true : a.is_default,
          };
        }
        return is_default ? { ...a, is_default: false } : a;
      });
    } else {
      const newAddr: DeliveryAddress = {
        id: 'addr_' + Date.now(),
        title,
        street,
        number,
        stair,
        floor,
        door,
        postal_code,
        town,
        province,
        notes,
        is_default,
      };
      nextList = is_default
        ? [...deliveryAddresses.map((a) => ({ ...a, is_default: false })), newAddr]
        : [...deliveryAddresses, newAddr];
    }

    setDeliveryAddresses(nextList);
    setModalDeliveryAddr({ open: false, addr: null });
    setLoadingDeliveryAddr(true);
    await updateDeliveryAddresses(nextList);
    setLoadingDeliveryAddr(false);
  };

  const handleDeleteDeliveryAddr = async (id: string) => {
    if (!confirm(t.deliv_delete_confirm)) return;
    const nextList = deliveryAddresses.filter((a) => a.id !== id);
    setDeliveryAddresses(nextList);
    await updateDeliveryAddresses(nextList);
  };

  const handleSetDefaultDeliveryAddr = async (id: string) => {
    const nextList = deliveryAddresses.map((a) => ({
      ...a,
      is_default: a.id === id,
    }));
    setDeliveryAddresses(nextList);
    await updateDeliveryAddresses(nextList);
  };

  // Submit Usuario
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingUser(true);
    setUserMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateProfile(formData);
    setLoadingUser(false);

    if (res?.error) {
      setUserMsg({ text: res.error, isError: true });
    } else {
      setUserMsg({ text: t.common_success, isError: false });
      if (res?.updatedProfile) {
        setCurrentProfile(parseProfile(res.updatedProfile));
      }
      setIsEditingUser(false);
      try {
        window.dispatchEvent(new Event('ekhiteka_profile_updated'));
      } catch {}
      setTimeout(() => setUserMsg(null), 3000);
    }
  };

  // Submit Contraseña
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingPassword(true);
    setPasswordMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await changeUserPassword(formData);
    setLoadingPassword(false);

    if (res?.error) {
      setPasswordMsg({ text: res.error, isError: true });
    } else {
      setPasswordMsg({ text: t.profile_password_success, isError: false });
      (e.target as HTMLFormElement).reset();
      setTimeout(() => {
        setPasswordMsg(null);
        setIsPasswordOpen(false);
      }, 2500);
    }
  };

  const formattedUserAddress = [
    p.street,
    p.number ? `Nº ${p.number}` : '',
    p.stair ? `Esc ${p.stair}` : '',
    p.floor ? `Piso ${p.floor}` : '',
    p.door ? `Pta ${p.door}` : '',
    p.postal_code,
    p.town,
    p.province,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-6 font-serif">
      {/* Cabecera del Perfil */}
      <div className="flex items-center gap-3 pb-2 border-b border-stone-200 dark:border-stone-800">
        <Link
          href="/"
          className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 font-serif">
            {t.profile_main_title}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
            {t.profile_main_subtitle}
          </p>
        </div>
      </div>

      {/* Selector de Pestañas: Usuario y Tienda */}
      {isSeller && (
        <div className="flex items-center gap-3 p-1.5 bg-stone-100 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 max-w-md">
          <button
            type="button"
            onClick={() => setActiveTab('usuario')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'usuario'
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{t.profile_tab_user}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tienda')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'tienda'
                ? 'bg-[#FFE259] text-[#1D1D1B] font-black shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{t.profile_tab_store}</span>
          </button>
        </div>
      )}

      {/* ===================== PESTAÑA: USUARIO ===================== */}
      {(activeTab === 'usuario' || !isSeller) && (
        <div className="space-y-6 animate-fadeIn">
          {/* Tarjeta Datos de Vendedor */}
          <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-[#C68D07] dark:text-[#FFE259]">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100">
                      {isSeller ? t.profile_seller_data : t.profile_user_data}
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider font-sans ${
                        isComplete
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      }`}
                    >
                      {isComplete ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> {t.profile_status_complete}
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" /> {t.profile_status_incomplete}
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                    {isSeller
                      ? t.profile_seller_desc
                      : t.profile_subtitle}
                  </p>
                </div>
              </div>

              {!isEditingUser && (
                <button
                  type="button"
                  onClick={() => setIsEditingUser(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer hover:scale-105 shrink-0"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>{t.profile_edit_btn}</span>
                </button>
              )}
            </div>

            {userMsg && (
              <div
                className={`p-4 rounded-2xl text-xs font-bold text-center font-sans ${
                  userMsg.isError
                    ? 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
                    : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                }`}
              >
                {userMsg.text}
              </div>
            )}

            {!isEditingUser ? (
              <div className="space-y-6 font-sans text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
                      {t.profile_full_name}
                    </span>
                    <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                      {[p.first_name, p.last_name_1, p.last_name_2].filter(Boolean).join(' ') || p.full_name || t.profile_not_specified}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
                      {t.profile_dni}
                    </span>
                    <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm uppercase">
                      {p.dni || t.profile_not_specified}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
                      {t.profile_birth_date}
                    </span>
                    <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                      {p.birth_date || t.profile_not_specified}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
                      {t.profile_phone}
                    </span>
                    <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                      {p.phone || t.profile_not_specified}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
                      {t.auth_email}
                    </span>
                    <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                      {p.email || t.profile_not_specified}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
                      {t.profile_town_province}
                    </span>
                    <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                      {p.town ? `${p.town} (${p.province || ''})` : t.profile_not_specified}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#C68D07] dark:text-[#FFE259] flex items-center gap-1.5 font-serif">
                    <Home className="w-3.5 h-3.5" />
                    <span>{t.profile_user_address} {isSeller && t.profile_seller_addr_optional}</span>
                  </span>
                  <p className="text-sm font-bold text-stone-800 dark:text-[#F5F5F0]">
                    {formattedUserAddress || (isSeller ? t.profile_seller_no_address : t.profile_not_specified)}
                  </p>
                </div>
              </div>
            ) : (
              /* Modo Edición Exclusivo para Datos del Usuario */
              <form onSubmit={handleProfileSubmit} className="space-y-6 font-sans text-xs animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {t.profile_first_name} *
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      required
                      defaultValue={p.first_name || ''}
                      className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {t.profile_last_name_1} *
                    </label>
                    <input
                      type="text"
                      name="last_name_1"
                      required
                      defaultValue={p.last_name_1 || ''}
                      className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {t.profile_last_name_2}
                    </label>
                    <input
                      type="text"
                      name="last_name_2"
                      defaultValue={p.last_name_2 || ''}
                      className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {t.profile_dni} *
                    </label>
                    <input
                      type="text"
                      name="dni"
                      required
                      defaultValue={p.dni || ''}
                      placeholder="12345678Z"
                      className="w-full px-3.5 py-2.5 rounded-xl border uppercase bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {t.profile_birth_date} *
                    </label>
                    <input
                      type="date"
                      name="birth_date"
                      required
                      defaultValue={p.birth_date || ''}
                      className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {t.profile_phone} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      defaultValue={p.phone || ''}
                      placeholder="600 000 000"
                      className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block font-serif">
                    {t.profile_user_address} {isSeller ? t.profile_seller_addr_optional : '*'}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        {t.profile_province} {!isSeller && '*'}
                      </label>
                      <input
                        type="text"
                        name="province"
                        required={!isSeller}
                        defaultValue={p.province || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        {t.profile_town} {!isSeller && '*'}
                      </label>
                      <input
                        type="text"
                        name="town"
                        required={!isSeller}
                        defaultValue={p.town || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        {t.profile_postal_code} {!isSeller && '*'}
                      </label>
                      <input
                        type="text"
                        name="postal_code"
                        required={!isSeller}
                        defaultValue={p.postal_code || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                    <div className="col-span-2 sm:col-span-2">
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        {t.profile_street} {!isSeller && '*'}
                      </label>
                      <input
                        type="text"
                        name="street"
                        required={!isSeller}
                        defaultValue={p.street || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        {t.profile_number} {!isSeller && '*'}
                      </label>
                      <input
                        type="text"
                        name="number"
                        required={!isSeller}
                        defaultValue={p.number || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        {t.profile_stair}
                      </label>
                      <input
                        type="text"
                        name="stair"
                        defaultValue={p.stair || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        {t.profile_floor} {!isSeller && '*'}
                      </label>
                      <input
                        type="text"
                        name="floor"
                        required={!isSeller}
                        defaultValue={p.floor || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        {t.profile_door} {!isSeller && '*'}
                      </label>
                      <input
                        type="text"
                        name="door"
                        required={!isSeller}
                        defaultValue={p.door || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-3 font-serif">
                  <button
                    type="button"
                    onClick={() => setIsEditingUser(false)}
                    className="px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold text-xs uppercase tracking-wider hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    {t.common_cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={loadingUser}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>{loadingUser ? t.common_loading : t.profile_save_changes_btn}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Tarjeta de Gestión de Direcciones de Entrega (Comprador) */}
          {!isSeller && (
            <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-[#C68D07] dark:text-[#FFE259]">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 font-serif">
                      {t.deliv_manage_addresses}
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                      {t.deliv_manage_addresses_desc}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setModalDeliveryAddr({ open: true, addr: null })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.deliv_add_new_address}</span>
                </button>
              </div>

              {/* Lista de direcciones guardadas */}
              <div className="space-y-3 font-sans text-xs">
                {deliveryAddresses.length > 0 ? (
                  deliveryAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 rounded-2xl bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                            {addr.title}
                          </span>
                          {addr.is_default && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-[#C68D07] dark:text-[#FFE259] font-black text-[10px] uppercase">
                              {t.deliv_default_badge}
                            </span>
                          )}
                        </div>
                        <p className="text-stone-600 dark:text-stone-300 font-medium">
                          {addr.street} {addr.number ? `Nº ${addr.number}` : ''} {addr.stair ? `Esc ${addr.stair}` : ''} {addr.floor ? `Piso ${addr.floor}` : ''} {addr.door ? `Pta ${addr.door}` : ''}, {addr.postal_code || ''} {addr.town} ({addr.province})
                        </p>
                        {addr.notes && (
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                            Notas: {addr.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {!addr.is_default && (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultDeliveryAddr(addr.id)}
                            className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            {t.deliv_set_as_default}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setModalDeliveryAddr({ open: true, addr })}
                          className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                          title={t.deliv_edit_address}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDeliveryAddr(addr.id)}
                          className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          title={t.cart_remove}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-stone-400 dark:text-stone-500 italic">
                    {t.deliv_no_saved_addresses}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tarjeta Cambio de Contraseña */}
          <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs">
            <button
              type="button"
              onClick={() => setIsPasswordOpen(!isPasswordOpen)}
              className="w-full flex items-center justify-between text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 font-serif">
                    {t.profile_security}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                    {isPasswordOpen ? t.profile_password_open_desc : t.profile_password_closed_desc}
                  </p>
                </div>
              </div>

              <div className={`p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 transition-transform duration-200 ${isPasswordOpen ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {isPasswordOpen && (
              <form onSubmit={handlePasswordSubmit} className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800 space-y-4 font-sans text-xs max-w-md animate-fadeIn">
                {passwordMsg && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs font-bold text-center ${
                      passwordMsg.isError
                        ? 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
                        : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                    }`}
                  >
                    {passwordMsg.text}
                  </div>
                )}

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_current_password} *
                  </label>
                  <input
                    type="password"
                    name="current_password"
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_new_password} *
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_confirm_password} *
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>

                <div className="pt-2 flex justify-end font-serif">
                  <button
                    type="submit"
                    disabled={loadingPassword}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1D1D1B] dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 text-[#FFE259] dark:text-[#1D1D1B]" />
                    <span>{loadingPassword ? t.common_loading : t.profile_change_password_btn}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ===================== PESTAÑA: TIENDA ===================== */}
      {isSeller && activeTab === 'tienda' && (
        <div className="space-y-8 animate-fadeIn">
          {storeMsg && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold text-center font-sans ${
                storeMsg.isError
                  ? 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
                  : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
              }`}
            >
              {storeMsg.text}
            </div>
          )}

          {/* 1. CONTACTO WHATSAPP */}
          <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">
                    {t.store_wa_title}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                    {t.store_wa_desc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenAddWA}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer hover:scale-105 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.store_wa_add_btn}</span>
              </button>
            </div>

            {/* Avisos estado WhatsApp */}
            {whatsappContacts.length === 0 ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200 font-sans">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                <span>{t.store_wa_alert_empty}</span>
              </div>
            ) : !hasActiveWA ? (
              <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-2xl flex items-center justify-between gap-3 text-xs text-red-900 dark:text-red-200 font-sans">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                  <span>{t.store_wa_alert_no_active}</span>
                </div>
              </div>
            ) : null}

            {/* Lista Contactos WhatsApp */}
            <div className="space-y-3 font-sans">
              {whatsappContacts.map((c) => (
                <div
                  key={c.id}
                  className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    c.is_active
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-xs'
                      : 'bg-stone-50 dark:bg-[#1F1E1C] border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-stone-900 dark:text-stone-100">{c.name}</span>
                      {c.is_active ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[9px] uppercase tracking-wider">
                          {t.store_wa_badge_active}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-bold text-[9px] uppercase tracking-wider">
                          {t.store_wa_badge_inactive}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 font-bold flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span>{c.phone}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-serif">
                    <button
                      type="button"
                      onClick={() => handleToggleActiveWA(c.id)}
                      className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                        c.is_active
                          ? 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-red-100 hover:text-red-700'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{c.is_active ? t.store_btn_disable : t.store_btn_enable}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditWA(c)}
                      className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                      title={t.store_edit_contact}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteWA(c.id)}
                      className="p-2 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/60 text-red-700 dark:text-red-300 transition-colors cursor-pointer"
                      title={t.store_delete_contact}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. PUNTO ENTREGA / TIENDA */}
          <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-[#C68D07] dark:text-[#FFE259]">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">
                    {t.store_pickup_title}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                    {t.store_pickup_desc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalStoreAddr({ open: true, addr: null })}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer hover:scale-105 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.store_pickup_add_btn}</span>
              </button>
            </div>

            {/* Avisos Puntos de Entrega */}
            {pickupAddresses.length === 0 ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200 font-sans">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                <span>{t.store_pickup_alert_empty}</span>
              </div>
            ) : !hasActivePickup ? (
              <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-2xl flex items-center gap-3 text-xs text-red-900 dark:text-red-200 font-sans">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                <span>{t.store_pickup_alert_no_active}</span>
              </div>
            ) : null}

            {/* Lista Puntos de Entrega */}
            <div className="space-y-3 font-sans">
              {pickupAddresses.map((a) => (
                <div
                  key={a.id}
                  className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    a.is_active
                      ? 'bg-stone-50 dark:bg-[#141312] border-stone-200 dark:border-stone-800 shadow-xs'
                      : 'bg-stone-50/50 dark:bg-[#1F1E1C]/50 border-stone-200 dark:border-stone-800 opacity-60'
                  }`}
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-sm text-stone-900 dark:text-stone-100">{a.title}</span>

                      {/* Badge Habilitado / Inactivo */}
                      {a.is_active ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-black text-[9px] uppercase tracking-wider border border-emerald-300 dark:border-emerald-700">
                          {t.store_wa_badge_active}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-bold text-[9px] uppercase tracking-wider">
                          {t.store_wa_badge_inactive}
                        </span>
                      )}

                      {/* Botón / Indicador Tienda Principal a la derecha de Habilitado */}
                      {a.is_main ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFE259] text-[#1D1D1B] font-black text-[10px] uppercase tracking-wider font-serif border border-amber-400 dark:border-amber-300 shadow-2xs">
                          <Star className="w-3 h-3 fill-[#1D1D1B] text-[#1D1D1B]" />
                          <span>{language === 'eu' ? 'Denda Nagusia' : 'Tienda Principal'}</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetMainPickup(a.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 hover:bg-[#FFE259] dark:bg-stone-800 dark:hover:bg-[#FFE259] text-stone-600 hover:text-[#1D1D1B] dark:text-stone-300 dark:hover:text-[#1D1D1B] font-bold text-[9.5px] uppercase tracking-wider transition-all cursor-pointer border border-stone-200 dark:border-stone-700"
                          title={language === 'eu' ? 'Ezarri denda nagusi gisa' : 'Marcar como tienda principal'}
                        >
                          <Star className="w-3 h-3" />
                          <span>{language === 'eu' ? 'Denda Nagusia' : 'Tienda Principal'}</span>
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      {a.street} {a.number ? `Nº ${a.number}` : ''} {a.stair ? `Esc ${a.stair}` : ''} {a.floor ? `Piso ${a.floor}` : ''} {a.door ? `Pta ${a.door}` : ''}, {a.postal_code || ''} {a.town} ({a.province})
                    </p>
                    {a.schedule && (
                      <p className="text-[11px] font-bold text-[#C68D07] dark:text-[#FFE259]">
                        {t.store_schedule_label} {a.schedule}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-serif self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleToggleActivePickup(a.id)}
                      className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                        a.is_active
                          ? 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-red-100 hover:text-red-700'
                          : 'bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] shadow-xs'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{a.is_active ? t.store_btn_disable : t.store_btn_enable}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModalStoreAddr({ open: true, addr: a })}
                      className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                      title={t.profile_edit_btn}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePickup(a.id)}
                      className="p-2 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/60 text-red-700 dark:text-red-300 transition-colors cursor-pointer"
                      title={t.store_delete_contact}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. PUNTO EVENTO */}
          <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">
                    {t.store_event_title}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                    {t.store_event_desc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalEventAddr({ open: true, addr: null })}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer hover:scale-105 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.store_event_add_btn}</span>
              </button>
            </div>

            {/* Avisos Puntos de Evento */}
            {eventAddresses.length === 0 ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200 font-sans">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                <span>{t.store_event_alert_empty}</span>
              </div>
            ) : !hasActiveEvent ? (
              <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-2xl flex items-center gap-3 text-xs text-red-900 dark:text-red-200 font-sans">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                <span>{t.store_event_alert_no_active}</span>
              </div>
            ) : null}

            {/* Lista Puntos de Evento */}
            <div className="space-y-3 font-sans">
              {eventAddresses.map((a) => (
                <div
                  key={a.id}
                  className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    a.is_active
                      ? 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800 shadow-xs'
                      : 'bg-stone-50 dark:bg-[#1F1E1C] border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-stone-900 dark:text-stone-100">{a.title}</span>
                      {a.is_active ? (
                        <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white font-black text-[9px] uppercase tracking-wider">
                          {t.store_wa_badge_active}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-bold text-[9px] uppercase tracking-wider">
                          {t.store_wa_badge_inactive}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      {a.street} {a.number ? `Nº ${a.number}` : ''} {a.stair ? `Esc ${a.stair}` : ''} {a.floor ? `Piso ${a.floor}` : ''} {a.door ? `Pta ${a.door}` : ''}, {a.postal_code || ''} {a.town} ({a.province})
                    </p>
                    {a.notes && (
                      <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                        {t.store_notes_label} {a.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-serif">
                    <button
                      type="button"
                      onClick={() => handleToggleActiveEvent(a.id)}
                      className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                        a.is_active
                          ? 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-red-100 hover:text-red-700'
                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{a.is_active ? t.store_btn_disable : t.store_btn_enable}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModalEventAddr({ open: true, addr: a })}
                      className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                      title={t.profile_edit_btn}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(a.id)}
                      className="p-2 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/60 text-red-700 dark:text-red-300 transition-colors cursor-pointer"
                      title={t.store_delete_contact}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. IMÁGENES Y BANNERS DE LA WEB */}
          <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-5 shadow-xs">
            <SiteImagesManager />
          </div>
        </div>
      )}

      {/* ===================== MODALES ===================== */}

      {/* Modal Contacto WhatsApp */}
      {modalWA.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn font-sans">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 font-serif">
              <h3 className="font-black text-lg text-stone-900 dark:text-stone-100">
                {modalWA.contact ? t.store_modal_wa_edit : t.store_modal_wa_new}
              </h3>
              <button
                type="button"
                onClick={() => setModalWA({ open: false, contact: null })}
                className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWA} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-bold text-stone-700 dark:text-stone-300 block">
                  {t.store_modal_wa_source_label}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setWaSelectType('seller');
                      const s = sellers[0];
                      if (s) {
                        setSelectedSellerId(s.id);
                        setWaName(s.full_name);
                        setWaPhone(s.phone);
                      }
                    }}
                    className={`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                      waSelectType === 'seller'
                        ? 'border-[#FFE259] bg-amber-50 dark:bg-amber-950/40 text-stone-900 dark:text-stone-100'
                        : 'border-stone-200 dark:border-stone-700 text-stone-500'
                    }`}
                  >
                    {t.store_modal_wa_choose_seller}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setWaSelectType('manual');
                      setSelectedSellerId('');
                    }}
                    className={`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                      waSelectType === 'manual'
                        ? 'border-[#FFE259] bg-amber-50 dark:bg-amber-950/40 text-stone-900 dark:text-stone-100'
                        : 'border-stone-200 dark:border-stone-700 text-stone-500'
                    }`}
                  >
                    {t.store_modal_wa_manual_input}
                  </button>
                </div>
              </div>

              {waSelectType === 'seller' && sellers.length > 0 && (
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.store_modal_wa_select_seller}
                  </label>
                  <select
                    value={selectedSellerId}
                    onChange={(e) => {
                      const selId = e.target.value;
                      setSelectedSellerId(selId);
                      const s = sellers.find((sel) => sel.id === selId);
                      if (s) {
                        setWaName(s.full_name);
                        setWaPhone(s.phone);
                      }
                    }}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold"
                  >
                    {sellers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.full_name} ({s.phone || t.profile_not_specified})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.store_modal_wa_name}
                </label>
                <input
                  type="text"
                  required
                  value={waName}
                  onChange={(e) => setWaName(e.target.value)}
                  placeholder="Ej: Mikel (Atención Tienda)"
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.store_modal_wa_phone}
                </label>
                <input
                  type="tel"
                  required
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  placeholder="34600000000"
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700 font-bold"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2 font-serif">
                <button
                  type="button"
                  onClick={() => setModalWA({ open: false, contact: null })}
                  className="px-4 py-2 rounded-xl text-stone-500 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  {t.common_cancel}
                </button>
                <button
                  type="submit"
                  disabled={loadingStore}
                  className="px-5 py-2 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black uppercase text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  {t.store_modal_wa_save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Punto de Entrega / Tienda */}
      {modalStoreAddr.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn font-sans">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 font-serif">
              <h3 className="font-black text-lg text-stone-900 dark:text-stone-100">
                {modalStoreAddr.addr ? t.store_modal_pickup_edit : t.store_modal_pickup_new}
              </h3>
              <button
                type="button"
                onClick={() => setModalStoreAddr({ open: false, addr: null })}
                className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStoreAddr} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.store_modal_pickup_title_field}
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={modalStoreAddr.addr?.title || ''}
                  placeholder="Ej: Tienda Principal Lekeitio"
                  className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 font-bold border-stone-200 dark:border-stone-700"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_street} *</label>
                  <input
                    type="text"
                    name="street"
                    required
                    defaultValue={modalStoreAddr.addr?.street || ''}
                    placeholder="Gamarra Kalea"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_number} *</label>
                  <input
                    type="text"
                    name="number"
                    required
                    defaultValue={modalStoreAddr.addr?.number || ''}
                    placeholder="4"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_stair}</label>
                  <input
                    type="text"
                    name="stair"
                    defaultValue={modalStoreAddr.addr?.stair || ''}
                    placeholder="A"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_floor}</label>
                  <input
                    type="text"
                    name="floor"
                    defaultValue={modalStoreAddr.addr?.floor || ''}
                    placeholder="Bajo"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_door}</label>
                  <input
                    type="text"
                    name="door"
                    defaultValue={modalStoreAddr.addr?.door || ''}
                    placeholder="1"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_postal_code} *</label>
                  <input
                    type="text"
                    name="postal_code"
                    required
                    defaultValue={modalStoreAddr.addr?.postal_code || '48280'}
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_town} *</label>
                  <input
                    type="text"
                    name="town"
                    required
                    defaultValue={modalStoreAddr.addr?.town || 'Lekeitio'}
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_province} *</label>
                  <input
                    type="text"
                    name="province"
                    required
                    defaultValue={modalStoreAddr.addr?.province || 'Bizkaia'}
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>

              {/* Horario de Atención / Recogida Estructurado */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#141312] border border-stone-200 dark:border-stone-800 space-y-4 font-sans">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-200 dark:border-stone-800">
                  <label className="font-bold text-stone-800 dark:text-stone-200 block text-xs uppercase tracking-wider font-serif flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>{t.store_modal_pickup_schedule_field}</span>
                  </label>
                  <div className="flex items-center gap-1 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setStoreScheduleDays(['lun', 'mar', 'mie', 'jue', 'vie'])}
                      className="px-2 py-0.5 rounded-lg bg-stone-200 dark:bg-stone-800 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                    >
                      {t.store_schedule_quick_weekdays}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStoreScheduleDays(['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'])}
                      className="px-2 py-0.5 rounded-lg bg-stone-200 dark:bg-stone-800 hover:bg-[#FFE259] hover:text-[#1D1D1B] text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                    >
                      {t.store_schedule_quick_all}
                    </button>
                  </div>
                </div>

                {/* 1. Selector de Días (Lunes a Domingo) */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block">
                    {t.store_schedule_days_title} ({storeScheduleDays.length}/7):
                  </span>
                  <div className="grid grid-cols-7 gap-1.5 text-center">
                    {[
                      { id: 'lun', es: 'Lun', eu: 'Al', en: 'Mon', fr: 'Lun', full: 'Lunes' },
                      { id: 'mar', es: 'Mar', eu: 'Ar', en: 'Tue', fr: 'Mar', full: 'Martes' },
                      { id: 'mie', es: 'Mié', eu: 'Az', en: 'Wed', fr: 'Mer', full: 'Miércoles' },
                      { id: 'jue', es: 'Jue', eu: 'Og', en: 'Thu', fr: 'Jeu', full: 'Jueves' },
                      { id: 'vie', es: 'Vie', eu: 'Or', en: 'Fri', fr: 'Ven', full: 'Viernes' },
                      { id: 'sab', es: 'Sáb', eu: 'Lr', en: 'Sat', fr: 'Sam', full: 'Sábado' },
                      { id: 'dom', es: 'Dom', eu: 'Ig', en: 'Sun', fr: 'Dim', full: 'Domingo' },
                    ].map((d) => {
                      const isSelected = storeScheduleDays.includes(d.id);
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              if (storeScheduleDays.length <= 1) {
                                alert(t.store_schedule_days_min_error);
                                return;
                              }
                              setStoreScheduleDays(storeScheduleDays.filter((item) => item !== d.id));
                            } else {
                              setStoreScheduleDays([...storeScheduleDays, d.id]);
                            }
                          }}
                          className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#FFE259] border-amber-400 text-[#1D1D1B] shadow-xs scale-102'
                              : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 opacity-60 hover:opacity-100'
                          }`}
                          title={d.full}
                        >
                          {language === 'eu' ? d.eu : language === 'en' ? d.en : language === 'fr' ? d.fr : d.es}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Horarios individuales (4 turnos) */}
                <div className="space-y-3 pt-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block font-serif">
                    Horarios de Apertura & Cierre por Turno
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* 1. Mañanas entre semana */}
                    <div className={`p-3 rounded-xl border transition-all ${weekdayMorningEnabled ? 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700' : 'bg-stone-100/50 dark:bg-stone-850/50 border-stone-200 dark:border-stone-800 opacity-60'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={weekdayMorningEnabled}
                            onChange={(e) => setWeekdayMorningEnabled(e.target.checked)}
                            className="w-3.5 h-3.5 rounded border-stone-300 accent-[#FFE259] cursor-pointer"
                          />
                          <span>1. {t.store_schedule_weekday_morning}</span>
                        </label>
                        {!weekdayMorningEnabled && (
                          <span className="text-[10px] text-stone-400 font-bold">{t.store_schedule_closed_shift}</span>
                        )}
                      </div>
                      {weekdayMorningEnabled && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-stone-500 block mb-0.5">{t.store_schedule_time_start}</span>
                            <input
                              type="time"
                              value={weekdayMorningStart}
                              onChange={(e) => setWeekdayMorningStart(e.target.value)}
                              className="w-full px-2 py-1 rounded-lg border bg-stone-50 dark:bg-stone-900 font-bold text-xs border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-500 block mb-0.5">{t.store_schedule_time_end}</span>
                            <input
                              type="time"
                              value={weekdayMorningEnd}
                              onChange={(e) => setWeekdayMorningEnd(e.target.value)}
                              className="w-full px-2 py-1 rounded-lg border bg-stone-50 dark:bg-stone-900 font-bold text-xs border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. Tardes entre semana */}
                    <div className={`p-3 rounded-xl border transition-all ${weekdayAfternoonEnabled ? 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700' : 'bg-stone-100/50 dark:bg-stone-850/50 border-stone-200 dark:border-stone-800 opacity-60'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={weekdayAfternoonEnabled}
                            onChange={(e) => setWeekdayAfternoonEnabled(e.target.checked)}
                            className="w-3.5 h-3.5 rounded border-stone-300 accent-[#FFE259] cursor-pointer"
                          />
                          <span>2. {t.store_schedule_weekday_afternoon}</span>
                        </label>
                        {!weekdayAfternoonEnabled && (
                          <span className="text-[10px] text-stone-400 font-bold">{t.store_schedule_closed_shift}</span>
                        )}
                      </div>
                      {weekdayAfternoonEnabled && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-stone-500 block mb-0.5">{t.store_schedule_time_start}</span>
                            <input
                              type="time"
                              value={weekdayAfternoonStart}
                              onChange={(e) => setWeekdayAfternoonStart(e.target.value)}
                              className="w-full px-2 py-1 rounded-lg border bg-stone-50 dark:bg-stone-900 font-bold text-xs border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-500 block mb-0.5">{t.store_schedule_time_end}</span>
                            <input
                              type="time"
                              value={weekdayAfternoonEnd}
                              onChange={(e) => setWeekdayAfternoonEnd(e.target.value)}
                              className="w-full px-2 py-1 rounded-lg border bg-stone-50 dark:bg-stone-900 font-bold text-xs border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 3. Mañanas fin de semana */}
                    <div className={`p-3 rounded-xl border transition-all ${weekendMorningEnabled ? 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700' : 'bg-stone-100/50 dark:bg-stone-850/50 border-stone-200 dark:border-stone-800 opacity-60'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={weekendMorningEnabled}
                            onChange={(e) => setWeekendMorningEnabled(e.target.checked)}
                            className="w-3.5 h-3.5 rounded border-stone-300 accent-[#FFE259] cursor-pointer"
                          />
                          <span>3. {t.store_schedule_weekend_morning}</span>
                        </label>
                        {!weekendMorningEnabled && (
                          <span className="text-[10px] text-stone-400 font-bold">{t.store_schedule_closed_shift}</span>
                        )}
                      </div>
                      {weekendMorningEnabled && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-stone-500 block mb-0.5">{t.store_schedule_time_start}</span>
                            <input
                              type="time"
                              value={weekendMorningStart}
                              onChange={(e) => setWeekendMorningStart(e.target.value)}
                              className="w-full px-2 py-1 rounded-lg border bg-stone-50 dark:bg-stone-900 font-bold text-xs border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-500 block mb-0.5">{t.store_schedule_time_end}</span>
                            <input
                              type="time"
                              value={weekendMorningEnd}
                              onChange={(e) => setWeekendMorningEnd(e.target.value)}
                              className="w-full px-2 py-1 rounded-lg border bg-stone-50 dark:bg-stone-900 font-bold text-xs border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 4. Tardes fin de semana */}
                    <div className={`p-3 rounded-xl border transition-all ${weekendAfternoonEnabled ? 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700' : 'bg-stone-100/50 dark:bg-stone-850/50 border-stone-200 dark:border-stone-800 opacity-60'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={weekendAfternoonEnabled}
                            onChange={(e) => setWeekendAfternoonEnabled(e.target.checked)}
                            className="w-3.5 h-3.5 rounded border-stone-300 accent-[#FFE259] cursor-pointer"
                          />
                          <span>4. {t.store_schedule_weekend_afternoon}</span>
                        </label>
                        {!weekendAfternoonEnabled && (
                          <span className="text-[10px] text-stone-400 font-bold">{t.store_schedule_closed_shift}</span>
                        )}
                      </div>
                      {weekendAfternoonEnabled && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-stone-500 block mb-0.5">{t.store_schedule_time_start}</span>
                            <input
                              type="time"
                              value={weekendAfternoonStart}
                              onChange={(e) => setWeekendAfternoonStart(e.target.value)}
                              className="w-full px-2 py-1 rounded-lg border bg-stone-50 dark:bg-stone-900 font-bold text-xs border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-500 block mb-0.5">{t.store_schedule_time_end}</span>
                            <input
                              type="time"
                              value={weekendAfternoonEnd}
                              onChange={(e) => setWeekendAfternoonEnd(e.target.value)}
                              className="w-full px-2 py-1 rounded-lg border bg-stone-50 dark:bg-stone-900 font-bold text-xs border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Previsualización del horario resultante */}
                <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] flex items-center gap-2">
                  <span className="font-bold text-amber-800 dark:text-amber-300 shrink-0">Vista previa:</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200 truncate">
                    {buildScheduleString(
                      storeScheduleDays,
                      weekdayMorningEnabled,
                      weekdayMorningStart,
                      weekdayMorningEnd,
                      weekdayAfternoonEnabled,
                      weekdayAfternoonStart,
                      weekdayAfternoonEnd,
                      weekendMorningEnabled,
                      weekendMorningStart,
                      weekendMorningEnd,
                      weekendAfternoonEnabled,
                      weekendAfternoonStart,
                      weekendAfternoonEnd,
                      language
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 font-serif">
                <input
                  type="checkbox"
                  id="store_is_main"
                  name="is_main"
                  defaultChecked={modalStoreAddr.addr ? !!modalStoreAddr.addr.is_main : pickupAddresses.length === 0}
                  className="w-4 h-4 rounded border-stone-300 accent-[#FFE259] cursor-pointer"
                />
                <label htmlFor="store_is_main" className="text-xs font-black text-stone-900 dark:text-stone-100 flex items-center gap-1.5 cursor-pointer">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{language === 'eu' ? 'Denda Nagusi gisa ezarri' : 'Marcar como Tienda Principal'}</span>
                </label>
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2 font-serif">
                <button
                  type="button"
                  onClick={() => setModalStoreAddr({ open: false, addr: null })}
                  className="px-4 py-2 rounded-xl text-stone-500 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  {t.common_cancel}
                </button>
                <button
                  type="submit"
                  disabled={loadingStore}
                  className="px-5 py-2 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black uppercase text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  {t.store_modal_pickup_save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Punto de Evento */}
      {modalEventAddr.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn font-sans">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 font-serif">
              <h3 className="font-black text-lg text-stone-900 dark:text-stone-100">
                {modalEventAddr.addr ? t.store_modal_event_edit : t.store_modal_event_new}
              </h3>
              <button
                type="button"
                onClick={() => setModalEventAddr({ open: false, addr: null })}
                className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEventAddr} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.store_modal_event_title_field}
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={modalEventAddr.addr?.title || ''}
                  placeholder="Ej: Espacio de Catas & Maridaje"
                  className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 font-bold border-stone-200 dark:border-stone-700"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_street} *</label>
                  <input
                    type="text"
                    name="street"
                    required
                    defaultValue={modalEventAddr.addr?.street || ''}
                    placeholder="Gamarra Kalea"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_number} *</label>
                  <input
                    type="text"
                    name="number"
                    required
                    defaultValue={modalEventAddr.addr?.number || ''}
                    placeholder="4"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_stair}</label>
                  <input
                    type="text"
                    name="stair"
                    defaultValue={modalEventAddr.addr?.stair || ''}
                    placeholder="A"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_floor}</label>
                  <input
                    type="text"
                    name="floor"
                    defaultValue={modalEventAddr.addr?.floor || ''}
                    placeholder="Bajo"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_door}</label>
                  <input
                    type="text"
                    name="door"
                    defaultValue={modalEventAddr.addr?.door || ''}
                    placeholder="1"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_postal_code} *</label>
                  <input
                    type="text"
                    name="postal_code"
                    required
                    defaultValue={modalEventAddr.addr?.postal_code || '48280'}
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_town} *</label>
                  <input
                    type="text"
                    name="town"
                    required
                    defaultValue={modalEventAddr.addr?.town || 'Lekeitio'}
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_province} *</label>
                  <input
                    type="text"
                    name="province"
                    required
                    defaultValue={modalEventAddr.addr?.province || 'Bizkaia'}
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.store_modal_event_notes_field}
                </label>
                <input
                  type="text"
                  name="notes"
                  defaultValue={modalEventAddr.addr?.notes || ''}
                  placeholder="Ej: Sala climatizada, aforo máx. 18 personas"
                  className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2 font-serif">
                <button
                  type="button"
                  onClick={() => setModalEventAddr({ open: false, addr: null })}
                  className="px-4 py-2 rounded-xl text-stone-500 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  {t.common_cancel}
                </button>
                <button
                  type="submit"
                  disabled={loadingStore}
                  className="px-5 py-2 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black uppercase text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  {t.store_modal_event_save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dirección de Entrega para Comprador */}
      {modalDeliveryAddr.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn font-sans">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 font-serif">
              <h3 className="font-black text-lg text-stone-900 dark:text-stone-100">
                {modalDeliveryAddr.addr ? t.deliv_edit_address : t.deliv_add_new_address}
              </h3>
              <button
                type="button"
                onClick={() => setModalDeliveryAddr({ open: false, addr: null })}
                className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDeliveryAddr} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.deliv_address_alias}
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={modalDeliveryAddr.addr?.title || ''}
                  placeholder={t.deliv_address_alias_placeholder}
                  className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 font-bold border-stone-200 dark:border-stone-700"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_street} *</label>
                  <input
                    type="text"
                    name="street"
                    required
                    defaultValue={modalDeliveryAddr.addr?.street || ''}
                    placeholder="Calle / Vía"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_number} *</label>
                  <input
                    type="text"
                    name="number"
                    required
                    defaultValue={modalDeliveryAddr.addr?.number || ''}
                    placeholder="4"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_stair}</label>
                  <input
                    type="text"
                    name="stair"
                    defaultValue={modalDeliveryAddr.addr?.stair || ''}
                    placeholder="A"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_floor}</label>
                  <input
                    type="text"
                    name="floor"
                    defaultValue={modalDeliveryAddr.addr?.floor || ''}
                    placeholder="2º"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_door}</label>
                  <input
                    type="text"
                    name="door"
                    defaultValue={modalDeliveryAddr.addr?.door || ''}
                    placeholder="B"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_postal_code} *</label>
                  <input
                    type="text"
                    name="postal_code"
                    required
                    defaultValue={modalDeliveryAddr.addr?.postal_code || ''}
                    placeholder="48280"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_town} *</label>
                  <input
                    type="text"
                    name="town"
                    required
                    defaultValue={modalDeliveryAddr.addr?.town || ''}
                    placeholder="Lekeitio"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">{t.profile_province} *</label>
                  <input
                    type="text"
                    name="province"
                    required
                    defaultValue={modalDeliveryAddr.addr?.province || ''}
                    placeholder="Bizkaia"
                    className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.deliv_shipping_notes}
                </label>
                <input
                  type="text"
                  name="notes"
                  defaultValue={modalDeliveryAddr.addr?.notes || ''}
                  placeholder="Ej: Dejar en portería si no estoy..."
                  className="w-full px-3 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_default_delivery_addr"
                  name="is_default"
                  defaultChecked={modalDeliveryAddr.addr?.is_default ?? deliveryAddresses.length === 0}
                  className="w-4 h-4 accent-[#FFE259] rounded cursor-pointer"
                />
                <label htmlFor="is_default_delivery_addr" className="font-bold text-stone-700 dark:text-stone-300 cursor-pointer">
                  {t.deliv_set_as_default}
                </label>
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2 font-serif">
                <button
                  type="button"
                  onClick={() => setModalDeliveryAddr({ open: false, addr: null })}
                  className="px-4 py-2 rounded-xl text-stone-500 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  {t.common_cancel}
                </button>
                <button
                  type="submit"
                  disabled={loadingDeliveryAddr}
                  className="px-5 py-2 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black uppercase text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  {loadingDeliveryAddr ? t.common_loading : t.profile_save_changes_btn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
