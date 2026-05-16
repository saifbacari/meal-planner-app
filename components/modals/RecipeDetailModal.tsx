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

import { AIRecipe, RecipeDetails, generateRecipeSteps } from '@/lib/claude';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useFridge } from '@/contexts/FridgeContext';
import { Badge } from '@/components/ui/Badge';
import { SkeletonSteps } from '@/components/ui/SkeletonCard';
import { Colors, ColorPalette, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

const C = Colors.dark;

const EQUIPMENT_EMOJI: Record<string, string> = {
  'poêle': '🍳',
  'casserole': '🫕',
  'couteau': '🔪',
  'planche à découper': '🪵',
  'mixeur': '🌀',
  'blender': '🌀',
  'four': '🔥',
  'bol': '🥣',
  'saladier': '🥣',
  'fouet': '🥄',
  'spatule': '🥄',
  'passoire': '🧺',
  'plat': '🫙',
  'wok': '🍳',
  'cocotte': '🫕',
};

function equipmentEmoji(name: string): string {
  const key = Object.keys(EQUIPMENT_EMOJI).find((k) =>
    name.toLowerCase().includes(k)
  );
  return key ? EQUIPMENT_EMOJI[key] : '🔧';
}

type Props = {
  recipe: AIRecipe | null;
  onClose: () => void;
};

export function RecipeDetailModal({ recipe, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { items: fridgeItems } = useFridge();
  const [details, setDetails] = useState<RecipeDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadDetails = () => {
    if (!recipe) return;
    setDetails(null);
    setError('');
    setLoading(true);
    generateRecipeSteps(recipe.title, recipe.ingredients, fridgeItems.map(i => i.name))
      .then(setDetails)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDetails();
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

          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.heroEmoji}>🍽️</Text>
          </View>

          {/* Meta bar */}
          <View style={styles.metaBar}>
            <Badge label={recipe.category} variant={recipe.categoryColor || 'primary'} />
            <View style={styles.metaChips}>
              <View style={styles.metaChip}>
                <MaterialIcons name="schedule" size={14} color={C.textMuted} />
                <Text style={styles.metaChipText}>{recipe.time} min</Text>
              </View>
              <View style={styles.metaChip}>
                <MaterialIcons name="whatshot" size={14} color={C.textMuted} />
                <Text style={styles.metaChipText}>{recipe.calories} kcal</Text>
              </View>
              {details && (
                <View style={styles.metaChip}>
                  <MaterialIcons name="people" size={14} color={C.textMuted} />
                  <Text style={styles.metaChipText}>{details.servings} pers.</Text>
                </View>
              )}
            </View>
          </View>

          {/* Equipment */}
          {details && details.equipment.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ustensiles</Text>
              <View style={styles.equipmentRow}>
                {details.equipment.map((item) => (
                  <View key={item} style={styles.equipmentChip}>
                    <Text style={styles.equipmentEmoji}>{equipmentEmoji(item)}</Text>
                    <Text style={styles.equipmentText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

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

            {loading && <SkeletonSteps />}

            {error !== '' && !loading && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Impossible de charger les étapes.</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={loadDetails}>
                  <MaterialIcons name="refresh" size={16} color="#000" />
                  <Text style={styles.retryText}>Réessayer</Text>
                </TouchableOpacity>
              </View>
            )}

            {details?.steps.map((step, i) => (
              <View key={i} style={styles.stepCard}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
                <View style={styles.stepBody}>
                  <Text style={styles.stepText}>{step.action}</Text>
                  {step.duration && (
                    <View style={styles.durationChip}>
                      <MaterialIcons name="schedule" size={11} color={ColorPalette.primary} />
                      <Text style={styles.durationText}>{step.duration}</Text>
                    </View>
                  )}
                </View>
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
    height: 180,
    backgroundColor: 'rgba(19, 236, 91, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 72,
  },
  metaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  metaChips: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: C.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  metaChipText: {
    fontSize: FontSize.xs,
    color: C.textMuted,
    fontWeight: FontWeight.medium,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: C.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
  },
  equipmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  equipmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  equipmentEmoji: {
    fontSize: 14,
  },
  equipmentText: {
    fontSize: FontSize.sm,
    color: C.text,
    fontWeight: FontWeight.medium,
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
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  missingBannerText: {
    fontSize: FontSize.xs,
    color: '#f97316',
    fontWeight: FontWeight.medium,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: C.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: C.border,
  },
  stepBody: {
    flex: 1,
    gap: Spacing.xs,
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: ColorPalette.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: '#000',
  },
  durationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(19, 236, 91, 0.1)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  durationText: {
    fontSize: FontSize.xs,
    color: ColorPalette.primary,
    fontWeight: FontWeight.semibold,
  },
  stepText: {
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
