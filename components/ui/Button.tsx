import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon,
  iconPosition = 'left',
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = {
      borderRadius: Radius.full,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: icon ? 'row' : 'column',
      opacity: disabled ? 0.5 : 1,
    } as ViewStyle;

    const sizeStyle = {
      sm: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, minHeight: 36 },
      md: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, minHeight: 44 },
      lg: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, minHeight: 52 },
    }[size];

    const variantStyle = {
      primary: {
        backgroundColor: '#13ec5b',
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      secondary: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      },
    }[variant];

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    return { ...baseStyle, ...sizeStyle, ...variantStyle };
  };

  const getTextStyle = () => {
    const textColorMap = {
      primary: '#000000',
      ghost: colors.text,
      secondary: colors.text,
    };

    return {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: textColorMap[variant],
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon && iconPosition === 'left' && icon}
      <Text style={[getTextStyle(), icon && { marginLeft: Spacing.xs }]}>{label}</Text>
      {icon && iconPosition === 'right' && icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
