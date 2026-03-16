import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export type UserPreferences = {
  goals: string[];
  diet: string[];
  allergies: string[];
  cooking_level: string;
  preferred_time: string;
  frequent_ingredients: string[];
  onboarding_completed: boolean;
};

const DEFAULT_PREFS: UserPreferences = {
  goals: [],
  diet: ['omnivore'],
  allergies: [],
  cooking_level: 'intermediate',
  preferred_time: '15-30',
  frequent_ingredients: [],
  onboarding_completed: false,
};

const STORAGE_KEY = '@user_preferences';

type PreferencesContextType = {
  preferences: UserPreferences;
  loading: boolean;
  draft: Partial<UserPreferences>;
  updateDraft: (partial: Partial<UserPreferences>) => void;
  savePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
};

const PreferencesContext = createContext<PreferencesContextType | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Partial<UserPreferences>>({});

  useEffect(() => {
    if (!user) {
      setPreferences(DEFAULT_PREFS);
      setLoading(false);
      return;
    }
    loadPreferences();
  }, [user?.id]);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      // Cache first
      const cached = await AsyncStorage.getItem(STORAGE_KEY);
      if (cached) setPreferences(JSON.parse(cached));

      // Sync Supabase
      const { data } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (data) {
        const prefs: UserPreferences = {
          goals: data.goals ?? [],
          diet: data.diet ?? ['omnivore'],
          allergies: data.allergies ?? [],
          cooking_level: data.cooking_level ?? 'intermediate',
          preferred_time: data.preferred_time ?? '15-30',
          frequent_ingredients: data.frequent_ingredients ?? [],
          onboarding_completed: data.onboarding_completed ?? false,
        };
        setPreferences(prefs);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      } else {
        // Nouveau user — pas de row Supabase, on reset le cache pour éviter les données stales d'un ancien compte
        await AsyncStorage.removeItem(STORAGE_KEY);
        setPreferences(DEFAULT_PREFS);
      }
    } catch {
      // Cache fallback already set above
    } finally {
      setLoading(false);
    }
  };

  const updateDraft = (partial: Partial<UserPreferences>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  };

  const savePreferences = async (prefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...prefs };
    setPreferences(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    await supabase.from('user_preferences').upsert({
      user_id: user!.id,
      ...prefs,
      updated_at: new Date().toISOString(),
    });
  };

  const completeOnboarding = async () => {
    const fullPrefs = { ...draft, onboarding_completed: true };
    await savePreferences(fullPrefs);
    setDraft({});
  };

  return (
    <PreferencesContext.Provider value={{ preferences, loading, draft, updateDraft, savePreferences, completeOnboarding }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}
