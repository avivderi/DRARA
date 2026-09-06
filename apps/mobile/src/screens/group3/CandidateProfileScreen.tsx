import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';

import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';
import { colors, fonts } from '../../theme/tokens';

export interface CandidateProfileData {
  id: string;
  name: string;
  avatarUrl: string;
  headline: string;
  bio: string;
  role: string;
  experienceYears: string;
  availability: string;
  offeringTags: string[];
  seekingTags: string[];
  similarityScore: number;
  aiRationale: string;
  githubRepoFullName?: string;
}

interface CandidateProfileScreenProps {
  candidate?: CandidateProfileData;
  onBackPress: () => void;
  onRequestIntro: () => void;
  onViewDeepDive: () => void;
}

const DEFAULT_CANDIDATE: CandidateProfileData = {
  id: 'cand-1',
  name: 'אלון מזרחי',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  headline: 'Senior Cloud Infrastructure & DevOps Engineer (8y exp)',
  bio: 'מפתח תשתיות ענן בכיר, מומחה ב-Kubernetes, AWS, Go ו-Microservices. הובלתי ארכיטקטורת ענן בסטארטאפ שצמח מ-0 ל-10M משתמשים. מחפש שותף/ה להובלת המוצר והמכירות.',
  role: 'The Builder',
  experienceYears: '5-10 שנים',
  availability: 'משרה מלאה (40+ שעות)',
  offeringTags: ['Backend', 'DevOps', 'AWS', 'Kubernetes', 'Go'],
  seekingTags: ['Product', 'Marketing', 'Sales'],
  similarityScore: 0.8842,
  aiRationale: 'התאמה סמנטית גבוהה ביותר (88.4%): אלון מביא ניסיון מעמיק ב-Backend & DevOps שחסר ברעיון שלך, בעוד אתה מביא את הובלת המוצר והשיווק שהוא מחפש.',
  githubRepoFullName: 'alonm/k8s-cloud-toolkit',
};

export const CandidateProfileScreen: React.FC<CandidateProfileScreenProps> = ({
  candidate = DEFAULT_CANDIDATE,
  onBackPress,
  onRequestIntro,
  onViewDeepDive,
}) => {
  const matchPercentage = Math.round(candidate.similarityScore * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="פרופיל מועמד למיזם" onBackPress={onBackPress} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Image source={{ uri: candidate.avatarUrl }} style={styles.avatar} />
          <Text style={styles.name}>{candidate.name}</Text>
          <Text style={styles.headline}>{candidate.headline}</Text>

          <View style={styles.matchScoreBadge}>
            <Text style={styles.matchScoreText}>⭐ {matchPercentage}% התאמה סמנטית (pgvector)</Text>
          </View>
        </View>

        <View style={styles.rationaleCard}>
          <Text style={styles.rationaleTitle}>🤖 ניתוח התאמה מבוסס AI</Text>
          <Text style={styles.rationaleText}>{candidate.aiRationale}</Text>

          <TouchableOpacity style={styles.deepDiveBtn} onPress={onViewDeepDive}>
            <Text style={styles.deepDiveBtnText}>📊 צפה בדוח AI DeepDive המלא</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>👨‍💻 אודות ורקע מקצועי</Text>
          <Text style={styles.bodyText}>{candidate.bio}</Text>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>זמינות שבועית</Text>
              <Text style={styles.detailValue}>{candidate.availability}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>ניסיון מקצועי</Text>
              <Text style={styles.detailValue}>{candidate.experienceYears}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>💡 מה הוא מציע (Offering Tags)</Text>
          <View style={styles.chipsRow}>
            {candidate.offeringTags.map((tag) => (
              <View key={`off-${tag}`} style={styles.offeringChip}>
                <Text style={styles.offeringChipText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🎯 מה הוא מחפש בשותף (Seeking Tags)</Text>
          <View style={styles.chipsRow}>
            {candidate.seekingTags.map((tag) => (
              <View key={`seek-${tag}`} style={styles.seekingChip}>
                <Text style={styles.seekingChipText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {candidate.githubRepoFullName ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>🐙 Repository בולט ב-GitHub</Text>
            <Text style={styles.repoName}>{candidate.githubRepoFullName}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.introBtn} onPress={onRequestIntro} activeOpacity={0.8}>
          <Text style={styles.introBtnText}>🤝 צור קשר / קבע פגישת NFC Handshake</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 90,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: 12,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  headline: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  matchScoreBadge: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  matchScoreText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.primary,
  },
  rationaleCard: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  rationaleTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 6,
  },
  rationaleText: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 12,
  },
  deepDiveBtn: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  deepDiveBtnText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.primary,
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
  bodyText: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  detailItem: {
    flex: 1,
    alignItems: 'flex-end',
  },
  detailLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  chipsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 6,
  },
  offeringChip: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  offeringChipText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.white,
  },
  seekingChip: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  seekingChipText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.primary,
  },
  repoName: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primary,
    textAlign: 'right',
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  introBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  introBtnText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
});
