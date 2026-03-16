import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { usePreferences } from '@/contexts/PreferencesContext';
import { Colors, ColorPalette, Spacing, FontSize, FontWeight } from '@/constants/theme';

const C = Colors.dark;

const STEPS = [
  { emoji: '🧅', text: 'On analyse tes ingrédients...' },
  { emoji: '🤖', text: 'L\'IA prépare tes premières suggestions...' },
  { emoji: '✨', text: 'Tout est prêt !' },
];

export default function OnboardingFinish() {
  const router = useRouter();
  const { completeOnboarding } = usePreferences();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    // Compléter l'onboarding en arrière-plan
    const finish = async () => {
      await completeOnboarding();

      // Laisser le temps à l'animation d'être vue
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 4000);
    };

    finish();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.emojiCircle}>
          <Text style={styles.emoji}>🍽️</Text>
        </View>

        <Text style={styles.title}>C'est parti !</Text>
        <Text style={styles.subtitle}>
          On génère tes premières suggestions{'\n'}en fonction de ton frigo.
        </Text>

        <View style={styles.steps}>
          {STEPS.map((s, i) => (
            <StepRow key={i} emoji={s.emoji} text={s.text} delay={i * 600} />
          ))}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

function StepRow({ emoji, text, delay }: { emoji: string; text: string; delay: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]).start();
    }, delay + 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.stepRow, { opacity, transform: [{ translateY }] }]}>
      <Text style={styles.stepEmoji}>{emoji}</Text>
      <Text style={styles.stepText}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xl,
  },
  emojiCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(19, 236, 91, 0.1)',
    borderWidth: 2,
    borderColor: ColorPalette.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: C.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.base,
    color: C.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  steps: {
    width: '100%',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: C.surface,
    borderRadius: 12,
  },
  stepEmoji: {
    fontSize: 20,
  },
  stepText: {
    fontSize: FontSize.sm,
    color: C.text,
    flex: 1,
  },
});
