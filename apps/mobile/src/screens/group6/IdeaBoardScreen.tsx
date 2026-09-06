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

export interface BoardTask {
  id: string;
  title: string;
  assignee: string;
  status: 'todo' | 'in_progress' | 'done';
}

interface IdeaBoardScreenProps {
  ideaTitle?: string;
  partnerName?: string;
  onBackPress: () => void;
  onNavigateSubTab?: (tab: WorkspaceTabType) => void;
}

const SAMPLE_TASKS: BoardTask[] = [
  { id: 't1', title: 'הקמת תשתית Docker & CI/CD', assignee: 'תשתיות', status: 'in_progress' },
  { id: 't2', title: 'אפיון מסכי האפליקציה ב-React Native', assignee: 'מוצר', status: 'done' },
  { id: 't3', title: 'אינטגרציה ל-Embedding API', assignee: 'Backend', status: 'done' },
  { id: 't4', title: 'בדיקת תאימות NFC', assignee: 'Mobile', status: 'todo' },
];

export const IdeaBoardScreen: React.FC<IdeaBoardScreenProps> = ({
  ideaTitle = 'מיזם',
  partnerName = 'שותף',
  onBackPress,
  onNavigateSubTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<WorkspaceTabType>('idea_board');

  const handleSubTabChange = (tab: WorkspaceTabType) => {
    setActiveSubTab(tab);
    if (onNavigateSubTab) onNavigateSubTab(tab);
  };

  const todoTasks = SAMPLE_TASKS.filter((t) => t.status === 'todo');
  const inProgressTasks = SAMPLE_TASKS.filter((t) => t.status === 'in_progress');
  const doneTasks = SAMPLE_TASKS.filter((t) => t.status === 'done');

  return (
    <SafeAreaView style={styles.safeArea}>
      <WorkspaceHeader
        projectName={ideaTitle}
        coFounders={[{ name: partnerName }, { name: 'אביב דרי' }]}
        onBackPress={onBackPress}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🟡 בתהליך (In Progress - {inProgressTasks.length})</Text>
          {inProgressTasks.map((t) => (
            <View key={t.id} style={styles.taskCard}>
              <Text style={styles.taskTitle}>{t.title}</Text>
              <Text style={styles.taskAssignee}>👤 {t.assignee}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚪ לביצוע (To Do - {todoTasks.length})</Text>
          {todoTasks.map((t) => (
            <View key={t.id} style={styles.taskCard}>
              <Text style={styles.taskTitle}>{t.title}</Text>
              <Text style={styles.taskAssignee}>👤 {t.assignee}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🟢 הושלם (Done - {doneTasks.length})</Text>
          {doneTasks.map((t) => (
            <View key={t.id} style={[styles.taskCard, styles.doneCard]}>
              <Text style={[styles.taskTitle, styles.doneTitle]}>✓ {t.title}</Text>
              <Text style={styles.taskAssignee}>👤 {t.assignee}</Text>
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
    gap: 16,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  taskCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
  },
  doneCard: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
  },
  taskTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 4,
  },
  doneTitle: {
    color: colors.primary,
  },
  taskAssignee: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
});
