'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { updateProfile, changeUserPassword } from '@/app/actions/auth';
import type { Profile, PickupAddress, WhatsAppContact } from '@/types/database';
import { parseProfile, isProfileComplete } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import {
  User,
  Phone,
  MapPin,
  Lock,
  Check,
  Home,
  Pencil,
  Plus,
  Trash2,
  ChevronDown,
  MessageCircle,
  Store,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ProfileFormProps {
  profile?: Profile;
  userProfile?: Profile;
}

export function ProfileForm({ profile, userProfile }: ProfileFormProps) {
  const raw = profile || userProfile || ({} as Profile);
  const { t } = useLanguage();

  const [currentProfile, setCurrentProfile] = useState<Profile>(parseProfile(raw));
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  // Estados específicos de vendedor
  const [pickupAddresses, setPickupAddresses] = useState<PickupAddress[]>(
    currentProfile.pickup_addresses || []
  );
  const [whatsappContacts, setWhatsAppContacts] = useState<WhatsAppContact[]>(
    currentProfile.whatsapp_contacts || []
  );
  const [registeredSellers, setRegisteredSellers] = useState<Profile[]>([]);

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const p = currentProfile;
  const isSeller = p.role === 'vendedor' || p.role === 'admin';
  const isComplete = isProfileComplete(p);

  useEffect(() => {
    if (!isSeller) return;
    const loadRegisteredSellers = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'vendedor')
        .order('full_name');
      if (data) setRegisteredSellers(data as Profile[]);
    };
    loadRegisteredSellers();
  }, [isSeller]);

  const handleSetActiveAddress = (id: string) => {
    const updated = pickupAddresses.map((addr) => ({
      ...addr,
      is_active: addr.id === id,
    }));
    setPickupAddresses(updated);
  };

  const handleAddAddress = () => {
    const newAddr: PickupAddress = {
      id: 'addr_' + Date.now(),
      title: 'Punto de Recogida #' + (pickupAddresses.length + 1),
      street: 'Gamarra Kalea',
      number: '4',
      town: 'Lekeitio',
      province: 'Bizkaia',
      postal_code: '48280',
      schedule: '10:00 - 14:30 | 17:00 - 20:30',
      is_active: pickupAddresses.length === 0,
    };
    setPickupAddresses([...pickupAddresses, newAddr]);
  };

  const handleUpdateAddress = (id: string, field: keyof PickupAddress, value: any) => {
    const updated = pickupAddresses.map((addr) =>
      addr.id === id ? { ...addr, [field]: value } : addr
    );
    setPickupAddresses(updated);
  };

  const handleDeleteAddress = (id: string) => {
    if (pickupAddresses.length <= 1) {
      alert('Debe haber al menos una dirección de tienda/recogida registrada.');
      return;
    }
    const filtered = pickupAddresses.filter((addr) => addr.id !== id);
    if (!filtered.some((a) => a.is_active)) {
      filtered[0].is_active = true;
    }
    setPickupAddresses(filtered);
  };

  const handleDeleteWhatsApp = (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres borrar este contacto de WhatsApp de la tienda?')) {
      return;
    }
    setWhatsAppContacts((contacts) => contacts.filter((contact) => contact.id !== id));
  };

  const handleToggleWhatsApp = (id: string) => {
    setWhatsAppContacts((contacts) => contacts.map((contact) => {
      if (contact.id !== id) return { ...contact, enabled: false };
      if (!contact.phone.trim()) return contact;
      return { ...contact, enabled: !contact.enabled };
    }));
  };

  const handleAddWhatsApp = () => {
    setWhatsAppContacts((contacts) => [
      ...contacts,
      { id: `whatsapp_${Date.now()}`, name: '', phone: '', enabled: false },
    ]);
  };

  const handleWhatsAppSellerChange = (id: string, sellerId: string) => {
    const seller = registeredSellers.find((item) => item.id === sellerId);
    setWhatsAppContacts((contacts) => contacts.map((contact) => contact.id === id
      ? seller
        ? { ...contact, seller_id: seller.id, name: seller.full_name, phone: seller.phone || '' }
        : { ...contact, seller_id: undefined, name: '', phone: '' }
      : contact));
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileMsg(null);

    const formData = new FormData(e.currentTarget);
    const validWhatsAppContacts = whatsappContacts
      .filter((contact) => contact.phone.trim())
      .map((contact) => ({ ...contact, phone: contact.phone.trim() }));
    formData.append('whatsapp_contacts', JSON.stringify(validWhatsAppContacts));
    const enabledWhatsApp = validWhatsAppContacts.find((contact) => contact.enabled);
    if (enabledWhatsApp) {
      formData.append('whatsapp_phone', enabledWhatsApp.phone);
      formData.append('whatsapp_enabled', 'on');
    }
    formData.append('pickup_addresses', JSON.stringify(pickupAddresses));

    const res = await updateProfile(formData);
    setLoadingProfile(false);

    if (res?.error) {
      setProfileMsg({ text: res.error, isError: true });
    } else {
      setProfileMsg({ text: t.common_success, isError: false });
      if (res?.updatedProfile) {
        setCurrentProfile(parseProfile(res.updatedProfile));
        setWhatsAppContacts(parseProfile(res.updatedProfile).whatsapp_contacts || []);
      }
      setIsEditing(false);
      setTimeout(() => setProfileMsg(null), 3500);
    }
  };

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
      setPasswordMsg({ text: '¡Contraseña actualizada con éxito!', isError: false });
      (e.target as HTMLFormElement).reset();
      setTimeout(() => {
        setPasswordMsg(null);
        setIsPasswordOpen(false);
      }, 2500);
    }
  };

  const formattedAddress = [
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
    <div className="space-y-8 font-serif">
      {/* 1. TARJETA PRINCIPAL DE PERFIL */}
      <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Cabecera con Estado y Botón Editar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-[#C68D07] dark:text-[#FFE259]">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100">
                  {p.full_name || 'Usuario EkhiTeka'}
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
                {t.profile_subtitle}
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer hover:scale-105 shrink-0"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{t.profile_edit_btn}</span>
            </button>
          )}
        </div>

        {profileMsg && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold text-center font-sans ${
              profileMsg.isError
                ? 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
                : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
            }`}
          >
            {profileMsg.text}
          </div>
        )}

        {/* ----------------- MODO VISTA CON MODO OSCURO NÍTIDO ----------------- */}
        {!isEditing ? (
          <div className="space-y-6 font-sans text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-400 block">
                  {t.profile_first_name} & {t.profile_last_name_1}
                </span>
                <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                  {[p.first_name, p.last_name_1, p.last_name_2].filter(Boolean).join(' ') || p.full_name || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-400 block">
                  {t.profile_dni}
                </span>
                <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm uppercase">
                  {p.dni || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-400 block">
                  {t.profile_birth_date}
                </span>
                <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                  {p.birth_date || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-400 block">
                  {t.profile_phone}
                </span>
                <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                  {p.phone || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-400 block">
                  {t.auth_email}
                </span>
                <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                  {p.email || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-400 block">
                  {t.profile_town} · {t.profile_province}
                </span>
                <p className="font-bold text-stone-900 dark:text-[#F5F5F0] text-sm">
                  {p.town || 'Lekeitio'} ({p.province || 'Bizkaia'})
                </p>
              </div>
            </div>

            {/* Dirección Personal con Modo Oscuro */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#1F1E1C] border border-stone-200/80 dark:border-stone-800 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#C68D07] dark:text-[#FFE259] flex items-center gap-1.5 font-serif">
                <Home className="w-3.5 h-3.5" />
                <span>{t.profile_address_data}</span>
              </span>
              <p className="text-sm font-bold text-stone-800 dark:text-[#F5F5F0]">
                {formattedAddress || t.profile_not_specified}
              </p>
            </div>

            {/* SECCIÓN VENDEDOR: WHATSAPP Y TIENDAS */}
            {isSeller && (
              <div className="space-y-4 pt-4 border-t border-stone-200/60 dark:border-stone-800">
                {/* WhatsApp Tienda */}
                <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
                  whatsappContacts.some((contact) => contact.enabled)
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                    : 'bg-transparent border-stone-200 dark:border-stone-800'
                }`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block font-serif">
                        WhatsApp Oficial de la Tienda
                      </span>
                      {whatsappContacts.length === 0 ? (
                        <p className="text-sm font-black text-stone-900 dark:text-[#F5F5F0]">
                          No hay contacto. Pulsa Editar para añadirlo.
                        </p>
                      ) : (
                        <div className="space-y-2 mt-1">
                          {whatsappContacts.map((contact) => (
                            <div key={contact.id} className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-black text-stone-900 dark:text-[#F5F5F0]">
                                {contact.name || 'Sin nombre'} · +{contact.phone}
                                {!contact.enabled && <span className="text-xs font-medium text-stone-500"> · Deshabilitado</span>}
                              </p>
                              <button
                                type="button"
                                onClick={() => handleToggleWhatsApp(contact.id)}
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-[#1C1B19] border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-black text-[10px] uppercase cursor-pointer"
                              >
                                {contact.enabled ? 'Deshabilitar' : 'Habilitar'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-[#1C1B19] border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-black text-[10px] uppercase cursor-pointer"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteWhatsApp(contact.id)}
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-[#1C1B19] border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 font-black text-[10px] uppercase cursor-pointer"
                              >
                                Borrar
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Direcciones de Recogida en Tienda */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-400 block font-serif">
                    Puntos de Entrega & Recogida en Tienda ({pickupAddresses.length})
                  </span>
                  <div className="space-y-2">
                    {pickupAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                          addr.is_active
                            ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
                            : 'bg-stone-50 dark:bg-[#1F1E1C] border-stone-200 dark:border-stone-800'
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <Store className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
                            <h4 className="font-bold text-stone-900 dark:text-[#F5F5F0] truncate">{addr.title}</h4>
                            {addr.is_active && (
                              <span className="px-2 py-0.5 rounded-full bg-[#FFE259] text-[#1D1D1B] font-black text-[9px] uppercase">
                                Activa
                              </span>
                            )}
                          </div>
                          <p className="text-stone-600 dark:text-stone-300 text-[11px] truncate">
                            {addr.street} {addr.number || ''}, {addr.town} ({addr.province}) · {addr.schedule || ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* MODO EDICIÓN */
          <form onSubmit={handleProfileSubmit} className="space-y-6 font-sans text-xs animate-fadeIn">
            {/* 1. Nombre y Apellidos */}
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

            {/* 2. DNI, Fecha Nacimiento y Teléfono */}
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

            {/* 3. Dirección Personal */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block font-serif">
                {t.profile_address_data}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_province} *
                  </label>
                  <input
                    type="text"
                    name="province"
                    required
                    defaultValue={p.province || 'Bizkaia'}
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_town} *
                  </label>
                  <input
                    type="text"
                    name="town"
                    required
                    defaultValue={p.town || 'Lekeitio'}
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_postal_code} *
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    required
                    defaultValue={p.postal_code || ''}
                    placeholder="48280"
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                <div className="col-span-2 sm:col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_street} *
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    defaultValue={p.street || ''}
                    placeholder="Gamarra Kalea"
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_number} *
                  </label>
                  <input
                    type="text"
                    name="number"
                    required
                    defaultValue={p.number || ''}
                    placeholder="4"
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
                    placeholder="A"
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_floor} *
                  </label>
                  <input
                    type="text"
                    name="floor"
                    required
                    defaultValue={p.floor || ''}
                    placeholder="2"
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.profile_door} *
                  </label>
                  <input
                    type="text"
                    name="door"
                    required
                    defaultValue={p.door || ''}
                    placeholder="B"
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN VENDEDOR: CONFIGURACIÓN WHATSAPP Y PUNTOS DE RECOGIDA (MODO EDICIÓN) */}
            {isSeller && (
              <div className="space-y-6 pt-4 border-t border-stone-200 dark:border-stone-800">
                {/* WhatsApp Config */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  whatsappContacts.some((contact) => contact.enabled)
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                    : 'bg-transparent border-stone-200 dark:border-stone-800'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 font-serif">
                        WhatsApp Oficial de la Tienda
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAddWhatsApp}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-[#1C1B19] border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-black text-[10px] uppercase cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Añadir contacto
                      </button>
                      <button
                        type="submit"
                        disabled={loadingProfile}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-[10px] uppercase cursor-pointer disabled:opacity-50"
                      >
                        <Check className="w-3 h-3" /> Guardar datos
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Solo un contacto puede estar habilitado para los botones de WhatsApp de la web.
                  </p>

                  <div className="space-y-3">
                    {whatsappContacts.map((contact) => (
                      <div key={contact.id} className="flex flex-wrap items-end gap-2 p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/60 dark:bg-[#141312]/60">
                        <label className="w-full">
                          <span className="block mb-1 font-bold text-stone-700 dark:text-stone-300">Origen del contacto</span>
                          <select
                            value={contact.seller_id || ''}
                            onChange={(e) => handleWhatsAppSellerChange(contact.id, e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                          >
                            <option value="">Introducir manualmente</option>
                            {registeredSellers.map((seller) => (
                              <option key={seller.id} value={seller.id}>
                                {seller.full_name} {seller.phone ? `(${seller.phone})` : '(sin teléfono)'}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="flex-1 min-w-[150px]">
                          <span className="block mb-1 font-bold text-stone-700 dark:text-stone-300">Nombre</span>
                          <input
                            type="text"
                            required={!contact.seller_id}
                            value={contact.name}
                            disabled={Boolean(contact.seller_id)}
                            onChange={(e) => setWhatsAppContacts((contacts) => contacts.map((item) => item.id === contact.id ? { ...item, name: e.target.value } : item))}
                            placeholder="Nombre del contacto"
                            className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                          />
                        </label>
                        <label className="flex-1 min-w-[170px]">
                          <span className="block mb-1 font-bold text-stone-700 dark:text-stone-300">Teléfono</span>
                          <input
                            type="tel"
                            value={contact.phone}
                            disabled={Boolean(contact.seller_id)}
                            onChange={(e) => setWhatsAppContacts((contacts) => contacts.map((item) => item.id === contact.id ? { ...item, phone: e.target.value } : item))}
                            placeholder="34600000000"
                            className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleToggleWhatsApp(contact.id)}
                          className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl border font-black text-[10px] uppercase cursor-pointer ${contact.enabled ? 'border-emerald-300 text-emerald-800' : 'border-stone-300 text-stone-600'}`}
                        >
                          <Check className="w-3 h-3" /> {contact.enabled ? 'Habilitado' : 'Habilitar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteWhatsApp(contact.id)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 font-black text-[10px] uppercase cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Borrar
                        </button>
                      </div>
                    ))}

                  </div>
                </div>

                {/* Gestor de Direcciones de Tienda */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
                      <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 font-serif">
                        Direcciones de Recogida / Puntos de Venta
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddAddress}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-bold text-xs uppercase cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir Punto</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {pickupAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-4 rounded-2xl border-2 space-y-3 ${
                          addr.is_active
                            ? 'border-[#FFE259] bg-amber-50/40 dark:bg-amber-950/20'
                            : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#1F1E1C]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={addr.title}
                              onChange={(e) => handleUpdateAddress(addr.id, 'title', e.target.value)}
                              placeholder="Nombre de la tienda / sede"
                              className="font-bold px-2 py-1 rounded-lg border text-xs bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                            />
                            {addr.is_active ? (
                              <span className="px-2 py-0.5 rounded-full bg-[#FFE259] text-[#1D1D1B] font-black text-[9px] uppercase">
                                Activa para clientes
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetActiveAddress(addr.id)}
                                className="px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 hover:bg-[#FFE259] text-stone-800 dark:text-stone-200 hover:text-[#1D1D1B] font-bold text-[9px] uppercase transition-colors cursor-pointer"
                              >
                                Activar esta
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1.5 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Eliminar punto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <input
                            type="text"
                            value={addr.street}
                            onChange={(e) => handleUpdateAddress(addr.id, 'street', e.target.value)}
                            placeholder="Calle"
                            className="px-2.5 py-1.5 rounded-lg border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                          />
                          <input
                            type="text"
                            value={addr.number || ''}
                            onChange={(e) => handleUpdateAddress(addr.id, 'number', e.target.value)}
                            placeholder="Nº"
                            className="px-2.5 py-1.5 rounded-lg border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                          />
                          <input
                            type="text"
                            value={addr.town}
                            onChange={(e) => handleUpdateAddress(addr.id, 'town', e.target.value)}
                            placeholder="Municipio"
                            className="px-2.5 py-1.5 rounded-lg border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                          />
                          <input
                            type="text"
                            value={addr.province}
                            onChange={(e) => handleUpdateAddress(addr.id, 'province', e.target.value)}
                            placeholder="Provincia"
                            className="px-2.5 py-1.5 rounded-lg border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                          />
                        </div>

                        <input
                          type="text"
                          value={addr.schedule || ''}
                          onChange={(e) => handleUpdateAddress(addr.id, 'schedule', e.target.value)}
                          placeholder="Horario de atención (Ej: Lun-Vie 10:00-14:30 | 17:00-20:30)"
                          className="w-full px-2.5 py-1.5 rounded-lg border text-[11px] bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-3 font-serif">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold text-xs uppercase tracking-wider hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                {t.common_cancel}
              </button>
              <button
                type="submit"
                disabled={loadingProfile}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{loadingProfile ? t.common_loading : t.profile_save_changes_btn}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. TARJETA CAMBIAR CONTRASEÑA */}
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
                {isPasswordOpen ? 'Introduce tu contraseña actual y la nueva clave.' : 'Pulsa aquí para cambiar tu contraseña de acceso.'}
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
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="current_password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {t.profile_new_password} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="new_password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {t.profile_confirm_password} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="confirm_password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-[#141312] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700"
                />
              </div>
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
  );
}
