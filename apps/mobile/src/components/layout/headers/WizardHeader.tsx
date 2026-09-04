import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { colors, fonts } from '../../../theme/tokens';

interface WizardHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBackPress?: () => void;
  title?: string;
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({
  currentStep,
  totalSteps,
  onBackPress,
  title,
}) => {
  const progressPercent = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        {onBackPress && (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress} activeOpacity={0.7}>
            <Text style={styles.backArrowText}>➔</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.stepText}>
          שלב {currentStep} מתוך {totalSteps}
        </Text>
      </View>

      {title && <Text style={styles.titleText}>{title}</Text>}

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceAlt,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrowText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  stepText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  titleText: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'right',
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
});
