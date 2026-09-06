import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { WizardFooter } from '../../components/layout/footers/WizardFooter';
import { WizardHeader } from '../../components/layout/headers/WizardHeader';
import { colors, fonts } from '../../theme/tokens';

export interface AIScanData {
  repoFullName: string;
  aiSummary: string;
  stackDetected: string[];
  readinessScore: number;
  readinessRationale: string;
}

interface AIScanResultsScreenProps {
  currentStep: number;
  totalSteps: number;
  scanData?: AIScanData;
  onBackPress: () => void;
  onNext: () => void;
}

const DEFAULT_SCAN_DATA: AIScanData = {
  repoFullName: 'avivderi/DRARA',
  aiSummary: 'מיזם SaaS מבוסס AI למאצ\'ינג סמנטי בין יזמים ופלטפורמת אימות NFC פיזית. ארכיטקטורת Monorepo מלאה עם React Native, Express ו-FastAPI.',
  stackDetected: ['TypeScript', 'Node.js / Express', 'Python / FastAPI', 'PostgreSQL / pgvector', 'Docker'],
  readinessScore: 8,
  readinessRationale: 'קוד בנוי ברמת ייצור (Production Ready) עם טסטים מקצה לקצה, ניהול שגיאות ואבטחת API.',
};

export const AIScanResultsScreen: React.FC<AIScanResultsScreenProps> = ({
  currentStep,
  totalSteps,
  scanData = DEFAULT_SCAN_DATA,
  onBackPress,
  onNext,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <WizardHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBackPress={onBackPress}
        title="תוצאות ניתוח ה-AI"
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          ה-AI סיים לסרוק את {scanData.repoFullName} והפיק את תמונת המצב הטכנולוגית הבאה:
        </Text>

        <View style={styles.scoreCard}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>{scanData.readinessScore}</Text>
            <Text style={styles.scoreMax}>/10</Text>
          </View>
          <View style={styles.scoreTextGroup}>
            <Text style={styles.scoreTitle}>מדד מוכנות המיזם (Readiness Score)</Text>
            <Text style={styles.scoreRationale}>{scanData.readinessRationale}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📝 תמצית מנהלים (AI Summary)</Text>
          <Text style={styles.summaryText}>{scanData.aiSummary}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🛠️ טכנולוגיות שנמצאו (Stack Detected)</Text>
          <View style={styles.chipsContainer}>
            {scanData.stackDetected.map((tech) => (
              <View key={tech} style={styles.techChip}>
                <Text style={styles.techChipText}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <WizardFooter onNext={onNext} nextLabel="המשך להגדרת Gaps ושותפים 🚀" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 20,
  },
  scoreCard: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  scoreCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNumber: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.white,
    lineHeight: 28,
  },
  scoreMax: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.accentPoint,
  },
  scoreTextGroup: {
    flex: 1,
  },
  scoreTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 4,
  },
  scoreRationale: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 10,
  },
  summaryText: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  chipsContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  techChip: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  techChipText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.primary,
  },
});
