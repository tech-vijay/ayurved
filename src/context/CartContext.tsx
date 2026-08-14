import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { CartItem, Medicine } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  addItem: (medicine: Medicine, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('jbv_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('jbv_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (medicine: Medicine, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.medicine.id === medicine.id);
      if (existing) {
        return prev.map(i =>
          i.medicine.id === medicine.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { medicine, quantity: qty }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.medicine.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(i => (i.medicine.id === id ? { ...i, quantity: qty } : i)));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.medicine.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
