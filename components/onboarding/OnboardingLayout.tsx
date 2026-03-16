import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, ColorPalette, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

const C = Colors.dark;

type Props = {
  step: number;
  total: number;
  title: string;
  subtitle: string;
  onNext: () => void;
  nextLabel?: string;
  canNext: boolean;
  showSkip?: boolean;
  children: React.ReactNode;
};

export function OnboardingLayout({
  step,
  total,
  title,
  subtitle,
  onNext,
  nextLabel = 'Continuer',
  canNext,
  showSkip = true,
  children,
}: Props) {
  const router = useRouter();
  const progress = step / total;

  const handleSkip = () => {
    if (step < total) {
      router.push(`/onboarding/step${step + 1}` as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={C.text} />
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{step}/{total}</Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>{children}</View>

      {/* Footer */}
      <View style={styles.footer}>
        {showSkip && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Passer</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, !canNext && styles.nextBtnDisabled, !showSkip && styles.nextBtnFull]}
          onPress={onNext}
          disabled={!canNext}
        >
          <Text style={styles.nextText}>{nextLabel}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backBtn: {
    padding: 4,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: ColorPalette.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: FontSize.xs,
    color: C.textMuted,
    fontWeight: FontWeight.medium,
    minWidth: 24,
    textAlign: 'right',
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: C.textMuted,
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  skipBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
  },
  skipText: {
    fontSize: FontSize.base,
    color: C.textMuted,
    fontWeight: FontWeight.medium,
  },
  nextBtn: {
    flex: 2,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: ColorPalette.primary,
    alignItems: 'center',
  },
  nextBtnFull: {
    flex: 1,
  },
  nextBtnDisabled: {
    opacity: 0.4,
  },
  nextText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: '#000',
  },
});
