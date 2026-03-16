import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFavorites } from '@/contexts/FavoritesContext';
import { AIRecipe } from '@/lib/claude';
import { RecipeCard } from '@/components/ui/RecipeCard';
import { RecipeDetailModal } from '@/components/modals/RecipeDetailModal';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';

const C = Colors.dark;

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { favorites, isFavorited, toggleFavorite } = useFavorites();
  const [selectedRecipe, setSelectedRecipe] = useState<AIRecipe | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <MaterialIcons name="favorite" size={26} color={C.text} />
        <Text style={styles.headerTitle}>Mes Favoris</Text>
        {favorites.length > 0 && (
          <Text style={styles.headerCount}>{favorites.length}</Text>
        )}
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="favorite-border" size={64} color={C.border} />
          <Text style={styles.emptyTitle}>Aucun favori</Text>
          <Text style={styles.emptySubtitle}>
            Appuyez sur le cœur d'une recette pour la retrouver ici
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              onPress={() => setSelectedRecipe(item)}
              onFavorite={() => toggleFavorite(item)}
              isFavorited={isFavorited(item.id)}
            />
          )}
        />
      )}

      <RecipeDetailModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </View>
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
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: C.text,
    flex: 1,
  },
  headerCount: {
    fontSize: FontSize.sm,
    color: C.textMuted,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: C.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
