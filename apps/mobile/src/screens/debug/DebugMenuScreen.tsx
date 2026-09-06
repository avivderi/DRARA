import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import { colors, fonts } from '../../theme/tokens';
import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';

interface DebugMenuScreenProps {
  onBackPress: () => void;
  onNavigateToScreen: (routeName: string, params?: Record<string, unknown>) => void;
}

interface ScreenGroup {
  groupTitle: string;
  screens: { name: string; label: string; targetRoute: string; params?: Record<string, unknown> }[];
}

const SCREEN_GROUPS: ScreenGroup[] = [
  {
    groupTitle: 'קבוצה 1 — Onboarding & Auth (10 מסכים)',
    screens: [
      { name: 'WelcomeScreen', label: '1. מסך פתיחה ומיתוג (Welcome)', targetRoute: 'Onboarding' },
      { name: 'LoginScreen', label: '2. התחברות (Login)', targetRoute: 'Onboarding' },
      { name: 'OAuthCallbackScreen', label: '3. חזית OAuth Callback', targetRoute: 'Onboarding' },
      { name: 'RoleSelectionScreen', label: '4. בחירת תפקיד (Role Selection)', targetRoute: 'Onboarding' },
      { name: 'OfferingSeekingScreen', label: '5. מה אני מציע ומחפש', targetRoute: 'Onboarding' },
      { name: 'SkillsScreen', label: '6. בחירת מיומנויות (Skills)', targetRoute: 'Onboarding' },
      { name: 'ExperienceAvailabilityScreen', label: '7. ניסיון וזמינות', targetRoute: 'Onboarding' },
      { name: 'BioScreen', label: '8. פיץ׳ אישי (Bio)', targetRoute: 'Onboarding' },
      { name: 'AvatarHeadlineScreen', label: '9. תמונה וכותרת (Avatar)', targetRoute: 'Onboarding' },
      { name: 'ProfileCompletionSuccessScreen', label: '10. אישור סיום פרופיל', targetRoute: 'Onboarding' },
    ],
  },
  {
    groupTitle: 'קבוצה 2 — Idea Upload & AI Scan (8 מסכים)',
    screens: [
      { name: 'IdeaEntryScreen', label: '11. הזנת רעיון חדש', targetRoute: 'IdeaUpload' },
      { name: 'GitHubConnectScreen', label: '12. חיבור חשבון GitHub', targetRoute: 'IdeaUpload' },
      { name: 'RepoSelectionScreen', label: '13. לבחירת מאגר (Repo)', targetRoute: 'IdeaUpload' },
      { name: 'AIScanLoadingScreen', label: '14. טעינת ניתוח AI', targetRoute: 'IdeaUpload' },
      { name: 'AIScanResultsScreen', label: '15. תוצאות ניתוח ה-AI', targetRoute: 'IdeaUpload' },
      { name: 'MissingGapsScreen', label: '16. השלמת פערים ברעיון', targetRoute: 'IdeaUpload' },
      { name: 'VisibilitySettingsScreen', label: '17. הגדרות פרטיות וחשיפה', targetRoute: 'IdeaUpload' },
      { name: 'PublishConfirmationScreen', label: '18. אישור פרסום רעיון', targetRoute: 'IdeaUpload' },
    ],
  },
  {
    groupTitle: 'קבוצה 3 — Matches & Profiles (5 מסכים)',
    screens: [
      { name: 'MatchesFeedScreen', label: '19. פיד התאמות (Matches)', targetRoute: 'MainApp' },
      { name: 'MyIdeasScreen', label: '20. הרעיונות שלי (My Ideas)', targetRoute: 'MainApp' },
      { name: 'CandidateProfileScreen', label: '21. פרופיל מועמד מורחב', targetRoute: 'MainApp' },
      { name: 'MatchIntroModalScreen', label: '22. בקשת היכרות (Intro)', targetRoute: 'MainApp' },
      { name: 'DeepDiveReportScreen', label: '23. דוח ניתוח מעמיק (Deep Dive)', targetRoute: 'MainApp' },
    ],
  },
  {
    groupTitle: 'קבוצה 4 — Physical NFC Handshake (6 מסכים)',
    screens: [
      { name: 'ScheduleMeetingScreen', label: '24. תיאום מפגש פיזי', targetRoute: 'Handshake' },
      { name: 'MeetingFeedbackScreen', label: '25. משוב על מפגש', targetRoute: 'Handshake' },
      { name: 'NFCPreparationScreen', label: '26. הכנה ללחיצת יד NFC', targetRoute: 'Handshake' },
      { name: 'NFCHandshakeScreen', label: '27. מסך לחיצת יד בזמן אמת', targetRoute: 'Handshake' },
      { name: 'NFCSuccessScreen', label: '28. אישור הצלחת Handshake', targetRoute: 'Handshake' },
      { name: 'NFCTimeoutErrorScreen', label: '29. שגיאת זמן תגובה ב-NFC', targetRoute: 'Handshake' },
    ],
  },
  {
    groupTitle: 'קבוצה 5 — Community, Chat & Profile (9 מסכים)',
    screens: [
      { name: 'PublicFeedScreen', label: '30. פיד קהילתי ציבורי', targetRoute: 'MainApp' },
      { name: 'PublicIdeaDetailsScreen', label: '31. פרטי רעיון ציבורי', targetRoute: 'Group5Flow' },
      { name: 'IdeaSearchScreen', label: '32. חיפוש רעיונות ופרויקטים', targetRoute: 'Group5Flow' },
      { name: 'InboxScreen', label: '33. תיבת הודעות (Inbox)', targetRoute: 'MainApp' },
      { name: 'ChatConversationScreen', label: '34. שיחת צ׳אט (Chat)', targetRoute: 'Group5Flow' },
      { name: 'UserProfileScreen', label: '35. פרופיל משתמש אישי', targetRoute: 'MainApp' },
      { name: 'EditProfileScreen', label: '36. עריכת פרופיל', targetRoute: 'Group5Flow' },
      { name: 'SettingsScreen', label: '37. הגדרות חשבון', targetRoute: 'Group5Flow' },
      { name: 'NotificationsScreen', label: '38. התראות מערכת', targetRoute: 'Group5Flow' },
    ],
  },
  {
    groupTitle: 'קבוצה 6 — Shared Workspace & Equity (6 מסכים)',
    screens: [
      { name: 'PartnershipsScreen', label: '39. מיזמים מאומתים (Partnerships)', targetRoute: 'MainApp' },
      { name: 'WorkspaceOverviewScreen', label: '40. מרכז Workspace משותף', targetRoute: 'WorkspaceFlow' },
      { name: 'IdeaBoardScreen', label: '41. לוח משימות ורעיונות (Board)', targetRoute: 'WorkspaceFlow' },
      { name: 'RoadmapScreen', label: '42. מפת דרכים (Roadmap)', targetRoute: 'WorkspaceFlow' },
      { name: 'DecisionLogScreen', label: '43. יומן החלטות (Decision Log)', targetRoute: 'WorkspaceFlow' },
      { name: 'EquityFrameworkScreen', label: '44. מודל חלוקת אקוויטי (Equity)', targetRoute: 'WorkspaceFlow' },
    ],
  },
];

