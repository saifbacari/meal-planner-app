import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Badge } from './Badge';
import { MaterialIcons } from '@expo/vector-icons';

interface Recipe {
  id: string;
  title: string;
  image: string;
  category: string;
  categoryColor?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  ingredients: string[];
  time: number;
  calories: number;
  featured?: boolean;
}

interface RecipeCardProps {
  recipe: Recipe;
  featured?: boolean;
  onPress?: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
}

export function RecipeCard({
  recipe,
  featured = false,
  onPress,
  onFavorite,
  isFavorited = false,
}: RecipeCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (featured) {
    return (
      <TouchableOpacity
        style={[
          styles.featuredContainer,
          {
            backgroundColor: colorScheme === 'dark' ? 'rgba(16, 178, 129, 0.15)' : '#f0fdf4',
            borderColor: colorScheme === 'dark' ? '#047857' : '#86efac',
            ...Shadow.md,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.featuredBadgeContainer}>
          <Badge label="Top Choix" variant="primary" />
        </View>

        <View style={styles.featuredContent}>
          <Image source={{ uri: recipe.image }} style={styles.featuredImage} />

          <View style={styles.featuredInfo}>
            <View style={styles.categoryBadge}>
              <Badge label="Frais & Équilibré" variant="success" />
            </View>

            <Text style={[styles.title, { color: colors.text }]}>{recipe.title}</Text>

            <Text style={[styles.ingredients, { color: colors.textMuted }]}>
              {recipe.ingredients.join(', ')}
            </Text>

            <View style={styles.stats}>
              <View style={styles.stat}>
                <MaterialIcons name="schedule" size={14} color={colors.textMuted} />
                <Text style={[styles.statText, { color: colors.textMuted }]}>
                  {recipe.time} min
                </Text>
              </View>

              <View style={styles.stat}>
                <MaterialIcons name="local_fire_department" size={14} color={colors.textMuted} />
                <Text style={[styles.statText, { color: colors.textMuted }]}>
                  {recipe.calories} kcal
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          ...Shadow.sm,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Image source={{ uri: recipe.image }} style={styles.image} />

        <View style={styles.info}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Badge label={recipe.category} variant={recipe.categoryColor || 'neutral'} />
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                {recipe.title}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onFavorite}
              style={styles.favoriteButton}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={isFavorited ? 'favorite' : 'favorite_border'}
                size={20}
                color={isFavorited ? '#ef4444' : colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.ingredients, { color: colors.textMuted }]} numberOfLines={1}>
            {recipe.ingredients.join(', ')}
          </Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <MaterialIcons name="schedule" size={12} color={colors.textMuted} />
              <Text style={[styles.statText, { color: colors.textMuted }]}>
                {recipe.time} min
              </Text>
            </View>

            <View style={styles.stat}>
              <MaterialIcons name="local_fire_department" size={12} color={colors.textMuted} />
              <Text style={[styles.statText, { color: colors.textMuted }]}>
                {recipe.calories} kcal
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: Radius.md,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  favoriteButton: {
    padding: Spacing.xs,
  },
  title: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  ingredients: {
    fontSize: FontSize.xs,
    marginBottom: Spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },

  // Featured Card styles
  featuredContainer: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  featuredBadgeContainer: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    zIndex: 10,
  },
  featuredContent: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  featuredImage: {
    width: 96,
    height: 96,
    borderRadius: Radius.md,
  },
  featuredInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryBadge: {
    marginBottom: Spacing.sm,
  },
});
