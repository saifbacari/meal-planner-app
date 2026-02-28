import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
}

export function Chip({ label, selected, onPress, icon }: ChipProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    minHeight: 40,
    backgroundColor: selected ? '#13ec5b' : colors.surface,
    borderWidth: selected ? 0 : 1,
    borderColor: selected ? 'transparent' : colors.border,
    justifyContent: 'center',
  };

  const textColor = selected ? '#000000' : colors.text;
  const fontWeight = selected ? FontWeight.semibold : FontWeight.medium;

  return (
    <TouchableOpacity style={containerStyle} onPress={onPress} activeOpacity={0.7}>
      {icon && <>{icon}</>}
      <Text
        style={[
          {
            fontSize: FontSize.sm,
            fontWeight,
            color: textColor,
            marginLeft: icon ? Spacing.xs : 0,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
