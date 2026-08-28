'use client';

import React, { createContext, useContext, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import type { Product } from '@/types/database';
import { getProductImage } from '@/lib/productHelpers';
import { getUserCart, syncUserCart } from '@/app/actions/cart';
import { createClient } from '@/lib/supabase/client';

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
  addToCart: (product: Product, sellerName?: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clave en localStorage aislada por ID de usuario
  const getStorageKey = (uid: string | null) => {
    return uid ? `ekhiteka_cart_${uid}` : 'ekhiteka_cart_guest';
  };

  // Función principal para cargar la cesta oficial desde Supabase
  const refreshCartFromCloud = useCallback(async () => {
    try {
      const { items: serverItems, isAuthenticated, userId } = await getUserCart();
      const activeUid = userId || null;
      setCurrentUserId(activeUid);

      if (isAuthenticated && activeUid) {
        // Usuario autenticado: Supabase es la única fuente de verdad
        setItems(serverItems);
        try {
          localStorage.setItem(getStorageKey(activeUid), JSON.stringify(serverItems));
          // Eliminar claves genéricas antiguas para no mezclar datos
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
        setItems([]);
        try {
          localStorage.removeItem('ekhiteka_cart');
          localStorage.removeItem('ekhiteka_cart_guest');
        } catch {}
      } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        refreshCartFromCloud();
      }
    });

    return () => {
      subscription.unsubscribe();
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
    (product: Product, sellerName?: string, quantity = 1) => {
      if (!product.is_unlimited_stock && (product.stock ?? 0) <= 0) return;
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
    },
    [saveItems]
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
      }}
    >
      {children}
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