export const DebugMenuScreen: React.FC<DebugMenuScreenProps> = ({
  onBackPress,
  onNavigateToScreen,
}) => {
  if (!__DEV__) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="🛠️ תפריט Debug לניווט ישיר (DEV Only)" onBackPress={onBackPress} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>⚡ ניווט מהיר לכל המסכים</Text>
          <Text style={styles.bannerSubtitle}>
            תפריט זה פעיל אך ורק בסביבת פיתוח (__DEV__). בחר מסך למעבר ישיר.
          </Text>
        </View>

        {SCREEN_GROUPS.map((group, gIdx) => (
          <View key={gIdx} style={styles.groupCard}>
            <Text style={styles.groupHeader}>{group.groupTitle}</Text>
            {group.screens.map((sc, sIdx) => (
              <TouchableOpacity
                key={sIdx}
                style={styles.screenBtn}
                activeOpacity={0.7}
                onPress={() => onNavigateToScreen(sc.targetRoute, sc.params)}
              >
                <Text style={styles.screenBtnText}>{sc.label}</Text>
                <Text style={styles.screenCodeName}>{sc.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 16,
    gap: 16,
  },
  banner: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  bannerTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.primary,
    marginBottom: 4,
    textAlign: 'right',
  },
  bannerSubtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  groupCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 8,
  },
  groupHeader: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceAlt,
    paddingBottom: 8,
    marginBottom: 4,
    textAlign: 'right',
  },
  screenBtn: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  screenBtnText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  screenCodeName: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textSecondary,
  },
});
