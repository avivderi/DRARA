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
import { apiClient } from '../../services/apiClient';
import { colors, fonts } from '../../theme/tokens';

export interface MilestoneItem {
  id: string;
  title: string;
  targetDate: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  description: string;
}

interface RoadmapScreenProps {
  workspaceId?: string;
  ideaTitle?: string;
  partnerName?: string;
  onBackPress: () => void;
  onNavigateSubTab?: (tab: WorkspaceTabType) => void;
}

const SAMPLE_MILESTONES: MilestoneItem[] = [
  {
    id: 'm1',
    title: 'אבן דרך 1: NFC Handshake Protocol & Security Verification',
    targetDate: 'אוגוסט 2026',
    status: 'completed',
    description: 'השלמת פיתוח HMAC Challenge/Response ואינטגרציית DB ב-Module 4.',
  },
  {
    id: 'm2',
    title: 'אבן דרך 2: השלמת 49 מסכי האפליקציה ב-React Native',
    targetDate: 'ספטמבר 2026',
    status: 'in_progress',
    description: 'בנייה ואינטגרציה של כל קבוצות המסכים 1-6 עם תמיכת RTL מלאה.',
  },
  {
    id: 'm3',
    title: 'אבן דרך 3: השקת Beta סגורה ליזמים ראשונים',
    targetDate: 'אוקטובר 2026',
    status: 'upcoming',
    description: 'הפצת ה-MVP ל-50 מייסדים ראשונים ובחינת מנוע המאצ\'ים.',
  },
];

export const RoadmapScreen: React.FC<RoadmapScreenProps> = ({
  workspaceId,
  ideaTitle = 'מיזם',
  partnerName = 'שותף',
  onBackPress,
  onNavigateSubTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<WorkspaceTabType>('roadmap');
  const [milestones, setMilestones] = useState<MilestoneItem[]>(SAMPLE_MILESTONES);

  useEffect(() => {
    if (workspaceId) {
      let isMounted = true;
      apiClient
        .get<Record<string, unknown>>(`/workspaces/${workspaceId}/roadmap`)
        .then((res) => {
          if (!isMounted) return;
          const raw = res?.['data'] ?? res;
          if (Array.isArray(raw) && raw.length > 0) {
            setMilestones(
              raw.map((item: unknown) => {
                const m = item as Record<string, unknown>;
                const rawStatus = String(m['status'] ?? 'upcoming');
                const status: 'completed' | 'in_progress' | 'upcoming' =
                  rawStatus === 'completed' || rawStatus === 'in_progress' ? rawStatus : 'upcoming';
                return {
                  id: String(m['id'] ?? 'm'),
                  title: String(m['title'] ?? ''),
                  targetDate: String(m['target_date'] ?? m['targetDate'] ?? '2026'),
                  status,
                  description: String(m['description'] ?? ''),
                };
              }),
            );
          }
        })
        .catch(() => {
          // Keep sample milestones fallback if workspace endpoint fails
        });

      return () => {
        isMounted = false;
      };
    }
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
        <Text style={styles.subtitle}>מפת הדרכים ואבני הדרך המרכזיות להשקת המיזם (Roadmap)</Text>

        <View style={styles.timeline}>
          {milestones.map((m) => (
            <View key={m.id} style={styles.milestoneCard}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.statusBadge,
                    m.status === 'completed'
                      ? styles.completedBadge
                      : m.status === 'in_progress'
                      ? styles.inProgressBadge
                      : styles.upcomingBadge,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {m.status === 'completed'
                      ? '✓ הושלם'
                      : m.status === 'in_progress'
                      ? '⚡ בתהליך'
                      : '📅 מתוכנן'}
                  </Text>
                </View>
                <Text style={styles.targetDate}>{m.targetDate}</Text>
              </View>

              <Text style={styles.title}>{m.title}</Text>
              <Text style={styles.desc}>{m.description}</Text>
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
  timeline: {
    gap: 14,
  },
  milestoneCard: {
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
  targetDate: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  completedBadge: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
  },
  inProgressBadge: {
    backgroundColor: '#FFF8E6',
    borderColor: '#E6A100',
  },
  upcomingBadge: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  statusText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.textPrimary,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 4,
  },
  desc: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'right',
  },
});
