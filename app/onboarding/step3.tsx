import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { ChoiceCard } from '@/components/onboarding/ChoiceCard';
import { usePreferences } from '@/contexts/PreferencesContext';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';

const C = Colors.dark;

const TIMES = [
  { id: 'under15', emoji: '⚡', label: '< 15 min' },
  { id: '15-30', emoji: '🕐', label: '15 – 30 min' },
  { id: '30-60', emoji: '🕑', label: '30 – 60 min' },
  { id: 'over60', emoji: '🍳', label: '+ 1 heure' },
];

const LEVELS = [
  { id: 'beginner', emoji: '🌱', label: 'Débutant' },
  { id: 'intermediate', emoji: '👨‍🍳', label: 'Intermédiaire' },
  { id: 'advanced', emoji: '🔥', label: 'Passionné' },
  { id: 'chef', emoji: '⭐', label: 'Chef' },
];

export default function Step3() {
  const router = useRouter();
  const { updateDraft, draft } = usePreferences();
  const [time, setTime] = useState<string | null>(draft.preferred_time ?? null);
  const [level, setLevel] = useState<string | null>(draft.cooking_level ?? null);

  const handleNext = () => {
    updateDraft({ preferred_time: time ?? '15-30', cooking_level: level ?? 'intermediate' });
    router.push('/onboarding/step4');
  };

  return (
    <OnboardingLayout
      step={3}
      total={4}
      title="Ton style en cuisine"
      subtitle="On s'adapte à ton niveau et au temps dont tu disposes."
      onNext={handleNext}
      canNext
      showSkip
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <Text style={styles.sectionLabel}>Temps de préparation préféré</Text>
        <View style={styles.grid}>
          {TIMES.map((t) => (
            <ChoiceCard
              key={t.id}
              emoji={t.emoji}
              label={t.label}
              selected={time === t.id}
              onPress={() => setTime(prev => prev === t.id ? null : t.id)}
            />
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>Niveau en cuisine</Text>
        <View style={styles.grid}>
          {LEVELS.map((l) => (
            <ChoiceCard
              key={l.id}
              emoji={l.emoji}
              label={l.label}
              selected={level === l.id}
              onPress={() => setLevel(prev => prev === l.id ? null : l.id)}
            />
          ))}
        </View>
      </ScrollView>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  sectionLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: C.text,
    marginBottom: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
});
