import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors, ColorPalette, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

const C = Colors.dark;

type Props = {
  emoji: string;
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function ChoiceCard({ emoji, label, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: C.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  cardSelected: {
    borderColor: ColorPalette.primary,
    backgroundColor: 'rgba(19, 236, 91, 0.08)',
  },
  emoji: {
    fontSize: 32,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: C.textMuted,
    textAlign: 'center',
  },
  labelSelected: {
    color: C.text,
    fontWeight: FontWeight.semibold,
  },
});
