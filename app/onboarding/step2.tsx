import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { ChoiceCard } from '@/components/onboarding/ChoiceCard';
import { usePreferences } from '@/contexts/PreferencesContext';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';

const C = Colors.dark;

const DIETS = [
  { id: 'omnivore', emoji: '🍖', label: 'Omnivore' },
  { id: 'vegetarian', emoji: '🥦', label: 'Végétarien' },
  { id: 'vegan', emoji: '🌱', label: 'Vegan' },
  { id: 'pescatarian', emoji: '🐟', label: 'Pescétarien' },
  { id: 'halal', emoji: '☪️', label: 'Halal' },
  { id: 'kosher', emoji: '✡️', label: 'Casher' },
  { id: 'no_pork', emoji: '🐷', label: 'Sans porc' },
];

const ALLERGIES = [
  { id: 'gluten', emoji: '🌾', label: 'Gluten' },
  { id: 'lactose', emoji: '🥛', label: 'Lactose' },
  { id: 'nuts', emoji: '🥜', label: 'Noix' },
  { id: 'seafood', emoji: '🦐', label: 'Fruits de mer' },
  { id: 'eggs', emoji: '🥚', label: 'Œufs' },
  { id: 'soy', emoji: '🫘', label: 'Soja' },
  { id: 'peanuts', emoji: '🥜', label: 'Arachides' },
];

export default function Step2() {
  const router = useRouter();
  const { updateDraft, draft } = usePreferences();
  const [diet, setDiet] = useState<string[]>(draft.diet ?? ['omnivore']);
  const [allergies, setAllergies] = useState<string[]>(draft.allergies ?? []);

  const toggleDiet = (id: string) => {
    setDiet((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const toggleAllergy = (id: string) => {
    setAllergies((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    updateDraft({ diet, allergies });
    router.push('/onboarding/step3');
  };

  return (
    <OnboardingLayout
      step={2}
      total={4}
      title="Ton régime & tes allergies"
      subtitle="Ces informations guident chaque suggestion de recette."
      onNext={handleNext}
      canNext={diet.length > 0}
      showSkip
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionLabel}>Régime alimentaire</Text>
        <View style={styles.grid}>
          {DIETS.map((d) => (
            <ChoiceCard
              key={d.id}
              emoji={d.emoji}
              label={d.label}
              selected={diet.includes(d.id)}
              onPress={() => toggleDiet(d.id)}
            />
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>
          Allergies & intolérances
        </Text>
        <View style={styles.grid}>
          {ALLERGIES.map((a) => (
            <ChoiceCard
              key={a.id}
              emoji={a.emoji}
              label={a.label}
              selected={allergies.includes(a.id)}
              onPress={() => toggleAllergy(a.id)}
            />
          ))}
        </View>
      </ScrollView>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: C.text,
    marginBottom: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
});
