import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ThemedView } from '@/components/themed-view';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { RecipeCard } from '@/components/ui/RecipeCard';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
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

const MOCK_RECIPES = [
  {
    id: '1',
    title: 'Poke Bowl Saumon',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBevzWw1dLKZbWT7ZA6S6QOm9uZnm4S_yE3Br6kzpPSm-eJk4keC-c1fIQESYyLIWQcMqkz_sJgn_9AO1JnykAlZ0yA5avbdocEujfoa8GOsEAV3z5iJ5Nij5AjN7A8s9INdkHSnoQm3JVSZZnARLmlzEGmkf5Do7Ayignyiqr1cmMZVE-tBtoLjtVqwCVn2LePhCcoUND3xo0uANPiwRQbmTnAPJVodmpAHyBKSl7dJmgWv_pX4xmAZPLEsa50lbxAg7MPvxCVltqy',
    category: 'Frais & Équilibré',
    categoryColor: 'success' as const,
    ingredients: ['Saumon', 'Avocat', 'Riz', 'Edamame'],
    time: 15,
    calories: 450,
    featured: true,
  },
  {
    id: '2',
    title: 'Omelette aux fines herbes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3VsOZS_ajItyXCKJtzqOer_tvTD78Q44betwF2oJaWfMx3AiwPwM75cwOSzRELjeG2WALuAN3UpVnOiJMyNUo09ItJ_6_JPfFvdM1fcpyB6Sa4mKAe7swx5Un7OCcoFkosgWHRnexQd599MZqNQHT4WIX_5ttnByJw389z3yL3z3uQN1UNvTruNxuLIn9MgtjU9u7g7aUJwCBHTPhH-1XL00T-VJwGhMj6RKm9AcY1UybI1MNBqXWdBurWf6AOi1b2MTuUJ6J_0va',
    category: 'Végé',
    categoryColor: 'warning' as const,
    ingredients: ['Œufs', 'Persil', 'Ciboulette', 'Fromage'],
    time: 10,
    calories: 320,
  },
  {
    id: '3',
    title: 'Pâtes Carbonara',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4OVCfCjf6nlnJUoQH6BY5sfYoHxQk-XZEzr_X_g5jcx3WwVnLg8hSubxTWwNaYigPIQxGwbYHrXSAyrHo7p88I5fbSUYylxd6y9N4p4cA00V-Qkhu0dBCIwCYvQXvzpzexPq8HJeaURXgc755EkbRGl5nwOu3s9lKf7puFjWMMLBthMLwY1MCgo2U5Vq89FZHYVzTwMZ6xDjCyoDCGLC8d_PYosBbqkEwPFhyRSJNoco9XCjYuWhKOqDj0EQBFUkFUSJzB398je2w',
    category: 'Gourmand',
    categoryColor: 'error' as const,
    ingredients: ['Spaghetti', 'Pancetta', 'Œufs', 'Parmesan'],
    time: 20,
    calories: 680,
  },
];

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [selectedPhysicalState, setSelectedPhysicalState] = useState('fit');
  const [selectedCravings, setSelectedCravings] = useState('comforting');
  const [favorited, setFavorited] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string) => {
    setFavorited((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.background },
        ]}
      >
        <MaterialIcons name="restaurant" size={28} color={colors.text} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Qu'est-ce qu'on mange ?
        </Text>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialIcons name="notifications" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
        Basé sur les ingrédients de votre frigo
      </Text>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Ajouter des ingrédients Section */}
        <View style={[styles.section, { marginTop: Spacing.md }]}>
          <View
            style={[
              styles.ingredientCard,
              {
                borderColor: '#13ec5b',
                backgroundColor: colorScheme === 'dark' ? 'rgba(19, 236, 91, 0.05)' : 'rgba(19, 236, 91, 0.05)',
              },
            ]}
          >
            <Text style={[styles.ingredientTitle, { color: colors.text }]}>
              Ajouter des ingrédients
            </Text>
            <Text style={[styles.ingredientSubtitle, { color: colors.textMuted }]}>
              Qu'avez-vous dans votre frigo ?
            </Text>
            <Button label="Ajouter" onPress={() => {}} variant="primary" size="md" />
          </View>
        </View>

        {/* Forme Physique Section */}
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

        {/* Envies du moment Section */}
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
                selected={selectedCravings === craving.id}
                onPress={() => setSelectedCravings(craving.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Suggestions Section */}
        <View style={styles.section}>
          <Text style={[styles.suggestionsTitle, { color: colors.text }]}>
            Suggestions pour vous
          </Text>

          {MOCK_RECIPES.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              featured={recipe.featured}
              onPress={() => {}}
              onFavorite={() => toggleFavorite(recipe.id)}
              isFavorited={favorited[recipe.id] || false}
            />
          ))}
        </View>
      </ScrollView>
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
    paddingTop: Spacing.md,
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
  suggestionsTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.lg,
  },
  chipsScroll: {
    marginHorizontal: -Spacing.md,
  },
  ingredientCard: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.md,
  },
  ingredientTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  ingredientSubtitle: {
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
});
