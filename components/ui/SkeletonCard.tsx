import { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, Radius, Shadow } from '@/constants/theme';

function useSkeletonAnimation() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  return opacity;
}

function SkeletonBox({ width, height, style }: { width?: number | string; height: number; style?: object }) {
  const opacity = useSkeletonAnimation();
  const colorScheme = useColorScheme();
  const bg = colorScheme === 'dark' ? '#1f3a28' : '#e8ede9';

  return (
    <Animated.View
      style={[{ width, height, borderRadius: Radius.sm, backgroundColor: bg, opacity }, style]}
    />
  );
}

export function SkeletonCard({ featured = false }: { featured?: boolean }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (featured) {
    return (
      <View
        style={[
          styles.featuredContainer,
          {
            backgroundColor: colorScheme === 'dark' ? 'rgba(16, 178, 129, 0.08)' : '#f0fdf4',
            borderColor: colorScheme === 'dark' ? '#047857' : '#86efac',
            ...Shadow.md,
          },
        ]}
      >
        <View style={styles.featuredBadgeRow}>
          <SkeletonBox width={70} height={20} />
        </View>
        <View style={styles.featuredContent}>
          <SkeletonBox width={96} height={96} style={{ borderRadius: Radius.md }} />
          <View style={styles.featuredInfo}>
            <SkeletonBox width={60} height={16} />
            <SkeletonBox width="90%" height={18} style={{ marginTop: Spacing.sm }} />
            <SkeletonBox width="70%" height={14} style={{ marginTop: Spacing.xs }} />
            <View style={styles.statsRow}>
              <SkeletonBox width={50} height={14} />
              <SkeletonBox width={60} height={14} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border, ...Shadow.sm },
      ]}
    >
      <View style={styles.content}>
        <SkeletonBox width={80} height={80} style={{ borderRadius: Radius.md }} />
        <View style={styles.info}>
          <SkeletonBox width={60} height={16} />
          <SkeletonBox width="80%" height={16} style={{ marginTop: Spacing.sm }} />
          <SkeletonBox width="60%" height={12} style={{ marginTop: Spacing.xs }} />
          <View style={styles.statsRow}>
            <SkeletonBox width={45} height={12} />
            <SkeletonBox width={55} height={12} />
          </View>
        </View>
      </View>
    </View>
  );
}

export function SkeletonSteps() {
  return (
    <View style={styles.stepsContainer}>
      {[100, 85, 95, 75, 90].map((pct, i) => (
        <View key={i} style={styles.stepRow}>
          <SkeletonBox width={28} height={28} style={{ borderRadius: 14, flexShrink: 0 }} />
          <View style={{ flex: 1, gap: Spacing.xs }}>
            <SkeletonBox width={`${pct}%`} height={14} />
            {pct > 88 && <SkeletonBox width={`${pct - 20}%`} height={14} />}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  info: {
    flex: 1,
    gap: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  featuredContainer: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  featuredBadgeRow: {
    marginBottom: Spacing.sm,
  },
  featuredContent: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  featuredInfo: {
    flex: 1,
  },
  stepsContainer: {
    gap: Spacing.md,
    paddingTop: Spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
});
