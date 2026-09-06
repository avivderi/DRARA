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

interface ProfileCompletionSuccessScreenProps {
  userName?: string;
  headline?: string;
  offeringTags?: string[];
  seekingTags?: string[];
  onViewMatches: () => void;
  onCreateIdea: () => void;
}

export const ProfileCompletionSuccessScreen: React.FC<ProfileCompletionSuccessScreenProps> = ({
  userName = 'יזם',
  headline = 'Fullstack Engineer & Founder',
  offeringTags = ['Backend', 'DevOps'],
  seekingTags = ['Marketing', 'Product'],
  onViewMatches,
  onCreateIdea,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="פרופיל היזם מוכן!" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeIcon}>🎉</Text>
          <Text style={styles.badgeTitle}>ברכות, {userName}!</Text>
          <Text style={styles.badgeSubtitle}>
            פרופיל היזם שלך הוגדר בהצלחה במערכת DRARA.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryHeadline}>{headline}</Text>

          <View style={styles.divider} />

          <View style={styles.tagSection}>
            <Text style={styles.tagSectionTitle}>מה אתה מציע (Offering):</Text>
            <View style={styles.chipsRow}>
              {offeringTags.map((tag) => (
                <View key={`sum-off-${tag}`} style={styles.offeringTagChip}>
                  <Text style={styles.offeringTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.tagSection}>
            <Text style={styles.tagSectionTitle}>מה אתה מחפש בשותף (Seeking):</Text>
            <View style={styles.chipsRow}>
              {seekingTags.map((tag) => (
                <View key={`sum-seek-${tag}`} style={styles.seekingTagChip}>
                  <Text style={styles.seekingTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.actionPromptCard}>
          <Text style={styles.actionPromptTitle}>מה הצעד הבא שלך?</Text>
          <Text style={styles.actionPromptDesc}>
            אתה יכול לצפות כבר עכשיו במאצ'ים המתאימים ביותר לפרופיל שלך, או להעלות רעיון חדש ולחבר Repository קוד.
          </Text>

          <View style={styles.secondaryActionBox}>
            <Text style={styles.secondaryActionText} onPress={onCreateIdea}>
              ➕ להעלות רעיון/מיזם חדש (Connect Repo / Pitch)
            </Text>
          </View>
        </View>
      </ScrollView>

      <SingleCtaFooter label="צפה במאצ'ים המומלצים עבורך 🚀" onPress={onViewMatches} />
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
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  summaryHeadline: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.primary,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  tagSection: {
    marginBottom: 10,
  },
  tagSectionTitle: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 6,
  },
  offeringTagChip: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  offeringTagText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primary,
  },
  seekingTagChip: {
    backgroundColor: '#E6F7F0',
    borderColor: colors.primaryHover,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  seekingTagText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primaryHover,
  },
  actionPromptCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionPromptTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 4,
  },
  actionPromptDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 12,
  },
  secondaryActionBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  secondaryActionText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primary,
  },
});
