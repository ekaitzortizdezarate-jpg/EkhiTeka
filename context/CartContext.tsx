'use client';

import React, { createContext, useContext, useSyncExternalStore, useMemo } from 'react';
import type { Product } from '@/types/database';
import { getProductImage } from '@/lib/productHelpers';

export interface CartItem {
  productId: string;
  sellerId: string;
  sellerName?: string;
  name: string;
  category: string;
  format: string;
  price: number;
  imageUrl?: string | null;
  originRegion?: string | null;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, sellerName?: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
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
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const saveItems = (newItems: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      window.dispatchEvent(new Event('ekhiteka_cart_updated'));
    } catch {
      // Ignore
    }
  };

  const addToCart = (product: Product, sellerName?: string, quantity = 1) => {
    const existingIdx = items.findIndex((i) => i.productId === product.id);
    if (existingIdx > -1) {
      const updated = [...items];
      updated[existingIdx].quantity += quantity;
      saveItems(updated);
    } else {
      const newItem: CartItem = {
        productId: product.id,
        sellerId: product.seller_id,
        sellerName: sellerName || 'EkhiTeka Artesano',
        name: product.name,
        category: product.category_id,
        format: product.format,
        price: Number(product.price),
        imageUrl: getProductImage(product),
        originRegion: product.origin_region,
        quantity,
      };
      saveItems([...items, newItem]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    saveItems(items.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = items.map((i) =>
      i.productId === productId ? { ...i, quantity } : i
    );
    saveItems(updated);
  };

  const clearCart = () => {
    saveItems([]);
  };

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
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
