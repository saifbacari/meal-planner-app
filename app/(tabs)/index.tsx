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
import { AddIngredientsModal } from '@/components/modals/AddIngredientsModal';
import { useRecipeFilter } from '@/hooks/useRecipeFilter';
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
  // Rapide & Léger
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
    physicalState: ['fit', 'post_sport'],
    craving: ['quick', 'light'],
  },
  {
    id: '2',
    title: 'Salade Méditerranéenne',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBevzWw1dLKZbWT7ZA6S6QOm9uZnm4S_yE3Br6kzpPSm-eJk4keC-c1fIQESYyLIWQcMqkz_sJgn_9AO1JnykAlZ0yA5avbdocEujfoa8GOsEAV3z5iJ5Nij5AjN7A8s9INdkHSnoQm3JVSZZnARLmlzEGmkf5Do7Ayignyiqr1cmMZVE-tBtoLjtVqwCVn2LePhCcoUND3xo0uANPiwRQbmTnAPJVodmpAHyBKSl7dJmgWv_pX4xmAZPLEsa50lbxAg7MPvxCVltqy',
    category: 'Léger',
    categoryColor: 'info' as const,
    ingredients: ['Tomate', 'Feta', 'Olive', 'Concombre'],
    time: 5,
    calories: 250,
    physicalState: ['fit', 'post_sport'],
    craving: ['light', 'quick'],
  },
  {
    id: '3',
    title: 'Sandwich Poulet Grillé',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBevzWw1dLKZbWT7ZA6S6QOm9uZnm4S_yE3Br6kzpPSm-eJk4keC-c1fIQESYyLIWQcMqkz_sJgn_9AO1JnykAlZ0yA5avbdocEujfoa8GOsEAV3z5iJ5Nij5AjN7A8s9INdkHSnoQm3JVSZZnARLmlzEGmkf5Do7Ayignyiqr1cmMZVE-tBtoLjtVqwCVn2LePhCcoUND3xo0uANPiwRQbmTnAPJVodmpAHyBKSl7dJmgWv_pX4xmAZPLEsa50lbxAg7MPvxCVltqy',
    category: 'Protéiné',
    categoryColor: 'primary' as const,
    ingredients: ['Poulet', 'Pain', 'Laitue', 'Tomate'],
    time: 8,
    calories: 380,
    physicalState: ['fit', 'post_sport'],
    craving: ['quick'],
  },

  // Réconfortant
  {
    id: '4',
    title: 'Pâtes Carbonara',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4OVCfCjf6nlnJUoQH6BY5sfYoHxQk-XZEzr_X_g5jcx3WwVnLg8hSubxTWwNaYigPIQxGwbYHrXSAyrHo7p88I5fbSUYylxd6y9N4p4cA00V-Qkhu0dBCIwCYvQXvzpzexPq8HJeaURXgc755EkbRGl5nwOu3s9lKf7puFjWMMLBthMLwY1MCgo2U5Vq89FZHYVzTwMZ6xDjCyoDCGLC8d_PYosBbqkEwPFhyRSJNoco9XCjYuWhKOqDj0EQBFUkFUSJzB398je2w',
    category: 'Gourmand',
    categoryColor: 'error' as const,
    ingredients: ['Spaghetti', 'Pancetta', 'Œufs', 'Parmesan'],
    time: 20,
    calories: 680,
    physicalState: ['tired', 'post_sport'],
    craving: ['comforting'],
  },
  {
    id: '5',
    title: 'Omelette aux fines herbes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3VsOZS_ajItyXCKJtzqOer_tvTD78Q44betwF2oJaWfMx3AiwPwM75cwOSzRELjeG2WALuAN3UpVnOiJMyNUo09ItJ_6_JPfFvdM1fcpyB6Sa4mKAe7swx5Un7OCcoFkosgWHRnexQd599MZqNQHT4WIX_5ttnByJw389z3yL3z3uQN1UNvTruNxuLIn9MgtjU9u7g7aUJwCBHTPhH-1XL00T-VJwGhMj6RKm9AcY1UybI1MNBqXWdBurWf6AOi1b2MTuUJ6J_0va',
    category: 'Végé',
    categoryColor: 'warning' as const,
    ingredients: ['Œufs', 'Persil', 'Ciboulette', 'Fromage'],
    time: 10,
    calories: 320,
    physicalState: ['fit', 'tired'],
    craving: ['quick', 'comforting'],
  },
  {
    id: '6',
    title: 'Risotto aux Champignons',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBevzWw1dLKZbWT7ZA6S6QOm9uZnm4S_yE3Br6kzpPSm-eJk4keC-c1fIQESYyLIWQcMqkz_sJgn_9AO1JnykAlZ0yA5avbdocEujfoa8GOsEAV3z5iJ5Nij5AjN7A8s9INdkHSnoQm3JVSZZnARLmlzEGmkf5Do7Ayignyiqr1cmMZVE-tBtoLjtVqwCVn2LePhCcoUND3xo0uANPiwRQbmTnAPJVodmpAHyBKSl7dJmgWv_pX4xmAZPLEsa50lbxAg7MPvxCVltqy',
    category: 'Réconfortant',
    categoryColor: 'warning' as const,
    ingredients: ['Riz Arborio', 'Champignon', 'Oignon', 'Vin blanc'],
    time: 30,
    calories: 520,
    physicalState: ['tired', 'sleep'],
    craving: ['comforting'],
  },
  {
    id: '7',
    title: 'Burger Maison',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBevzWw1dLKZbWT7ZA6S6QOm9uZnm4S_yE3Br6kzpPSm-eJk4keC-c1fIQESYyLIWQcMqkz_sJgn_9AO1JnykAlZ0yA5avbdocEujfoa8GOsEAV3z5iJ5Nij5AjN7A8s9INdkHSnoQm3JVSZZnARLmlzEGmkf5Do7Ayignyiqr1cmMZVE-tBtoLjtVqwCVn2LePhCcoUND3xo0uANPiwRQbmTnAPJVodmpAHyBKSl7dJmgWv_pX4xmAZPLEsa50lbxAg7MPvxCVltqy',
    category: 'Gourmand',
    categoryColor: 'error' as const,
    ingredients: ['Steak haché', 'Pain burger', 'Fromage', 'Salade'],
    time: 15,
    calories: 750,
    physicalState: ['post_sport', 'tired'],
    craving: ['comforting'],
  },

  // Épicé
  {
    id: '8',
    title: 'Curry de Poulet',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBevzWw1dLKZbWT7ZA6S6QOm9uZnm4S_yE3Br6kzpPSm-eJk4keC-c1fIQESYyLIWQcMqkz_sJgn_9AO1JnykAlZ0yA5avbdocEujfoa8GOsEAV3z5iJ5Nij5AjN7A8s9INdkHSnoQm3JVSZZnARLmlzEGmkf5Do7Ayignyiqr1cmMZVE-tBtoLjtVqwCVn2LePhCcoUND3xo0uANPiwRQbmTnAPJVodmpAHyBKSl7dJmgWv_pX4xmAZPLEsa50lbxAg7MPvxCVltqy',
    category: 'Épicé',
    categoryColor: 'error' as const,
    ingredients: ['Poulet', 'Curry', 'Coco', 'Riz'],
    time: 25,
    calories: 580,
    physicalState: ['fit', 'post_sport'],
    craving: ['spicy'],
  },
  {
    id: '9',
    title: 'Tacos Épicés',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBevzWw1dLKZbWT7ZA6S6QOm9uZnm4S_yE3Br6kzpPSm-eJk4keC-c1fIQESYyLIWQcMqkz_sJgn_9AO1JnykAlZ0yA5avbdocEujfoa8GOsEAV3z5iJ5Nij5AjN7A8s9INdkHSnoQm3JVSZZnARLmlzEGmkf5Do7Ayignyiqr1cmMZVE-tBtoLjtVqwCVn2LePhCcoUND3xo0uANPiwRQbmTnAPJVodmpAHyBKSl7dJmgWv_pX4xmAZPLEsa50lbxAg7MPvxCVltqy',
    category: 'Épicé',
    categoryColor: 'error' as const,
    ingredients: ['Viande', 'Tortilla', 'Jalapeño', 'Lime'],
    time: 12,
    calories: 420,
    physicalState: ['fit', 'post_sport'],
    craving: ['quick', 'spicy'],
  },
  {
    id: '10',
    title: 'Pad Thaï',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBevzWw1dLKZbWT7ZA6S6QOm9uZnm4S_yE3Br6kzpPSm-eJk4keC-c1fIQESYyLIWQcMqkz_sJgn_9AO1JnykAlZ0yA5avbdocEujfoa8GOsEAV3z5iJ5Nij5AjN7A8s9INdkHSnoQm3JVSZZnARLmlzEGmkf5Do7Ayignyiqr1cmMZVE-tBtoLjtVqwCVn2LePhCcoUND3xo0uANPiwRQbmTnAPJVodmpAHyBKSl7dJmgWv_pX4xmAZPLEsa50lbxAg7MPvxCVltqy',
    category: 'Épicé',
    categoryColor: 'error' as const,
    ingredients: ['Nouilles', 'Crevettes', 'Cacahuète', 'Piment'],
    time: 20,
    calories: 490,
    physicalState: ['post_sport'],
    craving: ['spicy'],
  },

  // Pour dormir / Fatigué
  {
    id: '11',
    title: 'Lait Chaud Miel Amandes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBevzWw1dLKZbWT7ZA6S6QOm9uZnm4S_yE3Br6kzpPSm-eJk4keC-c1fIQESYyLIWQcMqkz_sJgn_9AO1JnykAlZ0yA5avbdocEujfoa8GOsEAV3z5iJ5Nij5AjN7A8s9INdkHSnoQm3JVSZZnARLmlzEGmkf5Do7Ayignyiqr1cmMZVE-tBtoLjtVqwCVn2LePhCcoUND3xo0uANPiwRQbmTnAPJVodmpAHyBKSl7dJmgWv_pX4xmAZPLEsa50lbxAg7MPvxCVltqy',
    category: 'Apaisant',
    categoryColor: 'info' as const,
    ingredients: ['Lait', 'Miel', 'Amande', 'Cannelle'],
    time: 5,
    calories: 180,
    physicalState: ['sleep', 'tired'],
    craving: ['comforting'],
  },
  {
    id: '12',
    title: 'Soupe à l\'Oignon',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBevzWw1dLKZbWT7ZA6S6QOm9uZnm4S_yE3Br6kzpPSm-eJk4keC-c1fIQESYyLIWQcMqkz_sJgn_9AO1JnykAlZ0yA5avbdocEujfoa8GOsEAV3z5iJ5Nij5AjN7A8s9INdkHSnoQm3JVSZZnARLmlzEGmkf5Do7Ayignyiqr1cmMZVE-tBtoLjtVqwCVn2LePhCcoUND3xo0uANPiwRQbmTnAPJVodmpAHyBKSl7dJmgWv_pX4xmAZPLEsa50lbxAg7MPvxCVltqy',
    category: 'Réconfortant',
    categoryColor: 'warning' as const,
    ingredients: ['Oignon', 'Bouillon', 'Pain', 'Fromage'],
    time: 35,
    calories: 220,
    physicalState: ['tired', 'sleep'],
    craving: ['comforting'],
  },
  {
    id: '13',
    title: 'Œufs au Plat & Toast',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3VsOZS_ajItyXCKJtzqOer_tvTD78Q44betwF2oJaWfMx3AiwPwM75cwOSzRELjeG2WALuAN3UpVnOiJMyNUo09ItJ_6_JPfFvdM1fcpyB6Sa4mKAe7swx5Un7OCcoFkosgWHRnexQd599MZqNQHT4WIX_5ttnByJw389z3yL3z3uQN1UNvTruNxuLIn9MgtjU9u7g7aUJwCBHTPhH-1XL00T-VJwGhMj6RKm9AcY1UybI1MNBqXWdBurWf6AOi1b2MTuUJ6J_0va',
    category: 'Rapide',
    categoryColor: 'primary' as const,
    ingredients: ['Œufs', 'Pain', 'Beurre', 'Sel'],
    time: 6,
    calories: 280,
    physicalState: ['tired', 'fit'],
    craving: ['quick', 'comforting'],
  },

  // Petit-déj
  {
    id: '14',
    title: 'Porridge Fruits Rouges',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBevzWw1dLKZbWT7ZA6S6QOm9uZnm4S_yE3Br6kzpPSm-eJk4keC-c1fIQESYyLIWQcMqkz_sJgn_9AO1JnykAlZ0yA5avbdocEujfoa8GOsEAV3z5iJ5Nij5AjN7A8s9INdkHSnoQm3JVSZZnARLmlzEGmkf5Do7Ayignyiqr1cmMZVE-tBtoLjtVqwCVn2LePhCcoUND3xo0uANPiwRQbmTnAPJVodmpAHyBKSl7dJmgWv_pX4xmAZPLEsa50lbxAg7MPvxCVltqy',
    category: 'Léger',
    categoryColor: 'info' as const,
    ingredients: ['Flocons d\'avoine', 'Lait', 'Fraise', 'Miel'],
    time: 10,
    calories: 340,
    physicalState: ['fit', 'post_sport'],
    craving: ['light', 'quick'],
  },
  {
    id: '15',
    title: 'Œufs Bénédictine',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3VsOZS_ajItyXCKJtzqOer_tvTD78Q44betwF2oJaWfMx3AiwPwM75cwOSzRELjeG2WALuAN3UpVnOiJMyNUo09ItJ_6_JPfFvdM1fcpyB6Sa4mKAe7swx5Un7OCcoFkosgWHRnexQd599MZqNQHT4WIX_5ttnByJw389z3yL3z3uQN1UNvTruNxuLIn9MgtjU9u7g7aUJwCBHTPhH-1XL00T-VJwGhMj6RKm9AcY1UybI1MNBqXWdBurWf6AOi1b2MTuUJ6J_0va',
    category: 'Gourmand',
    categoryColor: 'error' as const,
    ingredients: ['Œufs', 'Sauce Hollandaise', 'Pain', 'Jambon'],
    time: 15,
    calories: 520,
    physicalState: ['post_sport'],
    craving: ['comforting'],
  },
  {
    id: '16',
    title: 'Smoothie Protéiné',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBevzWw1dLKZbWT7ZA6S6QOm9uZnm4S_yE3Br6kzpPSm-eJk4keC-c1fIQESYyLIWQcMqkz_sJgn_9AO1JnykAlZ0yA5avbdocEujfoa8GOsEAV3z5iJ5Nij5AjN7A8s9INdkHSnoQm3JVSZZnARLmlzEGmkf5Do7Ayignyiqr1cmMZVE-tBtoLjtVqwCVn2LePhCcoUND3xo0uANPiwRQbmTnAPJVodmpAHyBKSl7dJmgWv_pX4xmAZPLEsa50lbxAg7MPvxCVltqy',
    category: 'Protéiné',
    categoryColor: 'primary' as const,
    ingredients: ['Banane', 'Yaourt', 'Protéine', 'Miel'],
    time: 3,
    calories: 290,
    physicalState: ['fit', 'post_sport'],
    craving: ['quick', 'light'],
  },
];

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [selectedPhysicalState, setSelectedPhysicalState] = useState('fit');
  const [selectedCraving, setSelectedCraving] = useState('comforting');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [favorited, setFavorited] = useState<Record<string, boolean>>({});
  const [showAddIngredientsModal, setShowAddIngredientsModal] = useState(false);

  // Filter recipes based on selected state and craving
  const filteredRecipes = useRecipeFilter(MOCK_RECIPES, selectedPhysicalState, selectedCraving, ingredients);

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
          <TouchableOpacity
            style={[
              styles.ingredientCard,
              {
                borderColor: '#13ec5b',
                backgroundColor: colorScheme === 'dark' ? 'rgba(19, 236, 91, 0.05)' : 'rgba(19, 236, 91, 0.05)',
              },
            ]}
            onPress={() => setShowAddIngredientsModal(true)}
          >
            <Text style={[styles.ingredientTitle, { color: colors.text }]}>
              Ajouter des ingrédients
            </Text>
            <Text style={[styles.ingredientSubtitle, { color: colors.textMuted }]}>
              {ingredients.length > 0
                ? `${ingredients.length} ingrédient(s) sélectionné(s)`
                : 'Qu\'avez-vous dans votre frigo ?'}
            </Text>
            <Button label="Ajouter" onPress={() => setShowAddIngredientsModal(true)} variant="primary" size="md" />
          </TouchableOpacity>
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
                selected={selectedCraving === craving.id}
                onPress={() => setSelectedCraving(craving.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Suggestions Section */}
        <View style={styles.section}>
          <Text style={[styles.suggestionsTitle, { color: colors.text }]}>
            Suggestions pour vous
          </Text>

          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                featured={recipe.featured}
                onPress={() => {}}
                onFavorite={() => toggleFavorite(recipe.id)}
                isFavorited={favorited[recipe.id] || false}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="no_meals" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyStateText, { color: colors.text }]}>
                Aucune suggestion correspondant à vos critères
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.textMuted }]}>
                Essayez de modifier vos sélections
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Ingredients Modal */}
      <AddIngredientsModal
        visible={showAddIngredientsModal}
        onClose={() => setShowAddIngredientsModal(false)}
        onAdd={setIngredients}
        currentIngredients={ingredients}
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
  },
});
