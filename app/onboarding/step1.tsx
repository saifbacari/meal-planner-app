import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { ChoiceCard } from '@/components/onboarding/ChoiceCard';
import { usePreferences } from '@/contexts/PreferencesContext';
import { Spacing } from '@/constants/theme';

const GOALS = [
  { id: 'lose_weight', emoji: '🏃', label: 'Perdre du poids' },
  { id: 'eat_healthy', emoji: '🥗', label: 'Manger sain' },
  { id: 'build_muscle', emoji: '💪', label: 'Prise de masse' },
  { id: 'maintain', emoji: '⚖️', label: 'Maintien en forme' },
];

export default function Step1() {
  const router = useRouter();
  const { updateDraft, draft } = usePreferences();
  const [selected, setSelected] = useState<string[]>(draft.goals ?? []);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    updateDraft({ goals: selected });
    router.push('/onboarding/step2');
  };

  return (
    <OnboardingLayout
      step={1}
      total={4}
      title="Quel est ton objectif ?"
      subtitle="Choisis tout ce qui te correspond. On adaptera les suggestions en conséquence."
      onNext={handleNext}
      canNext={selected.length > 0}
      showSkip
    >
      <View style={styles.grid}>
        {GOALS.map((goal) => (
          <ChoiceCard
            key={goal.id}
            emoji={goal.emoji}
            label={goal.label}
            selected={selected.includes(goal.id)}
            onPress={() => toggle(goal.id)}
          />
        ))}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
});
