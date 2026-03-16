import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, ColorPalette, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

const C = Colors.dark;

export default function OnboardingWelcome() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroCircle}>
            <Text style={styles.heroEmoji}>🍽️</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✨ Propulsé par l'IA</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>
            Ton frigo,{'\n'}
            <Text style={styles.titleAccent}>tes recettes.</Text>
          </Text>
          <Text style={styles.tagline}>
            Dis-nous ce que tu as. On s'occupe du reste.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <Feature icon="🧠" title="Suggestions intelligentes" desc="L'IA analyse ton frigo et tes goûts" />
          <Feature icon="⚡" title="En moins de 30 secondes" desc="Rapide, sans prise de tête" />
          <Feature icon="❤️" title="Adapté à toi" desc="Tes objectifs, ton niveau, tes allergies" />
        </View>

      </Animated.View>

      {/* Footer fixe */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => router.push('/onboarding/step1')}
          activeOpacity={0.85}
        >
          <Text style={styles.startBtnText}>Commencer — 2 min</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIcon}>
        <Text style={styles.featureEmoji}>{icon}</Text>
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
    gap: Spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  heroCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(19, 236, 91, 0.12)',
    borderWidth: 2,
    borderColor: 'rgba(19, 236, 91, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 56,
  },
  badge: {
    backgroundColor: 'rgba(19, 236, 91, 0.1)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(19, 236, 91, 0.25)',
  },
  badgeText: {
    fontSize: FontSize.xs,
    color: ColorPalette.primary,
    fontWeight: FontWeight.semibold,
  },
  titleBlock: {
    gap: Spacing.sm,
  },
  title: {
    fontSize: 36,
    fontWeight: FontWeight.bold,
    color: C.text,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  titleAccent: {
    color: ColorPalette.primary,
  },
  tagline: {
    fontSize: FontSize.base,
    color: C.textMuted,
    lineHeight: 24,
  },
  features: {
    gap: Spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: C.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureEmoji: {
    fontSize: 22,
  },
  featureText: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: C.text,
  },
  featureDesc: {
    fontSize: FontSize.xs,
    color: C.textMuted,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  startBtn: {
    width: '100%',
    paddingVertical: Spacing.md + 4,
    borderRadius: Radius.md,
    backgroundColor: ColorPalette.primary,
    alignItems: 'center',
  },
  startBtnText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: '#000',
  },
});
