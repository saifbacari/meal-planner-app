import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '../ui/Button';

const COMMON_INGREDIENTS = [
  'Poulet',
  'Œufs',
  'Tomate',
  'Oignon',
  'Fromage',
  'Lait',
  'Pain',
  'Riz',
  'Pâtes',
  'Saumon',
  'Brocoli',
  'Carotte',
  'Champignon',
  'Persil',
  'Ail',
  'Citron',
];

interface AddIngredientsModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (ingredients: string[]) => void;
  currentIngredients: string[];
}

export function AddIngredientsModal({
  visible,
  onClose,
  onAdd,
  currentIngredients,
}: AddIngredientsModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [ingredients, setIngredients] = useState<string[]>(currentIngredients);
  const [searchText, setSearchText] = useState('');

  const toggleIngredient = (ingredient: string) => {
    setIngredients((prev) =>
      prev.includes(ingredient) ? prev.filter((i) => i !== ingredient) : [...prev, ingredient]
    );
  };

  const handleAdd = () => {
    onAdd(ingredients);
    onClose();
  };

  const filteredIngredients = COMMON_INGREDIENTS.filter((ing) =>
    ing.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Ajouter ingrédients</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Search Input */}
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color={colors.textMuted} />
            <TextInput
              placeholder="Chercher un ingrédient..."
              placeholderTextColor={colors.textMuted}
              value={searchText}
              onChangeText={setSearchText}
              style={[
                styles.searchInput,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                },
              ]}
            />
          </View>

          {/* Suggested Ingredients */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ingrédients populaires</Text>

          <View style={styles.ingredientsList}>
            {filteredIngredients.map((ingredient) => (
              <TouchableOpacity
                key={ingredient}
                style={[
                  styles.ingredientItem,
                  {
                    backgroundColor: ingredients.includes(ingredient)
                      ? '#13ec5b'
                      : colors.surface,
                    borderColor: ingredients.includes(ingredient)
                      ? 'transparent'
                      : colors.border,
                  },
                ]}
                onPress={() => toggleIngredient(ingredient)}
              >
                {ingredients.includes(ingredient) && (
                  <MaterialIcons name="check" size={16} color="#000" style={{ marginRight: 4 }} />
                )}
                <Text
                  style={[
                    styles.ingredientText,
                    {
                      color: ingredients.includes(ingredient) ? '#000' : colors.text,
                    },
                  ]}
                >
                  {ingredient}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Selected Ingredients */}
          {ingredients.length > 0 && (
            <View style={styles.selectedSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Ingrédients sélectionnés ({ingredients.length})
              </Text>
              <View style={styles.selectedList}>
                {ingredients.map((ingredient) => (
                  <View
                    key={ingredient}
                    style={[
                      styles.selectedChip,
                      { backgroundColor: 'rgba(19, 236, 91, 0.2)' },
                    ]}
                  >
                    <Text style={[styles.selectedChipText, { color: colors.text }]}>
                      {ingredient}
                    </Text>
                    <TouchableOpacity onPress={() => toggleIngredient(ingredient)}>
                      <MaterialIcons name="close" size={16} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <Button label="Ajouter" onPress={handleAdd} variant="primary" fullWidth />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: Radius.full,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    fontSize: FontSize.base,
  },
  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  ingredientText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  selectedSection: {
    marginTop: Spacing.xl,
  },
  selectedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  selectedChipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});
