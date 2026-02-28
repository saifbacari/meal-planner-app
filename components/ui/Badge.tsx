import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize, FontWeight } from '@/constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

const variantColors = {
  primary: { bg: '#13ec5b', text: '#000000' },
  success: { bg: '#10b981', text: '#ffffff' },
  warning: { bg: '#f59e0b', text: '#ffffff' },
  error: { bg: '#ef4444', text: '#ffffff' },
  info: { bg: '#0ea5e9', text: '#ffffff' },
  neutral: { bg: '#6b7280', text: '#ffffff' },
};

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const color = variantColors[variant];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color.bg,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: color.text,
          },
        ]}
      >
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
});
