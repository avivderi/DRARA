import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { SingleCtaFooter } from '../../components/layout/footers/SingleCtaFooter';
import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';
import { colors, fonts } from '../../theme/tokens';

interface PublishConfirmationScreenProps {
  ideaTitle?: string;
  repoFullName?: string;
  readinessScore?: number;
  visibility?: string;
  gaps?: string[];
  onViewMatches: () => void;
}

export const PublishConfirmationScreen: React.FC<PublishConfirmationScreenProps> = ({
  ideaTitle = 'DRARA Startup Platform',
  repoFullName = 'avivderi/DRARA',
  readinessScore = 8,
  visibility = 'public',
  gaps = ['Backend', 'DevOps', 'Marketing'],
  onViewMatches,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="המיזם פורסם בהצלחה!" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeIcon}>🚀</Text>
          <Text style={styles.badgeTitle}>הרעיון באוויר!</Text>
          <Text style={styles.badgeSubtitle}>
            המיזם &quot;{ideaTitle}&quot; עבר אינדוקס סמנטי על ידי Voyage AI וסריקת pgvector.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{ideaTitle}</Text>

          {repoFullName ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>🐙 {repoFullName}</Text>
              <Text style={styles.infoLabel}>Repository:</Text>
            </View>
          ) : null}

          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>⭐ {readinessScore}/10</Text>
            <Text style={styles.infoLabel}>Readiness Score:</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>
              {visibility === 'public'
                ? '🌐 ציבורי (Public)'
                : visibility === 'invite_only'
                ? '🔒 הזמנה בלבד'
                : '🕵️ המלצת AI פרטית'}
            </Text>
            <Text style={styles.infoLabel}>רמת נראות:</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.gapsTitle}>יכולות מבוקשות בשותף (Gaps):</Text>
          <View style={styles.chipsRow}>
            {gaps.map((gap) => (
              <View key={`pub-gap-${gap}`} style={styles.gapChip}>
                <Text style={styles.gapChipText}>{gap}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>מה קורה עכשיו?</Text>
          <Text style={styles.nextStepsText}>
            1. מנוע ה-pgvector מחשב את ה-Cosine Similarity מול מאגר היזמים ב-DB.{'\n'}
            2. Top candidates יקבלו AI Match Rationale מפורט.{'\n'}
            3. תוכל ליזום מפגש פיזי ולאמת את הניצוץ דרך NFC Handshake.
          </Text>
        </View>
      </ScrollView>

      <SingleCtaFooter label="עבור לרשימת המאצ'ים של המיזם ⚡" onPress={onViewMatches} />
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
    paddingTop: 20,
    paddingBottom: 30,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badgeIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  badgeTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeSubtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  summaryTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.primary,
    textAlign: 'right',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  infoValue: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  gapsTitle: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 6,
  },
  gapChip: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  gapChipText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primary,
  },
  nextStepsCard: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  nextStepsTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 6,
  },
  nextStepsText: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'right',
  },
});
