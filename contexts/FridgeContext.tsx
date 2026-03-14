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
      if (raw) setItems(JSON.parse(raw));
    });
  }, []);

  const persist = (newItems: FridgeItem[]) => {
    setItems(newItems);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  };

  const addItem = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (items.some((i) => i.name.toLowerCase() === trimmed.toLowerCase())) return;
    persist([...items, { id: Date.now().toString(), name: trimmed, addedAt: Date.now() }]);
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
