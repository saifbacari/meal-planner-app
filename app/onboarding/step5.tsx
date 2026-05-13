import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { ChoiceCard } from '@/components/onboarding/ChoiceCard';
import { usePreferences } from '@/contexts/PreferencesContext';
import { Colors, Spacing, FontSize } from '@/constants/theme';

const C = Colors.dark;

const EQUIPMENT = [
  { id: 'oven', emoji: '🔥', label: 'Four' },
  { id: 'microwave', emoji: '📡', label: 'Micro-ondes' },
  { id: 'air_fryer', emoji: '💨', label: 'Air Fryer' },
  { id: 'blender', emoji: '🧃', label: 'Mixeur / Blender' },
  { id: 'steamer', emoji: '♨️', label: 'Cuiseur vapeur' },
  { id: 'pressure_cooker', emoji: '🫕', label: 'Cocotte-minute' },
];

export default function Step5() {
  const router = useRouter();
  const { updateDraft, draft } = usePreferences();
  const [selected, setSelected] = useState<string[]>(draft.equipment ?? []);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    updateDraft({ equipment: selected });
    router.push('/onboarding/finish');
  };

  return (
    <OnboardingLayout
      step={5}
      total={5}
      title="Ton équipement cuisine"
      subtitle="On proposera uniquement des recettes que tu peux réaliser avec ce que tu as."
      onNext={handleFinish}
      nextLabel="Commencer !"
      canNext
      showSkip={false}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <Text style={styles.hint}>La poêle et la casserole sont toujours incluses.</Text>
        <View style={styles.grid}>
          {EQUIPMENT.map((item) => (
            <ChoiceCard
              key={item.id}
              emoji={item.emoji}
              label={item.label}
              selected={selected.includes(item.id)}
              onPress={() => toggle(item.id)}
            />
          ))}
        </View>
      </ScrollView>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  hint: {
    fontSize: FontSize.sm,
    color: C.textMuted,
    fontStyle: 'italic',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
});
