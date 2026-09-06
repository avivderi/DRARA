// TODO: needs backend — Module 6 (Workspace)
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

export interface DecisionItem {
  id: string;
  title: string;
  decisionDate: string;
  decidedBy: string;
  summary: string;
}

interface DecisionLogScreenProps {
  ideaTitle?: string;
  partnerName?: string;
  onBackPress: () => void;
  onNavigateSubTab?: (tab: WorkspaceTabType) => void;
}

const SAMPLE_DECISIONS: DecisionItem[] = [
  {
    id: 'd1',
    title: 'שימוש ב-Voyage AI (`voyage-3-lite`) עבור Embeddings',
    decisionDate: '06 ספטמבר 2026',
    decidedBy: 'אביב & אלון',
    summary: 'הוחלט לעבוד עם Voyage AI בשילוב pgvector במימד 1024/512 לקבלת דירוג סמנטי יציב.',
  },
  {
    id: 'd2',
    title: 'חובת אימות NFC Handshake פיזי כתנאי ל-Workspace',
    decisionDate: '04 ספטמבר 2026',
    decidedBy: 'אביב & אלון',
    summary: 'אימות ב-HMAC Challenge/Response נדרש למניעת זיופים לפני פתיחת מרחב העבודה המשותף.',
  },
];

export const DecisionLogScreen: React.FC<DecisionLogScreenProps> = ({
  ideaTitle = 'DRARA - Co-Founder Platform',
  partnerName = 'אלון מזרחי',
  onBackPress,
  onNavigateSubTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<WorkspaceTabType>('decisions');

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
        <Text style={styles.subtitle}>יומן ההחלטות של המייסדים (Decision Log & Governance)</Text>

        <View style={styles.decisionsList}>
          {SAMPLE_DECISIONS.map((d) => (
            <View key={d.id} style={styles.decisionCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.date}>{d.decisionDate}</Text>
                <Text style={styles.decidedBy}>נקבע ע&quot;י {d.decidedBy}</Text>
              </View>

              <Text style={styles.title}>{d.title}</Text>
              <Text style={styles.summary}>{d.summary}</Text>
            </View>
          ))}
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
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 16,
  },
  decisionsList: {
    gap: 14,
  },
  decisionCard: {
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
  decidedBy: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  date: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 4,
  },
  summary: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'right',
  },
});
