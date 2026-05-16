import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { ChoiceCard } from '@/components/onboarding/ChoiceCard';
import { usePreferences } from '@/contexts/PreferencesContext';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';

const C = Colors.dark;

const BASE_DIETS = [
  { id: 'omnivore', emoji: '🍖', label: 'Omnivore' },
  { id: 'vegetarian', emoji: '🥦', label: 'Végétarien' },
  { id: 'vegan', emoji: '🌱', label: 'Vegan' },
  { id: 'pescatarian', emoji: '🐟', label: 'Pescétarien' },
];

const RESTRICTIONS = [
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
  const initialDiet = draft.diet ?? ['omnivore'];
  const [baseDiet, setBaseDiet] = useState<string>(
    BASE_DIETS.find((d) => initialDiet.includes(d.id))?.id ?? 'omnivore'
  );
  const [restriction, setRestriction] = useState<string>(
    initialDiet.find((d) => RESTRICTIONS.some((r) => r.id === d)) ?? ''
  );
  const [allergies, setAllergies] = useState<string[]>(draft.allergies ?? []);

  const toggleAllergy = (id: string) => {
    setAllergies((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    updateDraft({ diet: restriction ? [baseDiet, restriction] : [baseDiet], allergies });
    router.push('/onboarding/step3');
  };

  return (
    <OnboardingLayout
      step={2}
      total={5}
      title="Ton régime & tes allergies"
      subtitle="Ces informations guident chaque suggestion de recette."
      onNext={handleNext}
      canNext={baseDiet !== ''}
      showSkip
    >
      <View style={styles.content}>
        <Text style={styles.sectionLabel}>Type de régime</Text>
        <View style={styles.grid}>
          {BASE_DIETS.map((d) => (
            <ChoiceCard
              key={d.id}
              emoji={d.emoji}
              label={d.label}
              selected={baseDiet === d.id}
              onPress={() => setBaseDiet(d.id)}
            />
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>
          Restrictions religieuses / culturelles
        </Text>
        <View style={styles.grid}>
          {RESTRICTIONS.map((r) => (
            <ChoiceCard
              key={r.id}
              emoji={r.emoji}
              label={r.label}
              selected={restriction === r.id}
              onPress={() => setRestriction((prev) => prev === r.id ? '' : r.id)}
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
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.md,
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
