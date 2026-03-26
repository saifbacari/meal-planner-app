import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { Chip } from '@/components/ui/Chip';
import { RecipeCard } from '@/components/ui/RecipeCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { useFridge } from '@/contexts/FridgeContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { generateRecipeSuggestions, filterRecipes, AIRecipe } from '@/lib/claude';
import { RecipeDetailModal } from '@/components/modals/RecipeDetailModal';
import { Colors, ColorPalette, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const PHYSICAL_STATES = [
  { id: 'fit', label: 'En forme' },
  { id: 'tired', label: 'Fatigué' },
  { id: 'post_sport', label: 'Après sport' },
  { id: 'sleep', label: 'Sommeil' },
];

const CRAVINGS = [
  { id: 'quick', label: 'Rapide' },
  { id: 'comforting', label: 'Réconfortant' },
  { id: 'light', label: 'Léger' },
  { id: 'spicy', label: 'Épicé' },
];

const hasApiKey =
  !!process.env.EXPO_PUBLIC_CLAUDE_API_KEY &&
  process.env.EXPO_PUBLIC_CLAUDE_API_KEY !== 'your_claude_api_key_here';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items: fridgeItems } = useFridge();
  const { preferences } = usePreferences();

  const [selectedPhysicalState, setSelectedPhysicalState] = useState('fit');
  const [selectedCraving, setSelectedCraving] = useState('comforting');
  const { isFavorited, toggleFavorite } = useFavorites();
  const [selectedRecipe, setSelectedRecipe] = useState<AIRecipe | null>(null);
  const [aiRecipes, setAiRecipes] = useState<AIRecipe[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const ingredients = fridgeItems.map((i) => i.name);

  const prefTags = (() => {
    const tags: { emoji: string; label: string }[] = [];

    const dietLabels: Record<string, string> = {
      vegetarian: 'Végétarien', vegan: 'Vegan', pescatarian: 'Pescétarien',
      halal: 'Halal', kosher: 'Casher', no_pork: 'Sans porc',
    };
    if (preferences.diet && preferences.diet.length > 0) {
      preferences.diet
        .filter((d) => d !== 'omnivore')
        .forEach((d) => tags.push({ emoji: '🥗', label: dietLabels[d] ?? d }));
    }

    const allergyLabels: Record<string, string> = {
      gluten: 'Gluten', lactose: 'Lactose', nuts: 'Noix',
      seafood: 'Fruits de mer', eggs: 'Œufs', soy: 'Soja', peanuts: 'Arachides',
    };
    if (preferences.allergies && preferences.allergies.length > 0) {
      preferences.allergies.forEach((a) => tags.push({ emoji: '🚫', label: `Sans ${allergyLabels[a] ?? a}` }));
    }

    if (preferences.preferred_time && preferences.preferred_time !== '15-30') {
      const timeLabels: Record<string, string> = { '5-15': '< 15 min', '30-60': '30–60 min', '60+': '> 1h' };
      const tl = timeLabels[preferences.preferred_time];
      if (tl) tags.push({ emoji: '⏱️', label: tl });
    }

    const goalLabels: Record<string, string> = {
      lose_weight: 'Perte de poids', eat_healthy: 'Manger sain',
      build_muscle: 'Prise de masse', maintain: 'Maintien',
    };
    if (preferences.goals && preferences.goals.length > 0) {
      preferences.goals.forEach((g) => tags.push({ emoji: '🎯', label: goalLabels[g] ?? g }));
    }

    return tags;
  })();

  const generateSuggestions = useCallback(async () => {
    if (ingredients.length === 0 || !hasApiKey) return;
    setAiLoading(true);
    setAiError('');
    try {
      const recipes = await generateRecipeSuggestions(ingredients, {
        diet: preferences.diet,
        allergies: preferences.allergies,
        cooking_level: preferences.cooking_level,
        preferred_time: preferences.preferred_time,
        goals: preferences.goals,
      });
      setAiRecipes(recipes);
    } catch (e: unknown) {
      setAiError(e instanceof Error ? e.message : 'Erreur lors de la génération');
    } finally {
      setAiLoading(false);
    }
  }, [ingredients.join(','), preferences.diet?.join(','), preferences.allergies?.join(','), preferences.cooking_level, preferences.preferred_time, preferences.goals?.join(',')]);

  // Auto-generate when fridge content or preferences change
  useEffect(() => {
    if (ingredients.length === 0) {
      setAiRecipes([]);
      return;
    }
    generateSuggestions();
  }, [ingredients.join(','), preferences.diet?.join(','), preferences.allergies?.join(','), preferences.cooking_level, preferences.preferred_time, preferences.goals?.join(',')]);


  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.background, paddingTop: insets.top + Spacing.sm },
        ]}
      >
        <MaterialIcons name="restaurant" size={28} color={colors.text} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Qu'est-ce qu'on mange ? 🍽️
        </Text>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialIcons name="notifications" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Frigo Section */}
        <View style={[styles.section, { marginTop: Spacing.md }]}>
          <TouchableOpacity
            style={[styles.fridgeCard, { borderColor: '#13ec5b', backgroundColor: 'rgba(19, 236, 91, 0.05)' }]}
            onPress={() => router.navigate('/(tabs)/fridge')}
          >
            <View style={styles.fridgeCardHeader}>
              <MaterialIcons name="kitchen" size={22} color="#13ec5b" />
              <Text style={[styles.fridgeCardTitle, { color: colors.text }]}>Mon Frigo</Text>
              {fridgeItems.length > 0 && (
                <View style={styles.fridgeBadge}>
                  <Text style={styles.fridgeBadgeText}>{fridgeItems.length}</Text>
                </View>
              )}
              <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} style={{ marginLeft: 'auto' }} />
            </View>
            {fridgeItems.length === 0 ? (
              <Text style={[styles.fridgeCardEmpty, { color: colors.textMuted }]}>
                Aucun ingrédient — Appuyez pour gérer votre frigo
              </Text>
            ) : (
              <View style={styles.fridgeChips}>
                {fridgeItems.slice(0, 6).map((item) => (
                  <View key={item.id} style={styles.fridgeChip}>
                    <Text style={styles.fridgeChipText}>{item.name}</Text>
                  </View>
                ))}
                {fridgeItems.length > 6 && (
                  <Text style={[styles.fridgeMore, { color: colors.textMuted }]}>
                    +{fridgeItems.length - 6} autres
                  </Text>
                )}
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Forme Physique */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Forme physique</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
            contentContainerStyle={{ gap: Spacing.md, paddingHorizontal: Spacing.md }}
          >
            {PHYSICAL_STATES.map((state) => (
              <Chip
                key={state.id}
                label={state.label}
                selected={selectedPhysicalState === state.id}
                onPress={() => setSelectedPhysicalState(state.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Envies du moment */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Envies du moment</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
            contentContainerStyle={{ gap: Spacing.md, paddingHorizontal: Spacing.md }}
          >
            {CRAVINGS.map((craving) => (
              <Chip
                key={craving.id}
                label={craving.label}
                selected={selectedCraving === craving.id}
                onPress={() => setSelectedCraving(craving.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Suggestions */}
        <View style={styles.section}>
          <View style={styles.suggestionsHeader}>
            <Text style={[styles.suggestionsTitle, { color: colors.text }]}>
              Suggestions pour vous
            </Text>
            {!aiLoading && ingredients.length > 0 && hasApiKey && (
              <TouchableOpacity onPress={generateSuggestions} style={styles.refreshBtn}>
                <MaterialIcons name="refresh" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Préférences actives */}
          {prefTags.length > 0 && (
            <View style={styles.prefTagsContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.prefTagsRow}
                style={{ flex: 1 }}
              >
                <Text style={[styles.prefTagsLabel, { color: colors.textMuted }]}>Filtré selon :</Text>
                {prefTags.map((tag, i) => (
                  <View key={i} style={[styles.prefTag, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                    <Text style={styles.prefTagEmoji}>{tag.emoji}</Text>
                    <Text style={[styles.prefTagText, { color: colors.textMuted }]}>{tag.label}</Text>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => router.navigate('/(tabs)/profile')} style={styles.prefEditBtn}>
                <MaterialIcons name="edit" size={14} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          )}

          {/* Frigo vide */}
          {ingredients.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialIcons name="kitchen" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyStateText, { color: colors.text }]}>
                Votre frigo est vide
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.textMuted }]}>
                Ajoutez des ingrédients dans l'onglet Frigo pour obtenir des suggestions
              </Text>
              <TouchableOpacity
                style={styles.goToFridgeBtn}
                onPress={() => router.navigate('/(tabs)/fridge')}
              >
                <Text style={styles.goToFridgeBtnText}>Gérer mon frigo</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Loading */}
          {aiLoading && (
            <>
              <SkeletonCard featured />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}

          {/* Erreur */}
          {!aiLoading && aiError !== '' && (
            <View style={styles.errorState}>
              <MaterialIcons name="error-outline" size={36} color={ColorPalette.error} />
              <Text style={[styles.errorText, { color: ColorPalette.error }]}>{aiError}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={generateSuggestions}>
                <Text style={styles.retryBtnText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Résultats IA filtrés localement */}
          {!aiLoading && aiError === '' && (() => {
            const filtered = filterRecipes(aiRecipes, selectedPhysicalState, selectedCraving);
            if (filtered.length === 0 && aiRecipes.length > 0) {
              return (
                <View style={styles.emptyState}>
                  <MaterialIcons name="tune" size={36} color={colors.textMuted} />
                  <Text style={[styles.emptyStateText, { color: colors.text }]}>
                    Aucune recette pour ces critères
                  </Text>
                  <Text style={[styles.emptyStateSubtext, { color: colors.textMuted }]}>
                    Essayez une autre humeur ou forme physique
                  </Text>
                </View>
              );
            }
            return filtered.map((recipe, index) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                featured={index === 0}
                onPress={() => setSelectedRecipe(recipe)}
                onFavorite={() => toggleFavorite(recipe)}
                isFavorited={isFavorited(recipe.id)}
              />
            ));
          })()}
        </View>
      </ScrollView>
      <RecipeDetailModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    flex: 1,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  notificationButton: {
    padding: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.md,
    marginLeft: Spacing.md,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  suggestionsTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  refreshBtn: {
    padding: Spacing.sm,
  },
  chipsScroll: {
    marginHorizontal: -Spacing.md,
  },
  fridgeCard: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  fridgeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  fridgeCardTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
  },
  fridgeBadge: {
    backgroundColor: '#13ec5b',
    borderRadius: Radius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  fridgeBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: '#000',
  },
  fridgeCardEmpty: {
    fontSize: FontSize.sm,
    paddingLeft: Spacing.sm,
  },
  fridgeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  fridgeChip: {
    backgroundColor: 'rgba(19, 236, 91, 0.15)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  fridgeChipText: {
    fontSize: FontSize.xs,
    color: '#13ec5b',
    fontWeight: FontWeight.medium,
  },
  fridgeMore: {
    fontSize: FontSize.xs,
    alignSelf: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyStateText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: FontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  goToFridgeBtn: {
    backgroundColor: ColorPalette.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
    marginTop: Spacing.sm,
  },
  goToFridgeBtnText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: '#000',
  },
  errorState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  errorText: {
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  retryBtn: {
    borderWidth: 1,
    borderColor: ColorPalette.error,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
  },
  retryBtnText: {
    color: ColorPalette.error,
    fontWeight: FontWeight.medium,
  },
  prefTagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginHorizontal: -Spacing.md,
  },
  prefTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  prefTagsLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    marginRight: 2,
  },
  prefTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  prefTagEmoji: {
    fontSize: 11,
  },
  prefTagText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  prefEditBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  refineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  refineBtnText: {
    fontSize: FontSize.sm,
  },
});
