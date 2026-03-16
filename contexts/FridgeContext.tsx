import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FridgeItem = {
  id: string;
  name: string;
  addedAt: number;
};

type FridgeContextType = {
  items: FridgeItem[];
  addItem: (name: string) => void;
  removeItem: (id: string) => void;
  clearFridge: () => void;
};

const FridgeContext = createContext<FridgeContextType | null>(null);

const STORAGE_KEY = '@fridge_items';

export function FridgeProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FridgeItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return;
      const loaded: FridgeItem[] = JSON.parse(raw);
      // Dédupliquer les ids (migration pour les anciens items créés avec Date.now() non unique)
      const seen = new Set<string>();
      const deduped = loaded.map((item) => {
        if (seen.has(item.id)) {
          return { ...item, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` };
        }
        seen.add(item.id);
        return item;
      });
      setItems(deduped);
      // Réécrire si des ids ont été corrigés
      if (deduped.some((item, i) => item.id !== loaded[i].id)) {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(deduped));
      }
    });
  }, []);

  const persist = (newItems: FridgeItem[]) => {
    setItems(newItems);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  };

  const addItem = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setItems((prev) => {
      if (prev.some((i) => i.name.toLowerCase() === trimmed.toLowerCase())) return prev;
      const newItems = [...prev, { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name: trimmed, addedAt: Date.now() }];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeItem = (id: string) => persist(items.filter((i) => i.id !== id));

  const clearFridge = () => persist([]);

  return (
    <FridgeContext.Provider value={{ items, addItem, removeItem, clearFridge }}>
      {children}
    </FridgeContext.Provider>
  );
}

export function useFridge() {
  const ctx = useContext(FridgeContext);
  if (!ctx) throw new Error('useFridge must be used within FridgeProvider');
  return ctx;
}
