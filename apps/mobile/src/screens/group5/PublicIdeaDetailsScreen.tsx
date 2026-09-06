import React, { useEffect, useState } from 'react';
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
import { apiGet } from '../../services/apiClient';
import { colors, fonts } from '../../theme/tokens';

export interface PublicIdeaDetails {
  id: string;
  title: string;
  ownerName: string;
  ownerAvatar: string;
  ownerHeadline: string;
  repoFullName?: string;
  readinessScore: number;
  aiSummary: string;
  tags: string[];
  seekingGaps: string[];
}

interface ApiPublicDetails {
  id: string;
  title?: string;
  owner_name?: string;
  ownerName?: string;
  owner_avatar?: string;
  owner_headline?: string;
  github_repo_full_name?: string;
  readiness_score?: number;
  ai_summary?: string;
  manual_description?: string;
  description?: string;
  tags?: string[];
  offering_tags?: string[];
  seeking_tags?: string[];
  seekingGaps?: string[];
}

interface PublicIdeaDetailsScreenProps {
  ideaId?: string;
  idea?: PublicIdeaDetails;
  onBackPress: () => void;
  onRequestContact: () => void;
}

const DEFAULT_DETAILS: PublicIdeaDetails = {
  id: 'pub-1',
  title: 'Distributed Cloud Microservices Platform',
  ownerName: 'רועי כהן',
  ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  ownerHeadline: 'Cloud Architect & Distributed Systems Expert',
  repoFullName: 'roicohen/cloud-mesh',
  readinessScore: 9,
  aiSummary: 'פלטפורמת ענן מתקדמת לתזמור מיקרו-שירותים. ארכיטקטורת קוד מוכנה לייצור ב-Go וב-Kubernetes.',
  tags: ['Backend', 'DevOps', 'AWS', 'Go', 'Microservices'],
  seekingGaps: ['Marketing', 'B2B Sales', 'Product Management'],
};

export const PublicIdeaDetailsScreen: React.FC<PublicIdeaDetailsScreenProps> = ({
  ideaId,
  idea: propIdea,
  onBackPress,
  onRequestContact,
}) => {
  const [details, setDetails] = useState<PublicIdeaDetails>(propIdea || DEFAULT_DETAILS);

  useEffect(() => {
    if (!propIdea && ideaId) {
      apiGet<ApiPublicDetails>(`/ideas/public/${ideaId}`)
        .then((res) => {
          if (res && res.id) {
            setDetails({
              id: res.id,
              title: res.title || 'מיזם ללא שם',
              ownerName: res.owner_name || res.ownerName || 'מייזם',
              ownerAvatar: res.owner_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              ownerHeadline: res.owner_headline || 'Co-Founder & Product Lead',
              repoFullName: res.github_repo_full_name,
              readinessScore: res.readiness_score || 8,
              aiSummary: res.ai_summary || res.manual_description || res.description || 'אין תיאור זמין',
              tags: res.tags || res.offering_tags || ['SaaS', 'Cloud'],
              seekingGaps: res.seekingGaps || res.seeking_tags || ['Fullstack', 'DevOps'],
            });
          }
        })
        .catch(() => {});
    }
  }, [ideaId, propIdea]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="פרטי מיזם ציבורי" onBackPress={onBackPress} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.ideaTitle}>{details.title}</Text>
          {details.repoFullName ? (
            <Text style={styles.repoName}>🐙 {details.repoFullName}</Text>
          ) : null}

          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>⭐ Readiness Score: {details.readinessScore}/10</Text>
          </View>
        </View>

        <View style={styles.ownerCard}>
          <Image source={{ uri: details.ownerAvatar }} style={styles.ownerAvatar} />
          <View style={styles.ownerInfo}>
            <Text style={styles.ownerName}>{details.ownerName}</Text>
            <Text style={styles.ownerHeadline}>{details.ownerHeadline}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📝 תמצית המיזם (AI Summary)</Text>
          <Text style={styles.cardText}>{details.aiSummary}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🛠️ טכנולוגיות שנמצאו (Stack)</Text>
          <View style={styles.chipsRow}>
            {details.tags.map((tag) => (
              <View key={`pub-tag-${tag}`} style={styles.tagChip}>
                <Text style={styles.tagChipText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎯 מחפש בשותף (Gaps Required)</Text>
          <View style={styles.chipsRow}>
            {details.seekingGaps.map((gap) => (
              <View key={`pub-gap-${gap}`} style={styles.gapChip}>
                <Text style={styles.gapChipText}>{gap}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.contactBtn} onPress={onRequestContact} activeOpacity={0.8}>
          <Text style={styles.contactBtnText}>📩 צור קשר / פנה ליזם</Text>
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
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  ideaTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  repoName: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primary,
    marginBottom: 10,
  },
  scoreBadge: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  scoreText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.primary,
  },
  ownerCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 16,
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 12,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  ownerHeadline: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 8,
  },
  cardText: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  chipsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagChip: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagChipText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primary,
  },
  gapChip: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  gapChipText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textPrimary,
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
  contactBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  contactBtnText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
});
