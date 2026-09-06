import React, { useEffect, useState } from 'react';
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
import { apiGet } from '../../services/apiClient';
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

interface ApiPublicIdea {
  id: string;
  title?: string;
  owner_name?: string;
  ownerName?: string;
  owner_avatar?: string;
  github_repo_full_name?: string;
  repoFullName?: string;
  readiness_score?: number;
  readinessScore?: number;
  tags?: string[];
  offering_tags?: string[];
  manual_description?: string;
  description?: string;
  summary?: string;
}

interface PublicFeedScreenProps {
  ideas?: PublicIdeaItem[];
  activeTab?: TabType;
  onTabPress?: (tab: TabType) => void;
  onSelectIdea: (ideaId: string) => void;
  onOpenSearch: () => void;
}

export const PublicFeedScreen: React.FC<PublicFeedScreenProps> = ({
  ideas: propIdeas,
  activeTab = 'home',
  onTabPress,
  onSelectIdea,
  onOpenSearch,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [ideaList, setIdeaList] = useState<PublicIdeaItem[]>(propIdeas || []);

  useEffect(() => {
    if (!propIdeas) {
      apiGet<{ ideas: ApiPublicIdea[] }>('/ideas/public')
        .then((res) => {
          if (Array.isArray(res.ideas)) {
            const mapped: PublicIdeaItem[] = res.ideas.map((item) => ({
              id: item.id,
              title: item.title || 'מיזם ללא שם',
              ownerName: item.owner_name || item.ownerName || 'מייזם',
              ownerAvatar: item.owner_avatar || '',
              repoFullName: item.github_repo_full_name || item.repoFullName,
              readinessScore: item.readiness_score || item.readinessScore || 8,
              tags: item.tags || item.offering_tags || ['SaaS', 'AI'],
              summary: item.manual_description || item.description || item.summary || 'אין תיאור זמין',
            }));
            setIdeaList(mapped);
          }
        })
        .catch(() => {});
    }
  }, [propIdeas]);



  const filteredIdeas = ideaList.filter(
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
