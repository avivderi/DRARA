import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { WorkspaceSubNav, WorkspaceTabType } from '../../components/layout/footers/WorkspaceSubNav';
import { WorkspaceHeader } from '../../components/layout/headers/WorkspaceHeader';
import { apiGet } from '../../services/apiClient';
import { colors, fonts } from '../../theme/tokens';

export interface DecisionItem {
  id: string;
  title: string;
  decisionDate: string;
  decidedBy: string;
  summary: string;
}

interface ApiDecision {
  id: string;
  title?: string;
  created_at?: string;
  created_by_name?: string;
  rationale?: string;
  summary?: string;
}

interface DecisionLogScreenProps {
  workspaceId?: string;
  ideaTitle?: string;
  partnerName?: string;
  onBackPress: () => void;
  onNavigateSubTab?: (tab: WorkspaceTabType) => void;
}

export const DecisionLogScreen: React.FC<DecisionLogScreenProps> = ({
  workspaceId = 'demo',
  ideaTitle = 'מיזם',
  partnerName = 'שותף',
  onBackPress,
  onNavigateSubTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<WorkspaceTabType>('decisions');
  const [decisions, setDecisions] = useState<DecisionItem[]>([]);

  useEffect(() => {
    apiGet<{ decisions: ApiDecision[] }>(`/workspaces/${workspaceId}/decisions`)
      .then((res) => {
        if (Array.isArray(res.decisions)) {
          const mapped: DecisionItem[] = res.decisions.map((d) => ({
            id: d.id,
            title: d.title || 'החלטת מייסדים',
            decisionDate: d.created_at ? new Date(d.created_at).toLocaleDateString('he-IL') : 'נרשם לאחרונה',
            decidedBy: d.created_by_name || 'המייסדים',
            summary: d.rationale || d.summary || '',
          }));
          setDecisions(mapped);
        }
      })
      .catch(() => {
        setDecisions([
          {
            id: 'd1',
            title: 'שימוש ב-Voyage AI (`voyage-3-lite`) עבור Embeddings',
            decisionDate: '06 ספטמבר 2026',
            decidedBy: 'אביב & אלון',
            summary: 'הוחלט לעבוד עם Voyage AI בשילוב pgvector לקבלת דירוג סמנטי יציב.',
          },
        ]);
      });
  }, [workspaceId]);



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
          {decisions.map((d) => (
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
