import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AIRecipe } from '@/lib/claude';

type FavoritesContextType = {
  favorites: AIRecipe[];
  isFavorited: (id: string) => boolean;
  toggleFavorite: (recipe: AIRecipe) => void;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY = '@favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<AIRecipe[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setFavorites(JSON.parse(raw));
    });
  }, []);

  const persist = (items: AIRecipe[]) => {
    setFavorites(items);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const isFavorited = (id: string) => favorites.some((r) => r.id === id);

  const toggleFavorite = (recipe: AIRecipe) => {
    if (isFavorited(recipe.id)) {
      persist(favorites.filter((r) => r.id !== recipe.id));
    } else {
      persist([recipe, ...favorites]);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorited, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
