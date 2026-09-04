import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { colors, fonts } from '../../../theme/tokens';

interface WizardFooterProps {
  onNext: () => void;
  nextLabel?: string;
  onSkip?: () => void;
  skipLabel?: string;
  showSkip?: boolean;
  disabled?: boolean;
}

export const WizardFooter: React.FC<WizardFooterProps> = ({
  onNext,
  nextLabel = 'המשך',
  onSkip,
  skipLabel = 'דלג לפעימות הבאות',
  showSkip = false,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.nextButton, disabled && styles.disabledButton]}
        onPress={onNext}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={styles.nextButtonText}>{nextLabel}</Text>
      </TouchableOpacity>

      {showSkip && onSkip && (
        <TouchableOpacity style={styles.skipButton} onPress={onSkip} activeOpacity={0.6}>
          <Text style={styles.skipText}>{skipLabel}</Text>
        </TouchableOpacity>
      )}
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
    gap: 12,
  },
  nextButton: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: colors.border,
  },
  nextButtonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
