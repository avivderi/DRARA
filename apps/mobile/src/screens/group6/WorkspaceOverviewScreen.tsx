import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { WorkspaceSubNav, WorkspaceTabType } from '../../components/layout/footers/WorkspaceSubNav';
import { WorkspaceHeader } from '../../components/layout/headers/WorkspaceHeader';
import { colors, fonts } from '../../theme/tokens';

interface WorkspaceOverviewScreenProps {
  ideaTitle?: string;
  partnerName?: string;
  onBackPress: () => void;
  onNavigateSubTab?: (tab: WorkspaceTabType) => void;
}

export const WorkspaceOverviewScreen: React.FC<WorkspaceOverviewScreenProps> = ({
  ideaTitle = 'DRARA - Co-Founder Platform',
  partnerName = 'אלון מזרחי',
  onBackPress,
  onNavigateSubTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<WorkspaceTabType>('idea_board');

  const handleSubTabChange = (tab: WorkspaceTabType) => {
    setActiveSubTab(tab);
    if (onNavigateSubTab) onNavigateSubTab(tab);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <WorkspaceHeader
        projectName={ideaTitle}
        coFounders={[{ name: partnerName }, { name: 'אביב דרי' }]}
        onBackPress={onBackPress}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.statusBanner}>
          <Text style={styles.statusIcon}>🤝</Text>
          <Text style={styles.statusTitle}>שותפות מאומתת ב-NFC Handshake</Text>
          <Text style={styles.statusText}>
            מרחב עבודה משותף עבורך ועבור {partnerName}. כל ההחלטות, המשימות וה-Equity מתועדים במקום אחד.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📌 משימות דחופות (Active Sprint)</Text>
          
          <View style={styles.taskRow}>
            <Text style={styles.taskBadge}>פתוח</Text>
            <Text style={styles.taskText}>אפיון מודל האקוויטי (Vesting Timeline)</Text>
          </View>

          <View style={styles.taskRow}>
            <Text style={styles.taskBadge}>בתהליך</Text>
            <Text style={styles.taskText}>הקמת תשתית Docker & CI/CD מול GitHub</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 סיכום התקדמות המיזם</Text>
          
          <View style={styles.metricRow}>
            <Text style={styles.metricVal}>60%</Text>
            <Text style={styles.metricLab}>השלמת MVP</Text>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricVal}>4 שבועות</Text>
            <Text style={styles.metricLab}>זמן מבוקש להשקה</Text>
          </View>
        </View>
      </ScrollView>

      <WorkspaceSubNav activeTab={activeSubTab} onTabPress={handleSubTabChange} />
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
    gap: 14,
  },
  statusBanner: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  statusTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  statusText: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 12,
  },
  taskRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textPrimary,
  },
  taskBadge: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.primary,
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  metricRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricLab: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  metricVal: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primary,
  },
});
