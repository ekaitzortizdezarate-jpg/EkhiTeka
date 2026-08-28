'use client';

import React, { createContext, useContext, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { Product } from '@/types/database';
import { getProductImage } from '@/lib/productHelpers';
import { getUserCart, syncUserCart } from '@/app/actions/cart';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { AlertCircle, X, User } from 'lucide-react';

export interface CartItem {
  productId: string;
  sellerId: string;
  sellerName?: string;
  name: string;
  category?: string;
  format?: string;
  price: number;
  imageUrl?: string | null;
  originRegion?: string | null;
  quantity: number;
  product?: Product;
}

interface CartContextType {
  items: CartItem[];
  cart: CartItem[];
  addToCart: (product: Product, sellerName?: string, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isProfileComplete: boolean;
  isAuthenticated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language } = useLanguage();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileModalType, setProfileModalType] = useState<'incomplete' | 'login'>('incomplete');
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clave en localStorage aislada por ID de usuario
  const getStorageKey = (uid: string | null) => {
    return uid ? `ekhiteka_cart_${uid}` : 'ekhiteka_cart_guest';
  };

  // Función principal para cargar la cesta oficial desde Supabase y el estado del perfil
  const refreshCartFromCloud = useCallback(async () => {
    try {
      const { items: serverItems, isAuthenticated: authOk, userId, isProfileComplete: profileOk } = await getUserCart();
      const activeUid = userId || null;
      setCurrentUserId(activeUid);
      setIsAuthenticated(authOk);
      setIsProfileComplete(profileOk);

      if (authOk && activeUid) {
        // Usuario autenticado: Supabase es la única fuente de verdad
        setItems(serverItems);
        try {
          localStorage.setItem(getStorageKey(activeUid), JSON.stringify(serverItems));
          localStorage.removeItem('ekhiteka_cart');
          localStorage.removeItem('ekhiteka_cart_guest');
        } catch {}
      } else {
        // Usuario no autenticado / cerrado sesión: Cesta vacía
        setItems([]);
        try {
          localStorage.removeItem('ekhiteka_cart');
          localStorage.removeItem('ekhiteka_cart_guest');
        } catch {}
      }
    } catch {
      // Ignorar errores de red
    }
  }, []);

  // 1. Cargar y sincronizar en montaje y en cambios de ruta (login, logout, navegación)
  useEffect(() => {
    refreshCartFromCloud();
  }, [pathname, refreshCartFromCloud]);

  // 2. Suscribirse a eventos de autenticación de Supabase (login / logout reactivo)
  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setCurrentUserId(null);
        setIsAuthenticated(false);
        setIsProfileComplete(false);
        setItems([]);
        try {
          localStorage.removeItem('ekhiteka_cart');
          localStorage.removeItem('ekhiteka_cart_guest');
        } catch {}
      } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        refreshCartFromCloud();
      }
    });

    const handleProfileUpdate = () => {
      refreshCartFromCloud();
    };
    window.addEventListener('ekhiteka_profile_updated', handleProfileUpdate);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('ekhiteka_profile_updated', handleProfileUpdate);
    };
  }, [refreshCartFromCloud]);

  // 3. Sincronización automática multidispositivo (al volver a la app o enfocar la ventana)
  useEffect(() => {
    const handleFocus = () => refreshCartFromCloud();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refreshCartFromCloud();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [refreshCartFromCloud]);

  // 4. Guardar cambios en estado local, localStorage aislado y Supabase en tiempo real
  const saveItems = useCallback(
    (newItems: CartItem[]) => {
      setItems(newItems);

      try {
        const storageKey = getStorageKey(currentUserId);
        localStorage.setItem(storageKey, JSON.stringify(newItems));
        window.dispatchEvent(new Event('ekhiteka_cart_updated'));
      } catch {}

      if (currentUserId) {
        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = setTimeout(() => {
          syncUserCart(newItems).catch(() => {});
        }, 300);
      }
    },
    [currentUserId]
  );

  const addToCart = useCallback(
    (product: Product, sellerName?: string, quantity = 1): boolean => {
      // 1. Control de autenticación y perfil completo obligatorio para compradores
      if (!isAuthenticated) {
        setProfileModalType('login');
        setProfileModalOpen(true);
        return false;
      }

      if (!isProfileComplete) {
        setProfileModalType('incomplete');
        setProfileModalOpen(true);
        return false;
      }

      if (!product.is_unlimited_stock && (product.stock ?? 0) <= 0) return false;
      const maxStock = product.is_unlimited_stock ? 99 : Math.max(1, product.stock ?? 1);

      setItems((prevItems) => {
        const existingIdx = prevItems.findIndex((i) => (i.productId || i.product?.id) === product.id);
        let updated: CartItem[];
        if (existingIdx > -1) {
          updated = [...prevItems];
          const newQty = Math.min(maxStock, updated[existingIdx].quantity + quantity);
          updated[existingIdx].quantity = newQty;
        } else {
          const initialQty = Math.min(maxStock, quantity);
          const newItem: CartItem = {
            productId: product.id,
            sellerId: product.seller_id,
            sellerName: sellerName || 'EkhiTeka Selección',
            name: product.name,
            category: product.category_id,
            format: product.format,
            price: Number(product.price),
            imageUrl: getProductImage(product),
            originRegion: product.origin_region,
            quantity: initialQty,
            product,
          };
          updated = [...prevItems, newItem];
        }
        saveItems(updated);
        return updated;
      });

      setIsCartOpen(true);
      return true;
    },
    [isAuthenticated, isProfileComplete, saveItems]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setItems((prevItems) => {
        const updated = prevItems.filter((i) => (i.productId || i.product?.id) !== productId);
        saveItems(updated);
        return updated;
      });
    },
    [saveItems]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setItems((prevItems) => {
        const item = prevItems.find((i) => (i.productId || i.product?.id) === productId);
        const maxStock = item?.product?.is_unlimited_stock ? 99 : Math.max(1, item?.product?.stock ?? 99);
        const safeQty = Math.min(maxStock, quantity);

        const updated = prevItems.map((i) =>
          (i.productId || i.product?.id) === productId ? { ...i, quantity: safeQty } : i
        );
        saveItems(updated);
        return updated;
      });
    },
    [removeFromCart, saveItems]
  );

  const clearCart = useCallback(() => {
    saveItems([]);
  }, [saveItems]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + Number(i.price || i.product?.price || 0) * i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        cart: items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        isProfileComplete,
        isAuthenticated,
      }}
    >
      {children}

      {/* Modal Requisito de Perfil Completo para Compradores */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-fadeIn">
          <div className="bg-white dark:bg-[#1C1B19] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border-2 border-stone-200 dark:border-stone-800 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5 text-[#C68D07] dark:text-[#FFE259]">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h3 className="text-lg font-black font-serif text-stone-900 dark:text-stone-100 leading-tight">
                  {profileModalType === 'login'
                    ? (language === 'eu' ? 'Hasi Saioa Saskira Gehitzeko' : 'Inicia Sesión para Comprar')
                    : (language === 'eu' ? 'Osatu Zure Profila Saskira Gehitzeko' : 'Completa tu Perfil para Comprar')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-sm text-stone-600 dark:text-stone-300">
              {profileModalType === 'login' ? (
                <p>
                  {language === 'eu'
                    ? 'Produktuak saskira gehitzeko eta zure eskaerak kudeatzeko saioa hasi edo kontu bat sortu behar duzu.'
                    : 'Para añadir productos a tu cesta y realizar compras en la tienda, necesitas iniciar sesión con tu cuenta de comprador.'}
                </p>
              ) : (
                <>
                  <p>
                    {language === 'eu'
                      ? 'Erosketak egin eta produktuak saskira gehitu ahal izateko, derrigorrezkoa da zure bezero profileko datuak beteta izatea.'
                      : 'Para poder añadir productos a tu cesta y tramitar pedidos, es obligatorio completar previamente los datos de tu perfil de comprador.'}
                  </p>
                  <p className="text-xs text-stone-400">
                    {language === 'eu'
                      ? 'Izena, NAN, telefonoa eta bidalketa helbidea beharrezkoak dira eskaera eta ordainketa zuzena bermatzeko.'
                      : 'Nombre, apellidos, DNI, teléfono y dirección de entrega son obligatorios para garantizar la correcta preparación y entrega de tus compras.'}
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100 dark:border-stone-800 font-serif">
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                {language === 'eu' ? 'Utzi' : 'Cancelar'}
              </button>
              <Link
                href={profileModalType === 'login' ? '/login' : '/perfil'}
                onClick={() => setProfileModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>
                  {profileModalType === 'login'
                    ? (language === 'eu' ? 'Hasi Saioa' : 'Iniciar Sesión')
                    : (language === 'eu' ? 'Profila Bete Orain' : 'Completar Perfil')}
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

