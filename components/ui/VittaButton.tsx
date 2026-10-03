// Vitta+ Button Component — components/ui/VittaButton.tsx
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radius, FontSize, FontWeight, Spacing, Shadow } from '@/constants/theme';

interface VittaButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  accentColor?: string;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function VittaButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  accentColor,
  style,
  fullWidth = false,
}: VittaButtonProps) {
  const bg = accentColor ?? Colors.primary;

  const containerStyle: ViewStyle[] = [
    styles.base,
    size === 'sm' && styles.sizeSm,
    size === 'md' && styles.sizeMd,
    size === 'lg' && styles.sizeLg,
    variant === 'primary' && { backgroundColor: bg, ...Shadow.sm },
    variant === 'outline' && { borderColor: bg, borderWidth: 2, backgroundColor: 'transparent' },
    variant === 'ghost' && { backgroundColor: 'transparent' },
    variant === 'accent' && { backgroundColor: bg + '20' },
    fullWidth && { width: '100%' as any },
    disabled && styles.disabled,
    style ?? {},
  ];

  const textColor =
    variant === 'primary'
      ? Colors.textOnPrimary
      : variant === 'outline'
      ? bg
      : variant === 'accent'
      ? bg
      : Colors.textPrimary;

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        ...containerStyle,
        pressed && { opacity: 0.82, transform: [{ scale: 0.98 }] },
      ]}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.inner}>
          {icon && iconPosition === 'left' && (
            <MaterialIcons name={icon} size={iconSize} color={textColor} style={styles.iconLeft} />
          )}
          <Text style={[styles.label, { color: textColor }, size === 'sm' && styles.labelSm, size === 'lg' && styles.labelLg]}>
            {label}
          </Text>
          {icon && iconPosition === 'right' && (
            <MaterialIcons name={icon} size={iconSize} color={textColor} style={styles.iconRight} />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  sizeSm: { paddingVertical: 8, paddingHorizontal: Spacing.md },
  sizeMd: { paddingVertical: 14, paddingHorizontal: Spacing.xl },
  sizeLg: { paddingVertical: 17, paddingHorizontal: Spacing.xl + 8 },
  inner: { flexDirection: 'row', alignItems: 'center' },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.2,
  },
  labelSm: { fontSize: FontSize.sm },
  labelLg: { fontSize: FontSize.lg },
  iconLeft: { marginRight: Spacing.xs },
  iconRight: { marginLeft: Spacing.xs },
  disabled: { opacity: 0.45 },
});
