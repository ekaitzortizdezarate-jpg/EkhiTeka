'use client';

import React, { createContext, useContext, useSyncExternalStore, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import type { Product } from '@/types/database';
import { getProductImage } from '@/lib/productHelpers';
import { getUserCart, syncUserCart } from '@/app/actions/cart';

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

const CART_STORAGE_KEY = 'ekhiteka_cart';

let cachedItems: CartItem[] = [];
let cachedString = '';

function subscribe(callback: () => void) {
  window.addEventListener('ekhiteka_cart_updated', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('ekhiteka_cart_updated', callback);
    window.removeEventListener('storage', callback);
  };
}

function getSnapshot(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY) || '[]';
    if (raw !== cachedString) {
      cachedString = raw;
      cachedItems = JSON.parse(raw);
    }
    return cachedItems;
  } catch {
    return cachedItems;
  }
}

const EMPTY_CART: CartItem[] = [];
function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveItems = useCallback((newItems: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      window.dispatchEvent(new Event('ekhiteka_cart_updated'));
    } catch {
      // Ignore
    }

    // Debounced cloud sync
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      syncUserCart(newItems).catch(() => {});
    }, 400);
  }, []);

  // Multi-device sync on mount and on window focus / visibility change
  useEffect(() => {
    let isMounted = true;

    async function syncWithCloud() {
      try {
        const { items: serverItems, isAuthenticated } = await getUserCart();
        if (!isMounted || !isAuthenticated) return;

        const localItems = getSnapshot();

        // If server items differ from local items, synchronize
        const serverStr = JSON.stringify(serverItems);
        const localStr = JSON.stringify(localItems);

        if (serverStr !== localStr) {
          if (localItems.length === 0 && serverItems.length > 0) {
            localStorage.setItem(CART_STORAGE_KEY, serverStr);
            window.dispatchEvent(new Event('ekhiteka_cart_updated'));
          } else if (localItems.length > 0 && serverItems.length === 0) {
            await syncUserCart(localItems);
          } else if (localItems.length > 0 && serverItems.length > 0) {
            // Merge carts without losing items
            const map = new Map<string, CartItem>();
            serverItems.forEach((it) => map.set(it.productId, it));
            localItems.forEach((it) => {
              if (map.has(it.productId)) {
                const existing = map.get(it.productId)!;
                map.set(it.productId, { ...it, quantity: Math.max(existing.quantity, it.quantity) });
              } else {
                map.set(it.productId, it);
              }
            });
            const merged = Array.from(map.values());
            const mergedStr = JSON.stringify(merged);
            localStorage.setItem(CART_STORAGE_KEY, mergedStr);
            window.dispatchEvent(new Event('ekhiteka_cart_updated'));
            await syncUserCart(merged);
          }
        }
      } catch {
        // Ignore network errors
      }
    }

    syncWithCloud();

    const handleFocus = () => {
      syncWithCloud();
    };

    window.addEventListener('focus', handleFocus);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') syncWithCloud();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, []);

  const addToCart = useCallback((product: Product, sellerName?: string, quantity = 1) => {
    if (!product.is_unlimited_stock && (product.stock ?? 0) <= 0) return;
    const maxStock = product.is_unlimited_stock ? 99 : Math.max(1, product.stock ?? 1);

    const existingIdx = items.findIndex((i) => (i.productId || i.product?.id) === product.id);
    if (existingIdx > -1) {
      const updated = [...items];
      const newQty = Math.min(maxStock, updated[existingIdx].quantity + quantity);
      updated[existingIdx].quantity = newQty;
      saveItems(updated);
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
      saveItems([...items, newItem]);
    }
    setIsCartOpen(true);
  }, [items]);

  const removeFromCart = useCallback((productId: string) => {
    saveItems(items.filter((i) => (i.productId || i.product?.id) !== productId));
  }, [items]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = items.find((i) => (i.productId || i.product?.id) === productId);
    const maxStock = item?.product?.is_unlimited_stock ? 99 : Math.max(1, item?.product?.stock ?? 99);
    const safeQty = Math.min(maxStock, quantity);

    const updated = items.map((i) =>
      (i.productId || i.product?.id) === productId ? { ...i, quantity: safeQty } : i
    );
    saveItems(updated);
  }, [items, removeFromCart]);

  const clearCart = useCallback(() => {
    saveItems([]);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, i) => sum + Number(i.price || i.product?.price || 0) * i.quantity, 0), [items]);

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
