import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { colors, fonts } from '../../../theme/tokens';

interface SingleCtaFooterProps {
  onPress: () => void;
  label: string;
  disabled?: boolean;
  variant?: 'primary' | 'accent' | 'outline';
}

export const SingleCtaFooter: React.FC<SingleCtaFooterProps> = ({
  onPress,
  label,
  disabled = false,
  variant = 'primary',
}) => {
  const buttonStyle =
    variant === 'accent'
      ? styles.accentButton
      : variant === 'outline'
      ? styles.outlineButton
      : styles.primaryButton;

  const textStyle =
    variant === 'outline' ? styles.outlineText : styles.primaryText;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[buttonStyle, disabled && styles.disabledButton]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={textStyle}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceAlt,
  },
  primaryButton: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentButton: {
    height: 52,
    backgroundColor: colors.accentPoint,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    height: 52,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: colors.border,
    borderColor: colors.border,
  },
  primaryText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
  },
  outlineText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.primary,
  },
});
