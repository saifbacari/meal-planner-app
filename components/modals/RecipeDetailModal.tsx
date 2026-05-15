import { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AIRecipe, generateRecipeSteps } from '@/lib/claude';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useFridge } from '@/contexts/FridgeContext';
import { Badge } from '@/components/ui/Badge';
import { SkeletonSteps } from '@/components/ui/SkeletonCard';
import { Colors, ColorPalette, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

const C = Colors.dark;

type Props = {
  recipe: AIRecipe | null;
  onClose: () => void;
};

export function RecipeDetailModal({ recipe, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { items: fridgeItems } = useFridge();
  const [steps, setSteps] = useState<string[]>([]);
  const [stepsLoading, setStepsLoading] = useState(false);
  const [stepsError, setStepsError] = useState('');

  useEffect(() => {
    if (!recipe) return;
    setSteps([]);
    setStepsError('');
    setStepsLoading(true);
    generateRecipeSteps(recipe.title, recipe.ingredients, fridgeItems.map(i => i.name))
      .then(setSteps)
      .catch((e) => setStepsError(e.message))
      .finally(() => setStepsLoading(false));
  }, [recipe?.id]);

  if (!recipe) return null;

  const favorited = isFavorited(recipe.id);

  return (
    <Modal visible={!!recipe} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top }]}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
            <MaterialIcons name="arrow-back" size={24} color={C.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{recipe.title}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(recipe)} style={styles.iconBtn}>
            <MaterialIcons
              name={favorited ? 'favorite' : 'favorite-border'}
              size={24}
              color={favorited ? '#ef4444' : C.text}
            />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Hero placeholder */}
          <View style={styles.hero}>
            <Text style={styles.heroEmoji}>🍽️</Text>
          </View>

          {/* Meta */}
          <View style={styles.meta}>
            <Badge label={recipe.category} variant={recipe.categoryColor || 'primary'} />
            <View style={styles.stats}>
              <View style={styles.stat}>
                <MaterialIcons name="schedule" size={16} color={C.textMuted} />
                <Text style={styles.statText}>{recipe.time} min</Text>
              </View>
              <View style={styles.stat}>
                <MaterialIcons name="whatshot" size={16} color={C.textMuted} />
                <Text style={styles.statText}>{recipe.calories} kcal</Text>
              </View>
            </View>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingrédients</Text>
            {recipe.ingredients.some((i) => !i.available) && (
              <View style={styles.missingBanner}>
                <MaterialIcons name="shopping-cart" size={14} color="#f97316" />
                <Text style={styles.missingBannerText}>
                  Les ingrédients en orange sont à acheter
                </Text>
              </View>
            )}
            {recipe.ingredients.map((ingredient, i) => (
              <View key={i} style={styles.ingredientRow}>
                <View style={[styles.dot, !ingredient.available && styles.dotMissing]} />
                <Text style={[styles.ingredientText, !ingredient.available && styles.ingredientMissing]}>
                  {ingredient.name}
                </Text>
                {!ingredient.available && (
                  <MaterialIcons name="add-shopping-cart" size={16} color="#f97316" />
                )}
              </View>
            ))}
          </View>

          {/* Steps */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Préparation</Text>

            {stepsLoading && <SkeletonSteps />}

            {stepsError !== '' && !stepsLoading && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Impossible de charger les étapes.</Text>
                <TouchableOpacity
                  style={styles.retryBtn}
                  onPress={() => {
                    setStepsError('');
                    setStepsLoading(true);
                    generateRecipeSteps(recipe.title, recipe.ingredients, fridgeItems.map(i => i.name))
                      .then(setSteps)
                      .catch((e) => setStepsError(e.message))
                      .finally(() => setStepsLoading(false));
                  }}
                >
                  <MaterialIcons name="refresh" size={16} color="#000" />
                  <Text style={styles.retryText}>Réessayer</Text>
                </TouchableOpacity>
              </View>
            )}

            {steps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: C.text,
    textAlign: 'center',
  },
  iconBtn: {
    padding: Spacing.sm,
  },
  content: {
    paddingBottom: Spacing.xxl,
  },
  hero: {
    height: 200,
    backgroundColor: 'rgba(19, 236, 91, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 80,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statText: {
    fontSize: FontSize.sm,
    color: C.textMuted,
    fontWeight: FontWeight.medium,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: C.text,
    marginBottom: Spacing.sm,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ColorPalette.primary,
  },
  dotMissing: {
    backgroundColor: '#f97316',
  },
  ingredientText: {
    flex: 1,
    fontSize: FontSize.base,
    color: C.text,
  },
  ingredientMissing: {
    color: '#f97316',
  },
  missingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  missingBannerText: {
    fontSize: FontSize.xs,
    color: '#f97316',
    fontWeight: FontWeight.medium,
  },
  stepRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ColorPalette.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: '#000',
  },
  stepText: {
    flex: 1,
    fontSize: FontSize.base,
    color: C.text,
    lineHeight: 22,
  },
  errorContainer: {
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: ColorPalette.error,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: ColorPalette.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
  },
  retryText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: '#000',
  },
});
