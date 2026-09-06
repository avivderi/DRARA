// TODO: needs backend — Module 5 (Messaging/Public)
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

import { BottomTabBar, TabType } from '../../components/layout/footers/BottomTabBar';
import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';
import { colors, fonts } from '../../theme/tokens';

export interface UserProfileData {
  name: string;
  avatarUrl: string;
  headline: string;
  bio: string;
  role: string;
  experienceYears: string;
  availability: string;
  offeringTags: string[];
  seekingTags: string[];
  githubUsername?: string;
}

interface UserProfileScreenProps {
  profile?: UserProfileData;
  activeTab?: TabType;
  onTabPress?: (tab: TabType) => void;
  onEditProfile: () => void;
  onOpenSettings: () => void;
}

const DEFAULT_PROFILE: UserProfileData = {
  name: 'אביב דרי',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  headline: 'Fullstack Architect & AI Agent Builder',
  bio: 'מפתח מערכות ענן ואינטליגנציה מלאכותית. הקמתי מוצרים מבוססי AI, pgvector ו-Microservices. מחפש שותף/ה להובלת השיווק והמכירות.',
  role: 'The Builder',
  experienceYears: '5-10 שנים',
  availability: 'משרה מלאה (40+ שעות)',
  offeringTags: ['Backend', 'DevOps', 'AWS', 'Python', 'AI / ML'],
  seekingTags: ['Marketing', 'B2B Sales', 'Product Strategy'],
  githubUsername: 'avivderi',
};

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  profile = DEFAULT_PROFILE,
  activeTab = 'profile',
  onTabPress,
  onEditProfile,
  onOpenSettings,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="הפרופיל שלי" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.headline}>{profile.headline}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.editBtn} onPress={onEditProfile} activeOpacity={0.8}>
              <Text style={styles.editBtnText}>✏️ עריכת פרופיל</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsBtn} onPress={onOpenSettings} activeOpacity={0.8}>
              <Text style={styles.settingsBtnText}>⚙️ הגדרות</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>👨‍💻 אודות (Bio)</Text>
          <Text style={styles.bodyText}>{profile.bio}</Text>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>זמינות שבועית</Text>
              <Text style={styles.detailValue}>{profile.availability}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>ניסיון מקצועי</Text>
              <Text style={styles.detailValue}>{profile.experienceYears}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>💡 תגיות Offering (מה שאתה מציע)</Text>
          <View style={styles.chipsRow}>
            {profile.offeringTags.map((tag) => (
              <View key={`my-off-${tag}`} style={styles.offeringChip}>
                <Text style={styles.offeringChipText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎯 תגיות Seeking (מה שאתה מחפש)</Text>
          <View style={styles.chipsRow}>
            {profile.seekingTags.map((tag) => (
              <View key={`my-seek-${tag}`} style={styles.seekingChip}>
                <Text style={styles.seekingChipText}>{tag}</Text>
              </View>
            ))}
          </View>
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
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: 10,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  headline: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  editBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  editBtnText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.white,
  },
  settingsBtn: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  settingsBtnText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textPrimary,
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
  bodyText: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
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
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  offeringChipText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.white,
  },
  seekingChip: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  seekingChipText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primary,
  },
});
