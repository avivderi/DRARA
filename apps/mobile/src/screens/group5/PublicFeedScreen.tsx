// TODO: needs backend — Module 5 (Messaging/Public)
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';

import { BottomTabBar, TabType } from '../../components/layout/footers/BottomTabBar';
import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';
import { colors, fonts } from '../../theme/tokens';

export interface PublicIdeaItem {
  id: string;
  title: string;
  ownerName: string;
  ownerAvatar: string;
  repoFullName?: string;
  readinessScore: number;
  tags: string[];
  summary: string;
}

interface PublicFeedScreenProps {
  ideas?: PublicIdeaItem[];
  activeTab?: TabType;
  onTabPress?: (tab: TabType) => void;
  onSelectIdea: (ideaId: string) => void;
  onOpenSearch: () => void;
}

const SAMPLE_PUBLIC_IDEAS: PublicIdeaItem[] = [
  {
    id: 'pub-1',
    title: 'Distributed Cloud Microservices Platform',
    ownerName: 'רועי כהן',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    repoFullName: 'roicohen/cloud-mesh',
    readinessScore: 9,
    tags: ['Backend', 'DevOps', 'AWS', 'Go'],
    summary: 'פלטפורמת ענן לניהול תזמור מיקרו-שירותים. מחפש שותף מוביל בשיווק B2B.',
  },
  {
    id: 'pub-2',
    title: 'FinTech Algorithmic Trading Bot',
    ownerName: 'דנה לוי',
    ownerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    readinessScore: 8,
    tags: ['Python', 'AI / ML', 'Finance'],
    summary: 'אלגוריתם מסחר אוטומטי במתכונת SaaS. מחפשת מפתח/ת Backend מנוסה.',
  },
];

export const PublicFeedScreen: React.FC<PublicFeedScreenProps> = ({
  ideas = SAMPLE_PUBLIC_IDEAS,
  activeTab = 'home',
  onTabPress,
  onSelectIdea,
  onOpenSearch,
}) => {
  const [searchFilter, setSearchFilter] = useState('');

  const filteredIdeas = ideas.filter(
    (i) =>
      i.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      i.summary.toLowerCase().includes(searchFilter.toLowerCase()) ||
      i.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase())),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="פיד מיזמים ציבוריים" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.searchBar} onPress={onOpenSearch} activeOpacity={0.9}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 חפש מיזם לפי תגית, טכנולוגיה או שם..."
            placeholderTextColor={colors.textSecondary}
            value={searchFilter}
            onChangeText={setSearchFilter}
            textAlign="right"
          />
        </TouchableOpacity>

        <View style={styles.feedList}>
          {filteredIdeas.map((idea) => (
            <TouchableOpacity
              key={idea.id}
              style={styles.ideaCard}
              onPress={() => onSelectIdea(idea.id)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>⭐ {idea.readinessScore}/10</Text>
                </View>

                <Text style={styles.ownerName}>מאת {idea.ownerName}</Text>
              </View>

              <Text style={styles.ideaTitle}>{idea.title}</Text>
              {idea.repoFullName ? (
                <Text style={styles.repoName}>🐙 {idea.repoFullName}</Text>
              ) : null}

              <Text style={styles.summaryText}>{idea.summary}</Text>

              <View style={styles.chipsRow}>
                {idea.tags.map((tag) => (
                  <View key={`feed-${tag}`} style={styles.tagChip}>
                    <Text style={styles.tagChipText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {onTabPress && <BottomTabBar activeTab={activeTab} onTabPress={onTabPress} />}
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
  searchBar: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  feedList: {
    gap: 14,
  },
  ideaCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreBadge: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  scoreText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.primary,
  },
  ownerName: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  ideaTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 4,
  },
  repoName: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.primary,
    textAlign: 'right',
    marginBottom: 8,
  },
  summaryText: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 12,
  },
  chipsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagChip: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagChipText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.textPrimary,
  },
});
