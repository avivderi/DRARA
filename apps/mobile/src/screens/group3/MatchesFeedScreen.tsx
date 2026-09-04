import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import { BottomTabBar, type TabType } from '../../components/layout/footers/BottomTabBar';
import { BrandHeader } from '../../components/layout/headers/BrandHeader';
import { colors, fonts } from '../../theme/tokens';

export interface MatchCandidate {
  id: string;
  name: string;
  avatar_url?: string;
  skills: string[];
  similarityScore: number;
  aiRationale: string;
}

interface MatchesFeedScreenProps {
  ideaId: string;
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
  onCandidatePress: (candidate: MatchCandidate) => void;
}

export const MatchesFeedScreen: React.FC<MatchesFeedScreenProps> = ({
  ideaId,
  activeTab,
  onTabPress,
  onCandidatePress,
}) => {
  const [matches, setMatches] = useState<MatchCandidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/ideas/${ideaId}/matches`)
      .then((res) => res.json())
      .then((data: { matches?: Array<{ candidate: { id: string; name: string; skills: string[] }; similarityScore: number; aiRationale: string }> }) => {
        if (data.matches && data.matches.length > 0) {
          const formatted = data.matches.map((m) => ({
            id: m.candidate.id,
            name: m.candidate.name,
            skills: m.candidate.skills || ['Backend', 'DevOps', 'AWS'],
            similarityScore: m.similarityScore,
            aiRationale: m.aiRationale,
          }));
          setMatches(formatted);
        } else {
          // Fallback demo candidates
          setMatches([
            {
              id: 'u_1',
              name: 'יוסי כהן',
              skills: ['Backend', 'DevOps', 'Go', 'AWS'],
              similarityScore: 0.7071,
              aiRationale: 'התאמה טכנית גבוהה מאוד: ניסיון עשיר ב-Go ו-DevOps התואם את דרישות המיזם.',
            },
            {
              id: 'u_2',
              name: 'רוני לוי',
              skills: ['Fullstack', 'React Native', 'Node.js'],
              similarityScore: 0.5842,
              aiRationale: 'ניסיון מקיף בפיתוח אפליקציות נייטיב ובניית API.',
            },
          ]);
        }
        setLoading(false);
      })
      .catch(() => {
        setMatches([
          {
            id: 'u_1',
            name: 'יוסי כהן',
            skills: ['Backend', 'DevOps', 'Go', 'AWS'],
            similarityScore: 0.7071,
            aiRationale: 'התאמה טכנית גבוהה מאוד: ניסיון עשיר ב-Go ו-DevOps התואם את דרישות המיזם.',
          },
        ]);
        setLoading(false);
      });
  }, [ideaId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <BrandHeader unreadNotificationsCount={1} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.title}>התאמות AI מומלצות</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>pgvector similarity</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          <View style={styles.matchesList}>
            {matches.map((item) => {
              const scorePercent = Math.round(item.similarityScore * 100);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.matchCard}
                  onPress={() => onCandidatePress(item)}
                  activeOpacity={0.85}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarInitial}>{item.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.candidateDetails}>
                      <Text style={styles.candidateName}>{item.name}</Text>
                      <View style={styles.tagsRow}>
                        {item.skills.slice(0, 3).map((tag, idx) => (
                          <View key={idx} style={styles.tagPill}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    <View style={styles.scoreBadge}>
                      <Text style={styles.scoreText}>{scorePercent}%</Text>
                    </View>
                  </View>

                  <View style={styles.rationaleBox}>
                    <Text style={styles.rationaleTitle}>💡 הסבר התאמה (AI Rationale):</Text>
                    <Text style={styles.rationaleText}>{item.aiRationale}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <BottomTabBar activeTab={activeTab} onTabPress={onTabPress} />
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
  headerTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.textPrimary,
  },
  badge: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.primary,
  },
  loader: {
    marginTop: 40,
  },
  matchesList: {
    gap: 16,
  },
  matchCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.white,
  },
  candidateDetails: {
    flex: 1,
  },
  candidateName: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 4,
  },
  tagsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
  scoreBadge: {
    backgroundColor: colors.accentPoint,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  rationaleBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: 12,
  },
  rationaleTitle: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primary,
    marginBottom: 4,
    textAlign: 'right',
  },
  rationaleText: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textPrimary,
    textAlign: 'right',
  },
});
