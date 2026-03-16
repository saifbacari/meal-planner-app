import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useFridge } from '@/contexts/FridgeContext';
import { Colors, ColorPalette, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

const C = Colors.dark;

const INGREDIENT_CATEGORIES = [
  {
    label: 'Essentiels',
    items: [
      { id: 'olive_oil', emoji: '🫙', label: "Huile d'olive" },
      { id: 'butter', emoji: '🧈', label: 'Beurre' },
      { id: 'salt_pepper', emoji: '🧂', label: 'Sel & Poivre' },
      { id: 'garlic', emoji: '🧄', label: 'Ail' },
      { id: 'onion', emoji: '🧅', label: 'Oignon' },
    ],
  },
  {
    label: 'Féculents & Céréales',
    items: [
      { id: 'pasta', emoji: '🍝', label: 'Pâtes' },
      { id: 'rice', emoji: '🍚', label: 'Riz' },
      { id: 'flour', emoji: '🌾', label: 'Farine' },
      { id: 'bread', emoji: '🍞', label: 'Pain' },
      { id: 'lentils', emoji: '🫘', label: 'Lentilles' },
    ],
  },
  {
    label: 'Produits frais',
    items: [
      { id: 'eggs', emoji: '🥚', label: 'Œufs' },
      { id: 'milk', emoji: '🥛', label: 'Lait' },
      { id: 'cheese', emoji: '🧀', label: 'Fromage' },
      { id: 'yogurt', emoji: '🥣', label: 'Yaourt' },
      { id: 'cream', emoji: '🍶', label: 'Crème fraîche' },
    ],
  },
  {
    label: 'Fruits & Légumes',
    items: [
      { id: 'tomatoes', emoji: '🍅', label: 'Tomates' },
      { id: 'potatoes', emoji: '🥔', label: 'Pommes de terre' },
      { id: 'carrots', emoji: '🥕', label: 'Carottes' },
      { id: 'lemon', emoji: '🍋', label: 'Citron' },
      { id: 'spinach', emoji: '🥬', label: 'Épinards' },
    ],
  },
  {
    label: 'Sauces & Condiments',
    items: [
      { id: 'mustard', emoji: '🟡', label: 'Moutarde' },
      { id: 'soy_sauce', emoji: '🍶', label: 'Sauce soja' },
      { id: 'tomato_sauce', emoji: '🥫', label: 'Coulis de tomate' },
      { id: 'vinegar', emoji: '🫗', label: 'Vinaigre' },
      { id: 'olive_tapenade', emoji: '🫒', label: 'Olives' },
    ],
  },
  {
    label: 'Herbes & Épices',
    items: [
      { id: 'herbs', emoji: '🌿', label: 'Herbes fraîches' },
      { id: 'cumin', emoji: '🫙', label: 'Cumin' },
      { id: 'paprika', emoji: '🫙', label: 'Paprika' },
      { id: 'cinnamon', emoji: '🫙', label: 'Cannelle' },
      { id: 'thyme', emoji: '🌿', label: 'Thym' },
    ],
  },
  {
    label: 'Douceurs',
    items: [
      { id: 'sugar', emoji: '🍬', label: 'Sucre' },
      { id: 'honey', emoji: '🍯', label: 'Miel' },
      { id: 'chocolate', emoji: '🍫', label: 'Chocolat' },
      { id: 'jam', emoji: '🍓', label: 'Confiture' },
    ],
  },
];

export default function Step4() {
  const router = useRouter();
  const { updateDraft } = usePreferences();
  const { addItem } = useFridge();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    const allItems = INGREDIENT_CATEGORIES.flatMap((c) => c.items);
    const selectedIngredients = allItems
      .filter((i) => selected.includes(i.id))
      .map((i) => i.label);

    // Pré-remplir le frigo ici directement (pas via draft pour éviter les problèmes de timing)
    selectedIngredients.forEach((name) => addItem(name));
    updateDraft({ frequent_ingredients: selectedIngredients });
    router.push('/onboarding/finish');
  };

  return (
    <OnboardingLayout
      step={4}
      total={4}
      title="Tes ingrédients du quotidien"
      subtitle="Sélectionne ce que tu as presque toujours. On pré-remplit ton frigo."
      onNext={handleFinish}
      nextLabel="Commencer !"
      canNext
      showSkip={false}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {INGREDIENT_CATEGORIES.map((category) => (
          <View key={category.label} style={styles.category}>
            <Text style={styles.categoryLabel}>{category.label}</Text>
            <View style={styles.grid}>
              {category.items.map((item) => {
                const isSelected = selected.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => toggle(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.chipEmoji}>{item.emoji}</Text>
                    <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  category: {
    gap: Spacing.sm,
  },
  categoryLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: C.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipSelected: {
    borderColor: ColorPalette.primary,
    backgroundColor: 'rgba(19, 236, 91, 0.1)',
  },
  chipEmoji: {
    fontSize: 16,
  },
  chipLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.dark.textMuted,
  },
  chipLabelSelected: {
    color: Colors.dark.text,
    fontWeight: FontWeight.semibold,
  },
});
