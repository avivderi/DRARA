import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { BottomTabBar, TabType } from '../../components/layout/footers/BottomTabBar';
import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';
import { colors, fonts } from '../../theme/tokens';

export interface MyIdeaItem {
  id: string;
  title: string;
  repoFullName?: string;
  visibility: 'public' | 'invite_only' | 'private_ai_recommend';
  matchesCount: number;
  readinessScore: number;
  updatedAt: string;
}

interface MyIdeasScreenProps {
  ideas?: MyIdeaItem[];
  activeTab?: TabType;
  onTabPress?: (tab: TabType) => void;
  onCreateNewIdea: () => void;
  onSelectIdeaMatches: (ideaId: string) => void;
  onToggleVisibility: (ideaId: string, newVisibility: 'public' | 'invite_only' | 'private_ai_recommend') => void;
}

const SAMPLE_IDEAS: MyIdeaItem[] = [
  {
    id: 'idea-1',
    title: 'DRARA - Co-Founder Matching Platform',
    repoFullName: 'avivderi/DRARA',
    visibility: 'public',
    matchesCount: 14,
    readinessScore: 8,
    updatedAt: 'עודכן היום',
  },
  {
    id: 'idea-2',
    title: 'Stealth AI Agent Marketplace',
    visibility: 'private_ai_recommend',
    matchesCount: 5,
    readinessScore: 7,
    updatedAt: 'עודכן לפני 3 ימים',
  },
];

export const MyIdeasScreen: React.FC<MyIdeasScreenProps> = ({
  ideas = SAMPLE_IDEAS,
  activeTab = 'home',
  onTabPress,
  onCreateNewIdea,
  onSelectIdeaMatches,
  onToggleVisibility,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="הרעיונות והמיזמים שלי" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Text style={styles.subtitle}>נהל את המיזמים שהעלית, צפה במאצ'ים ושנה הגדרות נראות.</Text>
          <TouchableOpacity style={styles.addBtn} onPress={onCreateNewIdea} activeOpacity={0.8}>
            <Text style={styles.addBtnText}>➕ רעיון חדש</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ideasList}>
          {ideas.map((idea) => (
            <View key={idea.id} style={styles.ideaCard}>
              <View style={styles.cardHeader}>
                <View style={styles.visibilityBadge}>
                  <Text style={styles.visibilityText}>
                    {idea.visibility === 'public'
                      ? '🌐 ציבורי'
                      : idea.visibility === 'invite_only'
                      ? '🔒 הזמנה בלבד'
                      : '🕵️ AI Private'}
                  </Text>
                </View>

                <Text style={styles.matchesBadge}>⚡ {idea.matchesCount} מאצ'ים</Text>
              </View>

              <Text style={styles.ideaTitle}>{idea.title}</Text>
              {idea.repoFullName ? (
                <Text style={styles.repoName}>🐙 {idea.repoFullName}</Text>
              ) : null}

              <View style={styles.divider} />

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.matchesBtn}
                  onPress={() => onSelectIdeaMatches(idea.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.matchesBtnText}>🎯 צפה במאצ'ים ({idea.matchesCount})</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.settingsBtn}
                  onPress={() => {
                    const nextVis = idea.visibility === 'public' ? 'private_ai_recommend' : 'public';
                    onToggleVisibility(idea.id, nextVis);
                  }}
                >
                  <Text style={styles.settingsBtnText}>⚙️ נראות</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  topBar: {
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 12,
  },
  addBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  addBtnText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  ideasList: {
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
  visibilityBadge: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  visibilityText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textPrimary,
  },
  matchesBadge: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
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
    color: colors.textSecondary,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  cardActions: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 8,
  },
  matchesBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  matchesBtnText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.white,
  },
  settingsBtn: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsBtnText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textPrimary,
  },
});
